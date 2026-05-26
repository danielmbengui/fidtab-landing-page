/**
 * Affiche une taille de fichier à partir d’un nombre d’octets (1024 par palier).
 * @param {unknown} bytes
 * @returns {string} ex. "0 B", "12 KB", "2.4 MB", "1.02 GB"
 */
export function formatFileSizeFromBytes(bytes) {
  const n = typeof bytes === "number" ? bytes : Number(bytes);
  if (!Number.isFinite(n) || n < 0) return "0 B";
  if (n === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }

  const decimals = i === 0 ? 0 : v < 10 ? 1 : v < 100 ? 1 : 0;
  const rounded = v.toFixed(decimals).replace(/\.0+$/, "");
  return `${rounded} ${units[i]}`;
}

const MIME_TO_LABEL = Object.freeze({
  "application/pdf": "pdf",
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
  "text/csv": "csv",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
});

/**
 * Libellé court du format (pdf, jpeg, etc.) à partir d’un MIME ou d’une extension.
 * @param {unknown} fileType — ex. "application/pdf", ".pdf", "pdf"
 * @returns {string}
 */
export function getFileFormatLabel(fileType) {
  if (fileType == null) return "—";
  const raw = String(fileType).trim();
  if (!raw) return "—";

  const lower = raw.toLowerCase();
  if (MIME_TO_LABEL[lower]) return MIME_TO_LABEL[lower];

  if (lower.includes("/")) {
    const sub = lower.split("/").pop() || "";
    const base = sub.split("+")[0].split(";")[0].trim();
    if (base === "jpeg" || base === "jpg") return "jpeg";
    if (base && /^[a-z0-9]+$/.test(base)) return base.slice(0, 12);
    return "fichier";
  }

  return lower.replace(/^\./, "").slice(0, 12) || "—";
}

/**
 * Mode d’aperçu in-app (lightbox image, PDF ou Word via visionneuse).
 * @param {string} [url]
 * @param {string} [fileType] — MIME Firestore ex. `application/pdf`
 * @returns {"image"|"pdf"|"office"|"unknown"}
 */
export function getDocumentPreviewMode(url, fileType) {
  const mime = typeof fileType === "string" ? fileType.toLowerCase().split(";")[0].trim() : "";
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  if (
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "office";
  }

  const u = typeof url === "string" ? url.trim() : "";
  if (!u) return "unknown";

  const testPath = (path) => {
    if (/\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(path)) return "image";
    if (/\.pdf$/i.test(path)) return "pdf";
    if (/\.(doc|docx)$/i.test(path)) return "office";
    return null;
  };

  try {
    const path = new URL(u).pathname;
    const fromPath = testPath(path);
    if (fromPath) return fromPath;
  } catch {
    /* URL relative ou invalide — heuristique sur la chaîne */
  }

  if (/\.(jpe?g|png|gif|webp|bmp|svg)(\?|#|&|$)/i.test(u)) return "image";
  if (/\.pdf(\?|#|&|$)/i.test(u)) return "pdf";
  if (/\.(doc|docx)(\?|#|&|$)/i.test(u)) return "office";

  return "unknown";
}
