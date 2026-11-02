// Pages principales : accueil, gestion Airbnb & Booking, services, tarifs
import { ctx, esc, icon, waIcon, bienImg, answer, faqBlock, breadcrumbs, bienCard, finalCta, googleReviews, videoTestimonials, microForm, proofs, sec, waLink, scoreCards, bienRate, bienBadge, googleBand, socialPills, presentationVideo, presentationVideoSchema } from '../lib.mjs';

export const VERIF = '31/10/2026';

// ---------- Contenus partagés ----------
export const ASSIETTE =
  "Recettes locatives nettes : les sommes versées par les plateformes et les voyageurs, moins les commissions des plateformes, le coût du ménage et de la blanchisserie, la taxe de séjour et les dépôts de garantie.";

export const pricesHtml = () => `<div class="po card">
  <div class="po-l"><p class="po-k">Gestion complète</p><p class="po-v">20 à 25 %</p><p class="po-s">des recettes locatives nettes</p></div>
  <ul class="po-r">
    <li>${icon('check')}<span>Selon votre logement et le nombre de biens confiés</span></li>
    <li>${icon('check')}<span>Un tarif dégressif</span></li>
    <li>${icon('check')}<span>Aucun abonnement, aucun frais fixe</span></li>
    <li>${icon('check')}<span>Pas de réservation, pas de commission</span></li>
  </ul>
</div>
<p class="note">${ASSIETTE} ${esc(ctx.s.mention_tva)}</p>`;

export const FAQ_GENERALE = () => [
  {
    q: 'Ai-je le droit de louer mon bien en courte durée dans ma commune ?',
    a: `<p>Cela dépend de trois règles : l'enregistrement du meublé, le changement d'usage si le logement n'est pas votre résidence principale, et le plafond de nuitées si c'est votre résidence principale. Elles varient d'une commune à l'autre. Avant de signer, nous les vérifions avec vous, ainsi que votre règlement de copropriété.</p><p class="verif">Vérifié le ${VERIF}. À reconfirmer auprès de la mairie de votre commune.</p>`,
  },
  {
    q: "Qu'est-ce que le numéro d'enregistrement, et qui s'en charge ?",
    a: `<p>C'est le numéro que chaque annonce de meublé de tourisme doit afficher. L'obligation est généralisée à toute la France depuis mai 2026. Au ${VERIF}, le téléservice national n'est pas encore ouvert : on passe par la procédure de la mairie quand elle existe. La déclaration se fait à votre nom ; nous vous montrons la démarche et ajoutons le numéro à l'annonce. <a href="/blog/numero-enregistrement-meuble-de-tourisme-2026">Lire notre guide</a>.</p>`,
  },
  {
    q: 'Que se passe-t-il si un voyageur abîme le logement ?',
    a: `<p>À chaque ménage, le logement est filmé à l'arrivée et au départ de l'équipe : la vidéo horodatée montre son état avant et après le séjour. En cas de dégât, nous vous prévenons sous 72 h avec photos, nous déclarons l'incident à la plateforme et nous montons la demande d'indemnisation (AirCover chez Airbnb, dispositif de Booking.com). Nous ne sommes pas assureur : l'indemnisation dépend des conditions de chaque plateforme et de votre propre assurance.</p>`,
  },
  {
    q: 'Comment je garde la main sur mon bien ?',
    a: `<p>Vos annonces sont publiées sur vos propres comptes Airbnb et Booking : vous voyez les réservations, le calendrier et les versements en temps réel. Vous fixez un prix plancher par nuit, en dessous duquel nous ne descendons jamais. Chaque mois, notre facture reprend les séjours et le calcul de la commission.</p>`,
  },
  {
    q: 'Combien coûte votre conciergerie ?',
    a: `<p>De 20 à 25 % des recettes locatives nettes, selon votre logement et le nombre de biens que vous nous confiez. Le tarif est dégressif, sans abonnement ni frais fixes. Le ménage et la blanchisserie sont facturés à part, et sont en pratique financés par les frais de ménage payés par les voyageurs. <a href="/tarifs">Voir le détail des tarifs</a>.</p>`,
  },
  {
    q: 'Comment et quand je reçois mes revenus ?',
    a: `<p>Airbnb et Booking vous versent directement les loyers, sur votre compte bancaire, selon leur propre calendrier. Rim Conciergerie ne reçoit, ne détient et ne reverse jamais vos loyers. Nous vous envoyons ensuite notre facture mensuelle, payable par virement sous 7 jours.</p>`,
  },
  {
    q: 'Puis-je bloquer des dates pour moi ?',
    a: `<p>Oui. Vous nous prévenez par écrit au moins 15 jours avant, et les dates sont bloquées si elles ne sont pas déjà réservées. Nous vous conseillons de choisir des périodes calmes pour ne pas perdre de réservations.</p>`,
  },
  {
    q: 'Quelle est la durée du contrat, et comment l’arrêter ?',
    a: `<p>Le contrat dure 12 mois, puis se renouvelle par périodes de 12 mois. Vous pouvez l'arrêter sans motif à chaque échéance, avec un préavis d'un mois par lettre recommandée. Si vous êtes un particulier, nous vous rappelons par écrit la date limite avant chaque échéance. Signé à distance ou hors de nos locaux, il vous laisse 14 jours pour vous rétracter. Une sortie avant l'échéance donne lieu à une indemnité prévue au contrat, sauf manquement de notre part ou vente du logement annoncée 3 mois à l'avance.</p>`,
  },
  {
    q: 'Combien mon bien peut-il rapporter ?',
    a: `<p>Cela dépend de la commune, de la taille du logement, de la saison et des règles locales. Lors de notre appel, nous vous donnons une estimation à partir de logements comparables. C'est une estimation, pas une promesse : notre contrat ne garantit ni taux d'occupation ni niveau de revenus.</p>`,
  },
  {
    q: 'Quelles villes couvrez-vous ?',
    a: `<p>Toute l'Île-de-France, depuis notre base de Guyancourt : Paris, les Hauts-de-Seine, la Seine-Saint-Denis, le Val-de-Marne, les Yvelines, l'Essonne, le Val-d'Oise et la Seine-et-Marne.</p>`,
  },
];

