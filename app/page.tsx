"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  OverlayFrame,
  SectionMarker,
  SiteFrame,
  SiteHeader,
} from "./site-ui";

type OverlayState = "music" | "contact" | null;

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [overlay, setOverlay] = useState<OverlayState>(null);

  const closeOverlay = () => {
    setOverlay(null);
    router.replace(pathname, { scroll: false });
  };
  const handleEscape = useEffectEvent(() => {
    closeOverlay();
  });

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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleEscape();
      }
    };

    if (overlay) {
      window.addEventListener("keydown", onKeyDown);
      document.body.classList.add("body-overlay-open");
    }

    return () => {
      window.removeEventListener("popstate", syncOverlayFromLocation);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("body-overlay-open");
    };
  }, [overlay]);

  const openOverlay = (nextOverlay: Exclude<OverlayState, null>) => {
    setOverlay(nextOverlay);
    router.replace(`${pathname}?overlay=${nextOverlay}`, { scroll: false });
  };

  return (
    <SiteFrame pageClassName={overlay ? "has-open-overlay" : ""}>
      <SiteHeader
        overlay={overlay}
        onMusicOpen={() => openOverlay("music")}
        onContactOpen={() => openOverlay("contact")}
      />

      <section className="hero-panel" aria-labelledby="toji-heading">
        <div className="hero-panel__field" />
        <h1 className="hero-panel__title" id="toji-heading">
          TOJI
        </h1>
        <div className="hero-panel__meta">
          <p>ARTIST / PRODUCER /</p>
          <p>WORLD BUILDER</p>
          <span>SEOUL — JAPAN</span>
        </div>
        <div className="hero-panel__art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath("/toji/hero-artwork.png")}
            alt="TOJI character artwork with lowered head, black suit, white shirt, and black tie."
          />
        </div>
      </section>

      <section className="statement-panel" aria-label="Artist statement">
        <SectionMarker />
        <p className="statement-panel__jp">{japaneseStatement}</p>
        <div className="statement-panel__copy">
          {artistStatement.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="music-section-title">
        <div className="content-section__heading">
          <h2 id="music-section-title">MUSIC</h2>
          <Link href="/?overlay=music">VIEW ALL</Link>
        </div>
        <div className="release-list">
          {releases.map((release) => (
            <article className="release-card" id={release.id} key={release.id}>
              <div
                className={`release-card__art release-card__art--${release.artworkVariant}`}
                aria-label={release.artworkLabel}
                role="img"
              >
                <span>{release.artworkLabel}</span>
              </div>
              <div className="release-card__body">
                <div className="release-card__header">
                  <span className="release-card__index">{release.index}</span>
                  <h3>{release.title}</h3>
                </div>
                <p className="release-card__date">{release.date}</p>
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
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section content-section--contact" aria-labelledby="contact-section-title">
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
