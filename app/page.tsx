"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  artistStatement,
  contactLinks,
  japaneseStatement,
  releases,
} from "./site-content";
import { withBasePath } from "./runtime-paths";
import {
  FooterMark,
  MusicOverlayContent,
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
        </div>
        <h1 className="visually-hidden" id="toji-heading">
          TOJI
        </h1>
      </section>

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
              <div className="release-card__art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={release.artworkAlt}
                  className="release-card__image"
                  decoding="async"
                  height="3000"
                  loading="lazy"
                  src={withBasePath(release.artwork)}
                  width="3000"
                />
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
                  <a
                    aria-label={`Listen to ${release.title} on ${link.label}`}
                    href={link.href}
                    key={link.label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
                <span aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      </section>

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
        <MusicOverlayContent />
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
