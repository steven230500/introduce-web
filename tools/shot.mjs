// Screenshots of the landing, for checking a design change without squinting
// at a browser window.
//
//   npm i -D playwright && npx playwright install chromium
//   node tools/shot.mjs            # full page
//   node tools/shot.mjs 420        # at phone width
//
// Output goes to tools/out/, which is not committed.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const width = Number(process.argv[2] ?? 1280);
const out = join(here, 'out');
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 900 },
  deviceScaleFactor: 2,
});
await page.goto('file://' + join(here, '..', 'index.html'), { waitUntil: 'networkidle' });

// Web fonts settle a beat after the network goes quiet, and a shot taken
// before that shows the fallback serif, which looks like a different design.
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const full = join(out, `page-${width}.png`);
await page.screenshot({ path: full, fullPage: true });
console.log(full);

await browser.close();
