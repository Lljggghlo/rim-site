#!/usr/bin/env bash
# Robot éditorial — lecture et écriture de la branche « robot-etat » (résultats des contrôles et du suivi).
# Cette branche ne contient que des fichiers de données : elle ne déclenche aucune mise en ligne.
#   robot/ci/etat.sh tirer     → copie la branche robot-etat dans ./etat
#   robot/ci/etat.sh pousser   → enregistre ./etat dans la branche robot-etat
set -euo pipefail
DEPOT="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
TMP="$(mktemp -d)"
mkdir -p etat
if git ls-remote --exit-code --heads "$DEPOT" robot-etat >/dev/null 2>&1; then
  git clone -q --depth 1 --branch robot-etat "$DEPOT" "$TMP"
else
  git init -q "$TMP"
  git -C "$TMP" checkout -q --orphan robot-etat
  git -C "$TMP" remote add origin "$DEPOT"
  printf '{\n  "git": { "deploymentEnabled": false }\n}\n' > "$TMP/vercel.json"
  printf '# État du robot éditorial\n\nFichiers écrits par les contrôles automatiques (GitHub Actions) et lus par le robot. Ne rien modifier à la main.\n' > "$TMP/README.md"
fi
case "${1:-}" in
  tirer)
    find "$TMP" -maxdepth 1 -type f ! -name vercel.json ! -name README.md -exec cp {} etat/ \;
    ;;
  pousser)
    cp -r etat/. "$TMP"/
    git -C "$TMP" add -A
    if git -C "$TMP" diff --cached --quiet; then echo "État inchangé."; exit 0; fi
    git -C "$TMP" -c user.name="${GITHUB_REPOSITORY_OWNER}" -c user.email="${GITHUB_REPOSITORY_OWNER_ID}+${GITHUB_REPOSITORY_OWNER}@users.noreply.github.com" commit -q -m "État du robot : $(date -u +%Y-%m-%dT%H:%MZ)"
    git -C "$TMP" push -q origin HEAD:robot-etat
    ;;
  *) echo "usage : etat.sh tirer|pousser"; exit 2 ;;
esac
