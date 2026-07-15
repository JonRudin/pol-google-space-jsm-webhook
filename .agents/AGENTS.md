# AGENTS.md

This file provides guidance to AI developer agents when working with code in this repository.

> **Status: POC.** This is a proof-of-concept forwarder (local dir `google-space-jsm-webhook-poc`; package/repo name `pol-google-space-jsm-webhook`). Keep changes proportionate — it is not yet a hardened production service.

## What this repo is

A small **Express (TypeScript) webhook service** that receives **JSM / OpsGenie alert** payloads and forwards them as formatted messages to the correct team's **Google Chat** space for the Payment Orchestration Layer (POL) team.

- Listens on `POST /incoming-alert`.
- **Routing**: inspects the alert `description` for team markers (`@slack-pol-reward-alerts-prod`, `-finance-`, `-platform-`, `-inbound-`, `-rec-`, `-cards-`, `-bacs-`) and picks the matching team webhook env var, falling back to `googleChatUrl`.
- **Status colouring** by `action`: 🟢 `close`, 🟠 `acknowledge`/`addnote`, 🔴 otherwise (triggered).
- Rejects payloads with no `alert.message` (`400`).

## Repo structure

```
googleSpaceForwarder.ts   # The whole service — Express app, routing, Chat forwarding
k8s/                      # Kubernetes manifests (deployment.yaml, service.yaml, secrets.yaml)
Dockerfile                # Container build
deploy.sh                 # Manual build + push + kubectl apply to the sandbox cluster
.github/workflows/        # deploy.yaml — build + deploy to GCP sandbox on push to main
```

## Key commands

```bash
npm install         # Install dependencies
npm start           # Run once with tsx (googleSpaceForwarder.ts)
npm run dev         # Watch mode via nodemon + tsx
```

`ngrok` is a dependency for exposing the local server to receive real JSM webhooks during testing.

## Configuration / secrets

Config comes from environment variables (loaded via `dotenv` locally; a k8s secret in-cluster):

- `googleChatUrl` — default/fallback Google Chat webhook URL
- `JSMOpenAlertsUrl` — JSM open-alerts URL
- Per-team webhooks: `webhookReward`, `webhookFinance`, `webhookPlatform`, `webhookInbound`, `webhookRec`, `webhookCards`, `webhookBacs`

**Never commit real webhook URLs or secrets.** Keep them in `.env` locally (gitignored) and in the k8s secret in-cluster.

## Deployment

- `.github/workflows/deploy.yaml` — on push to `main`, builds the image, pushes to Artifact Registry (`europe-west2-docker.pkg.dev/rise-sandbox/...`), and rolls the deployment in the `pol-google-space-jsm-webhook` namespace on the `rise-sandbox` GKE cluster.
- `deploy.sh` — the manual equivalent (buildx → tag → push → `kubectl apply` secrets/deployment/service → restart).

This is a **sandbox** deployment.

## Code conventions

- **UK English** in docs, comments, and identifiers where natural.
- Prefer `async/await`; `const` by default.
- The team-routing marker list is business logic — keep it in one place and comment *why* a marker maps to a space if it is not obvious.
- Validate/narrow untyped JSM payload fields (`alert`, `responders`, `note`, `description`) before use.
- Keep the service small and single-purpose.

## Git & PR workflow

- Never commit directly to the default branch (`main`); branch first and land changes via a reviewed PR (a Claude PreToolUse hook enforces this).
- Keep PRs small and single-purpose; the description explains _why_, not _what_.
