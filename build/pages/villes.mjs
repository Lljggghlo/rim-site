// Pages villes (contenu propre à chaque ville, dans content/villes/*.md) et pages départements
import { marked } from 'marked';
import { ctx, esc, icon, answer, faqBlock, breadcrumbs, bienCard, finalCta, microForm, proofs, sec } from '../lib.mjs';
import { VERIF, pricesHtml } from './core.mjs';

export const DEPTS = {
  '78': { nom: 'Yvelines', slug: 'yvelines', path: 'conciergerie-airbnb-yvelines', de: 'des Yvelines', dans: 'dans les Yvelines' },
  '92': { nom: 'Hauts-de-Seine', slug: 'hauts-de-seine', path: 'conciergerie-airbnb-hauts-de-seine', de: 'des Hauts-de-Seine', dans: 'dans les Hauts-de-Seine' },
  '94': { nom: 'Val-de-Marne', slug: 'val-de-marne', path: 'conciergerie-airbnb-val-de-marne', de: 'du Val-de-Marne', dans: 'dans le Val-de-Marne' },
  '91': { nom: 'Essonne', slug: 'essonne', path: 'conciergerie-airbnb-essonne', de: "de l'Essonne", dans: "dans l'Essonne" },
  '77': { nom: "Val d'Europe", slug: 'val-d-europe', path: 'conciergerie-airbnb-val-d-europe', de: "du Val d'Europe", dans: "au Val d'Europe" },
  '75': { nom: 'Paris', slug: 'paris', path: '', de: 'de Paris', dans: 'à Paris' },
};

const regleUsageDefaut = (v) => {
  if (['92', '94'].includes(v.departement))
    return `Obligatoire pour louer en courte durée un logement qui n'est pas votre résidence principale : la règle s'applique automatiquement ${DEPTS[v.departement].dans}. La mairie de ${v.ville} fixe ses conditions (durée de l'autorisation, compensation éventuelle) dans son règlement.`;
  return `Pas automatique ${DEPTS[v.departement].dans} : il ne s'applique à ${v.ville} que si le conseil municipal l'a instauré par délibération. Nous le vérifions avec vous auprès de la mairie avant de signer.`;
};
const regleEnregDefaut = (v) =>
  `Obligatoire pour tout meublé de tourisme depuis mai 2026. Le téléservice national n'est pas encore ouvert : la déclaration se fait auprès de la mairie de ${v.ville}, selon sa procédure actuelle.`;
const regleRpDefaut = (v) => `120 nuits par an au maximum pour une résidence principale, sauf si la commune a abaissé ce plafond (jusqu'à 90).`;

