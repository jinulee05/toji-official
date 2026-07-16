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
        <link rel="icon" href={withBasePath("/favicon.svg?v=2")} type="image/svg+xml" />
        <link rel="icon" href={withBasePath("/favicon-32.png?v=2")} sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href={withBasePath("/favicon.ico?v=2")} />
        <link rel="apple-touch-icon" href={withBasePath("/apple-touch-icon.png?v=2")} sizes="180x180" />
        <link rel="manifest" href={withBasePath("/site.webmanifest?v=2")} />
      </head>
      <body>{children}</body>
    </html>
  );
}
