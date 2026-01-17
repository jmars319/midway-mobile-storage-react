#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-start.sh
Starts backend then frontend and verifies health.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

log_info "Starting backend then frontend"
"$SCRIPT_DIR/dev-backend-start.sh"
"$SCRIPT_DIR/dev-frontend-start.sh"

if wait_for_url "$BACKEND_HEALTH_URL" "$WAIT_TIMEOUT_SECONDS" "$WAIT_INTERVAL_SECONDS"; then
  log_success "Backend health check passed"
else
  log_warn "Backend health check failed"
fi

if wait_for_url "$FRONTEND_BASE_URL" "$WAIT_TIMEOUT_SECONDS" "$WAIT_INTERVAL_SECONDS"; then
  log_success "Frontend reachable"
else
  log_warn "Frontend not reachable"
fi
