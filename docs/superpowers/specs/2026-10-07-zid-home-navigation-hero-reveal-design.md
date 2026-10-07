# ZID Home Navigation and Hero Reveal

## Goal

Make the ZID navbar logo return to the homepage without replaying the splash screen, and give the ZID hero title and subtitle the same entrance behavior as the homepage hero.

## Navigation Design

- Keep the ZID logo as a full-document navigation to `/` so homepage scripts initialize from a fresh document.
- Before the standard logo navigation, store a one-use `sessionStorage` flag.
- During homepage document initialization, consume and remove that flag before deciding whether to add `site-intro-pending`.
- When the flag is present, do not start the splash. Direct homepage visits and other navigation paths continue to show the splash normally.
- If browser storage is unavailable, navigation still succeeds and falls back to the existing splash behavior.

## Hero Reveal Design

- Mark both homepage and ZID hero copy with a shared data-attribute contract for the reveal root, title, and subtitle.
- Update the existing homepage reveal script to discover that contract instead of relying on homepage-only class names.
- Load the same reveal script from the ZID runtime so both pages use the exact glyph timing, blur/fade treatment, accessibility text, and reduced-motion behavior.
- Keep the ZID Get Started button outside the shared reveal because the requested scope covers only the title and subtitle.
- Preserve all existing ZID typography, spacing, theme, and orbit animation styles.

## Components and Files

- Add a small client-side home-logo link component that sets the one-use flag before full navigation.
- Update `SiteHeader` to use that link for the ZID-specific home-link mode.
- Update the root layout's early intro script to consume the flag.
- Add the shared reveal markers to the homepage and ZID hero markup.
- Include `site-reveal.js` in the ZID runtime's script list.

## Testing

- Assert that ZID uses the splash-bypass logo mode and the one-use flag is set and consumed.
- Assert that the homepage and ZID hero use the same reveal markers.
- Assert that the ZID runtime loads the shared reveal script.
- Run the tracked test suite, lint, production build, and UI detector.
- Verify in a browser that ZID title/subtitle reveal on entry, clicking the logo reaches `/` without the splash, and a direct homepage load still retains splash behavior.

## Branch Constraint

Implement and verify on `dev`. Do not merge or push to `main` without explicit approval.
