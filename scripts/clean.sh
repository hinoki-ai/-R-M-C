#!/usr/bin/env bash
set -euo pipefail

# Safe cleanup of build artifacts and caches (no app functionality removed)

echo "Cleaning ephemeral artifacts..."
rm -rf .next dist tsconfig.tsbuildinfo .next_pid dev.log .turbo 2>/dev/null || true

# Clean subproject caches
rm -rf radio-server/node_modules 2>/dev/null || true

# Do NOT remove root node_modules by default
if [[ "${1:-}" == "--all" ]]; then
  echo "--all flag detected: also removing root node_modules cache"
  rm -rf node_modules/.cache 2>/dev/null || true
fi

echo "Done."
