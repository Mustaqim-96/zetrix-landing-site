"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

const REGIONS = ["Malaysia", "International"] as const;
type CredentialRegion = (typeof REGIONS)[number];

// Lucide "map-pin" and "globe", inlined so they inherit currentColor.
const REGION_ICONS: Record<CredentialRegion, ReactNode> = {
  Malaysia: (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  International: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
};

export default function CredentialRegionSelector() {
  const [selectedRegion, setSelectedRegion] =
    useState<CredentialRegion>("Malaysia");

  return (
    <div
      className="process-region-selector"
      role="group"
      aria-label="Credential region"
      style={
        {
          "--region-index": REGIONS.indexOf(selectedRegion),
        } as CSSProperties
      }
    >
      <span className="process-region-selector__thumb" aria-hidden="true" />
      {REGIONS.map((region) => (
        <button
          className="process-region-selector__option"
          type="button"
          key={region}
          aria-pressed={selectedRegion === region}
          onClick={() => setSelectedRegion(region)}
        >
          <svg
            className="process-region-selector__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {REGION_ICONS[region]}
          </svg>
          {region}
        </button>
      ))}
    </div>
  );
}
