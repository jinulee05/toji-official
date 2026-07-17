import partOneData from "../content/world/part-1.json";
import partTwoData from "../content/world/part-2.json";

export type WorldPart = 1 | 2;
export type WorldPartSlug = "part-1" | "part-2";
export type WorldEpisodeImage = {
  src: string;
  alt: string;
};

export type WorldEpisodePdf = {
  path: string;
  label: string;
  contentWarning: string;
};

export type WorldEpisodeSeo = {
  pageTitle: string;
  openGraphTitle: string;
  description: string;
};

export type WorldEpisode = {
  part: WorldPart;
  coordinate: string;
  axisCoordinate: string;
  slug: string;
  title: string;
  koreanTitle?: string;
  subtitle?: string;
  summary: string[];
  content: string[];
  images: WorldEpisodeImage[];
  pdf?: WorldEpisodePdf;
  seo?: WorldEpisodeSeo;
  published: boolean;
  releaseDate: string | null;
  previousEpisode: string | null;
  nextEpisode: string | null;
  axis: "origin" | "horizontal" | "vertical";
  position: number;
};

const worldEpisodeData: Record<WorldPartSlug, WorldEpisode[]> = {
  "part-1": partOneData as WorldEpisode[],
  "part-2": partTwoData as WorldEpisode[],
};

export const worldPartSlugs = Object.keys(worldEpisodeData) as WorldPartSlug[];

export const worldEpisodes = worldPartSlugs.flatMap(
  (partSlug) => worldEpisodeData[partSlug],
);

export function getWorldPartEpisodes(partSlug: WorldPartSlug) {
  return worldEpisodeData[partSlug];
}

export function getWorldEpisode(partSlug: WorldPartSlug, slug: string) {
  return worldEpisodeData[partSlug].find((episode) => episode.slug === slug);
}

export function getWorldEpisodePath(
  partSlug: WorldPartSlug,
  episode: Pick<WorldEpisode, "slug">,
) {
  return `/world/${partSlug}/${episode.slug}`;
}

export function getCoordinateLabel(episode: Pick<WorldEpisode, "coordinate">) {
  return `COORDINATE ${episode.coordinate}`;
}

export function isWorldPartSlug(value: string): value is WorldPartSlug {
  return worldPartSlugs.includes(value as WorldPartSlug);
}
