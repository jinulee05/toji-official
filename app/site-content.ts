export type StreamingLink = {
  label: string;
  href: string;
  placeholder: boolean;
};

export type Release = {
  id: string;
  index: string;
  title: string;
  date: string;
  description: string[];
  artworkLabel: string;
  artworkVariant: "skyline" | "glass";
  links: StreamingLink[];
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  placeholder: boolean;
};

export type Episode = {
  id: string;
  coordinate: string;
  title: string;
  episodeLabel?: string;
  description?: string[];
  status: "available" | "locked";
  slug?: string;
  url?: string;
  axis: "origin" | "horizontal" | "vertical";
  position: number;
};

export const siteTitle = "TOJI | Official Site";
export const siteDescription =
  "Official TOJI archive for music, world, and contact information.";

export const artistStatement = [
  "Japanese-language pop and R&B.",
  "Music, image and recurring fiction.",
];

export const japaneseStatement = "音楽と映像、そして反復する物語。";

export const releases: Release[] = [
  {
    id: "rooftop-signal",
    index: "01",
    title: "ROOFTOP SIGNAL",
    date: "2026.03.10",
    description: ["A cold signal from the roof."],
    artworkLabel: "OFFICIAL ARTWORK PENDING",
    artworkVariant: "skyline",
    links: [
      {
        label: "SPOTIFY",
        href: "https://example.com/toji/rooftop-signal/spotify",
        placeholder: true,
      },
      {
        label: "YOUTUBE",
        href: "https://example.com/toji/rooftop-signal/youtube",
        placeholder: true,
      },
      {
        label: "APPLE MUSIC",
        href: "https://example.com/toji/rooftop-signal/apple-music",
        placeholder: true,
      },
    ],
  },
  {
    id: "medium",
    index: "02",
    title: "MEDIUM",
    date: "2026.06.18",
    description: ["A night that does not end.", "It only loses temperature."],
    artworkLabel: "OFFICIAL ARTWORK PENDING",
    artworkVariant: "glass",
    links: [
      {
        label: "SPOTIFY",
        href: "https://example.com/toji/medium/spotify",
        placeholder: true,
      },
      {
        label: "YOUTUBE",
        href: "https://example.com/toji/medium/youtube",
        placeholder: true,
      },
      {
        label: "APPLE MUSIC",
        href: "https://example.com/toji/medium/apple-music",
        placeholder: true,
      },
    ],
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: "INSTAGRAM",
    value: "@sadistoji",
    href: "https://instagram.com/sadistoji",
    placeholder: false,
  },
  {
    label: "YOUTUBE",
    value: "@SADISTOJI",
    href: "https://youtube.com/@SADISTOJI",
    placeholder: false,
  },
  {
    label: "EMAIL",
    value: "toji@hunter-official.com",
    href: "mailto:toji@hunter-official.com",
    placeholder: true,
  },
  {
    label: "BUSINESS / COLLABORATION",
    value: "INQUIRE",
    href: "mailto:toji@hunter-official.com?subject=Business%20Inquiry",
    placeholder: true,
  },
];

export const worldPrelude = [
  "A recurring world told through music, image and episodes.",
  "Crime. Memory. Desire. Disappearance.",
];

export const episodes: Episode[] = [
  {
    id: "the-man",
    coordinate: "X",
    title: "THE MAN",
    status: "locked",
    axis: "origin",
    position: 0,
  },
  {
    id: "the-girl",
    coordinate: "0",
    title: "THE GIRL",
    status: "locked",
    axis: "horizontal",
    position: 1,
  },
  {
    id: "rooftop-signal",
    coordinate: "1",
    title: "ROOFTOP SIGNAL",
    episodeLabel: "EPISODE 01",
    description: ["A signal from the roof.", "A woman who should not be seen."],
    status: "available",
    slug: "rooftop-signal",
    url: "/world/rooftop-signal",
    axis: "horizontal",
    position: 2,
  },
  {
    id: "hotel-rafflesia",
    coordinate: "2",
    title: "HOTEL RAFFLESIA",
    status: "locked",
    axis: "horizontal",
    position: 3,
  },
  {
    id: "backroom-nando",
    coordinate: "3",
    title: "BACKROOM NANDO (房)",
    status: "locked",
    axis: "horizontal",
    position: 4,
  },
  {
    id: "vista-house",
    coordinate: "4",
    title: "VISTA HOUSE",
    status: "locked",
    axis: "horizontal",
    position: 5,
  },
  {
    id: "zombie-man",
    coordinate: "5",
    title: "ZOMBIE MAN",
    status: "locked",
    axis: "horizontal",
    position: 6,
  },
  {
    id: "the-guidebook",
    coordinate: "A",
    title: "THE GUIDEBOOK",
    status: "locked",
    axis: "vertical",
    position: 1,
  },
  {
    id: "inochi-betting",
    coordinate: "B",
    title: "INOCHI BETTING",
    status: "locked",
    axis: "vertical",
    position: 2,
  },
  {
    id: "the-real-gambler-blues",
    coordinate: "C",
    title: "THE REAL GAMBLER BLUES",
    status: "locked",
    axis: "vertical",
    position: 3,
  },
];

export const listenLinks: StreamingLink[] = [
  {
    label: "SPOTIFY",
    href: "https://example.com/toji/listen/spotify",
    placeholder: true,
  },
  {
    label: "YOUTUBE",
    href: "https://example.com/toji/listen/youtube",
    placeholder: true,
  },
  {
    label: "APPLE MUSIC",
    href: "https://example.com/toji/listen/apple-music",
    placeholder: true,
  },
];

export const placeholderRegistry = [
  "All streaming URLs in app/site-content.ts use example.com placeholders.",
  "The contact email in app/site-content.ts should be confirmed or replaced.",
  "Release artwork is represented by local temporary placeholders in CSS and should be replaced when official art is provided.",
  "Episode story routes are not implemented yet; node URLs in app/site-content.ts are future-ready placeholders.",
];
