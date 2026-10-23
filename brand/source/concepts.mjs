// Logo concepts for comparison: the chosen arch (A) beside three alternative directions.
// Usage: node concepts.mjs   (writes brand/concepts/*.svg and a comparison board PNG)
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fitGlyph, textPath } from "./glyphs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../concepts");
mkdirSync(outDir, { recursive: true });
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const NAVY = "#0B1F3A", GOLD = "#C9A227", IVORY = "#F7F3E8", WHITE = "#FFFFFF";
const FR_BOLD = "Fraunces_opsz_wght_72_600.ttf", FR_REG = "Fraunces_opsz_wght_72_400.ttf", MAN = "Manrope_wght_800.ttf";
const r = (n) => Math.round(n * 100) / 100;
const R = 'stroke-linecap="round" stroke-linejoin="round"';

// ---- Marks. Each returns { w, h, svg(onDark) } in its own coordinate box. ----
const S = fitGlyph(FR_BOLD, "S", 30, 45.5, 33).d;
const arch = {
  w: 60, h: 72,
  svg: (dark) => `<path d="M4 68V34C4 22.5 16 13.5 30 2C44 13.5 56 22.5 56 34V68Q56 72 52 72H8Q4 72 4 68Z" fill="${dark ? GOLD : NAVY}"/><path d="${S}" fill="${dark ? NAVY : GOLD}"/>`,
};

const rot = (d, deg, fill) => `<path d="${d}" fill="${fill}" transform="rotate(${deg} 32 32)"/>`;
const PETAL = "M32 29.5C25 25.5 23.4 15.5 25.6 10C27.4 5.6 36.6 5.6 38.4 10C40.6 15.5 39 25.5 32 29.5Z";
const LEAF = "M32 29C29.2 25.6 29 20.4 32 16.6C35 20.4 34.8 25.6 32 29Z";
const lotus = {
  w: 64, h: 64, scale: 1.22,
  svg: (dark) =>
    [45, 135, 225, 315].map((a) => rot(LEAF, a, GOLD)).join("") +
    [0, 90, 180, 270].map((a) => rot(PETAL, a, dark ? WHITE : NAVY)).join("") +
    `<circle cx="32" cy="32" r="5.2" fill="${GOLD}" stroke="${dark ? NAVY : WHITE}" stroke-width="2"/>`,
};

const embrace = {
  w: 64, h: 64, scale: 1.25,
  svg: (dark) => {
    const left = dark ? WHITE : NAVY;
    return `<path d="M32 56C20 48 8.5 38.5 8.5 27C8.5 20 13.5 15.5 19.5 15.5C24.5 15.5 28.6 18.6 30.8 22.6" stroke="${left}" stroke-width="6" ${R}/>` +
      `<path d="M32 56C44 48 55.5 38.5 55.5 27C55.5 20 50.5 15.5 44.5 15.5C39.5 15.5 35.4 18.6 33.2 22.6" stroke="${GOLD}" stroke-width="6" ${R}/>` +
      `<circle cx="19.5" cy="5.8" r="4.6" fill="${left}"/><circle cx="44.5" cy="5.8" r="4.6" fill="${GOLD}"/>`;
  },
};

const shield = {
  w: 64, h: 64, scale: 1.28,
  svg: (dark) =>
    `<path d="M32 4.5L53 11V30.5C53 44 44 53.5 32 59.5C20 53.5 11 44 11 30.5V11Z" fill="${dark ? GOLD : NAVY}" stroke="${dark ? GOLD : NAVY}" stroke-width="3" ${R}/>` +
    `<path d="M32 42C25.5 37.2 20.5 33 20.5 27.6C20.5 24.3 23 21.8 26.2 21.8C28.7 21.8 30.6 23.2 32 25.3C33.4 23.2 35.3 21.8 37.8 21.8C41 21.8 43.5 24.3 43.5 27.6C43.5 33 38.5 37.2 32 42Z" fill="${dark ? NAVY : GOLD}"/>` +
    `<path d="M14.5 31.5H23.5L26.5 26L30 37L34 21.5L37.2 31.5H49.5" stroke="${WHITE}" stroke-width="2.6" ${R}/>`,
};

// ---- Wordmarks ----
function serifWord() {
  const a = textPath(FR_BOLD, "Shloka", 0, 0, 100);
  const b = textPath(FR_REG, "Care", a.advance + 24, 0, 100);
  return { paths: [a.d, b.d], x1: a.box.x1, x2: b.box.x2, y1: Math.min(a.box.y1, b.box.y1), y2: Math.max(a.box.y2, b.box.y2) };
}
function sansWord() {
  const a = textPath(MAN, "shloka", 0, 0, 100, { letterSpacing: -0.02 });
  const b = textPath(MAN, "care", a.advance + 22, 0, 100, { letterSpacing: -0.02 });
  // Ink height excludes the descender-free baseline, so use the ascender-to-baseline box.
  return { paths: [a.d, b.d], x1: a.box.x1, x2: b.box.x2, y1: Math.min(a.box.y1, b.box.y1), y2: Math.max(a.box.y2, b.box.y2), accent: 1 };
}

