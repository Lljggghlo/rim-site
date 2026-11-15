// Blog propriétaires : index, thèmes, articles (Markdown enrichi), flux RSS
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { ctx, esc, icon, breadcrumbs, finalCta, dateFr, faqBlock, slugify, socialBand, socialPills } from '../lib.mjs';

const STATIC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'static');

// ---------- Thèmes du blog (un thème = une page dès 3 articles) ----------
export const THEMES = {
  'Rentabilité': { slug: 'rentabilite', intro: "Ce que rapporte une location courte durée dépend du logement, de la commune et des charges. Ces articles expliquent comment faire le calcul vous-même, avec des sources publiques, sans promesse de revenus." },
  'Gestion': { slug: 'gestion', intro: "Annonce, prix, calendrier, voyageurs, ménage : ce qui fait qu'une location courte durée fonctionne au quotidien, et ce qui la freine." },
  'Réglementation': { slug: 'reglementation', intro: "Numéro d'enregistrement, changement d'usage, plafond de nuitées, copropriété : les règles qui s'appliquent en Île-de-France, avec la date de chaque vérification et la source officielle." },
  'Fiscalité': { slug: 'fiscalite', intro: "Régime micro-BIC ou réel, abattements, taxe de séjour, cotisations : les règles fiscales des meublés de tourisme, d'après les textes et les sites officiels." },
  'Villes': { slug: 'villes', intro: "Louer en courte durée, commune par commune : qui vient, quand, et ce que la mairie exige. Des guides locaux écrits depuis notre base de Guyancourt." },
  'Dégâts et litiges': { slug: 'degats-et-litiges', intro: "Dégâts, voyageurs difficiles, nuisances, réclamations auprès des plateformes : comment réagir, et avec quelles preuves." },
  'Contrat': { slug: 'contrat', intro: "Durée, commission, résiliation, répartition des rôles : ce qu'il faut lire dans un contrat de conciergerie avant de signer." },
  'Conseils': { slug: 'conseils', intro: "Des réponses courtes aux questions pratiques que nous posent les propriétaires." },
};
const themeOf = (p) => THEMES[p.categorie] || null;
const SEUIL_THEME = 3;
const themeActif = (cat, posts) => THEMES[cat] && posts.filter((p) => p.categorie === cat).length >= SEUIL_THEME;

