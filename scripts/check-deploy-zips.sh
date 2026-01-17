#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/check-deploy-zips.sh
Validates the latest deploy zips in deploy/.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
# shellcheck source=script-utils.sh
source "$SCRIPT_DIR/script-utils.sh"

require_cmd zipinfo
require_cmd rg

DEPLOY_DIR="$ROOT_DIR"

frontend_zip="${FRONTEND_ZIP:-}"
backend_zip="${BACKEND_ZIP:-}"

if [ -z "$frontend_zip" ]; then
  frontend_zip="$DEPLOY_DIR/deploy-frontend.zip"
fi
if [ -z "$backend_zip" ]; then
  backend_zip="$DEPLOY_DIR/deploy-backend.zip"
fi

if [ -z "$frontend_zip" ] || [ ! -f "$frontend_zip" ]; then
  die "Frontend zip not found. Set FRONTEND_ZIP or run scripts/make-deploy-zips.sh"
fi
if [ -z "$backend_zip" ] || [ ! -f "$backend_zip" ]; then
  die "Backend zip not found. Set BACKEND_ZIP or run scripts/make-deploy-zips.sh"
fi

log_info "Checking frontend zip: $frontend_zip"
frontend_files=$(zipinfo -1 "$frontend_zip")

echo "$frontend_files" | rg -q "^index.html$" || die "Frontend zip missing index.html"
echo "$frontend_files" | rg -q "^assets/" || die "Frontend zip missing assets/"
log_success "Frontend zip looks good"

log_info "Checking backend zip: $backend_zip"
backend_files=$(zipinfo -1 "$backend_zip")

echo "$backend_files" | rg -q "^api/router.php$" || die "Backend zip missing api/router.php"
echo "$backend_files" | rg -q "^api/health.php$" || die "Backend zip missing api/health.php"
echo "$backend_files" | rg -q "^api/\.htaccess$" || die "Backend zip missing api/.htaccess"
echo "$backend_files" | rg -q "^utils.php$" || die "Backend zip missing utils.php"
echo "$backend_files" | rg -q "^config.example.php$" || die "Backend zip missing config.example.php"
echo "$backend_files" | rg -q "^uploads/media.json$" || die "Backend zip missing uploads/media.json"
echo "$backend_files" | rg -q "^storage/\.htaccess$" || die "Backend zip missing storage/.htaccess"

log_success "Backend zip looks good"
log_success "Deploy zip checks complete"
