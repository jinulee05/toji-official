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
  assert.match(html, /grain-original\.svg/i);
  assert.match(html, /hero-panel__ink-layer--mass-left/i);
  assert.match(html, /hero-panel__ink-layer--hook-right/i);
  assert.match(html, /ARTIST \/ PRODUCER \/|ARTIST \/ PRODUCER/i);
  assert.doesNotMatch(html, /JOKER/i);
});

test("server-renders the complete WORLD coordinate archive", async () => {
  const response = await render("/world");
  assert.equal(response.status, 200);

  const html = await response.text();
  const content = await readFile(
    new URL("../app/site-content.ts", import.meta.url),
    "utf8",
  );
  assert.match(html, /THE OUTSIDER/i);
  assert.match(html, /A NOIR OPERA/i);
  assert.match(html, /THE MAN/i);

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
  }

  assert.match(html, /world-axis__lines/i);
  assert.match(html, /axis-fade-horizontal/i);
  assert.match(html, /axis-fade-vertical/i);
  assert.doesNotMatch(html, /JOKER/i);
});
