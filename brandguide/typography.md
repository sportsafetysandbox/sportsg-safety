# Typography

**Status:** decided for this project — overrides the SGDS public spec below by explicit choice.

**Typeface in use: Segoe UI** (system font, no webfont load needed).

```css
font-family: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
```

Segoe UI renders natively on Windows; other platforms fall through to their own native system font (`system-ui`/`-apple-system`/`Roboto`) rather than a mismatched face. No Google Fonts or self-hosted webfont required — one less external request.

**Reference — Singapore Government Design System spec:** [designsystem.tech.gov.sg/foundations/typography](https://www.designsystem.tech.gov.sg/foundations/typography) specifies **Inter** for both headings and body text, chosen for its tall x-height and screen readability (why most `.gov.sg` sites use it). Worth knowing if this project is ever reconciled against an actual official SportSG spec, but this project currently uses Segoe UI instead by deliberate choice.

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

- Use Segoe UI (regular weight, not italic) for all real UI text — body copy, nav, forms, everything readable.
- Reserve italics for a light editorial touch only — e.g. a pull-quote or tagline near the hero — not for buttons, nav, or anything functional. Never fake the actual logotype by setting "SportSG Safety" in bold italic Segoe UI; that reads as an attempt to mimic the real mark rather than a distinct placeholder (see [logo.md](./logo.md)).