export const REGLES_TABLE = () => `<div class="tbl-wrap"><table class="tbl tbl-wide"><caption>Les trois règles à vérifier avant de louer en courte durée</caption>
<thead><tr><th scope="col">Règle</th><th scope="col">Ce qu'elle impose</th><th scope="col">Où elle s'applique</th></tr></thead>
<tbody>
<tr><td><b>Numéro d'enregistrement</b></td><td>Déclarer le meublé et afficher son numéro sur chaque annonce.</td><td>Partout en France depuis mai 2026. Téléservice national pas encore ouvert : procédure de la mairie en attendant.</td></tr>
<tr><td><b>Changement d'usage</b></td><td>Autorisation de la mairie pour louer en courte durée un logement qui n'est pas votre résidence principale.</td><td>Automatique à Paris et dans les Hauts-de-Seine, la Seine-Saint-Denis et le Val-de-Marne. Ailleurs, seulement si la commune l'a décidé (c'est le cas à Versailles).</td></tr>
<tr><td><b>Plafond de nuitées</b></td><td>Votre résidence principale ne peut pas être louée plus de 120 nuits par an. La commune peut abaisser ce plafond jusqu'à 90.</td><td>Partout. Paris applique 90 nuits.</td></tr>
</tbody></table></div>
<p class="verif">Vérifié le ${VERIF}, d'après le ministère de l'Économie (entreprises.gouv.fr), le ministère de la Transition écologique, la Ville de Paris et la Ville de Versailles. À reconfirmer auprès de la mairie de votre commune.</p>`;

// ---------- Carte de l'Île-de-France (zone d'intervention) ----------
// Tracés générés une fois par scripts/carte.py (data/carte-idf.json, source : france-geojson, données IGN/INSEE)
const DEPTS_IDF = {
  '75': { t: 1, hub: '/conciergerie-airbnb-paris', sous: 'Tous les arrondissements' },
  '92': { t: 2, hub: '/conciergerie-airbnb-hauts-de-seine' },
  '93': { t: 2, sous: 'Toute la Seine-Saint-Denis' },
  '94': { t: 2, hub: '/conciergerie-airbnb-val-de-marne' },
  '78': { t: 3, hub: '/conciergerie-airbnb-yvelines', sous: 'Notre base : Guyancourt' },
  '91': { t: 3, hub: '/conciergerie-airbnb-essonne' },
  '95': { t: 3, sous: "Tout le Val-d'Oise" },
  '77': { t: 3, hub: '/conciergerie-airbnb-val-d-europe', sous: "Val d'Europe et toute la Seine-et-Marne" },
};
const ORDRE_IDF = ['78', '75', '92', '94', '93', '95', '91', '77'];
const LBL_IDF = { '75': [0, 6], '92': [-6, 8], '93': [8, -4], '94': [6, 10], '78': [-30, -20], '91': [0, 30], '95': [0, 0], '77': [20, 0] };
export const ZONES_CHIPS = () => {
  const c = ctx.carte;
  if (!c) return '';
  const depName = (code) => c.deps.find((d) => d.code === code).nom;
  const exemples = (code) => ctx.villes.filter((v) => v.departement === code).slice(0, 3).map((v) => v.ville);
  const shapes = c.deps
    .map((d) => {
      const m = DEPTS_IDF[d.code];
      const p = `<path class="dp t${m.t}" d="${d.d}"/>`;
      return m.hub ? `<a href="${m.hub}" aria-label="Conciergerie Airbnb ${esc(d.nom)} (${d.code})">${p}</a>` : `<g>${p}</g>`;
    })
    .join('');
  const labels = c.deps
    .map((d) => {
      const m = DEPTS_IDF[d.code];
      const [dx, dy] = LBL_IDF[d.code] || [0, 0];
      const x = d.lx + dx, y = d.ly + dy;
      const big = m.t === 3;
      return `<text class="lb t${m.t}" x="${x}" y="${y}" text-anchor="middle"><tspan class="lb-n" x="${x}">${d.code}</tspan>${big ? `<tspan class="lb-t" x="${x}" dy="1.25em">${esc(d.nom)}</tspan>` : ''}</text>`;
    })
    .join('');
  const [gx, gy] = c.guyancourt;
  const pill = (cls, w, h, txt) => `<g class="${cls}" transform="translate(${gx - w / 2} ${gy + 20})"><rect class="base-pill" width="${w}" height="${h}" rx="${h / 2}"/><text class="base-t" x="${w / 2}" y="${h / 2}" dy=".35em" text-anchor="middle">${txt}</text></g>`;
  const base = `<g class="base" aria-hidden="true"><circle class="base-pulse" cx="${gx}" cy="${gy}" r="11"/><circle class="base-dot" cx="${gx}" cy="${gy}" r="10"/>${pill('base-lg', 262, 46, 'Guyancourt · notre base')}${pill('base-sm', 200, 56, 'Notre base')}</g>`;
  const legende = ORDRE_IDF.map((code) => {
    const m = DEPTS_IDF[code];
    const ex = exemples(code);
    const sous = m.sous || (ex.length ? `${ex.join(', ')}…` : '');
    const inner = `<span class="lg-n t${m.t}">${code}</span><span class="lg-t"><b>${esc(depName(code))}</b>${sous ? `<small>${esc(sous)}</small>` : ''}</span>${m.hub ? icon('arrow') : ''}`;
    return `<li>${m.hub ? `<a href="${m.hub}">${inner}</a>` : `<div>${inner}</div>`}</li>`;
  }).join('');
  return `<div class="idf">
  <div class="idf-map card">
    <svg viewBox="0 0 ${c.w} ${c.h}" role="img" aria-labelledby="idf-title"><title id="idf-title">Carte de l'Île-de-France : Rim Conciergerie intervient dans les 8 départements, depuis sa base de Guyancourt (Yvelines)</title>
      <g class="deps">${shapes}</g><g class="lbls" aria-hidden="true">${labels}</g>${base}
    </svg>
    <div class="idf-fr" aria-hidden="true"><svg viewBox="0 0 ${c.france.w} ${c.france.h}"><path class="fr" d="${c.france.d}"/><path class="fr-idf" d="${c.france.idf}"/></svg><span>Île-de-France</span></div>
    <ul class="idf-key" aria-hidden="true"><li><i class="t1"></i>Paris</li><li><i class="t2"></i>Petite couronne</li><li><i class="t3"></i>Grande couronne</li></ul>
  </div>
  <ul class="idf-leg">${legende}</ul>
</div>`;
};

