// Pages villes (contenu propre à chaque ville, dans content/villes/*.md) et pages départements
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
const STATIC_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'static');
import { ctx, esc, icon, answer, faqBlock, breadcrumbs, bienCard, finalCta, microForm, proofs, sec } from '../lib.mjs';
import { VERIF, pricesHtml } from './core.mjs';
import { postCard } from './blog.mjs';

export const DEPTS = {
  '78': { nom: 'Yvelines', slug: 'yvelines', path: 'conciergerie-airbnb-yvelines', de: 'des Yvelines', dans: 'dans les Yvelines' },
  '92': { nom: 'Hauts-de-Seine', slug: 'hauts-de-seine', path: 'conciergerie-airbnb-hauts-de-seine', de: 'des Hauts-de-Seine', dans: 'dans les Hauts-de-Seine' },
  '93': { nom: 'Seine-Saint-Denis', slug: 'seine-saint-denis', path: 'conciergerie-airbnb-seine-saint-denis', de: 'de Seine-Saint-Denis', dans: 'en Seine-Saint-Denis' },
  '94': { nom: 'Val-de-Marne', slug: 'val-de-marne', path: 'conciergerie-airbnb-val-de-marne', de: 'du Val-de-Marne', dans: 'dans le Val-de-Marne' },
  '91': { nom: 'Essonne', slug: 'essonne', path: 'conciergerie-airbnb-essonne', de: "de l'Essonne", dans: "dans l'Essonne" },
  '77': { nom: "Val d'Europe", slug: 'val-d-europe', path: 'conciergerie-airbnb-val-d-europe', de: "du Val d'Europe", dans: "au Val d'Europe" },
  '75': { nom: 'Paris', slug: 'paris', path: '', de: 'de Paris', dans: 'à Paris' },
};

const regleUsageDefaut = (v) => {
  if (['92', '93', '94'].includes(v.departement))
    return `À vérifier auprès de la mairie de ${v.ville} pour un logement qui n'est pas votre résidence principale. Jusqu'en novembre 2024, l'autorisation était obligatoire d'office dans toutes les communes ${DEPTS[v.departement].de} ; depuis la loi du 19 novembre 2024, elle dépend d'une délibération de la commune ou de son intercommunalité, qui en fixe les conditions (durée, compensation éventuelle).`;
  return `Pas automatique ${DEPTS[v.departement].dans} : il ne s'applique à ${v.ville} que si le conseil municipal l'a instauré par délibération. Nous le vérifions avec vous auprès de la mairie avant de signer.`;
};
const regleEnregDefaut = (v) =>
  `Obligatoire pour tout meublé de tourisme depuis mai 2026. Le téléservice national n'est pas encore ouvert : la déclaration se fait auprès de la mairie de ${v.ville}, selon sa procédure actuelle.`;
const regleRpDefaut = (v) => `120 nuits par an au maximum pour une résidence principale, sauf si la commune a abaissé ce plafond (jusqu'à 90).`;

// Communes de la communauté d'agglomération de Saint-Quentin-en-Yvelines (12)
export const SQY = ['Guyancourt', 'Montigny-le-Bretonneux', 'Voisins-le-Bretonneux', 'Trappes', 'Élancourt', 'La Verrière', 'Magny-les-Hameaux', 'Maurepas', 'Plaisir', 'Les Clayes-sous-Bois', 'Villepreux', 'Coignières'];
export const SQY_PATH = 'conciergerie-airbnb-saint-quentin-en-yvelines';

