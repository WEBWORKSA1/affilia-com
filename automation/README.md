# Automation

`refresh.py` keeps the site current without any server:

- **Industry headlines**: pulls affiliate and partnership news from public RSS feeds into `data/news.json`. The homepage and `/news/` read that file in the browser, so new headlines appear without rebuilding pages.
- **Sitemap freshness**: updates `<lastmod>` for the homepage and news page in `sitemap.xml`.

Other parts of the site update themselves in the browser: the homepage "spotlight" rotates weekly through the directory, and the footer year advances automatically.

## Enable the daily run (one minute)

The GitHub connector used to build this site cannot write workflow files, so the schedule needs one manual step:

1. On GitHub, open the repository and choose **Add file > Create new file**.
2. Name it `.github/workflows/refresh-news.yml`.
3. Paste the contents of `automation/refresh-news.yml` and commit to `main`.
4. Open the **Actions** tab and run **Refresh news and sitemap** once with **Run workflow** to test it.

It then runs every day at 05:23 UTC. Free for public repositories.

## Run it locally

```
python3 automation/refresh.py
```