const PROTO = () => `<div class="proto card">
  <div class="proto-step"><span class="proto-n">${icon('video')}</span><div><h3>Vidéo à l'arrivée</h3><p>L'intervenante filme tout le logement avant de commencer, télévision allumée. La vidéo est horodatée et géolocalisée.</p></div></div>
  <div class="proto-step"><span class="proto-n">${icon('broom')}</span><div><h3>Ménage et checklist</h3><p>Ménage, linge, réassort des consommables. Chaque point de la checklist est coché, puis photographié.</p></div></div>
  <div class="proto-step"><span class="proto-n">${icon('video')}</span><div><h3>Vidéo de fin</h3><p>Deuxième vidéo complète, logement prêt pour le voyageur suivant.</p></div></div>
  <div class="proto-step"><span class="proto-n">${icon('doc')}</span><div><h3>Archivage par logement et par date</h3><p>Tout est envoyé avec le nom du logement et la date, puis archivé. En cas de litige, c'est notre preuve.</p><span class="wa-msg">${waIcon('i i-s')}« Séjour Luxe – 31/10/2026 »</span></div></div>
</div>`;

const STEPS = `<ol class="steps steps-n">
  <li class="card"><span class="st-n">01</span><h3>Estimation gratuite</h3><p>Nous étudions votre logement, son quartier et ses atouts pour estimer ce qu'il peut rapporter en location courte durée.</p><span class="delai">${icon('clock', 'i i-s')}Rappel sous 24 h</span></li>
  <li class="card"><span class="st-n">02</span><h3>Mise en place</h3><p>Photos, annonces Airbnb et Booking, prix, accès voyageurs, numéro d'enregistrement : nous préparons le logement pour sa mise en ligne.</p><span class="delai">${icon('key', 'i i-s')}Avant le premier voyageur</span></li>
  <li class="card"><span class="st-n">03</span><h3>Gestion quotidienne</h3><p>Réservations, messages voyageurs, prix, ménage filmé, linge, arrivées, départs et imprévus : nous nous occupons de tout.</p><span class="delai">${icon('calendar', 'i i-s')}Tous les jours</span></li>
  <li class="card"><span class="st-n">04</span><h3>Vous suivez les performances</h3><p>Vous voyez les réservations et les prix en temps réel, et vous recevez chaque mois une facture qui détaille chaque séjour.</p><span class="delai">${icon('chart', 'i i-s')}En temps réel</span></li>
</ol>
<p class="steps-cta"><a class="btn btn-primary" href="/estimation">Estimer mon logement ${icon('arrow')}</a></p>`;

// ---------- Composants visuels ----------
const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export function channelManager() {
  // Exemple d'écran : données fictives, calculées ici pour rester cohérentes (dates, nuits, totaux).
  const N = 21;
  const start = new Date('2026-11-02T12:00:00');
  const days = Array.from({ length: N }, (_, k) => { const d = new Date(start); d.setDate(d.getDate() + k); return d; });
  const fmt = (d) => `${JOURS[(d.getDay() + 6) % 7].toLowerCase()}. ${d.getDate()} nov.`;
  const rows = [
    { nom: 'Appartement T2', ini: 'T2', prix: [145, 145, 150, 155, 185, 195, 170, 145, 145, 150, 155, 190, 199, 175, 148, 148, 152, 158, 189, 198, 172], res: [['a', 'Camille D.', 0, 2], ['a', 'Marco R.', 2, 4, 2, true], ['b', 'Thomas L.', 7, 3], ['a', 'Sarah K.', 10, 4], ['b', 'Julien M.', 15, 3], ['a', 'Nora B.', 18, 3]] },
    { nom: 'Studio', ini: 'St', prix: [98, 98, 102, 105, 129, 135, 115, 98, 98, 102, 105, 132, 138, 118, 99, 99, 103, 106, 130, 136, 116], res: [['b', 'Inès B.', 0, 3], ['a', 'Léa P.', 4, 3], ['b', 'Hugo V.', 7, 2], ['a', 'Yanis A.', 10, 4], ['b', 'Emma R.', 14, 4], ['a', 'Paul G.', 19, 2]] },
    { nom: 'Maison 4 chambres', ini: 'M', prix: [265, 265, 270, 280, 330, 345, 300, 265, 265, 270, 280, 335, 349, 305, 268, 268, 272, 282, 332, 348, 302], res: [['x', '', 0, 2], ['a', 'Famille N.', 2, 5], ['b', 'Kevin T.', 8, 4], ['a', 'Groupe S.', 12, 3], ['b', 'Claire M.', 16, 5]] },
  ];
  let detail = '';
  const body = rows
    .map((r) => {
      const busy = new Set();
      r.res.forEach(([, , st, n]) => { for (let k = st; k < st + n; k++) busy.add(k); });
      const cells = r.prix.map((p, k) => `<span class="cm-c" style="grid-column:${k + 2}">${busy.has(k) ? '' : p}</span>`).join('');
      const bars = r.res
        .map(([t, nom, st, n, voy, sel]) => {
          if (sel) {
            const arr = days[st], dep = new Date(days[st]); dep.setDate(dep.getDate() + n);
            const total = r.prix.slice(st, st + n).reduce((a, b) => a + b, 0);
            detail = `<div class="cm-detail"><p class="cm-d-h"><span class="cm-ico cm-a">A</span><b>${nom}</b> · Airbnb · ${voy} voyageurs</p><p>${fmt(arr)}, 16:00 → ${fmt(dep)}, 11:00 · ${n} nuits</p><p>Séjour payé · ${total.toLocaleString('fr-FR')} € de nuitées · versement par Airbnb sur <b>votre</b> compte</p></div>`;
          }
          return `<span class="cm-bar cm-${t}${sel ? ' cm-sel' : ''}" style="grid-column:${st + 2} / span ${n}">${t === 'x' ? 'Vos dates' : `<span class="cm-ico cm-${t}">${t === 'a' ? 'A' : 'B'}</span>${nom}`}</span>`;
        })
        .join('');
      return `<div class="cm-row"><span class="cm-name"><span class="cm-th">${r.ini}</span>${r.nom}</span>${cells}${bars}</div>`;
    })
    .join('');
  const head = `<div class="cm-row cm-head"><span class="cm-name cm-month">Novembre 2026</span>${days.map((d, k) => `<span class="cm-day${d.getDay() === 6 || d.getDay() === 0 ? ' cm-we' : ''}" style="grid-column:${k + 2}"><small>${JOURS[(d.getDay() + 6) % 7]}.</small>${d.getDate()}</span>`).join('')}</div>`;
  return `<figure class="cm card" aria-label="Exemple d'écran de calendrier propriétaire">
  <div class="cm-top"><b>Calendrier</b><span class="cm-tag">Exemple d'écran · données fictives</span><span class="cm-leg"><span><i class="cm-a"></i>Airbnb</span><span><i class="cm-b"></i>Booking</span><span><i class="cm-x"></i>Vos dates</span><span>Chiffres : prix de la nuit (€)</span></span></div>
  <div class="cm-scroll"><div class="cm-grid">${head}${body}</div></div>
  ${detail}
</figure>`;
}

