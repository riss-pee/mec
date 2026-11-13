# Asset Licenses & Intellectual Property Documentation — ZIRNA STEM STUDIO

**Document Date:** November 13, 2026  
**Auditor:** Senior Frontend Engineer & Compliance Specialist  
**Platform:** ZIRNA STEM STUDIO (`fraction-zirna-suite`)

---

## 1. Overview

This document provides a complete inventory and licensing audit for all fonts, icons, illustrations, sound synthesizers, and visual assets used in ZIRNA STEM STUDIO.

All assets have been chosen to ensure freedom of use for educational institutions, non-profit organizations, and commercial distribution under permissive open-source licenses.

---

## 2. Typography & Fonts

All fonts utilized in the platform are licensed under the **SIL Open Font License (OFL) Version 1.1**, which permits free personal and commercial use, modification, and redistribution:

| Font Family | Author / Foundry | Source | License | Attribution Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **Space Grotesk** | Florian Karsten | Google Fonts / GitHub | SIL Open Font License 1.1 | Included in font metadata |
| **Fraunces** | Phaedra Charles & Flavia Zimbardi | Google Fonts / GitHub | SIL Open Font License 1.1 | Included in font metadata |
| **JetBrains Mono** | JetBrains s.r.o. | Google Fonts / GitHub | SIL Open Font License 1.1 | Included in font metadata |
| **Patrick Hand** | Patrick De Grote | Google Fonts / GitHub | SIL Open Font License 1.1 | Included in font metadata |
| **Caveat** | Pablo Impallari | Google Fonts / GitHub | SIL Open Font License 1.1 | Included in font metadata |
| **Plus Jakarta Sans**| Gumpita Rahayu (Tokotype) | Google Fonts / GitHub | SIL Open Font License 1.1 | Included in font metadata |

### SIL Open Font License 1.1 Summary:
- **Commercial Use:** Permitted without royalty fees.
- **Modification & Embedding:** Web embedding permitted.
- **Redistribution:** Font files may be bundled or self-hosted provided the original copyright notice is preserved.

---

## 3. Vector Icons

| Asset | Author / Maintainer | Source | License | Terms & Conditions |
| :--- | :--- | :--- | :--- | :--- |
| **Lucide Icons** (`lucide-react`) | Lucide Contributors / Feather Community | npm package | **ISC License** | Permitted for free use, modification, and distribution in open or proprietary applications. |

---

## 4. Educational Visuals & Interactive Graphics

| Asset | Format / Engine | Source | Ownership & License |
| :--- | :--- | :--- | :--- |
| **Fraction Pie Slices & Cutters** | Programmatic SVG `<path>` & Canvas | `/src/modules/fraction-zirna/` | Proprietary to Zirna Studio / Open Educational Resource (OER) |
| **Fraction Grid (up to 10×10)** | Programmatic CSS Grid / HTML5 Canvas | `/src/modules/fraction-grid/` | Proprietary to Zirna Studio / OER |
| **Symmetry Mirror Coordinate Canvas**| HTML5 2D Canvas Context | `/src/modules/symmetry-match/` | Proprietary to Zirna Studio / OER |
| **Japanese Soroban & Vertical Abacus**| Programmatic SVG & CSS Beads | `/src/modules/abacus-math/` | Proprietary to Zirna Studio / OER |
| **Cartesian Trajectory & Defense** | HTML5 2D Canvas Physics Engine | `/src/modules/coordinate-defense/` | Proprietary to Zirna Studio / OER |
| **Ray Tracing Lens & Mirror Canvas** | Real-time mathematical Snell's law tracer | `/src/modules/optics-lab/` | Proprietary to Zirna Studio / OER |
| **Number Line Road & Vehicle Sprites** | Inline SVG Vectors (`CarGraphic.tsx`) | `/src/modules/number-line-cruiser/` | Proprietary to Zirna Studio / OER |
| **Platform Favicon** | Inline SVG Data URI (`index.html`) | Clean vector circle icon | Zero copyright / Public Domain (CC0 equivalent) |

---

## 5. Audio Assets & Sound Effects

- **Zero Stock Audio MP3s:** The platform does not incorporate downloaded or licensed royalty-free `.mp3` audio files.
- **Mathematical Sound Synthesis:** All sound effects (bead clicks, level chimes, celebratory pops, buzzer tones) are generated procedurally at runtime using the browser's native **HTML5 Web Audio API** (`OscillatorNode`, `GainNode`, and frequency envelopes).
- **Audio Code Copyright:** Authored directly in `/src/utils/sound.ts` and module audio helpers under the platform's open-source educational codebase.
