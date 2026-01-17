#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-build.sh
Builds the frontend for production.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

require_cmd npm

log_info "Building frontend"
( cd "$FRONTEND_DIR" && npm run build )
log_success "Build complete"
