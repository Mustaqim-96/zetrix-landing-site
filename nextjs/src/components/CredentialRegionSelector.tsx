"use client";

import type { CSSProperties, ReactNode } from "react";

export const REGIONS = ["Malaysia", "International"] as const;
export type CredentialRegion = (typeof REGIONS)[number];

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

type CredentialRegionSelectorProps = {
  value: CredentialRegion;
  onChange: (region: CredentialRegion) => void;
  controls?: string;
};

export default function CredentialRegionSelector({
  value,
  onChange,
  controls,
}: CredentialRegionSelectorProps) {
  return (
    <div
      className="process-region-selector"
      role="group"
      aria-label="Credential region"
      style={{ "--region-index": REGIONS.indexOf(value) } as CSSProperties}
    >
      <span className="process-region-selector__thumb" aria-hidden="true" />
      {REGIONS.map((region) => (
        <button
          className="process-region-selector__option"
          type="button"
          key={region}
          aria-pressed={value === region}
          aria-controls={controls}
          onClick={() => onChange(region)}
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
