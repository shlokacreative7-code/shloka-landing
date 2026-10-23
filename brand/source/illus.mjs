// Original Shloka Care illustrations: brand palette, navy outlines, every scene framed by the logo's arch.
// Usage: node illus.mjs   (writes to public/illustrations/)
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public/illustrations");
mkdirSync(outDir, { recursive: true });

const NAVY = "#0B1F3A", GOLD = "#C9A227", IVORY = "#F7F3E8", WHITE = "#FFFFFF", SLATE = "#3A4556", LINE = "#E4DCC8";
const SW = 2.5;
const R = 'stroke-linecap="round" stroke-linejoin="round"';
const OUT = `stroke="${NAVY}" stroke-width="${SW}" ${R}`;

// Same proportions as the logo's arch.
function arch(x1, x2, top, spring, bottom) {
  const w = x2 - x1, cx = (x1 + x2) / 2, h = spring - top;
  return `M${x1} ${bottom}V${spring}C${x1} ${spring - h * 0.36} ${x1 + w * 0.23} ${spring - h * 0.64} ${cx} ${top}C${x2 - w * 0.23} ${spring - h * 0.64} ${x2} ${spring - h * 0.36} ${x2} ${spring}V${bottom}Z`;
}
const backdrop = () => `<path d="${arch(44, 276, 8, 92, 214)}" fill="${IVORY}"/>`;
const ground = (x1 = 22, x2 = 298) => `<path d="M${x1} 214H${x2}" stroke="${NAVY}" stroke-width="${SW}" ${R}/>`;
const shadow = (cx, w) => `<ellipse cx="${cx}" cy="215" rx="${w}" ry="4" fill="${LINE}"/>`;

// People: faceless line-art figures. Limbs are a navy underlay with a coloured core, so they read as outlined.
const limb = (d, color, w = 8) =>
  `<path d="${d}" fill="none" stroke="${NAVY}" stroke-width="${w + SW * 2}" ${R}/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ${R}/>`;
const head = (cx, cy, r = 10) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${WHITE}" ${OUT}/>`;
const torso = (x, y, wTop, h, wBot, color, lean = 0) => {
  const l = x - wTop / 2, rt = x + wTop / 2, bx = x + lean;
  return `<path d="M${l} ${y + 8}Q${l} ${y} ${l + 8} ${y}H${rt - 8}Q${rt} ${y} ${rt} ${y + 8}L${bx + wBot / 2} ${y + h}H${bx - wBot / 2}Z" fill="${color}" ${OUT}/>`;
};
const shoe = (x, y, dir = 1) => `<path d="M${x - 4 * dir} ${y}h${11 * dir}" stroke="${NAVY}" stroke-width="6" ${R}/>`;
// Companion: navy kurta, gold ID badge, hair tied back.
const companionHair = (cx, cy, facing = 1) =>
  `<path d="M${cx - 10 * facing} ${cy + 1}A10 10 0 0 1 ${cx + 7 * facing} ${cy - 7}Q${cx} ${cy - 3} ${cx - 10 * facing} ${cy + 1}Z" fill="${NAVY}" ${OUT}/>` +
  `<circle cx="${cx - 11 * facing}" cy="${cy - 2}" r="4.5" fill="${NAVY}"/>`;
const badge = (x, y) => `<rect x="${x}" y="${y}" width="8" height="10" rx="1.5" fill="${GOLD}" stroke="${NAVY}" stroke-width="1.5"/>`;
// Elder: grey hair.
const elderHair = (cx, cy, facing = 1) =>
  `<path d="M${cx - 10 * facing} ${cy + 2}A10 10 0 0 1 ${cx + 6 * facing} ${cy - 8}Q${cx - 2 * facing} ${cy - 4} ${cx - 10 * facing} ${cy + 2}Z" fill="${SLATE}" ${OUT}/>`;

const svg = (body, vb = "0 0 320 230") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none">${body}</svg>\n`;

