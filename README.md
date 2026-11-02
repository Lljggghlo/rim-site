# rimconciergerie.fr

Site de Rim Conciergerie. Site statique généré à partir de fichiers de contenu, publié sur Vercel.

## Comment ça marche

- `content/` : tous les textes modifiables (blog, villes, biens, témoignages, réglages).
- `build/` : le générateur (gabarits, styles, scripts). On n'y touche pas pour écrire du contenu.
- `static/` : images, polices, icônes, espace d'écriture `/admin`.
- `api/republier.js` : relance la publication chaque matin (articles programmés).
- `vercel.json` : réglages Vercel (construction, redirections, tâche planifiée).

À chaque modification sur GitHub, Vercel reconstruit le site (`npm run build`) et le met en ligne en une à deux minutes.

## Écrire et modifier sans toucher au code : rimconciergerie.fr/admin

| Je veux… | Où |
|---|---|
| Publier ou programmer un article | Blog → Nouvel article. Date future = publication automatique ce jour-là, vers 6 h. |
| Mettre à jour le nombre d'avis Google | Réglages → Avis, chiffres et coordonnées → « Nombre d'avis Google ». Mettre aussi la date de vérification. |
| Ajouter un témoignage vidéo | Témoignages vidéo → Nouveau. Cocher « Accord écrit reçu » et « Publié ». La section apparaît dès le premier témoignage publié. |
| Ajouter une ville | Pages villes → Nouvelle ville. Contenu propre à la ville obligatoire (voir règle ci-dessous). |
| Ajouter un logement géré | Biens gérés → Nouveau. Photo sans texte dessus. |
| Activer Google Analytics ou le Pixel Meta | Réglages → identifiants GA4 / Pixel. La bannière cookies s'active toute seule. |

### Règle anti-pages-clones (pages villes)

Ne jamais copier la page d'une ville en changeant seulement le nom. Google classe les pages en série comme du spam, et la sanction peut toucher tout le site. Chaque ville doit avoir ses propres atouts, secteurs, voyageurs, règles et texte « Notre regard ».

## Contrôles automatiques

À chaque construction, le générateur signale : title de plus de 60 caractères, meta description de plus de 155, nombre de H1 différent de 1, mots interdits (formation, mandat, garantir, tout risque, meilleur, crochets [À COMPLÉTER]…). Voir le journal de construction dans Vercel.

## Commandes (pour un développeur)

```
npm install
npm run build        # génère dist/
npm run dev          # génère puis sert le site sur http://localhost:4321
BUILD_DATE=2026-11-12 npm run build   # simule une date pour tester la programmation
```
