// Pages : biens gérés, avis, qui sommes-nous, estimation, merci, zones, légal, 404
import { ctx, esc, icon, waIcon, answer, faqBlock, breadcrumbs, bienCard, finalCta, googleReviews, videoTestimonials, TYPES, proofs, proofGoogle, proofAirbnb, sec, waLink, dateFr, scoreCards, googleBand, airbnbBand, socialBand, presentationVideo, presentationVideoSchema } from '../lib.mjs';
import { ZONES_CHIPS, VERIF } from './core.mjs';

// ---------- Avis ----------
export function avis(data) {
  const bc = breadcrumbs([{ name: 'Avis propriétaires', path: '/avis' }]);
  const s = ctx.s;
  const vids = data.temoignages;
  const body = `${bc.html}
<section class="hero"><div class="wrap">
  <p class="kicker">Avis et témoignages</p>
  <h1 class="h1">Avis sur <span class="script">Rim Conciergerie</span></h1>
  <p class="lead">Nos avis sont publiés là où nous ne pouvons pas les modifier : sur Google et sur Airbnb. Les témoignages vidéo sont publiés avec l'accord écrit de chaque propriétaire.</p>
  ${scoreCards()}
</div></section>

${sec('videos', 'Nos propriétaires', videoTestimonials(vids), {
    gray: true,
    script: 'en vidéo',
    intro: "Des propriétaires qui nous confient leur logement racontent, en moins d'une minute, pourquoi ils ont choisi de déléguer et ce que cela a changé pour eux. Chaque vidéo est publiée avec leur accord écrit.",
  })}

<section class="sec" id="google" aria-labelledby="google-t"><div class="wrap">
  <h2 class="h2 sr-only" id="google-t">Avis Google</h2>
  ${googleBand()}
</div></section>

<section class="sec sec-gray" id="airbnb" aria-labelledby="airbnb-t"><div class="wrap">
  <h2 class="h2 sr-only" id="airbnb-t">Avis des voyageurs sur Airbnb</h2>
  ${airbnbBand(data.avisAirbnb)}
  <p class="verif center">Extraits d'avis publiés sur le profil Airbnb de Rim Conciergerie, relevés le ${dateFr(data.avisAirbnbDate)}, sans modification du sens.</p>
</div></section>

${finalCta()}`;
  return {
    path: '/avis',
    title: 'Avis Rim Conciergerie : propriétaires et voyageurs',
    description: `${s.avis_google_note}/5 sur Google (${s.avis_google_nombre} avis) et ${s.airbnb_note}/5 sur Airbnb (${s.airbnb_evaluations} évaluations). Avis vérifiables et témoignages de propriétaires.`,
    body,
    schema: [bc.schema],
    lastmod: ctx.today,
  };
}

