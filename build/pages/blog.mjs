// Blog propriétaires : index, articles (Markdown), flux RSS
import { marked } from 'marked';
import { ctx, esc, icon, breadcrumbs, finalCta, dateFr, faqBlock, slugify, socialBand, socialPills } from '../lib.mjs';

// Photo de couverture : champ « image » de l'article (sinon aucune image)
const cover = (p, sizes, { eager = false } = {}) => {
  if (!p.image) return '';
  const src = p.image;
  const small = /-1200\.webp$/.test(src) ? src.replace(/-1200\.webp$/, '-640.webp') : '';
  const srcset = small ? ` srcset="${esc(small)} 640w, ${esc(src)} 1200w" sizes="${sizes}"` : '';
  return `<img src="${esc(src)}"${srcset} width="1200" height="675" alt="${esc(p.image_alt || '')}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
};
const cat = (p) => (p.categorie ? `<span class="pcat">${esc(p.categorie)}</span>` : '');

const card = (p, { big = false, hx = 'h2' } = {}) => `<a class="pcard${big ? ' pcard-big' : ''}" href="/blog/${p.slug}">
  <div class="pcard-img">${cover(p, big ? '(min-width:980px) 620px, 92vw' : '(min-width:980px) 360px, (min-width:720px) 46vw, 84vw')}${cat(p)}</div>
  <div class="pcard-b">
    <p class="post-meta">${dateFr(p.date)} · ${p.lecture} min de lecture</p>
    <${hx}>${esc(p.title)}</${hx}>
    <p>${esc(p.description)}</p>
    <span class="lnk">Lire l'article ${icon('arrow')}</span>
  </div>
</a>`;

export function blogIndex(posts) {
  const bc = breadcrumbs([{ name: 'Blog', path: '/blog' }]);
  const [first, ...rest] = posts;
  const cats = [...new Set(posts.map((p) => p.categorie).filter(Boolean))];
  const body = `${bc.html}
<section class="hero blog-hero"><div class="wrap">
  <p class="kicker">Blog propriétaires</p>
  <h1 class="h1">Louer en courte durée, <span class="script">sans mauvaise surprise</span></h1>
  <p class="lead">Réglementation, dégâts, prix, fin de contrat : des réponses courtes et vérifiées aux questions que les propriétaires nous posent. Chaque information réglementaire porte sa date de vérification.</p>
  ${cats.length ? `<ul class="pcats" aria-label="Thèmes abordés">${cats.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
</div></section>
<section class="sec sec-first" aria-label="Articles"><div class="wrap">
  ${first ? card(first, { big: true }) : ''}
  ${rest.length ? `<div class="pgrid">${rest.map((p) => card(p)).join('')}</div>` : ''}
</div></section>
<section class="sec sec-gray" aria-labelledby="videos-t"><div class="wrap">
  <h2 class="h2" id="videos-t">Nos conseils <span class="script">en vidéo</span></h2>
  <p class="answer">En plus de ces articles, nous publions chaque semaine une vidéo courte sur la location courte durée, sur Instagram et sur TikTok.</p>
  ${socialBand()}
</div></section>
${finalCta()}`;
  return {
    path: '/blog',
    title: 'Blog propriétaires Airbnb Île-de-France | Rim Conciergerie',
    description: 'Guides pour propriétaires en Île-de-France : numéro d’enregistrement, changement d’usage, dégâts, tarifs, fin de contrat de conciergerie.',
    body,
    schema: [bc.schema, { '@type': 'Blog', name: 'Blog Rim Conciergerie', url: `${ctx.s.url}/blog`, publisher: { '@id': `${ctx.s.url}/#entreprise` } }],
    lastmod: posts[0] ? posts[0].modif || posts[0].date : ctx.today,
  };
}

export function blogPost(p, posts) {
  const bc = breadcrumbs([{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }]);
  // Sommaire automatique à partir des H2
  const toc = [];
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const plain = text.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    if (depth === 2) {
      const id = slugify(plain).slice(0, 60);
      toc.push({ id, t: plain });
      return `<h2 id="${id}">${text}</h2>`;
    }
    return `<h${depth}>${text}</h${depth}>`;
  };
  // Tableaux : enveloppe pour le défilement horizontal sur téléphone
  const html = marked.parse(p.body, { renderer }).replace(/<table>/g, '<div class="ptable"><table>').replace(/<\/table>/g, '</table></div>');
  const autres = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const faq = p.faq && p.faq.length ? faqBlock(p.faq.map((f) => ({ q: f.q, a: marked.parse(f.a) })), { titre: 'En bref', script: 'vos questions' }) : null;
  const tocHtml = toc.length > 2 ? `<nav class="toc" aria-label="Sommaire"><p>${icon('doc', 'i i-s')}Sommaire</p><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.t)}</a></li>`).join('')}</ol></nav>` : '';
  const body = `<div class="readbar" aria-hidden="true"><span></span></div>