export function villePage(v, data) {
  const D = DEPTS[v.departement];
  const voisins = (v.voisins || []).map((sl) => ctx.villes.find((x) => x.slug === sl)).filter(Boolean);
  const bien = v.bien ? data.biens.find((b) => b.slug === v.bien) : null;
  const guides = (data.posts || []).filter((p) => p.ville === v.slug).slice(0, 3);
  const dansSqy = SQY.includes(v.ville);
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

${sec('gestion', 'Gestion Airbnb', `<div class="g3">
  <article class="feat card"><span class="ic">${icon('chart')}</span><h3>Annonce et prix</h3><p>Annonces sur vos comptes Airbnb et Booking, prix ajustés chaque jour selon la demande ${esc(v.demande_courte || `à ${v.ville}`)}.</p></article>
  <article class="feat card"><span class="ic">${icon('message')}</span><h3>Voyageurs</h3><p>Messages 24 h/24, automatiques à chaque étape, arrivées autonomes, urgences par téléphone.</p></article>
  <article class="feat card"><span class="ic">${icon('video')}</span><h3>Ménage filmé</h3><p>Vidéo horodatée avant et après chaque ménage, ${v.trajet_min === 0 ? 'à quelques minutes de notre base' : `à ${esc(v.trajet)} de notre base de Guyancourt`}.</p></article>
</div>
<p class="more"><a class="lnk" href="/gestion-airbnb-booking">Notre gestion Airbnb et Booking en détail ${icon('arrow')}</a> <a class="lnk" href="/services">Tous nos services ${icon('arrow')}</a></p>`, { gray: !bien, script: `à ${v.ville}`, intro: `À ${esc(v.ville)} comme ailleurs, nous prenons en charge toute la location : annonces, prix, voyageurs, ménage contrôlé et incidents. Vos loyers vous sont versés directement par les plateformes.` })}

${guides.length ? `<section class="sec" id="guides" aria-labelledby="guides-t"><div class="wrap"><h2 class="h2" id="guides-t">Nos guides <span class="script">sur ${esc(v.ville)}</span></h2><p class="answer">Pour aller plus loin que cette page : nos articles consacrés à la location courte durée à ${esc(v.ville)}, avec les règles de la commune et leur date de vérification.</p><div class="pgrid" style="margin-top:28px">${guides.map((p) => postCard(p, { hx: 'h3' })).join('')}</div></div></section>` : ''}

${faq.html}

${sec('autour', 'Nous intervenons aussi', `<ul class="chips">${voisins.map((x) => `<li><a href="/${x.path}">Conciergerie Airbnb à ${esc(x.ville)}</a></li>`).join('')}${dansSqy ? `<li><a href="/${SQY_PATH}">Conciergerie Airbnb à Saint-Quentin-en-Yvelines</a></li>` : ''}${v.departement !== '75' ? `<li><a href="/${D.path}">Toutes nos communes : ${esc(D.nom)}</a></li>` : ''}</ul>`, {
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
    regles: "Dans les Hauts-de-Seine, louer en courte durée un logement qui n'est pas une résidence principale était soumis d'office au changement d'usage dans toutes les communes jusqu'en novembre 2024. Depuis la loi du 19 novembre 2024, l'autorisation dépend d'une délibération de la commune ou de son intercommunalité, qui en fixe les conditions : la règle en vigueur se vérifie auprès de chaque mairie des Hauts-de-Seine. Le numéro d'enregistrement est obligatoire partout depuis mai 2026.",
    voyageurs: "La demande vient de Paris tout proche, des quartiers d'affaires (La Défense, Issy, Boulogne), des salons de Paris Expo Porte de Versailles et des grands événements : Roland-Garros, Paris La Défense Arena. Les séjours courts de professionnels sont nombreux en semaine.",
    title: 'Conciergerie Airbnb Hauts-de-Seine (92) | Rim Conciergerie',
    description: 'Conciergerie Airbnb dans les Hauts-de-Seine : Boulogne, Issy, Montrouge, Suresnes, La Défense et toutes nos communes du 92. Règles locales expliquées.',
  },
  '93': {
    h1: ['Conciergerie Airbnb', 'en Seine-Saint-Denis'],
    lead: "Aux portes nord et est de Paris, nous gérons des logements en Seine-Saint-Denis : autour du Stade de France, le long du métro à Saint-Ouen, Pantin et Montreuil, et près du parc des expositions de Villepinte. C'est une zone plus éloignée de notre base de Guyancourt : comptez 40 à 55 minutes hors heures de pointe.",
    regles: "En Seine-Saint-Denis, louer en courte durée un logement qui n'est pas une résidence principale était soumis d'office au changement d'usage dans toutes les communes jusqu'en novembre 2024. Depuis la loi du 19 novembre 2024, l'autorisation dépend d'une délibération de la commune ou de son intercommunalité, qui en fixe les conditions : la règle en vigueur se vérifie auprès de chaque mairie de Seine-Saint-Denis. Le numéro d'enregistrement est obligatoire partout depuis mai 2026.",
    voyageurs: "La demande vient des matchs et des concerts du Stade de France, des salons de Paris Nord Villepinte et du Bourget, de l'aéroport Paris-Charles-de-Gaulle tout proche, et de voyageurs qui cherchent un logement à quelques stations de métro de Paris, souvent pour une ou deux nuits.",
    title: 'Conciergerie Airbnb Seine-Saint-Denis 93 | Rim Conciergerie',
    description: "Conciergerie Airbnb en Seine-Saint-Denis : Saint-Denis, Saint-Ouen, Montreuil, Pantin et tout le 93. Changement d'usage et règles locales expliqués.",
  },
  '94': {
    h1: ['Conciergerie Airbnb', 'dans le Val-de-Marne'],
    lead: "Autour de l'aéroport d'Orly et aux portes de l'est parisien, nous gérons des logements dans le Val-de-Marne. Orly est à 25 minutes de Guyancourt hors heures de pointe ; l'est du département demande davantage de route.",
    regles: "Dans le Val-de-Marne, louer en courte durée un logement qui n'est pas une résidence principale était soumis d'office au changement d'usage dans toutes les communes jusqu'en novembre 2024. Depuis la loi du 19 novembre 2024, l'autorisation dépend d'une délibération de la commune ou de son intercommunalité, qui en fixe les conditions : la règle en vigueur se vérifie auprès de chaque mairie du Val-de-Marne. Le numéro d'enregistrement est obligatoire partout depuis mai 2026.",
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
    <p class="kicker">${esc(D.nom)} (${dep})</p>
    <h1 class="h1">${T.h1[0]} <span class="script">${esc(T.h1[1])}</span></h1>
    <p class="lead">${esc(T.lead)}</p>
  </div>
  <div class="hero-form">${microForm({ id: 'hero' })}</div>
  <div class="hero-more">${proofs()}</div>
</div></section>

${pages.length ? sec('villes', 'Nos pages', `<ul class="chips">${dep === '78' ? `<li><a href="/${SQY_PATH}">Conciergerie Airbnb à Saint-Quentin-en-Yvelines</a></li>` : ''}${pages.map((v) => `<li><a href="/${v.path}">Conciergerie Airbnb à ${esc(v.ville)}</a></li>`).join('')}</ul>`, { script: 'par ville', intro: `Pour les villes ${D.de} où la demande est la plus forte, une page détaille les règles locales, les secteurs et le profil des voyageurs.` }) : ''}

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

// ---------- Saint-Quentin-en-Yvelines : la page de notre agglomération ----------
const SQY_VERIF = '15/11/2026';
const SQY_COMMUNES = [
  ['Guyancourt', 'Notre base', 'Technocentre Renault, Golf National, université'],
  ['Montigny-le-Bretonneux', '5 min', 'Gare de Saint-Quentin-en-Yvelines (RER C, lignes N et U), Vélodrome National'],
  ['Voisins-le-Bretonneux', '10 min', 'Quartiers résidentiels, à côté du Technocentre'],
  ['Trappes', '10 min', 'Gare de Trappes (lignes N et U), île de loisirs'],
  ['Élancourt', '10 min', "France Miniature, pôles d'entreprises"],
  ['La Verrière', '10 min', 'Gare de La Verrière (lignes N et U)'],
  ['Magny-les-Hameaux', '10 min', 'Port-Royal des Champs, vallée de Chevreuse'],
  ['Maurepas', '15 min', 'Centre commercial, quartiers pavillonnaires'],
  ['Plaisir', '15 min', "Pôle commercial, gares de Plaisir, zones d'activité"],
  ['Les Clayes-sous-Bois', '15 min', 'Gare de Villepreux – Les Clayes (ligne N)'],
  ['Villepreux', '15 min', 'Village ancien et quartiers résidentiels'],
  ['Coignières', '15 min', 'Zone commerciale de la N10, gare de Coignières (ligne N)'],
];

export function sqyPage(data) {
  const s = ctx.s;
  const bc = breadcrumbs([{ name: 'Yvelines', path: '/conciergerie-airbnb-yvelines' }, { name: 'Saint-Quentin-en-Yvelines', path: '/' + SQY_PATH }]);
  const pageDe = (nom) => ctx.villes.find((v) => v.ville === nom);
  const bien = data.biens.find((b) => b.slug === 'sejour-luxe-guyancourt');
  const guides = (data.posts || []).filter((p) => ['guyancourt', 'montigny-le-bretonneux', 'saint-quentin-en-yvelines'].includes(p.ville)).slice(0, 3);
  const photo = '/images/villes/saint-quentin-en-yvelines-1920.webp';
  const cr = (ctx.credits || {})['saint-quentin-en-yvelines'];
  const credit = cr ? { alt: cr.alt, credit: `${cr.auteur}, ${cr.licence}, via Wikimedia Commons` } : null;
  const rows = SQY_COMMUNES.map(([nom, t, r]) => {
    const p = pageDe(nom);
    return `<tr><td>${p ? `<a href="/${p.path}">${esc(nom)}</a>` : esc(nom)}</td><td>${t}</td><td>${esc(r)}</td></tr>`;
  }).join('');
  const faq = faqBlock(
    [
      { q: 'Dans quelles communes de Saint-Quentin-en-Yvelines intervenez-vous ?', a: `<p>Dans les douze : Guyancourt, Montigny-le-Bretonneux, Voisins-le-Bretonneux, Trappes, Élancourt, La Verrière, Magny-les-Hameaux, Maurepas, Plaisir, Les Clayes-sous-Bois, Villepreux et Coignières. Toutes sont à quinze minutes au plus de notre base de Guyancourt, hors heures de pointe.</p>` },
      { q: 'Qui paie la taxe de séjour à Saint-Quentin-en-Yvelines ?', a: `<p>Le voyageur. La taxe de séjour est intercommunale : elle s'applique dans les douze communes de l'agglomération. Quand la plateforme encaisse la réservation, c'est elle qui collecte la taxe et la déclare. Pour une réservation en direct, c'est au loueur de la collecter et de la déclarer chaque trimestre sur le portail de l'agglomération.</p><p class="verif">Vérifié le ${SQY_VERIF}, d'après le guide pratique de la taxe de séjour publié par Saint-Quentin-en-Yvelines. À reconfirmer auprès de l'agglomération.</p>` },
      { q: 'Y a-t-il assez de demande en dehors de Versailles ?', a: `<p>Oui, mais elle est différente. À Saint-Quentin-en-Yvelines, la demande est d'abord professionnelle, en semaine : missions dans les entreprises, formations, déplacements liés à l'université. Le week-end, des familles y logent pour visiter Versailles ou pour un événement sportif. Les prix et les durées de séjour se règlent en conséquence.</p>` },
      { q: 'Combien coûte une conciergerie Airbnb à Saint-Quentin-en-Yvelines ?', a: `<p>De 20 à 25 % des recettes locatives nettes, selon le logement et le nombre de biens confiés, avec un tarif dégressif et sans abonnement. <a href="/tarifs">Voir nos tarifs</a>.</p>` },
    ],
    { titre: 'Questions fréquentes', script: 'à Saint-Quentin-en-Yvelines', intro: "Les questions que nous posent les propriétaires de l'agglomération avant de nous confier leur logement : communes couvertes, taxe de séjour, demande et tarif." }
  );
  const hasPhoto = fs.existsSync(path.join(STATIC_DIR, photo.slice(1)));
  const body = `${bc.html}
<section class="hero${hasPhoto ? ' hero-photo hero-ville' : ''}">${hasPhoto ? `<img class="hero-bg" src="${photo}" srcset="${photo.replace('-1920', '-960')} 960w, ${photo} 1920w" sizes="100vw" width="1920" height="1280" alt="${esc(credit?.alt || 'Saint-Quentin-en-Yvelines')}" fetchpriority="high">${credit?.credit ? `<p class="hero-credit">Photo : ${esc(credit.credit)}</p>` : ''}` : ''}<div class="wrap hero-g">
  <div class="hero-head">
    <p class="eyebrow"><span class="dot">${icon('pin')}</span><b>Saint-Quentin-en-Yvelines</b>&nbsp;· Yvelines (78)</p>
    <h1 class="h1">Conciergerie Airbnb <span class="script script-long">à Saint-Quentin-en-Yvelines</span></h1>
    <p class="lead">Notre base est à Guyancourt, au cœur de l'agglomération. Nous gérons des logements en location courte durée dans les douze communes de Saint-Quentin-en-Yvelines, toutes à quinze minutes au plus de chez nous : annonces Airbnb et Booking, prix, voyageurs, ménage filmé.</p>
  </div>
  <div class="hero-form">${microForm({ id: 'hero' })}</div>
  <div class="hero-more">${proofs()}</div>
</div></section>

${sec('communes', 'Les douze communes', `<div class="tbl-wrap"><table class="tbl"><caption>Les 12 communes de Saint-Quentin-en-Yvelines, trajet estimé depuis notre base hors heures de pointe</caption><thead><tr><th scope="col">Commune</th><th scope="col">Trajet</th><th scope="col">Ce qui attire les voyageurs</th></tr></thead><tbody>${rows}</tbody></table></div>`, {
    gray: true,
    script: "de l'agglomération",
    intro: "Saint-Quentin-en-Yvelines réunit douze communes autour de Guyancourt, Montigny-le-Bretonneux et Trappes. Nous intervenons dans toutes. Le tableau donne le temps de trajet depuis notre base et ce qui fait venir les voyageurs dans chacune.",
  })}

${sec('demande', 'Qui loue', `<ul class="checks">
  <li>${icon('check')}<span><b>Des professionnels en mission</b>, en semaine : Technocentre Renault à Guyancourt, sièges et pôles d'entreprises de l'agglomération</span></li>
  <li>${icon('check')}<span><b>Des étudiants, chercheurs et intervenants</b> de l'université de Versailles Saint-Quentin-en-Yvelines</span></li>
  <li>${icon('check')}<span><b>Des visiteurs de Versailles</b> qui cherchent un logement plus grand ou moins cher, à dix ou quinze minutes du château</span></li>
  <li>${icon('check')}<span><b>Des sportifs et des spectateurs</b> : Vélodrome National à Montigny-le-Bretonneux, Golf National à Guyancourt</span></li>
  <li>${icon('check')}<span><b>Des familles</b> de passage : France Miniature à Élancourt, île de loisirs à Trappes, proches en visite</span></li>
</ul>`, {
    script: 'à Saint-Quentin-en-Yvelines ?',
    intro: "La demande de l'agglomération est d'abord professionnelle : des séjours de deux à quatre nuits, du lundi au jeudi, avec des arrivées tardives. Le week-end et pendant les vacances, les familles et les visiteurs de Versailles prennent le relais. Un logement s'y règle donc différemment d'un appartement parisien.",
  })}

${sec('regles', 'Les règles', `<div class="tbl-wrap"><table class="tbl"><caption>Règles applicables dans les communes de Saint-Quentin-en-Yvelines</caption><thead><tr><th scope="col">Règle</th><th scope="col">Dans l'agglomération</th></tr></thead><tbody>
<tr><td><b>Numéro d'enregistrement</b></td><td>Obligatoire pour tout meublé de tourisme depuis mai 2026. Le téléservice national n'est pas encore ouvert : la déclaration se fait auprès de la mairie de la commune, selon sa procédure actuelle.</td></tr>
<tr><td><b>Changement d'usage</b></td><td>Pas automatique dans les Yvelines : il ne s'applique que si le conseil municipal de la commune l'a instauré par délibération. Nous le vérifions avec vous auprès de la mairie avant de signer.</td></tr>
<tr><td><b>Résidence principale</b></td><td>120 nuits par an au maximum, sauf si la commune a abaissé ce plafond (jusqu'à 90).</td></tr>
<tr><td><b>Taxe de séjour</b></td><td>Intercommunale, au réel, dans les douze communes. Collectée et déclarée par la plateforme quand elle encaisse la réservation ; déclarée chaque trimestre par le loueur pour les réservations en direct.</td></tr>
</tbody></table></div>
<p class="verif">Vérifié le ${SQY_VERIF}, d'après le guide pratique de la taxe de séjour de Saint-Quentin-en-Yvelines pour la taxe de séjour. À reconfirmer auprès de la mairie de votre commune et de l'agglomération. <a class="lnk" href="/blog/numero-enregistrement-meuble-de-tourisme-2026">Notre guide du numéro d'enregistrement</a></p>`, {
    gray: true,
    script: 'à Saint-Quentin-en-Yvelines',
    intro: "Avant de louer en courte durée dans l'agglomération, quatre points se vérifient : l'enregistrement du meublé, le changement d'usage s'il ne s'agit pas de votre résidence principale, le plafond de nuitées s'il s'agit de votre résidence principale, et la taxe de séjour, qui est ici intercommunale.",
  })}

${bien ? sec('bien', 'Un logement que nous gérons', `<div class="biens"><div>${bienCard(bien)}</div><div class="prose">${marked.parse(bien.histoire || '')}</div></div>`, { script: 'à Guyancourt', intro: esc(bien.resume) }) : ''}

${sec('gestion', 'Gestion Airbnb', `<div class="g3">
  <article class="feat card"><span class="ic">${icon('pin')}</span><h3>Une équipe sur place</h3><p>Notre équipe de terrain vit et travaille dans l'agglomération. Une boîte à clés bloquée ou un voyageur perdu se règle en quelques minutes.</p></article>
  <article class="feat card"><span class="ic">${icon('chart')}</span><h3>Des prix calés sur la semaine</h3><p>Prix ajustés chaque jour selon la demande professionnelle en semaine, les week-ends à Versailles et les compétitions.</p></article>
  <article class="feat card"><span class="ic">${icon('video')}</span><h3>Ménage filmé</h3><p>Vidéo horodatée et géolocalisée avant et après chaque ménage : l'état du logement est prouvé à chaque rotation.</p></article>
</div>
<p class="more"><a class="lnk" href="/gestion-airbnb-booking">Notre gestion Airbnb et Booking en détail ${icon('arrow')}</a> <a class="lnk" href="/services">Tous nos services ${icon('arrow')}</a></p>`, { gray: !!bien, script: 'à Saint-Quentin-en-Yvelines', intro: "Nous prenons en charge toute la location : annonces sur vos comptes Airbnb et Booking, prix, messages aux voyageurs 24 h/24, arrivées autonomes, ménage contrôlé et incidents. Vos loyers vous sont versés directement par les plateformes." })}

${guides.length ? `<section class="sec" id="guides" aria-labelledby="guides-t"><div class="wrap"><h2 class="h2" id="guides-t">Nos guides <span class="script">sur l'agglomération</span></h2><div class="pgrid" style="margin-top:28px">${guides.map((p) => postCard(p, { hx: 'h3' })).join('')}</div></div></section>` : ''}

${faq.html}

${sec('autour', 'Nos pages', `<ul class="chips">${['Guyancourt', 'Montigny-le-Bretonneux', 'Versailles', 'Le Chesnay-Rocquencourt', 'Vélizy-Villacoublay'].map(pageDe).filter(Boolean).map((x) => `<li><a href="/${x.path}">Conciergerie Airbnb à ${esc(x.ville)}</a></li>`).join('')}<li><a href="/conciergerie-airbnb-yvelines">Toutes nos communes : Yvelines</a></li></ul>`, {
    script: 'autour de Saint-Quentin',
    intro: "Guyancourt et Montigny-le-Bretonneux ont chacune leur page, avec leurs secteurs et leurs règles. Autour de l'agglomération, nous gérons aussi des logements à Versailles, au Chesnay-Rocquencourt, à Vélizy-Villacoublay et dans le reste des Yvelines.",
  })}

${finalCta({ titre: 'Estimez votre logement', script: 'à Saint-Quentin-en-Yvelines' })}`;
  return {
    path: '/' + SQY_PATH,
    title: 'Conciergerie Airbnb Saint-Quentin-en-Yvelines | Rim',
    description: "Conciergerie Airbnb à Saint-Quentin-en-Yvelines, depuis notre base de Guyancourt : les 12 communes, ménage filmé, voyageurs 24 h/24. Estimez votre bien.",
    body,
    schema: [
      bc.schema,
      faq.schema,
      { '@type': 'Service', name: 'Conciergerie Airbnb à Saint-Quentin-en-Yvelines', serviceType: 'Conciergerie pour location courte durée', provider: { '@id': `${s.url}/#entreprise` }, areaServed: SQY_COMMUNES.map(([nom]) => ({ '@type': 'City', name: nom })) },
    ],
  };
}
