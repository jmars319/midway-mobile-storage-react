#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=script-utils.sh
source "$SCRIPT_DIR/script-utils.sh"

CONFIG_FILE="$SCRIPT_DIR/dev-config.sh"
if [ -f "$CONFIG_FILE" ]; then
  # shellcheck source=dev-config.sh
  source "$CONFIG_FILE"
fi

BACKEND_DIR="${BACKEND_DIR:-$ROOT_DIR/backend}"
FRONTEND_DIR="${FRONTEND_DIR:-$ROOT_DIR/frontend}"
BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_HOST="${FRONTEND_HOST:-127.0.0.1}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

PID_DIR="${PID_DIR:-$SCRIPT_DIR/.pids}"
LOG_DIR="${LOG_DIR:-$SCRIPT_DIR/.logs}"
WAIT_TIMEOUT_SECONDS="${WAIT_TIMEOUT_SECONDS:-30}"
WAIT_INTERVAL_SECONDS="${WAIT_INTERVAL_SECONDS:-1}"

BACKEND_BASE_URL="${BACKEND_BASE_URL:-http://${BACKEND_HOST}:${BACKEND_PORT}}"
BACKEND_API_URL="${BACKEND_API_URL:-${BACKEND_BASE_URL}/api}"
BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-${BACKEND_API_URL}/health}"
FRONTEND_BASE_URL="${FRONTEND_BASE_URL:-http://${FRONTEND_HOST}:${FRONTEND_PORT}}"

DEFAULT_VITE_API_BASE="${DEFAULT_VITE_API_BASE:-$BACKEND_API_URL}"

mkdir -p "$PID_DIR" "$LOG_DIR"

is_pid_running() {
  local pid="$1"
  if [ -z "$pid" ]; then
    return 1
  fi
  kill -0 "$pid" >/dev/null 2>&1
}

is_port_in_use() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -n -P -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
  else
    return 1
  fi
}

wait_for_url() {
  local url="$1"
  local timeout="$2"
  local interval="$3"
  local start_time

  start_time=$(date +%s)
  while true; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi

    local now
    now=$(date +%s)
    if [ $((now - start_time)) -ge "$timeout" ]; then
      return 1
    fi
    sleep "$interval"
  done
}

frontend_env_has_api_base() {
  local env_files=(
    "$FRONTEND_DIR/.env"
    "$FRONTEND_DIR/.env.local"
    "$FRONTEND_DIR/.env.development"
    "$FRONTEND_DIR/.env.development.local"
  )

  for env_file in "${env_files[@]}"; do
    if [ -f "$env_file" ]; then
      if command -v rg >/dev/null 2>&1; then
        if rg -n "^VITE_API_BASE=" "$env_file" >/dev/null 2>&1; then
          return 0
        fi
      elif command -v grep >/dev/null 2>&1; then
        if grep -q "^VITE_API_BASE=" "$env_file"; then
          return 0
        fi
      fi
    fi
  done

  return 1
}

ensure_pidfile_cleared() {
  local pid_file="$1"
  if [ -f "$pid_file" ]; then
    rm -f "$pid_file"
  fi
}