const tsVideo = (heure, duree, pos) => `<div class="wa-vid" style="background-position:${pos}">
  <div class="ts"><span class="ts-map" aria-hidden="true"><i class="ts-dot"></i></span><span class="ts-txt">samedi 31 octobre 2026 à ${heure}<br>Avenue de l'Europe<br>78280 Guyancourt<br>France</span></div>
  <span class="wa-play">${icon('play')}</span>
  <span class="wa-dur">${icon('video', 'i i-s')}${duree}</span>
</div>`;

export function phoneProtocole() {
  const s = ctx.s;
  let screen;
  if (s.protocole_image) screen = `<img class="ph-media" src="${esc(s.protocole_image)}" alt="Capture WhatsApp d'un ménage horodaté et géolocalisé" loading="lazy">`;
  else if (s.protocole_video) screen = `<video class="ph-media" src="${esc(s.protocole_video)}" controls playsinline preload="metadata"></video>`;
  else
    screen = `<div class="wa">
    <div class="wa-status"><b>11:44</b><span class="wa-sb"><i></i><i></i><i></i><i></i></span></div>
    <div class="wa-head"><span class="wa-back">‹</span><span class="wa-av">${icon('broom', 'i i-s')}</span><span class="wa-who"><b>Équipe ménage</b><small>en ligne</small></span><span class="wa-ic">${icon('video', 'i i-s')}${icon('phone', 'i i-s')}</span></div>
    <div class="wa-body">
      <span class="wa-day">Aujourd'hui</span>
      <div class="wa-in">${tsVideo('10:02:14', '1:12', '20% center')}<p>Séjour Luxe – 31/10/2026 · arrivée</p><span class="wa-t">10:03</span></div>
      <div class="wa-in">${tsVideo('11:41:37', '1:26', '80% center')}<p>Séjour Luxe – 31/10/2026 · fin</p><span class="wa-t">11:42</span></div>
      <div class="wa-out"><p>Parfait, merci ! Logement validé.</p><span class="wa-t">11:44 <span class="wa-ck">✓✓</span></span></div>
    </div>
    <div class="wa-input"><span>Message</span><i>${icon('camera', 'i i-s')}</i></div>
  </div>`;
  return `<figure class="phone"><div class="ph-screen">${screen}</div>${!s.protocole_image && !s.protocole_video ? '<figcaption>Exemple de messages reçus après un ménage</figcaption>' : ''}</figure>`;
}

const bienMini = (b) => `<article class="bmini">
  <div class="bmini-img">${bienImg(b, '(min-width:980px) 270px, 70vw')}${bienBadge(b) || `<span class="bmini-loc">${icon('pin', 'i i-s')}${esc(b.ville)}</span>`}</div>
  <h3>${esc(b.titre)}</h3><p>${esc(b.ville)} (${esc(b.departement)}) · ${esc((b.tags || []).slice(1, 3).join(' · '))}</p>${bienRate(b)}
</article>`;

