import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { withBasePath } from "../../../runtime-paths";
import { createRouteMetadata } from "../../../site-url";
import {
  getCoordinateLabel,
  getWorldEpisode,
  getWorldEpisodePath,
  isWorldPartSlug,
  worldEpisodes,
  type WorldEpisode,
  type WorldPartSlug,
} from "../../../world-content";
import { WorldShell } from "../../world-shell";

type ReaderPageProps = {
  params: Promise<{
    part: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return worldEpisodes.map((episode) => ({
    part: `part-${episode.part}`,
    slug: episode.slug,
  }));
}

export async function generateMetadata({
  params,
}: ReaderPageProps): Promise<Metadata> {
  const { part, slug } = await params;

  if (!isWorldPartSlug(part)) {
    return {};
  }

  const episode = getWorldEpisode(part, slug);

  if (!episode) {
    return {};
  }

  return createRouteMetadata({
    title: `${getCoordinateLabel(episode)} | ${episode.title} | TOJI`,
    description:
      episode.summary.join(" ") ||
      `${getCoordinateLabel(episode)} from THE OUTSIDER ${partTitle(part)}.`,
    pathname: getWorldEpisodePath(part, episode),
    noIndex: !episode.published,
  });
}

export default async function CoordinateReaderPage({ params }: ReaderPageProps) {
  const { part, slug } = await params;

  if (!isWorldPartSlug(part)) {
    notFound();
  }

  const episode = getWorldEpisode(part, slug);

  if (!episode) {
    notFound();
  }

  const previousEpisode = adjacentEpisode(part, episode.previousEpisode);
  const nextEpisode = adjacentEpisode(part, episode.nextEpisode);

  return (
    <WorldShell destination={part}>
      <main className="coordinate-reader">
        <header className="coordinate-reader__header">
          <span>{getCoordinateLabel(episode)}</span>
          <h1>{episode.title}</h1>
          {episode.summary.length > 0 ? (
            <div className="coordinate-reader__summary">
              {episode.summary.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : null}
        </header>

        {episode.published ? (
          <article className="coordinate-reader__record">
            <div className="coordinate-reader__copy">
              {episode.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {episode.images.length > 0 ? (
              <div className="coordinate-reader__images">
                {episode.images.map((image) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={image.alt} key={image.src} src={withBasePath(image.src)} />
                ))}
              </div>
            ) : null}
          </article>
        ) : (
          <section
            aria-label="Restricted coordinate notice"
            className="coordinate-reader__record coordinate-reader__record--restricted"
          >
            <div>
              <span>RESTRICTED ACCESS</span>
              <h2>This coordinate is currently sealed.</h2>
              <p>The full record will be released soon.</p>
            </div>
          </section>
        )}

        <nav className="coordinate-reader__nav" aria-label="Coordinate navigation">
          {previousEpisode ? (
            <ReaderNavLink
              direction="PREVIOUS"
              episode={previousEpisode}
              part={part}
            />
          ) : (
            <span aria-hidden="true" />
          )}
          <Link className="coordinate-reader__index-link" href={`/world/${part}`}>
            ALL COORDINATES
          </Link>
          {nextEpisode ? (
            <ReaderNavLink direction="NEXT" episode={nextEpisode} part={part} />
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      </main>
    </WorldShell>
  );
}

function ReaderNavLink({
  direction,
  episode,
  part,
}: {
  direction: "PREVIOUS" | "NEXT";
  episode: WorldEpisode;
  part: WorldPartSlug;
}) {
  return (
    <Link
      className={`coordinate-reader__episode-link is-${direction.toLowerCase()}`}
      href={getWorldEpisodePath(part, episode)}
    >
      <span>{direction}</span>
      <strong>{getCoordinateLabel(episode)}</strong>
    </Link>
  );
}

function adjacentEpisode(part: WorldPartSlug, slug: string | null) {
  return slug ? getWorldEpisode(part, slug) : undefined;
}

function partTitle(part: WorldPartSlug) {
  return part === "part-1" ? "PART I" : "PART II";
}
