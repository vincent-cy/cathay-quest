#!/usr/bin/env node
// Minimal helper to start ngrok for the local dev server (default port 8080).
// Tries to use the local `ngrok` package if installed, otherwise falls back to `npx ngrok`.

const port = process.env.PORT || 8080;

(async () => {
  try {
    // Try to use installed ngrok package first
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ngrok = require('ngrok');
    const authtoken = process.env.NGROK_AUTHTOKEN || undefined;
    console.log(`Starting ngrok tunnel to http://localhost:${port}...`);
    const url = await ngrok.connect({ addr: Number(port), authtoken });
    console.log(`ngrok tunnel established: ${url}`);
    console.log('Press Ctrl+C to stop the tunnel.');
    // Keep the process alive while ngrok runs
  } catch (err) {
    // Fallback to npx ngrok if package not installed
    console.log('Local ngrok package not found — falling back to `npx ngrok` (requires npm).');
    const { spawn } = require('child_process');
    const args = ['ngrok', 'http', String(port), '--log=stdout'];
    if (process.env.NGROK_AUTHTOKEN) {
      args.push('--authtoken', process.env.NGROK_AUTHTOKEN);
    }
    const child = spawn('npx', args, { stdio: ['inherit', 'pipe', 'inherit'] });

    child.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);
      // try to capture the forwarded HTTPS url from ngrok output
      const m = text.match(/https:\/\/[0-9a-zA-Z.-]+\.ngrok\.io/);
      if (m) {
        console.log(`ngrok public URL: ${m[0]}`);
      }
    });

    child.on('close', (code) => {
      process.exit(code);
    });
  }
})();
