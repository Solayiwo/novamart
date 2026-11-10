#!/usr/bin/env bash
# Installs dependencies (creates package-lock.json) and runs the tests for every service.
set -euo pipefail
for SVC in product-service auth-service order-service payment-service; do
  echo "==> ${SVC}"
  (cd "services/${SVC}" && npm install && npm test)
done
echo "Done. Commit the generated package-lock.json files."
