#!/usr/bin/env node
/**
 * Start the local dev server and ngrok together in one terminal.
 * Usage:
 *  - Ensure dependencies installed: npm i
 *  - Optional: set NGROK_AUTHTOKEN env var
 *  - Run: node ./scripts/dev-with-ngrok.js
 *
 * The script spawns `npm run dev` (so it uses your package.json dev script).
 * If you prefer running `npx vite` directly, set USE_VITE_CLI=1 in the env.
 */

import { spawn } from "child_process";
import net from "net";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const HOST = "127.0.0.1";
const USE_VITE_CLI = !!process.env.USE_VITE_CLI; // optional flag to use npx vite

function waitForPort(port, host, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function tryConnect() {
      const sock = new net.Socket();
      sock.setTimeout(1000);
      sock.once("connect", () => {
        sock.destroy();
        resolve();
      });
      sock.once("error", () => {
        sock.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error("Timeout waiting for port"));
        } else {
          setTimeout(tryConnect, 300);
        }
      });
      sock.once("timeout", () => {
        sock.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error("Timeout waiting for port"));
        } else {
          setTimeout(tryConnect, 300);
        }
      });
      sock.connect(port, host);
    })();
  });
}

function spawnForwarded(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { stdio: ["inherit", "pipe", "pipe"], ...opts });
  child.stdout.on("data", (d) => process.stdout.write(d));
  child.stderr.on("data", (d) => process.stderr.write(d));
  return child;
}

async function start() {
  console.log(`Starting dev server (port ${PORT})...`);

  // Start dev server
  const devCmd = USE_VITE_CLI ? "npx" : "npm";
  const devArgs = USE_VITE_CLI ? ["vite", "--host", "--port", String(PORT)] : ["run", "dev"];
  const dev = spawnForwarded(devCmd, devArgs, { env: { ...process.env, PORT: String(PORT) } });

  // When parent receives termination, forward to children
  let ngrokChild = null;
  const cleanup = () => {
    try { dev.kill("SIGINT"); } catch (e) {}
    try { ngrokChild && ngrokChild.kill("SIGINT"); } catch (e) {}
    process.exit();
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  // Wait for port
  try {
    await waitForPort(PORT, HOST, 30000);
  } catch (err) {
    console.error(`Dev server did not become ready on ${HOST}:${PORT} in time.`);
    console.error("You can still start ngrok manually once the server is ready.");
    return;
  }

  console.log(`Dev server ready on http://${HOST}:${PORT}. Starting ngrok...`);

  // Try using local ngrok package, otherwise fallback to npx
  try {
    // dynamic import works in ESM projects
    const ngrokMod = await import("ngrok");
    const ngrok = ngrokMod.default ?? ngrokMod;
    const authtoken = process.env.NGROK_AUTHTOKEN || undefined;
    const url = await ngrok.connect({ addr: PORT, authtoken });
    console.log(`ngrok tunnel established: ${url}`);
    console.log("Press Ctrl+C to stop dev server and ngrok.");
    process.on("exit", async () => {
      try { await ngrok.disconnect(); await ngrok.kill(); } catch (e) {}
    });
  } catch (e) {
    // fallback to npx ngrok
    console.log("ngrok package not installed locally — falling back to `npx ngrok` (requires npm).");
    const args = ["ngrok", "http", String(PORT), "--log=stdout"];
    if (process.env.NGROK_AUTHTOKEN) {
      args.push("--authtoken", process.env.NGROK_AUTHTOKEN);
    }
    ngrokChild = spawnForwarded("npx", args, { env: process.env });

    // try to capture the public URL from ngrok stdout lines
    ngrokChild.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      const m = text.match(/(https?:\/\/[0-9a-zA-Z.-]+\.ngrok\.io)/);
      if (m) {
        console.log(`ngrok public URL: ${m[1]}`);
      }
    });

    ngrokChild.on("close", (code) => {
      console.log(`ngrok process exited with code ${code}`);
    });
  }

  // Keep this script alive while children run
}

start().catch((err) => {
  console.error("Error in dev-with-ngrok script:", err);
  process.exit(1);
});
