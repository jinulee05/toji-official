import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const outputDir = process.argv[2] ?? "work/qa/world-architecture-final";
const baseUrl = process.argv[3] ?? "http://localhost:4173";

const captures = [
  { name: "world-opening-1920", route: "/world", width: 1920, height: 1080 },
  { name: "world-toji-1920", route: "/world", width: 1920, height: 1080, character: 0 },
  { name: "world-rin-1920", route: "/world", width: 1920, height: 1080, character: 1 },
  { name: "world-submenu-1920", route: "/world", width: 1920, height: 1080, submenu: true },
  { name: "part-1-1920", route: "/world/part-1", width: 1920, height: 1080 },
  { name: "part-2-1920", route: "/world/part-2", width: 1920, height: 1080 },
  { name: "world-opening-1440", route: "/world", width: 1440, height: 900 },
  { name: "part-1-1440", route: "/world/part-1", width: 1440, height: 900 },
  { name: "world-mobile-390", route: "/world", width: 390, height: 844 },
  { name: "world-mobile-nav-390", route: "/world", width: 390, height: 844, mobileMenu: true },
  { name: "part-1-mobile-390", route: "/world/part-1", width: 390, height: 844 },
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
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => image.loading !== "lazy")
        .map((image) => image.decode().catch(() => undefined)),
    );
  });

  if (capture.character !== undefined) {
    const section = page.locator(".world-character").nth(capture.character);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
  }

  if (capture.submenu) {
    await page.locator(".site-nav__world").hover();
    await page.waitForTimeout(180);
  }

  if (capture.mobileMenu) {
    await page.getByRole("button", { name: "Toggle WORLD destinations" }).click();
    await page.waitForTimeout(180);
  }

  const metrics = await page.evaluate(() => ({
    activeDestination: document.querySelector('.site-nav__submenu-link[aria-current="page"]')?.textContent?.trim() ??
      document.querySelector('.site-nav__item[aria-current="page"]')?.textContent?.trim() ??
      null,
    characterSources: [...document.querySelectorAll(".world-character__image")].map((image) => image.getAttribute("src")),
    clientWidth: document.documentElement.clientWidth,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    pressedCoordinate: document.querySelector('.archive-axis__node[aria-pressed="true"]')?.getAttribute("aria-label") ?? null,
    submenuVisible: document.querySelector(".site-nav__submenu")
      ? getComputedStyle(document.querySelector(".site-nav__submenu")).visibility === "visible"
      : false,
    viewport: { width: window.innerWidth, height: window.innerHeight },
  }));

  await page.screenshot({
    path: path.join(outputDir, `${capture.name}.png`),
    fullPage: false,
  });

  report.captures.push({ ...capture, ...metrics });
  await page.close();
}

await browser.close();
await writeFile(path.join(outputDir, "qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
