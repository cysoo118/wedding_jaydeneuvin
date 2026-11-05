// Renders the photobooth artwork into src/assets/photobooth/.
//
//   node tools/render-photobooth-art.mjs                  # frame, paper, seal
//   node tools/render-photobooth-art.mjs --placeholders   # + labelled placeholders
//
// --placeholders OVERWRITES couple.jpg and booth-*.jpg, so leave it off once
// you have put your own photos in place.
//
// Needs Playwright (with Chromium) and Python 3 + Pillow for the WebP step:
//   npm i -D playwright && npx playwright install chromium && pip install pillow
//
// Outputs (src/assets/photobooth/):
//   mirror-frame.webp      the gilded frame (transparent centre and surround)
//   envelope-body.webp     embossed floral paper for the envelope pocket
//   envelope-flap.webp     ...and a different composition for the flap
//   wax-seal.webp          the gold wax seal (initials are live text on top)
//   couple.jpg, booth-1..3.jpg   labelled placeholders (only with --placeholders)
// and tools/mirror-plate.txt, the CSS clip-path polygon for the mirror's
// satin plate (paste into photobooth.component.css → .plate if the frame
// outline changes).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

// require() so a globally installed Playwright is found too.
const { chromium } = createRequire(import.meta.url)('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'src', 'assets', 'photobooth');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 2000 }, deviceScaleFactor: 1 });

async function shoot(file, hash, target, { alpha = false, type = 'png', quality } = {}) {
  await page.goto('about:blank');
  await page.goto(pathToFileURL(join(here, file)).href + (hash ? `#${hash}` : ''));
  await page.waitForFunction(() => window.ready === true);
  await page.locator('#art').screenshot({ path: target, omitBackground: alpha, type, quality });
}

// PNG -> WebP keeps everything light; alpha stays full quality.
function toWebp(png, quality) {
  execFileSync('python3', [
    '-c',
    `from PIL import Image; import os, sys
src, q = sys.argv[1], int(sys.argv[2])
Image.open(src).save(src[:-4] + '.webp', 'WEBP', quality=q, method=6, alpha_quality=100)
os.remove(src)`,
    png,
    String(quality),
  ]);
  console.log('wrote', png.replace(/\.png$/, '.webp'));
}

// mirror frame + the plate outline it implies
await shoot('mirror-frame.html', '', join(out, 'mirror-frame.png'), { alpha: true });
writeFileSync(join(here, 'mirror-plate.txt'), (await page.evaluate(() => window.platePolygon)) + '\n');
// envelope paper (two compositions) and the wax seal
await shoot('envelope-paper.html', 'body', join(out, 'envelope-body.png'));
await shoot('envelope-paper.html', 'flap', join(out, 'envelope-flap.png'));
await shoot('wax-seal.html', '', join(out, 'wax-seal.png'), { alpha: true });

if (process.argv.includes('--placeholders')) {
  for (const scene of ['couple', 'booth-1', 'booth-2', 'booth-3']) {
    const target = join(out, `${scene}.jpg`);
    await shoot('placeholder-photos.html', scene, target, { type: 'jpeg', quality: 84 });
    console.log('wrote', target);
  }
}
await browser.close();

toWebp(join(out, 'mirror-frame.png'), 88);
toWebp(join(out, 'envelope-body.png'), 80);
toWebp(join(out, 'envelope-flap.png'), 80);
toWebp(join(out, 'wax-seal.png'), 90);