// ---------- Qui sommes-nous ----------
export function quiSommesNous() {
  const bc = breadcrumbs([{ name: 'Qui sommes-nous', path: '/qui-sommes-nous' }]);
  const s = ctx.s;
  const body = `${bc.html}
<section class="hero hero-tight"><div class="wrap founder">
  <div class="f-head">
    <p class="kicker">Qui sommes-nous</p>
    <h1 class="h1">Une conciergerie de terrain, <span class="script">basée à Guyancourt</span></h1>
  </div>
  <img class="f-img" src="/images/equipe/nassim-studio-480.webp" srcset="/images/equipe/nassim-studio-480.webp 480w, /images/equipe/nassim-studio-900.webp 900w" sizes="(min-width:860px) 420px, 90vw" width="480" height="600" alt="Nassim RIM, fondateur de Rim Conciergerie, à Guyancourt" fetchpriority="high">
  <div class="f-body">
    <p class="lead">Rim Conciergerie est née en 2024 à Guyancourt, dans les Yvelines. Notre idée : qu'un propriétaire puisse louer en courte durée sans que cela devienne un second métier.</p>
    ${proofs()}
  </div>
</div></section>

<section class="sec sec-first" id="histoire" aria-labelledby="histoire-t"><div class="wrap">
  <h2 class="h2" id="histoire-t">Notre <span class="script">histoire</span></h2>
  ${answer("Rim Conciergerie est une conciergerie Airbnb indépendante, créée par Nassim RIM à Guyancourt. Elle gère des locations courte durée en Île-de-France, avec une équipe de terrain et une vidéo de contrôle à chaque ménage.")}
  <ol class="story">
    <li class="card"><span class="story-n">Le constat</span><p>En gérant ses premiers logements, Nassim voit ce que vivent les propriétaires : <mark>des messages à toute heure</mark>, <mark>des ménages qu'on ne peut pas vérifier</mark>, <mark>des prix fixés une fois pour toutes</mark>.</p></li>
    <li class="card"><span class="story-n">La méthode</span><p>Il construit une réponse à chacun : <strong>messages automatisés 24 h/24</strong>, <strong>vidéo horodatée à chaque ménage</strong>, <strong>prix ajustés chaque jour</strong>.</p></li>
    <li class="card"><span class="story-n">Aujourd'hui</span><p><strong>${esc(s.logements_geres)} logements gérés</strong> en location courte durée, et un nombre de logements choisi pour que <mark>chaque propriétaire ait un interlocuteur qui connaît son bien</mark>.</p></li>
  </ol>
  <p class="transp">${icon('shield')}<span><b>En toute transparence :</b> Rim Conciergerie est le nom commercial de Nassim RIM, entrepreneur individuel, SIRET ${esc(s.siret)}. Vous savez à qui vous confiez votre logement.</span></p>
</div></section>

${presentationVideo() ? sec('video', 'La conciergerie', presentationVideo(), { gray: true, script: 'en vidéo', intro: "En quelques minutes, Nassim présente la conciergerie, l'équipe et la façon dont nous gérons un logement, du premier voyageur à la facture mensuelle." }) : ''}

${sec('reseaux', 'Nos conseils', socialBand(), {
    gray: true,
    kicker: 'Suivez-nous',
    script: 'en vidéo',
    intro: "Chaque semaine, nous publions une vidéo sur la location courte durée : réglementation, prix, ménage, erreurs à éviter, coulisses de nos logements. Un bon moyen de voir comment nous travaillons avant de nous confier le vôtre.",
  })}

${sec('engagements', 'Nos engagements', `<div class="pils">
  <article class="pil"><span class="pil-ic">${icon('clip')}</span><h3>Gestion encadrée</h3><p>Un suivi rigoureux de chaque réservation, un reporting clair et un accès propriétaire en temps réel. Vous gardez le contrôle des décisions importantes, nous gérons l'exécution.</p><ul><li>${icon('check', 'i i-s')}Calendrier et réservations visibles en temps réel</li><li>${icon('check', 'i i-s')}Une facture par mois, séjour par séjour</li><li>${icon('check', 'i i-s')}Vos loyers versés directement sur votre compte</li></ul></article>
  <article class="pil"><span class="pil-ic">${icon('sync')}</span><h3>Libérer votre temps</h3><p>Plus de messages à gérer, plus de ménage à organiser, plus d'imprévus à régler. Nous nous occupons de tout pour que votre location ne devienne pas un second métier.</p><ul><li>${icon('check', 'i i-s')}Voyageurs pris en charge 24 h/24</li><li>${icon('check', 'i i-s')}Ménage filmé avant et après chaque séjour</li><li>${icon('check', 'i i-s')}Incident signalé sous 72 h, photos à l'appui</li></ul></article>
  <article class="pil"><span class="pil-ic">${icon('trend')}</span><h3>Optimiser la rentabilité</h3><p>Prix ajustés chaque jour selon la demande, annonces soignées, diffusion sur Airbnb et Booking : chaque levier est activé pour valoriser au mieux votre logement.</p><ul><li>${icon('check', 'i i-s')}Prix revus chaque jour, jamais sous votre plancher</li><li>${icon('check', 'i i-s')}Annonces Airbnb et Booking synchronisées</li><li>${icon('check', 'i i-s')}Rémunérés seulement quand votre logement est loué</li></ul></article>
</div>`, { script: 'envers vous', intro: "Trois engagements guident notre travail pour chaque logement. Ils se traduisent en engagements concrets, écrits dans notre contrat de prestations de conciergerie, que nous vous envoyons avant toute signature." })}

${sec('equipe', 'Une équipe', `<div class="team">
  <div class="team-you">${icon('home')}<span><b>Vous, propriétaire</b> : un seul contact</span></div>
  <div class="team-hub card"><span class="team-logo"><img src="/images/logo-rim-conciergerie-192.webp" width="338" height="192" alt="Rim Conciergerie" loading="lazy"></span><div><b>Rim Conciergerie</b><span>Suit chaque logement et coordonne chaque intervention</span></div></div>
  <div class="team-nodes">
    <div class="team-n card"><span class="ic">${icon('broom')}</span><b>Intervenantes ménage</b><span>Formées à notre checklist et au protocole vidéo</span></div>
    <div class="team-n card"><span class="ic">${icon('sparkle')}</span><b>Blanchisserie</b><span>Linge lavé et repassé entre chaque séjour</span></div>
    <div class="team-n card"><span class="ic">${icon('wrench')}</span><b>Artisans référencés</b><span>Plombier, électricien, serrurier quand il le faut</span></div>
    <div class="team-n card"><span class="ic">${icon('pin')}</span><b>City manager</b><span>Sur place pour les arrivées et les imprévus</span></div>
  </div>
</div>`, { gray: true, script: 'derrière chaque séjour', intro: "Derrière chaque séjour, des personnes se déplacent pour nettoyer, vérifier et réparer. Vous n'avez qu'un seul interlocuteur : nous coordonnons tout le monde, et nous répondons de chaque intervention." })}

${finalCta()}`;
  return {
    path: '/qui-sommes-nous',
    title: 'Qui sommes-nous | Rim Conciergerie, Guyancourt',
    description: 'Rim Conciergerie, conciergerie Airbnb fondée par Nassim RIM à Guyancourt en 2024 : notre histoire, notre équipe de terrain et nos engagements vérifiables.',
    body,
    schema: [bc.schema, { '@type': 'AboutPage', name: 'Qui sommes-nous', about: { '@id': `${s.url}/#entreprise` } }, presentationVideoSchema()].filter(Boolean),
    preloadImage: '/images/equipe/nassim-studio-480.webp',
    lastmod: ctx.today,
  };
}

