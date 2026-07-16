import type { Metadata } from "next";

export const officialSiteOrigin = "https://sadistoji.com";
export const officialSiteUrl = new URL(officialSiteOrigin);

export function absoluteSiteUrl(pathname: string) {
  return new URL(pathname, officialSiteUrl).toString();
}

export function createRouteMetadata({
  title,
  description,
  pathname,
  noIndex = false,
}: {
  title: string;
  description: string;
  pathname: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      type: "website",
      siteName: "TOJI",
      title,
      description,
      url: pathname,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
