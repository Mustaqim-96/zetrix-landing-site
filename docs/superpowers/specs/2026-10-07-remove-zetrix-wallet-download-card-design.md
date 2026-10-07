# Remove the Zetrix Wallet+ Download Card

## Goal

Remove the complete Zetrix Wallet+ download card from the ZID page while retaining the MyID Superapp download card.

## Scope

- Delete the Zetrix Wallet+ card markup, including its store links, QR code, and badge.
- Keep the surrounding download section, heading, copy, and MyID Superapp card unchanged.
- Change the two-column download grid to a centered single-card layout at every supported viewport.
- Remove Wallet+-only styling and asset references that become unused. Shared download-card styles remain.
- Do not change `main`; implement and verify this change on `dev` first.

## Behavior and Layout

The download section continues to provide one clear download path: MyID Superapp. Its existing card stays centered within the section. The section-to-About-page handoff and responsive spacing remain unchanged.

## Testing

- Add a regression assertion that the ZID page no longer contains Zetrix Wallet+ download content or its asset reference.
- Assert that the MyID Superapp download card remains present.
- Run the tracked ZID test suite and production build.
- Inspect the ZID page on desktop and mobile widths to confirm the remaining card is centered and the section transition is intact.

## Out of Scope

- Reworking the MyID card design or download links.
- Removing the entire download section.
- Merging or pushing the result to `main`.
