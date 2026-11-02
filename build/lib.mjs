// Rim Conciergerie — fonctions communes du générateur (gabarits, composants, JSON-LD)
// Aucune dépendance externe ici : tout le HTML est produit en texte, lisible sans JavaScript.

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const slugify = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const dateFr = (iso) => {
  const d = new Date(iso + (String(iso).length <= 10 ? 'T12:00:00' : ''));
  return `${d.getDate() === 1 ? '1er' : d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
};
export const dateCourte = (iso) => {
  const d = new Date(iso + (String(iso).length <= 10 ? 'T12:00:00' : ''));
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

// ---------- Icônes (un seul jeu, au trait) ----------
const P = {
  check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 006 6L15 14l5 2v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  sync: '<path d="M20 11a8 8 0 00-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0014.3 4.9L20 16"/><path d="M20 21v-5h-5"/>',
  trend: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/><path d="M15 8h5v5"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  star: '<path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  euro: '<path d="M17 6.5A7 7 0 1017 17.5"/><path d="M4 10.5h9M4 13.5h9"/>',
  message: '<path d="M4 5h16v11H9l-5 4z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 015 5l-9 9a2.1 2.1 0 01-3-3l9-9a4 4 0 01-2-2z"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  bank: '<path d="M3 10l9-6 9 6M5 10v8M19 10v8M9 10v8M15 10v8M3 20h18"/>',
  broom: '<path d="M14 3l-3 8M7 12h8l2 9H5z"/><path d="M9 16v5M13 16v5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M10 13l2 2 3-4"/>',
};
export const icon = (name, cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

// Logo officiel WhatsApp (glyphe de la marque, couleur #25D366 portée par le fond du bouton)
export const waIcon = (cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

export const googleG = `<svg class="g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45 24c0-1.6-.1-3.1-.4-4.5H24v9h11.8c-.5 2.7-2 5-4.3 6.6v5.5h7C42.6 36.7 45 30.9 45 24z"/><path fill="#34A853" d="M24 46c5.8 0 10.6-1.9 14.2-5.2l-7-5.5c-1.9 1.3-4.4 2.1-7.2 2.1-5.5 0-10.2-3.7-11.9-8.7H4.9v5.7C8.5 41.6 15.7 46 24 46z"/><path fill="#FBBC05" d="M12.1 28.7c-.4-1.3-.7-2.6-.7-4s.3-2.7.7-4V15H4.9C3.5 17.7 2.7 20.8 2.7 24s.8 6.3 2.2 9l7.2-4.3z"/><path fill="#EA4335" d="M24 11.4c3.1 0 5.9 1.1 8.1 3.2l6.1-6.1C34.6 5.1 29.8 3 24 3 15.7 3 8.5 7.4 4.9 15l7.2 5.7c1.7-5 6.4-8.7 11.9-8.7z"/></svg>`;

const stars = `<span class="stars" aria-hidden="true">${'<svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"/></svg>'.repeat(5)}</span>`;

// ---------- Contexte global (réglages, communes, villes) ----------
export const ctx = { s: null, communes: [], villes: [], depts: [], cssFile: '', jsFile: '', today: '' };

export const waLink = (msg = 'Bonjour, je souhaite des informations sur la gestion de mon bien.') =>
  `https://wa.me/${ctx.s.whatsapp}?text=${encodeURIComponent(msg)}`;

// ---------- Preuves (chiffres autorisés uniquement, avec source) ----------
export function proofGoogle(cls = '') {
  const s = ctx.s;
  return `<a class="proof ${cls}" href="${esc(s.avis_google_lien)}" target="_blank" rel="noopener">${googleG}<span><b>${esc(s.avis_google_note)}</b> ${stars}<span class="proof-t"> sur Google · ${s.avis_google_nombre} avis</span></span></a>`;
}
export function proofAirbnb(cls = '') {
  const s = ctx.s;
  const inner = `<svg class="ab" viewBox="-1 -1 26 26" aria-hidden="true"><path fill="currentColor" d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z"/></svg><span><b>${esc(s.airbnb_note)}</b> ${stars}<span class="proof-t"> sur Airbnb · ${s.airbnb_evaluations} évaluations${s.airbnb_superhote ? ' · Superhôte' : ''}</span></span>`;
  return s.airbnb_profil_lien
    ? `<a class="proof ${cls}" href="${esc(s.airbnb_profil_lien)}" target="_blank" rel="noopener">${inner}</a>`
    : `<span class="proof ${cls}">${inner}</span>`;
}
export const proofs = (cls = '') => `<div class="proofs ${cls}">${proofGoogle()}${proofAirbnb()}</div>`;

// ---------- Formulaire « Votre bien est-il éligible ? » (étape 1 du tunnel) ----------
export function communeList() {
  const all = [...ctx.communes].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  return `<datalist id="liste-communes">${all.map((c) => `<option value="${esc(c.nom)}"></option>`).join('')}</datalist>`;
}
export const TYPES = ['Studio', 'Appartement T2', 'Appartement T3 et plus', 'Maison'];

export function microForm({ id = 'eligible', titre = 'Estimez votre bien', ville = '', note = true, h = 'h2' } = {}) {
  return `<form class="micro card" action="/estimation" method="get" data-event="begin_estimation" aria-labelledby="${id}-t">
  <${h} class="micro-t" id="${id}-t">${esc(titre)}</${h}>
  <p class="micro-sub">Deux questions. Nous vous rappelons sous 24 h, sans engagement.</p>
  <div class="micro-f">
    <label for="${id}-c">Commune du logement</label>
    <input type="text" id="${id}-c" name="commune" list="liste-communes" autocomplete="address-level2" placeholder="Ex. Versailles" value="${esc(ville)}" required>
  </div>
  <div class="micro-f">
    <label for="${id}-t2">Type de bien</label>
    <select id="${id}-t2" name="type" required><option value="">Choisir le type</option>${TYPES.map((t) => `<option>${t}</option>`).join('')}</select>
  </div>
  <button class="btn btn-primary btn-block" type="submit">Estimer mon bien ${icon('arrow')}</button>
  ${note ? `<p class="micro-note">${icon('lock', 'i i-s')}Gratuit · Réponse sous 24 h</p>` : ''}
</form>`;
}

export const answer = (t) => `<p class="answer">${t}</p>`;

export function faqBlock(items, { id = 'faq', titre = 'Questions fréquentes', script = '', intro = '' } = {}) {
  const html = `<section class="sec sec-gray" id="${id}" aria-labelledby="${id}-t"><div class="wrap narrow">
  <h2 class="h2" id="${id}-t">${titre}${script ? ` <span class="script">${script}</span>` : ''}</h2>
  ${intro ? answer(intro) : ''}
  <div class="faq">${items
    .map(
      (it) => `<details><summary><span>${esc(it.q)}</span><span class="pm" aria-hidden="true"></span></summary><div class="faq-a">${it.a}</div></details>`
    )
    .join('')}</div></div></section>`;
  const schema = {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() },
    })),
  };
  return { html, schema };
}

