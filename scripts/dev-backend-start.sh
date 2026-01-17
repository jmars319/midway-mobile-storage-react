#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-backend-start.sh
Starts the PHP backend and waits for /api/health.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

PID_FILE="$PID_DIR/backend.pid"
LOG_FILE="$LOG_DIR/backend.log"

require_cmd php
require_cmd curl

if [ -f "$PID_FILE" ]; then
  existing_pid=$(cat "$PID_FILE" 2>/dev/null || true)
  if is_pid_running "$existing_pid"; then
    log_warn "Backend already running (pid $existing_pid)."
    exit 0
  fi
  ensure_pidfile_cleared "$PID_FILE"
fi

if is_port_in_use "$BACKEND_PORT"; then
  die "Port $BACKEND_PORT is already in use."
fi

log_info "Starting PHP backend on $BACKEND_BASE_URL"
(
  cd "$BACKEND_DIR"
  php -S "${BACKEND_HOST}:${BACKEND_PORT}" -t "$BACKEND_DIR" "$BACKEND_DIR/api/router.php" >> "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
)

if wait_for_url "$BACKEND_HEALTH_URL" "$WAIT_TIMEOUT_SECONDS" "$WAIT_INTERVAL_SECONDS"; then
  log_success "Backend healthy at $BACKEND_HEALTH_URL"
else
  log_error "Backend did not become healthy in time. Check $LOG_FILE"
  exit 1
fi
