#!/bin/bash
set -e

IMAGE="europe-west2-docker.pkg.dev/rise-sandbox/google-space-jsm-webhook-poc/latest"

echo "🛠 Building Docker image..."
docker buildx build -t google-space-jsm-webhook-poc --platform=linux/amd64 .

echo "🐳 Tagging image..."
docker tag google-space-jsm-webhook-poc $IMAGE

echo "📤 Pushing image..."
docker push $IMAGE

echo "📦 Applying secrets and manifests..."
kubectl apply -f k8s/secrets.yaml -n google-space-jsm-webhook-poc
kubectl apply -f k8s/deployment.yaml -n google-space-jsm-webhook-poc
kubectl apply -f k8s/service.yaml -n google-space-jsm-webhook-poc

echo "🔁 Restarting deployment..."
kubectl rollout restart deployment google-space-jsm-webhook-poc -n google-space-jsm-webhook-poc

echo "✅ Deployed successfully!"