// ---------- Estimation (étape 2 du tunnel) ----------
export function estimation() {
  const s = ctx.s;
  const radio = (name, vals, req = true) =>
    `<div class="opts">${vals.map((v, i) => `<label class="opt"><input type="radio" name="${name}" value="${esc(v)}"${req && i === 0 ? ' required' : ''}> ${esc(v)}</label>`).join('')}</div>`;
  const body = `<section class="sec sec-tight"><div class="wrap">
  <div class="est">
    <p class="kicker center">Estimation gratuite, sans engagement</p>
    <h1 class="h2 center" style="margin:0 auto 12px">Estimez votre bien en <span class="script">location courte durée</span></h1>
    <p class="answer center" style="margin-bottom:26px">Cinq questions courtes. Nous vous rappelons sous 24 h avec une estimation, après avoir vérifié les règles de votre commune.</p>
    <div class="card est-card">
      <div class="progress" aria-hidden="true"><span></span></div>
      <form action="https://formsubmit.co/${esc(s.email_formulaire)}" method="POST" novalidate>
        <input type="hidden" name="_subject" value="Nouvelle demande d'estimation, rimconciergerie.fr">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_next" value="${s.url}/merci">
        <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_content"><input type="hidden" name="utm_term">
        <input type="hidden" name="page_origine"><input type="hidden" name="page_entree">

        <fieldset class="step on"><legend>Où se trouve le logement ?</legend><p class="hint">Nous intervenons dans toute l'Île-de-France.</p>
          <div class="field"><label for="e-commune">Commune</label><input type="text" id="e-commune" name="commune" list="liste-communes" autocomplete="address-level2" placeholder="Ex. Versailles" required><p class="err">Indiquez la commune du logement.</p></div>
        </fieldset>

        <fieldset class="step"><legend>Quel type de bien ?</legend><p class="hint">Le type de logement change le profil des voyageurs.</p>${radio('type', TYPES)}<p class="err">Choisissez une réponse.</p></fieldset>

        <fieldset class="step"><legend>Quelle est sa situation aujourd'hui ?</legend><p class="hint">Pour savoir par où commencer.</p>${radio('situation', ['Déjà loué en courte durée', 'Vide, prêt à louer', 'En projet (achat, travaux)'])}<p class="err">Choisissez une réponse.</p></fieldset>

        <fieldset class="step"><legend>Quand voulez-vous commencer ?</legend><p class="hint">Aucun engagement, c'est pour organiser le rappel.</p>${radio('echeance', ['Dès que possible', 'Dans 1 à 3 mois', 'Plus tard'])}<p class="err">Choisissez une réponse.</p></fieldset>

        <fieldset class="step"><legend>Où vous rappeler ?</legend><p class="hint">Nous vous appelons sous 24 h, du lundi au vendredi.</p>
          <div class="field"><label for="e-prenom">Prénom</label><input type="text" id="e-prenom" name="prenom" autocomplete="given-name" required><p class="err">Indiquez votre prénom.</p></div>
          <div class="field"><label for="e-tel">Téléphone</label><input type="tel" id="e-tel" name="telephone" autocomplete="tel" inputmode="tel" placeholder="06 12 34 56 78" required><p class="err">Numéro de téléphone français invalide.</p></div>
          <div class="field"><label for="e-mail">E-mail <span class="opt-l">(facultatif)</span></label><input type="email" id="e-mail" name="email" autocomplete="email"><p class="err">Adresse e-mail invalide.</p></div>
          <div class="field"><label class="consent-box"><input type="checkbox" name="consentement" value="oui" required> <span>J'accepte d'être recontacté par Rim Conciergerie au sujet de la gestion de mon bien. <a href="/confidentialite">Confidentialité</a></span></label><p class="err">Cochez la case pour que nous puissions vous rappeler.</p></div>
          <p class="legal-mini">Vos réponses servent uniquement à vous rappeler et à préparer l'estimation. Elles sont conservées 3 ans après notre dernier échange, puis supprimées. Vous pouvez demander leur suppression à tout moment : ${esc(s.email)}.</p>
        </fieldset>

        <div class="submit-row"><button class="btn btn-primary btn-block" type="submit">Envoyer ma demande ${icon('arrow')}</button></div>
        <div class="est-nav"><button type="button" class="btn btn-ghost back" hidden>Retour</button><button type="button" class="btn btn-primary next">Continuer ${icon('arrow')}</button></div>
      </form>
    </div>
    <p class="center small muted" style="margin-top:18px">Vous préférez écrire ? <a class="lnk-wa" href="${waLink()}" target="_blank" rel="noopener">${waIcon('i i-s')}WhatsApp</a> ou <a href="tel:${s.telephone_e164}">${esc(s.telephone_affiche)}</a></p>
    <div class="center" style="display:flex;justify-content:center">${proofs()}</div>
  </div>
</div></section>`;
  return {
    path: '/estimation',
    title: 'Estimation gratuite de votre bien Airbnb | Rim Conciergerie',
    description: 'Estimez votre bien en location courte durée : cinq questions, règles de votre commune vérifiées, rappel sous 24 h. Gratuit, sans engagement.',
    body,
    schema: [],
    bodyClass: 'no-mbar',
    lastmod: ctx.today,
  };
}

