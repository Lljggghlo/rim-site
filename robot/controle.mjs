// Robot éditorial — contrôle qualité d'un article avant publication.
// Un article qui ne passe pas ce contrôle n'est pas publié (le pipeline GitHub s'arrête).
//
// Usage : node robot/controle.mjs mon-article            (un ou plusieurs slugs)
//         node robot/controle.mjs --nouveaux             (articles ajoutés ou modifiés par rapport à origin/main)
//         node robot/controle.mjs --tous                 (tout le blog, à titre d'inventaire : n'échoue pas)
// Lancer « npm run build » avant : les liens internes sont vérifiés dans dist/.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BLOG = path.join(ROOT, 'content', 'blog');
const DIST = path.join(ROOT, 'dist');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'robot', 'config.json'), 'utf8'));
const R = CONFIG.regles;

const CATEGORIES = ['Rentabilité', 'Gestion', 'Réglementation', 'Fiscalité', 'Villes', 'Dégâts et litiges', 'Contrat', 'Conseils'];
const SENSIBLES = ['Réglementation', 'Fiscalité'];
const OFFICIELS = /(^|\.)(gouv\.fr|legifrance\.gouv\.fr|service-public\.fr|service-public\.gouv\.fr|impots\.gouv\.fr|urssaf\.fr|insee\.fr|cnil\.fr|paris\.fr|iledefrance\.fr|senat\.fr|assemblee-nationale\.fr|conseil-constitutionnel\.fr|courdecassation\.fr|europa\.eu|anil\.org|inpi\.fr|notaires\.fr|banque-france\.fr|ademe\.fr|atout-france\.fr|sqy\.fr|saint-quentin-en-yvelines\.fr|versailles\.fr|yvelines\.fr|hauts-de-seine\.fr|seinesaintdenis\.fr|valdemarne\.fr|essonne\.fr|grandparisseineouest\.fr|ville-[a-z-]+\.fr|mairie-[a-z-]+\.fr)$/i;
const PLATEFORMES = /(^|\.)(airbnb\.fr|airbnb\.com|booking\.com|abritel\.fr)$/i;
const COMMERCIALES = /^\/(estimation|tarifs|services|avis|gestion-airbnb-booking|qui-sommes-nous|conciergerie-airbnb-[a-z0-9-]+)\/?(\?.*)?$/;
// Mots et tournures interdits (preuves-autorisees.md, vocabulaire de marque, tics de rédaction automatique)
const INTERDITS = [
  [/\bformations?\b|\bformateur|\bélèves?\b|academy|rim-academy/i, 'mention de formation ou de Rim Academy (interdite sur le site conciergerie)'],
  [/\bmarrakech\b|\bmaroc\b/i, 'mention du Maroc (le site ne parle que de la France)'],
  [/\bmandats?\b(?! (de|du) (prélèvement|vente|syndic))/i, '« mandat » (le contrat est un contrat de prestations)'],
  [/tout risque|tous risques/i, '« assurance tout risque »'],
  [/\b(nous|on) (vous )?garanti(ssons|t)\b(?! pas)/i, 'garantie promise'],
  [/revenus? garantis?|rentabilité garantie|loyers? garantis?/i, 'revenu garanti'],
  [/\bmeilleure? conciergerie|n° ?1\b|numéro un\b|leader\b/i, 'superlatif non prouvé'],
  [/\bmaximis/i, '« maximiser »'],
  [/À COMPLÉTER|\[À |TODO|lorem ipsum/i, 'texte à compléter'],
  [/dans cet article,? nous allons|plongeons|il est important de noter|il convient de noter|en conclusion,|pour conclure,|n'hésitez pas|à l'ère (du|de)|dans un monde|incontournable|un véritable|en somme,|force est de constater|il va sans dire/i, 'tournure de remplissage'],
  [/carte (professionnelle|G|T) n°|garantie financière de Rim|RC ?Pro de Rim|notre assurance couvre/i, 'carte professionnelle ou assurance attribuée à Rim'],
];

const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const mots = (s) => String(s).split(/\s+/).filter(Boolean);
const VIDES = new Set('a au aux avec ce ces dans de des du en et la le les leur mon ma mes ou par pour que qui sa ses son sur un une d l à est se si y il elle on ne pas plus comment combien quel quelle quels quelles faut'.split(' '));
const cles = (s) => norm(s).split(' ').filter((w) => w.length > 2 && !VIDES.has(w));
const shingles = (t, k = 5) => { const w = norm(t).split(' '); const set = new Set(); for (let i = 0; i <= w.length - k; i++) set.add(w.slice(i, i + k).join(' ')); return set; };
const jaccard = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / Math.max(1, a.size + b.size - n); };

