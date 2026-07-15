import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, webkit } from "playwright";

const outputDir = process.argv[2] ?? "work/qa/current";
const baseUrl = process.argv[3] ?? "http://127.0.0.1:3000";
const browserName = process.env.QA_BROWSER ?? "webkit";
const consoleOutputPath = path.join(outputDir, "console-errors.json");

const captures = [
  { name: "toji", path: "/" },
  { name: "music", path: "/?overlay=music" },
  { name: "world", path: "/world" },
  { name: "contact", path: "/?overlay=contact" },
];

await mkdir(outputDir, { recursive: true });

const launcher = browserName === "chromium" ? chromium : webkit;
const browser = await launcher.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 384, height: 1024 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
});
const consoleMessages = [];

page.on("console", (message) => {
  if (message.type() === "error") {
    consoleMessages.push({ type: message.type(), text: message.text() });
  }
});

page.on("pageerror", (error) => {
  consoleMessages.push({ type: "pageerror", text: String(error) });
});

for (const capture of captures) {
  const targetUrl = new URL(capture.path, baseUrl).toString();
  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    fullPage: false,
    path: path.join(outputDir, `${capture.name}.png`),
  });
}

await browser.close();
await writeFile(consoleOutputPath, JSON.stringify(consoleMessages, null, 2));
