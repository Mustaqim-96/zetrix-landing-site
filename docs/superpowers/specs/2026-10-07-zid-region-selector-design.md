# ZID Region Selector Design

## Goal

Add a compact region selector above the ZID digitisation section title so visitors can choose between Malaysia and International.

## Scope

- Add a centered two-option control above the Section 2 title.
- Label the options `Malaysia` and `International`.
- Select Malaysia by default.
- Let either option become visually selected.
- Keep the existing title and all six digitisation steps unchanged for both selections until International-specific content is supplied.
- Implement the change on `dev` first.

## Interaction and accessibility

The control is a segmented button group rather than a semantic tab interface because both choices currently expose the same content. Each option is a native button with an `aria-pressed` state. Selecting one option deselects the other. Native button behavior provides keyboard activation, while a visible focus treatment makes keyboard position clear.

When distinct International content is available, the control can be upgraded to an ARIA tab list with separate panels without changing its visual treatment.

## Component design

Create a focused client component named `CredentialRegionSelector`. It owns only the selected-region state and renders the two buttons. The ZID page remains a server component and places the selector inside the existing process header, immediately before the Section 2 heading.

No content, asset, route, query-string, or persistence changes are included in this phase.

## Visual design

- Use a compact, rounded dark track consistent with the supplied reference.
- Render the selected option as a light pill with a red label.
- Render the inactive option with muted light text.
- Center the selector above the title with enough vertical separation to preserve the section hierarchy.
- Preserve the existing ZID visual language in both light and dark themes.
- Keep each target comfortably operable on touch screens and preserve a clear focus-visible outline.

## Responsive behavior

The control remains centered and fits its content at desktop, tablet, and mobile widths. Button padding may tighten on small screens, but labels do not truncate or wrap.

## Testing

Add regression coverage that verifies:

- the selector is rendered above `digitise-title`;
- Malaysia and International are both available;
- Malaysia is selected by default;
- selection is represented with mutually exclusive `aria-pressed` states;
- the existing title and six process steps remain present and unchanged;
- the ZID page does not become a client component.

Run the focused ZID tests, the complete test suite, lint, a production build, and browser checks on localhost for both desktop and mobile behavior.
