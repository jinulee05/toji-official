import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "./site-url";
import { getWorldEpisodePath, worldEpisodes } from "./world-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const primaryRoutes: MetadataRoute.Sitemap = [
    "/",
    "/world",
    "/world/part-1",
    "/world/part-2",
  ].map((pathname) => ({
    url: absoluteSiteUrl(pathname),
    changeFrequency: pathname === "/" ? "monthly" : "weekly",
    priority: pathname === "/" ? 1 : 0.8,
  }));

  const publishedCoordinates = worldEpisodes
    .filter((episode) => episode.published)
    .map((episode) => ({
      url: absoluteSiteUrl(
        getWorldEpisodePath(`part-${episode.part}`, episode),
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...primaryRoutes, ...publishedCoordinates];
}
