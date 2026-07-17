import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const partOneEpisodes = JSON.parse(
  await readFile(new URL("../content/world/part-1.json", import.meta.url), "utf8"),
);

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
  assert.match(html, /src="\/toji\/releases\/rooftop-signal\.jpg"/i);
  assert.match(html, /src="\/toji\/releases\/medium\.jpg"/i);
  assert.match(html, /open\.spotify\.com\/track\/3ST6arVsLwU53mYWO4CvIY/i);
  assert.match(html, /open\.spotify\.com\/track\/0CaGOfhW8XIfPPlvDVm8Vh/i);
  assert.match(html, /MORE PLATFORMS/i);
  assert.doesNotMatch(html, /example\.com|OFFICIAL ARTWORK PENDING/i);
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
  assert.match(html, /THE OUTSIDER/i);
  assert.match(html, /PART I/i);
  assert.match(html, /archive-axis__horizontal/i);
  assert.match(html, /archive-axis__vertical/i);
  assert.match(
    html,
    /aria-current="true"[^>]*aria-label="COORDINATE X: A DROP"/i,
  );
  assert.doesNotMatch(html, /EPISODE\s+\d+/i);

  for (const episode of partOneEpisodes) {
    const { title } = episode;
    assert.ok(html.includes(title), `PART I did not render title: ${title}`);
    assert.match(
      html,
      new RegExp(`href="/world/part-1/${episode.slug}"`, "i"),
    );
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

test("server-renders every PART I coordinate with its configured access state", async () => {
  for (const episode of partOneEpisodes) {
    const response = await render(`/world/part-1/${episode.slug}`);
    assert.equal(response.status, 200, `reader failed: ${episode.slug}`);

    const html = await response.text();
    assert.match(html, new RegExp(`COORDINATE ${episode.coordinate}`, "i"));
    assert.ok(html.includes(episode.title), `reader title missing: ${episode.title}`);
    if (episode.published) {
      assert.doesNotMatch(html, /RESTRICTED ACCESS/i);
      assert.doesNotMatch(html, /name="robots" content="noindex/i);
    } else {
      assert.match(html, /RESTRICTED ACCESS/i);
      assert.match(html, /This coordinate is currently sealed\./i);
      assert.match(html, /name="robots" content="noindex, nofollow, nocache"/i);
    }
    assert.match(
      html,
      new RegExp(
        `rel="canonical" href="https://sadistoji\\.com/world/part-1/${episode.slug}"`,
        "i",
      ),
    );
    assert.match(html, /href="\/world\/part-1"/i);
  }
});

test("COORDINATE X renders the official A Drop PDF edition", async () => {
  const response = await render("/world/part-1/the-man");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>A Drop — THE OUTSIDER<\/title>/i);
  assert.match(html, /property="og:title" content="COORDINATE X — A Drop"/i);
  assert.match(html, /COORDINATE X/i);
  assert.match(html, /A DROP/i);
  assert.match(html, /한 방울/i);
  assert.match(html, /SPECIAL PROLOGUE · 20–25 MIN/i);
  assert.match(html, /본편에는 아동 대상 폭력, 신체 변형 및 총기 묘사가 포함되어 있습니다\./i);
  assert.match(html, /href="\/world\/coordinate-x\/a-drop\.pdf"/i);
  assert.match(html, /src="\/world\/coordinate-x\/a-drop\.pdf"/i);
  assert.match(html, /name="robots" content="index, follow"/i);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/sadistoji\.com\/world\/part-1\/the-man"/i,
  );
  assert.doesNotMatch(html, /RESTRICTED ACCESS/i);
});

test("reader navigation respects first and last coordinate boundaries", async () => {
  const firstResponse = await render("/world/part-1/the-man");
  const firstHtml = await firstResponse.text();
  assert.doesNotMatch(firstHtml, />PREVIOUS</i);
  assert.match(firstHtml, /href="\/world\/part-1\/the-girl"/i);

  const middleResponse = await render("/world/part-1/rooftop-signal");
  const middleHtml = await middleResponse.text();
  assert.match(middleHtml, /href="\/world\/part-1\/the-girl"/i);
  assert.match(middleHtml, /href="\/world\/part-1\/hotel-rafflesia"/i);
  assert.match(middleHtml, /ALL COORDINATES/i);

  const lastResponse = await render("/world/part-1/the-real-gambler-blues");
  const lastHtml = await lastResponse.text();
  assert.match(lastHtml, /href="\/world\/part-1\/inochi-betting"/i);
  assert.doesNotMatch(lastHtml, />NEXT</i);
});

test("unknown coordinate routes return the authored 404 page", async () => {
  const response = await render("/world/part-1/not-a-coordinate");
  assert.equal(response.status, 404);

  const html = await response.text();
  assert.match(html, /404 \/ COORDINATE NOT FOUND/i);
  assert.match(html, /RETURN TO WORLD/i);
});

test("canonical sitemap and robots use sadistoji.com", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/sadistoji\.com\/world\/part-1/i);
  assert.match(
    sitemap,
    /https:\/\/sadistoji\.com\/world\/part-1\/the-man/i,
  );
  assert.doesNotMatch(sitemap, /chatgpt\.site/i);

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Host: https:\/\/sadistoji\.com/i);
  assert.match(robots, /Sitemap: https:\/\/sadistoji\.com\/sitemap\.xml/i);
});
