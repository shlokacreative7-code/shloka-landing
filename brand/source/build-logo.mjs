// Builds the logo set: SVGs and PNGs in brand/, the site's path module and the app icons.
// Usage: node build-logo.mjs ["Brand Name"]   (default "Shloka Care"; the first word is set heavier)
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fitGlyph, textPath } from "./glyphs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(here, "../..");
const brandDir = path.join(projectDir, "brand");
const pngDir = path.join(here, ".png-build");
mkdirSync(pngDir, { recursive: true });

const NAME = process.argv[2] ?? "Shloka Care";
const [FIRST, ...REST] = NAME.split(" ");
const SLUG = NAME.toLowerCase().replace(/\s+/g, "-");
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const NAVY = "#0B1F3A", GOLD = "#C9A227", WHITE = "#FFFFFF";
const BOLD = "Fraunces_opsz_wght_72_600.ttf", REG = "Fraunces_opsz_wght_72_400.ttf";
const r = (n) => Math.round(n * 100) / 100;

// ---- Mark: Lucknowi pointed arch (60 x 72) with a Fraunces S ----
const ARCH = "M4 68V34C4 22.5 16 13.5 30 2C44 13.5 56 22.5 56 34V68Q56 72 52 72H8Q4 72 4 68Z";
const INSET = "M9.5 72V35C9.5 25.5 19.5 17.5 30 8.6C40.5 17.5 50.5 25.5 50.5 35V72";
const S = fitGlyph(BOLD, FIRST[0], 30, 45.5, 33).d;
const S_COMPACT = fitGlyph(BOLD, FIRST[0], 30, 45.5, 37).d; // bigger S for favicons

const markInner = ({ arch, s, inset, sPath = S }) =>
  `<path d="${ARCH}" fill="${arch}"/>` +
  (inset ? `<path d="${INSET}" fill="none" stroke="${inset}" stroke-width="1.3"/>` : "") +
  `<path d="${sPath}" fill="${s}"/>`;

// ---- Wordmark: first word semibold, the rest regular, baseline at y=0, size 100 ----
const shloka = textPath(BOLD, FIRST, 0, 0, 100);
const care = textPath(REG, REST.join(" "), shloka.advance + 24, 0, 100);
const wx1 = shloka.box.x1, wx2 = care.box.x2;
const wy1 = Math.min(shloka.box.y1, care.box.y1), wy2 = Math.max(shloka.box.y2, care.box.y2);
const inkH = wy2 - wy1;

// ---- Horizontal lockup geometry ----
const markH = inkH * 1.32, markScale = markH / 72, markW = 60 * markScale, gap = 24;
const markTop = wy1 - (markH - inkH) / 2;
const wordShift = markW + gap - wx1;
const lockW = markW + gap + (wx2 - wx1);
const lockViewBox = `0 ${r(markTop)} ${r(lockW)} ${r(markH)}`;
const markTransform = `translate(0 ${r(markTop)}) scale(${r(markScale * 10000) / 10000})`;
const wordTransform = `translate(${r(wordShift)} 0)`;