// ---------- Merci (étape 3, noindex) ----------
export function merci() {
  const s = ctx.s;
  const body = `<section class="sec"><div class="wrap narrow center">
  <div class="merci-ic">${icon('check')}</div>
  <h1 class="h2" style="margin:0 auto">Votre demande est <span class="script">bien reçue</span><span data-prenom></span></h1>
  <p class="answer" style="margin-inline:auto">Nous vous rappelons sous 24 h, du lundi au vendredi. Si vous voulez aller plus vite, écrivez-nous sur WhatsApp : votre message arrive directement chez Nassim.</p>
  <a class="btn btn-primary" data-wa-merci href="${waLink('Bonjour, je viens de faire une demande pour mon bien.')}" target="_blank" rel="noopener">${waIcon()} Écrire sur WhatsApp</a>
  <h2 class="h3" style="margin-top:48px">Pour gagner du temps lors de l'appel</h2>
  <ul class="todo">
    <li>${icon('camera')}<span>Quelques photos actuelles du logement</span></li>
    <li>${icon('file')}<span>Le règlement de copropriété, si le logement est en copropriété</span></li>
    <li>${icon('doc')}<span>Le numéro d'enregistrement du meublé, s'il existe déjà</span></li>
  </ul>
  <p class="more"><a class="lnk" href="/blog">En attendant, lire nos guides propriétaires ${icon('arrow')}</a></p>
</div></section>`;
  return { path: '/merci', title: 'Demande reçue | Rim Conciergerie', description: 'Votre demande est bien reçue. Nous vous rappelons sous 24 h.', body, noindex: true, event: 'lead_estimation', bodyClass: 'no-mbar' };
}

