export type StreamingLink = {
  label: string;
  href: string;
};

export type Release = {
  id: string;
  index: string;
  title: string;
  date: string;
  isrc: string;
  description: string[];
  artwork: string;
  artworkAlt: string;
  links: StreamingLink[];
  moreLinks: StreamingLink[];
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
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
    isrc: "KRMIM2618971",
    description: ["A cold signal from the roof."],
    artwork: "/toji/releases/rooftop-signal.jpg",
    artworkAlt: "Rooftop Signal single cover artwork",
    links: [
      {
        label: "SPOTIFY",
        href: "https://open.spotify.com/track/3ST6arVsLwU53mYWO4CvIY",
      },
      {
        label: "APPLE MUSIC",
        href: "https://music.apple.com/kr/album/rooftop-signal-single/1882636501",
      },
      {
        label: "YOUTUBE",
        href: "https://www.youtube.com/watch?v=o-nGVseti_U",
      },
    ],
    moreLinks: [
      {
        label: "MELON",
        href: "https://www.melon.com/song/detail.htm?songId=601478511",
      },
      {
        label: "GENIE",
        href: "https://www.genie.co.kr/detail/songInfo?xgnm=114158625",
      },
      {
        label: "BUGS",
        href: "https://music.bugs.co.kr/track/33861782",
      },
      {
        label: "FLO",
        href: "https://www.music-flo.com/detail/track/578461242/details",
      },
      {
        label: "VIBE",
        href: "https://vibe.naver.com/track/101534558",
      },
    ],
  },
  {
    id: "medium",
    index: "02",
    title: "MEDIUM",
    date: "2026.06.18",
    isrc: "KSB062600073",
    description: ["A night that does not end.", "It only loses temperature."],
    artwork: "/toji/releases/medium.jpg",
    artworkAlt: "MEDIUM single cover artwork",
    links: [
      {
        label: "SPOTIFY",
        href: "https://open.spotify.com/track/0CaGOfhW8XIfPPlvDVm8Vh",
      },
      {
        label: "APPLE MUSIC",
        href: "https://music.apple.com/kr/album/medium-single/6780741693",
      },
      {
        label: "YOUTUBE",
        href: "https://www.youtube.com/watch?v=reijMEG7wt8",
      },
    ],
    moreLinks: [
      {
        label: "MELON",
        href: "https://www.melon.com/song/detail.htm?songId=602291481",
      },
      {
        label: "GENIE",
        href: "https://www.genie.co.kr/detail/songInfo?xgnm=115555812",
      },
      {
        label: "BUGS",
        href: "https://music.bugs.co.kr/track/33974423",
      },
      {
        label: "FLO",
        href: "https://www.music-flo.com/detail/track/593693794/details",
      },
      {
        label: "VIBE",
        href: "https://vibe.naver.com/track/104832407",
      },
    ],
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: "INSTAGRAM",
    value: "@sadistoji",
    href: "https://instagram.com/sadistoji",
  },
  {
    label: "YOUTUBE",
    value: "@SADISTOJI",
    href: "https://youtube.com/@SADISTOJI",
  },
  {
    label: "EMAIL",
    value: "sadistoji@gmail.com",
    href: "mailto:sadistoji@gmail.com",
  },
];

export const worldPrelude = [
  "A recurring world told through music, image and episodes.",
  "Crime. Memory. Desire. Disappearance.",
];

export const listenLinks: StreamingLink[] = [
  {
    label: "SPOTIFY",
    href: "https://open.spotify.com/artist/2lbSXIQ6YdAghi6iQ1YO20",
  },
  {
    label: "APPLE MUSIC",
    href: "https://music.apple.com/kr/artist/toji/1882571005",
  },
  {
    label: "YOUTUBE",
    href: "https://www.youtube.com/@SADISTOJI",
  },
];
