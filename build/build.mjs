// Rim Conciergerie — générateur du site statique
// Lancement : npm run build  →  le site complet est écrit dans /dist
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { marked } from 'marked';
import { ctx, layout, slugify, dateCourte, bienImg } from './lib.mjs';
import { accueil, gestion, services, tarifs } from './pages/core.mjs';
import { avis, quiSommesNous, estimation, merci, mentionsLegales, confidentialite, cookies, page404 } from './pages/core2.mjs';
import { villePage, deptPage, sqyPage, DEPTS } from './pages/villes.mjs';
import { blogIndex, blogPost, blogThemes, rss } from './pages/blog.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'dist');
const C = (...p) => path.join(ROOT, 'content', ...p);
const warn = [];

// ---------- Date du jour (heure de Paris) ----------
const now = process.env.BUILD_DATE ? new Date(process.env.BUILD_DATE) : new Date();
const parisDay = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now); // AAAA-MM-JJ
ctx.today = parisDay;

// ---------- Lecture des contenus ----------
const readMd = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
        .map((f) => {
          const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
          return { ...data, body: content.trim(), _file: f };
        })
    : [];
const toISO = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d || '').slice(0, 10));

ctx.s = JSON.parse(fs.readFileSync(C('reglages', 'site.json'), 'utf8'));
ctx.communes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'communes.json'), 'utf8'));
ctx.carte = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'carte-idf.json'), 'utf8'));
ctx.credits = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'credits-photos.json'), 'utf8'));
// Registre des dates de dernière modification réelle (data/lastmod.json, tenu par « npm run lastmod »)
const LASTMOD_FILE = path.join(ROOT, 'data', 'lastmod.json');
const lastmodReg = fs.existsSync(LASTMOD_FILE) ? JSON.parse(fs.readFileSync(LASTMOD_FILE, 'utf8')) : {};
const empreinte = (txt) => crypto.createHash('md5').update(String(txt).replace(/\s+/g, ' ')).digest('hex').slice(0, 12);

const biens = readMd(C('biens'))
  .map((b) => ({ ...b, slug: b.slug || b._file.replace(/\.md$/, ''), histoire: b.body, tags: b.tags || null }))
  .sort((a, b) => (a.ordre || 99) - (b.ordre || 99));

const temoignages = readMd(C('temoignages'))
  .filter((t) => t.publie === true && t.accord_ecrit === true && (t.video || t.youtube))
  .sort((a, b) => (a.ordre || 99) - (b.ordre || 99));

ctx.villes = readMd(C('villes'))
  .filter((v) => v.publie !== false)
  .map((v) => {
    const slug = v.slug || slugify(v.ville);
    const t = String(v.trajet || '');
    const min = /sur place/i.test(t) ? 0 : parseInt(t, 10) || 99;
    return {
      ...v,
      departement: String(v.departement),
      slug,
      path: `conciergerie-airbnb-${slug}`,
      trajet_min: min,
      trajet_label: min === 0 ? 'Notre base' : `${t} de Guyancourt`,
      departement_nom: DEPTS[String(v.departement)].nom,
      mis_a_jour: v.mis_a_jour ? toISO(v.mis_a_jour) : null,
    };
  })
  .sort((a, b) => (a.ordre || 99) - (b.ordre || 99));

// Articles : publiés seulement si leur date est passée (programmation)
const nowMs = now.getTime();
const allPosts = readMd(C('blog')).map((p) => {
  const dt = p.date instanceof Date ? p.date : new Date(String(p.date).length <= 10 ? `${p.date}T00:00:00+01:00` : p.date);
  const words = p.body.split(/\s+/).length;
  return { ...p, slug: p.slug || p._file.replace(/\.md$/, ''), date: toISO(dt), _ms: dt.getTime(), modif: p.modif ? toISO(p.modif) : null, verifie: p.verifie ? toISO(p.verifie) : null, mots: words, lecture: Math.max(2, Math.round(words / 220)) };
});
const posts = allPosts.filter((p) => !p.brouillon && p._ms <= nowMs).sort((a, b) => b._ms - a._ms);
const programmes = allPosts.filter((p) => !p.brouillon && p._ms > nowMs);

// ---------- Préparation de /dist ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(ROOT, 'static'), OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
const hashCopy = (file, ext) => {
  const src = fs.readFileSync(path.join(ROOT, 'build', 'assets', file));
  const h = crypto.createHash('md5').update(src).digest('hex').slice(0, 8);
  const name = `${file.replace(/\.\w+$/, '')}.${h}.${ext}`;
  fs.writeFileSync(path.join(OUT, 'assets', name), src);
  return name;
};
ctx.cssFile = hashCopy('site.css', 'css');
ctx.jsFile = hashCopy('site.js', 'js');