// ---------- Légal ----------
export function mentionsLegales() {
  const s = ctx.s;
  const body = `<section class="sec legal"><div class="wrap narrow">
  <h1 class="h2">Mentions légales</h1>
  <p class="muted">Dernière mise à jour : ${dateFr(ctx.today)}</p>
  <p>Conformément aux articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, voici les informations relatives au site rimconciergerie.fr.</p>
  <h2>1. Éditeur du site</h2>
  <p>Nassim RIM, entrepreneur individuel (EI, micro-entreprise), exerçant sous le nom commercial Rim Conciergerie.<br>Adresse : ${esc(s.adresse_rue)}, ${esc(s.adresse_cp)} ${esc(s.adresse_ville)}, France<br>SIRET : ${esc(s.siret)}<br>E-mail : <a href="mailto:${esc(s.email)}">${esc(s.email)}</a><br>Téléphone : ${esc(s.telephone_affiche)}<br>${esc(s.mention_tva)}</p>
  <h2>2. Directeur de la publication</h2><p>Nassim RIM.</p>
  <h2>3. Hébergeur</h2><p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Téléphone : +1 951 383 6898. Site : vercel.com.<br>Nom de domaine enregistré auprès d'OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.</p>
  <h2>4. Activité</h2><p>Rim Conciergerie réalise des prestations de services de conciergerie pour la location meublée de courte durée : création et suivi des annonces sur les comptes des propriétaires, tarification, relation avec les voyageurs, coordination du ménage et de la petite maintenance. Rim Conciergerie n'encaisse, ne détient ni ne reverse aucun loyer, dépôt de garantie ou taxe de séjour pour le compte des propriétaires : ces sommes leur sont versées directement par les plateformes.</p>
  <h2>5. Médiation de la consommation</h2><p>Conformément aux articles L. 611-1 et suivants du Code de la consommation, en cas de litige non résolu par une réclamation écrite préalable adressée à Rim Conciergerie, le client consommateur peut recourir gratuitement au médiateur de la consommation suivant : ${esc(s.mediateur_nom)}, ${esc(s.mediateur_adresse)}, <a href="${esc(s.mediateur_site)}" target="_blank" rel="noopener">${esc(s.mediateur_site.replace('https://', ''))}</a>.</p>
  <h2>6. Propriété intellectuelle</h2><p>Les textes, photographies, visuels, logos et vidéos du site appartiennent à Nassim RIM ou sont utilisés avec l'autorisation de leurs auteurs et des propriétaires des logements. Toute reproduction sans autorisation écrite préalable est interdite (articles L. 335-2 et suivants du Code de la propriété intellectuelle).</p>
  <h2>7. Données personnelles et cookies</h2><p>Voir la <a href="/confidentialite">politique de confidentialité</a> et la page <a href="/cookies">cookies</a>.</p>
  <h2>8. Informations réglementaires</h2><p>Les informations sur la réglementation des meublés de tourisme publiées sur ce site sont données à titre indicatif, à la date indiquée sur chaque page. Elles ne constituent pas un conseil juridique et doivent être reconfirmées auprès de la mairie concernée.</p>
  <h2>9. Droit applicable</h2><p>Les présentes mentions sont régies par le droit français.</p>
</div></section>`;
  return { path: '/mentions-legales', title: 'Mentions légales | Rim Conciergerie', description: 'Mentions légales du site rimconciergerie.fr : éditeur, hébergeur, médiateur de la consommation et propriété intellectuelle.', body, schema: [], lastmod: ctx.today };
}

