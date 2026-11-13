import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { ShieldCheck, CheckCircle2, Lock, UserX, AlertTriangle, Eye, HardDrive, HelpCircle } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  onNavigateLegal,
  onBackToHub,
}) => {
  const toc = [
    { id: 'overview', label: '1. Overview' },
    { id: 'data-collected', label: '2. Information We Collect' },
    { id: 'local-storage', label: '3. Local vs. Server Storage' },
    { id: 'children-privacy', label: '4. Children’s Privacy' },
    { id: 'cookies-analytics', label: '5. Cookies & Analytics' },
    { id: 'third-parties', label: '6. Third-Party Integrations' },
    { id: 'retention-security', label: '7. Retention & Security' },
    { id: 'user-rights', label: '8. User Rights & Data Deletion' },
    { id: 'indian-dpdp', label: '9. DPDP Act 2023 Compliance' },
    { id: 'contact', label: '10. Contact & Grievance' },
  ];

  return (
    <LegalPageLayout
      id="privacy"
      title="Privacy Policy"
      subtitle="How ZIRNA STEM STUDIO safeguards student privacy through client-side architecture and zero personal data collection."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. Overview */}
      <section id="overview" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>1. Overview & Privacy-First Commitment</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          <strong>ZIRNA STEM STUDIO</strong> (operated by {ZIRNA_ORGANIZATION.legalEntityPlaceholder}, herein referred to as &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;the Platform&rdquo;) provides interactive elementary, middle, and high school STEM simulations, mathematics games, and physics laboratories.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          We believe educational tools—especially those used by young learners—must respect digital dignity. Unlike traditional educational portals that require user accounts, surveillance telemetry, or behavioral tracking, <strong>ZIRNA STEM STUDIO is engineered as a zero-surveillance, client-side educational suite</strong>. You can use all seven interactive learning modules freely without registration, passwords, or personal disclosure.
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section id="data-collected" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <UserX className="w-5 h-5 text-indigo-600" />
          <span>2. Information We Collect (Data Minimization)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300">
            <h3 className="font-mono text-xs font-bold uppercase text-emerald-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What We Do NOT Collect</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-emerald-950 font-medium list-disc list-inside">
              <li>No student or teacher real names</li>
              <li>No email addresses or phone numbers</li>
              <li>No physical addresses or school roll numbers</li>
              <li>No passwords, biometric data, or credentials</li>
              <li>No payment or financial transaction records</li>
              <li>No device geolocation or camera/microphone feeds</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-300">
            <h3 className="font-mono text-xs font-bold uppercase text-amber-900 mb-2 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-600" />
              <span>What Is Kept On Your Device</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-amber-950 font-medium list-disc list-inside">
              <li>Challenge game scores (e.g. Fraction Grid points)</li>
              <li>Streak counters (consecutive correct answers)</li>
              <li>Star ratings achieved (Symmetry Match 30 levels)</li>
              <li>Bilingual language setting (English vs. Mizo)</li>
              <li>Storage consent preferences</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-slate-600 italic">
          All gameplay state is strictly held inside your browser&rsquo;s local storage. None of this data is transmitted to or stored on any remote cloud database.
        </p>
      </section>

      {/* 3. Local vs. Server Storage */}
      <section id="local-storage" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-cyan-600" />
          <span>3. Technical Distinction: Local Storage vs. Server Storage</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          It is critical to distinguish between <em>local browser storage</em> and <em>server-side data collection</em>:
        </p>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono space-y-2 text-slate-800">
          <p>
            <strong>Local Web Storage (Used):</strong> HTML5 <code>localStorage</code> is an in-browser key-value sandbox on your physical computer, tablet, or phone. Data written to <code>localStorage</code> stays exclusively inside your browser application. Our web servers never receive, inspect, log, or index these entries.
          </p>
          <p>
            <strong>Remote Server Database (Not Used):</strong> We do not operate user accounts, central profiling databases, or analytics aggregation servers. If you switch devices or open a private browsing window, your local scores start fresh because no remote data repository exists.
          </p>
        </div>
      </section>

      {/* 4. Children’s Privacy */}
      <section id="children-privacy" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-600" />
          <span>4. Children’s Privacy Protection</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          ZIRNA STEM STUDIO is designed for school students ranging from early elementary (Grade 2) through secondary high school (Grade 12). Safeguarding minors is our foundational operational requirement:
        </p>
        <ul className="text-xs space-y-2 text-slate-700 list-disc list-inside">
          <li><strong>Zero Identifiable Collection from Minors:</strong> We do not collect, request, or solicit personal data from children under the age of 18 (or under 13 in relevant international jurisdictions).</li>
          <li><strong>No Behavioral Profiling or Commercial Ads:</strong> We never display third-party advertisements, nor do we profile students based on learning speed or module choices.</li>
          <li><strong>Parental & Educator Transparency:</strong> Parents and teachers can inspect the exact browser data stored at any time using our built-in <button onClick={() => onNavigateLegal('data-deletion')} className="text-emerald-700 font-bold underline">Data Management Tool</button> and erase it with a single click.</li>
        </ul>
      </section>

      {/* 5. Cookies & Analytics */}
      <section id="cookies-analytics" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-600" />
          <span>5. Cookies & Analytics Disclosure</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          We maintain an honest, non-coercive stance regarding tracking:
        </p>
        <ul className="text-xs space-y-2 text-slate-700 list-disc list-inside">
          <li><strong>HTTP Cookies:</strong> The website does not set HTTP tracking cookies or advertising cookies.</li>
          <li><strong>Third-Party Analytics:</strong> We do not run Google Analytics, Meta Pixel, Hotjar, Sentry, or third-party telemetry scripts.</li>
          <li><strong>Web Storage:</strong> We use standard browser <code>localStorage</code> for state retention. Full technical details are available in our <button onClick={() => onNavigateLegal('cookies')} className="text-emerald-700 font-bold underline">Cookie & Storage Policy</button>.</li>
        </ul>
      </section>

      {/* 6. Third-Party Integrations */}
      <section id="third-parties" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-slate-700" />
          <span>6. Third-Party Integrations & Font Delivery</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          To provide high-contrast, accessible typography suitable for young learners and classroom projection, the platform references Google Fonts (Space Grotesk, Fraunces, JetBrains Mono):
        </p>
        <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 text-xs font-mono text-slate-700 space-y-1">
          <p><strong>Service:</strong> Google Fonts (Alphabet Inc.)</p>
          <p><strong>Purpose:</strong> Web font stylesheet and font asset delivery</p>
          <p><strong>Data Involved:</strong> Standard HTTP request data (visitor IP address and browser User-Agent string as required to transmit the font file over TCP/IP).</p>
          <p><strong>Hosting Alternative:</strong> The website owner may elect to self-host font files locally on the origin server to eliminate external CDN requests.</p>
        </div>
      </section>

      {/* 7. Retention & Security */}
      <section id="retention-security" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-700" />
          <span>7. Data Retention & Client Security</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Because data is stored solely in your local browser sandbox, retention is entirely under your control. It remains until you:
        </p>
        <ol className="text-xs space-y-1.5 text-slate-700 list-decimal list-inside">
          <li>Click &ldquo;Clear All Stored Data&rdquo; in our <button onClick={() => onNavigateLegal('data-deletion')} className="text-emerald-700 font-bold underline">Data Management Tool</button>;</li>
          <li>Clear your browser cache and cookies via browser settings; or</li>
          <li>Close an Incognito or Private Browsing window session.</li>
        </ol>
      </section>

      {/* 8. User Rights */}
      <section id="user-rights" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <span>8. Your Rights: Access, Inspection, and Instant Erasure</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Under global privacy regulations and data protection laws, individuals have rights regarding their data. At Zirna STEM Studio, we make exercising these rights instantaneous and self-service:
        </p>
        <ul className="text-xs space-y-2 text-slate-700 list-disc list-inside">
          <li><strong>Right of Access & Inspection:</strong> View every single key and value saved in your browser at any time.</li>
          <li><strong>Right of Portability:</strong> Download a clean JSON file containing all saved scores and settings.</li>
          <li><strong>Right to Erasure (Right to be Forgotten):</strong> Purge all local records with zero delay or friction.</li>
          <li><strong>Right to Object / Withdraw Consent:</strong> Toggle off functional storage anytime in Cookie Settings.</li>
        </ul>
      </section>

      {/* 9. Indian DPDP Act */}
      <section id="indian-dpdp" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>9. Notice Under India’s Digital Personal Data Protection Act, 2023</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          For users and educational institutions situated in India:
        </p>
        <div className="text-xs leading-relaxed text-slate-700 space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p>
            The <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> governs the processing of digital personal data within the territory of India. Under Section 4 and Section 6 of the Act, personal data may only be processed for a lawful purpose with specific notice and consent, or for certain legitimate uses.
          </p>
          <p>
            Furthermore, <strong>Section 9 of the DPDP Act</strong> establishes strict obligations regarding the processing of children&rsquo;s personal data, prohibiting behavioral monitoring, targeted advertising, and any processing likely to cause detrimental effects on the well-being of a child.
          </p>
          <p>
            Because ZIRNA STEM STUDIO does not collect or transmit digital personal data of students to remote servers, our architecture inherently complies with the core statutory mandate of data minimization. The website administrator and legal counsel should review any future backend additions against relevant notification rules issued by the Ministry of Electronics and Information Technology (MeitY).
          </p>
        </div>
      </section>

      {/* 10. Contact & Grievance */}
      <section id="contact" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>10. Contact Information & Grievance Redressal</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          If you have questions, concerns, or requests regarding this Privacy Policy or platform practices, please contact our designated grievance channel:
        </p>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs space-y-1.5 text-slate-800">
          <div><strong>Responsible Entity:</strong> {ZIRNA_ORGANIZATION.legalEntityPlaceholder}</div>
          <div><strong>Physical / Registered Address:</strong> {ZIRNA_ORGANIZATION.addressPlaceholder}</div>
          <div><strong>Official Inquiries:</strong> {ZIRNA_ORGANIZATION.contactEmailPlaceholder}</div>
          <div><strong>Designated Grievance Officer:</strong> {ZIRNA_ORGANIZATION.grievanceOfficerPlaceholder}</div>
          <div><strong>Response Timeline:</strong> Grievance inquiries are acknowledged within 48 hours and resolved in accordance with applicable statutory timelines.</div>
        </div>
      </section>
    </LegalPageLayout>
  );
};
