// Renders the photobooth artwork into src/assets/photobooth/.
//
//   node tools/render-photobooth-art.mjs                  # the gilded frame
//   node tools/render-photobooth-art.mjs --placeholders   # + labelled placeholders
//
// --placeholders OVERWRITES couple.jpg and booth-*.jpg, so leave it off once
// you have put your own photos in place.
//
// Needs Playwright (with Chromium) and Python 3 + Pillow for the WebP step:
//   npm i -D playwright && npx playwright install chromium && pip install pillow
//
// Outputs:
//   mirror-frame.webp   the gilded frame (transparent centre and surround)
//   tools/mirror-plate.txt   the CSS clip-path polygon for the satin plate
//                            (paste into photobooth.component.css → .plate)
//   couple.jpg, booth-1..3.jpg   labelled placeholders (only with --placeholders)
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
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(here, 'mirror-frame.html')).href);
await page.waitForFunction(() => window.ready === true);

const png = join(out, 'mirror-frame.png');
await page.locator('#art').screenshot({ path: png, omitBackground: true });
const polygon = await page.evaluate(() => window.platePolygon);
writeFileSync(join(here, 'mirror-plate.txt'), polygon + '\n');

if (process.argv.includes('--placeholders')) {
  const photos = pathToFileURL(join(here, 'placeholder-photos.html')).href;
  for (const scene of ['couple', 'booth-1', 'booth-2', 'booth-3']) {
    await page.goto('about:blank');
    await page.goto(`${photos}#${scene}`);
    await page.waitForFunction(() => window.ready === true);
        await page.locator('#art').screenshot({ path: join(out, `${scene}.jpg`), type: 'jpeg', quality: 84 });
    console.log('wrote', join(out, `${scene}.jpg`));
  }
}
await browser.close();

// PNG -> WebP (lossy colour, lossless-quality alpha) keeps the frame light.
execFileSync('python3', [
  '-c',
  `from PIL import Image; import os, sys
src = sys.argv[1]
Image.open(src).save(src[:-4] + '.webp', 'WEBP', quality=88, method=6, alpha_quality=100)
os.remove(src)`,
  png,
]);
console.log('wrote', join(out, 'mirror-frame.webp'));
