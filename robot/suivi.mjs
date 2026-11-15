// Robot éditorial — suivi des performances (exécuté chaque semaine par GitHub Actions).
// Lit Google Search Console et Google Analytics 4 avec un compte de service, puis écrit :
//   etat/suivi.json          données brutes (28 derniers jours et 28 jours précédents)
//   etat/rapport-hebdo.md    rapport lisible : progression, pages et requêtes en tête, articles à reprendre
//   etat/historique.json     une ligne par semaine (clics, impressions, position, mots-clés, prospects)
//
// Secrets GitHub attendus : GOOGLE_CREDENTIALS (JSON du compte de service). Sans ce secret, le script
// écrit « non configuré » et s'arrête sans erreur.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'robot', 'config.json'), 'utf8'));
const SORTIE = path.join(ROOT, process.argv[2] || 'etat');
fs.mkdirSync(SORTIE, { recursive: true });
const ecrire = (f, c) => fs.writeFileSync(path.join(SORTIE, f), typeof c === 'string' ? c : JSON.stringify(c, null, 1) + '\n');
const jour = (d) => d.toISOString().slice(0, 10);
const il_y_a = (n) => jour(new Date(Date.now() - n * 864e5));

async function jeton(creds, scopes) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const corps = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: creds.client_email, scope: scopes.join(' '), aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3000 })}`;
  const sig = crypto.createSign('RSA-SHA256').update(corps).sign(creds.private_key).toString('base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${corps}.${sig}` });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Connexion Google refusée : ${JSON.stringify(j)}`);
  return j.access_token;
}

async function gsc(token, corps) {
  const site = encodeURIComponent(CONFIG.suivi.propriete_search_console);
  const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corps) });
  const j = await r.json();
  if (j.error) throw new Error(`Search Console : ${j.error.message}`);
  return j.rows || [];
}

async function ga4(token, corps) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${CONFIG.suivi.ga4_property_id}:runReport`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corps) });
  const j = await r.json();
  if (j.error) throw new Error(`Google Analytics : ${j.error.message}`);
  return (j.rows || []).map((x) => ({ d: x.dimensionValues.map((v) => v.value), m: x.metricValues.map((v) => Number(v.value)) }));
}

