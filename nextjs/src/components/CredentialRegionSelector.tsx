"use client";

import { useState } from "react";

const REGIONS = ["Malaysia", "International"] as const;
type CredentialRegion = (typeof REGIONS)[number];

export default function CredentialRegionSelector() {
  const [selectedRegion, setSelectedRegion] =
    useState<CredentialRegion>("Malaysia");

  return (
    <div
      className="process-region-selector"
      role="group"
      aria-label="Credential region"
    >
      {REGIONS.map((region) => (
        <button
          className="process-region-selector__option"
          type="button"
          key={region}
          aria-pressed={selectedRegion === region}
          onClick={() => setSelectedRegion(region)}
        >
          {region}
        </button>
      ))}
    </div>
  );
}
