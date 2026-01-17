#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-test.sh
Runs frontend tests if configured.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

require_cmd node
require_cmd npm

has_test=$(node -e "const pkg=require('./frontend/package.json'); console.log(pkg.scripts && pkg.scripts.test ? 'yes' : 'no')")
if [ "$has_test" = "yes" ]; then
  log_info "Running frontend tests"
  ( cd "$FRONTEND_DIR" && npm run test )
  log_success "Tests complete"
else
  log_warn "No test script found in frontend/package.json"
fi
