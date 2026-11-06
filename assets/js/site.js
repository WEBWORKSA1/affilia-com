/* Affilia.com site runtime. No dependencies. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  var R = html.getAttribute('data-root') || '';
  var C = window.AFFILIA_CONFIG || {};
  var YEAR = new Date().getFullYear();

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  var fmt0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  var fmt2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function money(n, cents) { n = isFinite(n) ? n : 0; return (cents ? fmt2 : fmt0).format(n); }
  function num(n, dp) { return new Intl.NumberFormat('en-US', { maximumFractionDigits: dp || 0 }).format(isFinite(n) ? n : 0); }
  function fmtDate(s) { var t = new Date(s); return isNaN(t) ? '' : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60); }
  function getJSON(path) { return fetch(R + path, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  function toast(msg) {
    var t = d.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    d.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }

  /* Theme */
  var savedTheme = store.get('affilia-theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  function toggleTheme() {
    var cur = html.getAttribute('data-theme') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next); store.set('affilia-theme', next);
  }

  /* Inbox is stored encoded in config.js and is never written into the page. */
  function inbox() { var p = C.inbox || []; try { return atob(p.join('').split('').reverse().join('')); } catch (e) { return ''; } }
  function endpoint() { return 'https://formsubmit.co/ajax/' + (C.formAlias || inbox()); }
  function mailto(subject, data) {
    var body = '';
    if (data) { for (var k in data) { if (k.charAt(0) !== '_' && data[k]) body += k.replace(/_/g, ' ') + ': ' + data[k] + '\n'; } }
    location.href = 'mailto:' + inbox() + '?subject=' + encodeURIComponent(subject || 'Affilia.com enquiry') + (body ? '&body=' + encodeURIComponent(body) : '');
  }

  /* Icons and logo */
  var SV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var I = {
    search: SV + '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    moon: SV + '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
    menu: SV + '<path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: SV + '<path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  var LOGO = '<svg viewBox="0 0 34 24" aria-hidden="true"><rect class="l1" x="1.5" y="4.5" width="19" height="15" rx="7.5" fill="none" stroke-width="3"/><rect class="l2" x="13.5" y="4.5" width="19" height="15" rx="7.5" fill="none" stroke-width="3"/></svg>';
  var HOME = R || './';

  var NAV = [['programs/', 'Programs', 'programs'], ['networks/', 'Networks', 'networks'], ['tools/', 'Tools', 'tools'], ['academy/', 'Academy', 'academy'], ['videos/', 'Videos', 'videos'], ['news/', 'News', 'news']];
  var FOOT = [
    ['Explore', [['programs/', 'Program directory'], ['networks/', 'Networks and software'], ['academy/', 'Academy'], ['glossary/', 'Glossary'], ['videos/', 'Videos'], ['news/', 'Industry news'], ['search/', 'Search']]],
    ['Free tools', [['tools/commission-calculator/', 'Commission calculator'], ['tools/epc-calculator/', 'EPC and RPM calculator'], ['tools/link-builder/', 'Affiliate link builder'], ['tools/disclosure-generator/', 'Disclosure generator'], ['tools/program-matchmaker/', 'Program matchmaker'], ['tools/commission-planner/', 'Brand commission planner']]],
    ['Work with us', [['grow/', 'Grow your program'], ['list-your-program/', 'List your program'], ['advertise/', 'Advertise and sponsor'], ['contests/', 'Contests and prizes'], ['careers/', 'Careers'], ['support/', 'Support Affilia']]],
    ['Company', [['about/', 'About'], ['editorial-policy/', 'Editorial policy'], ['contact/', 'Contact'], ['privacy/', 'Privacy policy'], ['terms/', 'Terms of use'], ['cookies/', 'Cookie policy'], ['disclaimer/', 'Disclaimer'], ['affiliate-disclosure/', 'Affiliate disclosure'], ['trademark/', 'Trademark and copyright']]]
  ];

  function buildHeader() {
    var h = $('#site-header'); if (!h) return;
    var cur = d.body.getAttribute('data-nav') || '';
    var items = NAV.map(function (n) { return '<li><a href="' + R + n[0] + '"' + (cur === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>'; }).join('');
    h.innerHTML = '<a class="skip" href="#main">Skip to content</a><div class="wrap head-row"><a class="brand" href="' + HOME + '" aria-label="Affilia home">' + LOGO + '<span>affilia</span></a>' +
      '<nav class="primary" aria-label="Main"><ul>' + items + '</ul></nav>' +
      '<div class="head-actions"><a class="icon-btn" href="' + R + 'search/" aria-label="Search the site">' + I.search + '</a>' +
      '<button class="icon-btn" type="button" data-theme-toggle aria-label="Switch between light and dark theme">' + I.moon + '</button>' +
      '<a class="btn btn-brand btn-small" href="' + R + 'grow/">For brands</a>' +
      '<button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">' + I.menu + '</button></div></div>' +
      '<div id="mnav" class="mobile-nav" hidden><div class="wrap"><ul>' + items + '<li><a href="' + R + 'grow/">For brands</a></li><li><a href="' + R + 'support/">Support Affilia</a></li></ul></div></div>';
    $('[data-theme-toggle]', h).addEventListener('click', toggleTheme);
    var mb = $('.menu-btn', h), mn = $('#mnav', h);
    mb.addEventListener('click', function () {
      var open = mb.getAttribute('aria-expanded') === 'true';
      mb.setAttribute('aria-expanded', String(!open)); mn.hidden = open;
      mb.innerHTML = open ? I.menu : I.close; mb.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    });
  }

  function buildFooter() {
    var f = $('#site-footer'); if (!f) return;
    var cols = FOOT.map(function (c) {
      return '<div><h2>' + c[0] + '</h2><ul>' + c[1].map(function (l) { return '<li><a href="' + R + l[0] + '">' + l[1] + '</a></li>'; }).join('') + '</ul></div>';
    }).join('');
    f.innerHTML =
      '<div class="foot-news"><div class="wrap foot-news-row"><div><h2>The Affilia Ledger</h2><p>One email a month: new programs, changed terms and the numbers behind them. Unsubscribe anytime.</p></div>' +
      '<form class="inline-form" data-form="newsletter" data-subject="Affilia: newsletter signup" novalidate><label class="sr" for="nl-email">Email address</label>' +
      '<input id="nl-email" type="email" name="email" placeholder="you@example.com" required autocomplete="email">' +
      '<input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="btn btn-pub" type="submit">Subscribe</button><p class="form-status" role="status" hidden></p></form></div></div>' +
      '<div class="wrap foot-grid"><div class="foot-about"><a class="brand" href="' + HOME + '" aria-label="Affilia home">' + LOGO + '<span>affilia</span></a>' +
      '<p>An independent directory, toolkit and playbook for affiliate partnerships, written for publishers and the brands that pay them.</p></div>' + cols + '</div>' +
      '<div class="foot-legal"><div class="wrap"><p>&copy; ' + YEAR + ' Affilia.com. All rights reserved. Affilia.com is an independent publication and is not affiliated with, endorsed by or sponsored by any organization that uses the same or a similar name. Program names and trademarks belong to their owners and are used only to identify them. <a href="' + R + 'trademark/">Read the trademark and copyright notice</a>.</p>' +
      '<p>Earnings figures on this site are illustrations, not promises. Commission terms change; confirm them on each program&rsquo;s official page before you promote it.</p></div></div>';
  }

  /* Lead and context capture */
  function captureContext() {
    try {
      var q = new URLSearchParams(location.search), keep = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref'].forEach(function (k) { if (q.get(k)) keep[k] = q.get(k); });
      if (Object.keys(keep).length) sessionStorage.setItem('affilia-utm', JSON.stringify(keep));
      if (!sessionStorage.getItem('affilia-landing')) {
        sessionStorage.setItem('affilia-landing', location.href);
        sessionStorage.setItem('affilia-referrer', d.referrer || 'direct');
      }
    } catch (e) {}
  }
  function context() {
    var o = { page: location.href };
    try {
      o.landing_page = sessionStorage.getItem('affilia-landing') || '';
      o.referrer = sessionStorage.getItem('affilia-referrer') || '';
      var u = JSON.parse(sessionStorage.getItem('affilia-utm') || '{}');
      for (var k in u) o[k] = u[k];
    } catch (e) {}
    return o;
  }
  function formData(form) {
    var o = {};
    $$('input, select, textarea', form).forEach(function (el) {
      if (!el.name || el.disabled) return;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
      var v = String(el.value).trim(); if (!v) return;
      o[el.name] = o[el.name] ? o[el.name] + ', ' + v : v;
    });
    return o;
  }
  function validate(scope) {
    var fields = $$('input, select, textarea', scope).filter(function (el) { return el.name !== '_honey' && el.type !== 'hidden'; });
    for (var k = 0; k < fields.length; k++) { if (!fields[k].checkValidity()) { fields[k].reportValidity(); return false; } }
    return true;
  }
  function initForm(form) {
    if (form.getAttribute('data-ready')) return; form.setAttribute('data-ready', '1');
    var steps = $$('.step', form), i = 0;
    var bar = $('.progress span', form), meta = $('[data-step-label]', form);
    function show(n, focus) {
      steps.forEach(function (s, k) { s.hidden = k !== n; });
      i = n;
      if (bar) bar.style.width = ((n + 1) / steps.length * 100) + '%';
      if (meta) meta.textContent = 'Step ' + (n + 1) + ' of ' + steps.length;
      if (focus) { var f = $('input:not([type=hidden]):not(.hp), select, textarea', steps[n]); if (f) f.focus(); }
    }
    if (steps.length) {
      show(0, false);
      $$('[data-next]', form).forEach(function (b) { b.addEventListener('click', function () { if (validate(steps[i])) show(Math.min(i + 1, steps.length - 1), true); }); });
      $$('[data-back]', form).forEach(function (b) { b.addEventListener('click', function () { show(Math.max(i - 1, 0), true); }); });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (steps.length && i < steps.length - 1) { if (validate(steps[i])) show(i + 1, true); return; }
      if (!validate(steps.length ? steps[i] : form)) return;
      send(form);
    });
  }
  function send(form) {
    var btn = $('button[type=submit]', form);
    var data = formData(form);
    if (data._honey) { done(form); return; }
    delete data._honey;
    var ctx = context(); for (var k in ctx) { if (!(k in data)) data[k] = ctx[k]; }
    data.form_name = form.getAttribute('data-form') || 'form';
    data._subject = form.getAttribute('data-subject') || 'Affilia.com form submission';
    data._template = 'table';
    data._captcha = 'false';
    if (btn) { btn.disabled = true; btn.setAttribute('data-label', btn.textContent); btn.textContent = 'Sending…'; }
    fetch(endpoint(), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) { if (res.ok && String(res.j.success) === 'true') done(form); else fail(form, data); })
      .catch(function () { fail(form, data); })
      .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-label') || 'Send'; } });
  }
  function done(form) {
    var kind = form.getAttribute('data-form');
    if (kind === 'newsletter') {
      var st = $('.form-status', form); st.hidden = false; st.className = 'form-status ok';
      st.textContent = 'You’re on the list. The next issue goes out at the start of the month.'; form.reset(); return;
    }
    var msg = form.getAttribute('data-success') || 'Thanks, it’s in. Expect a reply within two business days.';
    var p = d.createElement('div'); p.className = 'success-panel'; p.setAttribute('role', 'status'); p.setAttribute('tabindex', '-1');
    p.innerHTML = '<h3>Received</h3><p>' + esc(msg) + '</p>';
    form.hidden = true; form.parentNode.insertBefore(p, form.nextSibling); p.focus();
    try { d.dispatchEvent(new CustomEvent('affilia:submitted', { detail: kind })); } catch (e) {}
  }
  function fail(form, data) {
    var st = $('.form-status', form);
    if (!st) { st = d.createElement('p'); st.className = 'form-status'; form.appendChild(st); }
    st.hidden = false; st.className = 'form-status err';
    st.innerHTML = 'The form couldn’t be delivered just now. <a href="#" data-fallback>Send it by email instead</a>; your answers will be filled in for you.';
    $('[data-fallback]', st).addEventListener('click', function (e) { e.preventDefault(); mailto(data._subject, data); });
  }

  /* Shared earnings math: cohorts, recurring months, churn and refunds */
  function project(o) {
    var visits = +o.visits || 0, conv = (+o.conv || 0) / 100, price = +o.price || 0, pct = (+o.pct || 0) / 100, flat = +o.flat || 0;
    var months = Math.max(1, +o.months || 1), churn = Math.min(Math.max((+o.churn || 0) / 100, 0), 1), refund = Math.min(Math.max((+o.refund || 0) / 100, 0), 1);
    var horizon = +o.horizon || 12, newCust = visits * conv, series = [], total = 0;
    for (var m = 0; m < horizon; m++) {
      var amt = 0;
      for (var c = 0; c <= m; c++) {
        var age = m - c, alive = newCust * Math.pow(1 - churn, age);
        if (age === 0) amt += newCust * flat;
        if (age < months) amt += alive * price * pct;
      }
      amt *= (1 - refund); series.push(amt); total += amt;
    }
    return { newCust: newCust, perSale: flat + price * pct, first: series[0] || 0, last: series[horizon - 1] || 0, total: total, series: series, epc: visits ? total / (visits * horizon) : 0 };
  }

  /* Home hero sentence calculator */
  function initHero() {
    var f = $('#hero-calc'); if (!f) return;
    var o1 = $('#hc-out'), o2 = $('#hc-out2');
    function v(id) { var n = parseFloat($('#' + id).value); return isNaN(n) ? 0 : n; }
    function size(el) { el.style.width = Math.max(2.6, String(el.value).length + 1.4) + 'ch'; }
    function calc() {
      var r = project({ visits: v('hc-visits'), conv: v('hc-conv'), price: v('hc-price'), pct: v('hc-rate'), months: 12, churn: 5, horizon: 12 });
      o1.textContent = money(r.first); o2.textContent = money(r.last);
      o1.classList.remove('bump'); void o1.offsetWidth; o1.classList.add('bump');
    }
    $$('input', f).forEach(function (el) { size(el); el.addEventListener('input', function () { size(el); calc(); }); });
    f.addEventListener('submit', function (e) { e.preventDefault(); });
    calc();
  }

  /* Directory filters and sorting */
  function initDirectory() {
    var table = $('#dir'); if (!table) return;
    var tbody = $('tbody', table), rows = $$('tr', tbody);
    var q = $('#f-q'), cat = $('#f-cat'), model = $('#f-model'), rec = $('#f-rec'), count = $('#f-count'), empty = $('#f-empty');
    var params = new URLSearchParams(location.search);
    if (params.get('cat') && cat) cat.value = params.get('cat');
    if (params.get('q') && q) q.value = params.get('q');
    if (params.get('recurring') === '1' && rec) rec.checked = true;
    function apply() {
      var term = (q && q.value || '').toLowerCase().trim(), c = cat ? cat.value : '', m = model ? model.value : '', r = rec && rec.checked, n = 0;
      rows.forEach(function (tr) {
        var ok = (!term || (tr.getAttribute('data-search') || '').indexOf(term) > -1) && (!c || tr.getAttribute('data-cat') === c) && (!m || tr.getAttribute('data-model') === m) && (!r || tr.getAttribute('data-rec') === '1');
        tr.hidden = !ok; if (ok) n++;
      });
      if (count) count.textContent = n + (n === 1 ? ' program' : ' programs');
      if (empty) empty.hidden = n > 0;
      $$('.chip[data-cat]').forEach(function (ch) { ch.setAttribute('aria-pressed', String(ch.getAttribute('data-cat') === c)); });
    }
    [q, cat, model, rec].forEach(function (el) { if (el) { el.addEventListener('input', apply); el.addEventListener('change', apply); } });
    $$('.chip[data-cat]').forEach(function (ch) { ch.addEventListener('click', function () { if (cat) { cat.value = ch.getAttribute('data-cat'); apply(); } }); });
    $$('th[data-sort]', table).forEach(function (th) {
      var b = $('button', th); if (!b) return;
      b.addEventListener('click', function () {
        var key = th.getAttribute('data-sort'), first = th.getAttribute('data-first') || 'descending';
        var cur = th.getAttribute('aria-sort'), dir = cur ? (cur === 'ascending' ? 'descending' : 'ascending') : first;
        $$('th[data-sort]', table).forEach(function (o) { o.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
        rows.sort(function (a, b2) {
          var x = a.getAttribute('data-' + key) || '', y = b2.getAttribute('data-' + key) || '';
          var nx = parseFloat(x), ny = parseFloat(y);
          var cmp = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y);
          return dir === 'ascending' ? cmp : -cmp;
        }).forEach(function (tr) { tbody.appendChild(tr); });
      });
    });
    apply();
  }

  /* Program pages: mini calculator and similar programs */
  function miniCalc(box, p) {
    box.innerHTML =
      '<div class="field"><label for="mc-v">Clicks you send per month</label><input id="mc-v" type="number" min="0" value="1000"></div>' +
      '<div class="field"><label for="mc-c">Conversion rate (%)</label><input id="mc-c" type="number" min="0" step="0.1" value="2"></div>' +
      (p.pct ? '<div class="field"><label for="mc-p">Example order or plan value ($)</label><input id="mc-p" type="number" min="0" value="' + (+p.price || 0) + '"></div>' +
        '<div class="field"><label for="mc-r">Commission (%)</label><input id="mc-r" type="number" min="0" step="0.5" value="' + (+p.pct || 0) + '"></div>' : '') +
      (p.flat ? '<div class="field"><label for="mc-f">Fixed payout per sale ($)</label><input id="mc-f" type="number" min="0" value="' + (+p.flat || 0) + '"></div>' : '') +
      '<dl class="calc-result"><dt>First month</dt><dd id="mc-o1">$0</dd><dt>' + (p.months > 1 ? 'First 12 months, with 5% monthly churn' : 'First 12 months') + '</dt><dd id="mc-o2">$0</dd></dl>' +
      '<p class="fine">An illustration, not a forecast. Results depend on your traffic, the offer and the program&rsquo;s current terms.</p>';
    function val(id) { var el = $('#' + id, box); return el ? (parseFloat(el.value) || 0) : 0; }
    function run() {
      var r = project({ visits: val('mc-v'), conv: val('mc-c'), price: val('mc-p'), pct: val('mc-r'), flat: val('mc-f'), months: p.months, churn: 5, horizon: 12 });
      $('#mc-o1', box).textContent = money(r.first); $('#mc-o2', box).textContent = money(r.total);
    }
    $$('input', box).forEach(function (el) { el.addEventListener('input', run); });
    run();
  }
  function initProgram() {
    var art = $('[data-program]'); if (!art) return;
    var id = art.getAttribute('data-program');
    getJSON('data/programs.json').then(function (db) {
      var list = db.programs || [], p = list.filter(function (x) { return x.id === id; })[0]; if (!p) return;
      var box = $('#pcalc'); if (box) miniCalc(box, p);
      var sim = $('#similar');
      if (sim) {
        var same = list.filter(function (x) { return x.cat === p.cat && x.id !== p.id; });
        var rest = list.filter(function (x) { return x.cat !== p.cat && x.model === p.model; });
        sim.innerHTML = same.concat(rest).slice(0, 5).map(function (x) {
          return '<li><a href="' + R + 'programs/' + x.id + '/"><strong>' + esc(x.name) + '</strong><span>' + esc(x.commission) + '</span></a></li>';
        }).join('');
      }
    }).catch(function () {});
  }
  function initSpotlight() {
    var box = $('[data-spotlight]'); if (!box) return;
    getJSON('data/programs.json').then(function (db) {
      var list = db.programs || []; if (!list.length) return;
      var p = list[Math.floor(Date.now() / 6048e5) % list.length];
      box.innerHTML = '<a href="' + R + 'programs/' + p.id + '/"><strong>' + esc(p.name) + ': ' + esc(p.commission) + '</strong><span>' + esc(p.cookieText) + ' cookie. Best for ' + esc(p.bestFor.charAt(0).toLowerCase() + p.bestFor.slice(1)) + '.</span></a>';
    }).catch(function () {});
  }

  /* YouTube: lightweight click-to-load player */
  function initVideos() {
    $$('.yt[data-id]').forEach(function (b) {
      if (b.getAttribute('data-ready')) return; b.setAttribute('data-ready', '1');
      var id = b.getAttribute('data-id');
      b.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
      b.addEventListener('click', function () {
        var w = d.createElement('div'); w.className = 'yt-frame';
        var f = d.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        f.title = b.getAttribute('aria-label') || 'YouTube video';
        f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        f.setAttribute('allowfullscreen', '');
        w.appendChild(f); b.parentNode.replaceChild(w, b);
      });
    });
  }

  /* Self-updating industry headlines (data/news.json is refreshed by the automation job) */
  function initNews() {
    $$('[data-news]').forEach(function (box) {
      var lim = +box.getAttribute('data-news') || 10;
      getJSON('data/news.json').then(function (j) {
        var items = (j.items || []).slice(0, lim); if (!items.length) return;
        box.innerHTML = items.map(function (it) {
          return '<li><div><a href="' + esc(it.url) + '" target="_blank" rel="nofollow noopener">' + esc(it.title) + '</a><div class="src">' + esc(it.source) + '</div></div><time datetime="' + esc(it.date) + '">' + fmtDate(it.date) + '</time></li>';
        }).join('');
        $$('[data-news-updated]').forEach(function (u) { if (j.updated) u.textContent = fmtDate(j.updated); });
      }).catch(function () {});
    });
  }

  /* Site search */
  function initSearch() {
    var out = $('#search-results'), input = $('#q'); if (!out || !input) return;
    input.value = new URLSearchParams(location.search).get('q') || '';
    Promise.all([getJSON('data/programs.json'), getJSON('data/pages.json')]).then(function (res) {
      var idx = (res[1].pages || []).concat((res[0].programs || []).map(function (p) {
        return { t: p.name + ' affiliate program', u: 'programs/' + p.id + '/', d: p.commission + '. ' + p.bestFor + '.', k: [p.cat, p.network, p.model].join(' ') };
      }));
      function run() {
        var q = input.value.toLowerCase().trim();
        if (!q) { out.innerHTML = '<p class="muted">Search programs, guides, tools and glossary terms.</p>'; return; }
        var terms = q.split(/\s+/);
        var hits = idx.map(function (x) {
          var t = x.t.toLowerCase(), hay = (x.t + ' ' + x.d + ' ' + (x.k || '')).toLowerCase(), s = 0;
          terms.forEach(function (w) { if (t.indexOf(w) > -1) s += 3; else if (hay.indexOf(w) > -1) s += 1; else s -= 9; });
          return { x: x, s: s };
        }).filter(function (h) { return h.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 40);
        out.innerHTML = hits.length
          ? '<p class="count">' + hits.length + (hits.length === 1 ? ' result' : ' results') + '</p><ul class="rule-list">' + hits.map(function (h) { return '<li><a href="' + R + h.x.u + '"><strong>' + esc(h.x.t) + '</strong><span>' + esc(h.x.d) + '</span></a></li>'; }).join('') + '</ul>'
          : '<p>Nothing matches “' + esc(q) + '”. Try a broader word such as email, recurring or hosting, or <a href="' + R + 'programs/">browse the full directory</a>.</p>';
      }
      input.addEventListener('input', function () { run(); try { history.replaceState(null, '', '?q=' + encodeURIComponent(input.value)); } catch (e) {} });
      run();
    }).catch(function () { out.innerHTML = '<p>Search is unavailable right now. <a href="' + R + 'programs/">Browse the directory</a> instead.</p>'; });
  }

  /* Article table of contents */
  function initToc() {
    var prose = $('.prose[data-toc]'), toc = $('#toc'); if (!prose || !toc) return;
    var hs = $$('h2', prose); if (hs.length < 3) { toc.hidden = true; return; }
    toc.innerHTML = '<p>On this page</p>' + hs.map(function (h) { if (!h.id) h.id = slug(h.textContent); return '<a href="#' + h.id + '">' + esc(h.textContent) + '</a>'; }).join('');
  }

  /* Optional fixed AdSense units (auto ads run regardless) */
  function initAdSlots() {
    var s = C.adSlots || {};
    $$('[data-ad]').forEach(function (box) {
      var slot = s[box.getAttribute('data-ad')]; if (!slot) return;
      box.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6620975821265271" data-ad-slot="' + esc(slot) + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      box.classList.add('ad-on');
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }

  /* Donations: switch on payment buttons when links exist in config.js */
  function initDonate() {
    var dn = C.donate || {}, any = false;
    $$('[data-donate]').forEach(function (a) {
      var k = a.getAttribute('data-donate');
      if (dn[k]) { a.href = dn[k]; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; any = true; } else { a.hidden = true; }
    });
    $$('[data-donate-ready]').forEach(function (x) { x.hidden = !any; });
    $$('[data-donate-none]').forEach(function (x) { x.hidden = any; });
  }
  function initAmounts() {
    $$('[data-amounts]').forEach(function (g) {
      var target = $(g.getAttribute('data-amounts'));
      $$('button', g).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('button', g).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          if (target) { target.value = b.getAttribute('data-value'); target.dispatchEvent(new Event('input')); }
        });
      });
    });
  }
  function initCopy() {
    d.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-copy]'); if (!b) return;
      var src = $(b.getAttribute('data-copy')); if (!src) return;
      var text = (src.tagName === 'INPUT' || src.tagName === 'TEXTAREA') ? src.value : src.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast('Copied'); }, function () { toast('Select the text and copy it manually'); });
      else toast('Select the text and copy it manually');
    });
  }

  function initCookieNotice() {
    if (store.get('affilia-cookies')) return;
    var b = d.createElement('div'); b.className = 'cookie'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Cookie notice');
    b.innerHTML = '<p>We use cookies to show ads through Google AdSense and to remember your settings. <a href="' + R + 'cookies/">Cookie policy</a></p><button class="btn btn-pub btn-small" type="button">OK</button>';
    d.body.appendChild(b);
    $('button', b).addEventListener('click', function () { store.set('affilia-cookies', '1'); b.remove(); });
  }

  /* Brand lead nudge: desktop only, once every 14 days, on exit intent or deep scroll */
  function initNudge() {
    var page = d.body.getAttribute('data-nav');
    if (['academy', 'programs', 'tools', 'networks'].indexOf(page) < 0) return;
    if (!window.matchMedia || !matchMedia('(min-width: 980px)').matches) return;
    var last = +(store.get('affilia-nudge') || 0); if (Date.now() - last < 14 * 864e5) return;
    var shown = false, start = Date.now();
    function open() {
      if (shown || $('.modal')) return; shown = true; store.set('affilia-nudge', String(Date.now()));
      var prev = d.activeElement;
      var m = d.createElement('div'); m.className = 'modal';
      m.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="nudge-title"><button class="icon-btn modal-close" type="button" aria-label="Close">' + I.close + '</button>' +
        '<h2 id="nudge-title">Running an affiliate program?</h2><p>Tell us where it stands and we&rsquo;ll send back a short growth plan: partner targets, commission benchmarks and the first three moves. Free, with no obligation.</p>' +
        '<div class="btn-row"><a class="btn btn-brand" href="' + R + 'grow/">Get my growth plan</a><button class="btn btn-ghost" type="button" data-close>Not now</button></div></div>';
      d.body.appendChild(m);
      function close() { m.remove(); d.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); }
      function onKey(e) { if (e.key === 'Escape') close(); }
      d.addEventListener('keydown', onKey);
      m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.modal-close') || e.target.closest('[data-close]')) close(); });
      $('.modal-close', m).focus();
    }
    d.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 6 && Date.now() - start > 8000) open(); });
    window.addEventListener('scroll', function () {
      var h = d.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h > 0.75 && Date.now() - start > 30000) open();
    }, { passive: true });
  }

  function init() {
    buildHeader(); buildFooter(); captureContext();
    if (!$('link[rel=icon]')) { var l = d.createElement('link'); l.rel = 'icon'; l.type = 'image/svg+xml'; l.href = R + 'favicon.svg'; d.head.appendChild(l); }
    $$('form[data-form]').forEach(initForm);
    $$('[data-mail]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); mailto(a.getAttribute('data-mail') || 'Affilia.com enquiry'); }); });
    $$('[data-year]').forEach(function (y) { y.textContent = YEAR; });
    initHero(); initDirectory(); initProgram(); initSpotlight(); initVideos(); initNews(); initSearch(); initToc();
    initAdSlots(); initDonate(); initAmounts(); initCopy(); initCookieNotice(); initNudge();
  }

  window.Affilia = { $: $, $$: $$, esc: esc, money: money, num: num, project: project, getJSON: getJSON, toast: toast, R: R, store: store, initForm: initForm };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
