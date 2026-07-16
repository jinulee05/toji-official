import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const outputDir = process.argv[2] ?? "work/qa/art-direction";
const baseUrl = process.argv[3] ?? "http://127.0.0.1:3000";

const captures = [
  { name: "main-1920", route: "/", width: 1920, height: 1080 },
  { name: "main-1440", route: "/", width: 1440, height: 900 },
  { name: "music-1920", route: "/?overlay=music", width: 1920, height: 1080, overlay: true },
  { name: "world-1920", route: "/world", width: 1920, height: 1080 },
  { name: "contact-1920", route: "/?overlay=contact", width: 1920, height: 1080, overlay: true },
  { name: "main-mobile", route: "/", width: 390, height: 844 },
  { name: "world-mobile", route: "/world", width: 390, height: 844 },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = { captures: [], consoleErrors: [] };

for (const capture of captures) {
  const page = await browser.newPage({
    viewport: { width: capture.width, height: capture.height },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      report.consoleErrors.push({ capture: capture.name, type: "console", text: message.text() });
    }
  });

  page.on("pageerror", (error) => {
    report.consoleErrors.push({ capture: capture.name, type: "pageerror", text: String(error) });
  });

  await page.goto(new URL(capture.route, baseUrl).toString(), { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(260);

  const metrics = await page.evaluate(() => ({
    bodyBackground: getComputedStyle(document.body).backgroundColor,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    characterImages: Array.from(document.querySelectorAll(".hero-panel__art img")).map((image) => image.getAttribute("src")),
    smokeVideo: document.querySelector(".global-smoke__video")?.currentSrc ?? null,
    smokeScrollY: getComputedStyle(document.querySelector(".site-stage")).getPropertyValue("--global-smoke-scroll-y").trim(),
  }));

  await page.screenshot({
    path: path.join(outputDir, `${capture.name}.png`),
    fullPage: false,
  });

  let smokeAfterScroll = null;
  if (capture.name === "main-1920") {
    await page.evaluate(() => window.scrollTo(0, 620));
    await page.waitForTimeout(100);
    smokeAfterScroll = await page.evaluate(() =>
      getComputedStyle(document.querySelector(".site-stage")).getPropertyValue("--global-smoke-scroll-y").trim(),
    );
  }

  let escapeClosed = null;
  if (capture.overlay) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(220);
    escapeClosed = await page.evaluate(() => !document.querySelector(".site-overlay.is-open"));
  }

  report.captures.push({
    ...capture,
    ...metrics,
    hasHorizontalOverflow: metrics.scrollWidth > metrics.clientWidth,
    smokeAfterScroll,
    escapeClosed,
  });

  await page.close();
}

await browser.close();
await writeFile(path.join(outputDir, "qa-report.json"), JSON.stringify(report, null, 2));
