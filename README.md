# Shloka Care landing page

The landing page for Shloka Care (working name), a verified care-companion service launching in Lucknow. It has one page and one enquiry form.

It uses the same stack as the Scalvyn site: Next.js 16 (App Router) exported as a fully static site, Tailwind CSS v4, `motion` for animation, Lenis for smooth scrolling and `lucide-react` icons. It runs no server, so it can be hosted on S3 behind CloudFront. It has a light and a dark theme.

## Run locally

```sh
npm install
cp .env.example .env.local   # then add your Web3Forms key (see below)
npm run dev                  # http://localhost:3000
```

`npm run build` writes the static site to `out/`.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/content/site.ts` | Name, description, status line, emergency note, navigation |
| `src/content/home.ts` | Audiences, steps, safety points and the ticker |
| `src/content/enquiry.ts` | The enquiry questions, one per screen, for each path |
| `src/content/services.ts` | The three launch services and the "coming later" line |
| `src/content/faqs.ts` | FAQ questions and answers (also published as FAQ structured data) |
| `src/components/sections/` | One file per page section. `enquiry.tsx` is the enquiry flow |
| `src/components/enquiry/` | The enquiry's live ticket and arch progress indicator |
| `src/components/visuals/phone-screens.tsx` | The example app screens shown in the Safety section |
| `src/app/globals.css` | Brand colours, light and dark theme values, fonts and keyframes |
| `src/lib/theme.ts`, `src/lib/theme-script.ts` | Theme switching, and the head script that applies the theme before first paint |
| `src/components/ui/logo.tsx` | The logo as inline SVG (paths in `logo-art.ts`, generated) |
| `public/illustrations/` | Service and skyline illustrations (generated) |
| `src/app/icon.svg`, `src/app/apple-icon.png` | Favicon and iOS home-screen icon (generated) |
| `brand/` | Logo files to hand out (SVG + PNG), plus the generators in `brand/source/` |

Text edits almost always belong in `src/content/`, not in the components.

## Connect the enquiry form (Web3Forms, free)

1. Go to [web3forms.com](https://web3forms.com), enter the email address that should receive enquiries, and copy the access key they email you.
2. Put it in `.env.local` as `NEXT_PUBLIC_WEB3FORMS_KEY=...`. The key is designed to be public.
3. Rebuild. The key is baked in when the site is built, so set it on whatever machine or CI job runs `npm run build`.

Until a key is set, the form tells visitors it isn't connected yet.

The enquiry is a short conversation, one question per screen. Visitors pick a path first, and a "care request" ticket fills in beside the questions as they answer. Single choices move on by themselves, number keys pick options, and the logo's arch fills with gold as they progress. Each enquiry arrives by email with `enquiring_as`, `name`, `phone`, `consent`, `email` and `message` (if given), plus the answers for its path:

- **Family:** `for_whom`, `service`, `when`, `area`
- **Companion:** `languages`, `experience`, `area`
- **Partner:** `organisation_type`, `organisation`

The subject line includes the person's name and path. To change a question, edit `src/content/enquiry.ts`.

## Deploy to S3 + CloudFront

### One-time setup

1. **S3:** create a bucket (in `ap-south-1` Mumbai, for example). Keep **Block all public access** on, because CloudFront will read it privately.
2. **CloudFront:** create a distribution with the bucket as its origin, using **Origin access control (OAC)**. Let CloudFront update the bucket policy when it offers to.
   - Default root object: `index.html`
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Response headers policy: `Managed-SecurityHeadersPolicy`
3. **Error pages:** in the distribution's **Error pages** tab, add custom error responses for **403** and **404**. Each should return `/404.html` with response code **404**. S3 answers 403 for missing files when it's accessed through OAC, so both are needed.
4. **Domain (optional):** request a certificate for your domain in **ACM in us-east-1** (CloudFront only uses certificates from that region). Add the domain as an alternate domain name on the distribution, then point DNS at the distribution.

Right now there's only one page, so the default root object is enough. If you add more pages (for example `/privacy`), add this **CloudFront Function** on *Viewer request*. With `trailingSlash: true`, Next exports each page as `folder/index.html`, and S3 won't find that file from a clean URL on its own:

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith("/")) {
    request.uri += "index.html";
  } else if (!uri.split("/").pop().includes(".")) {
    request.uri += "/index.html";
  }
  return request;
}
```

