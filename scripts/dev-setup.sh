#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-setup.sh
Installs dependencies and prepares local config.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

require_cmd npm
require_cmd php

log_info "Installing frontend dependencies"
( cd "$FRONTEND_DIR" && npm install )
log_success "Frontend dependencies installed"

if [ ! -f "$BACKEND_DIR/config.php" ]; then
  if [ -f "$BACKEND_DIR/config.example.php" ]; then
    cp "$BACKEND_DIR/config.example.php" "$BACKEND_DIR/config.php"
    log_warn "Created backend/config.php from config.example.php. Review values before use."
  else
    log_warn "config.example.php not found. Skipping backend/config.php creation."
  fi
fi

log_success "Local setup complete"
