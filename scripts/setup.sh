#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

if ! command -v yarn >/dev/null 2>&1; then
  echo "Error: yarn is not installed. Please install it before running this script." >&2
  exit 1
fi

yarn install --frozen-lockfile

echo "All dependencies installed successfully."
