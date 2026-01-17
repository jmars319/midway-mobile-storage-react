#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-verify.sh
Runs a start/health/restart/stop smoke test.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

log_info "Running full dev stack verification"
"$SCRIPT_DIR/dev-start.sh"
"$SCRIPT_DIR/dev-status.sh"
"$SCRIPT_DIR/dev-restart.sh"
"$SCRIPT_DIR/dev-status.sh"
"$SCRIPT_DIR/dev-stop.sh"
log_success "Dev verification complete"