// ---------- Hospital Assist ----------
const hospital = svg(
  backdrop() +
  // Hospital building
  `<rect x="168" y="80" width="94" height="134" fill="${WHITE}" ${OUT}/>` +
  `<rect x="162" y="72" width="106" height="12" rx="2" fill="${NAVY}" ${OUT}/>` +
  `<path d="M215 72V62" stroke="${NAVY}" stroke-width="${SW}"/>` +
  `<circle cx="215" cy="50" r="13" fill="${GOLD}" ${OUT}/>` +
  `<path d="M215 43v14M208 50h14" stroke="${WHITE}" stroke-width="4" ${R}/>` +
  [0, 1, 2].flatMap((c) => [0, 1, 2].map((r) => `<rect x="${179 + c * 27}" y="${96 + r * 26}" width="18" height="14" rx="2" fill="${IVORY}" stroke="${NAVY}" stroke-width="2"/>`)).join("") +
  `<path d="M200 214v-30a6 6 0 0 1 6-6h18a6 6 0 0 1 6 6v30" fill="${IVORY}" ${OUT}/><path d="M215 178v36" stroke="${NAVY}" stroke-width="2"/>` +
  shadow(125, 70) +
  // Companion pushing the wheelchair
  limb("M82 156L78 211", SLATE, 9) + limb("M92 156L96 211", SLATE, 9) + shoe(80, 212) + shoe(98, 212) +
  torso(87, 104, 26, 54, 28, NAVY) + badge(91, 116) +
  head(86, 90) + companionHair(86, 90) +
  // Wheelchair frame behind the patient
  `<path d="M108 132L114 168H158" stroke="${NAVY}" stroke-width="4" ${R}/><path d="M98 131H108" stroke="${NAVY}" stroke-width="4" ${R}/>` +
  `<path d="M154 168L162 204H174" stroke="${NAVY}" stroke-width="3.5" ${R}/>` +
  limb("M95 112Q101 124 99 131", WHITE, 7) +
  // Patient, seated
  limb("M130 162H156", WHITE, 11) + limb("M156 162L160 199", WHITE, 9) + shoe(162, 202) +
  torso(127, 126, 24, 40, 26, GOLD) +
  `<path d="M116 168H150" stroke="${NAVY}" stroke-width="4" ${R}/>` +
  limb("M122 134Q126 152 142 156", WHITE, 7) +
  head(128, 112) + elderHair(128, 112) +
  // Wheels in front
  `<circle cx="130" cy="190" r="24" fill="${WHITE}" fill-opacity=".85" stroke="${NAVY}" stroke-width="3.5"/><circle cx="130" cy="190" r="17" stroke="${NAVY}" stroke-width="1.5"/><circle cx="130" cy="190" r="3.5" fill="${NAVY}"/>` +
  `<circle cx="168" cy="208" r="6" fill="${WHITE}" ${OUT}/>` +
  ground(),
);

// ---------- Shared pieces ----------
// Companion (left, mid-stride) walking arm in arm with a slightly stooped elder who uses a stick. Feet on y=212.
const walkingPair =
  limb("M126 152L118 211", SLATE, 9) + limb("M136 152L144 211", SLATE, 9) + shoe(120, 212) + shoe(146, 212) +
  limb("M124 108Q114 128 118 146", WHITE, 7) +
  torso(131, 100, 26, 54, 28, NAVY) + badge(135, 112) +
  head(131, 86) + companionHair(131, 86) +
  limb("M172 156L166 211", WHITE, 10) + limb("M182 156L190 211", WHITE, 10) + shoe(168, 212) + shoe(192, 212) +
  torso(176, 108, 26, 50, 28, GOLD, -2) +
  `<path d="M198 152L204 212" stroke="${NAVY}" stroke-width="4" ${R}/><path d="M192 152Q196 145 202 150" stroke="${NAVY}" stroke-width="4" ${R}/>` +
  limb("M186 116Q195 132 196 150", WHITE, 7) +
  head(183, 95) + elderHair(183, 95) +
  limb("M139 108Q152 124 170 122", WHITE, 7);

