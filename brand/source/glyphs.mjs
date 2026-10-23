// Helpers: turn font glyphs into SVG path data, fitted into a target box.
import opentype from "opentype.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const cache = new Map();
export function font(name) {
  if (!cache.has(name)) cache.set(name, opentype.loadSync(path.join(dir, "fonts", name)));
  return cache.get(name);
}

/** Path for `text` at `size`, baseline at (x, y). Returns { d, box, advance }. */
export function textPath(fontName, text, x, y, size, opts = {}) {
  const f = font(fontName);
  const p = f.getPath(text, x, y, size, { kerning: true, letterSpacing: opts.letterSpacing ?? 0 });
  return { d: p.toPathData(2), box: p.getBoundingBox(), advance: f.getAdvanceWidth(text, size, { kerning: true, letterSpacing: opts.letterSpacing ?? 0 }) };
}

/** Glyph scaled so its ink box has height `h`, centred on (cx, cy). */
export function fitGlyph(fontName, text, cx, cy, h) {
  const probe = textPath(fontName, text, 0, 0, 100);
  const inkH = probe.box.y2 - probe.box.y1;
  const size = (100 * h) / inkH;
  const p = textPath(fontName, text, 0, 0, size);
  const dx = cx - (p.box.x1 + p.box.x2) / 2;
  const dy = cy - (p.box.y1 + p.box.y2) / 2;
  return textPath(fontName, text, dx, dy, size);
}
