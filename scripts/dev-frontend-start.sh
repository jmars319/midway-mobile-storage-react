#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-frontend-start.sh
Starts the Vite frontend and waits for readiness.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

PID_FILE="$PID_DIR/frontend.pid"
LOG_FILE="$LOG_DIR/frontend.log"

require_cmd npm
require_cmd curl

if [ -f "$PID_FILE" ]; then
  existing_pid=$(cat "$PID_FILE" 2>/dev/null || true)
  if is_pid_running "$existing_pid"; then
    log_warn "Frontend already running (pid $existing_pid)."
    exit 0
  fi
  ensure_pidfile_cleared "$PID_FILE"
fi

if is_port_in_use "$FRONTEND_PORT"; then
  die "Port $FRONTEND_PORT is already in use."
fi

if [ -z "${VITE_API_BASE:-}" ] && ! frontend_env_has_api_base; then
  export VITE_API_BASE="$DEFAULT_VITE_API_BASE"
  log_warn "VITE_API_BASE not set. Using $VITE_API_BASE for this session."
fi

log_info "Starting Vite frontend on $FRONTEND_BASE_URL"
(
  cd "$FRONTEND_DIR"
  npm run dev -- --host "$FRONTEND_HOST" --port "$FRONTEND_PORT" --strictPort >> "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
)

if wait_for_url "$FRONTEND_BASE_URL" "$WAIT_TIMEOUT_SECONDS" "$WAIT_INTERVAL_SECONDS"; then
  log_success "Frontend ready at $FRONTEND_BASE_URL"
else
  log_error "Frontend did not become ready in time. Check $LOG_FILE"
  exit 1
fi