const lockup = ({ arch, s, text }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${lockViewBox}" role="img" aria-label="${NAME}">` +
  `<g transform="${markTransform}">${markInner({ arch, s })}</g>` +
  `<g transform="${wordTransform}" fill="${text}"><path d="${shloka.d}"/><path d="${care.d}"/></g></svg>\n`;

// ---- Stacked lockup: mark centred above the wordmark ----
const stackMarkH = inkH * 2.1, stackScale = stackMarkH / 72, stackMarkW = 60 * stackScale;
const wordW = wx2 - wx1, stackW = Math.max(wordW, stackMarkW);
const stackGap = inkH * 0.42;
const stackWordTop = stackMarkH + stackGap; // wordmark ink top
const stacked = ({ arch, s, text }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(stackW)} ${r(stackWordTop + inkH)}" role="img" aria-label="${NAME}">` +
  `<g transform="translate(${r((stackW - stackMarkW) / 2)} 0) scale(${r(stackScale * 10000) / 10000})">${markInner({ arch, s })}</g>` +
  `<g transform="translate(${r((stackW - wordW) / 2 - wx1)} ${r(stackWordTop - wy1)})" fill="${text}"><path d="${shloka.d}"/><path d="${care.d}"/></g></svg>\n`;

const markSvg = (opts) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 72" role="img" aria-label="${NAME}">${markInner(opts)}</svg>\n`;

// Square icons: favicon (transparent) and app/social icons (navy tile).
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 0 72 72">${markInner({ arch: NAVY, s: GOLD, sPath: S_COMPACT })}</svg>\n`;
const tile = (size, markFrac, inset) => {
  const h = 72 * markFrac / 1, scale = (100 * markFrac) / 72;
  const x = (100 - 60 * scale) / 2, y = (100 - 72 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}"><rect width="100" height="100" fill="${NAVY}"/>` +
    `<g transform="translate(${r(x)} ${r(y)}) scale(${r(scale * 10000) / 10000})">${markInner({ arch: GOLD, s: NAVY, inset: inset ? NAVY : null })}</g></svg>\n`;
};

const files = {
  [`${SLUG}-logo.svg`]: lockup({ arch: NAVY, s: GOLD, text: NAVY }),
  [`${SLUG}-logo-on-dark.svg`]: lockup({ arch: GOLD, s: NAVY, text: WHITE }),
  [`${SLUG}-logo-stacked.svg`]: stacked({ arch: NAVY, s: GOLD, text: NAVY }),
  [`${SLUG}-logo-stacked-on-dark.svg`]: stacked({ arch: GOLD, s: NAVY, text: WHITE }),
  [`${SLUG}-mark.svg`]: markSvg({ arch: NAVY, s: GOLD, inset: GOLD }),
  [`${SLUG}-mark-on-dark.svg`]: markSvg({ arch: GOLD, s: NAVY, inset: NAVY }),
  [`${SLUG}-profile.svg`]: tile(1024, 0.62, true),
};
for (const [name, svg] of Object.entries(files)) writeFileSync(path.join(brandDir, name), svg);
writeFileSync(path.join(projectDir, "src/app/icon.svg"), favicon);

// Site module: raw path data so the header/footer logo is inline, crisp vector art.
writeFileSync(
  path.join(projectDir, "src/components/ui/logo-art.ts"),
  `// Generated by brand/source/build-logo.mjs (Fraunces opsz 72 outlines). Regenerate rather than editing by hand.

export const markViewBox = "0 0 60 72";
export const archPath = "${ARCH}";
export const insetPath = "${INSET}";
export const sPath = "${S}";

export const lockupViewBox = "${lockViewBox}";
export const lockupMarkTransform = "${markTransform}";
export const lockupWordTransform = "${wordTransform}";
export const wordPaths = ["${shloka.d}", "${care.d}"];

// The wordmark alone, for the footer's giant version.
export const wordViewBox = "${r(wx1)} ${r(wy1)} ${r(wx2 - wx1)} ${r(wy2 - wy1)}";
`,
);

// PNG wrappers (rendered by Chrome afterwards): [file, width, height, svg, background]
const pngs = [
  [`${SLUG}-logo.png`, 2400, Math.round((2400 * markH) / lockW), files[`${SLUG}-logo.svg`]],
  [`${SLUG}-logo-on-dark.png`, 2400, Math.round((2400 * markH) / lockW), files[`${SLUG}-logo-on-dark.svg`]],
  [`${SLUG}-logo-stacked.png`, 1600, Math.round((1600 * (stackWordTop + inkH)) / stackW), files[`${SLUG}-logo-stacked.svg`]],
  [`${SLUG}-mark.png`, 1000, 1200, files[`${SLUG}-mark.svg`]],
  [`${SLUG}-profile.png`, 1024, 1024, files[`${SLUG}-profile.svg`]],
  ["apple-icon.png", 180, 180, tile(180, 0.66, false)],
];
const manifest = pngs.map(([name, w, h, svg]) => {
  const html = path.join(pngDir, name.replace(".png", ".html"));
  writeFileSync(html, `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${w}px;height:${h}px}</style>${svg}`);
  return { name, w, h, html };
});

// Render each PNG with headless Chrome (transparent background), then copy it into place.
// Headless Chrome occasionally hangs on exit, so each render gets a fresh profile, a timeout and retries.
function render(out, w, h, html) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const profile = mkdtempSync(path.join(tmpdir(), "brand-render-"));
    const result = spawnSync(
      CHROME,
      ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000", `--user-data-dir=${profile}`, `--window-size=${w},${h}`, `--screenshot=${out}`, `file://${html}`],
      { stdio: "ignore", timeout: 30_000 },
    );
    rmSync(profile, { recursive: true, force: true });
    if (result.status === 0) return;
  }
  throw new Error(`Chrome failed rendering ${path.basename(out)}. Set CHROME to your Chrome binary.`);
}

for (const { name, w, h, html } of manifest) {
  const out = path.join(pngDir, name);
  render(out, w, h, html);
  copyFileSync(out, name === "apple-icon.png" ? path.join(projectDir, "src/app/apple-icon.png") : path.join(brandDir, name));
}
console.log(`Built the ${NAME} logo set: ${[...Object.keys(files), ...manifest.map((m) => m.name)].join(", ")}`);
