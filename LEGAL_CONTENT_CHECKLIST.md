# Legal Content & Organization Onboarding Checklist — ZIRNA STEM STUDIO

**Document Date:** November 13, 2026  
**Audience:** Platform Owner, School Administrators, Legal Counsel & Webmaster

---

## 1. Overview

To maintain the highest ethical and legal standards, ZIRNA STEM STUDIO was constructed with **transparent placeholders** rather than fabricated corporate records or unverified legal guarantees.

Before launching this website publicly or presenting it to educational authorities (such as the Mizoram Board of School Education, NCERT, or state education departments), the website owner must review and complete the following verification checklist.

---

## 2. Organization Details to Supply

Search the codebase for the bracketed placeholders and replace them with verified official records:

| Field | Placeholder Currently in Code | Action Required by Owner |
| :--- | :--- | :--- |
| **Legal Entity Name** | `[Insert Official Registered Organization / Society Name]` | Replace with registered Society, Trust, Section 8 Non-Profit, or LLP name (e.g., *Mizoram Education Centre Society*). |
| **Physical / Registered Address** | `[Insert Official Registered Physical Address]` | Replace with complete postal address in Mizoram / India including PIN code. |
| **Official Email** | `[Insert Official Contact Email]` | Supply active email domain inbox (e.g., `contact@mizorameducationcentre.com` or `director@zirnastem.org`). |
| **Registration Number** | `[Insert Society Registration Number / CIN / NGO Darpan ID]` | Provide the official NGO Darpan / Society Registration number under the Societies Registration Act (or equivalent). |
| **Grievance Officer Name** | `[Insert Name & Contact of Designated Grievance Officer]` | Appoint and list a specific person responsible for redressal under Indian IT Rules 2021 and DPDP Act 2023. |
| **Official Website URL** | `mizorameducationcentre.com` / `zirnastem.org` | Confirm production domain DNS and SSL certificate. |

**Location in Code:**
All organization metadata is centralized in:
[`src/types/legal.ts`](file:///c:/Users/rspac/Documents/project/fraction-zirna-game/src/types/legal.ts) under `ZIRNA_ORGANIZATION`. Updating this object updates all legal pages simultaneously!

---

## 3. Statutory & Regulatory Verification (Indian Law Context)

Have qualified Indian legal counsel review the published text against:

1. **Digital Personal Data Protection Act, 2023 (DPDP Act):**
   - Verify that the current client-side zero-collection model remains intact.
   - If user accounts, remote leaderboards, or cloud database storage are added in the future, ensure verifiable parental consent workflows are built prior to storing children's data under Section 9.
2. **Information Technology (Intermediary Guidelines) Rules, 2021:**
   - Confirm that the designated Grievance Officer's contact details and physical address are kept up to date.
   - Confirm adherence to the 48-hour grievance acknowledgment and 30-day resolution timeline.
3. **Consumer Protection (E-Commerce) Rules, 2020:**
   - Confirm that the 100% Free status remains accurate, or publish updated terms if paid physical kits are sold.

---

## 4. Pre-Launch Verification Checklist

- [ ] All 5 bracketed placeholders in `src/types/legal.ts` replaced with verified organizational records.
- [ ] Registered physical address and Grievance Officer details confirmed.
- [ ] Google Fonts CDN evaluated; decision made whether to keep Google Fonts CDN or self-host binaries locally in `/public/fonts`.
- [ ] Email destination `mailto:` address verified in `src/components/legal/ContactView.tsx`.
- [ ] Verified that all seven educational modules operate without remote telemetry.
- [ ] End-to-end browser tests verified with Playwright across Desktop (1440px), Tablet (768px), and Mobile (390px).
