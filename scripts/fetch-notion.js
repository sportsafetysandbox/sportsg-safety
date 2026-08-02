// Pulls content from Notion databases and writes it into src/_data/*.json
// for Eleventy to consume at build time. Run manually with `npm run sync`,
// or scheduled/dispatched via .github/workflows/sync-and-deploy.yml.
//
// Safe to run without any Notion setup: if NOTION_TOKEN isn't set, or an
// individual database env var/ID is missing, this skips that part of the
// sync rather than failing the build. See docs/notion-setup.md.

import { Client, collectPaginatedAPI } from "@notionhq/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as map from "./lib/notion-map.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "_data");
const IMAGES_DIR = path.join(ROOT, "src", "assets", "images");

const NOTION_TOKEN = process.env.NOTION_TOKEN;

if (!NOTION_TOKEN) {
  console.log("NOTION_TOKEN not set — skipping Notion sync, leaving existing src/_data/*.json as-is.");
  process.exit(0);
}

const notion = new Client({ auth: NOTION_TOKEN });

// One database ID per page, set as repo variables (see docs/notion-setup.md).
const DATABASES = {
  about: process.env.NOTION_DB_ABOUT,
  home: process.env.NOTION_DB_HOME,
  community: process.env.NOTION_DB_COMMUNITY,
  staffPortal: process.env.NOTION_DB_STAFF_PORTAL,
  resources: process.env.NOTION_DB_RESOURCES,
  training: process.env.NOTION_DB_TRAINING,
  news: process.env.NOTION_DB_NEWS,
  faq: process.env.NOTION_DB_FAQ,
};

async function resolveDataSourceId(databaseId) {
  const db = await notion.databases.retrieve({ database_id: databaseId });
  return db.data_sources[0].id;
}

async function queryDatabase(databaseId) {
  const dataSourceId = await resolveDataSourceId(databaseId);
  return collectPaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId,
    page_size: 100,
  });
}

function readExisting(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function isEmpty(data) {
  if (Array.isArray(data)) return data.length === 0;
  if (data && typeof data === "object") {
    return Object.values(data).every((v) => Array.isArray(v) && v.length === 0);
  }
  return !data;
}

function writeJson(name, data) {
  if (isEmpty(data)) {
    const existing = readExisting(name);
    if (existing && !isEmpty(existing)) {
      console.log(`Skipping ${name}.json — Notion returned no rows, keeping existing placeholder content.`);
      return;
    }
  }
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Wrote ${name}.json`);
}

async function downloadImage(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer);
  return `/assets/images/${filename}`;
}

// --- Per-page sync functions -----------------------------------------

async function syncAbout() {
  if (!DATABASES.about) return;
  const pages = await queryDatabase(DATABASES.about);
  const rows = [];
  for (const page of pages) {
    const p = page.properties;
    const row = {
      section: map.getTitle(p.Section),
      type: map.getSelect(p.Type),
      body: map.getRichText(p.Body),
    };
    const link = map.getUrl(p["Document Link"]);
    if (link) row.link = link;

    const imageUrl = map.getFileUrl(p.Image);
    if (imageUrl) {
      const ext = path.extname(new URL(imageUrl).pathname).split("?")[0] || ".png";
      row.image = await downloadImage(imageUrl, `safety-framework${ext}`);
    }
    rows.push(row);
  }
  writeJson("about", rows);
}

async function syncHome() {
  if (!DATABASES.home) return;
  const pages = await queryDatabase(DATABASES.home);
  const hero = { title: "", body: "" };
  const cards = [];
  for (const page of pages) {
    const p = page.properties;
    if (map.getSelect(p.Type) === "Hero") {
      hero.title = map.getTitle(p.Section);
      hero.body = map.getRichText(p.Body);
    } else {
      cards.push({
        type: "Card",
        title: map.getTitle(p.Section),
        body: map.getRichText(p.Body),
        url: map.getUrl(p["Document Link"]) || "#",
      });
    }
  }
  writeJson("home", { hero, cards });
}

async function syncCommunity() {
  if (!DATABASES.community) return;
  const pages = await queryDatabase(DATABASES.community);
  const rows = pages.map((page) => {
    const p = page.properties;
    const title = map.getTitle(p.Section);
    const row = { id: map.slugify(title), title, body: map.getRichText(p.Body) };
    const selfAssessment = map.getRichText(p["Self-Assessment"]);
    if (selfAssessment) row.selfAssessment = selfAssessment;
    const extra = map.getRichText(p.Extra);
    if (extra) row.extra = extra;
    return row;
  });
  writeJson("community", rows);
}

async function syncStaffPortal() {
  if (!DATABASES.staffPortal) return;
  const pages = await queryDatabase(DATABASES.staffPortal);
  const rows = pages.map((page) => ({
    title: map.getTitle(page.properties.Section),
    body: map.getRichText(page.properties.Body),
  }));
  writeJson("staffPortal", rows);
}

async function syncResources() {
  if (!DATABASES.resources) return;
  const pages = await queryDatabase(DATABASES.resources);
  const rows = pages.map((page) => {
    const p = page.properties;
    return {
      title: map.getTitle(p.Section),
      type: map.getSelect(p.Type),
      topic: map.getMultiSelect(p.Topic),
      audience: map.getMultiSelect(p.Audience),
      link: map.getUrl(p["Document Link"]) || "#",
    };
  });
  writeJson("resources", rows);
}

async function syncTraining() {
  if (!DATABASES.training) return;
  const pages = await queryDatabase(DATABASES.training);
  const rows = pages.map((page) => {
    const p = page.properties;
    return {
      title: map.getTitle(p.Section),
      type: map.getSelect(p.Type),
      date: map.getDate(p.Date),
      link: map.getUrl(p["Registration Link"]) || "#",
    };
  });
  writeJson("training", rows);
}

async function syncNews() {
  if (!DATABASES.news) return;
  const pages = await queryDatabase(DATABASES.news);
  const alerts = [];
  const advisories = [];
  for (const page of pages) {
    const p = page.properties;
    const type = map.getSelect(p.Type);
    const item = {
      title: map.getTitle(p.Section),
      link: map.getUrl(p["Document Link"]) || "#",
    };
    if (type === "Alert") {
      item.date = map.getDate(p.Date);
      alerts.push(item);
    } else {
      item.topic = map.getMultiSelect(p.Topic)[0] || "";
      advisories.push(item);
    }
  }
  writeJson("news", { alerts, advisories });
}

async function syncFaq() {
  if (!DATABASES.faq) return;
  const pages = await queryDatabase(DATABASES.faq);
  const rows = pages.map((page) => {
    const p = page.properties;
    return {
      category: map.getSelect(p.Type),
      question: map.getTitle(p.Section),
      answer: map.getRichText(p.Body),
    };
  });
  writeJson("faq", rows);
}

// --- Run ---------------------------------------------------------------

const syncs = [
  ["about", syncAbout],
  ["home", syncHome],
  ["community", syncCommunity],
  ["staffPortal", syncStaffPortal],
  ["resources", syncResources],
  ["training", syncTraining],
  ["news", syncNews],
  ["faq", syncFaq],
];

for (const [name, fn] of syncs) {
  try {
    await fn();
  } catch (err) {
    console.warn(`Skipping ${name} sync — ${err.message}`);
  }
}
