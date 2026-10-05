# Christmas Banquet Registration — Design QA

## Evidence

- Source visual truth: `https://www.citykid.me/register/family-night`
- Rendered implementation: `http://127.0.0.1:4173/christmas`
- Implementation screenshot evidence: Codex in-app browser captures from the rendered local URL (desktop default, December 15 selected, confirmation, and mobile states). The browser capture API did not provide a persistent filesystem export path.
- Desktop viewport: 1440 × 1000 CSS pixels, device pixel ratio 1; source and implementation captures were both 1440 × 1000 pixels after normalization.
- Mobile viewport: 390 × 844 CSS pixels, device pixel ratio 1; implementation capture was 390 × 844 pixels.
- Compared states: initial page, banquet cards, December 15 selected, church-attendance yes/no states, completed local-preview reservation, confirmation card, and responsive mobile layout.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Typography: the existing Citychurch sans-serif hierarchy, serif supporting copy, weights, wrapping, and compact uppercase labels remain consistent with the live registration page. The larger Christmas headline is intentional and remains legible at both viewports.
- Spacing and layout: the hero, information strip, centered form, cards, and location section follow the site's established rhythm. The two banquet cards and two-column field grid collapse cleanly to one column at 390 pixels with no horizontal overflow.
- Colors and tokens: the existing Citychurch pink, neutral backgrounds, borders, muted text, and dark-mode-aware variables are reused. Selected-state and availability colors retain clear contrast.
- Image quality and asset fidelity: no new decorative imagery, placeholder art, or substitute icons were introduced. The existing Citychurch logo and global navigation/footer assets are preserved.
- Copy and content: both dates, all times, 15-table capacity, eight-seat limit, one-table reservation rule, location, and confirmation details are stated consistently.
- Behavior and accessibility: both dates are independently selectable; the December 15 selection persisted through submission; labels resolve to their controls; the confirmation is announced through a status region; required validation and loading states are present; no horizontal overflow was found on mobile.
- Church attendance: the required yes/no control is labeled and keyboard-accessible. Choosing yes reveals an optional labeled church-name field; choosing no removes and clears that field. A complete preview reservation with yes and a church name succeeded.
- Browser console: no errors or warnings were reported in either the desktop or mobile registration states.

## Full-view comparison evidence

At 1440 × 1000, the live Family Night page and the new Christmas page share the same navigation, logo treatment, pink event hero, centered content width, neutral page background, bordered form surfaces, typography system, and footer. The new information strip and larger hero are intentional additions needed to make the two-date choice and table rules clear.

The initial full-page capture did not activate offscreen scroll-reveal elements, so it was not used as pass/fail evidence. Normal viewport captures after scrolling showed the form and supporting section correctly; this was a capture-state issue, not a rendered-page defect.

## Focused region comparison evidence

- Banquet picker: December 14 and December 15 cards were visible together on desktop and stacked on mobile. Selecting December 15 changed the radio state, border, and background without layout movement.
- Form: name, guest count, email, phone, optional notes, and submit controls remained aligned and readable at desktop and mobile widths.
- Confirmation: a completed local-preview reservation displayed the selected Tuesday, December 15 date, eight-guest table count, confirmation code, schedule, location, and an explicit notice that the preview was not stored or emailed.

## Comparison history

1. The first desktop comparison used mismatched viewport sizes (source 1280 × 720 at DPR 2; implementation 1440 × 1000 at DPR 1). It was discarded before judging fidelity.
2. Both pages were recaptured at 1440 × 1000 and DPR 1. No P0/P1/P2 differences were found.
3. The implementation was recaptured at 390 × 844 and DPR 1, including the December 15 selected state. No clipping, overlap, broken wrapping, or horizontal overflow was found.
4. The complete December 15 submission and confirmation flow was exercised in local preview mode. No P0/P1/P2 behavior or visual issues were found.
5. Social metadata was refined with an explicit `https://www.citykid.me` base URL so shared images and canonical page links resolve outside the site. The production build and browser checks passed afterward.
6. The church-attendance question was added and checked in both yes and no states. The conditional name field appeared only for yes, cleared when no was selected, and the updated reservation flow completed without console errors.

## Implementation checklist

- [x] Preserve the existing Citychurch design system and global shell.
- [x] Let families choose either December 14 or December 15.
- [x] Show availability and enforce one table of up to eight guests.
- [x] Provide responsive, labeled reservation fields.
- [x] Show a complete confirmation with date, schedule, location, and code.
- [x] Verify desktop and mobile layouts in a browser.
- [x] Verify primary selection and submission interactions.
- [x] Check browser console output.
- [x] Verify the church-attendance question, conditional church name, and updated submission.

## Follow-up polish

- The global donation notification widget can cover a small portion of the lower-left viewport, as it does on the existing site. It is closable and did not block the reservation controls during testing.

final result: passed