// ---------- Accueil ----------
export function accueil(data) {
  const s = ctx.s;
  const all = FAQ_GENERALE();
  const faq = faqBlock([all[0], all[2], all[3], all[4], all[5], all[7]], { titre: 'Vos questions,', script: 'nos réponses', intro: "Les questions que les propriétaires nous posent le plus souvent avant de nous confier leur logement : réglementation, dégâts, contrôle, prix, revenus et durée du contrat." });
  const biensIdf = data.biens.filter((b) => b.region === 'idf');
  const body = `
<section class="hero hero-photo hero-home" id="accueil">
  <img class="hero-bg" src="/images/hero-villa-1920.webp" srcset="/images/hero-villa-960.webp 960w, /images/hero-villa-1920.webp 1920w" sizes="100vw" width="1920" height="1280" alt="" fetchpriority="high">
  <div class="wrap hero-g">
  <div class="hero-head">
    <p class="eyebrow eyebrow-face"><img src="/images/equipe/nassim-avatar.webp" width="28" height="28" alt=""><span><b>${esc(s.slogan)}</b></span></p>
    <h1 class="h1">Conciergerie Airbnb <span class="script">en Île-de-France</span></h1>
    <p class="lead">Basés à Guyancourt, nous gérons votre location courte durée de A à Z : annonces, prix, voyageurs, ménage. Vos loyers vous sont versés directement.</p>
  </div>
  <div class="hero-form">${microForm({ id: 'hero' })}</div>
  <div class="hero-more">${proofs()}</div>
</div></section>

<section class="sec sec-tight" id="apropos" aria-labelledby="apropos-t"><div class="wrap split">
  <div>
    <p class="kicker">La conciergerie en vidéo</p>
    <h2 class="h2" id="apropos-t">Bonjour, je suis <span class="script">Nassim</span></h2>
    ${answer("J'ai créé Rim Conciergerie à Guyancourt pour que la location courte durée ne devienne pas un second métier pour les propriétaires. Dans cette vidéo, je vous présente la conciergerie et chacun des services que nous assurons pour votre logement.")}
    <ul class="stats" aria-label="En chiffres">
      <li><b>50+</b><span>logements gérés</span></li>
      <li><b>${esc(s.avis_google_note)}</b><span>sur Google · ${s.avis_google_nombre} avis</span></li>
      <li><b>${esc(s.airbnb_note)}</b><span>sur Airbnb · ${s.airbnb_evaluations} évaluations</span></li>
    </ul>
    ${socialPills()}
    <p><a class="lnk" href="/qui-sommes-nous">Qui sommes-nous ${icon('arrow')}</a></p>
  </div>
  ${presentationVideo({ sizes: '(min-width:980px) 520px, 92vw', alt: 'Nassim, fondateur de Rim Conciergerie, présente la conciergerie en vidéo' })}
</div></section>

${sec('services', 'Ce que nous faisons', `<div class="g4">
  <article class="feat card"><span class="ic">${icon('chart')}</span><h3>Annonces et prix</h3><p>Annonces Airbnb et Booking, prix ajustés chaque jour, calendriers synchronisés.</p></article>
  <article class="feat card"><span class="ic">${icon('message')}</span><h3>Voyageurs 24 h/24</h3><p>Messages automatiques à chaque étape, arrivées autonomes, urgences par téléphone.</p></article>
  <article class="feat card"><span class="ic">${icon('broom')}</span><h3>Ménage contrôlé</h3><p>Ménage, linge et consommables, avec une vidéo avant et après chaque passage.</p></article>
  <article class="feat card"><span class="ic">${icon('shield')}</span><h3>Incidents</h3><p>Signalement sous 72 h, déclaration à la plateforme, demande d'indemnisation.</p></article>
</div>
<p class="more"><a class="lnk" href="/services">Voir tous nos services ${icon('arrow')}</a></p>`, {
    gray: true,
    script: 'pour vous',
    intro: "La courte durée devient vite un second métier : messages tard le soir, ménages entre deux séjours, prix à revoir chaque semaine. Nous prenons tout en charge, et vous gardez les décisions importantes.",
  })}

<section class="sec" id="protocole" aria-labelledby="protocole-t"><div class="wrap split">
  <div>
    <p class="kicker">Notre protocole anti-dégradation</p>
    <h2 class="h2" id="protocole-t">Chaque ménage est <span class="script">filmé</span></h2>
    ${answer("À chaque ménage, l'intervenante filme tout le logement en arrivant, puis en partant. Les vidéos sont horodatées et géolocalisées, envoyées sur WhatsApp avec le nom du logement et la date. Si un voyageur abîme quelque chose, nous avons la preuve pour la plateforme.")}
    <ul class="checks">
      <li>${icon('check')}<span><b>Avant et après</b> chaque séjour</span></li>
      <li>${icon('check')}<span><b>Horodaté et géolocalisé</b>, impossible à antidater</span></li>
      <li>${icon('check')}<span><b>Disponible</b> pour vous sur simple demande</span></li>
    </ul>
  </div>
  ${phoneProtocole()}
</div></section>

<section class="sec sec-gray" id="controle" aria-labelledby="controle-t"><div class="wrap">
  <p class="kicker">Votre accès propriétaire</p>
  <h2 class="h2" id="controle-t">Vous gardez <span class="script">la main</span></h2>
  ${answer("Vous voyez tout, en temps réel : chaque réservation Airbnb et Booking, le nom et le nombre de voyageurs, les dates, le prix de chaque nuit et les dates que vous avez bloquées pour vous. Les plateformes vous versent les loyers directement.")}
  ${channelManager()}
  <ul class="cm-points">
    <li>${icon('calendar')}<span>Toutes les réservations dans un seul calendrier</span></li>
    <li>${icon('users')}<span>Voyageurs, dates et montants de chaque séjour</span></li>
    <li>${icon('euro')}<span>Prix ajusté chaque nuit, jamais sous votre plancher</span></li>
    <li>${icon('bank')}<span>Loyers versés sur votre compte, pas le nôtre</span></li>
  </ul>
</div></section>

${sec('avis', 'Ce qu’en disent', `${videoTestimonials(data.temoignages)}
${googleBand()}
<p class="more center"><a class="lnk" href="/avis">Tous nos avis, Google et Airbnb ${icon('arrow')}</a></p>`, {
    script: 'les propriétaires',
    intro: `Des propriétaires qui nous confient leur logement racontent leur expérience en vidéo, publiée avec leur accord. Leurs avis écrits sont publics, sur notre fiche Google : nous ne pouvons ni les choisir ni les modifier.`,
  })}

${sec('logements', 'Des logements que', `<div class="bstrip">${biensIdf.map(bienMini).join('')}</div>`, {
    gray: true,
    script: 'nous gérons',
    intro: `Rim Conciergerie a géré ${esc(s.logements_geres)} logements en location courte durée. Quelques logements franciliens, tels qu'ils apparaissent sur leurs annonces.`,
  })}

${sec('tarifs', 'Une commission,', `${pricesHtml()}<p class="more"><a class="lnk" href="/tarifs">Voir nos tarifs ${icon('arrow')}</a></p>`, {
    script: 'rien de fixe',
    intro: "Nous sommes payés en pourcentage de ce que votre logement rapporte réellement : de 20 à 25 % des recettes nettes, selon le logement et le nombre de biens, avec un tarif dégressif.",
  })}

${sec('etapes', 'Confier votre logement,', STEPS, {
    gray: true,
    kicker: 'Comment ça marche',
    script: 'en quatre étapes',
    intro: "De l'estimation gratuite au suivi de vos réservations, voici comment nous prenons en charge votre location courte durée. Vous ne signez rien avant d'avoir vu le logement avec nous et lu le contrat, et vous gardez la main sur les décisions importantes.",
  })}

