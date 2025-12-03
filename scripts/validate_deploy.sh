#!/usr/bin/env bash
# Quick validator to run before uploading `frontend/dist/` to production
# - Ensures `index.html` references `/assets/index-...` and not `/src/main.jsx`
# - Ensures referenced assets exist in `dist/assets/`

set -euo pipefail
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
DIST_DIR="$ROOT_DIR/frontend/dist"

if [ ! -d "$DIST_DIR" ]; then
  echo "ERROR: dist directory not found: $DIST_DIR" >&2
  exit 2
fi

INDEX_FILE="$DIST_DIR/index.html"
if [ ! -f "$INDEX_FILE" ]; then
  echo "ERROR: missing $INDEX_FILE" >&2
  exit 2
fi

echo "Checking $INDEX_FILE for production bundle references..."
if grep -q '/src/main.jsx' "$INDEX_FILE"; then
  echo "ERROR: index.html contains a dev import (/src/main.jsx). Do a production build and upload the built index.html from dist/." >&2
  exit 3
fi

ASSETS=$(grep -oE '/assets/[^"\'>]+' "$INDEX_FILE" | sort -u)
if [ -z "$ASSETS" ]; then
  echo "WARNING: No assets referenced in index.html (unexpected)." >&2
else
  echo "Found asset references:" 
  echo "$ASSETS"
  MISSING=0
  for a in $ASSETS; do
    path="$DIST_DIR${a}"
    if [ ! -f "$path" ]; then
      echo "  MISSING: $a" >&2
      MISSING=1
    else
      echo "  ok: $a"
    fi
  done
  if [ $MISSING -eq 1 ]; then
    echo "ERROR: One or more referenced assets are missing from dist/assets/." >&2
    exit 4
  fi
fi

echo "Validation passed — index.html references production assets and all assets exist." 
exit 0
