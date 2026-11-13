# Third-Party Dependencies & Network Audit — ZIRNA STEM STUDIO

**Audit Date:** November 13, 2026  
**Audited Target:** `package.json`, `package-lock.json`, `index.html`, and network requests  
**Objective:** Identify, verify, and document all external software dependencies, CDNs, and network connections.

---

## 1. Inventory Summary

| Category | Status | Count | Privacy Impact |
| :--- | :--- | :--- | :--- |
| **Analytics & Telemetry SDKs** | **None** | 0 | Zero tracking |
| **Advertising & Retargeting SDKs** | **None** | 0 | Zero ad surveillance |
| **Authentication Providers** | **None** | 0 | Zero credential harvesting |
| **External Backend REST/GraphQL APIs** | **None** | 0 | Zero remote data logging |
| **External Error Monitoring (e.g. Sentry)** | **None** | 0 | Zero diagnostic telemetry |
| **External Typography CDNs** | **Google Fonts** | 1 | Minimal (IP/User-Agent at load) |
| **NPM Runtime Dependencies** | **Open Source** | 9 | Zero tracking |

---

## 2. External CDN & Network Resource: Google Fonts

| Attribute | Details |
| :--- | :--- |
| **Service Provider** | Google LLC (Alphabet Inc.) |
| **Resource URLs** | `fonts.googleapis.com` (stylesheet), `fonts.gstatic.com` (font binaries) |
| **Purpose** | High-contrast typography optimized for school projection and young readers (Space Grotesk, Fraunces, JetBrains Mono, Patrick Hand, Plus Jakarta Sans). |
| **Information Accessed** | Standard TCP/IP handshake data (Visitor IP address and User-Agent header) transmitted to Google edge servers to deliver the `.woff2` font files. |
| **Cookies Set** | No cookies are set by Google Fonts. |
| **Essentiality** | Non-essential for logic; essential for aesthetic and font consistency. |
| **Consent Requirement** | Disclosed in Privacy Policy under third-party integrations. |
| **Replacement / Hardening** | Can be self-hosted locally by downloading font binaries into `/public/fonts/` and referencing them via local `@font-face` rules. This completely eliminates third-party CDN contact. |

---

## 3. Runtime Dependency Audit (`package.json`)

All runtime packages are standard, verified open-source libraries:

| Package | Version | Purpose | Telemetry Checked | License |
| :--- | :--- | :--- | :--- | :--- |
| `react` | `^19.0.1` | Declarative UI framework | No telemetry | MIT |
| `react-dom` | `^19.0.1` | Web DOM renderer for React | No telemetry | MIT |
| `motion` | `^12.23.24` | Accessible physics & spring animations | No telemetry | MIT |
| `lucide-react` | `^0.546.0` | Accessible vector icon library | No telemetry | ISC |
| `sonner` | `^2.0.1` | Accessible stacked toast notifications | No telemetry | MIT |
| `clsx` | `^2.1.1` | Conditional className concatenation | No telemetry | MIT |
| `tailwind-merge` | `^3.0.2` | Conflict-free Tailwind utility merge | No telemetry | MIT |
| `tailwindcss` | `^4.1.14` | Utility-first styling framework | No telemetry | MIT |
| `@tailwindcss/vite` | `^4.1.14` | Vite compilation plugin for Tailwind | No telemetry | MIT |

---

## 4. Removed or Prohibited Technologies

During the audit and enhancement phase:
1. **Corporate Supporter Endorsements:** Removed fabricated supporter and corporate partner logos (Bank of America, Bill & Melinda Gates Fdn, Tata Trusts) from `src/Hub.tsx` to ensure complete truth in advertising.
2. **External Analytics SDKs:** Confirmed zero inclusion of Google Tag Manager, Google Analytics, Firebase Analytics, Meta Pixel, Hotjar, or Mixpanel.
3. **External Audio Hosts:** All audio effects (bead clacks, chimes, pops) are synthesized mathematically in real-time via the browser's native **HTML5 Web Audio API** (`AudioContext`). No audio `.mp3` files are fetched from third-party streaming servers.
