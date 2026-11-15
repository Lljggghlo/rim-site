// Robot éditorial — mesure de la vitesse et des signaux Core Web Vitals (exécuté par GitHub Actions).
// Lance Lighthouse (Chrome sans interface, profil téléphone) sur quelques pages types du site en ligne
// et écrit etat/performance.json. Les seuils sont ceux de Google : LCP < 2,5 s, CLS < 0,1.
// Lighthouse est une mesure de laboratoire : les chiffres réels des visiteurs se lisent dans
// Search Console (rapport « Signaux Web essentiels ») dès que le trafic est suffisant.
//
// Usage : node robot/performance.mjs [dossier de sortie]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'robot', 'config.json'), 'utf8'));
const SORTIE = path.join(ROOT, process.argv[2] || 'etat');
fs.mkdirSync(SORTIE, { recursive: true });

// Pages types : accueil, page de service, page ville, dernier article du blog
const blog = path.join(ROOT, 'content', 'blog');
const dernier = fs.readdirSync(blog).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .map((f) => ({ slug: f.replace(/\.md$/, ''), src: fs.readFileSync(path.join(blog, f), 'utf8') }))
  .filter((a) => !/^brouillon:\s*true/m.test(a.src))
  .map((a) => ({ slug: a.slug, date: (a.src.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m) || [])[1] || '' }))
  .filter((a) => a.date && a.date <= new Date().toISOString().slice(0, 10))
  .sort((a, b) => b.date.localeCompare(a.date))[0];
const pages = ['/', '/gestion-airbnb-booking', '/conciergerie-airbnb-versailles', '/estimation', ...(dernier ? [`/blog/${dernier.slug}`] : [])];

const resultats = [];
for (const p of pages) {
  const out = path.join(os.tmpdir(), `lh-${Date.now()}.json`);
  try {
    execFileSync('npx', ['--yes', 'lighthouse@12', CONFIG.site + p, '--quiet', '--output=json', `--output-path=${out}`,
      '--only-categories=performance,seo,accessibility,best-practices', '--chrome-flags=--headless=new --no-sandbox --disable-gpu'],
    { stdio: ['ignore', 'ignore', 'inherit'], timeout: 240000 });
    const r = JSON.parse(fs.readFileSync(out, 'utf8'));
    const a = r.audits;
    const note = (c) => Math.round((r.categories[c]?.score ?? 0) * 100);
    resultats.push({
      page: p,
      performance: note('performance'), seo: note('seo'), accessibilite: note('accessibility'), bonnes_pratiques: note('best-practices'),
      lcp_s: +(a['largest-contentful-paint'].numericValue / 1000).toFixed(2),
      cls: +a['cumulative-layout-shift'].numericValue.toFixed(3),
      tbt_ms: Math.round(a['total-blocking-time'].numericValue),
      fcp_s: +(a['first-contentful-paint'].numericValue / 1000).toFixed(2),
      poids_ko: Math.round(a['total-byte-weight'].numericValue / 1024),
      a_corriger: Object.values(a).filter((x) => x.score !== null && x.score < 0.5 && x.details?.type === 'opportunity').map((x) => x.title).slice(0, 5),
    });
  } catch (e) {
    resultats.push({ page: p, erreur: String(e.message).slice(0, 200) });
  }
}

const alertes = resultats.filter((r) => !r.erreur && (r.lcp_s > 2.5 || r.cls > 0.1 || r.seo < 90)).map((r) => `${r.page} : LCP ${r.lcp_s} s, CLS ${r.cls}, SEO ${r.seo}`);
const etat = { date: new Date().toISOString(), profil: 'téléphone (Lighthouse, mesure de laboratoire)', seuils: { lcp_s: 2.5, cls: 0.1 }, pages: resultats, alertes };
fs.writeFileSync(path.join(SORTIE, 'performance.json'), JSON.stringify(etat, null, 1) + '\n');

// Ajout au rapport hebdomadaire s'il existe
const rapport = path.join(SORTIE, 'rapport-hebdo.md');
const tableau = `\n## Vitesse du site sur téléphone (Lighthouse, ${etat.date.slice(0, 10)})\n\n| Page | Performance | SEO | LCP (s) | CLS | Blocage (ms) | Poids (ko) |\n|---|---|---|---|---|---|---|\n${resultats.map((r) => (r.erreur ? `| ${r.page} | mesure en échec | | | | | |` : `| ${r.page} | ${r.performance} | ${r.seo} | ${r.lcp_s} | ${r.cls} | ${r.tbt_ms} | ${r.poids_ko} |`)).join('\n')}\n\nSeuils de Google : LCP inférieur à 2,5 s, CLS inférieur à 0,1.${alertes.length ? ` À corriger : ${alertes.join(' ; ')}.` : ' Aucune page hors seuil.'}\n`;
if (fs.existsSync(rapport)) fs.appendFileSync(rapport, tableau);
else fs.writeFileSync(rapport, `# Suivi du référencement — ${etat.date.slice(0, 10)}\n\n_Search Console et Analytics ne sont pas encore branchés (secret GOOGLE_CREDENTIALS absent)._\n${tableau}`);
console.log(JSON.stringify(etat, null, 1));
