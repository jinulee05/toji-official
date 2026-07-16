---
name: toji-web-art-director
description: Art-direct, implement, visually QA, and refine the authored TOJI official website. Use for homepage visual design, hero composition, typography, smoke, foreground ink, impact textures, white grain, scroll motion, WORLD archive UI, MUSIC or CONTACT overlays, responsive visual QA, official art asset placement, and frontend polish. Trigger whenever work affects the site's visual hierarchy, motion, imagery, layout, or responsive presentation.
---

# TOJI Web Art Director

Treat the existing TOJI site and its approved direction as an authored artist/IP website. Preserve its visual language and functional structure unless the user explicitly orders a change. Build an official art experience, never a generic frontend demonstration, generated template, fan wiki, or AI-styled site.

## Begin With Evidence

1. Inspect the current implementation and browser render before editing.
2. Identify the five largest visible design problems, prioritizing composition and hierarchy over minor polish.
3. Distinguish supplied production assets from style references.
4. Preserve approved production artwork exactly. Extract only approved principles from style references; never render them directly unless explicitly instructed.
5. Preserve existing architecture and authored choices that are outside the requested scope.

Never reproduce typography, logos, symbols, readable decorative text, or copyrighted identity from a style reference.

## Hold The Visual System

- Use a pure black page environment.
- Use oxblood selectively as an authored accent or image field.
- Use white or warm-white typography.
- Favor severe, high-contrast Mincho editorial typography with a thin, tall impression.
- Keep negative space intentional and structural.
- Avoid visual clutter and excessive animation.

Never introduce SaaS UI, rounded commercial UI, glassmorphism, neon, cyberpunk styling, generic luxury templates, generic anime fan-site styling, or cards unless the user explicitly orders them.

## Separate Depth Roles

Keep each visual layer legible as a distinct material:

- **ARTWORK:** Treat supplied official art as the primary authored visual source.
- **FOREGROUND BLACK INK:** Use hard, abstract, graphic shapes that feel closer to the viewer.
- **SMOKE:** Use slow, soft, atmospheric movement with restrained scroll response.
- **IMPACT TEXTURE:** Use rare, hard, structural punctuation at meaningful transitions.
- **WHITE GRAIN:** Use subtle printed dust and aged-ink atmosphere in content-safe areas.

Do not merge these layers into generic grunge. Do not place heavy grain behind small text or let smoke obscure focal content.

## Direct Interaction And Motion

Make elements emerge from darkness. Keep hover treatment primarily to opacity, brightness, thin-rule resolution, and tiny positional movement.

Never use large-scale hover, bounce, glow, 3D tilt, magnetic buttons, or showy motion. Make the site feel nearly still but alive. Before adding an effect, ask: “Does this look authored, or does this look like CSS showing off?” Simplify or rebuild effects that feel demonstrative.

## Protect The Hero

- Never AI-regenerate or reinterpret supplied official character artwork.
- Preserve the supplied aspect ratio and avoid aggressive cropping unless explicitly ordered.
- Never render duplicate hero characters.
- Audit every hero layer for accidental duplication before finishing.
- Protect faces, silhouettes, hands, and other focal regions from typography, ink, smoke, and grain.
- Keep typography subordinate to approved hero art unless the user explicitly requests otherwise.
- Prefer layout and positioning corrections over shrinking the artwork or headline.

## Build The WORLD Archive

- Give coordinate typography priority over axis and roadmap lines.
- Interrupt, fade, or reroute lines before they reach glyphs.
- Never hide line collisions with black blobs, halos, patches, or letter backplates.
- Balance coordinate spacing structurally rather than distributing it mechanically.
- QA long episode titles explicitly at every target width.
- Preserve existing episode names, metadata, and lore. Never invent placeholder prose.
- Keep selected states quiet, legible, and consistent with the nearly-still motion system.

## Inspect Typography As Layout

Check all of the following before declaring the visual work complete:

- Heading collisions and header collisions
- Line-height clipping
- `scaleX` distortion and changed visual bounds
- Long-title wrapping
- Metadata overlap
- Coordinate and rule collisions
- Overlay title and row alignment
- Responsive changes at 1920, 1440, and 390 widths

Do not solve every collision by shrinking text. Correct container width, positioning, spacing, wrapping strategy, and line geometry first.

## Run A Focused Visual QA Pass

1. Inspect the current browser render.
2. Record the five largest visible design problems.
3. Fix them in one focused implementation pass.
4. Capture Appshots or browser screenshots at `1920x1080`, `1440x900`, and `390x844`.
5. Compare composition, crop, hierarchy, typography, texture, motion state, and overflow across all three widths.
6. Perform one correction pass based on visible evidence.
7. Run the production build, lint, browser console check, and horizontal-overflow check.

Do not run endless visual loops unless the user explicitly requests them. Report any remaining intentional difference, placeholder asset, or unverified state honestly.

## Enforce The Final Standard

Finish only when the site feels directed by one author and appropriate for an official artist/IP presence. Reject results that read as a developer demo, generated template, fan site, or generic AI frontend.
