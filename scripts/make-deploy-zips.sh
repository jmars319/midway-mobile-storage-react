#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/make-deploy-zips.sh
Creates versioned frontend and backend deploy zips.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
# shellcheck source=script-utils.sh
source "$SCRIPT_DIR/script-utils.sh"

require_cmd npm
require_cmd zip
require_cmd rsync

DEPLOY_DIR="$ROOT_DIR"
STAGING_DIR="$DEPLOY_DIR/.staging"
FRONTEND_ZIP="${FRONTEND_ZIP:-$DEPLOY_DIR/deploy-frontend.zip}"
BACKEND_ZIP="${BACKEND_ZIP:-$DEPLOY_DIR/deploy-backend.zip}"

FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"

mkdir -p "$DEPLOY_DIR" "$STAGING_DIR"

log_info "Building frontend"
( cd "$FRONTEND_DIR" && npm run build )
log_success "Frontend build complete"

log_info "Packaging frontend zip: $FRONTEND_ZIP"
rm -f "$FRONTEND_ZIP"
(
  cd "$FRONTEND_DIR/dist"
  zip -r "$FRONTEND_ZIP" . -x "*.DS_Store" >/dev/null
)
log_success "Frontend zip created"

log_info "Staging backend files"
rm -rf "$STAGING_DIR/backend"
mkdir -p "$STAGING_DIR/backend"

rsync -a \
  --exclude ".git" \
  --exclude ".cache" \
  --exclude ".tmp" \
  --exclude ".DS_Store" \
  --exclude "node_modules" \
  --exclude ".env" \
  --exclude "config.php" \
  --exclude "*.log" \
  --exclude "uploads" \
  --exclude "storage" \
  --exclude "*.zip" \
  "$BACKEND_DIR/" "$STAGING_DIR/backend/"

mkdir -p "$STAGING_DIR/backend/uploads" "$STAGING_DIR/backend/storage" "$STAGING_DIR/backend/storage/submissions"

if [ -f "$BACKEND_DIR/uploads/media.json" ]; then
  cp "$BACKEND_DIR/uploads/media.json" "$STAGING_DIR/backend/uploads/"
else
  printf "{}\n" > "$STAGING_DIR/backend/uploads/media.json"
fi
if [ -f "$BACKEND_DIR/uploads/.gitkeep" ]; then
  cp "$BACKEND_DIR/uploads/.gitkeep" "$STAGING_DIR/backend/uploads/"
fi
if [ -f "$BACKEND_DIR/storage/.htaccess" ]; then
  cp "$BACKEND_DIR/storage/.htaccess" "$STAGING_DIR/backend/storage/"
fi
if [ -f "$BACKEND_DIR/storage/.gitkeep" ]; then
  cp "$BACKEND_DIR/storage/.gitkeep" "$STAGING_DIR/backend/storage/"
fi
if [ -f "$BACKEND_DIR/storage/submissions/.gitkeep" ]; then
  mkdir -p "$STAGING_DIR/backend/storage/submissions"
  cp "$BACKEND_DIR/storage/submissions/.gitkeep" "$STAGING_DIR/backend/storage/submissions/"
fi

if [ -f "$BACKEND_DIR/config.php" ]; then
  log_warn "Skipping backend/config.php in backend zip. Copy config.example.php and set production values on deploy."
else
  log_warn "config.php not found. Using config.example.php only."
fi

log_info "Packaging backend zip: $BACKEND_ZIP"
rm -f "$BACKEND_ZIP"
(
  cd "$STAGING_DIR/backend"
  zip -r "$BACKEND_ZIP" . -x "*.DS_Store" >/dev/null
)
log_success "Backend zip created"

log_success "Deploy zips ready in $DEPLOY_DIR"
