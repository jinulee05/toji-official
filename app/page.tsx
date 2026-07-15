"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  artistStatement,
  contactLinks,
  japaneseStatement,
  listenLinks,
  releases,
} from "./site-content";
import { withBasePath } from "./runtime-paths";
import {
  FooterMark,
  ImpactTransition,
  OverlayFrame,
  SectionMarker,
  SiteFrame,
  SiteHeader,
} from "./site-ui";

type OverlayState = "music" | "contact" | null;

export default function Home() {
  const [overlay, setOverlay] = useState<OverlayState>(null);

  const closeOverlay = () => {
    setOverlay(null);
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.hash}`,
    );
  };
  useEffect(() => {
    const syncOverlayFromLocation = () => {
      const requestedOverlay = new URLSearchParams(window.location.search).get(
        "overlay",
      );

      setOverlay(
        requestedOverlay === "music" || requestedOverlay === "contact"
          ? requestedOverlay
          : null,
      );
    };

    syncOverlayFromLocation();
    window.addEventListener("popstate", syncOverlayFromLocation);

    if (overlay) {
      document.body.classList.add("body-overlay-open");
    }

    return () => {
      window.removeEventListener("popstate", syncOverlayFromLocation);
      document.body.classList.remove("body-overlay-open");
    };
  }, [overlay]);

  const openOverlay = (nextOverlay: Exclude<OverlayState, null>) => {
    setOverlay(nextOverlay);
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?overlay=${nextOverlay}`,
    );
  };

  return (
    <SiteFrame pageClassName={overlay ? "has-open-overlay" : ""}>
      <SiteHeader
        overlay={overlay}
        onMusicOpen={() => openOverlay("music")}
        onContactOpen={() => openOverlay("contact")}
      />

      <section className="hero-panel" aria-labelledby="toji-heading">
        <div className="hero-panel__field">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-panel__image"
            src={withBasePath("/toji/hero-final.png")}
            alt="TOJI in a black suit and tie with a faceless white stitched head against an oxblood field."
          />
          <HeroInkOverlay />
        </div>
        <h1 className="hero-panel__title" id="toji-heading">
          TOJI
        </h1>
        <div className="hero-panel__meta">
          <p>ARTIST / PRODUCER /</p>
          <p>WORLD BUILDER</p>
          <span>SEOUL — JAPAN</span>
        </div>
      </section>

      <ImpactTransition variant="hero" />

      <section className="statement-panel reveal-section" aria-label="Artist statement">
        <SectionMarker />
        <p className="statement-panel__jp">{japaneseStatement}</p>
        <div className="statement-panel__copy">
          {artistStatement.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="content-section reveal-section" aria-labelledby="music-section-title">
        <div className="content-section__heading">
          <h2 id="music-section-title">MUSIC</h2>
          <Link href="/?overlay=music">VIEW ALL</Link>
        </div>
        <div className="release-list">
          {releases.map((release) => (
            <article className="release-card" id={release.id} key={release.id}>
              <span className="release-card__index">{release.index}</span>
              <div
                className={`release-card__art release-card__art--${release.artworkVariant}`}
                aria-label={release.artworkLabel}
                role="img"
              >
                <span>{release.artworkLabel}</span>
              </div>
              <div className="release-card__identity">
                <h3>{release.title}</h3>
                <p className="release-card__date">{release.date}</p>
              </div>
              <div className="release-card__description">
                {release.description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="release-card__links" aria-label={`${release.title} streaming links`}>
                {release.links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
                <span aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ImpactTransition variant="music" />

      <section className="content-section content-section--contact reveal-section" aria-labelledby="contact-section-title">
        <div className="content-section__heading">
          <h2 id="contact-section-title">CONTACT</h2>
        </div>
        <div className="contact-strip">
          {contactLinks.slice(0, 3).map((entry, index) => (
            <span key={entry.label}>
              <a href={entry.href}>{entry.label}</a>
              {index < 2 ? <span aria-hidden="true"> / </span> : null}
            </span>
          ))}
        </div>
      </section>

      <FooterMark />

      <OverlayFrame title="MUSIC" open={overlay === "music"} onClose={closeOverlay}>
        <div className="overlay-block">
          <h2 className="overlay-block__title">MUSIC</h2>
          <section className="overlay-section">
            <h3>LISTEN</h3>
            <div className="overlay-links">
              {listenLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
              <span aria-hidden="true">→</span>
            </div>
          </section>
          <section className="overlay-section">
            <h3>RELEASES</h3>
            <div className="overlay-release-list">
              {releases.map((release) => (
                <a
                  className="overlay-release-row"
                  href={`#${release.id}`}
                  key={release.id}
                >
                  <span>{release.index}</span>
                  <strong>{release.title}</strong>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </OverlayFrame>

      <OverlayFrame
        title="CONTACT"
        open={overlay === "contact"}
        onClose={closeOverlay}
      >
        <div className="overlay-block overlay-block--contact">
          <h2 className="overlay-block__title">CONTACT</h2>
          <div className="overlay-contact-list">
            {contactLinks.map((entry) => (
              <a className="overlay-contact-row" href={entry.href} key={entry.label}>
                <span>{entry.label}</span>
                <strong>{entry.value}</strong>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </OverlayFrame>
    </SiteFrame>
  );
}

function HeroInkOverlay() {
  return (
    <svg
      className="hero-panel__ink"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="hero-panel__ink-layer hero-panel__ink-layer--mass-left">
        <path d="M0 900V644c53 8 94 31 125 70 34 42 86 64 158 67l-52 24 78 29c-99-7-172-23-218-47-39-20-69-46-91-78Z" />
        <path d="M0 588c61 12 109 4 145-24 31-24 45-53 40-88 34 36 35 76 2 121-31 42-93 64-187 65Z" />
      </g>
      <g className="hero-panel__ink-layer hero-panel__ink-layer--hook-right">
        <path d="M1600 0h-169c37 27 50 58 39 91-8 25-31 48-68 70 53-14 96-7 129 20 28 23 51 60 69 111Z" />
        <path d="M1600 273c-54 13-93 40-117 81-20 34-20 70 0 109-42-23-65-55-68-94-3-41 17-78 61-111 34-25 75-42 124-49Z" />
        <path d="M1600 506c-70-2-127-20-171-55 36 51 88 84 155 98l16 3Z" />
      </g>
      <g className="hero-panel__ink-layer hero-panel__ink-layer--pressure-left">
        <path d="M0 194v276c29-39 67-66 114-80 44-13 77-43 101-91-43 30-82 45-118 44-38-1-70-19-97-54Z" />
        <path d="M0 489c65-15 119-47 162-96-27 61-72 103-136 126L0 526Z" />
      </g>
      <g className="hero-panel__ink-layer hero-panel__ink-layer--fragments">
        <path d="M92 756l50-18-19 35 34 16-62 18Z" />
        <path d="M291 804l42-8-14 24 26 13-52 11Z" />
        <path d="M1327 733l54-13-18 31 39 14-68 14Z" />
        <path d="M1472 616l43-22-9 35 31 7-48 26Z" />
        <path d="M1541 476l25-10-7 21 20 5-31 14Z" />
      </g>
    </svg>
  );
}
