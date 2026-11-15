// Robot éditorial — images des articles.
// Exécuté par GitHub Actions (le serveur de rédaction ne peut pas télécharger les fichiers de Wikimedia).
//
// Pour chaque article de content/blog :
//   - image_source: "File:Nom_du_fichier.jpg"  → photo de couverture 1200×675 + 640×360 (WebP)
//   - ![texte alternatif](commons:File:Nom.jpg "Légende")  → photo dans le texte, 1200 px de large + 640 px
// Seules les licences libres sont acceptées (CC0, domaine public, CC BY, CC BY-SA). Le crédit est écrit
// automatiquement dans l'article et dans data/credits-blog.json.
//
// Usage : node robot/images.mjs            (traite tous les articles qui attendent une image)
//         node robot/images.mjs --verifier "File:Nom.jpg"   (affiche licence, auteur, dimensions)
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BLOG = path.join(ROOT, 'content', 'blog');
const IMG = path.join(ROOT, 'static', 'images', 'blog');
const CREDITS = path.join(ROOT, 'data', 'credits-blog.json');
const UA = 'RimConciergerieBot/1.0 (https://www.rimconciergerie.fr; rim.conciergerie@gmail.com)';
const LICENCES_OK = /^(cc0|public domain|pd\b|cc[ -]by(-sa)?[ -]\d)/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, binaire = false, essais = 4) {
  for (let i = 0; i < essais; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.ok) return binaire ? Buffer.from(await r.arrayBuffer()) : r.json();
    if (r.status === 429 || r.status >= 500) { await sleep(4000 * (i + 1)); continue; }
    throw new Error(`HTTP ${r.status} sur ${url}`);
  }
  throw new Error(`Wikimedia ne répond pas (limite de débit) : ${url}`);
}

const texte = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();

