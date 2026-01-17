#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-verify-admin-api.sh
Requires ADMIN_USERNAME and ADMIN_PASSWORD to verify admin endpoints.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

require_cmd curl
require_cmd python3

if [ -z "${ADMIN_USERNAME:-}" ] || [ -z "${ADMIN_PASSWORD:-}" ]; then
  log_warn "ADMIN_USERNAME and ADMIN_PASSWORD are required for admin API verification."
  log_warn "Skipping admin API checks."
  exit 0
fi

log_info "Logging into admin API at $BACKEND_API_URL/auth/login"
login_response=$(curl -fsS -X POST \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}" \
  "$BACKEND_API_URL/auth/login")

admin_token=$(printf "%s" "$login_response" | python3 -c "import json,sys; print(json.load(sys.stdin)['token'])")

if [ -z "$admin_token" ]; then
  die "Failed to retrieve admin token."
fi

log_success "Authenticated admin API"

endpoints=(
  "admin/stats"
  "quotes"
  "messages"
  "applications"
  "orders"
  "inventory"
  "settings"
)

for endpoint in "${endpoints[@]}"; do
  log_info "Checking /$endpoint"
  curl -fsS -H "Authorization: Bearer $admin_token" "$BACKEND_API_URL/$endpoint" >/dev/null
  log_success "Endpoint /$endpoint ok"
done

log_success "Admin API verification complete"
