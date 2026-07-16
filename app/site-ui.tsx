"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { withBasePath } from "./runtime-paths";

type HeaderProps = {
  activeSection?: "music" | "world" | "contact";
  activeWorldDestination?: "world" | "part-1" | "part-2";
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
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smokeVideo = stage.querySelector<HTMLVideoElement>(
      ".global-smoke__video",
    );
    let animationFrame = 0;

    const updateSmokePosition = () => {
      animationFrame = 0;
      const displacementLimit = window.innerWidth <= 688 ? 20 : 48;
      const displacement = reducedMotion.matches
        ? 0
        : Math.min(window.scrollY * 0.026, displacementLimit);

      stage.style.setProperty(
        "--global-smoke-scroll-y",
        `${displacement.toFixed(2)}px`,
      );
    };

    const requestSmokeUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateSmokePosition);
      }
    };

    const syncReducedMotion = () => {
      requestSmokeUpdate();

      if (!smokeVideo) {
        return;
      }

      if (reducedMotion.matches) {
        smokeVideo.pause();
        smokeVideo.currentTime = 0;
      } else {
        void smokeVideo.play().catch(() => undefined);
      }
    };

    const revealTargets = stage.querySelectorAll<HTMLElement>(".reveal-section");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    stage.classList.add("motion-ready");
    revealTargets.forEach((target) => revealObserver.observe(target));
    syncReducedMotion();

    window.addEventListener("scroll", requestSmokeUpdate, { passive: true });
    window.addEventListener("resize", requestSmokeUpdate, { passive: true });
    reducedMotion.addEventListener("change", syncReducedMotion);

    return () => {
      window.removeEventListener("scroll", requestSmokeUpdate);
      window.removeEventListener("resize", requestSmokeUpdate);
      reducedMotion.removeEventListener("change", syncReducedMotion);
      revealObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <main className={`site-shell ${pageClassName}`.trim()}>
      <div className="site-stage" ref={stageRef}>
        <GlobalSmokeBackground />
        {children}
      </div>
    </main>
  );
}

export function SiteHeader({
  activeSection,
  activeWorldDestination,
  overlay,
  onMusicOpen,
  onContactOpen,
}: HeaderProps) {
  const [worldMenuOpen, setWorldMenuOpen] = useState(false);

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
        <div
          className={`site-nav__world${worldMenuOpen ? " is-open" : ""}`}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setWorldMenuOpen(false);
            }
          }}
        >
          <Link
            aria-current={activeWorldDestination === "world" ? "page" : undefined}
            className={navState("world", activeSection, overlay)}
            href="/world"
            onClick={() => setWorldMenuOpen(false)}
          >
            WORLD
          </Link>
          <button
            aria-controls="world-submenu"
            aria-expanded={worldMenuOpen}
            aria-label="Toggle WORLD destinations"
            className="site-nav__world-toggle"
            onClick={() => setWorldMenuOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true">+</span>
          </button>
          <div className="site-nav__submenu" id="world-submenu">
            <Link
              aria-current={activeWorldDestination === "part-1" ? "page" : undefined}
              className={`site-nav__submenu-link${
                activeWorldDestination === "part-1" ? " is-active" : ""
              }`}
              href="/world/part-1"
              onClick={() => setWorldMenuOpen(false)}
            >
              PART I
            </Link>
            <Link
              aria-current={activeWorldDestination === "part-2" ? "page" : undefined}
              className={`site-nav__submenu-link${
                activeWorldDestination === "part-2" ? " is-active" : ""
              }`}
              href="/world/part-2"
              onClick={() => setWorldMenuOpen(false)}
            >
              PART II
            </Link>
          </div>
        </div>
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [open]);

  return (
    <div
      className={`site-overlay${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label={title}
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
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
          ref={closeButtonRef}
        >
          <span aria-hidden="true">×</span>
        </button>
        {children}
      </div>
    </div>
  );
}

function GlobalSmokeBackground() {
  return (
    <div className="global-smoke" aria-hidden="true">
      <video
        autoPlay
        className="global-smoke__video"
        disablePictureInPicture
        loop
        muted
        playsInline
        poster={withBasePath("/toji/smoke-poster.jpg")}
        preload="metadata"
        tabIndex={-1}
      >
        <source
          src={withBasePath("/toji/smoke-loop.webm")}
          type="video/webm"
        />
        <source
          src={withBasePath("/toji/smoke-loop.mp4")}
          type="video/mp4"
        />
      </video>
      <span className="global-smoke__veil" />
    </div>
  );
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
