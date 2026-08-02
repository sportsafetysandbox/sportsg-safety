# Color

**Status:** derived placeholder — see [README](./README.md). Not confirmed against SportSG's actual internal spec.

## Primary — red

Seeded from the Singapore Government Design System's public brand red (`#F4333D`), matching its tier 500. The rest of the ramp is generated with standard HSL tint/shade steps, not pulled from SGDS's generator directly.

| Tier | Hex | Typical use |
|---|---|---|
| 100 | `#FDE8E9` | Tinted backgrounds (alert banners, hover states) |
| 200 | `#FAC7C9` | Subtle fills, disabled states |
| 300 | `#F8969B` | Borders on tinted surfaces |
| 400 | `#F6656C` | Secondary accents |
| **500** | **`#F4343D`** | **Primary brand red — matches the public SGDS seed** |
| 600 | `#E60F19` | Hover/active state for primary actions |
| 700 | `#B30F17` | Text on light red fills, pressed states |
| 800 | `#810E16` | High-contrast text on tinted backgrounds |
| 900 | `#500B10` | Reserved for dark-mode surfaces or maximum-contrast text |

## Neutrals

Not derived from red — use a true neutral so the brand red stays the only strong color signal.

| Token | Light mode | Dark mode |
|---|---|---|
| `ink` (primary text) | `#16212C` | `#ECE7D8` |
| `muted` (secondary text) | `#5B594E` | `#9C978A` |
| `line` (borders) | `#D8D0B8` | `#2A323B` |
| `surface` (page bg) | `#FFFFFF` | `#10161C` |
| `surface-2` (card bg) | `#F2EFE6` | `#171E26` |

These match the tokens already used in the site map and wireframe artifacts, so this file is the source of truth going forward — update the artifacts if this palette changes, not the other way round.

## Usage rules

- Red 500/600 for primary CTAs and the persistent "Report an Incident/Hazard" action — it should read as the one urgent, unmissable color on the page.
- Don't use red for anything that isn't actually urgent or brand-critical. If a status/severity color is needed elsewhere (success, warning, info), pick a separate hue — doubling up on brand red for "success" would blur the one thing red is supposed to mean here.
- Every red-on-light or light-on-red pairing needs to hit WCAG AA (4.5:1 for body text) — check 700/800 against white, and 100/200 against 800/900, before shipping.

## Open question

This is a guess at SportSG's actual red, not a confirmed match. If the real brand guide surfaces a different hex, replace `500` here and regenerate the ramp — don't just patch one value and leave the rest inconsistent.