${sec('zones', 'Où nous', ZONES_CHIPS(), {
    script: 'intervenons',
    intro: "Depuis notre base de Guyancourt, dans les Yvelines, nous intervenons dans toute l'Île-de-France : Paris, la petite couronne (Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne) et la grande couronne (Yvelines, Essonne, Val-d'Oise, Seine-et-Marne). Chaque département renvoie vers nos pages locales.",
  })}

${faq.html}

${finalCta()}`;
  return {
    path: '/',
    title: 'Conciergerie Airbnb Île-de-France | Rim Conciergerie',
    ogTitle: 'Rim Conciergerie, conciergerie Airbnb en Île-de-France',
    description: `Conciergerie Airbnb basée à Guyancourt : annonces, prix, voyageurs 24 h/24, ménage filmé. ${s.avis_google_note}/5 sur Google. Estimez votre bien.`,
    body,
    schema: [faq.schema, presentationVideoSchema()].filter(Boolean),
    lastmod: ctx.today,
  };
}

// ---------- Gestion Airbnb & Booking ----------
export function gestion() {
  const bc = breadcrumbs([{ name: 'Gestion Airbnb & Booking', path: '/gestion-airbnb-booking' }]);
  const faq = faqBlock(
    [
      { q: 'Mes annonces restent-elles à mon nom ?', a: '<p>Oui. Vos annonces sont publiées sur vos propres comptes Airbnb et Booking, et les versements arrivent sur votre compte bancaire. Nous y travaillons avec un accès délégué, que vous pouvez retirer à la fin du contrat.</p>' },
      { q: 'Faut-il être à la fois sur Airbnb et sur Booking ?', a: "<p>Pas toujours. Airbnb convient à la plupart des logements. Booking ajoute une clientèle professionnelle et internationale, utile près des gares, des aéroports et des quartiers d'affaires. Nous vous conseillons selon votre logement et votre commune.</p>" },
      { q: 'Comment évitez-vous les doubles réservations ?', a: '<p>Les calendriers de toutes les plateformes sont reliés à un seul outil de gestion (channel manager). Une réservation prise sur Airbnb ferme immédiatement les mêmes dates sur Booking.</p>' },
      { q: 'Qui fixe les prix ?', a: "<p>Nous les ajustons chaque jour avec un outil de tarification dynamique, selon la saison, les événements et la demande locale. Vous fixez un prix plancher par nuit : nous ne descendons jamais en dessous.</p>" },
    ],
    { titre: 'Questions sur la', script: 'gestion des annonces' }
  );
  const body = `${bc.html}
<section class="hero"><div class="wrap hero-g">
  <div class="hero-head">
    <p class="kicker">Gestion Airbnb &amp; Booking en Île-de-France</p>
    <h1 class="h1">Nous gérons votre annonce <span class="script">Airbnb et Booking</span></h1>
    <p class="lead">De la première photo au dernier avis voyageur : nous créons vos annonces, ajustons vos prix chaque jour et répondons aux voyageurs 24 h/24. Les annonces restent sur vos comptes.</p>
  </div>
  <div class="hero-form">${microForm({ id: 'hero' })}</div>
  <div class="hero-more">${proofs()}</div>
</div></section>

${sec('annonce', 'Une annonce qui donne', `<div class="g3">
  <article class="feat card"><span class="ic">${icon('camera')}</span><h3>Photos</h3><p>Shooting professionnel en option (100 € TTC pour un logement de moins de 100 m²). Les photos vous appartiennent, même après le contrat.</p></article>
  <article class="feat card"><span class="ic">${icon('file')}</span><h3>Texte et équipements</h3><p>Titre, description, équipements, règles de la maison et numéro d'enregistrement : tout ce que les voyageurs et les plateformes regardent.</p></article>
  <article class="feat card"><span class="ic">${icon('star')}</span><h3>Suivi chaque mois</h3><p>Nous suivons la position de l'annonce et corrigeons ce qui freine les réservations.</p></article>
</div>`, { script: 'envie de réserver', intro: "Une annonce se joue sur les photos, le titre et la clarté des informations. Nous la rédigeons à partir de votre logement, avec ses vrais atouts, puis nous la publions sur vos comptes Airbnb et Booking." })}

${sec('prix', 'Des prix ajustés', `<ul class="checks">
  <li>${icon('chart')}<span><b>Chaque jour</b>, selon la saison, les week-ends et la demande locale</span></li>
  <li>${icon('calendar')}<span><b>Les événements</b> : salons, matchs, concerts, vacances scolaires</span></li>
  <li>${icon('euro')}<span><b>Votre prix plancher</b> par nuit, que nous respectons toujours</span></li>
  <li>${icon('clock')}<span><b>Les durées minimales</b> de séjour adaptées à chaque période</span></li>
</ul>`, { gray: true, script: 'chaque jour', intro: "Un prix fixe laisse de l'argent sur la table en haute saison et vide le calendrier en basse saison. Nous utilisons un outil de tarification dynamique (revenue management) qui ajuste les prix chaque jour, dans les limites que vous fixez." })}

${sec('voyageurs', 'Les voyageurs nous écrivent,', `<div class="g2">
  <div class="card feat"><span class="ic">${icon('message')}</span><h3>Avant et pendant le séjour</h3><p>Questions, demandes de réservation, arrivée, consignes : les voyageurs reçoivent une réponse 24 h/24, avec des messages automatiques à chaque étape et un téléphone d'urgence.</p></div>
  <div class="card feat"><span class="ic">${icon('key')}</span><h3>Arrivées autonomes</h3><p>Boîte à clés ou serrure connectée (avec votre accord), guidage jusqu'au logement, livret d'accueil numérique.</p></div>
</div>`, { script: 'pas vous', intro: "Toute la relation voyageurs passe par nous : de la première question à l'avis laissé après le départ. Vous n'êtes plus réveillé par un message à 23 h ni appelé pour un code de porte." })}