export function villePage(v, data) {
  const D = DEPTS[v.departement];
  const voisins = (v.voisins || []).map((sl) => ctx.villes.find((x) => x.slug === sl)).filter(Boolean);
  const bien = v.bien ? data.biens.find((b) => b.slug === v.bien) : null;
  const crumbs = [];
  if (v.departement !== '75') crumbs.push({ name: D.nom, path: '/' + D.path });
  crumbs.push({ name: v.ville, path: '/' + v.path });
  const bc = breadcrumbs(crumbs);
  const faqItems = [
    ...(v.faq || []).map((f) => ({ q: f.q, a: marked.parse(f.a) })),
    {
      q: `Combien coûte une conciergerie Airbnb à ${v.ville} ?`,
      a: `<p>De 20 à 25 % des recettes locatives nettes, selon le logement et le nombre de biens confiés, avec un tarif dégressif et sans abonnement. <a href="/tarifs">Voir nos tarifs</a>.</p>`,
    },
  ];
  const faq = faqBlock(faqItems, { titre: 'Questions fréquentes', script: `à ${v.ville}`, intro: `Les questions que nous posent les propriétaires de ${v.ville} avant de nous confier leur logement : règles locales, demande des voyageurs et tarif.` });
  const regles = `<div class="tbl-wrap"><table class="tbl"><caption>Règles applicables à ${esc(v.ville)}</caption><thead><tr><th scope="col">Règle</th><th scope="col">À ${esc(v.ville)}</th></tr></thead><tbody>
<tr><td><b>Numéro d'enregistrement</b></td><td>${esc(v.regle_enregistrement || regleEnregDefaut(v))}</td></tr>
<tr><td><b>Changement d'usage</b></td><td>${esc(v.regle_usage || regleUsageDefaut(v))}</td></tr>
<tr><td><b>Résidence principale</b></td><td>${esc(v.regle_rp || regleRpDefaut(v))}</td></tr>
<tr><td><b>Taxe de séjour</b></td><td>Collectée par Airbnb et Booking sur les réservations qu'elles encaissent.</td></tr>
</tbody></table></div>
<p class="verif">Vérifié le ${VERIF}${v.regle_source ? `, d'après ${esc(v.regle_source)}` : ''}. À reconfirmer auprès de la mairie de ${esc(v.ville)}.</p>`;

  const body = `${bc.html}
<section class="hero${v.photo ? ' hero-photo hero-ville' : ''}">${v.photo ? `<img class="hero-bg" src="${esc(v.photo)}"${/-1920\.webp$/.test(v.photo) ? ` srcset="${esc(v.photo.replace(/-1920\.webp$/, '-960.webp'))} 960w, ${esc(v.photo)} 1920w" sizes="100vw"` : ''} width="1920" height="1280" alt="${esc(v.photo_alt || v.ville)}" fetchpriority="high">${v.photo_credit ? `<p class="hero-credit">Photo : ${esc(v.photo_credit)}</p>` : ''}` : ''}<div class="wrap hero-g">
  <div class="hero-head">
    <p class="eyebrow"><span class="dot">${icon('pin')}</span><b>${esc(v.ville)}</b>&nbsp;· ${esc(D.nom)}${v.departement !== '75' ? ` (${v.departement})` : ''}</p>
    <h1 class="h1">Conciergerie Airbnb <span class="script${v.ville.length > 14 ? ' script-long' : ''}">à ${esc(v.ville)}</span></h1>
    <p class="lead">${esc(v.intro)}</p>
  </div>
  <div class="hero-form">${microForm({ id: 'hero', ville: v.ville })}</div>
  <div class="hero-more">${proofs()}</div>
</div></section>

${sec('demande', 'Louer en courte durée', `<ul class="checks">${(v.atouts || []).map((a) => `<li>${icon('check')}<span>${esc(a)}</span></li>`).join('')}</ul>
${v.quartiers && v.quartiers.length ? `<h3 class="zone-h">Secteurs que nous connaissons</h3><div class="g2">${v.quartiers.map((q) => `<div class="card feat"><h3>${esc(q.nom)}</h3><p>${esc(q.note)}</p></div>`).join('')}</div>` : ''}`, {
    gray: true,
    script: `à ${v.ville}`,
    intro: esc(v.voyageurs),
  })}

${sec('regles', 'Les règles', regles, { script: `à ${v.ville}`, intro: esc(v.regles_intro || `Avant de louer votre logement en courte durée à ${v.ville}, trois points se vérifient : l'enregistrement du meublé, le changement d'usage s'il ne s'agit pas de votre résidence principale, et le plafond de nuitées s'il s'agit de votre résidence principale.`) })}

${bien ? sec('bien', v.bien_titre || 'Un logement que nous gérons', `<div class="biens"><div>${bienCard(bien)}</div><div class="prose">${marked.parse(bien.histoire || '')}</div></div>`, { gray: true, script: v.bien_script || `à ${bien.ville}`, intro: esc(v.bien_intro || bien.resume) }) : ''}

<section class="sec${bien ? '' : ' sec-gray'}" id="regard" aria-labelledby="regard-t"><div class="wrap narrow">
  <h2 class="h2" id="regard-t">Notre regard <span class="script">sur ${esc(v.ville)}</span></h2>
  <div class="prose prose-lead">${marked.parse(v.body || '').replace(/<p>([^<]*?[.!?])(\s)/g, '<p><strong>$1</strong>$2')}</div>
</div></section>

${sec('gestion', 'Ce que nous gérons', `<div class="g3">
  <article class="feat card"><span class="ic">${icon('chart')}</span><h3>Annonce et prix</h3><p>Annonces sur vos comptes Airbnb et Booking, prix ajustés chaque jour selon la demande ${esc(v.demande_courte || `à ${v.ville}`)}.</p></article>
  <article class="feat card"><span class="ic">${icon('message')}</span><h3>Voyageurs</h3><p>Messages 24 h/24, automatiques à chaque étape, arrivées autonomes, urgences par téléphone.</p></article>
  <article class="feat card"><span class="ic">${icon('video')}</span><h3>Ménage filmé</h3><p>Vidéo horodatée avant et après chaque ménage, ${v.trajet_min === 0 ? 'à quelques minutes de notre base' : `à ${esc(v.trajet)} de notre base de Guyancourt`}.</p></article>
</div>
<p class="more"><a class="lnk" href="/services">Tous nos services ${icon('arrow')}</a></p>`, { gray: !bien, script: `pour votre logement`, intro: `À ${esc(v.ville)} comme ailleurs, nous prenons en charge toute la location : annonces, prix, voyageurs, ménage contrôlé et incidents. Vos loyers vous sont versés directement par les plateformes.` })}

${faq.html}

${sec('autour', 'Nous intervenons aussi', `<ul class="chips">${voisins.map((x) => `<li><a href="/${x.path}">Conciergerie Airbnb à ${esc(x.ville)}</a></li>`).join('')}${v.departement !== '75' ? `<li><a href="/${D.path}">Toutes nos communes : ${esc(D.nom)}</a></li>` : ''}</ul>`, {
    script: `autour de ${v.ville}`,
    intro: `Depuis Guyancourt, nous gérons aussi des logements dans les communes voisines de ${esc(v.ville)}${voisins.length ? ', notamment ' + voisins.map((x) => esc(x.ville)).join(' et ') : ''}. Notre équipe intervient dans toute l'Île-de-France.`,
  })}

