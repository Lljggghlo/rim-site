/* Rim Conciergerie — script unique, chargé en différé.
   Le site fonctionne sans lui : il ajoute seulement le confort (étapes, vidéos, mesure). */
(function () {
  'use strict';
  var d = document, w = window, body = d.body;
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sget: function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- Anciennes ancres du site d'une page ---------- */
  if (location.pathname === '/' && location.hash) {
    var map = { '#apropos': '/qui-sommes-nous', '#mentions': '/mentions-legales', '#services': '/services', '#contact': '/estimation' };
    if (map[location.hash]) { location.replace(map[location.hash]); return; }
  }

  /* ---------- Apparition au défilement ---------- */
  // Les éléments sont marqués ici, en JavaScript : sans JS (robots, lecteurs), tout reste visible.
  var calme = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calme) {
    var cibles = '.sec .kicker,.sec .h2,.sec .answer,.feat,.svc-i,.pil,.steps li,.vcard,.bmini,.abr-c,.reviews .review,.rsep,.idf-map,.idf-leg li,.story li,.team-you,.team-hub,.team-n,.po,.vs-c,.faq details,.pcard,.cm,.cm-points li,.phone,.vfacade,.stats li,.scores .score,.zones .zone,.split > div,.final-txt,.final .micro,.art-cover,.posts .post-card';
    d.querySelectorAll(cibles).forEach(function (el) {
      if (el.closest('.hero, .art-hero, .reveal')) return;
      el.classList.add('reveal');
      var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sibs, 5) * 70 + 'ms';
    });
  }
  var els = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in w && els.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var t = e.target; t.classList.add('in'); io.unobserve(t); setTimeout(function () { t.style.transitionDelay = ''; }, 1300); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Menu mobile : fermer au clic sur un lien ---------- */
  d.querySelectorAll('.mnav a').forEach(function (a) {
    a.addEventListener('click', function () { var b = d.querySelector('.burger'); if (b) b.removeAttribute('open'); });
  });

  /* ---------- UTM : conservées du premier clic jusqu'au formulaire ---------- */
  var params = new URLSearchParams(location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var utm = store.sget('rim_utm') || {};
  var got = false;
  utmKeys.forEach(function (k) { if (params.get(k)) { utm[k] = params.get(k); got = true; } });
  if (got) store.sset('rim_utm', utm);
  if (!store.sget('rim_entree')) store.sset('rim_entree', location.pathname + (d.referrer ? ' | ref: ' + d.referrer : ''));
  var lastPage = store.sget('rim_page');
  if (location.pathname !== '/estimation') store.sset('rim_page', location.pathname);

  /* ---------- Mesure (uniquement après accord) ---------- */
  var GA = body.getAttribute('data-ga4'), PX = body.getAttribute('data-pixel');
  var consentBox = d.querySelector('.consent');
  var queue = [];
  function track(name, params) {
    queue.push([name, params || {}]);
    flush();
  }
  w.rimTrack = track;
  function flush() {
    var c = store.get('rim_consent');
    if (!c || !c.ok) return;
    while (queue.length) {
      var ev = queue.shift();
      if (w.gtag) w.gtag('event', ev[0], ev[1]);
      if (w.fbq) {
        if (ev[0] === 'lead_estimation') w.fbq('track', 'Lead', ev[1]);
        else w.fbq('trackCustom', ev[0], ev[1]);
      }
    }
  }
  function loadTags() {
    if (GA && !w.gtag) {
      var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA; d.head.appendChild(s);
      w.dataLayer = w.dataLayer || []; w.gtag = function () { w.dataLayer.push(arguments); };
      w.gtag('js', new Date()); w.gtag('config', GA, { anonymize_ip: true });
    }
    if (PX && !w.fbq) {
      (function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(w, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      w.fbq('init', PX); w.fbq('track', 'PageView');
    }
    flush();
  }
  if (consentBox) {
    var c = store.get('rim_consent');
    var sixMonths = 1000 * 60 * 60 * 24 * 182;
    if (!c || (Date.now() - c.t) > sixMonths) consentBox.hidden = false;
    else if (c.ok) loadTags();
    consentBox.querySelectorAll('[data-consent]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ok = b.getAttribute('data-consent') === '1';
        store.set('rim_consent', { ok: ok, t: Date.now() });
        consentBox.hidden = true;
        if (ok) loadTags();
      });
    });
    d.querySelectorAll('[data-consent-open]').forEach(function (b) {
      b.addEventListener('click', function () { consentBox.hidden = false; });
    });
  }

  /* ---------- Clic « Estimer mon bien » (étape 1) ---------- */
  d.querySelectorAll('form[data-event]').forEach(function (f) {
    f.addEventListener('submit', function () { track(f.getAttribute('data-event'), { page: location.pathname }); });
  });

  /* ---------- Vidéos : chargées au clic seulement ---------- */
  d.querySelectorAll('.vplay').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = b.getAttribute('data-src'), yt = b.getAttribute('data-yt');
      if (yt) {
        var f = d.createElement('iframe'); f.src = yt; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = b.getAttribute('aria-label') || 'Vidéo';
        b.appendChild(f);
      } else if (src) {
        var v = d.createElement('video'); v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', '');
        b.appendChild(v); v.play && v.play().catch(function () {});
      }
      b.removeAttribute('data-src'); b.removeAttribute('data-yt');
      track('view_testimonial', { name: b.getAttribute('aria-label') });
    }, { once: true });
  });

  /* ---------- Vidéo de présentation : lue dans la page, au clic ---------- */
  d.querySelectorAll('.vfacade[data-yt], .vfacade[data-mp4]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var mp4 = a.getAttribute('data-mp4'), sd = a.getAttribute('data-mp4-sd'), el;
      if (mp4) {
        var cx = navigator.connection || {};
        var petit = sd && (w.innerWidth < 760 || cx.saveData || /(^|-)?[23]g$/.test(cx.effectiveType || ''));
        el = d.createElement('video');
        el.src = petit ? sd : mp4; el.controls = true; el.autoplay = true; el.playsInline = true; el.setAttribute('playsinline', ''); el.preload = 'auto';
        if (a.getAttribute('data-poster')) el.poster = a.getAttribute('data-poster');
      } else {
        el = d.createElement('iframe');
        el.src = a.getAttribute('data-yt'); el.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; el.allowFullscreen = true; el.title = a.getAttribute('aria-label') || 'Vidéo';
      }
      a.appendChild(el); a.classList.add('is-playing');
      a.removeAttribute('data-yt'); a.removeAttribute('data-mp4'); a.removeAttribute('href');
      if (el.play) { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); }
      track('view_video', { name: 'presentation' });
    }, { once: true });
  });

  /* ---------- Formulaire d'estimation en étapes ---------- */
  var est = d.querySelector('.est');
  if (est) {
    var form = est.querySelector('form');
    var steps = Array.prototype.slice.call(est.querySelectorAll('.step'));
    var bar = est.querySelector('.progress span');
    var back = est.querySelector('.back'), next = est.querySelector('.next');
    var i = 0;
    // Pré-remplissage depuis l'étape 1 (URL)
    var commune = params.get('commune'), type = params.get('type');
    var sel = form.querySelector('[name=commune]');
    if (commune && sel) { sel.value = commune; }
    if (type) { var r = form.querySelector('input[name=type][value="' + type.replace(/"/g, '') + '"]'); if (r) r.checked = true; }
    // Champs cachés
    utmKeys.forEach(function (k) { var h = form.querySelector('[name=' + k + ']'); if (h && utm[k]) h.value = utm[k]; });
    var hp = form.querySelector('[name=page_origine]'); if (hp) hp.value = (d.referrer && d.referrer.indexOf(location.host) > -1) ? new URL(d.referrer).pathname : (lastPage || 'accès direct');
    var he = form.querySelector('[name=page_entree]'); if (he) he.value = store.sget('rim_entree') || '';
    // Commune hors liste
    var autre = form.querySelector('.autre-commune');
    function syncAutre() { if (autre) autre.hidden = sel.value !== 'Autre'; }
    if (sel) { sel.addEventListener('change', syncAutre); syncAutre(); }

    est.classList.add('stepper');
    // Si les deux premières réponses sont connues, on démarre à l'étape 3
    if (sel && sel.value && sel.value !== 'Autre' && form.querySelector('input[name=type]:checked')) i = 2;
    function valid(step) {
      var ok = true;
      step.querySelectorAll('[required]').forEach(function (inp) {
        var good;
        if (inp.type === 'radio') good = !!step.querySelector('input[name="' + inp.name + '"]:checked');
        else if (inp.type === 'checkbox') good = inp.checked;
        else if (inp.type === 'tel') good = /^(\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(inp.value.trim());
        else if (inp.type === 'email') good = !inp.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
        else good = !!inp.value.trim();
        var box = inp.closest('.field, .step');
        if (box) box.classList.toggle('has-err', !good && (box.classList.contains('field') || inp.type === 'radio'));
        if (!good) ok = false;
      });
      return ok;
    }
    function show(n) {
      i = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      est.classList.toggle('last', i === steps.length - 1);
      if (back) back.hidden = i === 0;
      if (bar) bar.style.width = ((i + 1) / steps.length * 100) + '%';
      var f = steps[i].querySelector('input:not([type=hidden]), select');
      if (n !== undefined && f && f.type !== 'radio') try { f.focus({ preventScroll: true }); } catch (e) {}
    }
    if (next) next.addEventListener('click', function () { if (valid(steps[i])) { show(i + 1); est.scrollIntoView({ block: 'start' }); } });
    if (back) back.addEventListener('click', function () { show(i - 1); });
    steps.forEach(function (s, k) {
      s.querySelectorAll('input[type=radio]').forEach(function (r) {
        r.addEventListener('change', function () { s.classList.remove('has-err'); if (k < steps.length - 1) setTimeout(function () { show(k + 1); }, 180); });
      });
    });
    form.addEventListener('submit', function (e) {
      for (var k = 0; k < steps.length; k++) { if (!valid(steps[k])) { e.preventDefault(); show(k); return; } }
      var c = sel.value === 'Autre' ? (form.querySelector('[name=commune_autre]').value || 'Autre') : sel.value;
      var nx = form.querySelector('[name=_next]');
      if (nx) nx.value = nx.value.split('?')[0] + '?commune=' + encodeURIComponent(c) + '&prenom=' + encodeURIComponent(form.querySelector('[name=prenom]').value || '');
      var btn = form.querySelector('[type=submit]'); if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }
      // Envoi instantané : la demande part en arrière-plan (keepalive) et le visiteur passe tout de suite à la page Merci.
      // En cas d'échec réseau immédiat, on retombe sur l'envoi classique du formulaire.
      var action = form.getAttribute('action') || '';
      if (w.fetch && w.FormData && action.indexOf('formsubmit.co/') > -1 && !form.dataset.envoiClassique) {
        e.preventDefault();
        var fini = false, suite = nx ? nx.value.replace(/^https?:\/\/[^/]+/, '') : '/merci';
        var go = function () { if (!fini) { fini = true; location.href = suite; } };
        var classique = function () { if (!fini) { fini = true; form.dataset.envoiClassique = '1'; HTMLFormElement.prototype.submit.call(form); } };
        try {
          fetch(action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, keepalive: true, mode: 'cors' })
            .then(function (r) { if (r.ok) go(); else classique(); })
            .catch(function () { classique(); });
          setTimeout(go, 1500);
        } catch (err) { classique(); }
      }
    });
    show(i);
  }

  /* ---------- Page merci ---------- */
  if (body.getAttribute('data-page-event') === 'lead_estimation') {
    var cm = params.get('commune') || '', pr = params.get('prenom') || '';
    var wa = d.querySelector('[data-wa-merci]');
    if (wa) {
      var msg = 'Bonjour, je viens de faire une demande pour mon bien' + (cm ? ' à ' + cm : '') + '.' + (pr ? ' ' + pr : '');
      wa.href = wa.href.split('?')[0] + '?text=' + encodeURIComponent(msg);
    }
    var nm = d.querySelector('[data-prenom]'); if (nm && pr) nm.textContent = ', ' + pr;
    track('lead_estimation', { commune: cm });
  }
})();

// Barre de progression de lecture (articles du blog)
(() => {
  const bar = document.querySelector('.readbar span');
  const art = document.querySelector('.art-main');
  if (!bar || !art) return;
  let tick = false;
  const upd = () => {
    const r = art.getBoundingClientRect();
    const total = r.height - window.innerHeight * 0.6;
    const pct = Math.min(100, Math.max(0, ((-r.top + window.innerHeight * 0.2) / Math.max(1, total)) * 100));
    bar.style.width = pct + '%';
    tick = false;
  };
  window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
})();

// En-tête : ombre légère dès que la page défile
(function () {
  var h = document.querySelector('.site-head'); if (!h) return;
  var f = function () { h.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', f, { passive: true }); f();
})();
