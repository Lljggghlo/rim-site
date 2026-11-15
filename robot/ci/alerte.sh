#!/usr/bin/env bash
# Ouvre (ou complète) un ticket GitHub quand un contrôle échoue : GitHub prévient le propriétaire par e-mail.
#   robot/ci/alerte.sh "Titre du ticket" fichier-de-detail
set -euo pipefail
TITRE="$1"; DETAIL="${2:-/dev/null}"
CORPS="$(printf 'Contrôle automatique du %s.\n\nExécution : %s/%s/actions/runs/%s\n\n```\n%s\n```\n\nLe robot lira ce résultat à son prochain passage et tentera de corriger. Fermez ce ticket une fois le problème réglé.' "$(date -u +%d/%m/%Y)" "$GITHUB_SERVER_URL" "$GITHUB_REPOSITORY" "$GITHUB_RUN_ID" "$(tail -c 3500 "$DETAIL" 2>/dev/null || true)")"
NUM="$(gh issue list --state open --search "in:title \"$TITRE\"" --json number --jq '.[0].number' 2>/dev/null || true)"
if [ -n "${NUM:-}" ]; then gh issue comment "$NUM" --body "$CORPS"; else gh issue create --title "$TITRE" --body "$CORPS"; fi