${finalCta({ ville: v.ville, titre: `Estimez votre logement`, script: `à ${esc(v.ville)}` })}`;

  return {
    path: '/' + v.path,
    title: v.title || `Conciergerie Airbnb ${v.ville} | Rim Conciergerie`,
    description: v.description,
    body,
    schema: [
      bc.schema,
      faq.schema,
      {
        '@type': 'Service',
        name: `Conciergerie Airbnb à ${v.ville}`,
        serviceType: 'Conciergerie pour location courte durée',
        provider: { '@id': `${ctx.s.url}/#entreprise` },
        areaServed: { '@type': 'City', name: v.ville, containedInPlace: { '@type': 'AdministrativeArea', name: D.nom } },
      },
    ],
    lastmod: v.mis_a_jour || ctx.today,
  };
}

// ---------- Pages départements ----------
const DEPT_TXT = {
  '78': {
    h1: ['Conciergerie Airbnb', 'dans les Yvelines'],
    lead: "Notre base est à Guyancourt, au cœur de Saint-Quentin-en-Yvelines. Nous intervenons dans les Yvelines proches de Paris : Versailles et sa couronne, la boucle de Seine, Saint-Germain-en-Laye et les communes de l'agglomération.",
    regles: "Dans les Yvelines, le changement d'usage n'est pas automatique : il ne s'applique que dans les communes qui l'ont instauré par délibération. Versailles l'applique depuis 2018. Le numéro d'enregistrement, lui, est obligatoire partout depuis mai 2026.",
    voyageurs: "Les voyageurs viennent pour le château de Versailles et les domaines royaux, pour les entreprises de Saint-Quentin-en-Yvelines et de Vélizy, pour le Golf National, et pour rejoindre Paris en train. Les séjours professionnels en semaine complètent les week-ends touristiques.",
    title: 'Conciergerie Airbnb Yvelines (78) | Rim Conciergerie',
    description: 'Conciergerie Airbnb dans les Yvelines, depuis Guyancourt : Versailles, Saint-Quentin-en-Yvelines, Saint-Germain-en-Laye et toutes nos communes du 78.',
  },
  '92': {
    h1: ['Conciergerie Airbnb', 'dans les Hauts-de-Seine'],
    lead: "Des portes de Paris à La Défense, nous gérons des logements dans tout le 92. C'est le département le plus proche de Guyancourt après les Yvelines : 15 à 35 minutes selon les communes, hors heures de pointe.",
    regles: "Dans les Hauts-de-Seine, le changement d'usage est obligatoire dans toutes les communes pour louer en courte durée un logement qui n'est pas une résidence principale. Chaque mairie fixe ses propres conditions. Le numéro d'enregistrement est obligatoire partout depuis mai 2026.",
    voyageurs: "La demande vient de Paris tout proche, des quartiers d'affaires (La Défense, Issy, Boulogne), des salons de Paris Expo Porte de Versailles et des grands événements : Roland-Garros, Paris La Défense Arena. Les séjours courts de professionnels sont nombreux en semaine.",
    title: 'Conciergerie Airbnb Hauts-de-Seine (92) | Rim Conciergerie',
    description: 'Conciergerie Airbnb dans les Hauts-de-Seine : Boulogne, Issy, Montrouge, Suresnes, La Défense et toutes nos communes du 92. Règles locales expliquées.',
  },
  '94': {
    h1: ['Conciergerie Airbnb', 'dans le Val-de-Marne'],
    lead: "Autour de l'aéroport d'Orly et aux portes de l'est parisien, nous gérons des logements dans le Val-de-Marne. Orly est à 25 minutes de Guyancourt hors heures de pointe ; l'est du département demande davantage de route.",
    regles: "Dans le Val-de-Marne, le changement d'usage est obligatoire dans toutes les communes pour louer en courte durée un logement qui n'est pas une résidence principale. Chaque mairie fixe ses conditions. Le numéro d'enregistrement est obligatoire partout depuis mai 2026.",
    voyageurs: "Deux moteurs de demande : l'aéroport d'Orly (escales, équipages, départs matinaux) et la proximité de Paris par le métro (lignes 1, 7, 8 et 14) et le RER A. Le bois de Vincennes et les bords de Marne attirent aussi des familles.",
    title: 'Conciergerie Airbnb Val-de-Marne (94) | Rim Conciergerie',
    description: "Conciergerie Airbnb dans le Val-de-Marne : Orly, Vincennes, Ivry, Villejuif et toutes nos communes du 94. Changement d'usage et règles expliqués.",
  },
  '91': {
    h1: ['Conciergerie Airbnb', "dans l'Essonne"],
    lead: "Nous intervenons dans toute l'Essonne, et surtout dans le nord du département, à 15 à 35 minutes de Guyancourt : le plateau de Saclay, Massy et sa gare TGV, et les communes autour de l'aéroport d'Orly et de Juvisy.",
    regles: "Dans l'Essonne, le changement d'usage n'est pas automatique : il ne s'applique que dans les communes qui l'ont instauré par délibération. Le numéro d'enregistrement est obligatoire partout depuis mai 2026.",
    voyageurs: "Chercheurs, étudiants et intervenants du plateau de Saclay, voyageurs en correspondance à Massy TGV, passagers et équipages de l'aéroport d'Orly : la demande du nord de l'Essonne est d'abord professionnelle, avec des séjours courts en semaine.",
    title: "Conciergerie Airbnb Essonne (91) | Rim Conciergerie",
    description: "Conciergerie Airbnb dans l'Essonne : Massy, Palaiseau, Athis-Mons, Juvisy et tout le 91, depuis notre base de Guyancourt. Règles locales expliquées.",
  },
  '77': {
    h1: ['Conciergerie Airbnb', "au Val d'Europe"],
    lead: "Autour de Disneyland Paris, nous gérons des logements à Chessy, Serris et dans les communes voisines. C'est notre zone la plus éloignée : environ 55 minutes de Guyancourt hors heures de pointe.",
    regles: "En Seine-et-Marne, le changement d'usage n'est pas automatique : il ne s'applique que dans les communes qui l'ont instauré. Le numéro d'enregistrement est obligatoire partout depuis mai 2026. Autour des parcs, vérifiez aussi le règlement de copropriété des résidences récentes.",
    voyageurs: "Les familles qui viennent à Disneyland Paris forment l'essentiel de la demande, toute l'année, avec des pics pendant les vacances scolaires. La gare Marne-la-Vallée–Chessy (TGV et RER A) amène aussi des voyageurs d'autres régions et de l'étranger.",
    title: "Conciergerie Airbnb Val d'Europe | Rim Conciergerie",
    description: "Conciergerie Airbnb au Val d'Europe : Chessy, Serris, Magny-le-Hongre, Bailly-Romainvilliers, près de Disneyland Paris. Règles et demande expliquées.",
  },
};

