# Affilia.com

Affiliate programs, compared by the numbers. A static website with a program directory, free calculators, a twelve-guide Academy, and lead generation, sponsorship, donation, contest and hiring sections. Built for GitHub Pages on the free plan, with no build step.

The full phase-wise build prompt is in [PROMPT.md](PROMPT.md).

## Go live on GitHub Pages

1. Open **Settings > Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
3. The site appears at `https://webworksa1.github.io/affilia-com/` within a minute or two.

### Point affilia.com at it

1. In **Settings > Pages > Custom domain**, enter `affilia.com` and save (GitHub adds a `CNAME` file).
2. At your DNS provider, create:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` for `www` pointing to `webworksa1.github.io`
3. When the certificate is issued, tick **Enforce HTTPS**.

Canonical URLs, the sitemap and structured data already use `https://affilia.com/`.

## Turn on the forms (one click)

All forms post to FormSubmit and deliver to the owner's inbox, which is stored encoded in `assets/js/config.js` and never appears on any page.

1. Submit any form on the live site once (the contact form is easiest).
2. FormSubmit emails an activation link to the inbox. Click it.
3. Optional: FormSubmit then sends a random alias string. Paste it into `formAlias` in `assets/js/config.js`, so requests no longer carry the inbox address at all.

Until activation, forms show a message offering to send the same details by email.

## Google AdSense

- The AdSense code is in the `<head>` of every content page, `ads.txt` is at the root, and the site meta tag is present. The 404 page deliberately has no ads.
- In AdSense: add `affilia.com`, enable **Auto ads**, and set up a consent message under **Privacy and messaging** for the EEA, UK and Switzerland. Then request review.
- Optional fixed ad units: create display units and paste their slot IDs into `adSlots` in `config.js`. Positions already exist in guides, tools, program pages and the directory.

## Donations

The support page works in pledge mode now (visitors send a pledge; you reply with a payment link). To take instant payments, paste a PayPal hosted-button URL, a Stripe Payment Link, or a Ko-fi or Buy Me a Coffee page into `donate` in `config.js`. Matching buttons appear automatically.

## Self-updating parts

- Industry headlines (`data/news.json`) and sitemap dates refresh daily once the workflow is enabled. See [automation/README.md](automation/README.md).
- The homepage spotlight rotates weekly through the directory, and the footer year updates itself.

## Editing content

| To change | Edit |
|---|---|
| Program terms used by calculators, search and matchmaker | `data/programs.json` |
| A program's page text | `programs/<id>/index.html` |
| Directory table rows | `programs/index.html` |
| Header and footer links | `NAV` and `FOOT` in `assets/js/site.js` |
| Colors, type and layout | `assets/css/style.css` |
| Form inbox alias, donation links, ad slots | `assets/js/config.js` |
| Search index for non-program pages | `data/pages.json` |

When adding a program: add it to `data/programs.json`, copy an existing program folder, add a row to `programs/index.html`, and add the URL to `sitemap.xml`.

## Structure

```
index.html            Home
programs/             Directory and 26 program pages
networks/             Networks and software comparison
tools/                Six interactive tools
academy/              Twelve guides
glossary/ videos/ news/ search/
grow/                 Brand lead-generation funnel
list-your-program/ advertise/ support/ contests/ careers/
about/ contact/ editorial-policy/ privacy/ terms/ cookies/ disclaimer/ affiliate-disclosure/ trademark/
assets/css/style.css  Design system
assets/js/site.js     Layout, forms, directory, search, video, news
assets/js/tools.js    Calculators and generators
assets/js/config.js   Settings
data/                 programs.json, news.json, pages.json
automation/           Daily refresh script and workflow
```

## Trademark

"Affilia" is used as the name of this website as a short form of "affiliation". Affilia.com is independent and not connected with any similarly named organization. See `/trademark/`.
