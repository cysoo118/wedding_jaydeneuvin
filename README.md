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
    hero.component.ts        countdown.component.ts
    story.component.ts       celebration.component.ts
    gallery.component.ts     rsvp.component.ts
    footer.component.ts
```
