// Robot éditorial — contrôle du site en ligne (exécuté par GitHub Actions, qui a accès à Internet).
// Vérifie que chaque page du plan de site répond, est indexable et porte la bonne adresse canonique,
// attend la mise en ligne d'un nouvel article, prévient Bing (IndexNow) et écrit l'état dans etat/.
//
// Usage : node robot/verif-en-ligne.mjs [--attendre /blog/mon-article] [--indexnow] [--sortie etat]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'robot', 'config.json'), 'utf8'));
const BASE = CONFIG.site;
const args = process.argv.slice(2);
const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const SORTIE = path.join(ROOT, opt('--sortie') || 'etat');
const UA = 'RimConciergerieControle/1.0 (+https://www.rimconciergerie.fr)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, { redirect = 'follow' } = {}) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Cache-Control': 'no-cache' }, redirect, signal: AbortSignal.timeout(25000) });
    return { status: r.status, url: r.url, location: r.headers.get('location'), robots: r.headers.get('x-robots-tag') || '', text: redirect === 'follow' ? await r.text() : '' };
  } catch (e) {
    return { status: 0, url, text: '', robots: '', erreur: e.message };
  }
}

async function attendre(chemin, minutes = 12) {
  const url = BASE + chemin;
  const fin = Date.now() + minutes * 60000;
  while (Date.now() < fin) {
    const r = await get(`${url}?v=${Date.now()}`);
    if (r.status === 200 && /<h1[\s>]/.test(r.text)) return true;
    await sleep(20000);
  }
  return false;
}

async function main() {
  const erreurs = [];
  const avertissements = [];
  const attendu = opt('--attendre');
  let enLigne = null;
  if (attendu) {
    enLigne = await attendre(attendu);
    if (!enLigne) erreurs.push(`${attendu} n'est pas en ligne 12 minutes après la publication`);
  }

  // Redirections : une seule version du site
  for (const [u, nom] of [['https://rimconciergerie.fr/', 'sans www'], ['http://www.rimconciergerie.fr/', 'http']]) {
    const r = await get(u, { redirect: 'manual' });
    if (![301, 308].includes(r.status) || !String(r.location || '').startsWith('https://')) avertissements.push(`version ${nom} : redirection ${r.status} vers ${r.location || '—'} (301 ou 308 attendu)`);
  }

  // robots.txt et plan de site
  const robots = await get(`${BASE}/robots.txt`);
  if (robots.status !== 200 || !/Sitemap:\s*https:\/\/www\.rimconciergerie\.fr\/sitemap\.xml/.test(robots.text)) erreurs.push('robots.txt absent ou sans lien vers le plan de site');
  if (/Disallow:\s*\/\s*$/m.test(robots.text)) erreurs.push('robots.txt bloque tout le site');
  const sm = await get(`${BASE}/sitemap.xml?v=${Date.now()}`);
  const entrees = [...sm.text.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)].map((m) => ({ loc: m[1], lastmod: m[2] }));
  if (sm.status !== 200 || entrees.length < 40) erreurs.push(`plan de site illisible ou incomplet (${entrees.length} adresses)`);
  if (attendu && enLigne && !entrees.some((e) => e.loc === BASE + attendu)) erreurs.push(`${attendu} est en ligne mais absent du plan de site`);

  // Chaque page : 200, indexable, canonique exacte, un titre, un seul H1
  const file = [...entrees];
  const controle = async (e) => {
    const r = await get(e.loc);
    const p = e.loc.replace(BASE, '') || '/';
    if (r.status !== 200) return erreurs.push(`${p} : réponse ${r.status || r.erreur}`);
    if (/noindex/i.test(r.robots) || /<meta name="robots" content="[^"]*noindex/i.test(r.text)) erreurs.push(`${p} : page en noindex alors qu'elle est dans le plan de site`);
    const can = (r.text.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (can !== e.loc) erreurs.push(`${p} : adresse canonique « ${can} » différente de l'adresse du plan de site`);
    if (!/<title>[^<]{10,}<\/title>/.test(r.text)) erreurs.push(`${p} : balise title absente`);
    const h1 = (r.text.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) erreurs.push(`${p} : ${h1} titres H1`);
    if (!/<script type="application\/ld\+json">/.test(r.text)) avertissements.push(`${p} : données structurées absentes`);
  };
  const lots = 6;
  await Promise.all(Array.from({ length: lots }, async () => { while (file.length) await controle(file.shift()); }));

  // Fraîcheur du blog : le robot publie-t-il encore ?
  const articles = entrees.filter((e) => /\/blog\/[^/]+$/.test(e.loc) && !/\/blog\/theme\//.test(e.loc));
  const flux = await get(`${BASE}/blog/rss.xml?v=${Date.now()}`);
  const dernierePub = [...flux.text.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) => new Date(m[1]).getTime()).sort((a, b) => b - a)[0];
  const jours = dernierePub ? Math.floor((Date.now() - dernierePub) / 864e5) : null;
  if (jours !== null && jours > CONFIG.alerte.jours_sans_article_max) erreurs.push(`aucun article publié depuis ${jours} jours (seuil d'alerte : ${CONFIG.alerte.jours_sans_article_max})`);

  // IndexNow (Bing et moteurs partenaires) : adresses modifiées depuis hier
  let indexnow = null;
  if (args.includes('--indexnow')) {
    const limite = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
    const urls = entrees.filter((e) => e.lastmod >= limite).map((e) => e.loc);
    if (attendu && !urls.includes(BASE + attendu)) urls.push(BASE + attendu);
    if (urls.length) {
      const cle = CONFIG.indexnow_key;
      try {
        const r = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: 'www.rimconciergerie.fr', key: cle, keyLocation: `${BASE}/${cle}.txt`, urlList: urls.slice(0, 500) }) });
        indexnow = { envoyees: urls.length, reponse: r.status };
        if (![200, 202].includes(r.status)) avertissements.push(`IndexNow a répondu ${r.status}`);
      } catch (e) { avertissements.push(`IndexNow injoignable : ${e.message}`); }
    } else indexnow = { envoyees: 0 };
  }

  const etat = {
    date: new Date().toISOString(),
    ok: erreurs.length === 0,
    pages_controlees: entrees.length,
    articles_en_ligne: articles.length,
    jours_depuis_dernier_article: jours,
    article_attendu: attendu || null,
    article_en_ligne: enLigne,
    indexnow,
    erreurs,
    avertissements,
  };
  fs.mkdirSync(SORTIE, { recursive: true });
  fs.writeFileSync(path.join(SORTIE, 'controle-en-ligne.json'), JSON.stringify(etat, null, 1) + '\n');
  console.log(JSON.stringify(etat, null, 1));
  if (erreurs.length) process.exit(1);
}
main();