// Flowering tree with its trunk base at (240, 214).
const tree =
  `<path d="M240 214V150" stroke="${NAVY}" stroke-width="7" ${R}/><path d="M240 176l-12-12M240 166l11-10" stroke="${NAVY}" stroke-width="3" ${R}/>` +
  `<path d="M212 140a20 20 0 0 1 8-30a24 24 0 0 1 42 2a20 20 0 0 1 4 30a18 18 0 0 1-26 8a18 18 0 0 1-28-10Z" fill="${WHITE}" ${OUT}/>` +
  [[226, 118], [250, 112], [238, 134], [258, 136], [222, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${GOLD}"/>`).join("");

const heart = (cx, cy, s = 1) =>
  `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 9C-6 4.8-10 1.4-10-3.2A5 5 0 0 1 0-5.6A5 5 0 0 1 10-3.2C10 1.4 6 4.8 0 9Z" fill="${GOLD}" ${OUT}/>`;
const cloud = (x, y) => `<path d="M${x} ${y}h34a8 8 0 0 0-6-13a11 11 0 0 0-20-3a8 8 0 0 0-8 16Z" fill="${WHITE}" stroke="${NAVY}" stroke-width="2" ${R}/>`;

// ---------- Elderly Care ----------
const elderly = svg(
  backdrop() +
  `<circle cx="100" cy="66" r="15" fill="${GOLD}"/><circle cx="100" cy="66" r="22" stroke="${GOLD}" stroke-width="1.5" stroke-dasharray="2 5" ${R}/>` +
  tree +
  shadow(152, 62) +
  walkingPair +
  ground(),
);

// ---------- Personal Assist ----------
const errands = svg(
  backdrop() +
  // Bank
  `<path d="M158 98L213 68L268 98Z" fill="${WHITE}" ${OUT}/><circle cx="213" cy="86" r="7" fill="${GOLD}" stroke="${NAVY}" stroke-width="2"/>` +
  `<rect x="162" y="98" width="102" height="10" fill="${NAVY}" ${OUT}/>` +
  [172, 196, 220, 244].map((x) => `<rect x="${x}" y="108" width="10" height="82" fill="${WHITE}" stroke="${NAVY}" stroke-width="2"/>`).join("") +
  `<rect x="158" y="190" width="110" height="10" fill="${WHITE}" ${OUT}/><rect x="150" y="200" width="126" height="14" fill="${WHITE}" ${OUT}/>` +
  // Checklist card, floating over the frame
  `<g transform="translate(-20 -8) rotate(-6 92 70)"><rect x="58" y="34" width="66" height="78" rx="8" fill="${WHITE}" ${OUT}/>` +
  [52, 72, 92].map((y, i) => `<circle cx="74" cy="${y}" r="6" fill="${i < 2 ? GOLD : WHITE}" stroke="${NAVY}" stroke-width="2"/>` + (i < 2 ? `<path d="M71 ${y}l2 2 4-4" stroke="${NAVY}" stroke-width="1.8" ${R}/>` : "") + `<path d="M86 ${y}h${i === 1 ? 22 : 28}" stroke="${NAVY}" stroke-width="2.5" ${R}/>`).join("") +
  `</g>` +
  shadow(118, 40) +
  // Companion walking towards the bank with a folder of papers
  limb("M112 158L104 211", SLATE, 9) + limb("M122 158L132 211", SLATE, 9) + shoe(106, 212) + shoe(134, 212) +
  limb("M110 114Q100 134 104 150", WHITE, 7) +
  torso(117, 106, 26, 54, 28, NAVY) + badge(121, 118) +
  `<rect x="124" y="122" width="26" height="32" rx="3" transform="rotate(8 137 138)" fill="${GOLD}" ${OUT}/><path d="M131 132h12M131 139h12M131 146h8" transform="rotate(8 137 138)" stroke="${NAVY}" stroke-width="2" ${R}/>` +
  limb("M125 114Q134 128 132 140", WHITE, 7) +
  head(117, 92) + companionHair(117, 92) +
  ground(),
);

// ---------- Hero: a companion walking an elder home from the hospital ----------
const heroBackdrop = `<path d="${arch(16, 304, 6, 150, 372)}" fill="${IVORY}"/>`;
const heroScene = svg(
  heroBackdrop +
  `<circle cx="238" cy="96" r="17" fill="${GOLD}"/><circle cx="238" cy="96" r="25" stroke="${GOLD}" stroke-width="1.5" stroke-dasharray="2 5" ${R}/>` +
  cloud(118, 74) + cloud(58, 126) +
  `<path d="M168 52q5-5 10 0q5-5 10 0M196 40q4-4 8 0q4-4 8 0" stroke="${NAVY}" stroke-width="2" ${R}/>` +
  // Hospital
  `<rect x="40" y="172" width="98" height="200" fill="${WHITE}" ${OUT}/>` +
  `<rect x="34" y="162" width="110" height="13" rx="2" fill="${NAVY}" ${OUT}/>` +
  `<path d="M89 162V152" stroke="${NAVY}" stroke-width="${SW}"/><circle cx="89" cy="138" r="14" fill="${GOLD}" ${OUT}/>` +
  `<path d="M89 130v16M81 138h16" stroke="${WHITE}" stroke-width="4.5" ${R}/>` +
  [0, 1, 2].flatMap((c) => [0, 1, 2, 3].map((r) => `<rect x="${51 + c * 27}" y="${188 + r * 30}" width="18" height="16" rx="2" fill="${IVORY}" stroke="${NAVY}" stroke-width="2"/>`)).join("") +
  `<path d="M74 372v-30a6 6 0 0 1 6-6h18a6 6 0 0 1 6 6v30" fill="${IVORY}" ${OUT}/><path d="M89 336v36" stroke="${NAVY}" stroke-width="2"/>` +
  `<g transform="translate(36 160)">${tree}</g>` +
  shadow(212, 72).replace('cy="215"', 'cy="375"') +
  `<g transform="translate(40 160)">${walkingPair}</g>` +
  heart(198, 214, 1.35) +
  `<path d="M176 200l3 3M222 198l-3 3M199 190v-4" stroke="${GOLD}" stroke-width="2.5" ${R}/>` +
  `<path d="M6 374H314" stroke="${NAVY}" stroke-width="${SW}" ${R}/>`,
  "0 0 320 380",
);

// ---------- Lucknow skyline (line art for dark backgrounds) ----------
const sk = (d, extra = "") => `<path d="${d}" ${extra}/>`;
const pointedArch = (x1, x2, spring, top, bottom) => {
  const w = x2 - x1, cx = (x1 + x2) / 2, h = spring - top;
  return `M${x1} ${bottom}V${spring}C${x1} ${spring - h * 0.5} ${x1 + w * 0.25} ${spring - h * 0.8} ${cx} ${top}C${x2 - w * 0.25} ${spring - h * 0.8} ${x2} ${spring - h * 0.5} ${x2} ${spring}V${bottom}`;
};
const chhatri = (cx, base, w = 16) =>
  `M${cx - w / 2} ${base}V${base - w * 0.5}M${cx + w / 2} ${base}V${base - w * 0.5}M${cx - w / 2 - 2} ${base - w * 0.5}H${cx + w / 2 + 2}` +
  `M${cx - w / 2} ${base - w * 0.5}Q${cx - w / 2} ${base - w * 1.2} ${cx} ${base - w * 1.35}Q${cx + w / 2} ${base - w * 1.2} ${cx + w / 2} ${base - w * 0.5}M${cx} ${base - w * 1.35}V${base - w * 1.65}`;
const minaret = (cx, top, base, w = 10) =>
  `M${cx - w / 2} ${base}V${top}M${cx + w / 2} ${base}V${top}M${cx - w / 2 - 2} ${top}H${cx + w / 2 + 2}M${cx - w / 2 - 2} ${(top + base) / 2}H${cx + w / 2 + 2}` + chhatri(cx, top, w);
const bush = (cx, r) => `M${cx} 158V${158 - r}M${cx - r} ${158 - r * 0.9}a${r} ${r} 0 1 1 ${r * 2} 0a${r} ${r * 0.9} 0 0 1-${r * 2} 0Z`;
const skyline = svg(
  `<g stroke="${GOLD}" stroke-width="1.6" ${R}>` +
  sk("M0 158H1200") +
  // Bara Imambara: long arcaded hall, central dome, minarets
  sk("M210 158V112H430V158") + sk("M204 112H436") +
  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => sk(pointedArch(222 + i * 23.5, 236 + i * 23.5, 140, 128, 158))).join("") +
  sk("M290 112V98H350V112") + sk("M290 98Q290 70 320 62Q350 70 350 98") + sk("M320 62V50") +
  sk(minaret(214, 92, 112)) + sk(minaret(426, 92, 112)) +
  // Rumi Darwaza: tall gateway with a great pointed arch and a crowning pavilion
  sk("M520 158V66H680V158") + sk(pointedArch(560, 640, 104, 52, 158)) + sk(pointedArch(572, 628, 108, 70, 158)) +
  sk("M520 66L536 54H664L680 66") + sk(chhatri(600, 54, 22)) +
  sk(minaret(514, 52, 158, 12)) + sk(minaret(686, 52, 158, 12)) +
  [528, 652].map((x) => sk(pointedArch(x, x + 20, 128, 114, 158))).join("") +
  // Husainabad Clock Tower
  sk("M872 158V58H904V158") + sk("M868 58H908") + sk("M872 58L888 34L904 58") + sk("M888 34V26") +
  `<circle cx="888" cy="78" r="9"/>` + sk("M888 72V78L892 81") + sk("M878 158V120H898V158") +
  // Trees and birds
  [60, 120, 470, 760, 800, 1000, 1060, 1140].map((x, i) => sk(bush(x, i % 2 ? 12 : 16))).join("") +
  sk("M1010 54q6-6 12 0q6-6 12 0") + sk("M1050 70q5-5 10 0q5-5 10 0") + sk("M140 60q5-5 10 0q5-5 10 0") +
  `</g>`,
  "0 0 1200 160",
);

const files = { "hero-care.svg": heroScene, "hospital-assist.svg": hospital, "elderly-care.svg": elderly, "personal-assist.svg": errands, "lucknow-skyline.svg": skyline };
for (const [name, content] of Object.entries(files)) writeFileSync(path.join(outDir, name), content);

// The footer animates the skyline drawing itself, so it needs the raw path data.
const skylinePaths = [...skyline.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
const [, ccx, ccy, cr] = skyline.match(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/);
writeFileSync(
  path.resolve(outDir, "../../src/components/visuals/skyline-art.ts"),
  `// Generated by brand/source/illus.mjs. Regenerate rather than editing by hand.\n\nexport const skylineViewBox = "0 0 1200 160";\nexport const skylinePaths = ${JSON.stringify(skylinePaths, null, 2)};\nexport const skylineClock = { cx: ${ccx}, cy: ${ccy}, r: ${cr} };\n`,
);
console.log(Object.keys(files).join(" "));