export function confidentialite() {
  const s = ctx.s;
  const mesure = s.ga4_id || s.meta_pixel_id;
  const body = `<section class="sec legal"><div class="wrap narrow">
  <h1 class="h2">Politique de confidentialité</h1>
  <p class="muted">Dernière mise à jour : ${dateFr(ctx.today)}</p>
  <h2>Responsable du traitement</h2><p>Nassim RIM, entrepreneur individuel (Rim Conciergerie), ${esc(s.adresse_rue)}, ${esc(s.adresse_cp)} ${esc(s.adresse_ville)}. Contact : <a href="mailto:${esc(s.email)}">${esc(s.email)}</a>.</p>
  <h2>Données collectées et finalités</h2>
  <ul>
    <li><b>Formulaire d'estimation</b> : commune, type de bien, situation, échéance, prénom, téléphone, e-mail facultatif, page d'origine et paramètres de campagne (UTM). Finalité : vous rappeler et préparer une proposition. Base légale : mesures précontractuelles prises à votre demande, et votre consentement à être recontacté.</li>
    <li><b>Messages WhatsApp, e-mails et appels</b> : contenu de vos échanges. Finalité : répondre à vos demandes.</li>
    <li><b>Clients</b> : données nécessaires à l'exécution du contrat et à la facturation (voir le contrat de prestations).</li>
    ${mesure ? '<li><b>Mesure d’audience</b> : uniquement avec votre accord, voir la page <a href="/cookies">cookies</a>.</li>' : ''}
  </ul>
  <h2>Durées de conservation</h2><ul><li>Demandes de propriétaires non suivies d'un contrat : 3 ans à compter du dernier échange.</li><li>Clients : durée du contrat, puis 5 ans ; pièces comptables : 10 ans.</li></ul>
  <h2>Destinataires et sous-traitants</h2><p>Vos données sont destinées à Rim Conciergerie uniquement. Elles transitent par nos prestataires techniques : Vercel (hébergement du site, États-Unis), FormSubmit (transmission du formulaire par e-mail), Google (messagerie Gmail), WhatsApp (Meta)${mesure ? ', et les outils de mesure listés sur la page cookies' : ''}. Certains de ces prestataires sont situés hors de l'Union européenne ; les transferts s'appuient sur les garanties prévues par le RGPD (clauses contractuelles types ou décision d'adéquation). Vos données ne sont jamais vendues.</p>
  <h2>Prospection</h2><p>Nous ne vous appelons que si vous l'avez demandé. Vous pouvez aussi vous inscrire sur la liste d'opposition au démarchage téléphonique Bloctel.</p>
  <h2>Vos droits</h2><p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Écrivez à <a href="mailto:${esc(s.email)}">${esc(s.email)}</a> ; nous répondons sous un mois. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>
</div></section>`;
  return { path: '/confidentialite', title: 'Politique de confidentialité | Rim Conciergerie', description: 'Comment Rim Conciergerie utilise et protège les données des propriétaires qui la contactent : finalités, durées de conservation, droits.', body, schema: [], lastmod: ctx.today };
}

