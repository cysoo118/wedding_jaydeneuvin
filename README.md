# Heritage — an Angular wedding invitation

An elegant, single-page wedding invitation built with Angular (standalone
components). Warm parchment palette, engraved serif typography, a hand-drawn
garden-pavilion illustration that animates on load, a live countdown, an
"our story" timeline, ceremony & reception details, a gallery, and an RSVP form.

## Run it

You'll need Node.js 18.19+ (or 20+).

```bash
npm install
npm start
```

Then open http://localhost:4200.

To create a production build:

```bash
npm run build
# output lands in dist/heritage-invite/
```

Deploy the contents of `dist/heritage-invite/browser/` to any static host
(Netlify, Vercel, GitHub Pages, Azure Static Web Apps, etc.).

## The photo-booth opening

Guests land on a sealed, vertical blush envelope with your portrait in a
foil-ringed oval. A tap swings the flap open in 3D, a gilded baroque mirror
slides out of the pocket and settles on a crushed-velvet wall, engraved with
your names and date. Tapping the mirror fires a camera flash, the names fade,
and a photo strip feeds out of the booth slot and develops frame by frame
(tap again to tuck it back in). "View the invitation" then fades the booth
away to reveal the rest of the site below.

- **Your photos:** `src/assets/photobooth/` ships with labelled grey
  placeholders. Save your photos over them with the same file names:

  | File | Where it shows | Shape | Suggested size |
  | --- | --- | --- | --- |
  | `couple.jpg` | oval on the envelope | upright 4:5, faces centred (edges are cropped to the oval) | 800 × 1000 px |
  | `booth-1.jpg` | top frame of the strip | landscape ~4:3 | 800 × 590 px |
  | `booth-2.jpg` | middle frame | landscape ~4:3 | 800 × 590 px |
  | `booth-3.jpg` | bottom frame | landscape ~4:3 | 800 × 590 px |

  Photos are cropped to fit, so other sizes work too. They print in black &
  white; set `photobooth.monochrome` to `false` for colour. Keep each file
  under ~300 KB so the page opens quickly. Using different names or `.png`/
  `.webp`? Update the paths in `photobooth` in `wedding-data.ts`.
- **Words:** `photobooth` in `src/app/wedding-data.ts` (headline, names, date,
  strip caption, photo paths).
- **Use the old video cover instead:** set `photobooth.enabled` to `false`.
- The mirror frame is a pre-rendered image, drawn as code in
  `tools/mirror-frame.html`. To re-tint or redraw it, edit that file and run
  `node tools/render-photobooth-art.mjs` (needs Playwright + Python Pillow).

## Customize everything in one place

Open **`src/app/wedding-data.ts`** and edit the names, date, venues, story,
gallery captions, and hashtag. The whole site updates from that one file.

- `dateISO` drives the live countdown — set it to your real date/time.
- Page title & meta text live in `src/index.html`.
- Colours and fonts are CSS variables at the top of `src/styles.css`.

### Add your own photos

Put images in `src/assets/` and, in `gallery.component.ts`, swap the
placeholder block for:

```html
<img [src]="g.src" [alt]="g.caption" />
```

adding a `src` to each gallery item in `wedding-data.ts`.

### Collect RSVPs

The form currently logs replies to the console. To actually receive them,
wire the `submit()` method in `rsvp.component.ts` to your own API, a
Formspree endpoint, or a Google Apps Script (a one-line `fetch` — there's a
comment showing exactly where).

## Structure

```
src/app/
  wedding-data.ts        <- edit this
  app.component.ts       <- composes the sections
  reveal.directive.ts    <- scroll-in animation
  components/
    photobooth.component.*   envelope -> mirror -> photo strip opening
    hero.component.ts        countdown.component.ts
    story.component.ts       celebration.component.ts
    gallery.component.ts     rsvp.component.ts
    footer.component.ts
```
