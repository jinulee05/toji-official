"use client";

import { useEffect, useState, type CSSProperties } from "react";
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

const defaultEpisodeId = "the-man";
type OverlayState = "music" | "contact" | null;

const roadmapPoints = [
  { id: "the-man", x: 50, y: 50, origin: true },
  { id: "the-girl", x: 34, y: 16 },
  { id: "rooftop-signal", x: 52, y: 11 },
  { id: "hotel-rafflesia", x: 72, y: 20 },
  { id: "backroom-nando", x: 84, y: 39 },
  { id: "vista-house", x: 82, y: 64 },
  { id: "zombie-man", x: 62, y: 82 },
  { id: "the-guidebook", x: 40, y: 82 },
  { id: "inochi-betting", x: 19, y: 63 },
  { id: "the-real-gambler-blues", x: 18, y: 36 },
] as const;

export default function WorldPage() {
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [selectedId, setSelectedId] = useState(defaultEpisodeId);

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
        <div className="world-axis__map">
          <WorldRoadmapLines selectedId={selectedId} />

          <div className="world-axis__nodes">
            {roadmapPoints.map((point) => {
              const episode = episodes.find((entry) => entry.id === point.id)!;

              return (
                <button
                  aria-label={episode.coordinate}
                  aria-pressed={selectedId === episode.id}
                  className={`world-axis__node${
                    "origin" in point && point.origin ? " is-origin" : ""
                  }${selectedId === episode.id ? " is-selected" : ""}`}
                  key={episode.id}
                  onClick={() => setSelectedId(episode.id)}
                  style={
                    {
                      "--node-x": `${point.x}%`,
                      "--node-y": `${point.y}%`,
                    } as CSSProperties
                  }
                  type="button"
                >
                  <span className="world-axis__node-coordinate" aria-hidden="true">
                    — {episode.coordinate} —
                  </span>
                  {"origin" in point && point.origin ? null : (
                    <span className="world-axis__node-title" aria-hidden="true">
                      {roadmapTitle(episode.title)}
                    </span>
                  )}
                </button>
              );
            })}
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

function WorldRoadmapLines({ selectedId }: { selectedId: string }) {
  const selectedPoint =
    roadmapPoints.find((point) => point.id === selectedId) ?? roadmapPoints[0];
  const handPoint = selectedPoint.id === defaultEpisodeId ? roadmapPoints[1] : selectedPoint;

  return (
    <svg
      className="world-axis__roadmap"
      viewBox="0 0 1000 660"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="roadmap-ray-fade" cx="50%" cy="50%" r="62%">
          <stop offset="0" stopColor="white" stopOpacity="0.66" />
          <stop offset="0.54" stopColor="white" stopOpacity="0.28" />
          <stop offset="1" stopColor="white" stopOpacity="0.04" />
        </radialGradient>
        <linearGradient id="roadmap-hand-fade" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.25" stopColor="white" stopOpacity="0.24" />
          <stop offset="1" stopColor="white" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      <g className="world-axis__orbits">
        <ellipse cx="500" cy="330" rx="240" ry="158" />
        <ellipse cx="500" cy="330" rx="342" ry="248" />
      </g>

      <g className="world-axis__rays">
        {roadmapPoints.slice(1).map((point) => (
          <line
            className={selectedId === point.id ? "is-selected" : undefined}
            key={point.id}
            x1="500"
            y1="330"
            x2={point.x * 10}
            y2={point.y * 6.6}
          />
        ))}
      </g>

      <line
        className="world-axis__second-hand"
        x1="500"
        y1="330"
        x2={handPoint.x * 10}
        y2={handPoint.y * 6.6}
      />
      <g className="world-axis__center-mark">
        <circle cx="500" cy="330" r="13" />
        <circle cx="500" cy="330" r="4" />
      </g>
    </svg>
  );
}

function roadmapTitle(title: string) {
  return title.split(" ").join(" — ");
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
