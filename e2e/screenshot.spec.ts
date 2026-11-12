import { test } from '@playwright/test';

test('capture MEC layout retro screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForTimeout(600);

  const outDir = 'C:/Users/rspac/.gemini/antigravity/brain/2b9ae591-1764-4959-8661-734828438db0';
  
  // Full page screenshot of the entire MEC layout
  await page.screenshot({ path: `${outDir}/mec_layout_full.png`, fullPage: true });

  // Above the fold hero screenshot
  await page.screenshot({ path: `${outDir}/mec_layout_hero.png`, fullPage: false });
});
