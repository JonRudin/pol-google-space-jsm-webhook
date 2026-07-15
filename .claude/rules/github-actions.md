---
paths:
    - ".github/**"
    - "deploy.sh"
---

# Deployment conventions

- Two deploy paths exist and must stay in sync: `.github/workflows/deploy.yaml` (push to `main`) and `deploy.sh` (manual). Both target the **`rise-sandbox`** GCP project/GKE cluster (`europe-west2`) and the `pol-google-space-jsm-webhook` namespace. If you change the image name, namespace, or region, update both.
- This is a sandbox target. Do not point it at prod projects without a deliberate decision.
- Authentication uses the `GCP_SA_KEY` repository secret — never echo, log, or commit its value.
- `deploy.sh` runs `kubectl apply -f k8s/secrets.yaml` — ensure `k8s/secrets.yaml` never contains real secret values in git (it should reference a template or be gitignored).
- Pin third-party GitHub Actions to a commit SHA or trusted tag.
