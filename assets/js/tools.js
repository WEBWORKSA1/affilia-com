/* Affilia.com tools: calculators, builders and the program matchmaker. Requires site.js. */
(function () {
  'use strict';
  var A = window.Affilia; if (!A) return;
  var $ = A.$, $$ = A.$$, esc = A.esc;

  function reader(root) {
    return function (id) {
      var el = $('#' + id, root); if (!el) return 0;
      if (el.tagName === 'SELECT') return el.value;
      if (el.type === 'checkbox') return el.checked;
      if (el.type === 'number') return parseFloat(el.value) || 0;
      return String(el.value).trim();
    };
  }
  function setter(root) { return function (id, text) { var el = $('#' + id, root); if (el) el.textContent = text; }; }
  function live(root, fn) { $$('input, select, textarea', root).forEach(function (el) { el.addEventListener('input', fn); el.addEventListener('change', fn); }); fn(); }

  /* 1. Commission calculator */
  function commission(root) {
    var v = reader(root), set = setter(root);
    live(root, function () {
      var type = v('c-type');
      $$('[data-show]', root).forEach(function (el) { el.hidden = el.getAttribute('data-show').split(' ').indexOf(type) < 0; });
      var r = A.project({ visits: v('c-clicks'), conv: v('c-conv'), price: v('c-price'), pct: type === 'flat' ? 0 : v('c-pct'), flat: type === 'percent' ? 0 : v('c-flat'), months: +v('c-months'), churn: v('c-churn'), refund: v('c-refund'), horizon: 12 });
      set('o-new', A.num(r.newCust, 1));
      set('o-first', A.money(r.first));
      set('o-last', A.money(r.last));
      set('o-total', A.money(r.total));
      set('o-epc', A.money(r.epc, true));
      var tb = $('#o-table', root);
      if (tb) tb.innerHTML = r.series.map(function (x, i) { return '<tr><td>Month ' + (i + 1) + '</td><td>' + A.money(x) + '</td></tr>'; }).join('');
    });
  }

  /* 2. EPC and RPM calculator */
  function epc(root) {
    var v = reader(root), set = setter(root);
    live(root, function () {
      var earn = v('e-earn'), clicks = v('e-clicks'), views = v('e-views'), rpm = v('e-rpm');
      var e = clicks ? earn / clicks : 0, arpm = views ? earn / views * 1000 : 0, ctr = views ? clicks / views * 100 : 0;
      set('o-epc', A.money(e, true));
      set('o-arpm', A.money(arpm, true));
      set('o-ctr', A.num(ctr, 2) + '%');
      set('o-both', A.money(arpm + rpm, true));
      var msg;
      if (!views || !clicks) msg = 'Enter your earnings, clicks and pageviews to compare.';
      else if (arpm > rpm * 1.2) msg = 'Affiliate links earn ' + A.num(arpm / Math.max(rpm, 0.01), 1) + ' times more per thousand views than display ads here. Lead with the offer, keep ads lower on the page and test a comparison table above the fold.';
      else if (rpm > arpm * 1.2) msg = 'Display ads out-earn the affiliate offer on this page. Either the offer is a weak fit or click-through is low: test a stronger call to action, a different program, or let ads carry the page.';
      else msg = 'Ads and affiliate links earn about the same per thousand views. Keep both and test placement: one clear offer near the top, ads between sections.';
      set('o-verdict', msg);
    });
  }

  /* 3. Affiliate link builder */
  function linkBuilder(root) {
    var v = reader(root), set = setter(root);
    live(root, function () {
      var raw = v('l-url');
      if (!raw) { set('o-link', 'Paste the product or landing page URL to start.'); set('o-html', ''); return; }
      var u;
      try { u = new URL(raw); if (!/^https?:$/.test(u.protocol)) throw 0; } catch (e) { set('o-link', 'That doesn’t look like a full web address. Start it with https://'); set('o-html', ''); return; }
      if (v('l-param') && v('l-id')) u.searchParams.set(v('l-param'), v('l-id'));
      [['utm_source', 'l-src'], ['utm_medium', 'l-med'], ['utm_campaign', 'l-camp'], ['utm_content', 'l-content']].forEach(function (p) { var x = v(p[1]); if (x) u.searchParams.set(p[0], x.replace(/\s+/g, '-').toLowerCase()); });
      var link = u.toString();
      set('o-link', link);
      set('o-html', '<a href="' + link + '" rel="sponsored nofollow noopener" target="_blank">' + (v('l-text') || 'Check the current price') + '</a>');
    });
  }

  /* 4. Disclosure generator */
  function disclosure(root) {
    var v = reader(root), set = setter(root);
    var SHORT = {
      blog: 'This post contains affiliate links. If you buy through them, {site} may earn a commission at no extra cost to you.',
      youtube: 'Some links in this description are affiliate links, so {site} earns a commission if you buy. Say this out loud near the start of the video as well.',
      newsletter: 'This email contains affiliate links. If you buy through them, {site} may earn a commission.',
      social: '#ad Affiliate link: {site} earns a commission if you buy.',
      podcast: 'Some offers in this episode use affiliate links, which means {site} earns a commission if you sign up. Read this at the start of the episode and repeat it when you mention the offer.'
    };
    live(root, function () {
      var site = v('d-site') || 'this site', ch = v('d-channel') || 'blog';
      var s = SHORT[ch].replace('{site}', site);
      if (v('d-amazon')) s += ' As an Amazon Associate I earn from qualifying purchases.';
      if (v('d-gifted')) s += ' Some products mentioned were provided free for review.';
      if (v('d-sponsored')) s += ' This content is sponsored by the brand named in it.';
      set('o-short', s);
      var today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      var full = 'Affiliate disclosure for ' + site + '\n\nLast updated: ' + today + '\n\n' +
        site + ' is reader-supported. Some links on this site are affiliate links. When you click one and buy something, we may earn a commission from the seller. The price you pay is the same.\n\n' +
        'Commissions never decide what we recommend. We only feature products we have used, tested or researched, and we tell you when a piece is sponsored or when a product was provided for free.\n\n' +
        (v('d-amazon') ? 'As an Amazon Associate I earn from qualifying purchases.\n\n' : '') +
        'We place a short disclosure near the top of any page, video or email that contains affiliate links, so you see it before you see the links.\n\n' +
        'Questions about this policy? Use the contact page on this site.';
      set('o-full', full);
    });
  }

  /* 5. Program matchmaker */
  function matchmaker(root) {
    var form = $('#mm-quiz', root), out = $('#mm-results', root), capture = $('#mm-capture', root);
    if (!form || !out) return;
    var B2B = ['marketing', 'email', 'productivity'], B2C = ['ecommerce', 'security', 'creators', 'web'];
    A.getJSON('data/programs.json').then(function (db) {
      var list = db.programs || [];
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form), niche = fd.get('niche'), aud = fd.get('audience'), pref = fd.get('pref'), stage = fd.get('stage');
        if (!niche || !aud || !pref || !stage) { A.toast('Answer all four questions to see matches'); return; }
        var scored = list.map(function (p) {
          var s = 0, per = (p.flat || 0) + (p.price || 0) * (p.pct || 0) / 100;
          if (niche === p.cat) s += 6; else if (niche === 'any') s += 1;
          if (aud === 'b2b' && B2B.indexOf(p.cat) > -1) s += 2;
          if (aud === 'b2c' && B2C.indexOf(p.cat) > -1) s += 2;
          if (aud === 'mixed') s += 1;
          if (pref === 'recurring') { if (p.model === 'Recurring') s += 3; if (p.model === 'Hybrid') s += 2; if (p.months >= 999) s += 1; }
          if (pref === 'ticket' && per >= 40) s += 3;
          if (pref === 'volume' && B2C.indexOf(p.cat) > -1) s += 2;
          if (p.cookie && p.cookie >= 90) s += 1;
          if (stage === 'new' && (p.network === 'Amazon Associates' || p.cat === 'web' || p.cat === 'ecommerce')) s += 1;
          if (stage === 'established' && per >= 100) s += 1;
          return { p: p, s: s };
        }).sort(function (a, b) { return b.s - a.s; }).slice(0, 6);
        var top = scored[0] ? scored[0].s : 1;
        out.innerHTML = '<h2 class="h3">Your top matches</h2>' + scored.map(function (x) {
          var fit = Math.max(35, Math.round(x.s / Math.max(top, 1) * 100));
          return '<div class="match"><h3><a href="' + A.R + 'programs/' + x.p.id + '/">' + esc(x.p.name) + '</a></h3><span class="score">' + fit + '% fit</span><p>' + esc(x.p.commission) + '. ' + esc(x.p.cookieText) + ' cookie. Best for ' + esc(x.p.bestFor.charAt(0).toLowerCase() + x.p.bestFor.slice(1)) + '.</p></div>';
        }).join('');
        out.hidden = false;
        if (capture) {
          capture.hidden = false;
          var hid = $('input[name=shortlist]', capture); if (hid) hid.value = scored.map(function (x) { return x.p.name; }).join(', ');
          var ans = $('input[name=answers]', capture); if (ans) ans.value = [niche, aud, pref, stage].join(' / ');
        }
        out.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }).catch(function () { out.hidden = false; out.innerHTML = '<p>The program list didn’t load. Refresh the page or browse the directory.</p>'; });
  }

  /* 6. Brand commission planner */
  function planner(root) {
    var v = reader(root), set = setter(root);
    live(root, function () {
      var aov = v('b-aov'), margin = v('b-margin') / 100, cac = v('b-cac'), orders = v('b-orders'), fee = v('b-fee') / 100, fixed = v('b-fixed'), repeat = Math.max(1, v('b-repeat'));
      var gp = aov * margin, maxRate = aov ? cac / (aov * (1 + fee)) : 0, rec = maxRate * 0.8;
      var perOrder = rec * aov * (1 + fee), monthly = orders * perOrder + fixed, contrib = gp - perOrder, ltv = gp * repeat;
      set('o-max', A.num(maxRate * 100, 1) + '%');
      set('o-rec', A.num(rec * 100, 1) + '%');
      set('o-cost', A.money(monthly));
      set('o-contrib', A.money(contrib));
      var msg;
      if (!aov || !cac) msg = 'Enter your order value and the most you will pay to acquire a customer.';
      else if (contrib < 0 && ltv > perOrder) msg = 'The first order loses money after commission, but 12-month profit per customer covers it. That works if you can fund the gap: pay on the first order only, and track repeat purchases by cohort.';
      else if (contrib < 0) msg = 'This commission costs more than the gross profit a customer brings in. Lower the target acquisition cost, raise order value with bundles, or pay a fixed bounty instead of a percentage.';
      else if (rec * 100 < 5) msg = 'A rate under 5% is hard to recruit with outside of large marketplaces. Consider a fixed bounty per new customer, or bonuses for partners who pass a monthly sales threshold.';
      else msg = 'This rate leaves room for performance bonuses. Offer ' + A.num(rec * 100, 1) + '% as the base, add a tier for top partners up to ' + A.num(maxRate * 100, 1) + '%, and review the numbers every quarter.';
      set('o-verdict', msg);
    });
  }

  var MAP = { commission: commission, epc: epc, link: linkBuilder, disclosure: disclosure, match: matchmaker, planner: planner };
  $$('[data-tool]').forEach(function (root) { var fn = MAP[root.getAttribute('data-tool')]; if (fn) fn(root); });
})();