export function deptPage(dep) {
  const D = DEPTS[dep];
  const T = DEPT_TXT[dep];
  const list = ctx.communes.filter((c) => c.dep === dep).sort((a, b) => a.trajet - b.trajet || a.nom.localeCompare(b.nom, 'fr'));
  const pages = ctx.villes.filter((v) => v.departement === dep);
  const bc = breadcrumbs([{ name: D.nom, path: '/' + D.path }]);
  const rows = list
    .map((c) => {
      const p = pages.find((v) => v.ville === c.nom);
      const t = c.trajet === 0 ? 'Sur place' : `${c.trajet} min`;
      return `<tr><td>${p ? `<a href="/${p.path}">${esc(c.nom)}</a>` : esc(c.nom)}</td><td>${t}</td><td>${esc(c.repere || '')}</td></tr>`;
    })
    .join('');
  const faq = faqBlock(
    [
      { q: `Dans quelles communes ${D.de} intervenez-vous ?`, a: `<p>Dans toutes les communes ${D.de}. Les ${list.length} communes listées sur cette page sont celles où nous sommes le plus présents ; si la vôtre n'y figure pas, écrivez-nous, nous intervenons dans toute l'Île-de-France.</p>` },
      { q: `Faut-il une autorisation pour louer en courte durée ${D.dans} ?`, a: `<p>${T.regles}</p><p class="verif">Vérifié le ${VERIF}. À reconfirmer auprès de la mairie de votre commune.</p>` },
    ],
    { titre: 'Questions fréquentes', script: D.dans }
  );
  const body = `${bc.html}
<section class="hero"><div class="wrap hero-g">
  <div class="hero-head">
    <p class="kicker">${esc(D.nom)}${dep !== '77' ? ` (${dep})` : ' (77)'}</p>
    <h1 class="h1">${T.h1[0]} <span class="script">${esc(T.h1[1])}</span></h1>
    <p class="lead">${esc(T.lead)}</p>
  </div>
  <div class="hero-form">${microForm({ id: 'hero' })}</div>
  <div class="hero-more">${proofs()}</div>
</div></section>

${pages.length ? sec('villes', 'Nos pages', `<ul class="chips">${pages.map((v) => `<li><a href="/${v.path}">Conciergerie Airbnb à ${esc(v.ville)}</a></li>`).join('')}</ul>`, { script: 'par ville', intro: `Pour les villes ${D.de} où la demande est la plus forte, une page détaille les règles locales, les secteurs et le profil des voyageurs.` }) : ''}

${sec('communes', 'Nos principales communes', `<div class="tbl-wrap"><table class="tbl"><caption>${list.length} communes ${esc(D.de)}, trajet estimé depuis Guyancourt hors heures de pointe</caption><thead><tr><th scope="col">Commune</th><th scope="col">Trajet</th><th scope="col">Ce qui attire les voyageurs</th></tr></thead><tbody>${rows}</tbody></table></div>`, { gray: true, script: D.de, intro: `Nous intervenons dans tout le département ; voici les ${list.length} communes ${D.de} où nous sommes le plus présents. Le tableau donne le temps de trajet depuis notre base de Guyancourt, hors heures de pointe, et ce qui fait venir les voyageurs dans chacune.` })}

${sec('demande', 'Qui loue', `<p class="answer" style="margin-top:0">${esc(T.voyageurs)}</p>`, { script: D.dans + ' ?' })}

${sec('regles', 'Les règles', `<p class="answer" style="margin-top:0">${esc(T.regles)}</p><p class="verif">Vérifié le ${VERIF}. À reconfirmer auprès de la mairie de votre commune. <a class="lnk" href="/blog/changement-usage-yvelines-hauts-de-seine">Notre guide du changement d'usage</a></p>`, { gray: true, script: D.dans })}

${sec('tarif', 'Le même tarif', pricesHtml(), { script: 'partout', intro: "Notre commission ne dépend pas de la commune : de 20 à 25 % des recettes locatives nettes, selon le logement et le nombre de biens, avec un tarif dégressif. Sans abonnement." })}

${faq.html}
${finalCta()}`;
  return {
    path: '/' + D.path,
    title: T.title,
    description: T.description,
    body,
    schema: [bc.schema, faq.schema, { '@type': 'Service', name: `Conciergerie Airbnb ${D.dans}`, provider: { '@id': `${ctx.s.url}/#entreprise` }, areaServed: { '@type': 'AdministrativeArea', name: D.nom } }],
    lastmod: ctx.today,
  };
}