<section class="sec sec-gray" id="role" aria-labelledby="role-t"><div class="wrap">
  <h2 class="h2" id="role-t">Qui fait <span class="script">quoi</span></h2>
  ${answer("Nous faisons fonctionner la location au quotidien. Vous restez le loueur : le contrat de location est conclu entre vous et le voyageur, et les loyers vous sont versés directement. Ce tableau résume la répartition.")}
  <div class="tbl-wrap"><table class="tbl tbl-wide"><thead><tr><th scope="col">Sujet</th><th scope="col">Rim Conciergerie</th><th scope="col">Vous</th></tr></thead><tbody>
    <tr><td>Annonces</td><td>Création, rédaction, mise à jour</td><td>Comptes Airbnb et Booking à votre nom</td></tr>
    <tr><td>Prix</td><td>Ajustés chaque jour</td><td>Prix plancher par nuit</td></tr>
    <tr><td>Voyageurs</td><td>Messages, arrivées, départs, urgences</td><td>Rien à faire</td></tr>
    <tr><td>Ménage et linge</td><td>Coordination et contrôle vidéo</td><td>Coût du ménage, financé par les frais de ménage</td></tr>
    <tr><td>Loyers</td><td>Jamais encaissés par nous</td><td>Versés directement sur votre compte</td></tr>
    <tr><td>Réglementation</td><td>Vérification avec vous avant de signer</td><td>Déclaration à votre nom</td></tr>
  </tbody></table></div>
</div></section>

${faq.html}
${finalCta()}`;
  return {
    path: '/gestion-airbnb-booking',
    title: 'Gestion Airbnb & Booking Île-de-France | Rim Conciergerie',
    description: 'Création d’annonces Airbnb et Booking, prix ajustés chaque jour, voyageurs gérés 24 h/24. Annonces sur vos comptes, loyers versés chez vous.',
    body,
    schema: [bc.schema, faq.schema, { '@type': 'Service', name: 'Gestion d’annonces Airbnb et Booking', serviceType: 'Conciergerie Airbnb', provider: { '@id': `${ctx.s.url}/#entreprise` }, areaServed: 'Île-de-France' }],
    lastmod: ctx.today,
  };
}

// ---------- Services ----------
const SERVICES = [
  ['file', 'Création de l’annonce', 'Titre, description, équipements et règles de la maison, publiés sur vos comptes Airbnb et Booking et pensés pour leurs algorithmes.'],
  ['chart', 'Prix ajustés chaque jour', 'Tarification dynamique façon hôtellerie : saisons, week-ends, événements. Jamais sous le prix plancher que vous fixez.'],
  ['message', 'Voyageurs 24 h/24', 'Messages automatiques à chaque étape, réponses aux questions, et un téléphone d’urgence pendant le séjour.'],
  ['key', 'Arrivées et départs', 'Accès autonome par boîte à clés ou serrure connectée, guidage jusqu’au logement, livret d’accueil numérique.'],
  ['broom', 'Ménage et blanchisserie', 'Ménage après chaque séjour, linge fourni par vous ou par nous et lavé par une blanchisserie, avec une vidéo avant et après chaque passage.'],
  ['sparkle', 'Inventaire et réassort', 'Café, thé, gel douche, papier : les consommables sont vérifiés et réapprovisionnés à chaque rotation.'],
  ['wrench', 'Petite maintenance', 'Ampoules, piles, petits dépannages, objets cassés : nous gérons. Pour les travaux, nous vous mettons en relation avec un artisan.'],
  ['shield', 'Incidents et dégâts', 'Signalement sous 72 h avec photos, déclaration à la plateforme et demande d’indemnisation montée pour vous.'],
  ['camera', 'Shooting photo', 'En option : photos professionnelles de votre logement, qui vous appartiennent, même après le contrat.'],
];
export const servicesGrid = () => `<div class="svc">${SERVICES.map(([ic, t, d]) => `<article class="svc-i"><span class="ic">${icon(ic)}</span><div><h3>${t}</h3><p>${d}</p></div></article>`).join('')}</div>`;

export function services() {
  const bc = breadcrumbs([{ name: 'Services', path: '/services' }]);
  const faq = faqBlock(
    [
      { q: 'Le linge est-il fourni ?', a: "<p>Les deux sont possibles. Vous pouvez fournir votre propre linge de lit et de toilette, en quantité suffisante pour plusieurs rotations : nous organisons alors son nettoyage par une blanchisserie. Vous pouvez aussi nous laisser fournir le linge : nous fixons ensemble les conditions avant la signature. Dans les deux cas, nous gérons le réassort des consommables.</p>" },
      { q: 'Qui fait le ménage ?', a: "<p>Des intervenantes sélectionnées et formées à notre cahier des charges et à notre protocole vidéo. Nous restons votre seul interlocuteur et nous remplaçons une intervenante empêchée.</p>" },
      { q: 'Et pour les réparations ?', a: "<p>Nous gérons la petite maintenance (ampoules, piles, petits dépannages, objets cassés). Pour les travaux plus importants, nous vous prévenons et nous vous mettons en relation avec un artisan ; la décision reste la vôtre.</p>" },
      { q: 'Et pour l’assurance ?', a: "<p>Nous ne sommes pas assureur, mais nous pouvons vous recommander des assurances bien adaptées à la location meublée de courte durée. En copropriété, l'assurance propriétaire non occupant est obligatoire. En cas de dégât, nous montons le dossier auprès de la plateforme (AirCover, Booking.com).</p>" },
    ],
    { titre: 'Questions sur', script: 'nos services' }
  );
  const body = `${bc.html}
<section class="hero hero-tight"><div class="wrap">
  <p class="kicker">Services de conciergerie Airbnb</p>
  <h1 class="h1">Tout ce que nous faisons <span class="script">pour votre location</span></h1>
  <p class="lead">Vous confiez votre logement, nous nous occupons du reste. Voici, service par service, ce que nous prenons en charge.</p>
</div></section>

<section class="sec sec-first" id="liste" aria-label="Nos services"><div class="wrap">${servicesGrid()}</div></section>

${faq.html}
${finalCta()}`;
  return {
    path: '/services',
    title: 'Services de conciergerie Airbnb | Rim Conciergerie',
    description: 'Annonce, prix ajustés, voyageurs 24 h/24, ménage filmé, maintenance, incidents : tous nos services de conciergerie Airbnb en Île-de-France.',
    body,
    schema: [bc.schema, faq.schema, { '@type': 'Service', name: 'Conciergerie Airbnb', serviceType: 'Conciergerie pour location courte durée', provider: { '@id': `${ctx.s.url}/#entreprise` }, areaServed: 'Île-de-France' }],
    lastmod: ctx.today,
  };
}

