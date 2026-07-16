"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import {
  getCoordinateLabel,
  getWorldEpisodePath,
  getWorldPartEpisodes,
  type WorldEpisode,
} from "../../world-content";
import { WorldShell } from "../world-shell";

const episodes = getWorldPartEpisodes("part-1");

const horizontalEpisodes = episodes
  .filter((episode) => episode.axis === "origin" || episode.axis === "horizontal")
  .sort((a, b) => a.position - b.position);

const verticalEpisodes = episodes
  .filter((episode) => episode.axis === "vertical")
  .sort((a, b) => a.position - b.position);

export default function PartOnePage() {
  const [selectedId, setSelectedId] = useState(horizontalEpisodes[0].slug);
  const selectedEpisode =
    episodes.find((episode) => episode.slug === selectedId) ?? horizontalEpisodes[0];

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
              <Fragment key={episode.slug}>
                {index > 0 ? <span className="archive-axis__line" aria-hidden="true" /> : null}
                <CoordinateNode
                  episode={episode}
                  selected={episode.slug === selectedEpisode.slug}
                  onPreview={setSelectedId}
                />
              </Fragment>
            ))}
          </div>

          <div className="archive-axis__vertical" aria-label="Vertical coordinates">
            {verticalEpisodes.map((episode) => (
              <Fragment key={episode.slug}>
                <span
                  className="archive-axis__line archive-axis__line--vertical"
                  aria-hidden="true"
                />
                <CoordinateNode
                  episode={episode}
                  selected={episode.slug === selectedEpisode.slug}
                  onPreview={setSelectedId}
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
  onPreview,
}: {
  episode: WorldEpisode;
  selected: boolean;
  onPreview: (slug: string) => void;
}) {
  return (
    <Link
      aria-current={selected ? "true" : undefined}
      aria-label={`${getCoordinateLabel(episode)}: ${episode.title}`}
      className={`archive-axis__node${episode.axis === "origin" ? " is-origin" : ""}${
        selected ? " is-selected" : ""
      }`}
      href={getWorldEpisodePath("part-1", episode)}
      onFocus={() => onPreview(episode.slug)}
      onMouseEnter={() => onPreview(episode.slug)}
    >
      <span className="archive-axis__coordinate">{episode.axisCoordinate}</span>
      <span className="archive-axis__node-title">{episode.title}</span>
    </Link>
  );
}

function EpisodeDetail({ episode }: { episode: WorldEpisode }) {
  const titleClass =
    episode.title.length > 22
      ? " is-long"
      : episode.title.length > 15
        ? " is-medium"
        : "";

  return (
    <article className="archive-axis__detail" aria-live="polite">
      <Link
        aria-label={`Read ${getCoordinateLabel(episode)}: ${episode.title}`}
        className="archive-axis__detail-link"
        href={getWorldEpisodePath("part-1", episode)}
        key={episode.slug}
      >
        <div className="archive-axis__detail-body">
        <span>{getCoordinateLabel(episode)}</span>
        <h2 className={titleClass}>{episode.title}</h2>
        {episode.summary.length > 0 ? (
          <div className="archive-axis__description">
            {episode.summary.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}
        <p className="archive-axis__status">
          {episode.published ? "ARCHIVE OPEN" : "ARCHIVE LOCKED"}
        </p>
        </div>
      </Link>
    </article>
  );
}
