// Shared helpers for flattening Notion property values into plain JSON.

export function getTitle(prop) {
  if (!prop || !prop.title) return "";
  return prop.title.map((t) => t.plain_text).join("");
}

export function getRichText(prop) {
  if (!prop || !prop.rich_text) return "";
  return prop.rich_text.map((t) => t.plain_text).join("");
}

export function getSelect(prop) {
  return prop && prop.select ? prop.select.name : null;
}

export function getMultiSelect(prop) {
  if (!prop || !prop.multi_select) return [];
  return prop.multi_select.map((s) => s.name);
}

export function getDate(prop) {
  return prop && prop.date ? prop.date.start : null;
}

export function getUrl(prop) {
  return prop && prop.url ? prop.url : null;
}

// Notion file/image property URLs are temporary (expire ~1 hour) — the
// caller is responsible for downloading the file during the sync run
// rather than storing this URL directly.
export function getFileUrl(prop) {
  if (!prop || !prop.files || !prop.files.length) return null;
  const file = prop.files[0];
  if (file.type === "file") return file.file.url;
  if (file.type === "external") return file.external.url;
  return null;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
