# Notion setup

This connects the 8 page databases to `scripts/fetch-notion.js`, which the `sync-and-deploy` workflow runs weekly (and on demand) to refresh `src/_data/*.json`. Until you do this, the site keeps building from the hand-written placeholder JSON already in the repo — nothing breaks by skipping this for now.

## 1. Create a Notion integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) → **New integration**.
2. Name it (e.g. "SportSG Safety Site Sync"), associate it with the right workspace.
3. Under **Capabilities**, only **Read content** is needed.
4. Copy the generated **Internal Integration Secret** — this is `NOTION_TOKEN`.

## 2. Create the 8 databases

Property names must match exactly (case and spacing) — the sync script reads them by name. `Section` is always the database's title property.

| Database | Properties |
|---|---|
| **About Sport Safety** | `Section` (title) · `Type` (select: Framework / Policy / Narrative) · `Body` (text) · `Document Link` (url) · `Image` (files & media) |
| **Home** | `Section` (title) · `Type` (select: Hero / Card) · `Body` (text) · `Document Link` (url) |
| **Community Portal** | `Section` (title) · `Body` (text) · `Self-Assessment` (text, optional) · `Extra` (text, optional) |
| **Staff Portal** | `Section` (title) · `Body` (text) |
| **Safety Resources** | `Section` (title) · `Type` (select: Codes of Practice / Standards / Checklists / Toolkits & Templates) · `Topic` (multi-select) · `Audience` (multi-select) · `Document Link` (url) |
| **Training & Certification** | `Section` (title) · `Type` (select: SSO Course / First Aid / CPR / AED / Workshop) · `Date` (date) · `Registration Link` (url) |
| **News & Advisories** | `Section` (title) · `Type` (select: Alert / Advisory) · `Date` (date, Alerts only) · `Topic` (multi-select, Advisories) · `Document Link` (url) |
| **FAQ** | `Section` (title, used as the question) · `Type` (select: General / Coaches & Instructors / Partners / Event Operators, used as category) · `Body` (text, used as the answer) |

You don't need all 8 at once — the sync script skips any database whose ID isn't configured (step 4), so you can wire these up one page at a time.

## 3. Share each database with the integration

For each database: **···** menu → **Connections** → add the integration you created in step 1. Without this, the API call returns a 404 as if the database doesn't exist.

## 4. Add the token and database IDs to GitHub

Repo → **Settings** → **Secrets and variables** → **Actions**.

**Secrets** tab — add one:
- `NOTION_TOKEN` — the integration secret from step 1.

**Variables** tab — add one per database you've set up (the database ID is the 32-character string in its URL, right after the workspace name and before any `?v=`):

| Variable | Database |
|---|---|
| `NOTION_DB_ABOUT` | About Sport Safety |
| `NOTION_DB_HOME` | Home |
| `NOTION_DB_COMMUNITY` | Community Portal |
| `NOTION_DB_STAFF_PORTAL` | Staff Portal |
| `NOTION_DB_RESOURCES` | Safety Resources |
| `NOTION_DB_TRAINING` | Training & Certification |
| `NOTION_DB_NEWS` | News & Advisories |
| `NOTION_DB_FAQ` | FAQ |

## 5. Run it

Once `NOTION_TOKEN` is set, the next push to `main`, the next weekly run, or a manual trigger will pull real content in:

```bash
gh workflow run sync-and-deploy.yml
```

Or from the GitHub UI: **Actions** → **Sync content and deploy** → **Run workflow**.

Check the run log — each database logs either `Wrote <name>.json` or a skip reason (missing ID, empty result, or an error), so it's easy to see which of the 8 are actually wired up.
