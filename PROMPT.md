# Affilia.com: phase-wise build prompt

This is the prompt used to plan and build Affilia.com, written so the site can be rebuilt, extended or handed to another builder phase by phase. Each phase lists what to build and how to check it is done.

---

## The concept, and why it wins

**Affilia.com: affiliate programs, compared by the numbers.** A two-sided hub for the affiliate economy:

- **Publishers and creators** get a verified program directory (commission, payout model, cookie window, tracking platform), free calculators and a practical Academy.
- **Brands** get a free growth-plan funnel, a commission planner, a network and software cost comparison, and paid listings and sponsorships.

Why this is the highest-value use of the name:

1. **High-value ad inventory.** Affiliate readers research SaaS, marketing tools, hosting and payments, which are among the higher-paying advertiser categories in AdSense.
2. **High-value leads.** A brand asking for help with an affiliate program is a B2B lead worth far more than a page view; it can be served directly or introduced to agencies and platforms.
3. **Recurring revenue.** Featured listings and category sponsorships are monthly products sold to an audience that already has budget.
4. **Compounding content.** Program pages, tools and guides target commercial-investigation searches that AI answers don't fully satisfy.
5. **The name is the category.** "Affilia" reads as "affiliation": memorable, short and on-topic.

Revenue stack, in order of expected contribution after launch: AdSense (auto ads) > featured listings and sponsorships > brand lead introductions > newsletter sponsorship > reader support > contest prize sponsorship.

---

## Research base: 40 benchmark sites and what was adopted

| Category | Sites studied | Adopted |
|---|---|---|
| Program directories and offer search | OfferVault, Affpaying, oDigger, Affplus, Lasso directory, Post Affiliate Pro directory, UpPromote directory, Reditus marketplace, Referly marketplace, AffiliList, TopRanked, Affonso | Sortable ledger table, filters and chips, per-program pages, "last checked" dates, honest "not published" values, verify-on-official-page notes |
| Networks and platforms | Awin (incl. the former ShareASale), CJ Affiliate, Impact.com, Rakuten Advertising, PartnerStack, ClickBank, Digistore24, FlexOffers | Network comparison with published pricing, break-even math |
| Affiliate software | Rewardful, FirstPromoter, Tapfiliate, Refersion, Everflow, AffiliateWP, UpPromote, GoAffPro, Tolt, Dub Partners | Software comparison, commission planner for brands |
| Education and media | Authority Hacker, Niche Pursuits, Smart Passive Income, Matthew Woodward, Diggity Marketing, Income School, Ahrefs Academy, HubSpot partner pages, Hello Partner, wecantrack, Strackr | Sequenced Academy, worked examples, calculators, curated video, industry headlines |
| Communities | affLIFT, AffiliateFix, STM Forum | Contest, careers and community prompts |
| Compliance | FTC Endorsement Guides and Disclosures 101, Google AdSense program policies | Disclosure generator, disclosure guide, policy pages, ad placement rules |

---

## Global requirements (every phase)

- **Hosting:** static HTML, CSS and JavaScript only, served by GitHub Pages from the `main` branch root on the free plan. No build step. All internal links relative so the site works at both `username.github.io/affilia-com/` and `affilia.com/`. Include `.nojekyll`.
- **Top strip on every page:** the text "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linked to `https://web.works/contact`, as static HTML above the header.
- **One inbox only, never shown:** every form and contact link delivers to the owner's single inbox. The address is stored encoded in `assets/js/config.js`, assembled only at the moment of sending, and never printed in any page, file or link text. Forms post to FormSubmit's AJAX endpoint; mail links build a `mailto:` on click.
- **AdSense:** the publisher snippet (`ca-pub-6620975821265271`) in the `<head>` of every content page, plus the `google-adsense-account` meta tag and a root `ads.txt`. No ads on pages without publisher content (the 404 page). Optional fixed units via slot IDs in `config.js`; empty slots render nothing.
- **Trademark safety:** "Affilia" used only as the site name, as a descriptive short form of "affiliation". A trademark and copyright notice disclaims any connection with similarly named organizations. No third-party logos; program names as plain text (nominative use).
- **Accuracy:** program terms only from published sources, each page dated, unknown values shown as "Set by the program" rather than guessed. No fake testimonials, statistics or income claims.
- **Quality floor:** responsive to 360px, keyboard focus visible, reduced motion respected, semantic headings, light and dark themes.

---

## Phase 0: Strategy and research

Build: positioning, audience split (publishers / brands), revenue stack, content plan, benchmark review of 35+ sites, trademark search for the name.

Done when: the concept, revenue order and benchmark table above exist and every later phase traces back to them.

