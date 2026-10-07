# Remove Two ZID Partner Logos

## Goal

Remove the Xinghuo Blockchain Infrastructure and Beibu Gulf Investment Group logo cards from the ZID page's Powered by section.

## Scope

- Delete the Xinghuo and Beibu Gulf logo-card markup.
- Delete their ZID image assets once no references remain.
- Keep the Powered by heading and the Zetrix and MYEG logo cards.
- Change the partner grid to two centered columns on desktop and tablet, retaining the existing single-column mobile layout.
- Remove CSS used only by the deleted partner logos.
- Keep the About ZID collaboration copy unchanged.
- Implement and verify on `dev`; do not change `main`.

## Testing

- Add a regression assertion that the two removed partner names, classes, and asset references are absent from the Powered by markup and CSS.
- Assert that the Zetrix and MYEG cards remain.
- Run the tracked ZID tests, lint, production build, and UI detector.
- Inspect desktop and mobile layouts to confirm the remaining cards are centered and responsive.

## Out of Scope

- Removing or rewriting the About ZID collaboration paragraph.
- Removing the complete Powered by section.
- Redesigning the remaining Zetrix and MYEG cards.
- Merging or pushing to `main`.
