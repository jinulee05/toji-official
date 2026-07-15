"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

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
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const updateSmokePosition = () => {
      animationFrame = 0;
      const scrollY = reducedMotion.matches ? 0 : window.scrollY;

      stage.style.setProperty("--smoke-y-north", `${scrollY * 0.08}px`);
      stage.style.setProperty("--smoke-y-east", `${scrollY * -0.055}px`);
      stage.style.setProperty("--smoke-y-south", `${scrollY * 0.12}px`);
      stage.style.setProperty("--smoke-y-center", `${scrollY * -0.035}px`);
      stage.style.setProperty("--smoke-y-low", `${scrollY * 0.065}px`);
      stage.style.setProperty(
        "--smoke-x-drift",
        `${reducedMotion.matches ? 0 : Math.sin(scrollY / 620) * 18}px`,
      );
      stage.style.setProperty(
        "--smoke-x-reverse",
        `${reducedMotion.matches ? 0 : Math.sin(scrollY / 620) * -13}px`,
      );
    };

    const requestSmokeUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateSmokePosition);
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
    updateSmokePosition();

    window.addEventListener("scroll", requestSmokeUpdate, { passive: true });
    reducedMotion.addEventListener("change", requestSmokeUpdate);

    return () => {
      window.removeEventListener("scroll", requestSmokeUpdate);
      reducedMotion.removeEventListener("change", requestSmokeUpdate);
      revealObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <main className={`site-shell ${pageClassName}`.trim()}>
      <div className="site-stage" ref={stageRef}>
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

function SmokeField() {
  return (
    <div className="smoke-field" aria-hidden="true">
      <span className="smoke-field__layer smoke-field__layer--north" />
      <span className="smoke-field__layer smoke-field__layer--east" />
      <span className="smoke-field__layer smoke-field__layer--south" />
      <span className="smoke-field__layer smoke-field__layer--center" />
      <span className="smoke-field__layer smoke-field__layer--low" />
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
