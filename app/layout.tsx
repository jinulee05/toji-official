import type { Metadata } from "next";
import "./globals.css";
import { withBasePath } from "./runtime-paths";
import { siteDescription, siteTitle } from "./site-content";
import { officialSiteUrl } from "./site-url";

export const metadata: Metadata = {
  metadataBase: officialSiteUrl,
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "TOJI",
    title: siteTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={withBasePath("/favicon.svg")} type="image/svg+xml" />
        <link rel="shortcut icon" href={withBasePath("/favicon.svg")} />
      </head>
      <body>{children}</body>
    </html>
  );
}
