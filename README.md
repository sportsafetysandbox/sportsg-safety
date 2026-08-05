# SportSG Safety Portal

A static website for Sport Singapore's sport safety programme — providing Codes of Practice, safety policies, news and advisories, training resources, and operational tools for sport organisations, associations, coaches, and event operators in Singapore.

**Live site:** https://sportsafetysandbox.github.io/sportsg-safety/

---

## Overview

The portal serves as the central reference point for sport safety in Singapore. It covers:

- Safety Framework and governance structure
- Safety Vision, Mission, Policies, Commitments, Objectives and Targets
- Codes of Practice (Singapore Standards, WSH Council, SportSG)
- News, Alerts and Advisories (including real-time links to PDF advisories)
- Training resources for coaches, event operators, and sport organisations
- Staff Portal with operational dashboards and internal tools

---

## Tech Stack

| Layer | Choice |
|---|---|
| Static site generator | [Eleventy (11ty) v3](https://www.11ty.dev/) |
| Templating | Nunjucks (.njk) |
| Styling | Vanilla CSS with CSS custom properties |
| Data | JSON files in `src/_data/` |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions (`sync-and-deploy.yml`) |
| Content sync | Notion API (optional) |

---

## Project Structure

```
sportsg-safety/
├── src/
│   ├── _data/              # JSON data files (one per page/section)
│   ├── _includes/
│   │   ├── base.njk        # Base layout
│   │   └── partials/       # Header, footer
│   ├── assets/
│   │   ├── css/main.css    # All styles
│   │   ├── js/main.js      # Nav, modals, filter bar
│   │   ├── docs/           # PDF resources
│   │   └── images/         # Cover images and diagrams
│   ├── about/              # About Sport Safety page
│   ├── news/               # News, Alerts & Advisories
│   ├── resources/          # Safety Resources (filterable cards)
│   ├── safety-framework/   # Safety Framework detail page
│   ├── training/           # Training resources
│   ├── report/             # Incident reporting
│   ├── community/          # Community page
│   ├── faq/                # FAQ & Support
│   ├── staff-portal/       # Staff Portal (internal tools)
│   └── index.njk           # Home page
├── scripts/
│   └── fetch-notion.js     # Notion content sync script
├── .github/workflows/
│   └── sync-and-deploy.yml # Build and deploy to GitHub Pages
├── eleventy.config.js
└── package.json
```

---

## Local Development

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (hot reload at http://localhost:8080/sportsg-safety/)
npm run serve

# Build to _site/
npm run build
```

---

## Deployment

Pushes to `main` trigger the `sync-and-deploy.yml` GitHub Actions workflow, which:

1. Optionally syncs content from Notion (if `NOTION_TOKEN` secret is set)
2. Commits any updated data files back to the repo
3. Builds the site with Eleventy
4. Deploys the `_site/` output to GitHub Pages

The workflow also runs on a weekly schedule (Mondays at 09:00 SGT) to pull the latest Notion content.

### Notion Integration (optional)

Set the following in GitHub repository Settings > Secrets and Variables:

| Name | Type | Description |
|---|---|---|
| `NOTION_TOKEN` | Secret | Notion integration token |
| `NOTION_DB_ABOUT` | Variable | Database ID for About content |
| `NOTION_DB_HOME` | Variable | Database ID for Home content |
| `NOTION_DB_RESOURCES` | Variable | Database ID for Resources |
| `NOTION_DB_NEWS` | Variable | Database ID for News & Alerts |
| `NOTION_DB_STAFF_PORTAL` | Variable | Database ID for Staff Portal |
| `NOTION_DB_TRAINING` | Variable | Database ID for Training |
| `NOTION_DB_COMMUNITY` | Variable | Database ID for Community |
| `NOTION_DB_FAQ` | Variable | Database ID for FAQ |

If `NOTION_TOKEN` is absent, the sync step exits cleanly and the site builds from the existing JSON files in `src/_data/`.

---

## Safety Resources

PDF documents are stored in `src/assets/docs/`. Cover images are extracted from the first page of each PDF using PyMuPDF and stored in `src/assets/images/`. To re-extract covers:

```bash
pip install pymupdf
python scripts/extract-covers.py   # if script exists, or run extraction manually
```

Cover images are cropped to the top half of the first page (below any licence watermark) at 2.5× zoom to ensure readability at card width.

---

## Brand

Colour palette and typography guidelines are in the `brandguide/` folder.

| Token | Value | Use |
|---|---|---|
| `--red-500` | `#F4343D` | Primary accent |
| `--red-600` | `#E60F19` | Hover / active |
| `--red-700` | `#B30F17` | Dark accent |
| `--ink` | `#16212C` | Body text |
| `--surface` | `#FFFFFF` | Page background |
| `--surface-2` | `#F2EFE6` | Section alternates |
| `--border` | `#D8D0B8` | Dividers |

Typography uses the Segoe UI system stack with a Minor Third (1.2) scale.

---

## Maintainer

Sport Singapore — Safety Unit  
Contact: ryhanhusainni@yahoo.com.sg