function lockup(mark, word, dark, { scale = mark.scale ?? 1.32, gap = 26 } = {}) {
  const inkH = word.y2 - word.y1;
  const mh = inkH * scale, ms = mh / mark.h, mw = mark.w * ms;
  const top = word.y1 - (mh - inkH) / 2;
  const shift = mw + gap - word.x1;
  const W = mw + gap + (word.x2 - word.x1);
  const textColor = dark ? WHITE : NAVY;
  const words = word.paths.map((d, i) => `<path d="${d}" fill="${dark && word.accent === i ? GOLD : textColor}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${r(top)} ${r(W)} ${r(mh)}" fill="none"><g transform="translate(0 ${r(top)}) scale(${r(ms * 1e4) / 1e4})">${mark.svg(dark)}</g><g transform="translate(${r(shift)} 0)">${words}</g></svg>\n`;
}
const markFile = (mark, dark) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mark.w} ${mark.h}" fill="none">${mark.svg(dark)}</svg>\n`;

const concepts = [
  { id: "a-arch", name: "A · Arch Doorway", story: "A Lucknowi arch holding the S: someone trusted at your door. Heritage and premium.", mark: arch, word: serifWord(), current: true },
  { id: "b-lotus", name: "B · Lotus Plus", story: "A medical cross made of lotus petals: healthcare with an Indian soul.", mark: lotus, word: serifWord() },
  { id: "c-embrace", name: "C · Embrace", story: "Two people whose arms form a heart: companionship and warmth. Modern and friendly.", mark: embrace, word: sansWord() },
  { id: "d-shield", name: "D · Shield Pulse", story: "A shield holding a heart and a heartbeat: safety and health, at a glance.", mark: shield, word: serifWord() },
];

for (const c of concepts) {
  writeFileSync(path.join(outDir, `${c.id}-logo.svg`), lockup(c.mark, c.word, false));
  writeFileSync(path.join(outDir, `${c.id}-logo-on-dark.svg`), lockup(c.mark, c.word, true));
  writeFileSync(path.join(outDir, `${c.id}-mark.svg`), markFile(c.mark, false));
}

// ---- Comparison board ----
const inline = (svg, h) => svg.replace("<svg ", `<svg style="height:${h}px;width:auto;display:block" `);
const tile = (c) => `<div class="tile">${inline(markFile(c.mark, false), 150)}</div>`;
const cols = concepts.map((c) => `
  <section>
    <h2>${c.name}${c.current ? ' <span>Current</span>' : ""}</h2>
    <p>${c.story}</p>
    ${tile(c)}
    <div class="light">${inline(lockup(c.mark, c.word, false), 46)}</div>
    <div class="dark">${inline(lockup(c.mark, c.word, true), 46)}</div>
    <div class="small">${inline(markFile(c.mark, false), 32)}${inline(markFile(c.mark, false), 16)}<div class="app">${inline(markFile(c.mark, true), 40)}</div></div>
  </section>`).join("");
const board = `<!doctype html><meta charset="utf-8"><style>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Manrope:wght@500;700&display=swap");
body{margin:0;background:${IVORY};font-family:Manrope,system-ui;color:#3A4556;padding:48px}
h1{font:500 40px Fraunces,serif;color:${NAVY};margin:0 0 6px}.sub{margin:0 0 36px;font-size:17px}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}svg{max-width:100%}
section{background:#fff;border-radius:22px;padding:24px;border:1px solid #E4DCC8}
h2{font:500 22px Fraunces,serif;color:${NAVY};margin:0 0 6px}h2 span{font:700 11px Manrope;letter-spacing:.08em;text-transform:uppercase;background:${NAVY};color:#fff;padding:4px 8px;border-radius:99px;vertical-align:middle;margin-left:6px;white-space:nowrap}
p{margin:0 0 18px;font-size:14px;line-height:1.5;min-height:42px}
.tile{background:${IVORY};border-radius:16px;height:210px;display:grid;place-items:center}
.light,.dark{border-radius:14px;padding:22px 18px;margin-top:12px;display:flex;justify-content:center}.light{border:1px solid #E4DCC8}.dark{background:${NAVY}}
.small{display:flex;gap:18px;align-items:center;justify-content:center;margin-top:14px}.app{background:${NAVY};border-radius:12px;padding:8px}
</style><h1>Shloka Care · logo directions</h1><p class="sub">Four directions in the Shloka navy and gold. Each is shown as the mark, the logo on light and dark, and at favicon and app-icon size.</p><div class="grid">${cols}</div>`;
const boardHtml = path.join(here, ".png-build", "concepts-board.html");
mkdirSync(path.dirname(boardHtml), { recursive: true });
writeFileSync(boardHtml, board);
const profile = mkdtempSync(path.join(tmpdir(), "brand-render-"));
const res = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1600,900", "--virtual-time-budget=4000", `--screenshot=${path.join(outDir, "logo-concepts.png")}`, `file://${boardHtml}`], { stdio: "ignore", timeout: 60_000 });
rmSync(profile, { recursive: true, force: true });
if (res.status !== 0) throw new Error("Chrome failed rendering the concepts board");
writeFileSync(path.join(outDir, "index.html"), board);
console.log(`Wrote ${concepts.length} concepts and logo-concepts.png to brand/concepts/`);