export function cookies() {
  const s = ctx.s;
  const tools = [];
  if (s.ga4_id) tools.push('<li><b>Google Analytics 4</b> (Google Ireland Ltd) : mesure des visites et des pages consultées. Cookies <code>_ga</code> et <code>_ga_*</code>, conservés 13 mois maximum.</li>');
  if (s.meta_pixel_id) tools.push('<li><b>Pixel Meta</b> (Meta Platforms Ireland Ltd) : mesure de l’efficacité de nos publicités. Cookie <code>_fbp</code>, conservé 3 mois.</li>');
  const body = `<section class="sec legal"><div class="wrap narrow">
  <h1 class="h2">Cookies</h1>
  <p class="muted">Dernière mise à jour : ${dateFr(ctx.today)}</p>
  ${tools.length
    ? `<p>Le site fonctionne sans cookie. Avec votre accord seulement, nous utilisons les outils de mesure suivants :</p><ul>${tools.join('')}</ul><p>Votre choix est conservé 6 mois dans votre navigateur. Vous pouvez le modifier à tout moment : <button type="button" class="lnk-btn" data-consent-open>gérer mes choix</button>.</p>`
    : `<p>Ce site ne dépose aucun cookie de mesure d'audience ni de publicité. Il enregistre seulement, dans votre navigateur, la page par laquelle vous êtes arrivé et les paramètres de campagne (UTM), le temps de votre visite, pour savoir quelle page vous a amené au formulaire. Ces informations ne sont transmises que si vous envoyez le formulaire.</p>`}
  ${s.video_presentation_mp4 ? '<p>Notre vidéo de présentation est hébergée sur ce site : elle ne fait appel à aucun service tiers et ne dépose aucun cookie. Elle ne se charge que si vous cliquez sur le bouton de lecture.</p>' : '<p>Les vidéos hébergées sur YouTube ne sont chargées que si vous cliquez sur le bouton de lecture. Elles sont alors lues sur cette page en mode de confidentialité renforcée (youtube-nocookie.com) ; YouTube peut à ce moment-là déposer ses propres traceurs, selon ses règles.</p>'}
</div></section>`;
  return { path: '/cookies', title: 'Cookies | Rim Conciergerie', description: 'Les cookies et traceurs utilisés sur rimconciergerie.fr, et comment gérer vos choix.', body, schema: [], lastmod: ctx.today };
}

export function page404() {
  const body = `<section class="e404"><div class="wrap narrow">
  <p class="kicker">Erreur 404</p>
  <h1 class="h2" style="margin:0 auto">Cette page <span class="script">n'existe pas</span></h1>
  <p class="answer" style="margin-inline:auto">Elle a peut-être été déplacée lors de la refonte du site. Les pages ci-dessous devraient vous aider.</p>
  <p style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="/estimation">Estimer mon bien</a><a class="btn btn-ghost" href="/">Retour à l'accueil</a></p>
</div></section>`;
  return { path: '/404', title: 'Page introuvable | Rim Conciergerie', description: "Cette page n'existe pas.", body, noindex: true, out: '404.html' };
}
