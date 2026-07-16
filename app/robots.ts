import type { MetadataRoute } from "next";
import { absoluteSiteUrl, officialSiteOrigin } from "./site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: officialSiteOrigin,
    sitemap: absoluteSiteUrl("/sitemap.xml"),
  };
}