export function breadcrumbs(items) {
  // items: [{name, path}] — l'accueil est ajouté automatiquement
  const all = [{ name: 'Accueil', path: '/' }, ...items];
  const html = `<nav class="crumbs wrap" aria-label="Fil d'Ariane"><ol>${all
    .map((it, i) =>
      i === all.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${it.path}">${esc(it.name)}</a></li>`
    )
    .join('')}</ol></nav>`;
  const schema = {
    '@type': 'BreadcrumbList',
    itemListElement: all.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: ctx.s.url + (it.path === '/' ? '/' : it.path) })),
  };
  return { html, schema };
}

export const bienImg = (b, sizes = '(min-width: 900px) 360px, 92vw', lazy = true) =>
  b.photo
    ? `<img src="${esc(b.photo)}" width="640" height="426" alt="${esc(b.alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async">`
    : `<img src="/images/biens/${b.image}-640.webp" srcset="/images/biens/${b.image}-640.webp 640w, /images/biens/${b.image}-${b.largeur || 1200}.webp ${b.largeur || 1200}w" sizes="${sizes}" width="640" height="426" alt="${esc(b.alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;

// Note Airbnb du logement et badge « Coup de cœur voyageurs » (seulement si renseignés dans /admin)
const starPath = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.7l7.1-.6z"/></svg>';
export const bienRate = (b) => (b.note_airbnb && b.avis_airbnb ? `<span class="b-rate">${starPath}${esc(b.note_airbnb)} · ${b.avis_airbnb} avis Airbnb</span>` : '');
export const bienBadge = (b) => (b.coup_de_coeur ? `<span class="b-badge">Coup de cœur voyageurs</span>` : '');

