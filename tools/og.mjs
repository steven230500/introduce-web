// The share pictures, one per language, from tools/og.html.
//
//   npm i -D playwright && npx playwright install chromium
//   node tools/og.mjs
//
// Writes assets/og-es.png and assets/og-en.png. Run it again after changing
// the headline.

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

for (const lang of ['es', 'en']) {
  await page.goto(`file://${join(here, 'og.html')}?lang=${lang}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = join(here, '..', 'assets', `og-${lang}.png`);
  await page.screenshot({ path: out });
  console.log(out);
}

await browser.close();
