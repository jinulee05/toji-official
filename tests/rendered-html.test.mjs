import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the final TOJI hero system", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>TOJI \| Official Site<\/title>/i);
  assert.match(html, /src="\/toji\/hero-final\.png"/i);
  assert.match(html, /src="\/toji\/smoke-loop\.webm"/i);
  assert.match(html, /src="\/toji\/smoke-loop\.mp4"/i);
  assert.match(html, /class="visually-hidden"[^>]*>\s*TOJI/i);
  assert.doesNotMatch(html, /grain-original\.svg|texture-layer|impact-transition/i);
  assert.doesNotMatch(html, /hero-panel__title/i);
  assert.doesNotMatch(html, /hero-panel__ink/i);
  assert.doesNotMatch(html, /ARTIST \/ PRODUCER \/|ARTIST \/ PRODUCER/i);
  assert.doesNotMatch(html, /JOKER/i);
});

test("server-renders WORLD as a character archive", async () => {
  const response = await render("/world");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /THE OUTSIDER/i);
  assert.match(html, /WORLD \/ CHARACTERS/i);
  assert.match(html, /TOJI/i);
  assert.match(html, /RIN/i);
  assert.match(html, /JANE/i);
  assert.match(html, /THE MAN/i);
  assert.match(html, /src="\/toji\/world\/toji\.png"/i);
  assert.match(html, /src="\/toji\/world\/rin-display\.png"/i);
  assert.match(html, /src="\/toji\/world\/jane-display\.png"/i);
  assert.match(html, /href="\/world\/part-1"/i);
  assert.match(html, /href="\/world\/part-2"/i);
  assert.doesNotMatch(html, /archive-axis__map/i);
  assert.doesNotMatch(html, /JOKER/i);
});

test("server-renders the complete PART I coordinate archive", async () => {
  const response = await render("/world/part-1");
  assert.equal(response.status, 200);

  const html = await response.text();
  const content = await readFile(
    new URL("../app/site-content.ts", import.meta.url),
    "utf8",
  );
  assert.match(html, /THE OUTSIDER/i);
  assert.match(html, /PART I/i);
  assert.match(html, /archive-axis__horizontal/i);
  assert.match(html, /archive-axis__vertical/i);
  assert.match(html, /aria-label="X: THE MAN"[^>]*aria-pressed="true"/i);

  for (const title of [
    "THE MAN",
    "THE GIRL",
    "ROOFTOP SIGNAL",
    "HOTEL RAFFLESIA",
    "BACKROOM NANDO (房)",
    "VISTA HOUSE",
    "ZOMBIE MAN",
    "THE GUIDEBOOK",
    "INOCHI BETTING",
    "THE REAL GAMBLER BLUES",
  ]) {
    assert.ok(content.includes(title), `missing WORLD title: ${title}`);
    assert.ok(html.includes(title), `PART I did not render title: ${title}`);
  }

  assert.doesNotMatch(html, /world-character__art/i);
  assert.doesNotMatch(html, /JOKER/i);
});

test("server-renders PART II as an unopened archive", async () => {
  const response = await render("/world/part-2");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /THE OUTSIDER/i);
  assert.match(html, /PART II/i);
  assert.match(html, /ARCHIVE NOT OPEN/i);
  assert.doesNotMatch(html, /archive-axis__map/i);
});
