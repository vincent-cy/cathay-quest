# Cathay Quest — App + Backend (Flask) + DynamoDB

This repo contains a React (Vite + TypeScript) frontend and a Python Flask backend exposing DynamoDB APIs for saving survey results.

## Quick Start

1) Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- AWS account with access to DynamoDB
- AWS CLI configured locally

2) Backend setup (Flask + DynamoDB)

```sh
# from repo root
cd src/dynamoDB

# (recommended) create and activate a virtual environment
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate

# install Python dependencies
pip install -r ../../requirements.txt
```

3) Configure AWS credentials

Make sure your AWS credentials are available so boto3 can authenticate:

```sh
aws configure
# Provide AWS Access Key ID, Secret Access Key, default region (e.g. ap-southeast-2), and output format
```

Alternatively, set environment variables before running the backend:

```sh
# Windows PowerShell
$Env:AWS_ACCESS_KEY_ID="YOUR_KEY_ID"
$Env:AWS_SECRET_ACCESS_KEY="YOUR_SECRET"
$Env:AWS_DEFAULT_REGION="ap-southeast-2"

# macOS/Linux
# export AWS_ACCESS_KEY_ID=YOUR_KEY_ID
# export AWS_SECRET_ACCESS_KEY=YOUR_SECRET
# export AWS_DEFAULT_REGION=ap-southeast-2
```

4) Create the DynamoDB table

Backend expects a table named `InitialSurvey` in region `ap-southeast-2`. Recommended key schema:

- Partition key: `userId` (String)
- Sort key: `timestamp` (String)

You can create it via AWS Console or with AWS CLI:

```sh
aws dynamodb create-table \
  --table-name InitialSurvey \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region ap-southeast-2
```

5) Run the backend

```sh
# from src/dynamoDB (virtualenv active)
python .\postSurvey.py
```

- Server runs at http://localhost:5000
- Health check: GET http://localhost:5000/health
- Root: GET http://localhost:5000/
- Save survey: POST http://localhost:5000/api/save-survey

Example request:

```bash
curl -X POST http://localhost:5000/api/save-survey \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "userName": "Alex",
    "email": "alex@example.com",
    "responses": {"q1":"yes","q2":"no"}
  }'
```

6) Frontend setup (Vite + React + TypeScript)

```sh
# from repo root
npm i
npm run dev
```

- Frontend runs at http://localhost:5173
- When calling the backend from the frontend during local development, use `http://localhost:5000` as the API base (CORS is enabled in the Flask app).

7) Run both together (local dev)

- Start backend: http://localhost:5000
- Start frontend: http://localhost:5173

Confirm the backend is healthy:

```bash
curl http://localhost:5000/health
```

Then interact with the app at http://localhost:5173, which should POST to the backend endpoint at http://localhost:5000/api/save-survey.

## Troubleshooting

- DynamoDB AccessDenied: Verify AWS credentials and IAM permissions for DynamoDB PutItem on `InitialSurvey`.
- Table not found: Ensure table `InitialSurvey` exists in region `ap-southeast-2` (or update `AWS_REGION` and `DYNAMODB_TABLE_NAME` in `src/dynamoDB/postSurvey.py`).
- CORS issues: The Flask app enables CORS via `flask-cors`. Ensure you are hitting `http://localhost:5000` from the frontend.
- Port conflicts: Change ports or stop conflicting processes (frontend default 5173, backend 5000).



**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

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
- AWS
- Flask
- OpenRouter


## Frontend install and run (npm or Yarn)

Use either npm or Yarn to install and launch the frontend.

Using npm:

```bash
npm install
npm run dev
```

Using Yarn:

```bash
yarn
yarn dev
```

The app will be available at http://localhost:5173.

Optional: to temporarily share your local app, you can use ngrok without adding scripts:

```bash
# expose Vite dev server (port 5173)
npx ngrok http 5173
```
