#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Usage: scripts/dev-lint.sh
Runs frontend lint if configured.
EOF
  exit 0
fi


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-common.sh
source "$SCRIPT_DIR/dev-common.sh"

require_cmd node
require_cmd npm

has_lint=$(node -e "const pkg=require('./frontend/package.json'); console.log(pkg.scripts && pkg.scripts.lint ? 'yes' : 'no')")
if [ "$has_lint" = "yes" ]; then
  log_info "Running frontend lint"
  ( cd "$FRONTEND_DIR" && npm run lint )
  log_success "Lint complete"
else
  log_warn "No lint script found in frontend/package.json"
fi
