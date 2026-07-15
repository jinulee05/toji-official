import Link from "next/link";
import type { ReactNode } from "react";

type HeaderProps = {
  activeSection?: "music" | "world" | "contact";
  overlay?: "music" | "contact" | null;
  onMusicOpen?: () => void;
  onContactOpen?: () => void;
};

export function SiteFrame({
  children,
  pageClassName = "",
}: {
  children: ReactNode;
  pageClassName?: string;
}) {
  return (
    <main className={`site-shell ${pageClassName}`.trim()}>
      <div className="site-stage">
        <TextureLayer />
        <SmokeField />
        {children}
      </div>
    </main>
  );
}

export function SiteHeader({
  activeSection,
  overlay,
  onMusicOpen,
  onContactOpen,
}: HeaderProps) {
  return (
    <header className="site-header">
      <Link className="site-logo" href="/">
        TOJI
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <button
          className={navState("music", activeSection, overlay)}
          type="button"
          onClick={onMusicOpen}
          aria-haspopup="dialog"
          aria-expanded={overlay === "music"}
        >
          MUSIC
        </button>
        <Link className={navState("world", activeSection, overlay)} href="/world">
          WORLD
        </Link>
        <button
          className={navState("contact", activeSection, overlay)}
          type="button"
          onClick={onContactOpen}
          aria-haspopup="dialog"
          aria-expanded={overlay === "contact"}
        >
          CONTACT
        </button>
        <button className="site-nav__lang" type="button">
          JP / EN
        </button>
      </nav>
    </header>
  );
}

export function SectionMarker() {
  return <div className="section-marker" aria-hidden="true" />;
}

export function FooterMark() {
  return (
    <div className="footer-mark" aria-label="Hunter">
      <span className="footer-mark__cross" aria-hidden="true" />
      <span className="footer-mark__label">HUNTER</span>
    </div>
  );
}

export function OverlayFrame({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`site-overlay${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="site-overlay__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="site-overlay__close"
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
        >
          <span aria-hidden="true">×</span>
        </button>
        {children}
      </div>
    </div>
  );
}

function SmokeField() {
  return (
    <div className="smoke-field" aria-hidden="true">
      <span className="smoke-field__layer smoke-field__layer--north" />
      <span className="smoke-field__layer smoke-field__layer--east" />
      <span className="smoke-field__layer smoke-field__layer--south" />
      <span className="smoke-field__layer smoke-field__layer--center" />
    </div>
  );
}

function TextureLayer() {
  return <div className="texture-layer" aria-hidden="true" />;
}

function navState(
  section: "music" | "world" | "contact",
  activeSection?: "music" | "world" | "contact",
  overlay?: "music" | "contact" | null,
) {
  return [
    "site-nav__item",
    activeSection === section || overlay === section ? "is-active" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
