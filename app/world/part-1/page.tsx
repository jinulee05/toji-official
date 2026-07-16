"use client";

import { Fragment, useState } from "react";
import { episodes, type Episode } from "../../site-content";
import { WorldShell } from "../world-shell";

const horizontalEpisodes = episodes
  .filter((episode) => episode.axis === "origin" || episode.axis === "horizontal")
  .sort((a, b) => a.position - b.position);

const verticalEpisodes = episodes
  .filter((episode) => episode.axis === "vertical")
  .sort((a, b) => a.position - b.position);

export default function PartOnePage() {
  const [selectedId, setSelectedId] = useState("the-man");
  const selectedEpisode =
    episodes.find((episode) => episode.id === selectedId) ?? horizontalEpisodes[0];

  return (
    <WorldShell destination="part-1">
      <section className="archive-hero" aria-labelledby="archive-title">
        <p>THE OUTSIDER</p>
        <h1 id="archive-title">PART I</h1>
      </section>

      <section className="archive-axis" aria-label="PART I episode coordinate archive">
        <div className="archive-axis__map">
          <div className="archive-axis__horizontal" aria-label="Horizontal coordinates">
            {horizontalEpisodes.map((episode, index) => (
              <Fragment key={episode.id}>
                {index > 0 ? <span className="archive-axis__line" aria-hidden="true" /> : null}
                <CoordinateNode
                  episode={episode}
                  selected={episode.id === selectedEpisode.id}
                  onSelect={setSelectedId}
                />
              </Fragment>
            ))}
          </div>

          <div className="archive-axis__vertical" aria-label="Vertical coordinates">
            {verticalEpisodes.map((episode) => (
              <Fragment key={episode.id}>
                <span
                  className="archive-axis__line archive-axis__line--vertical"
                  aria-hidden="true"
                />
                <CoordinateNode
                  episode={episode}
                  selected={episode.id === selectedEpisode.id}
                  onSelect={setSelectedId}
                />
              </Fragment>
            ))}
          </div>

          <EpisodeDetail episode={selectedEpisode} />
        </div>
      </section>
    </WorldShell>
  );
}

function CoordinateNode({
  episode,
  selected,
  onSelect,
}: {
  episode: Episode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      aria-label={`${episode.coordinate}: ${episode.title}`}
      aria-pressed={selected}
      className={`archive-axis__node${episode.axis === "origin" ? " is-origin" : ""}${
        selected ? " is-selected" : ""
      }`}
      onClick={() => onSelect(episode.id)}
      type="button"
    >
      <span className="archive-axis__coordinate">{episode.coordinate}</span>
      <span className="archive-axis__node-title">{episode.title}</span>
    </button>
  );
}

function EpisodeDetail({ episode }: { episode: Episode }) {
  const titleClass =
    episode.title.length > 22
      ? " is-long"
      : episode.title.length > 15
        ? " is-medium"
        : "";

  return (
    <article className="archive-axis__detail" aria-live="polite">
      <div className="archive-axis__detail-body" key={episode.id}>
        <span>{episode.episodeLabel ?? `COORDINATE ${episode.coordinate}`}</span>
        <h2 className={titleClass}>{episode.title}</h2>
        {episode.description ? (
          <div className="archive-axis__description">
            {episode.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}
        <p className="archive-axis__status">
          {episode.status === "available" ? "ARCHIVE OPEN" : "ARCHIVE LOCKED"}
        </p>
      </div>
    </article>
  );
}