function lire(slug) {
  const file = path.join(BLOG, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const fm = matter(fs.readFileSync(file, 'utf8'));
  return { slug, data: fm.data, body: fm.content.trim() };
}
const tousSlugs = () => fs.readdirSync(BLOG).filter((f) => f.endsWith('.md') && !f.startsWith('_')).map((f) => f.replace(/\.md$/, ''));

function pageExiste(href) {
  const p = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
  if (p === '/') return true;
  return fs.existsSync(path.join(DIST, p.slice(1), 'index.html')) || fs.existsSync(path.join(DIST, p.slice(1) + '.html')) || fs.existsSync(path.join(DIST, p.slice(1)));
}

export function controler(slug, { strictDate = true } = {}) {
  const E = [], W = [];
  const a = lire(slug);
  if (!a) return { slug, erreurs: [`fichier content/blog/${slug}.md introuvable`], avertissements: [] };
  const d = a.data, body = a.body;
  // Milliers séparés par une espace : « 15 000 € », jamais « 15000 € » (hors blocs de code et graphiques, mis en forme au build)
  {
    const prose = String(body).replace(/```[\s\S]*?```/g, '');
    const nb = [...new Set((prose.match(/(?<![\d\w.,/-])\d{4,}(?:,\d+)?(?=\s?(?:€|euros?\b|m²|nuits?\b|jours\b|voyageurs\b|logements\b|habitants\b))/g) || []))];
    if (nb.length) E.push(`nombres à écrire avec une espace pour les milliers (ex. 15 000 €) : ${nb.join(', ')}`);
  }
  const iso = (x) => (x instanceof Date ? x.toISOString().slice(0, 10) : String(x || '').slice(0, 10));

  // ---------- Adresse ----------
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) E.push('adresse (nom du fichier) : minuscules, chiffres et tirets uniquement');
  if (slug.length > R.slug_max) E.push(`adresse trop longue (${slug.length} > ${R.slug_max})`);

  // ---------- En-tête ----------
  const title = String(d.title || '');
  if (title.length < 30 || title.length > 90) E.push(`titre : ${title.length} caractères (30 à 90 attendus)`);
  const seo = String(d.seo_title || `${title} | Rim Conciergerie`);
  if (seo.length > 60) E.push(`titre Google (seo_title) : ${seo.length} caractères (60 max)`);
  if (!/\| Rim Conciergerie$/.test(seo)) E.push('titre Google : doit finir par « | Rim Conciergerie »');
  const desc = String(d.description || '');
  if (desc.length < 110 || desc.length > 155) E.push(`description : ${desc.length} caractères (110 à 155 attendus)`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso(d.date))) E.push('date de publication absente ou mal formée (AAAA-MM-JJ)');
  if (!CATEGORIES.includes(d.categorie)) E.push(`catégorie « ${d.categorie} » inconnue (${CATEGORIES.join(', ')})`);
  if (!d.requete) E.push('requête Google visée (requete) absente');
  else {
    const k = cles(d.requete);
    const cible = norm(`${title} ${seo}`);
    const trouve = k.filter((w) => cible.includes(w.slice(0, Math.max(4, w.length - 2)))).length;
    if (trouve / Math.max(1, k.length) < 0.6) E.push(`la requête visée « ${d.requete} » n'apparaît pas assez dans le titre`);
    const debut = norm(mots(body.replace(/[#*_>[\]()!]/g, ' ')).slice(0, 120).join(' '));
    if (k.filter((w) => debut.includes(w.slice(0, Math.max(4, w.length - 2)))).length / Math.max(1, k.length) < 0.5) W.push('la requête visée apparaît peu dans les 120 premiers mots');
  }
  if (!d.image && !d.image_source) E.push('photo de couverture absente (image_source: "File:….jpg")');
  if (d.image && !d.image_source && !fs.existsSync(path.join(ROOT, 'static', String(d.image).replace(/^\//, '')))) E.push(`photo de couverture introuvable : ${d.image}`);
  const alt = String(d.image_alt || '');
  if (alt.length < 15 || alt.length > 125) E.push(`description de la photo (image_alt) : ${alt.length} caractères (15 à 125 attendus)`);
  if (!Array.isArray(d.essentiel) || d.essentiel.length < 3 || d.essentiel.length > 5) E.push('« essentiel » : 3 à 5 points attendus');
  if (!Array.isArray(d.faq) || d.faq.length < 2 || d.faq.length > 6) E.push('« faq » : 2 à 6 questions attendues');
  else for (const f of d.faq) if (mots(f.a || '').length < 25) W.push(`réponse de FAQ courte : « ${f.q} »`);
  if (d.ville && !fs.existsSync(path.join(ROOT, 'content', 'villes', `${d.ville}.md`)) && d.ville !== 'saint-quentin-en-yvelines') E.push(`ville « ${d.ville} » : aucune page ville ne porte ce nom`);
  if (d.categorie === 'Villes' && !d.ville) E.push('article de la catégorie Villes sans champ « ville »');

  // ---------- Sources ----------
  const sources = Array.isArray(d.sources) ? d.sources : [];
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  if (sources.length < R.sources_min) E.push(`sources : ${sources.length} (${R.sources_min} minimum)`);
  for (const s of sources) {
    if (!s.nom || !/^https:\/\//.test(s.url || '')) E.push(`source mal formée : ${JSON.stringify(s)}`);
  }
  const officielles = sources.filter((s) => OFFICIELS.test(host(s.url)));
  if (SENSIBLES.includes(d.categorie)) {
    if (officielles.length < R.sources_officielles_min_sensible) E.push(`article ${d.categorie} : ${officielles.length} source(s) officielle(s), ${R.sources_officielles_min_sensible} minimum (service-public, Légifrance, impots.gouv, mairie…)`);
    if (!d.verifie) E.push(`article ${d.categorie} : date de vérification (verifie) absente`);
  } else if (!officielles.length && !sources.some((s) => PLATEFORMES.test(host(s.url)))) W.push('aucune source officielle ni source de plateforme');
  if (d.verifie && strictDate) {
    const age = (new Date(iso(d.date)) - new Date(iso(d.verifie))) / 864e5;
    if (age > R.verification_max_jours || age < -1) E.push(`vérification datée du ${iso(d.verifie)} : plus de ${R.verification_max_jours} jours avant la publication`);
  }

  // ---------- Corps ----------
  const brut = body.replace(/```[\s\S]*?```/g, ' ');
  const lisible = brut.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*_>|`]/g, ' ');
  const nb = mots(lisible).length;
  if (nb < R.mots_min) E.push(`article trop court : ${nb} mots (${R.mots_min} minimum)`);
  if (nb > R.mots_max) E.push(`article trop long : ${nb} mots (${R.mots_max} maximum)`);
  if (/^# /m.test(brut)) E.push('un titre de niveau 1 (# …) est présent dans le texte : le H1 est le titre de l\'article');
  const h2 = (brut.match(/^## .+$/gm) || []).map((x) => x.slice(3).trim());
  if (h2.length < R.h2_min) E.push(`${h2.length} parties (## …) : ${R.h2_min} minimum`);
  if (h2.length > 9) W.push(`${h2.length} parties : au-delà de 9, regrouper`);
  if (new Set(h2.map(norm)).size !== h2.length) E.push('deux parties portent le même titre');
  // Paragraphes courts
  for (const p of brut.split(/\n\s*\n/)) {
    if (/^\s*([#>|\-*]|\d+\.)/.test(p)) continue;
    const n = mots(p).length;
    if (n > R.paragraphe_max) E.push(`paragraphe de ${n} mots (maximum ${R.paragraphe_max}) : « ${p.trim().slice(0, 60)}… »`);
  }
  // Réponse autonome sous chaque partie (40 à 60 mots conseillés)
  const blocs = brut.split(/^## .+$/m).slice(1);
  blocs.forEach((b, i) => { const premier = (b.trim().split(/\n\s*\n/)[0] || ''); if (/^\s*([>|\-*]|\d+\.|###)/.test(premier) || mots(premier).length < 20) W.push(`partie « ${h2[i]} » : commencer par une réponse autonome de 40 à 60 mots`); });
  // Éléments de mise en page
  const aTableau = /^\|.+\|\s*$/m.test(brut) && /^\|[\s:|-]+\|\s*$/m.test(brut);
  const aEncadre = /^>\s*\[!(CONSEIL|RETENIR|ATTENTION|EXEMPLE|DEFINITION|TERRAIN)\]/m.test(brut);
  const aListe = /^(\s*[-*] |\s*\d+\. )/m.test(brut);
  const aGraphique = /```barres/.test(body);
  if (!aEncadre) E.push('aucun encadré (> [!CONSEIL], [!RETENIR], [!ATTENTION], [!EXEMPLE], [!TERRAIN])');
  if (!aListe) E.push('aucune liste ni étapes numérotées');
  if (!aTableau && !aGraphique) W.push('ni tableau ni graphique : en ajouter un si le sujet s\'y prête');

  // ---------- Liens ----------
  const liens = [...body.matchAll(/(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => ({ ancre: m[1], href: m[2] }));
  const internes = liens.filter((l) => l.href.startsWith('/'));
  const externes = liens.filter((l) => /^https?:\/\//.test(l.href));
  if (internes.length < R.liens_internes_min) E.push(`${internes.length} lien(s) interne(s) : ${R.liens_internes_min} minimum`);
  if (!internes.some((l) => COMMERCIALES.test(l.href))) E.push('aucun lien vers une page de service (estimation, tarifs, services, gestion, page ville)');
  if (tousSlugs().length >= 3 && !internes.some((l) => /^\/blog\/[a-z0-9-]+/.test(l.href))) E.push('aucun lien vers un autre article du blog');
  if (fs.existsSync(DIST)) for (const l of internes) if (!pageExiste(l.href)) E.push(`lien interne cassé : ${l.href}`);
  if (externes.length < R.liens_externes_min) E.push(`${externes.length} lien(s) externe(s) dans le texte : ${R.liens_externes_min} minimum (sources officielles)`);
  for (const l of externes) {
    if (l.href.startsWith('http://')) E.push(`lien non sécurisé : ${l.href}`);
    if (/rim-academy/i.test(l.href)) E.push('lien vers rim-academy.fr interdit');
    if (/^(ici|cliquez ici|lien|ce lien|cette page)$/i.test(l.ancre.trim())) E.push(`ancre de lien vide de sens : « ${l.ancre} »`);
  }
  for (const l of internes) if (/^(ici|cliquez ici|lien|ce lien|cette page)$/i.test(l.ancre.trim())) E.push(`ancre de lien vide de sens : « ${l.ancre} »`);
  // Images dans le texte : description obligatoire
  for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) {
    if (m[1].trim().length < 10) E.push(`photo sans description suffisante : ${m[2]}`);
    if (m[2].startsWith('/') && !fs.existsSync(path.join(ROOT, 'static', m[2].slice(1)))) E.push(`photo introuvable : ${m[2]}`);
    if (!m[2].startsWith('/') && !m[2].startsWith('commons:File:')) E.push(`photo externe interdite : ${m[2]} (utiliser commons:File:…)`);
  }

  // ---------- Mots interdits, chiffres non sourcés ----------
  const tout = `${title}\n${desc}\n${(d.essentiel || []).join('\n')}\n${(d.faq || []).map((f) => `${f.q} ${f.a}`).join('\n')}\n${lisible}`;
  for (const [re, quoi] of INTERDITS) { const m = tout.match(re); if (m) E.push(`${quoi} : « ${tout.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).replace(/\s+/g, ' ')} »`); }
  const blocsTexte = body.split(/\n\s*\n/);
  for (let i = 0; i < blocsTexte.length; i++) {
    const p = blocsTexte[i];
    if (!/\d[\d\s.,]*\s?(€|euros?\b)/.test(p)) continue;
    // Un tableau ou une liste peut tirer sa source de la phrase qui l'introduit
    const contexte = /^\s*(\||[-*] |\d+\. )/.test(p) ? `${blocsTexte[i - 1] || ''}\n${p}` : p;
    if (!/\]\(|selon|d'après|source|exemple|prévoit|fixé|plafonn|barème|article \d|tarif|jusqu'à|maximum|minimum|au plus|au moins|service-public|légifrance/i.test(contexte)) E.push(`montant en euros sans source ni mention « exemple » : « ${p.trim().slice(0, 70)}… »`);
  }
  if (/taux d'occupation de \d|rapporte(nt)? \d|gagne[rz]? \d|revenus? de \d/i.test(tout) && !/selon|d'après|source|exemple/i.test(tout)) E.push('chiffre de revenu ou d\'occupation sans source');

  // ---------- Doublons ----------
  const sh = shingles(lisible);
  for (const autre of tousSlugs().filter((s) => s !== slug)) {
    const b = lire(autre);
    if (!b) continue;
    if (d.requete && b.data.requete && norm(d.requete) === norm(b.data.requete)) E.push(`requête déjà visée par l'article « ${autre} »`);
    const kt = new Set(cles(title)), ko = new Set(cles(b.data.title));
    if (jaccard(kt, ko) > 0.7) E.push(`titre trop proche de l'article « ${autre} »`);
    const j = jaccard(sh, shingles(b.body));
    if (j > R.similarite_max) E.push(`texte trop proche de l'article « ${autre} » (similarité ${j.toFixed(2)}, maximum ${R.similarite_max})`);
  }
  return { slug, mots: nb, parties: h2.length, liens_internes: internes.length, liens_externes: externes.length, sources: sources.length, sources_officielles: officielles.length, erreurs: E, avertissements: W };
}

// ---------- Ligne de commande ----------
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  let slugs = args.filter((a) => !a.startsWith('--'));
  const inventaire = args.includes('--tous');
  if (inventaire) slugs = tousSlugs();
  if (args.includes('--nouveaux')) {
    const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'origin/main';
    const out = execSync(`git diff --name-only --diff-filter=AM ${base} -- content/blog`, { cwd: ROOT }).toString();
    slugs = out.split('\n').filter((f) => f.endsWith('.md')).map((f) => path.basename(f, '.md')).filter((s) => !s.startsWith('_'));
    // Un article seulement corrigé (déjà publié) : on ne lui impose pas la fraîcheur de la date de vérification
  }
  if (!slugs.length) { console.log('Aucun article à contrôler.'); process.exit(0); }
  let ko = 0;
  const resume = [];
  for (const s of slugs) {
    const r = controler(s, { strictDate: !inventaire });
    resume.push(r);
    const ok = !r.erreurs.length;
    if (!ok) ko++;
    console.log(`${ok ? '✔' : '✘'} ${s} — ${r.mots ?? '?'} mots, ${r.parties ?? '?'} parties, ${r.liens_internes ?? '?'} liens internes, ${r.sources ?? '?'} sources (${r.sources_officielles ?? '?'} officielles)`);
    r.erreurs.forEach((e) => console.log(`   ✘ ${e}`));
    r.avertissements.forEach((w) => console.log(`   · ${w}`));
  }
  if (args.includes('--json')) fs.writeFileSync(path.join(ROOT, 'robot', 'donnees', 'dernier-controle.json'), JSON.stringify(resume, null, 1));
  if (ko && !inventaire) { console.error(`\n${ko} article(s) refusé(s). Corriger puis relancer.`); process.exit(1); }
}
