# Typography

**Status:** public spec, verifiable — see [README](./README.md). This is the one file in this folder that isn't a guess.

**Source:** [Singapore Government Design System — Typography](https://www.designsystem.tech.gov.sg/foundations/typography)

## Typeface

**Inter**, for both headings and body text — one typeface, weight does the differentiating work. Chosen by SGDS for its tall x-height and screen readability, which is why most `.gov.sg` sites already use it.

```css
font-family: "Inter", -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

Load via Google Fonts or self-host — either is fine for the actual GitHub Pages build (unlike the Claude Artifact mockups earlier in this project, which can't reach font CDNs).

## Weights

| Weight | Use for | Never use for |
|---|---|---|
| 700 (Bold) | Displays, headings | — |
| 600 (Semi Bold) | Subtitles, labels, buttons | Body copy |
| 400 (Regular) | Body copy, long-form content, captions, labels | — |
| 300 (Light) | Displays, headings, subtitles, placeholder text | Body copy |

## Type scale

Minor Third (1.200) ratio for headings/displays, Perfect Fifth (1.500) line-height ratio for body text and captions. Base size 16px / 1rem.

## Reconciling with SportSG's "robust italicised font"

SportSG's own description of their wordmark font is a bold italic — that's almost certainly a custom or licensed logotype face, not Inter, and not something to imitate outright without the real spec. For this project:

- Use Inter (regular weight, not italic) for all real UI text — body copy, nav, forms, everything readable.
- Reserve italics for a light editorial touch only — e.g. a pull-quote or tagline near the hero — not for buttons, nav, or anything functional. Never fake the actual logotype by setting "SportSG Safety" in bold italic Inter; that reads as an attempt to mimic the real mark rather than a distinct placeholder (see [logo.md](./logo.md)).
