# TOJI Official Site

High-fidelity reconstruction of the official TOJI website based on the supplied
mockup and hero artwork.

## Prerequisites

- Node.js `>=22.13.0`

## Local Preview

```bash
npm ci
npm run dev
```

Local development runs at `http://localhost:3000`.

## Build Check

```bash
npm run build
```

## Visual QA Capture

```bash
npm run qa:screenshots
```

This saves the four required states into `work/qa/current/`:

- `toji.png`
- `music.png`
- `world.png`
- `contact.png`

The capture script lives at `scripts/capture-qa.mjs`.

## Where To Edit Content

- Main content and placeholder links: `app/site-content.ts`
- TOJI home page layout and overlays: `app/page.tsx`
- THE OUTSIDER world page: `app/world/page.tsx`
- Shared header, overlay shell, footer mark: `app/site-ui.tsx`
- Visual system and page styling: `app/globals.css`

## Asset Replacement

- Primary rendered hero: `public/toji/hero-final.png`
- Original procedural grain: `public/toji/grain-original.svg`
- The supplied edge, impact, and grain references are kept only in ignored
  `work/reference/` files and are never rendered or published
- The original black edge geometry and impact/grain transitions are implemented
  in `app/globals.css` without reference-image text or symbols
- Release artwork placeholders are CSS-based and defined in `app/globals.css`
- Reference QA crops are stored in `work/qa/` and are not production assets

## Placeholder Data Still Requiring Real Inputs

- Streaming URLs in `app/site-content.ts`
- Final contact email in `app/site-content.ts`
- Official release cover art for `ROOFTOP SIGNAL` and `MEDIUM`
- Future story routes for world episode entries

## Deployment Notes

This project currently builds with the starter `vinext` / Sites stack and is
ready for `npm run build`. Production publishing should proceed through the
Sites workflow after visual QA is complete.