// ---------- Visuel « seul ou avec une conciergerie » ----------
const avatar = (ok) => `<span class="av ${ok ? 'av-ok' : 'av-ko'}"><span class="av-in"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="30" r="14"/><path d="M7 96C7 70 21.5 53 40 53s33 17 33 43z"/></svg></span><span class="av-b">${icon(ok ? 'check' : 'close', 'i i-s')}</span></span>`;
const notif = (ic, app, txt) => `<div class="nt"><span class="nt-ic">${icon(ic, 'i i-s')}</span><div><b>${app}</b><span>${txt}</span></div></div>`;

function compareVisuel() {
  const seul = ['Messages de voyageurs à toute heure, même en vacances', 'Un ménage raté, un mauvais avis, moins de réservations', 'Un prix fixe : trop bas quand la demande monte, vide le reste du temps', 'Un dégât sans preuve, difficile à faire indemniser', 'Clés perdues, pannes, arrivées tardives : vous vous déplacez', 'Les règles d’enregistrement et de changement d’usage à suivre seul'];
  const rim = ['Les voyageurs nous écrivent, pas vous : réponses 24 h/24', 'Chaque ménage contrôlé en vidéo : vos avis sont protégés', 'Des prix ajustés chaque jour selon la demande', 'Une preuve horodatée et un dossier d’indemnisation monté pour vous', 'Arrivées autonomes et une équipe sur place pour les imprévus', 'Les règles vérifiées avec vous avant de signer'];
  return `<div class="vs">
  <div class="vs-c vs-ko">
    <div class="vs-ill">${avatar(false)}<div class="nts">${notif('message', 'Voyageur · 23:47', '« Le code de la boîte à clés ne marche pas… »')}${notif('star', 'Nouvel avis · 3 étoiles', '« Le ménage n’était pas fait. »')}</div></div>
    <p class="vs-k">Le propriétaire seul</p><p class="vs-t">Un second métier</p>
    <ul>${seul.map((x) => `<li>${icon('close', 'i i-s')}<span>${x}</span></li>`).join('')}</ul>
  </div>
  <div class="vs-c vs-ok">
    <div class="vs-ill">${avatar(true)}<div class="nts">${notif('bank', 'Airbnb · Versement', 'Vos loyers ont été envoyés sur votre compte.')}${notif('video', 'Rim Conciergerie · 11:42', 'Ménage terminé, vidéo envoyée.')}</div></div>
    <p class="vs-k">Le même, avec Rim Conciergerie</p><p class="vs-t">Il reçoit ses loyers, c’est tout</p>
    <ul>${rim.map((x) => `<li>${icon('check', 'i i-s')}<span>${x}</span></li>`).join('')}</ul>
  </div>
</div>`;
}

// ---------- Tarifs ----------
export function tarifs() {
  const bc = breadcrumbs([{ name: 'Tarifs', path: '/tarifs' }]);
  const faq = faqBlock(
    [
      { q: 'Y a-t-il des frais fixes ou un abonnement ?', a: "<p>Non. Notre seule rémunération régulière est la commission, calculée sur ce que le logement a réellement rapporté dans le mois. Les photos professionnelles sont une option facturée à part.</p>" },
      { q: 'La TVA s’ajoute-t-elle ?', a: `<p>Non. ${esc(ctx.s.mention_tva)}</p>` },
      { q: 'Quand dois-je payer ?', a: '<p>Nous vous envoyons une facture par e-mail chaque mois. Elle est payable par virement sous 7 jours.</p>' },
      { q: 'De quoi dépend le taux de commission ?', a: "<p>Du logement et du nombre de biens que vous nous confiez. Le tarif est dégressif. Nous vous donnons le taux exact lors de l'estimation, avant toute signature.</p>" },
    ],
    { titre: 'Questions sur', script: 'nos tarifs' }
  );
  const body = `${bc.html}
<section class="hero hero-tight"><div class="wrap">
  <p class="kicker">Tarifs de conciergerie Airbnb</p>
  <h1 class="h1">Nos tarifs : une commission, <span class="script">rien de fixe</span></h1>
  <p class="lead">Nous gagnons un pourcentage de ce que votre logement rapporte réellement : de 20 à 25 % des recettes nettes. Si un mois est calme, notre facture l'est aussi.</p>
</div></section>

<section class="sec sec-first" id="grille" aria-label="Notre commission"><div class="wrap">${pricesHtml()}</div></section>

<section class="sec sec-gray" id="compare" aria-labelledby="compare-t"><div class="wrap">
  <h2 class="h2" id="compare-t">Gérer seul ou avec <span class="script">une conciergerie ?</span></h2>
  ${answer("Gérer seul ne coûte pas de commission, mais coûte du temps, des nuits interrompues et des avis à risque. Voici le même propriétaire, avec le même logement, dans les deux situations.")}
  ${compareVisuel()}
  <p class="more"><a class="lnk" href="/blog/conciergerie-airbnb-ou-gerer-seul">Lire notre guide pour choisir ${icon('arrow')}</a></p>
</div></section>

${faq.html}
${finalCta()}`;
  return {
    path: '/tarifs',
    title: 'Tarifs conciergerie Airbnb Île-de-France | Rim Conciergerie',
    description: 'Commission de 20 à 25 % des recettes locatives nettes, dégressive, sans abonnement ni frais fixes. Et pourquoi une conciergerie change tout.',
    body,
    schema: [bc.schema, faq.schema, { '@type': 'Service', name: 'Conciergerie Airbnb, gestion complète', provider: { '@id': `${ctx.s.url}/#entreprise` }, areaServed: 'Île-de-France', offers: { '@type': 'Offer', name: 'Gestion complète', description: 'De 20 à 25 % des recettes locatives nettes, selon le logement et le nombre de biens', priceCurrency: 'EUR' } }],
    lastmod: ctx.today,
  };
}
