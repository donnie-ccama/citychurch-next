---
name: "Citychurch"
description: "A warm documentary editorial system for ministry stories, practical actions, and a living seasonal calendar."
colors:
  accent: "oklch(63% 0.2 360)"
  accent-hover: "color-mix(in srgb, oklch(63% 0.2 360) 86%, #ffffff)"
  accent-soft: "oklch(63% 0.12 360)"
  oatmeal: "oklch(98.6% 0.002 67.8)"
  muted-oatmeal: "oklch(96% 0.002 17.2)"
  border-taupe: "oklch(92.2% 0.005 34.3)"
  dark-secondary-text: "oklch(86.8% 0.007 39.5)"
  muted-taupe: "oklch(71.4% 0.014 41.2)"
  dark-muted-text: "oklch(54.7% 0.021 43.1)"
  body-taupe: "oklch(43.8% 0.017 39.3)"
  dark-border: "oklch(36.7% 0.016 35.7)"
  deep-taupe: "oklch(26.8% 0.011 36.5)"
  ink-taupe: "oklch(21.4% 0.009 43.1)"
  night-taupe: "oklch(14.7% 0.004 49.3)"
  white: "#ffffff"
  hero-charcoal: "#17110f"
  calendar-glass: "rgba(24, 18, 16, 0.72)"
  photo-tile-base: "#3e302a"
  popover-paper: "#fffdf8"
  popover-ink: "#241c18"
  popover-muted: "#6a5c55"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(3rem, 6vw, 5.7rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.6rem, 5vw, 4.7rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.45rem, 2.4vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  action:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  compact: "6px"
  control: "8px"
  tile: "12px"
  popover: "14px"
  card: "16px"
  feature: "20px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.875rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  section: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0.9rem 1.2rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0.9rem 1.2rem"
  button-quiet:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-taupe}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.4rem"
  month-tab:
    backgroundColor: "transparent"
    textColor: "rgba(255, 255, 255, 0.65)"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.85rem"
  month-tab-selected:
    backgroundColor: "{colors.white}"
    textColor: "{colors.popover-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.85rem"
  calendar-panel:
    backgroundColor: "{colors.calendar-glass}"
    textColor: "{colors.white}"
    rounded: "{rounded.feature}"
    padding: "clamp(1rem, 2vw, 1.5rem)"
  event-popover:
    backgroundColor: "{colors.popover-paper}"
    textColor: "{colors.popover-ink}"
    rounded: "{rounded.popover}"
    padding: "1rem"
---

# Design System: Citychurch

## Overview

**Creative North Star: "The Living Ministry Calendar"**

Citychurch feels like an editorial record of ministry happening among real people. Documentary photography leads, warm oatmeal and taupe surfaces keep the experience grounded, and generous spacing lets stories and practical information share the page without competing.

The seasonal extension turns that same visual language into a calendar-first experience: photographs mark meaningful dates, interaction reveals only the detail needed in context, and a chronological list completes the practical task. The mood is warm, direct, trustworthy, and active rather than promotional.

**Key Characteristics:**

- Documentary Citychurch photography carries emotional weight and event meaning.
- Oatmeal and taupe surfaces create a warm, quiet ground in light and dark modes.
- Source Serif 4 provides editorial warmth; Inter keeps navigation, labels, and actions clear.
- The red-pink accent is reserved for actions, links, selections, and small signals.
- Seasonal pages lead with calendars and resolve into a chronological detail list.

## Colors

The palette is a warm taupe scale anchored by a restrained red-pink accent, with white used for contained surfaces and high-contrast inverse states.

### Primary

- **Citychurch Red-Pink** (`oklch(63% 0.2 360)`): The principal action and selection color for buttons, links, focus moments, and small category signals.
- **Soft Red-Pink** (`oklch(63% 0.12 360)`): A lower-chroma companion for restrained accent treatments.

### Neutral

- **Oatmeal** (`oklch(98.6% 0.002 67.8)`): The dominant light-mode page ground.
- **Muted Oatmeal** (`oklch(96% 0.002 17.2)`): Quiet section fills and low-emphasis date cells.
- **Border Taupe** (`oklch(92.2% 0.005 34.3)`): Dividers and field borders that organize without becoming graphic lines.
- **Body Taupe** (`oklch(43.8% 0.017 39.3)`): Secondary text in light mode.
- **Ink Taupe** (`oklch(21.4% 0.009 43.1)`): Primary text in light mode and the core editorial ink color.
- **Deep Taupe** (`oklch(26.8% 0.011 36.5)`): Dark-mode card surface.
- **Night Taupe** (`oklch(14.7% 0.004 49.3)`): Dark-mode page ground.
- **Hero Charcoal** (`#17110f`): The photographic hero fallback and scrim family.
- **Popover Paper** (`#fffdf8`): A stable light detail surface inside either theme.
- **Popover Ink** (`#241c18`): Primary type inside a detail popover.
- **Popover Muted Text** (`#6a5c55`): Secondary detail inside a popover.

**The Warm Ground Rule.** Pages rest on oatmeal or taupe; bright white is a contained surface or inverse state, not the dominant canvas.

**The Accent with Intent Rule.** Use red-pink to identify the next action, an active choice, or a meaningful signal; do not scatter it as decoration.

## Typography

**Display Font:** Source Serif 4 (with Georgia and serif fallbacks)
**Body Font:** Inter (with system-ui and sans-serif fallbacks)

**Character:** The serif is warm, human, and editorial; the sans serif is practical and calm. Large serif headlines use tight tracking and compact line height, while body copy remains open and readable.

### Hierarchy