export async function infoCommons(fichier) {
  const titre = fichier.startsWith('File:') ? fichier : `File:${fichier}`;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(titre.replace(/_/g, ' '))}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1920`;
  const d = await get(url);
  const page = Object.values(d?.query?.pages || {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) throw new Error(`Fichier introuvable sur Wikimedia Commons : ${titre}`);
  const m = ii.extmetadata || {};
  const licence = texte(m.LicenseShortName?.value);
  const auteur = texte(m.Artist?.value).replace(/^(Photo|Photograph) by /i, '').slice(0, 80) || 'auteur non précisé';
  return {
    titre: page.title,
    licence,
    auteur,
    largeur: ii.width,
    hauteur: ii.height,
    mime: ii.mime,
    url: ii.thumburl && ii.width > 1920 ? ii.thumburl : ii.url,
    page: ii.descriptionurl,
    description: texte(m.ImageDescription?.value).slice(0, 200),
    ok: LICENCES_OK.test(licence) && /^image\/(jpeg|png|webp|tiff)$/.test(ii.mime),
  };
}

const credit = (i) => `${i.auteur}, ${i.licence}, via Wikimedia Commons`;

async function telecharger(fichier, { minLargeur }) {
  const i = await infoCommons(fichier);
  if (!i.ok) throw new Error(`Licence refusée pour ${i.titre} : « ${i.licence || 'inconnue'} » (${i.mime}). Licences acceptées : CC0, domaine public, CC BY, CC BY-SA.`);
  if (i.largeur < minLargeur) throw new Error(`Image trop petite : ${i.titre} fait ${i.largeur} px de large (minimum ${minLargeur}).`);
  return { info: i, buf: await get(i.url, true) };
}

async function ecrire(buf, base, { w, h }) {
  // h défini : recadrage au format ; sinon largeur fixée, hauteur libre (plafonnée)
  const img = sharp(buf).rotate();
  const out = h ? img.resize(w, h, { fit: 'cover', position: 'attention' }) : img.resize({ width: w, height: Math.round(w * 0.8), fit: 'inside', withoutEnlargement: true });
  const file = path.join(IMG, base);
  await out.webp({ quality: 76, effort: 5 }).toFile(file);
  return fs.statSync(file).size;
}

async function traiter() {
  fs.mkdirSync(IMG, { recursive: true });
  const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : {};
  const erreurs = [];
  let n = 0;
  for (const f of fs.readdirSync(BLOG).filter((x) => x.endsWith('.md') && !x.startsWith('_'))) {
    const file = path.join(BLOG, f);
    const slug = f.replace(/\.md$/, '');
    const src = fs.readFileSync(file, 'utf8');
    const fm = matter(src);
    let modifie = false;
    try {
      // 1. Couverture
      const attendue = `/images/blog/${slug}-1200.webp`;
      if (fm.data.image_source && !fs.existsSync(path.join(ROOT, 'static', attendue.slice(1)))) {
        const { info, buf } = await telecharger(fm.data.image_source, { minLargeur: 1200 });
        const p1 = await ecrire(buf, `${slug}-1200.webp`, { w: 1200, h: 675 });
        await ecrire(buf, `${slug}-640.webp`, { w: 640, h: 360 });
        fm.data.image = attendue;
        fm.data.image_credit = credit(info);
        credits[`${slug}-1200.webp`] = { title: info.titre, licence: info.licence, auteur: info.auteur, page: info.page };
        console.log(`✔ Couverture ${slug} : ${info.titre} (${info.licence}, ${Math.round(p1 / 1024)} ko)`);
        modifie = true; n++;
        await sleep(1500);
      }
      // 2. Photos dans le texte
      const refs = [...fm.content.matchAll(/!\[([^\]]*)\]\(commons:(File:[^)"\s]+)(?:\s+"([^"]*)")?\)/g)];
      let k = (fm.content.match(new RegExp(`/images/blog/${slug}-\\d+-1200\\.webp`, 'g')) || []).length;
      for (const m of refs) {
        k++;
        const { info, buf } = await telecharger(m[2], { minLargeur: 1000 });
        await ecrire(buf, `${slug}-${k}-1200.webp`, { w: 1200 });
        await ecrire(buf, `${slug}-${k}-640.webp`, { w: 640 });
        const legende = `${m[3] ? m[3].replace(/\s*[.—-]\s*$/, '') + ' — ' : ''}Photo : ${credit(info)}`.replace(/"/g, '');
        fm.content = fm.content.replace(m[0], `![${m[1]}](/images/blog/${slug}-${k}-1200.webp "${legende}")`);
        credits[`${slug}-${k}-1200.webp`] = { title: info.titre, licence: info.licence, auteur: info.auteur, page: info.page };
        console.log(`✔ Photo ${k} de ${slug} : ${info.titre} (${info.licence})`);
        modifie = true; n++;
        await sleep(1500);
      }
    } catch (e) {
      erreurs.push(`${slug} : ${e.message}`);
    }
    if (modifie) fs.writeFileSync(file, matter.stringify(fm.content, fm.data));
  }
  fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');

  // 3. File d'attente des photos de pages villes (robot/donnees/images-a-preparer.json)
  //    [{ "slug": "saint-quentin-en-yvelines", "fichier": "File:….jpg", "alt": "…" }] → 1920×1280 et 960×640
  const FILE = path.join(ROOT, 'robot', 'donnees', 'images-a-preparer.json');
  const VILLES = path.join(ROOT, 'static', 'images', 'villes');
  const CREDITS_V = path.join(ROOT, 'data', 'credits-photos.json');
  const attente = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : [];
  const reste = [];
  if (attente.length) {
    const cv = JSON.parse(fs.readFileSync(CREDITS_V, 'utf8'));
    for (const a of attente) {
      try {
        const { info, buf } = await telecharger(a.fichier, { minLargeur: 1600 });
        for (const [w, h] of [[1920, 1280], [960, 640]])
          await sharp(buf).rotate().resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: 74, effort: 5 }).toFile(path.join(VILLES, `${a.slug}-${w}.webp`));
        cv[a.slug] = { title: info.titre, licence: info.licence, auteur: info.auteur, path: `/images/villes/${a.slug}-1920.webp`, alt: a.alt, size: [1920, 1280] };
        console.log(`✔ Photo de ville ${a.slug} : ${info.titre} (${info.licence})`);
        n++;
        await sleep(1500);
      } catch (e) {
        erreurs.push(`ville ${a.slug} : ${e.message}`);
        reste.push(a);
      }
    }
    fs.writeFileSync(CREDITS_V, JSON.stringify(cv, null, 1) + '\n');
    fs.writeFileSync(FILE, JSON.stringify(reste, null, 1) + '\n');
  }
  console.log(`${n} image(s) préparée(s).`);
  if (erreurs.length) {
    console.error('✘ Images en échec :\n  - ' + erreurs.join('\n  - '));
    process.exit(1);
  }
}

const i = process.argv.indexOf('--verifier');
if (i > -1) {
  infoCommons(process.argv[i + 1]).then((r) => { console.log(JSON.stringify(r, null, 2)); process.exit(r.ok ? 0 : 2); }).catch((e) => { console.error(e.message); process.exit(1); });
} else {
  traiter().catch((e) => { console.error(e); process.exit(1); });
}
