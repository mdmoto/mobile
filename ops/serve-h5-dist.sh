#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-5174}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist/build/h5"

if [[ ! -f "${DIST_DIR}/index.html" ]]; then
  echo "Missing ${DIST_DIR}/index.html. Run: npm run build:h5"
  exit 1
fi

echo "Serving ${DIST_DIR} on http://127.0.0.1:${PORT}/"
python3 -m http.server "${PORT}" --directory "${DIST_DIR}"
