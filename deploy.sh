#!/bin/bash
set -e

IMAGE="europe-west2-docker.pkg.dev/rise-sandbox/pol-google-space-jsm-webhook/latest"

echo "🛠 Building Docker image..."
docker buildx build -t pol-google-space-jsm-webhook --platform=linux/amd64 .

echo "🐳 Tagging image..."
docker tag pol-google-space-jsm-webhook $IMAGE

echo "📤 Pushing image..."
docker push $IMAGE

echo "📦 Applying secrets and manifests..."
kubectl apply -f k8s/secrets.yaml -n pol-google-space-jsm-webhook
kubectl apply -f k8s/deployment.yaml -n pol-google-space-jsm-webhook
kubectl apply -f k8s/service.yaml -n pol-google-space-jsm-webhook

echo "🔁 Restarting deployment..."
kubectl rollout restart deployment pol-google-space-jsm-webhook -n pol-google-space-jsm-webhook

echo "✅ Deployed successfully!"