- **Display** (400, fluid 3rem–5.7rem, 0.94): Page and hero statements; keep lines short and balanced.
- **Headline** (400, fluid 2.6rem–4.7rem, 0.98): Major section openings such as the chronological event list.
- **Title** (500, fluid 1.45rem–2rem, 1.1): Calendar month titles, popover titles, and feature-card headings.
- **Body** (400, 1rem, 1.7): Descriptive copy, practical guidance, and supporting narrative; use compact widths near 390–600px when text accompanies a large visual.
- **Label** (700, 0.75rem, 0.08em): Dates, years, category signals, and other short metadata.
- **Action** (700, 0.9rem, 1.2): Buttons and decisive links.

**The Two Voice Rule.** Source Serif 4 carries editorial emphasis; Inter carries interface behavior and sustained reading.

## Layout

Public pages use centered containers from roughly 1000px to 1320px with generous fluid section padding. The seasonal hero divides the first viewport into a smaller story column and a larger calendar column; the full-season page presents three equal month cards above a chronological list.

At 980px, the hero and event rows tighten while preserving the calendar-first hierarchy. At 760px, the hero becomes a vertical composition, month cards stack, calendar labels simplify, and list rows compress to image, date, title/time, and action. Click, touch, and keyboard activation receive the same event detail.

**The Calendar Leads Rule.** Seasonal event surfaces show the date structure before the detail list; the list then supplies complete chronological context and actions.

## Elevation & Depth

The system is mostly flat and uses tonal changes, borders, image scrims, and cropping for structure. Soft ambient shadows lift grouped calendar cards, ongoing-opportunity cards, active photo dates, and popovers; ordinary event rows remain flat and separated by quiet rules.

### Shadow Vocabulary

- **Month Card** (`0 16px 38px rgba(54, 41, 35, 0.09)`): Low ambient lift for each whole-season month.
- **Feature Card** (`0 18px 44px rgba(54, 41, 35, 0.09)`): Slightly broader lift for a large image-and-copy feature.
- **Active Photo Date** (`0 12px 26px rgba(0, 0, 0, 0.34)`): Temporary depth during hover, focus, or selection.
- **Event Popover** (`0 20px 48px rgba(0, 0, 0, 0.35)`): Strongest layer because it floats above the calendar.

**The Depth Follows Meaning Rule.** Add elevation only when a surface groups content or moves above its surrounding plane; chronology stays flat.

## Shapes

Corners are gently rounded rather than fully soft. Controls use compact 6–8px corners, photo tiles use 12px, popovers use 14px, cards use 16px, and feature or glass panels use 20px. Pills are reserved for compact choice controls and selected states. Documentary images are cropped decisively inside these shapes.

## Components

### Buttons

- **Shape:** Gently rounded actions (8px); compact navigation actions may use 6px and quiet homepage actions may use a pill.
- **Primary:** Red-pink fill with white text and firm Inter weight.
- **Hover / Focus:** Lighten the accent and lift by 1–2px; keyboard focus uses a visible 3px outline with 3px offset on seasonal surfaces.
- **Quiet:** White or card-colored fill with a taupe border and ink text.

### Chips

- **Style:** Month tabs are transparent pills with muted inverse text.
- **State:** The selected month becomes a white pill with dark warm ink; selection is also exposed through `aria-pressed`.

### Cards / Containers

- **Corner Style:** 16px for standard cards and 20px for larger feature or glass panels.
- **Background:** White/card surfaces over oatmeal in light mode; deep taupe surfaces in dark mode.
- **Shadow Strategy:** Low ambient lift for grouped cards; stronger shadow only for a popover or active photo date.
- **Border:** One-pixel taupe borders for quiet separation; translucent white borders on dark glass.
- **Internal Padding:** Usually 1–1.5rem for compact surfaces and 2–4rem for feature copy.

### Inputs / Fields

- **Style:** Card-colored fill, one-pixel taupe border, 8px corners, and 0.875rem internal padding.
- **Focus:** Border shifts to Citychurch red-pink; preserve a visible keyboard focus treatment.
- **Error / Disabled:** Use semantic status treatment without changing the established type, corner, or spacing language.

### Navigation

The navigation is a sticky 72px bar on the page ground, with the logo and Citychurch name at left, restrained Inter links, and a compact accent action. Hover and active links reveal a 2px red-pink underline. Mobile replaces the link row with a menu button and stacked links.

### Photo-Marked Calendar Date

An event date replaces the neutral date tile with approved documentary photography, a dark diagonal shade, the date number, and a short event label. Click, tap, or keyboard activation lifts the tile and reveals a light detail popover; a second selection closes it. Hover provides only a visual cue. Empty dates remain quiet so photography signals meaning.

### Chronological Event Row

Rows combine a landscape image, serif date numeral, event copy, metadata, and a right-aligned accent action. They remain flat with divider rules; on mobile the image becomes square, secondary description and location collapse, and date, title/time, and action remain visible.

**The Photo Date Rule.** A photo inside the date grid means a real published event; neutral dates never receive decorative imagery.

## Do's and Don'ts

### Do:

- **Do** let approved photographs of Citychurch people and ministry activity carry the emotional story.
- **Do** use Source Serif 4 for editorial headlines and Inter for controls, labels, and body copy.
- **Do** preserve equivalent click, keyboard-activation, and tap paths for calendar detail.
- **Do** use the red-pink accent for actions, selections, and concise signals.
- **Do** stack calendars and simplify event rows below 760px while keeping dates and actions visible.

### Don't:

- **Don't** use generic event icons or invented graphics where approved documentary photography provides the meaning.
- **Don't** open event details on incidental hover or keyboard focus.
- **Don't** fill neutral dates with decorative photography; photo dates are semantic markers.
- **Don't** make bright white the dominant page ground.
- **Don't** turn the chronological event list into a wall of independently elevated cards.
