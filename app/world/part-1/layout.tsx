import { createRouteMetadata } from "../../site-url";

export const metadata = createRouteMetadata({
  title: "PART I | THE OUTSIDER | TOJI",
  description: "THE OUTSIDER PART I coordinate archive.",
  pathname: "/world/part-1",
});

export default function PartOneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