${bc.html}
<article>
<header class="art-hero"><div class="wrap art-hero-g">
  <div class="art-hero-t">
    <p class="kicker">${esc(p.categorie || 'Blog propriétaires')}</p>
    <h1 class="h1">${esc(p.title)}</h1>
    <p class="lead">${esc(p.description)}</p>
    <div class="art-by"><img src="/images/equipe/nassim-avatar.webp" width="44" height="44" alt=""><div><b>Nassim RIM</b><span>Publié le ${dateFr(p.date)}${p.modif && p.modif !== p.date ? ` · mis à jour le ${dateFr(p.modif)}` : ''} · ${p.lecture} min de lecture</span></div></div>
  </div>
  ${p.image ? `<figure class="art-cover">${cover(p, '(min-width:980px) 560px, 92vw', { eager: true })}${p.image_credit ? `<figcaption>Photo : ${esc(p.image_credit)}</figcaption>` : ''}</figure>` : ''}
</div></header>
<div class="art-body"><div class="wrap art-g">
  ${tocHtml ? `<aside class="art-side">${tocHtml}</aside>` : ''}
  <div class="art-main">
    <div class="prose prose-blog">${html}</div>
    <aside class="art-box"><p class="art-box-k">${icon('home', 'i i-s')}Votre logement</p><h2>Estimez votre bien</h2><p>Dites-nous où il se trouve : nous vérifions les règles de votre commune et nous vous rappelons sous 24 h.</p><a class="btn" href="/estimation">Estimer mon bien ${icon('arrow')}</a></aside>
    <div class="art-bio"><img src="/images/equipe/nassim-studio-480.webp" width="72" height="90" alt="Nassim RIM" loading="lazy"><div><p class="art-bio-k">L'auteur</p><b>Nassim RIM, fondateur de Rim Conciergerie</b><p>Basé à Guyancourt, il gère au quotidien des logements en location courte durée en Île-de-France et répond lui-même aux questions des propriétaires.</p>${socialPills('Une vidéo par semaine :')}<a class="lnk" href="/qui-sommes-nous">Qui sommes-nous ${icon('arrow')}</a></div></div>
  </div>
</div></div>
</article>
${faq ? faq.html : ''}
${autres.length ? `<section class="sec sec-gray" aria-labelledby="autres-t"><div class="wrap"><h2 class="h2" id="autres-t">À lire <span class="script">aussi</span></h2><div class="pgrid" style="margin-top:28px">${autres.map((x) => card(x, { hx: 'h3' })).join('')}</div></div></section>` : ''}
${finalCta()}`;
  return {
    path: `/blog/${p.slug}`,
    title: p.seo_title || `${p.title} | Rim Conciergerie`,
    ogTitle: p.title,
    description: p.description,
    body,
    pageType: 'WebPage',
    ogType: 'article',
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
        ...(p.categorie ? { articleSection: p.categorie } : {}),
        author: { '@id': `${ctx.s.url}/#nassim-rim` },
        publisher: { '@id': `${ctx.s.url}/#entreprise` },
        mainEntityOfPage: `${ctx.s.url}/blog/${p.slug}`,
        image: p.image ? `${ctx.s.url}${p.image}` : `${ctx.s.url}/images/og-image.jpg`,
      },
    ],
    lastmod: p.modif || p.date,
  };
}

export function rss(posts) {
  const s = ctx.s;
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${s.url}/blog/${p.slug}</link><guid>${s.url}/blog/${p.slug}</guid><pubDate>${new Date(p.date + 'T08:00:00+01:00').toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Blog Rim Conciergerie</title><link>${s.url}/blog</link><description>Guides pour propriétaires en location courte durée en Île-de-France</description><language>fr-FR</language>
${items}
</channel></rss>`;
}