async function main() {
  const brut = process.env.GOOGLE_CREDENTIALS;
  if (!brut) {
    ecrire('suivi.json', { configure: false, date: new Date().toISOString(), message: 'Secret GOOGLE_CREDENTIALS absent : le suivi Search Console et Analytics n\'est pas encore branché.' });
    console.log('Suivi non configuré (secret GOOGLE_CREDENTIALS absent).');
    return;
  }
  const creds = JSON.parse(brut);
  const token = await jeton(creds, ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/analytics.readonly']);
  // Search Console a 2 à 3 jours de retard : fenêtres de 28 jours décalées de 3 jours
  const P = { startDate: il_y_a(31), endDate: il_y_a(3) };
  const P0 = { startDate: il_y_a(59), endDate: il_y_a(32) };
  const tot = async (p) => (await gsc(token, { ...p, dimensions: [] }))[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const [t, t0, pages, pages0, requetes, requetes0, couples] = await Promise.all([
    tot(P), tot(P0),
    gsc(token, { ...P, dimensions: ['page'], rowLimit: 1000 }),
    gsc(token, { ...P0, dimensions: ['page'], rowLimit: 1000 }),
    gsc(token, { ...P, dimensions: ['query'], rowLimit: 2000 }),
    gsc(token, { ...P0, dimensions: ['query'], rowLimit: 2000 }),
    gsc(token, { ...P, dimensions: ['page', 'query'], rowLimit: 5000 }),
  ]);
  const chemin = (u) => u.replace(CONFIG.site, '') || '/';
  const parPage = Object.fromEntries(pages.map((r) => [chemin(r.keys[0]), { clics: r.clicks, impressions: r.impressions, ctr: +(r.ctr * 100).toFixed(1), position: +r.position.toFixed(1) }]));
  const parPage0 = Object.fromEntries(pages0.map((r) => [chemin(r.keys[0]), { clics: r.clicks, impressions: r.impressions, position: +r.position.toFixed(1) }]));
  const top10 = (rows) => rows.filter((r) => r.position <= 10).length;

  // Google Analytics 4 (facultatif)
  let analytics = null;
  if (CONFIG.suivi.ga4_property_id) {
    try {
      const dates = [{ startDate: '28daysAgo', endDate: 'yesterday' }];
      const organique = { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { value: 'Organic Search' } } };
      const [sessions, prospects, prospectsOrg] = await Promise.all([
        ga4(token, { dateRanges: dates, dimensions: [{ name: 'landingPage' }], metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }], dimensionFilter: organique, limit: 500 }),
        ga4(token, { dateRanges: dates, dimensions: [{ name: 'landingPage' }, { name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'eventCount' }], dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: 'lead_estimation' } } }, limit: 500 }),
        ga4(token, { dateRanges: dates, dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], dimensionFilter: { andGroup: { expressions: [organique, { filter: { fieldName: 'eventName', inListFilter: { values: ['lead_estimation', 'begin_estimation', 'click_tel'] } } }] } } }),
      ]);
      analytics = {
        sessions_organiques: sessions.reduce((s, r) => s + r.m[0], 0),
        par_page: Object.fromEntries(sessions.map((r) => [r.d[0], { sessions: r.m[0], engagees: r.m[1] }])),
        prospects_par_page: prospects.map((r) => ({ page: r.d[0], canal: r.d[1], demandes: r.m[0] })).sort((a, b) => b.demandes - a.demandes),
        evenements_organiques: Object.fromEntries(prospectsOrg.map((r) => [r.d[0], r.m[0]])),
      };
    } catch (e) { analytics = { erreur: e.message }; }
  }

  // Dates de publication des articles (pour repérer ceux qui ne décollent pas)
  const blog = path.join(ROOT, 'content', 'blog');
  const articles = fs.readdirSync(blog).filter((f) => f.endsWith('.md') && !f.startsWith('_')).map((f) => {
    const src = fs.readFileSync(path.join(blog, f), 'utf8');
    const d = (src.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m) || [])[1];
    const q = (src.match(/^requete:\s*["']?(.+?)["']?\s*$/m) || [])[1] || '';
    return { slug: f.replace(/\.md$/, ''), date: d, requete: q };
  });
  const age = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
  const S = CONFIG.suivi;
  const aReprendre = articles.filter((a) => a.date && age(a.date) >= S.article_a_reprendre_apres_jours && ((parPage[`/blog/${a.slug}`]?.impressions || 0) < S.impressions_min_28j)).map((a) => ({ ...a, age_jours: age(a.date), ...(parPage[`/blog/${a.slug}`] || { clics: 0, impressions: 0 }) }));
  const aPousser = Object.entries(parPage).filter(([, v]) => v.position > 7 && v.position <= 20 && v.impressions >= 50).map(([p, v]) => ({ page: p, ...v })).sort((a, b) => b.impressions - a.impressions).slice(0, 15);
  const titreAFaire = Object.entries(parPage).filter(([, v]) => v.position <= 6 && v.impressions >= 100 && v.ctr < 2).map(([p, v]) => ({ page: p, ...v }));
  // Requêtes sans page dédiée : idées de sujets
  const idees = requetes.filter((r) => r.impressions >= 20 && r.position > 12).sort((a, b) => b.impressions - a.impressions).slice(0, 30).map((r) => ({ requete: r.keys[0], impressions: r.impressions, position: +r.position.toFixed(1) }));
  const meilleureRequete = {};
  for (const r of couples) { const p = chemin(r.keys[0]); if (!meilleureRequete[p] || r.impressions > meilleureRequete[p].impressions) meilleureRequete[p] = { requete: r.keys[1], impressions: r.impressions, position: +r.position.toFixed(1) }; }

  const resume = {
    periode: P, periode_precedente: P0,
    clics: t.clicks, clics_avant: t0.clicks,
    impressions: t.impressions, impressions_avant: t0.impressions,
    position_moyenne: +(t.position || 0).toFixed(1), position_moyenne_avant: +(t0.position || 0).toFixed(1),
    requetes_positionnees: requetes.length, requetes_positionnees_avant: requetes0.length,
    requetes_top10: top10(requetes), requetes_top10_avant: top10(requetes0),
    clics_blog: Object.entries(parPage).filter(([p]) => p.startsWith('/blog/')).reduce((s, [, v]) => s + v.clics, 0),
    sessions_organiques: analytics?.sessions_organiques ?? null,
    demandes_estimation_organiques: analytics?.evenements_organiques?.lead_estimation ?? null,
  };
  ecrire('suivi.json', { configure: true, date: new Date().toISOString(), resume, pages: parPage, pages_avant: parPage0, requetes: requetes.slice(0, 300).map((r) => ({ requete: r.keys[0], clics: r.clicks, impressions: r.impressions, position: +r.position.toFixed(1) })), meilleure_requete_par_page: meilleureRequete, analytics, articles_a_reprendre: aReprendre, pages_a_pousser: aPousser, titres_a_retravailler: titreAFaire, idees_de_sujets: idees });

  const hist = path.join(SORTIE, 'historique.json');
  const h = fs.existsSync(hist) ? JSON.parse(fs.readFileSync(hist, 'utf8')) : [];
  h.push({ semaine: jour(new Date()), ...resume });
  ecrire('historique.json', h.slice(-104));

  const ev = (a, b) => (b ? `${a} (${a - b >= 0 ? '+' : ''}${a - b} sur 28 jours)` : `${a}`);
  const tab = (rows, cols) => rows.length ? `| ${cols.map((c) => c[0]).join(' | ')} |\n|${cols.map(() => '---').join('|')}|\n${rows.map((r) => `| ${cols.map((c) => r[c[1]] ?? '').join(' | ')} |`).join('\n')}` : '_Rien à signaler._';
  const topPages = Object.entries(parPage).sort((a, b) => b[1].clics - a[1].clics || b[1].impressions - a[1].impressions).slice(0, 15).map(([p, v]) => ({ page: p, ...v }));
  ecrire('rapport-hebdo.md', `# Suivi du référencement — ${jour(new Date())}

Période : du ${P.startDate} au ${P.endDate}, comparée aux 28 jours précédents. Source : Google Search Console${analytics && !analytics.erreur ? ' et Google Analytics 4' : ''}.

## En bref

- Clics depuis Google : ${ev(resume.clics, resume.clics_avant)}
- Impressions : ${ev(resume.impressions, resume.impressions_avant)}
- Position moyenne : ${resume.position_moyenne} (avant : ${resume.position_moyenne_avant})
- Requêtes sur lesquelles le site apparaît : ${ev(resume.requetes_positionnees, resume.requetes_positionnees_avant)}, dont ${resume.requetes_top10} en première page
- Clics apportés par le blog : ${resume.clics_blog}
- Visites venues de Google (Analytics) : ${resume.sessions_organiques ?? 'Analytics non branché'}
- Demandes d'estimation venues de Google : ${resume.demandes_estimation_organiques ?? 'Analytics non branché'}

## Pages qui apportent le plus de clics

${tab(topPages, [['Page', 'page'], ['Clics', 'clics'], ['Impressions', 'impressions'], ['CTR %', 'ctr'], ['Position', 'position']])}

## Pages qui génèrent des demandes d'estimation

${analytics && !analytics.erreur ? tab(analytics.prospects_par_page.slice(0, 15), [['Page d\'arrivée', 'page'], ['Canal', 'canal'], ['Demandes', 'demandes']]) : '_Google Analytics 4 non branché._'}

## Pages proches de la première page (positions 8 à 20) : à renforcer

${tab(aPousser, [['Page', 'page'], ['Impressions', 'impressions'], ['Position', 'position'], ['Clics', 'clics']])}

## Bien placées mais peu cliquées : titre et description à retravailler

${tab(titreAFaire, [['Page', 'page'], ['Impressions', 'impressions'], ['CTR %', 'ctr'], ['Position', 'position']])}

## Articles de plus de ${S.article_a_reprendre_apres_jours} jours qui ne décollent pas : à reprendre

${tab(aReprendre, [['Article', 'slug'], ['Âge (jours)', 'age_jours'], ['Impressions', 'impressions'], ['Clics', 'clics'], ['Requête visée', 'requete']])}

## Requêtes vues par Google sans page bien placée : idées de sujets

${tab(idees, [['Requête', 'requete'], ['Impressions', 'impressions'], ['Position', 'position']])}
`);
  console.log(JSON.stringify(resume, null, 1));
}
main().catch((e) => {
  ecrire('suivi.json', { configure: true, erreur: e.message, date: new Date().toISOString() });
  console.error(e);
  process.exit(1);
});
