"use client";

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
  ImpactTransition,
  OverlayFrame,
  SiteFrame,
  SiteHeader,
} from "../site-ui";

const defaultEpisodeId = "the-man";
type OverlayState = "music" | "contact" | null;

export default function WorldPage() {
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [selectedId, setSelectedId] = useState(defaultEpisodeId);

  const horizontalEpisodes = useMemo(
    () =>
      episodes
        .filter((entry) => entry.axis === "origin" || entry.axis === "horizontal")
        .sort((a, b) => a.position - b.position),
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

      <ImpactTransition variant="world" />

      <section className="world-axis reveal-section" aria-label="Episode coordinate index">
        <div className="world-axis__map">
          <WorldAxisLines />

          <div className="world-axis__horizontal-nodes">
            {horizontalEpisodes.map((episode) => (
              <button
                aria-pressed={selectedId === episode.id}
                className={`world-axis__node world-axis__node--horizontal${
                  episode.axis === "origin" ? " is-origin" : ""
                }${selectedId === episode.id ? " is-selected" : ""}`}
                key={episode.id}
                onClick={() => setSelectedId(episode.id)}
                type="button"
              >
                {episode.coordinate}
              </button>
            ))}
          </div>

          <div className="world-axis__vertical-nodes">
            <span aria-hidden="true" />
            {verticalEpisodes.map((episode) => (
              <button
                aria-pressed={selectedId === episode.id}
                className={`world-axis__node world-axis__node--vertical${
                  selectedId === episode.id ? " is-selected" : ""
                }`}
                key={episode.id}
                onClick={() => setSelectedId(episode.id)}
                type="button"
              >
                {episode.coordinate}
              </button>
            ))}
          </div>
        </div>

        <div className="world-axis__detail">
          <div className="world-axis__detail-body" key={selectedEpisode.id}>
            <span>
              {selectedEpisode.status === "available"
                ? selectedEpisode.episodeLabel
                : `ARCHIVE ${selectedEpisode.coordinate}`}
            </span>
            <h2 className={`is-${titleLength(selectedEpisode.title)}`}>
              {selectedEpisode.title}
            </h2>
            {selectedEpisode.status === "available" ? (
              <div>
                {selectedEpisode.description?.map((line) => <p key={line}>{line}</p>)}
              </div>
            ) : null}
            {selectedEpisode.status === "available" ? (
              <button type="button">READ →</button>
            ) : (
              <button type="button" disabled>
                LOCKED
              </button>
            )}
          </div>
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

function WorldAxisLines() {
  const horizontalCenters = [50, 150, 250, 350, 450, 550, 650];
  const verticalCenters = [50, 150, 250, 350];

  return (
    <svg
      className="world-axis__lines"
      viewBox="0 0 700 400"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="axis-fade-horizontal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.2" stopColor="white" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.86" />
          <stop offset="0.8" stopColor="white" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="axis-fade-vertical" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.22" stopColor="white" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.86" />
          <stop offset="0.78" stopColor="white" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="world-axis__line-group world-axis__line-group--horizontal">
        {horizontalCenters.slice(0, -1).map((center, index) => (
          <line
            key={center}
            x1={center}
            y1="50"
            x2={horizontalCenters[index + 1]}
            y2="50"
            stroke="url(#axis-fade-horizontal)"
          />
        ))}
      </g>
      <g className="world-axis__line-group world-axis__line-group--vertical">
        {verticalCenters.slice(0, -1).map((center, index) => (
          <line
            key={center}
            x1="50"
            y1={center}
            x2="50"
            y2={verticalCenters[index + 1]}
            stroke="url(#axis-fade-vertical)"
          />
        ))}
      </g>
    </svg>
  );
}

function titleLength(title: string) {
  if (title.length >= 21) {
    return "long";
  }

  if (title.length >= 14) {
    return "medium";
  }

  return "short";
}