## Phase 1: Design system and site shell

Build: tokens with meaning (cobalt = brands, saffron = publishers and money), one variable type family (Archivo, using its width axis for numbers and headlines), ledger-style tables instead of card grids, one memorable moment (the homepage sentence calculator with a highlighter-style result). Shared header, mobile menu, footer with newsletter, theme toggle, cookie notice, skip link, all injected by `site.js` so pages stay small.

Done when: every page renders the strip, header and footer; Lighthouse accessibility is above 95; the layout holds at 360px.

## Phase 2: Program directory

Build: `data/programs.json` (id, name, category, model, commission text, percent, bounty, recurring months, cookie, network, URL, example price, best-for), a static directory table with search, category and model filters, chips and sorting, and one static page per program with summary, terms, who it suits, converting content angles, watch-outs, an earnings mini-calculator and similar programs.

Done when: 25+ programs are listed with dated, sourced terms, and each page works without JavaScript for reading.

## Phase 3: Tools

Build: commission calculator (cohorts, recurring months, churn, refunds, EPC, month-by-month table), EPC and RPM calculator with an affiliate-versus-ads verdict, affiliate link builder (UTM, rel attributes), disclosure generator (per channel plus a full page), program matchmaker (quiz, ranked matches, email capture), brand commission planner (maximum and recommended rate, monthly cost, verdict).

Done when: all tools update live, handle empty or invalid input with clear messages, and each page explains its formula.

## Phase 4: Content

Build: a twelve-guide Academy in sequence (eight for publishers, four for brands), a 50-term glossary, a curated video library using click-to-load YouTube embeds in privacy-enhanced mode (verify every video ID before publishing), and an industry headlines page.

Done when: each guide is original, sourced, dated, has a table of contents, an in-article ad position and a next-guide link.

## Phase 5: Lead generation

Build: `/grow/`, a four-step brand funnel (need, business, program, contact) with progress bar, validation, consent and honeypot; a quick three-field version on the homepage; brand CTAs inside every brand guide; a desktop-only exit-intent nudge on content pages, at most once per 14 days; matchmaker email capture; newsletter in the footer. Every submission carries page, landing page, referrer and UTM tags.

Done when: a test submission from each form reaches the inbox, and failures show an honest message with a pre-filled email fallback.

## Phase 6: Monetization

Build: AdSense auto ads; featured listings and category sponsorships (`/list-your-program/`, `/advertise/` with launch pricing and a media-kit form); donations (`/support/` with planned use of funds, amount buttons, pledge form, and payment buttons that switch on when links are added to `config.js`); contests (`/contests/` with dates, prizes, judging weights and official rules); hiring (`/careers/` with roles and an application form).

Done when: every paid placement is labeled, donations state they are not tax-deductible, and contest rules include eligibility, dates, judging and privacy.

## Phase 7: Trust and compliance

Build: About, Contact, Editorial policy (including use of AI tools), Privacy policy (AdSense cookie language, opt-out links, Google partner-sites link, consent for the EEA, UK and Switzerland, rights, retention), Terms, Cookie policy, Disclaimer with earnings disclaimer, Affiliate disclosure, Trademark and copyright notice.

Done when: all are linked from every footer and the privacy policy matches what the site actually does.

## Phase 8: SEO and automation

Build: unique titles and descriptions, canonical URLs on the final domain, Organization, WebSite and Article structured data, `sitemap.xml`, `robots.txt`, a client-side search page backed by JSON, and `automation/refresh.py` plus a scheduled GitHub Actions workflow that refreshes headlines and sitemap dates daily.

Done when: the sitemap lists every indexable page, search finds programs, guides and terms, and the refresh job runs green.

## Phase 9: Launch

1. GitHub Pages: Settings > Pages > Deploy from a branch > `main` / root.
2. Custom domain: add `affilia.com` in Pages settings and point DNS (see README).
3. Forms: submit one test form, click FormSubmit's activation email, optionally paste the alias into `config.js`.
4. AdSense: add the site, confirm `ads.txt`, turn on auto ads, set up the Privacy and messaging consent message for the EEA, UK and Switzerland, request review.
5. Search Console: verify the domain and submit the sitemap.
6. Enable the daily refresh workflow.

## Phase 10: Growth roadmap

- Expand to 150+ programs with category landing pages and "A vs B" comparison pages.
- Move the newsletter to an email platform and add a lead magnet (commission benchmark report).
- Add Stripe Payment Links for featured listings so brands can self-serve.
- Publish one data study per quarter (for example, recurring-commission terms across 100 SaaS programs) to earn links.
- Add translated versions for high-value markets.
