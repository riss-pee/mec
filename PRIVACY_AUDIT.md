# Privacy & Data Minimization Audit — ZIRNA STEM STUDIO

**Audit Date:** November 13, 2026  
**Auditor:** Senior Frontend Engineer & Privacy Compliance Specialist  
**Audited Target:** ZIRNA STEM STUDIO (`fraction-zirna-suite`)  
**Statutory Benchmark:** Digital Personal Data Protection Act, 2023 (India), Information Technology Act 2000 & 2021 Rules, and global children's privacy best practices (COPPA).

---

## 1. Executive Summary

ZIRNA STEM STUDIO was audited across all source files, network interfaces, storage APIs, and client interactions. The platform was evaluated on:
1. **Data Minimization:** Whether any personal identifiers are collected without necessity.
2. **Storage Architecture:** Distinguishing client-side browser sandboxing from server-side databases.
3. **Children's Privacy Protection:** Evaluating risk for learners under 18 years of age.
4. **Third-Party Surveillance:** Verifying whether ad trackers, behavioral pixels, or telemetry exist.

**Conclusion:** ZIRNA STEM STUDIO demonstrates an exemplary **zero-surveillance client-side architecture**. The platform does not collect student personal information, operates without user account credentials, sets no HTTP tracking cookies, and runs zero telemetry SDKs.

---

## 2. Personal Data Collection Audit

| Category | Status | Details |
| :--- | :--- | :--- |
| **Real Names** | **NOT Collected** | The platform does not require or collect student real names. |
| **Email Addresses** | **NOT Collected** | No account registration or email subscription system exists. |
| **Passwords / Credentials** | **NOT Collected** | No authentication system or credential storage exists. |
| **Phone Numbers** | **NOT Collected** | No SMS or mobile verification gates exist. |
| **Physical Addresses** | **NOT Collected** | No shipping, physical location, or school roll data is requested. |
| **Financial / Payment Data**| **NOT Collected** | The platform is 100% free; no payment gateways exist. |
| **Biometric / Device Feeds**| **NOT Collected** | No camera, microphone, or biometric APIs are accessed. |
| **Precise Geolocation** | **NOT Collected** | The HTML5 Geolocation API is never invoked. |

---

## 3. Web Storage & Browser Sandbox Audit

An exhaustive code scan of `localStorage`, `sessionStorage`, and `document.cookie` identified exactly **6 client-side storage keys**, all stored locally within the user's browser sandbox:

| Storage Key | Module | Purpose | Essential or Optional |
| :--- | :--- | :--- | :--- |
| `fraction_game_score` | Fraction Grid Game MIZO | Stores challenge mode score across rounds | Optional / Functional |
| `fraction_game_streak` | Fraction Grid Game MIZO | Stores consecutive correct streaks | Optional / Functional |
| `fraction_game_lang` | Fraction Grid Game MIZO | Remembers language preference (`en` vs `mizo`) | Optional / Functional |
| `symmetry_match_lang` | Symmetry Mirror Match | Remembers language preference (`en` vs `mizo`) | Optional / Functional |
| `symmetry_match_stars`| Symmetry Mirror Match | Records star rating (1–3 stars) across 30 levels | Optional / Functional |
| `zirna_storage_consent_v1`| Platform Core | Records user storage consent choices | Essential |

### Technical Verification:
- **No Remote Transmission:** These keys are never transmitted to a remote web server or API endpoint.
- **Client Sandbox Scope:** Data remains restricted to the browser origin. Clearing browser cache or utilizing Private/Incognito mode immediately purges all entries.
- **Portability & Erasure:** Users can inspect every key, download a JSON backup, and trigger instant one-click deletion via the `/src/components/legal/DataDeletionView.tsx` screen.

---

## 4. Children's Privacy Audit (DPDP Act 2023 §9 & COPPA)

ZIRNA STEM STUDIO serves school learners ranging from Grade 2 (elementary) through Grade 12 (secondary).

1. **Section 9 of DPDP Act 2023 (Processing of Child Data):**
   - The platform does not engage in behavioral tracking, student profiling, or targeted advertisements.
   - The platform does not undertake processing likely to cause detrimental effects on child well-being.
   - Because no personal data is collected or transmitted remotely, parent/guardian verifiable consent is not triggered for simple anonymous client-side game simulation play.
2. **Classroom & School Device Compliance:**
   - On shared school computer lab devices, teachers or students can click **"Erase All Stored Data"** in the footer at the conclusion of a period to ensure no learner state persists between different student shifts.

---

## 5. Form & Consent Audit

Every interactive input throughout the application was audited:
1. **Mathematics Manipulatives (Sliders & Radios):**
   - Numerator/denominator sliders, ray-tracing lens focal lengths, velocity inputs, and coordinate cannon targeting controls are purely client-side state hooks (`useState`). No data leaves the browser thread.
2. **Math Challenge Inputs:**
   - Numerical answer inputs (e.g. Abacus Studio challenge check) validate mathematical equality in memory and discard on round change.
3. **Contact / Inquiry Form (`ContactView.tsx`):**
   - Does not silently insert inquiries into a cloud database.
   - Uses a transparent `mailto:` handler that launches the visitor's email client with pre-filled subject and recipient, putting message transmission strictly in the user's hands.

---

## 6. Recommendations for Website Owner

1. **Maintain Zero-Tracking Guarantee:** Do not embed Google Tag Manager, Meta Pixel, or commercial analytics scripts in future updates without formal DPDP notice and consent gating.
2. **Self-Host Google Fonts (Optional Hardening):** To achieve 100% zero external network contact, download the font files (`SpaceGrotesk`, `Fraunces`, `JetBrainsMono`) into `/public/fonts` and serve them from origin.
3. **Verify Organization Identity:** Replace `[Insert Official Registered Organization / Society Name]` and `[Insert Physical / Registered Address]` with official registered details.
