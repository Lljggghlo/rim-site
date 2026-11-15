# rimconciergerie.fr

Site de Rim Conciergerie. Site statique généré à partir de fichiers de contenu, publié sur Vercel.

## Comment ça marche

- `content/` : tous les textes modifiables (blog, villes, biens, témoignages, réglages).
- `build/` : le générateur (gabarits, styles, scripts). On n'y touche pas pour écrire du contenu.
- `static/` : images, polices, icônes, espace d'écriture `/admin`.
- `api/republier.js` : relance la publication chaque matin (articles programmés).
- `vercel.json` : réglages Vercel (construction, redirections, tâche planifiée).
- `robot/` : le robot éditorial (consignes, file des sujets, contrôles, images, suivi). Voir plus bas.
- `.github/workflows/` : les trois automatismes GitHub (publication, contrôle du site, suivi hebdomadaire).

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

## Le robot éditorial

Le blog est tenu par un agent Claude programmé (tâches planifiées du compte Claude de Nassim) : rédaction le lundi, le mercredi et le vendredi, veille et optimisation le dimanche. Il suit `robot/CONSIGNES.md`.

| Étape | Qui | Où |
|---|---|---|
| Choisir le sujet, vérifier les sources officielles, écrire, choisir les photos | Agent Claude | `robot/sujets.json`, `content/blog/` |
| Dépôt de l'article sur une branche `publication/…` | Agent Claude | GitHub |
| Photos (Wikimedia Commons, licences libres), contrôle qualité, dates, mise en ligne sur `main` | GitHub Actions, `publication.yml` | `robot/images.mjs`, `robot/controle.mjs` |
| Construction et mise en ligne | Vercel | — |
| Page en ligne et indexable ? Plan de site, canoniques, H1 ; envoi à Bing (IndexNow) | GitHub Actions, `publication.yml` et `controle-en-ligne.yml` (chaque matin) | `robot/verif-en-ligne.mjs` |
| Search Console, Analytics, vitesse (Lighthouse) : rapport du dimanche | GitHub Actions, `suivi-hebdo.yml` | `robot/suivi.mjs`, `robot/performance.mjs` |
| Lecture du rapport, reprise des articles faibles, veille réglementaire | Agent Claude (dimanche) | `robot/veille.md`, `robot/journal.md` |

Les résultats des contrôles sont écrits dans la branche `robot-etat` (jamais mise en ligne) : `controle-en-ligne.json`, `publication.json`, `suivi.json`, `rapport-hebdo.md`, `performance.json`, `historique.json`. En cas d'échec, un ticket GitHub est ouvert : GitHub envoie un e-mail au propriétaire du dépôt.

Réglages utiles, dans `robot/config.json` :

| Je veux… | Réglage |
|---|---|
| Relire les articles avant parution | `"mode": "relecture"` : l'article arrive en brouillon dans `/admin`, il paraît quand on décoche « Brouillon ». |
| Relire seulement la fiscalité et la réglementation | `"relecture_obligatoire_pour": ["Fiscalité", "Réglementation"]` |
| Mettre le robot en pause | `"pause_jusqu_au": "2027-01-05"` |
| Changer le rythme | `"articles_par_semaine"` et `"jours"`, puis l'horaire de la tâche planifiée dans Claude. |
| Imposer un sujet | Ajouter une ligne en priorité 1 dans `robot/sujets.json`. |

Brancher Search Console et Analytics : créer un compte de service Google, l'ajouter en lecture à la propriété Search Console et à la propriété GA4, coller son fichier JSON dans le secret GitHub `GOOGLE_CREDENTIALS` (Settings → Secrets and variables → Actions), puis renseigner `ga4_property_id` dans `robot/config.json`. Sans ce secret, tout fonctionne sauf la lecture des chiffres.

## Commandes (pour un développeur)

```
npm install
npm run build        # génère dist/
npm run dev          # génère puis sert le site sur http://localhost:4321
BUILD_DATE=2026-11-12 npm run build   # simule une date pour tester la programmation
npm run lastmod      # met à jour data/lastmod.json (dates réelles de modification, pour le plan de site)
npm run strict       # construction qui échoue au moindre avertissement
node robot/controle.mjs mon-article   # contrôle qualité d'un article (après npm run build)
node robot/controle.mjs --tous        # inventaire de tout le blog
```