// ---------- Dimensions d'une image WebP (pour width/height, sans dépendance) ----------
const dimsCache = new Map();
export function webpSize(publicPath) {
  if (dimsCache.has(publicPath)) return dimsCache.get(publicPath);
  let out = null;
  try {
    const b = fs.readFileSync(path.join(STATIC, publicPath.replace(/^\//, '')));
    const fmt = b.toString('ascii', 12, 16);
    if (fmt === 'VP8 ') out = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    else if (fmt === 'VP8L') { const n = b.readUInt32LE(21); out = { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
    else if (fmt === 'VP8X') out = { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  } catch (e) { out = null; }
  dimsCache.set(publicPath, out);
  return out;
}

// Photo de couverture : champ « image » de l'article (sinon aucune image)
const cover = (p, sizes, { eager = false } = {}) => {
  if (!p.image) return '';
  const src = p.image;
  const small = /-1200\.webp$/.test(src) ? src.replace(/-1200\.webp$/, '-640.webp') : '';
  const srcset = small ? ` srcset="${esc(small)} 640w, ${esc(src)} 1200w" sizes="${sizes}"` : '';
  return `<img src="${esc(src)}"${srcset} width="1200" height="675" alt="${esc(p.image_alt || '')}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
};
const cat = (p) => (p.categorie ? `<span class="pcat">${esc(p.categorie)}</span>` : '');

export const postCard = (p, { big = false, hx = 'h2' } = {}) => `<a class="pcard${big ? ' pcard-big' : ''}" href="/blog/${p.slug}">
  <div class="pcard-img">${cover(p, big ? '(min-width:980px) 620px, 92vw' : '(min-width:980px) 360px, (min-width:720px) 46vw, 84vw')}${cat(p)}</div>
  <div class="pcard-b">
    <p class="post-meta">${dateFr(p.date)} · ${p.lecture} min de lecture</p>
    <${hx}>${esc(p.title)}</${hx}>
    <p>${esc(p.description)}</p>
    <span class="lnk">Lire l'article ${icon('arrow')}</span>
  </div>
</a>`;
const card = postCard;

const themesNav = (posts, current = '') => {
  const actifs = Object.keys(THEMES).filter((c) => themeActif(c, posts));
  if (!actifs.length) {
    const cats = [...new Set(posts.map((p) => p.categorie).filter(Boolean))];
    return cats.length ? `<ul class="pcats" aria-label="Thèmes abordés">${cats.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : '';
  }
  const autres = [...new Set(posts.map((p) => p.categorie).filter((c) => c && !actifs.includes(c)))];
  return `<ul class="pcats" aria-label="Thèmes du blog">${actifs.map((c) => `<li${c === current ? ' class="on"' : ''}><a href="/blog/theme/${THEMES[c].slug}">${esc(c)}</a></li>`).join('')}${autres.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`;
};

const NB_INDEX = 13;

export function blogIndex(posts) {
  const bc = breadcrumbs([{ name: 'Blog', path: '/blog' }]);
  const [first, ...rest] = posts.slice(0, NB_INDEX);
  // Au-delà des derniers articles : liste complète en liens, classée par thème (tout reste à un clic du blog)
  const tous = posts.length > NB_INDEX
    ? `<section class="sec" aria-labelledby="tous-t"><div class="wrap">
  <h2 class="h2" id="tous-t">Tous les <span class="script">articles</span></h2>
  <p class="answer">Les ${posts.length} articles du blog, classés par thème. Chaque information réglementaire ou fiscale porte sa date de vérification.</p>
  <div class="parch">${[...new Set(posts.map((p) => p.categorie || 'Conseils'))]
    .map((c) => `<div><h3>${themeActif(c, posts) ? `<a href="/blog/theme/${THEMES[c].slug}">${esc(c)}</a>` : esc(c)}</h3><ul>${posts.filter((p) => (p.categorie || 'Conseils') === c).map((p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a></li>`).join('')}</ul></div>`)
    .join('')}</div>
</div></section>`
    : '';
  const body = `${bc.html}
<section class="hero blog-hero"><div class="wrap">
  <p class="kicker">Blog propriétaires</p>
  <h1 class="h1">Louer en courte durée, <span class="script">sans mauvaise surprise</span></h1>
  <p class="lead">Rentabilité, réglementation, fiscalité, gestion au quotidien : des réponses vérifiées aux questions que les propriétaires d'Île-de-France nous posent. Chaque information réglementaire porte sa date de vérification.</p>
  ${themesNav(posts)}
</div></section>
<section class="sec sec-first" aria-label="Derniers articles"><div class="wrap">
  ${first ? card(first, { big: true }) : ''}
  ${rest.length ? `<div class="pgrid">${rest.map((p) => card(p)).join('')}</div>` : ''}
</div></section>
${tous}
<section class="sec sec-gray" aria-labelledby="videos-t"><div class="wrap">
  <h2 class="h2" id="videos-t">Nos conseils <span class="script">en vidéo</span></h2>
  <p class="answer">En plus de ces articles, nous publions chaque semaine une vidéo courte sur la location courte durée, sur Instagram et sur TikTok.</p>
  ${socialBand()}
</div></section>
${finalCta()}`;
  return {
    path: '/blog',
    title: 'Blog propriétaires Airbnb Île-de-France | Rim Conciergerie',
    description: 'Guides pour propriétaires en Île-de-France : rentabilité, numéro d’enregistrement, changement d’usage, fiscalité, gestion Airbnb au quotidien.',
    body,
    schema: [bc.schema, { '@type': 'Blog', name: 'Blog Rim Conciergerie', url: `${ctx.s.url}/blog`, publisher: { '@id': `${ctx.s.url}/#entreprise` } }],
    lastmod: posts[0] ? posts[0].modif || posts[0].date : ctx.today,
  };
}

// Pages thèmes : une par thème comptant au moins 3 articles
export function blogThemes(posts) {
  return Object.keys(THEMES)
    .filter((c) => themeActif(c, posts))
    .map((c) => {
      const T = THEMES[c];
      const list = posts.filter((p) => p.categorie === c);
      const bc = breadcrumbs([{ name: 'Blog', path: '/blog' }, { name: c, path: `/blog/theme/${T.slug}` }]);
      const body = `${bc.html}
<section class="hero blog-hero"><div class="wrap">
  <p class="kicker">Blog propriétaires · ${list.length} articles</p>
  <h1 class="h1">${esc(c)} <span class="script">en location courte durée</span></h1>
  <p class="lead">${esc(T.intro)}</p>
  ${themesNav(posts, c)}
</div></section>
<section class="sec sec-first" aria-label="Articles du thème ${esc(c)}"><div class="wrap">
  <div class="pgrid">${list.map((p) => card(p)).join('')}</div>
  <p class="more"><a class="lnk" href="/blog">Tous les articles du blog ${icon('arrow')}</a></p>
</div></section>
${finalCta()}`;
      const title = `${c} location courte durée : nos guides | Rim Conciergerie`;
      return {
        path: `/blog/theme/${T.slug}`,
        title: title.length <= 60 ? title : `${c} : nos guides | Rim Conciergerie`,
        description: T.intro.length <= 155 ? T.intro : T.intro.slice(0, 152).replace(/\s+\S*$/, '') + '…',
        body,
        schema: [bc.schema, { '@type': 'CollectionPage', name: `${c} : articles du blog Rim Conciergerie`, url: `${ctx.s.url}/blog/theme/${T.slug}`, isPartOf: { '@id': `${ctx.s.url}/#site` } }],
        lastmod: list[0].modif || list[0].date,
      };
    });
}

// ---------- Encadrés : > [!CONSEIL] … dans le Markdown ----------
const NOTES = {
  CONSEIL: ['conseil', 'Conseil pratique'],
  RETENIR: ['retenir', 'À retenir'],
  ATTENTION: ['attention', 'Attention'],
  EXEMPLE: ['exemple', 'Exemple'],
  DEFINITION: ['definition', 'Définition'],
  TERRAIN: ['terrain', 'Vu sur le terrain'],
};

// Graphique à barres : bloc ```barres contenant du JSON {titre, unite, source, donnees:[{label, valeur, note}]}
function barres(json) {
  let d;
  try { d = JSON.parse(json); } catch (e) { return ''; }
  const rows = Array.isArray(d.donnees) ? d.donnees.filter((r) => typeof r.valeur === 'number') : [];
  if (!rows.length) return '';
  const max = Math.max(...rows.map((r) => r.valeur)) || 1;
  const fmt = (n) => String(n).replace('.', ',');
  return `<figure class="pbars">${d.titre ? `<figcaption class="pbars-t">${esc(d.titre)}</figcaption>` : ''}<dl>${rows
    .map((r) => `<div><dt>${esc(r.label)}</dt><dd><span class="pbar" style="--w:${Math.max(4, Math.round((r.valeur / max) * 100))}%"></span><b>${fmt(r.valeur)}${d.unite ? `&nbsp;${esc(d.unite)}` : ''}</b>${r.note ? `<small>${esc(r.note)}</small>` : ''}</dd></div>`)
    .join('')}</dl>${d.source ? `<p class="pbars-s">Source : ${esc(d.source)}</p>` : ''}</figure>`;
}

const ctaMilieu = (p, ville) => `<aside class="art-cta"><div><p class="art-cta-t">${ville ? `Un logement à ${esc(ville.ville)} ?` : 'Un logement en Île-de-France ?'}</p><p>Nous vérifions les règles de votre commune et nous vous rappelons sous 24 h.</p></div><a class="btn btn-primary" href="/estimation${ville ? `?commune=${encodeURIComponent(ville.ville)}` : ''}">Estimer mon bien ${icon('arrow')}</a></aside>`;

export function renderArticle(p) {
  const toc = [];
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const plain = text.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    if (depth === 2) {
      const id = slugify(plain).slice(0, 60);
      toc.push({ id, t: plain });
      return `<!--h2--><h2 id="${id}">${text}</h2>`;
    }
    return `<h${depth}>${text}</h${depth}>`;
  };
  renderer.blockquote = function ({ tokens }) {
    const inner = this.parser.parse(tokens);
    const m = inner.match(/^\s*<p>\[!([A-ZÉ_]+)\]\s*/);
    if (m && NOTES[m[1]]) {
      const [cls, label] = NOTES[m[1]];
      return `<aside class="note note-${cls}"><p class="note-k">${label}</p>${inner.replace(m[0], '<p>')}</aside>`;
    }
    return `<blockquote>${inner}</blockquote>`;
  };
  renderer.image = function ({ href, title, text }) {
    const d = /\.webp$/.test(href) && href.startsWith('/') ? webpSize(href) : null;
    const small = /-1200\.webp$/.test(href) ? href.replace(/-1200\.webp$/, '-640.webp') : '';
    const srcset = small && webpSize(small) ? ` srcset="${esc(small)} 640w, ${esc(href)} 1200w" sizes="(min-width:980px) 720px, 92vw"` : '';
    return `<figure class="pfig"><img src="${esc(href)}"${srcset}${d ? ` width="${d.w}" height="${d.h}"` : ''} alt="${esc(text || '')}" loading="lazy" decoding="async">${title ? `<figcaption>${esc(title)}</figcaption>` : ''}</figure>`;
  };
  renderer.code = function ({ text, lang }) {
    if (lang === 'barres') return barres(text);
    return `<pre><code>${esc(text)}</code></pre>`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const ext = /^https?:\/\//.test(href) && !href.startsWith(ctx.s.url);
    return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
  };
  let html = marked.parse(p.body, { renderer });
  // Une image seule dans un paragraphe : pas de <p> autour de la figure
  html = html.replace(/<p>(<figure class="pfig">[\s\S]*?<\/figure>)<\/p>/g, '$1');
  // Tableaux : enveloppe pour le défilement horizontal sur téléphone
  html = html.replace(/<table>/g, '<div class="ptable"><table>').replace(/<\/table>/g, '</table></div>');
  return { html, toc };
}

export function blogPost(p, posts) {
  const theme = themeOf(p);
  const themeLien = theme && themeActif(p.categorie, posts);
  const crumbs = [{ name: 'Blog', path: '/blog' }];
  if (themeLien) crumbs.push({ name: p.categorie, path: `/blog/theme/${theme.slug}` });
  crumbs.push({ name: p.title, path: `/blog/${p.slug}` });
  const bc = breadcrumbs(crumbs);
  const ville = p.ville ? ctx.villes.find((v) => v.slug === p.ville) : null;

  let { html, toc } = renderArticle(p);
  // Appel à l'action au milieu de l'article (à partir de 4 parties)
  if (toc.length >= 4) {
    const cut = Math.ceil(toc.length / 2);
    let i = 0;
    html = html.replace(/<!--h2-->/g, () => (i++ === cut ? ctaMilieu(p, ville) : ''));
  } else html = html.replace(/<!--h2-->/g, '');

  // À lire aussi : même thème d'abord, puis les plus récents
  const reste = posts.filter((x) => x.slug !== p.slug);
  const autres = [...reste.filter((x) => x.categorie === p.categorie), ...reste.filter((x) => x.categorie !== p.categorie)].slice(0, 3);
  const faq = p.faq && p.faq.length ? faqBlock(p.faq.map((f) => ({ q: f.q, a: marked.parse(f.a) })), { titre: 'En bref', script: 'vos questions' }) : null;
  const tocHtml = toc.length > 2 ? `<nav class="toc" aria-label="Sommaire"><p>${icon('doc', 'i i-s')}Sommaire</p><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.t)}</a></li>`).join('')}</ol></nav>` : '';
  const essentiel = Array.isArray(p.essentiel) && p.essentiel.length
    ? `<aside class="art-key" aria-labelledby="essentiel-t"><p class="art-key-t" id="essentiel-t">${icon('sparkle', 'i i-s')}L'essentiel</p><ul>${p.essentiel.map((e) => `<li>${marked.parseInline(String(e))}</li>`).join('')}</ul></aside>`
    : '';
  const sources = Array.isArray(p.sources) && p.sources.length
    ? `<section class="art-src" aria-labelledby="sources-t"><h2 id="sources-t">Sources</h2><ul>${p.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.nom)}</a></li>`).join('')}</ul>${p.verifie ? `<p>Informations vérifiées le ${dateFr(String(p.verifie).slice(0, 10))}. Les règles changent : reconfirmez-les auprès de votre mairie ou de l'administration avant de vous engager.</p>` : ''}</section>`
    : '';
  const utiles = `<nav class="art-links" aria-label="Nos services"><p>Nos services</p><ul>${ville ? `<li><a href="/${ville.path}">Conciergerie Airbnb à ${esc(ville.ville)}</a></li>` : ''}<li><a href="/gestion-airbnb-booking">Gestion Airbnb et Booking</a></li><li><a href="/tarifs">Tarifs de la conciergerie</a></li><li><a href="/services">Tous nos services</a></li></ul></nav>`;

  const body = `<div class="readbar" aria-hidden="true"><span></span></div>
${bc.html}
<article>
<header class="art-hero"><div class="wrap art-hero-g">
  <div class="art-hero-t">
    <p class="kicker">${themeLien ? `<a href="/blog/theme/${theme.slug}">${esc(p.categorie)}</a>` : esc(p.categorie || 'Blog propriétaires')}</p>
    <h1 class="h1">${esc(p.title)}</h1>
    <p class="lead">${esc(p.description)}</p>
    <div class="art-by"><img src="/images/equipe/nassim-avatar.webp" width="44" height="44" alt=""><div><b>Nassim RIM</b><span>Publié le ${dateFr(p.date)}${p.modif && p.modif !== p.date ? ` · mis à jour le ${dateFr(p.modif)}` : ''} · ${p.lecture} min de lecture</span></div></div>
  </div>
  ${p.image ? `<figure class="art-cover">${cover(p, '(min-width:980px) 560px, 92vw', { eager: true })}${p.image_credit ? `<figcaption>Photo : ${esc(p.image_credit)}</figcaption>` : ''}</figure>` : ''}
</div></header>
<div class="art-body"><div class="wrap art-g">
  ${tocHtml ? `<aside class="art-side">${tocHtml}</aside>` : ''}
  <div class="art-main">
    ${essentiel}
    <div class="prose prose-blog">${html}</div>
    ${sources}
    <aside class="art-box"><p class="art-box-k">${icon('home', 'i i-s')}Votre logement</p><h2>Estimez votre bien</h2><p>Dites-nous où il se trouve : nous vérifions les règles de votre commune et nous vous rappelons sous 24 h.</p><a class="btn" href="/estimation">Estimer mon bien ${icon('arrow')}</a></aside>
    ${utiles}
    <div class="art-bio"><img src="/images/equipe/nassim-studio-480.webp" width="72" height="90" alt="Nassim RIM" loading="lazy"><div><p class="art-bio-k">L'auteur</p><b>Nassim RIM, fondateur de Rim Conciergerie</b><p>Basé à Guyancourt, il gère au quotidien des logements en location courte durée en Île-de-France et répond lui-même aux questions des propriétaires.</p>${socialPills('Une vidéo par semaine :')}<a class="lnk" href="/qui-sommes-nous">Qui sommes-nous ${icon('arrow')}</a></div></div>
  </div>
</div></div>
</article>
${faq ? faq.html : ''}
${autres.length ? `<section class="sec sec-gray" aria-labelledby="autres-t"><div class="wrap"><h2 class="h2" id="autres-t">À lire <span class="script">aussi</span></h2><div class="pgrid" style="margin-top:28px">${autres.map((x) => card(x, { hx: 'h3' })).join('')}</div></div></section>` : ''}
${finalCta(ville ? { ville: ville.ville } : {})}`;
  return {
    path: `/blog/${p.slug}`,
    title: p.seo_title || `${p.title} | Rim Conciergerie`,
    ogTitle: p.title,
    description: p.description,
    body,
    pageType: 'WebPage',
    ogType: 'article',
    ogImage: p.image ? `${ctx.s.url}${p.image}` : null,
    ogH: p.image ? 675 : null,
    schema: [
      bc.schema,
      ...(faq ? [faq.schema] : []),
      {
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        dateModified: p.modif || p.date,
        inLanguage: 'fr-FR',
        wordCount: p.mots,
        ...(p.categorie ? { articleSection: p.categorie } : {}),
        author: { '@id': `${ctx.s.url}/#nassim-rim` },
        publisher: { '@id': `${ctx.s.url}/#entreprise` },
        mainEntityOfPage: `${ctx.s.url}/blog/${p.slug}`,
        image: p.image ? `${ctx.s.url}${p.image}` : `${ctx.s.url}/images/og-image.jpg`,
        ...(Array.isArray(p.sources) && p.sources.length ? { citation: p.sources.map((s) => ({ '@type': 'CreativeWork', name: s.nom, url: s.url })) } : {}),
        ...(ville ? { about: { '@type': 'City', name: ville.ville } } : {}),
      },
    ],
    lastmod: p.modif || p.date,
  };
}

export function rss(posts) {
  const s = ctx.s;
  const items = posts
    .slice(0, 30)
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${s.url}/blog/${p.slug}</link><guid>${s.url}/blog/${p.slug}</guid><pubDate>${new Date(p.date + 'T08:00:00+01:00').toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Blog Rim Conciergerie</title><link>${s.url}/blog</link><description>Guides pour propriétaires en location courte durée en Île-de-France</description><language>fr-FR</language>
${items}
</channel></rss>`;
}
