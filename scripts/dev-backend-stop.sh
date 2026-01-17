#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-backend-stop.sh
Stops the PHP backend using the pidfile.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

PID_FILE="$PID_DIR/backend.pid"

if [ ! -f "$PID_FILE" ]; then
  log_warn "Backend pidfile not found."
  exit 0
fi

pid=$(cat "$PID_FILE" 2>/dev/null || true)
if [ -z "$pid" ]; then
  log_warn "Backend pidfile empty."
  ensure_pidfile_cleared "$PID_FILE"
  exit 0
fi

if is_pid_running "$pid"; then
  log_info "Stopping backend (pid $pid)"
  kill "$pid" >/dev/null 2>&1 || true
  sleep 1
fi

if is_pid_running "$pid"; then
  log_warn "Backend pid $pid still running. Attempting force stop."
  kill -9 "$pid" >/dev/null 2>&1 || true
fi

ensure_pidfile_cleared "$PID_FILE"

if is_port_in_use "$BACKEND_PORT"; then
  log_warn "Port $BACKEND_PORT is still in use."
else
  log_success "Backend stopped."
fi