// Détail des biens pour /biens-geres
const biensDetails = biens
  .filter((b) => b.region === 'idf' && b.histoire)
  .map(
    (b, i) => `<section class="sec${i % 2 ? '' : ' sec-gray'}" id="bien-${b.slug}" aria-labelledby="bien-${b.slug}-t"><div class="wrap split${i % 2 ? ' split-rev' : ''}">
  <div><p class="kicker">${b.ville} (${b.departement})</p><h2 class="h2" id="bien-${b.slug}-t">${b.titre}</h2><div class="prose">${marked.parse(b.histoire)}</div>${b.ville_page ? `<p class="more"><a class="lnk" href="/conciergerie-airbnb-${b.ville_page}">Conciergerie Airbnb à ${b.ville}</a></p>` : ''}</div>
  <div class="bien card"><div class="bien-img">${bienImg(b, '(min-width:980px) 520px, 92vw')}</div></div>
</div></section>`
  )
  .join('');

const avisAb = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'reglages', 'avis-airbnb.json'), 'utf8'));
const data = { biens, temoignages, biensDetails, posts, avisAirbnb: avisAb.avis, avisAirbnbDate: avisAb.verifie_le };

// ---------- Rendu des pages ----------
const pages = [
  accueil(data),
  gestion(),
  services(),
  tarifs(),
  avis(data),
  quiSommesNous(),
  estimation(),
  merci(),
  ...Object.keys(DEPTS).filter((d) => d !== '75').map((d) => deptPage(d)),
  sqyPage(data),
  ...ctx.villes.map((v) => villePage(v, data)),
  blogIndex(posts),
  ...blogThemes(posts),
  ...posts.map((p) => blogPost(p, posts)),
  mentionsLegales(),
  confidentialite(),
  cookies(),
  page404(),
];

ctx.indexnowKey = '02aee623294ba9e19a2624a3c754a840';
const BANNIS = [/\bformation\b/i, /\bformateur/i, /\bélève/i, /academy/i, /rim-academy/i, /\bmandat\b/i, /\bmaximis/i, /tout risque/i, /\bmeilleur/i, /\bgarantir\b|\bgarantit\b|\bgarantissons\b/i, /À COMPLÉTER/i, /\[À /];
// Date de dernière modification réelle de chaque page : celle fournie par le contenu (articles),
// sinon celle du registre si le contenu n'a pas changé, sinon la date du jour.
const lastmodNew = {};
const lastmodPerime = [];
for (const p of pages) {
  if (p.noindex) continue;
  const h = empreinte(p.body);
  const reg = lastmodReg[p.path];
  const fixe = p.lastmod && p.lastmod !== ctx.today ? p.lastmod : null;
  const date = fixe || (reg && reg.h === h ? reg.d : ctx.today);
  if (!fixe && !(reg && reg.h === h)) lastmodPerime.push(p.path);
  p.lastmod = date;
  lastmodNew[p.path] = { h, d: date };
}
if (process.env.ECRIRE_LASTMOD) fs.writeFileSync(LASTMOD_FILE, JSON.stringify(lastmodNew, null, 1) + '\n');
else if (lastmodPerime.length) warn.push(`Registre des dates (data/lastmod.json) à mettre à jour avec « npm run lastmod » : ${lastmodPerime.length} page(s) modifiée(s), dont ${lastmodPerime.slice(0, 3).join(', ')}`);

for (const p of pages) {
  const html = layout(p);
  const file = p.out ? path.join(OUT, p.out) : p.path === '/' ? path.join(OUT, 'index.html') : path.join(OUT, p.path.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  // Contrôles pré-vol automatiques
  if (p.title.length > 60) warn.push(`Title > 60 car. (${p.title.length}) : ${p.path} → ${p.title}`);
  if (p.description.length > 155) warn.push(`Meta description > 155 car. (${p.description.length}) : ${p.path}`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) warn.push(`${h1} H1 sur ${p.path}`);
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const re of BANNIS) {
    const m = visible.match(re);
    if (m && !(re.source.includes('garanti') && /ne garantit ni|ne garantissons pas/.test(visible.slice(Math.max(0, m.index - 40), m.index + 40))))
      warn.push(`Mot à vérifier « ${m[0]} » sur ${p.path}`);
  }
}

// ---------- Fichiers d'indexation ----------
const s = ctx.s;
const indexables = pages.filter((p) => !p.noindex);
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexables.map((p) => `  <url><loc>${s.url}${p.path === '/' ? '/' : p.path}</loc><lastmod>${p.lastmod || ctx.today}</lastmod></url>`).join('\n')}
</urlset>
`
);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${s.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'blog', 'rss.xml'), rss(posts));
fs.writeFileSync(
  path.join(OUT, 'site.webmanifest'),
  JSON.stringify({ name: s.nom, short_name: 'Rim', start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#ffffff', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] })
);

// llms.txt : résumé factuel pour les assistants IA
const vl = ctx.villes.map((v) => `- [Conciergerie Airbnb à ${v.ville}](${s.url}/${v.path}) : ${v.description}`).join('\n');
fs.writeFileSync(
  path.join(OUT, 'llms.txt'),
  `# ${s.nom}

