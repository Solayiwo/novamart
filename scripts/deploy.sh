#!/usr/bin/env bash
# Usage: IMAGE_TAG=<commit sha> GITHUB_REPOSITORY=<owner/repo> ./scripts/deploy.sh <namespace> <replicas>
set -euo pipefail

NS="${1:?namespace required}"
REPLICAS="${2:-1}"
: "${IMAGE_TAG:?IMAGE_TAG required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY required}"

REPO_LC="${GITHUB_REPOSITORY,,}"
SERVICES=(product-service auth-service order-service payment-service)
CLUSTER_NAME="$(kind get clusters | head -n1)"

kubectl create namespace "$NS" --dry-run=client -o yaml | kubectl apply -f -

for SVC in "${SERVICES[@]}"; do
  IMAGE="ghcr.io/${REPO_LC}/${SVC}:${IMAGE_TAG}"
  echo "==> Deploying ${IMAGE} to namespace ${NS}"
  docker pull "$IMAGE"
  kind load docker-image "$IMAGE" --name "$CLUSTER_NAME"
  export SERVICE="$SVC" IMAGE REPLICAS
  envsubst '${SERVICE} ${IMAGE} ${REPLICAS}' < k8s/service.tmpl.yaml | kubectl apply -n "$NS" -f -
done

for SVC in "${SERVICES[@]}"; do
  kubectl rollout status "deployment/${SVC}" -n "$NS" --timeout=180s
done

echo "==> Cluster state"
kubectl get deployments,pods,svc -n "$NS"

echo "==> Smoke tests"
PORT=18080
for SVC in "${SERVICES[@]}"; do
  kubectl port-forward -n "$NS" "svc/${SVC}" "${PORT}:80" >/dev/null 2>&1 &
  PF=$!
  sleep 3
  echo -n "${SVC}: "
  curl -fsS "http://localhost:${PORT}/health"
  echo
  kill "$PF" 2>/dev/null || true
  wait "$PF" 2>/dev/null || true
  PORT=$((PORT + 1))
done
echo "==> Deployment to ${NS} verified"
