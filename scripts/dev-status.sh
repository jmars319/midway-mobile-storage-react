#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-status.sh
Shows running status for backend and frontend.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

backend_pid=""
frontend_pid=""

if [ -f "$PID_DIR/backend.pid" ]; then
  backend_pid=$(cat "$PID_DIR/backend.pid" 2>/dev/null || true)
fi
if [ -f "$PID_DIR/frontend.pid" ]; then
  frontend_pid=$(cat "$PID_DIR/frontend.pid" 2>/dev/null || true)
fi

if [ -n "$backend_pid" ] && is_pid_running "$backend_pid"; then
  log_success "Backend running (pid $backend_pid, port $BACKEND_PORT)"
else
  log_warn "Backend not running"
fi

if [ -n "$frontend_pid" ] && is_pid_running "$frontend_pid"; then
  log_success "Frontend running (pid $frontend_pid, port $FRONTEND_PORT)"
else
  log_warn "Frontend not running"
fi
