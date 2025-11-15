# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8fd82166-ad15-41d0-8309-2e773783d008

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8fd82166-ad15-41d0-8309-2e773783d008) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8fd82166-ad15-41d0-8309-2e773783d008) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Using ngrok to expose the local dev server

If you want to access your local Vite app from another device (phone, tablet, remote machine) you can use ngrok to create a secure public URL that tunnels to your local server.

1. Install ngrok as a dev dependency (preferred) or run with npx:

```bash
# install locally (recommended)
npm install --save-dev ngrok

# OR use npx without installing
# (npx is available with npm >= 5.2)
```

2. Add an npm script to your package.json (example):

```json
// add to "scripts" in package.json
"ngrok": "node ./scripts/start-ngrok.js"
```

3. Optionally set your ngrok auth token (recommended so you avoid rate limits):

```bash
export NGROK_AUTHTOKEN=your_ngrok_authtoken_here
# or on Windows PowerShell:
# $Env:NGROK_AUTHTOKEN = "your_ngrok_authtoken_here"
```

4. Start your dev server (default port used by the project is 8080):

```bash
npm run dev
```

5. In a separate terminal, run the ngrok helper:

```bash
# if you added the script above
npm run ngrok

# OR without adding the script, you can run directly:
# npx ngrok http 8080 --log=stdout
```

The helper will print the public ngrok URL (https://xxxx.ngrok.io). Open that URL on another device to access your local app.

### Run dev server + ngrok in one terminal

You can run both the Vite dev server and ngrok from a single terminal by using the helper script included in ./scripts/dev-with-ngrok.js.

1. (Optional) install the ngrok package so the helper uses the programmatic API:
```bash
npm install --save-dev ngrok
```

2. (Optional) add an npm script to package.json:
```json
// add to "scripts"
"dev:ngrok": "node ./scripts/dev-with-ngrok.js"
```

3. Start the combined process:
```bash
# if you added the npm script:
npm run dev:ngrok

# OR directly:
node ./scripts/dev-with-ngrok.js
```

Notes
- The helper runs your normal dev script (`npm run dev`) by default. If you prefer to run `npx vite` directly, set USE_VITE_CLI=1 in the environment.
- Provide NGROK_AUTHTOKEN in the environment to avoid rate limits:
  export NGROK_AUTHTOKEN=<your-token>