### Each deploy

```sh
npm run build

# Hashed build assets never change, so browsers and CloudFront can cache them for a year.
aws s3 sync out/_next s3://YOUR_BUCKET/_next --cache-control "public,max-age=31536000,immutable"

# Everything else (HTML, icon) must always be fresh.
aws s3 sync out s3://YOUR_BUCKET --delete --exclude "_next/*" --cache-control "public,max-age=0,must-revalidate"

aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Logo

The mark is a **Lucknowi pointed arch** (the doorways of Rumi Darwaza and the city's Nawabi buildings) holding the **S** of Shloka: a doorway with someone trusted at it. The wordmark is Fraunces, the same face as the site's headings, with the first word set heavier. Every file is vector, with the letters converted to outlines, so it looks identical everywhere and never depends on a font being installed.

Files in `brand/` (each SVG has a high-resolution PNG beside it):

| File | Use it for |
| --- | --- |
| `shloka-care-logo.svg` | Default logo on white or ivory |
| `shloka-care-logo-on-dark.svg` | On navy or photos: gold arch, white wordmark |
| `shloka-care-logo-stacked.svg` (+ `-on-dark`) | Square spaces: posters, letterheads, social posts |
| `shloka-care-mark.svg` (+ `-on-dark`) | The arch alone, with its inner line, for large sizes |
| `shloka-care-profile.png` | WhatsApp Business, Instagram and Google profile picture (safe for circle crops) |

Rules: keep the arch navy with a gold S on light backgrounds, and gold with a navy S on dark ones. Don't stretch, recolour or outline it, and leave clear space around it at least the width of the S. Below about 24px tall, use the mark without the wordmark.

### Other logo directions

`brand/concepts/` holds three alternatives beside the arch, for the client to compare. Open `brand/concepts/index.html`, or share `logo-concepts.png`:

- **A · Arch Doorway** (on the site now): a Lucknowi arch holding the S. Heritage and premium.
- **B · Lotus Plus**: a medical cross made of lotus petals. Healthcare with an Indian identity.
- **C · Embrace**: two people whose arms form a heart, with a modern rounded wordmark. Warm and friendly.
- **D · Shield Pulse**: a shield holding a heart and a heartbeat. Safety and health at a glance.

Each comes as a logo, a logo for dark backgrounds, and a mark (SVG). Regenerate them with `npm run concepts` in `brand/source`. If the client picks B, C or D, its drawing replaces the arch in `build-logo.mjs`, and the site, favicon and app icon follow from there.

### Regenerating the logo (for example if the name changes)

The logo, favicon, app icon and the site's logo paths are all generated, so a new name only takes one command:

```sh
cd brand/source
npm install
npm run fonts                      # downloads the Fraunces instances (SIL Open Font License)
npm run logo -- "Shloka Sahayak"   # first word heavier; the S in the arch comes from its first letter
```

This rewrites `brand/`, `src/components/ui/logo-art.ts`, `src/app/icon.svg` and `src/app/apple-icon.png`. PNGs are rendered with Google Chrome; set `CHROME=/path/to/chrome` if it isn't in the default macOS location. Also update `name` in `src/content/site.ts`, and delete the old name's files from `brand/`.

## Illustrations

Original vector illustrations, drawn in code (`brand/source/illus.mjs`) in the brand palette: navy outlines, gold accents, and each scene framed by the logo's arch.

- `hospital-assist.svg`: a companion pushing a patient's wheelchair outside a hospital
- `elderly-care.svg`: a companion walking arm in arm with an elder who uses a stick
- `personal-assist.svg`: a companion with paperwork outside a bank, with a ticked checklist
- `lucknow-skyline.svg`: line art of Bara Imambara, Rumi Darwaza and the Husainabad Clock Tower (footer)

- `hero-care.svg`: the hero scene, a companion walking an elder away from the hospital

Companions always wear the navy kurta with a gold ID badge, so they're recognisable in every scene. To change one, edit `illus.mjs` and run `npm run illustrations` in `brand/source`. This also regenerates `src/components/visuals/skyline-art.ts`, the path data the footer animates.

Behind most sections, faint healthcare line doodles drift slowly: a stethoscope, heartbeat, medical cross, wheelchair, calendar, shield, caring hands and so on. They're defined in `src/components/visuals/doodles.tsx`. Each section places its own few with `<DoodleField spots={...} />`, and most are hidden on phones to keep small screens calm.

## Themes

The site follows the visitor's device setting (light or dark) until they use the toggle in the header, and then remembers their choice. A small script in `<head>` applies the theme before the page paints, so there's no flash of the wrong theme. Where the browser supports it, switching spreads the new theme out in a circle from the toggle.

The dark theme is built on Shloka navy, with ivory text and gold as the primary colour. Components use theme-aware colours (`canvas`, `card`, `ink`, `copy`, `primary`, `band` and so on). Their light and dark values are set once in `globals.css`.

## Animations

- **Intro:** on the first page view of a visit, a navy curtain shows the logo's arch drawing itself, then lifts.
- **Smooth scrolling** throughout (Lenis), with a gold reading-progress line at the top. The header tucks away as you scroll down and returns when you scroll up.
- **Hero:** the headline rises in word by word and its underline draws in. The visit card's updates arrive one by one, and a WhatsApp update pops in. As you scroll away, the scene tilts back in 3D and the seal spins with the scroll. A heartbeat pulse runs along the bottom.
- **Ticker:** two rows (the services in big serif type, and the safety promises) run in opposite directions. They speed up and reverse with your scroll.
- **Statement:** a giant sentence whose words light up one by one as you scroll through it.
- **Services (desktop):** the section pins in place and the cards slide sideways as you scroll, with a gold progress line.
- **How it works:** each step is a colour-blocked card that pins, and the next stacks on top while the earlier ones shrink back.
- **Safety (desktop):** a phone pins beside the list and tilts in 3D. Its screen changes to match the safety point in focus.
- **Headings** rise in word by word as they come into view. Arch-topped cards lift on hover.
- **Enquiry:** questions slide between steps, the ticket fills in live, and when the request is sent the ticket is stamped and gold sparkles burst from the arch.
- **Footer:** the Lucknow skyline draws itself, and a giant gold wordmark rises into place.

Everything respects the visitor's **reduce motion** setting:
- the intro, smooth scrolling and looping animations are off
- the ticker becomes a static list
- the services stack instead of pinning
- the hero and the enquiry show their final state straight away
- the skyline appears already drawn

CSS animations use Tailwind's `motion-safe:` variant, and `motion` animations go through `MotionConfig reducedMotion="user"` and `useReducedMotion()`.

## Brand colours

The colours come from the Shloka brief and are used exactly. Tailwind's default palette is switched off in `globals.css`, so only these can be used:

- Shloka Navy `#0B1F3A` (`navy`): headings, buttons and text in the light theme, and the base of the dark theme
- Shloka Gold `#C9A227` (`gold`): icons, lines and highlights, and the primary colour in the dark theme. Never used for text on white
- Warm Ivory `#F7F3E8` (`ivory`): section and card backgrounds
- White `#FFFFFF` (`white`): page background
- Slate Grey `#3A4556` (`slate`): body text

Fonts are Instrument Serif (headings) and Plus Jakarta Sans (text), self-hosted through `next/font`. The logo's wordmark stays in Fraunces, drawn as outlines. Body text is 18px and every button or tap target is at least 44px, for older and less technical visitors.

## Before going live

- **Name:** "Shloka Care" is the working name. If it changes, regenerate the logo (see above) and change `name` in `src/content/site.ts`, which updates the copy and metadata.
- **Domain:** once it's live, set `url` in `src/content/site.ts` to add canonical URLs.
- **Trademark:** check the name and logo with the Trade Marks Registry (Classes 44/45) before printing anything.
- **Privacy policy:** the DPDP Act needs one. Add it as `src/app/privacy/page.tsx`, add the CloudFront Function above, and link it from the form's consent line.
- **Prices:** none are shown yet. The FAQ says they'll be shared at launch.
- **Contact number:** add the WhatsApp Business number once it's set up.
