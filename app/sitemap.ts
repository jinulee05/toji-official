import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "./site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/world", "/world/part-1", "/world/part-2"].map(
    (pathname) => ({
      url: absoluteSiteUrl(pathname),
      changeFrequency: pathname === "/" ? "monthly" : "weekly",
      priority: pathname === "/" ? 1 : 0.8,
    }),
  );
}