export function bienCard(b, { lazy = true } = {}) {
  return `<article class="bien card">
  <div class="bien-img">${bienImg(b, undefined, lazy)}${bienBadge(b)}</div>
  <div class="bien-b">
    <p class="bien-loc">${icon('pin', 'i i-s')}${esc(b.ville)}${b.departement ? ` (${esc(b.departement)})` : ''}</p>
    <h3 class="bien-t">${esc(b.titre)}</h3>
    ${bienRate(b)}
    <p class="bien-d">${esc(b.resume)}</p>
    ${b.tags ? `<ul class="tags">${b.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  </div>
</article>`;
}

export function finalCta({ titre = 'Et si vous récupériez', script = 'votre temps ?', texte = 'Dites-nous où se trouve votre logement. Nous vous rappelons sous 24 h pour en parler, sans engagement.', ville = '' } = {}) {
  return `<section class="sec final" id="contact" aria-labelledby="final-t"><div class="wrap final-g">
  <div class="final-txt">
    <h2 class="h2" id="final-t">${titre} <span class="script">${script}</span></h2>
    <p class="lead">${texte}</p>
    ${proofs('proofs-col')}
    <p class="final-alt">Vous préférez écrire ? <a href="${waLink()}" target="_blank" rel="noopener" class="lnk-wa">${waIcon('i i-s')}WhatsApp</a> ou <a href="tel:${ctx.s.telephone_e164}">${ctx.s.telephone_affiche}</a></p>
  </div>
  ${microForm({ id: 'cta', ville })}
</div></section>`;
}

export const googleReviews = () => {
  const avis = [
    "Rim Conciergerie s'occupe de notre logement depuis plusieurs mois. Nous sommes satisfaits de sa réactivité, nos clients aussi !",
    'Service au top ! Professionnels, réactifs et toujours disponibles. Mon logement est entre de bonnes mains, et les voyageurs sont ravis. Je recommande vivement cette conciergerie !',
    "J'ai récemment confié la gestion de ma location à RIM Conciergerie, et franchement, c'était top, l'équipe est super pro et s'est occupée de tout, de l'annonce aux voyageurs, un réel gagne temps ! Je recommande vivement",
  ];
  return `<div class="reviews">${avis
    .map(
      (a) => `<a class="review rv card" href="${esc(ctx.s.avis_google_lien)}" target="_blank" rel="noopener"><span class="review-stars">${stars}</span><blockquote>${esc(a)}</blockquote><span class="review-src">${googleG}Avis publié sur Google</span></a>`
    )
    .join('')}</div>`;
};

// Deux cartes de score (Google, Airbnb), façon grand chiffre
// Logos officiels Instagram et TikTok (Simple Icons)
export const igIcon = (cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>`;
export const ttIcon = (cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`;
const handle = (u) => '@' + (u || '').replace(/\/+$/, '').split('/').pop().replace(/^@/, '');

// Bloc « Suivez-nous » : deux grandes cartes Instagram et TikTok
export const socialBand = () => {
  const s = ctx.s;
  const acc = esc(s.reseaux_accroche || 'Une vidéo chaque semaine sur la location courte durée');
  return `<div class="socb">
  <a class="soc soc-ig" href="${esc(s.instagram)}" target="_blank" rel="noopener"><span class="soc-ic">${igIcon()}</span><span class="soc-t"><small>Instagram</small><b>${esc(handle(s.instagram))}</b><span>${acc}</span></span><span class="soc-go">Suivre ${icon('arrow', 'i i-s')}</span></a>
  <a class="soc soc-tt" href="${esc(s.tiktok)}" target="_blank" rel="noopener"><span class="soc-ic">${ttIcon()}</span><span class="soc-t"><small>TikTok</small><b>${esc(handle(s.tiktok))}</b><span>${acc}</span></span><span class="soc-go">Suivre ${icon('arrow', 'i i-s')}</span></a>
</div>`;
};

// Petites pastilles « Suivez-nous »
export const socialPills = (label = 'Nos conseils en vidéo chaque semaine :') => {
  const s = ctx.s;
  return `<p class="socp"><span>${label}</span><a class="socp-ig" href="${esc(s.instagram)}" target="_blank" rel="noopener" aria-label="Instagram de Rim Conciergerie">${igIcon('i i-s')}Instagram</a><a class="socp-tt" href="${esc(s.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok de Rim Conciergerie">${ttIcon('i i-s')}TikTok</a></p>`;
};

// Logo Airbnb (glyphe)
export const abLogo = (cls = 'ab') => `<svg class="${cls}" viewBox="-1 -1 26 26" aria-hidden="true"><path fill="currentColor" d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z"/></svg>`;

// Bandeau « Avis Google » : séparateur avec logo, citations, bouton vers la fiche (sans répéter la note)
export const googleBand = () => {
  const s = ctx.s;
  const gWord = '<span class="gw" aria-label="Google"><b style="color:#4285F4">G</b><b style="color:#EA4335">o</b><b style="color:#FBBC05">o</b><b style="color:#4285F4">g</b><b style="color:#34A853">l</b><b style="color:#EA4335">e</b></span>';
  return `<div class="rband rband-g">
  <div class="rsep"><span class="rsep-l"></span><span class="rsep-c">${googleG}<span>Ils nous ont laissé un avis sur ${gWord}</span></span><span class="rsep-l"></span></div>
  ${googleReviews()}
  <p class="rband-cta"><a class="btn btn-g" href="${esc(s.avis_google_lien)}" target="_blank" rel="noopener">${googleG}Lire tous nos avis sur Google ${icon('arrow')}</a></p>
</div>`;
};

// Avis Airbnb sélectionnés (content/reglages/avis-airbnb.json)
export const airbnbBand = (avis, { limit = 6 } = {}) => {
  const s = ctx.s;
  const list = (avis || []).slice(0, limit);
  if (!list.length) return '';
  const ini = (n) => esc(n.trim()[0] || '?');
  return `<div class="rband rband-a">
  <div class="rsep"><span class="rsep-l"></span><span class="rsep-c rsep-a">${abLogo()}<span>Ce que disent les voyageurs sur <b class="aw">airbnb</b></span></span><span class="rsep-l"></span></div>
  <div class="ab-head"><span class="ab-sh">${icon('star', 'i i-s')}Superhôte</span><span class="ab-m">${s.airbnb_evaluations} évaluations voyageurs${s.airbnb_annees ? ` · ${s.airbnb_annees} ans d'activité` : ''}</span></div>
  <div class="abr">${list
    .map(
      (a) => `<figure class="abr-c"><blockquote>${esc(a.texte)}</blockquote><figcaption><span class="abr-av">${ini(a.prenom)}</span><span class="abr-who"><b>${esc(a.prenom)}</b><small>${[a.lieu, a.date].filter(Boolean).map(esc).join(' · ')}${a.traduit ? ` · traduit de l'${esc(a.traduit)}` : ''}</small></span><span class="abr-st" aria-label="5 étoiles sur 5">${'★'.repeat(5)}</span></figcaption></figure>`
    )
    .join('')}</div>
  ${s.airbnb_profil_lien ? `<p class="rband-cta"><a class="btn btn-ab" href="${esc(s.airbnb_profil_lien)}" target="_blank" rel="noopener">${abLogo()}Voir notre profil Airbnb ${icon('arrow')}</a></p>` : ''}
</div>`;
};

export const scoreCards = () => {
  const s = ctx.s;
  return `<div class="scores">
  <a class="score card" href="${esc(s.avis_google_lien)}" target="_blank" rel="noopener"><span class="score-n">${esc(s.avis_google_note)}<small>/5</small></span><span class="score-m"><span class="score-s">${googleG}${stars}</span><span><b>${s.avis_google_nombre} avis</b> sur Google</span></span><span class="score-go">Voir ${icon('arrow', 'i i-s')}</span></a>
  <${s.airbnb_profil_lien ? `a href="${esc(s.airbnb_profil_lien)}" target="_blank" rel="noopener"` : 'div'} class="score card"><span class="score-n">${esc(s.airbnb_note)}<small>/5</small></span><span class="score-m"><span class="score-s"><svg class="ab" viewBox="-1 -1 26 26" aria-hidden="true"><path fill="currentColor" d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z"/></svg>${stars}</span><span><b>${s.airbnb_evaluations} évaluations</b> sur Airbnb${s.airbnb_superhote ? ' · Superhôte' : ''}</span></span></${s.airbnb_profil_lien ? 'a' : 'div'}>
</div>`;
};

export function videoTestimonials(list, slots = 5) {
  const cards = list.slice(0, slots).map((t) => {
    const src = t.youtube ? `https://www.youtube-nocookie.com/embed/${esc(t.youtube)}?autoplay=1&rel=0` : esc(t.video);
    return `<figure class="vcard">
  <button type="button" class="vplay" data-${t.youtube ? 'yt' : 'src'}="${src}" aria-label="Lire le témoignage vidéo de ${esc(t.prenom)}, ${esc(t.ville)}">
    <img src="${esc(t.vignette)}" alt="" width="540" height="960" loading="lazy" decoding="async">
    <span class="pbtn">${icon('play')}</span>
    <span class="vmeta"><strong>${esc(t.prenom)}</strong><span class="vtags"><span class="pk">${esc(t.ville)}</span><span>${esc(t.bien)}</span></span></span>
  </button>
</figure>`;
  });
  while (cards.length < slots)
    cards.push(`<figure class="vcard"><div class="vslot" role="img" aria-label="Témoignage vidéo à venir"><span class="pbtn">${icon('play')}</span><span class="vslot-t">Témoignage<br>à venir</span></div></figure>`);
  return `<div class="vgrid">${cards.join('')}</div>`;
}

// ---------- JSON-LD commun ----------
export function orgGraph() {
  const s = ctx.s;
  const sameAs = [s.instagram, s.tiktok, s.youtube, s.facebook, s.fiche_google_lien, s.airbnb_profil_lien].filter(Boolean);
  const areas = [
    { '@type': 'City', name: 'Paris' },
    { '@type': 'AdministrativeArea', name: 'Yvelines' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-Seine' },
    { '@type': 'AdministrativeArea', name: 'Val-de-Marne' },
    { '@type': 'AdministrativeArea', name: 'Essonne' },
    { '@type': 'AdministrativeArea', name: 'Seine-et-Marne' },
    { '@type': 'AdministrativeArea', name: 'Seine-Saint-Denis' },
    { '@type': 'AdministrativeArea', name: "Val-d'Oise" },
    { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    ...ctx.villes.filter((v) => v.ville !== 'Paris').map((v) => ({ '@type': 'City', name: v.ville })),
  ];
  return [
    {
      '@type': 'LocalBusiness',
      '@id': `${s.url}/#entreprise`,
      name: s.nom,
      slogan: s.slogan,
      description:
        "Conciergerie Airbnb et Booking basée à Guyancourt (Yvelines). Création des annonces, prix ajustés chaque jour, messagerie voyageurs 24 h/24, ménage et linge coordonnés, vidéo horodatée à chaque ménage. Les revenus sont versés directement au propriétaire.",
      url: `${s.url}/`,
      logo: `${s.url}/images/logo-rim-conciergerie-carre.png`,
      image: [`${s.url}/images/og-image.jpg`, `${s.url}/images/biens/sejour-luxe-guyancourt-1200.webp`],
      telephone: s.telephone_e164,
      email: s.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: s.adresse_rue,
        postalCode: s.adresse_cp,
        addressLocality: s.adresse_ville,
        addressRegion: 'Île-de-France',
        addressCountry: 'FR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: s.latitude, longitude: s.longitude },
      founder: { '@id': `${s.url}/#nassim-rim` },
      areaServed: areas,
      knowsAbout: ['Conciergerie Airbnb', 'Location courte durée', 'Meublé de tourisme', "Numéro d'enregistrement", "Changement d'usage", 'Revenue management'],
      sameAs,
      priceRange: '20 % à 25 % des recettes locatives nettes',
    },
    { '@type': 'Person', '@id': `${s.url}/#nassim-rim`, name: 'Nassim RIM', jobTitle: 'Fondateur', worksFor: { '@id': `${s.url}/#entreprise` }, sameAs: [s.instagram] },
    { '@type': 'WebSite', '@id': `${s.url}/#site`, url: `${s.url}/`, name: s.nom, inLanguage: 'fr-FR', publisher: { '@id': `${s.url}/#entreprise` } },
  ];
}

// ---------- Mise en page ----------
const NAV = [
  ['/services', 'Services'],
  ['/tarifs', 'Tarifs'],
  ['/avis', 'Avis'],
  ['/blog', 'Blog'],
  ['/qui-sommes-nous', 'À propos'],
];

function header(path) {
  return `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-head"><div class="wrap head-in">
  <a class="brand" href="/" aria-label="Rim Conciergerie, accueil"><img src="/images/logo-rim-conciergerie-96.webp" width="85" height="48" alt="Rim Conciergerie"></a>
  <nav class="nav" aria-label="Navigation principale"><ul>${NAV.map(
    ([h, l]) => `<li><a href="${h}"${path === h || (h !== '/' && path.startsWith(h + '/')) ? ' aria-current="page"' : ''}>${l}</a></li>`
  ).join('')}</ul></nav>
  <a class="btn btn-primary btn-sm head-cta" href="/estimation">Estimer mon bien</a>
  <details class="burger"><summary aria-label="Ouvrir le menu">${icon('menu')}${icon('close', 'i i-x')}</summary>
    <div class="mnav"><ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}<li><a href="/gestion-airbnb-booking">Gestion Airbnb &amp; Booking</a></li></ul>
    <a class="btn btn-primary btn-block" href="/estimation">Estimer mon bien</a></div>
  </details>
</div></header>`;
}

function footer() {
  const s = ctx.s;
  const top = ['guyancourt', 'versailles', 'montigny-le-bretonneux', 'paris', 'boulogne-billancourt', 'montrouge', 'orly', 'massy'];
  const villes = top.map((sl) => ctx.villes.find((v) => v.slug === sl)).filter(Boolean);
  const year = ctx.today.slice(0, 4);
  return `<footer class="site-foot"><div class="wrap">
  <div class="foot-g">
    <div class="foot-brand">
      <a class="brand" href="/"><img src="/images/logo-rim-conciergerie-96.webp" width="85" height="48" alt="Rim Conciergerie" loading="lazy"></a>
      <p class="foot-slogan">${esc(s.slogan)}</p>
      <address class="nap"><b>${esc(s.nom)}</b><br>${esc(s.adresse_ville)} (${esc(s.adresse_cp)})<br><a href="tel:${s.telephone_e164}">${esc(s.telephone_affiche)}</a><br><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></address>
      <ul class="social">
        <li><a class="fsoc" href="${esc(s.instagram)}" target="_blank" rel="noopener">${igIcon('i i-s')}Instagram</a></li>
        <li><a class="fsoc" href="${esc(s.tiktok)}" target="_blank" rel="noopener">${ttIcon('i i-s')}TikTok</a></li>
        <li><a href="${esc(s.youtube)}" target="_blank" rel="noopener">YouTube</a></li>
        <li><a href="${esc(s.fiche_google_lien)}" target="_blank" rel="noopener">Fiche Google</a></li>
      </ul>
    </div>
    <div><h2 class="foot-h">Conciergerie</h2><ul>
      <li><a href="/gestion-airbnb-booking">Gestion Airbnb &amp; Booking</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/tarifs">Tarifs</a></li>
      <li><a href="/avis">Avis propriétaires</a></li>
      <li><a href="/qui-sommes-nous">Qui sommes-nous</a></li>
      <li><a href="/estimation">Estimer mon bien</a></li>
    </ul></div>
    <div><h2 class="foot-h">Villes</h2><ul>
      ${villes.map((v) => `<li><a href="/${v.path}">Conciergerie Airbnb ${esc(v.ville)}</a></li>`).join('')}
    </ul></div>
    <div><h2 class="foot-h">Ressources</h2><ul>
      <li><a href="/blog">Blog propriétaires</a></li>
      <li><a href="/mentions-legales">Mentions légales</a></li>
      <li><a href="/confidentialite">Confidentialité</a></li>
      <li><a href="/cookies">Cookies</a></li>
      ${s.ga4_id || s.meta_pixel_id ? '<li><button type="button" class="lnk-btn" data-consent-open>Gérer les cookies</button></li>' : ''}
    </ul></div>
  </div>
  <p class="foot-legal">© ${year} ${esc(s.nom)} · Nassim RIM, entrepreneur individuel · SIRET ${esc(s.siret)} · Médiateur de la consommation : ${esc(s.mediateur_nom)}</p>
</div></footer>
<div class="mbar" role="region" aria-label="Contact rapide"><a class="btn btn-primary" href="/estimation">Estimer mon bien</a><a class="btn btn-wa-ic" href="${waLink()}" target="_blank" rel="noopener" aria-label="Écrire sur WhatsApp">${waIcon()}</a></div>
<a class="wa-fab" href="${waLink()}" target="_blank" rel="noopener" aria-label="Une question ? Écrivez-nous sur WhatsApp">${waIcon()}<span class="wa-tip" aria-hidden="true">Une question ?</span></a>`;
}

export function layout(page) {
  const s = ctx.s;
  const canonical = s.url + (page.path === '/' ? '/' : page.path);
  const og = page.ogImage || `${s.url}/images/og-image.jpg`;
  const graph = [...orgGraph(), ...(page.schema || [])];
  if (!page.noindex) {
    graph.push({
      '@type': page.pageType || 'WebPage',
      '@id': canonical + '#page',
      url: canonical,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${s.url}/#site` },
      inLanguage: 'fr-FR',
      ...(page.lastmod ? { dateModified: page.lastmod } : {}),
    });
  }
  const consent = s.ga4_id || s.meta_pixel_id;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(s.nom)}">
<meta property="og:locale" content="fr_FR">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Rim Conciergerie, conciergerie Airbnb en Île-de-France">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
<link rel="icon" href="/favicon-96.png" sizes="96x96" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
${page.preloadImage ? `<link rel="preload" as="image" href="${page.preloadImage}" fetchpriority="high">` : ''}
<link rel="stylesheet" href="/assets/${ctx.cssFile}">
<link rel="alternate" type="application/rss+xml" title="Blog Rim Conciergerie" href="/blog/rss.xml">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>
</head>
<body class="${page.bodyClass || ''}"${consent ? ` data-ga4="${esc(s.ga4_id)}" data-pixel="${esc(s.meta_pixel_id)}"` : ''}${page.event ? ` data-page-event="${page.event}"` : ''}>
${header(page.path)}
<main id="contenu">
${page.body}
${communeList()}
</main>
${footer()}
${consent ? `<div class="consent" role="dialog" aria-labelledby="consent-t" aria-describedby="consent-d" hidden><p class="consent-t" id="consent-t">Mesure d'audience</p><p id="consent-d">Avec votre accord, nous mesurons les visites (Google Analytics${s.meta_pixel_id ? ', Meta' : ''}) pour savoir quelles pages aident les propriétaires. <a href="/cookies">En savoir plus</a></p><div class="consent-b"><button type="button" class="btn btn-ghost" data-consent="0">Refuser</button><button type="button" class="btn btn-ghost" data-consent="1">Accepter</button></div></div>` : ''}
<script src="/assets/${ctx.jsFile}" defer></script>
</body>
</html>`;
}

// Utilitaire : section standard
export const sec = (id, titre, inner, { gray = false, narrow = false, script = '', kicker = '', intro = '', cls = '' } = {}) =>
  `<section class="sec${gray ? ' sec-gray' : ''} ${cls}" id="${id}" aria-labelledby="${id}-t"><div class="wrap${narrow ? ' narrow' : ''}">
  ${kicker ? `<p class="kicker">${kicker}</p>` : ''}<h2 class="h2" id="${id}-t">${titre}${script ? ` <span class="script">${script}</span>` : ''}</h2>
  ${intro ? answer(intro) : ''}
  ${inner}
</div></section>`;

// ---------- Vidéo de présentation (hébergée sur le site, lue dans la page au clic) ----------
export function presentationVideo({ sizes = '(min-width:980px) 760px, 92vw', alt = 'Nassim RIM présente Rim Conciergerie en vidéo', cap = 'Lancer la vidéo · 1 min 20' } = {}) {
  const s = ctx.s;
  const img = `<img src="/images/equipe/nassim-video-640.webp" srcset="/images/equipe/nassim-video-640.webp 640w, /images/equipe/nassim-video-1280.webp 1280w" sizes="${sizes}" width="1280" height="720" alt="${esc(alt)}" loading="lazy" decoding="async"><span class="pbtn">${icon('play')}</span><span class="vcap">${esc(cap)}</span>`;
  if (s.video_presentation_mp4) {
    return `<a class="vfacade" href="${esc(s.video_presentation_mp4)}" data-mp4="${esc(s.video_presentation_mp4)}"${s.video_presentation_mp4_mobile ? ` data-mp4-sd="${esc(s.video_presentation_mp4_mobile)}"` : ''} data-poster="/images/equipe/nassim-video-1280.webp" aria-label="Lire la vidéo de présentation de Rim Conciergerie">${img}</a>`;
  }
  if (s.video_presentation_youtube) {
    const yt = esc(s.video_presentation_youtube);
    return `<a class="vfacade" href="https://www.youtube.com/watch?v=${yt}" data-yt="https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&amp;rel=0&amp;playsinline=1" aria-label="Lire la vidéo de présentation de Rim Conciergerie">${img}</a>`;
  }
  return '';
}
export function presentationVideoSchema() {
  const s = ctx.s;
  if (!s.video_presentation_mp4 || !s.video_presentation_date) return null;
  return {
    '@type': 'VideoObject',
    '@id': `${s.url}/#video-presentation`,
    name: 'Présentation de Rim Conciergerie',
    description: "Nassim RIM présente Rim Conciergerie, conciergerie Airbnb et Booking basée à Guyancourt : gestion des annonces, des voyageurs, du ménage et des imprévus pour les propriétaires en Île-de-France.",
    thumbnailUrl: `${s.url}/images/equipe/nassim-video-1280.webp`,
    uploadDate: s.video_presentation_date,
    ...(s.video_presentation_duree ? { duration: s.video_presentation_duree } : {}),
    contentUrl: `${s.url}${s.video_presentation_mp4}`,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${s.url}/#entreprise` },
  };
}

// ---------- Téléphone mis en avant (accueil) ----------
export const heroTel = () => `<a class="hero-tel" href="tel:${ctx.s.telephone_e164}" data-track="click_tel"><span class="hero-tel-ic">${icon('phone')}</span><span class="hero-tel-t"><small>Une question ? Appelez-nous</small><b>${esc(ctx.s.telephone_affiche)}</b></span></a>`;
