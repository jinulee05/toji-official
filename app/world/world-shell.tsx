"use client";

import { useEffect, useState, type ReactNode } from "react";
import { contactLinks } from "../site-content";
import {
  FooterMark,
  MusicOverlayContent,
  OverlayFrame,
  SiteFrame,
  SiteHeader,
} from "../site-ui";

export type WorldDestination = "world" | "part-1" | "part-2";
type OverlayState = "music" | "contact" | null;

export function WorldShell({
  children,
  destination,
}: {
  children: ReactNode;
  destination?: WorldDestination;
}) {
  const [overlay, setOverlay] = useState<OverlayState>(null);

  const closeOverlay = () => {
    setOverlay(null);
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.hash}`,
    );
  };

  useEffect(() => {
    const syncOverlayFromLocation = () => {
      const requestedOverlay = new URLSearchParams(window.location.search).get(
        "overlay",
      );

      setOverlay(
        requestedOverlay === "music" || requestedOverlay === "contact"
          ? requestedOverlay
          : null,
      );
    };

    syncOverlayFromLocation();
    window.addEventListener("popstate", syncOverlayFromLocation);

    if (overlay) {
      document.body.classList.add("body-overlay-open");
    }

    return () => {
      window.removeEventListener("popstate", syncOverlayFromLocation);
      document.body.classList.remove("body-overlay-open");
    };
  }, [overlay]);

  const openOverlay = (nextOverlay: Exclude<OverlayState, null>) => {
    setOverlay(nextOverlay);
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?overlay=${nextOverlay}`,
    );
  };

  return (
    <SiteFrame
      pageClassName={`site-shell--world site-shell--world-${destination ?? "not-found"}${
        overlay ? " has-open-overlay" : ""
      }`}
    >
      <SiteHeader
        activeSection={destination ? "world" : undefined}
        activeWorldDestination={destination}
        overlay={overlay}
        onMusicOpen={() => openOverlay("music")}
        onContactOpen={() => openOverlay("contact")}
      />

      {children}

      <FooterMark />

      <OverlayFrame title="MUSIC" open={overlay === "music"} onClose={closeOverlay}>
        <MusicOverlayContent linkReleasesToHome />
      </OverlayFrame>

      <OverlayFrame
        title="CONTACT"
        open={overlay === "contact"}
        onClose={closeOverlay}
      >
        <div className="overlay-block overlay-block--contact">
          <h2 className="overlay-block__title">CONTACT</h2>
          <div className="overlay-contact-list">
            {contactLinks.map((entry) => (
              <a className="overlay-contact-row" href={entry.href} key={entry.label}>
                <span>{entry.label}</span>
                <strong>{entry.value}</strong>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </OverlayFrame>
    </SiteFrame>
  );
}
