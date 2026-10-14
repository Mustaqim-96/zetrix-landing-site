"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import CredentialRegionSelector, {
  type CredentialRegion,
} from "./CredentialRegionSelector";

type Step = {
  desc: string;
  src: string;
  alt: string;
  width: number;
};

type RegionStory = {
  title: string[]; // one entry per line
  steps: Step[];
};

const STORIES: Record<CredentialRegion, RegionStory> = {
  Malaysia: {
    title: ["How to digitise your Malaysian ID"],
    steps: [
      { desc: "Download and open the MyID Superapp, enter the homepage by creating a digital identity.", src: "/assets/zid/step-1.webp", alt: "MyID Superapp home screen", width: 750 },
      { desc: "Select “Malaysian ID” as the certificate type.", src: "/assets/zid/step-2.webp", alt: "Apply credential screen", width: 750 },
      { desc: "Apply through MyDigital ID.", src: "/assets/zid/step-3.webp", alt: "Malaysian ID selection screen", width: 750 },
      { desc: "Real person authentication before submission.", src: "/assets/zid/step-4.webp", alt: "Identity details verification screen", width: 753 },
      { desc: "View the successfully verified Malaysian ID certificate.", src: "/assets/zid/step-5.webp", alt: "Successful credential screen", width: 750 },
      { desc: "Present the Malaysian ID card as a QR code.", src: "/assets/zid/step-6.webp", alt: "Malaysian ID credential QR code", width: 750 },
    ],
  },
  International: {
    title: ["How to digitise your passport"],
    steps: [
      { desc: "Scan your passport’s photo page.", src: "/assets/zid/intl-step-1.webp", alt: "Scan passport screen", width: 753 },
      { desc: "Tap your phone on the passport to read its NFC chip.", src: "/assets/zid/intl-step-2.webp", alt: "Read NFC chip screen", width: 753 },
      { desc: "Verify you are the passport holder with a face check.", src: "/assets/zid/intl-step-3.webp", alt: "Verify holder screen", width: 753 },
      { desc: "Review your passport details.", src: "/assets/zid/intl-step-4.webp", alt: "Passport details form", width: 750 },
      { desc: "Accept the terms and submit your application.", src: "/assets/zid/intl-step-5.webp", alt: "Confirm application sheet", width: 750 },
      { desc: "Your application is submitted — track it under Activity.", src: "/assets/zid/intl-step-6.webp", alt: "Application successful screen", width: 750 },
      { desc: "Present your passport credential as a QR code.", src: "/assets/zid/intl-step-7.webp", alt: "Passport credential QR code", width: 750 },
    ],
  },
};

export default function ProcessStory() {
  const [region, setRegion] = useState<CredentialRegion>("Malaysia");
  const [hasSwitched, setHasSwitched] = useState(false);
  const [warm, setWarm] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const story = STORIES[region];

  // Each phone is pinned and only revealed as its card's clip scrolls over it,
  // so native lazy-loading starts the download at the moment the screenshot
  // should already be on screen. Instead, once the section is ~1.5 viewports
  // away, fetch and decode every screenshot for both regions up front.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setWarm(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!warm) return;
    // Warm the HTTP and decode caches for both regions, so the visible <img>
    // tags (eager once warm) and a later region switch paint instantly.
    for (const { steps } of Object.values(STORIES)) {
      for (const step of steps) {
        const image = new Image();
        image.fetchPriority = "low"; // never compete with hero assets
        image.src = step.src;
        image.decode().catch(() => {});
      }
    }
  }, [warm]);

  return (
    <>
      <header className="process-head reveal">
        <CredentialRegionSelector
          value={region}
          onChange={(next) => {
            if (next === region) return;
            setRegion(next);
            setHasSwitched(true);
          }}
          controls="digitise-steps"
        />
        <h2 className="section-title" id="digitise-title">
          {story.title.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>
      </header>
      <div className="process-grid" data-process-story ref={gridRef}>
        {/* Keyed by region so the list remounts and replays its fade-in after a switch. */}
        <div
          className={`process-steps${hasSwitched ? " is-switching" : ""}`}
          id="digitise-steps"
          key={region}
        >
          {story.steps.map((step, index) => (
            <article className="step-card" data-process-step={index} key={step.src}>
              <div className="step-copy">
                <h3 className="step-title">Step {index + 1}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
              <div className="step-phone">
                <img
                  src={step.src}
                  alt={step.alt}
                  loading={warm ? "eager" : "lazy"}
                  decoding="async"
                  width={step.width}
                  height={1624}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
