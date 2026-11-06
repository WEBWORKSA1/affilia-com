#!/usr/bin/env python3
"""Daily refresh for Affilia.com (standard library only).

- Pulls affiliate-industry headlines from public RSS feeds into data/news.json
  (headline, publisher, date and link only).
- Updates <lastmod> for the homepage and news page in sitemap.xml.

Run locally:  python3 automation/refresh.py
Run daily:    see automation/README.md to enable the GitHub Actions workflow.
"""
import datetime
import html
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEWS = ROOT / "data" / "news.json"
SITEMAP = ROOT / "sitemap.xml"
MAX_ITEMS = 40
FEEDS = [
    ("https://news.google.com/rss/search?q=%22affiliate+marketing%22+when:30d&hl=en-US&gl=US&ceid=US:en", None),
    ("https://news.google.com/rss/search?q=%22affiliate+program%22+OR+%22partner+marketing%22+when:30d&hl=en-US&gl=US&ceid=US:en", None),
    ("https://hellopartner.com/feed/", "Hello Partner"),
]
# Keep headlines AdSense-safe.
BLOCK = re.compile(r"\b(casino|gambling|betting|porn|adult|escort|weapon|cbd|vape|hack|crack)\b", re.I)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "AffiliaNewsBot/1.0 (+https://affilia.com/news/)"})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read()


def parse(raw, default_source):
    items = []
    root = ET.fromstring(raw)
    for it in root.iter("item"):
        title = html.unescape((it.findtext("title") or "").strip())
        link = (it.findtext("link") or "").strip()
        src = it.find("source")
        source = src.text.strip() if src is not None and src.text else (default_source or urllib.parse.urlparse(link).netloc)
        if src is not None and title.endswith(" - " + source):
            title = title[: -(len(source) + 3)]
        try:
            date = parsedate_to_datetime(it.findtext("pubDate") or "").date().isoformat()
        except Exception:
            date = datetime.date.today().isoformat()
        if title and link.startswith("http") and not BLOCK.search(title):
            items.append({"title": title, "source": source, "url": link, "date": date})
    return items


def main():
    old = json.loads(NEWS.read_text(encoding="utf-8")) if NEWS.exists() else {"items": []}
    fresh = []
    for url, source in FEEDS:
        try:
            got = parse(fetch(url), source)
            fresh += got
            print(f"ok   {len(got):3d} items  {url}")
        except Exception as exc:  # one bad feed must not stop the others
            print(f"skip {url}: {exc}", file=sys.stderr)
    if not fresh:
        print("No feed items fetched; keeping existing data.")
        return
    seen, merged = set(), []
    for item in sorted(fresh + old.get("items", []), key=lambda x: x.get("date", ""), reverse=True):
        key = re.sub(r"\W+", "", item["title"].lower())[:80]
        if key in seen:
            continue
        seen.add(key)
        merged.append(item)
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    out = {"updated": now, "note": old.get("note", ""), "items": merged[:MAX_ITEMS]}
    NEWS.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(out['items'])} headlines to {NEWS.relative_to(ROOT)}")

    if SITEMAP.exists():
        today = datetime.date.today().isoformat()
        text = SITEMAP.read_text(encoding="utf-8")
        for loc in ("https://affilia.com/", "https://affilia.com/news/"):
            text = re.sub(r"(<loc>" + re.escape(loc) + r"</loc><lastmod>)[^<]+(</lastmod>)", r"\g<1>" + today + r"\g<2>", text)
        SITEMAP.write_text(text, encoding="utf-8")
        print("updated sitemap lastmod")


if __name__ == "__main__":
    main()
