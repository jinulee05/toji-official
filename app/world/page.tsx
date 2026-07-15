"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  contactLinks,
  episodes,
  listenLinks,
  releases,
  worldPrelude,
} from "../site-content";
import { withBasePath } from "../runtime-paths";
import {
  FooterMark,
  OverlayFrame,
  SiteFrame,
  SiteHeader,
} from "../site-ui";

const defaultEpisodeId = "rooftop-signal";
type OverlayState = "music" | "contact" | null;

export default function WorldPage() {
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [selectedId, setSelectedId] = useState(defaultEpisodeId);

  const horizontalEpisodes = useMemo(
    () => episodes.filter((entry) => entry.axis === "horizontal"),
    [],
  );
  const verticalEpisodes = useMemo(
    () => episodes.filter((entry) => entry.axis === "vertical"),
    [],
  );
  const selectedEpisode =
    episodes.find((entry) => entry.id === selectedId) ??
    episodes.find((entry) => entry.id === defaultEpisodeId)!;

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
    <SiteFrame
      pageClassName={`site-shell--world${overlay ? " has-open-overlay" : ""}`}
    >
      <SiteHeader
        activeSection="world"
        overlay={overlay}
        onMusicOpen={() => openOverlay("music")}
        onContactOpen={() => openOverlay("contact")}
      />

      <section className="world-hero" aria-labelledby="world-title">
        <h1 id="world-title">THE OUTSIDER</h1>
        <p className="world-hero__subtitle">A NOIR OPERA</p>
        <div className="world-hero__copy">
          <p>{worldPrelude[0]}</p>
          <p>{worldPrelude[1]}</p>
        </div>
      </section>

      <section className="world-axis reveal-section" aria-label="Episode coordinate index">
        <div className="world-axis__vertical-line" aria-hidden="true" />
        <div className="world-axis__horizontal-line" aria-hidden="true" />

        <button
          className="world-axis__origin"
          type="button"
          onClick={() => setSelectedId(defaultEpisodeId)}
        >
          X
        </button>

        {horizontalEpisodes.map((episode) => (
          <button
            className={`world-axis__node world-axis__node--horizontal${
              selectedId === episode.id ? " is-selected" : ""
            }`}
            key={episode.id}
            onClick={() => setSelectedId(episode.id)}
            type="button"
            style={
              {
                "--node-position": `${episode.position * 15.5 + 26}%`,
              } as CSSProperties
            }
          >
            {episode.coordinate}
          </button>
        ))}

        {verticalEpisodes.map((episode) => (
          <button
            className={`world-axis__node world-axis__node--vertical${
              selectedId === episode.id ? " is-selected" : ""
            }`}
            key={episode.id}
            onClick={() => setSelectedId(episode.id)}
            type="button"
            style={
              {
                "--node-position": `${episode.position * 20 + 22}%`,
              } as CSSProperties
            }
          >
            {episode.coordinate}
          </button>
        ))}

        <div className="world-axis__detail">
          {selectedEpisode.status === "available" ? (
            <>
              <span>{selectedEpisode.episodeLabel}</span>
              <h2>{selectedEpisode.title}</h2>
              <div>
                {selectedEpisode.description?.map((line) => <p key={line}>{line}</p>)}
              </div>
              <button type="button">READ →</button>
            </>
          ) : (
            <>
              <span>{selectedEpisode.coordinate}</span>
              <h2>{selectedEpisode.coordinate === "0" ? "PROLOGUE" : "UNTITLED"}</h2>
              <div>
                <p>
                  {selectedEpisode.coordinate === "0"
                    ? "Archive entry reserved for the opening axis."
                    : "Metadata unavailable."}
                </p>
                <p>
                  {selectedEpisode.coordinate === "0"
                    ? "Narrative sequencing not yet disclosed."
                    : "Coordinate locked."}
                </p>
              </div>
              <button type="button">UNAVAILABLE</button>
            </>
          )}
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
                  href={`${withBasePath("/")}#${release.id}`}
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