> Conciergerie Airbnb et Booking basée à Guyancourt (Yvelines, 78280), fondée en 2024 par Nassim RIM, entrepreneur individuel (SIRET ${s.siret}). Elle gère des locations courte durée dans toute l'Île-de-France : Paris, Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne, Yvelines, Essonne, Val-d'Oise et Seine-et-Marne. Les loyers sont versés directement aux propriétaires par les plateformes ; Rim Conciergerie ne détient jamais de fonds.

## En bref

- Services : création des annonces sur les comptes du propriétaire, prix ajustés chaque jour, messagerie voyageurs 24 h/24 (messages automatiques et téléphone d'urgence), arrivées autonomes, coordination du ménage et de la blanchisserie, vidéo horodatée et géolocalisée avant et après chaque ménage, signalement des incidents sous 72 h.
- Tarif : commission de 20 à 25 % des recettes locatives nettes, selon le logement et le nombre de biens, dégressive. Sans abonnement. ${s.mention_tva}
- Contrat : 12 mois renouvelables, préavis d'un mois avant chaque échéance.
- Avis : ${s.avis_google_note}/5 sur Google (${s.avis_google_nombre} avis, vérifié le ${dateCourte(s.avis_google_verifie_le)}) ; ${s.airbnb_note}/5 sur Airbnb (${s.airbnb_evaluations} évaluations${s.airbnb_superhote ? ', Superhôte' : ''}).
- Expérience : ${s.logements_geres} logements gérés en location courte durée.
- Profil Airbnb : ${s.airbnb_profil_lien}
- Contact : ${s.telephone_affiche} · ${s.email} · ${s.url}/estimation

## Pages de référence

- [Accueil](${s.url}/)
- [Gestion de location courte durée Airbnb et Booking](${s.url}/gestion-airbnb-booking)
- [Services](${s.url}/services)
- [Tarifs](${s.url}/tarifs)
- [Avis](${s.url}/avis)
- [Qui sommes-nous](${s.url}/qui-sommes-nous)

## Départements et agglomération

- [Conciergerie Airbnb à Saint-Quentin-en-Yvelines](${s.url}/conciergerie-airbnb-saint-quentin-en-yvelines) : les 12 communes de l'agglomération, autour de notre base de Guyancourt.
${Object.entries(DEPTS).filter(([d]) => d !== '75').map(([, D]) => `- [Conciergerie Airbnb ${D.dans}](${s.url}/${D.path})`).join('\n')}

## Villes

${vl}

## Blog

${posts.map((p) => `- [${p.title}](${s.url}/blog/${p.slug})`).join('\n')}
`
);

// ---------- Rapport ----------
const dataUrls = fs.readdirSync(OUT, { recursive: true }).filter((f) => f.endsWith('.html')).length;
console.log(`✔ Site généré dans dist/ : ${dataUrls} pages HTML, ${indexables.length} dans le sitemap (${ctx.today}).`);
console.log(`  Articles publiés : ${posts.length} · programmés : ${programmes.length}${programmes.length ? ' → ' + programmes.map((p) => `${p.slug} (${p.date})`).join(', ') : ''}`);
console.log(`  Villes : ${ctx.villes.length} · Témoignages vidéo publiés : ${temoignages.length}`);
if (warn.length) {
  console.log(`⚠ ${warn.length} point(s) à vérifier :`);
  warn.forEach((w) => console.log('  - ' + w));
  if (process.env.STRICT) process.exit(1);
}
