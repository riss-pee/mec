import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { KNOWN_LOCAL_STORAGE_KEYS } from '../../utils/consentManager';
import { Cookie, CheckCircle2, Sliders, Shield, HardDrive, Trash2 } from 'lucide-react';

interface CookiePolicyViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
  onOpenPreferences: () => void;
}

export const CookiePolicyView: React.FC<CookiePolicyViewProps> = ({
  onNavigateLegal,
  onBackToHub,
  onOpenPreferences,
}) => {
  const toc = [
    { id: 'what-are-cookies', label: '1. What Are Cookies & Web Storage?' },
    { id: 'storage-audit', label: '2. Audit of Keys Used' },
    { id: 'categories', label: '3. Storage Categories' },
    { id: 'no-tracking', label: '4. Zero Tracking / Advertising' },
    { id: 'managing-preferences', label: '5. How to Manage Preferences' },
    { id: 'withdrawal', label: '6. Withdrawing Consent & Erasure' },
  ];

  return (
    <LegalPageLayout
      id="cookies"
      title="Cookie & Local Storage Policy"
      subtitle="Complete technical audit of client-side browser storage and cookies utilized across ZIRNA STEM STUDIO."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. What Are Cookies */}
      <section id="what-are-cookies" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Cookie className="w-5 h-5 text-amber-600" />
          <span>1. What Are Cookies & Browser Web Storage?</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          When you use a modern interactive website, small bits of information are saved locally inside your web browser. There are two primary mechanisms:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-2">
            <h3 className="font-bold uppercase text-slate-900 flex items-center gap-1.5">
              <Cookie className="w-4 h-4 text-amber-700" />
              <span>HTTP Cookies</span>
            </h3>
            <p className="text-slate-600 leading-relaxed font-sans">
              Small text strings traditionally sent back and forth between browser and server on every HTTP request. Often misused on commercial sites for cross-site tracking and ad retargeting.
            </p>
            <p className="text-emerald-700 font-bold font-mono">
              Status on ZIRNA: ZERO HTTP cookies used.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 space-y-2">
            <h3 className="font-bold uppercase text-emerald-950 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-700" />
              <span>HTML5 Web Storage (localStorage)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed font-sans">
              A secure client-side sandbox allowing games and educational tools to save progress, challenge stars, and language settings solely inside your device&rsquo;s browser.
            </p>
            <p className="text-emerald-800 font-bold font-mono">
              Status on ZIRNA: Used exclusively for local state.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Storage Audit */}
      <section id="storage-audit" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-indigo-600" />
          <span>2. Full Audit of Storage Keys Used</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          In compliance with the highest transparency standards, here is the complete, verifiable inventory of every storage key accessed by ZIRNA STEM STUDIO:
        </p>
        
        <div className="overflow-x-auto border-2 border-black rounded-lg">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#FFFDF5] border-b-2 border-black text-black font-bold">
                <th className="p-3 border-r border-black">Storage Key</th>
                <th className="p-3 border-r border-black">Associated Module</th>
                <th className="p-3 border-r border-black">Category</th>
                <th className="p-3">Purpose & Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {KNOWN_LOCAL_STORAGE_KEYS.map((k) => (
                <tr key={k.key} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-indigo-700 border-r border-slate-200 whitespace-nowrap">
                    <code>{k.key}</code>
                  </td>
                  <td className="p-3 text-slate-800 border-r border-slate-200">
                    {k.module}
                  </td>
                  <td className="p-3 border-r border-slate-200">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      k.essential 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {k.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-sans text-xs">
                    {k.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Storage Categories */}
      <section id="categories" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-600" />
          <span>3. Storage Categories Explained</span>
        </h2>
        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <h3 className="font-bold font-mono text-black text-sm mb-1">
              Category A: Strictly Necessary / Essential Storage
            </h3>
            <p>
              Stores your consent choices (<code>zirna_storage_consent_v1</code>) so the platform knows your storage preferences. This cannot be disabled as it records your privacy choices.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <h3 className="font-bold font-mono text-black text-sm mb-1">
              Category B: Functional Educational Preferences (Optional)
            </h3>
            <p>
              Preserves challenge mode scores, star ratings across the 30 symmetry puzzles, and bilingual language preferences (Mizo vs. English). If you disable functional storage, simulations remain fully playable, but scores will not persist across browser refreshes.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <h3 className="font-bold font-mono text-black text-sm mb-1">
              Category C: Analytics & Tracking (None Used)
            </h3>
            <p>
              We do not utilize telemetry, user session tracking, or diagnostic profiling cookies.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Zero Tracking */}
      <section id="no-tracking" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-700" />
          <span>4. Zero Third-Party Advertising & Cross-Site Tracking</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          We strictly reject the commercial surveillance web:
        </p>
        <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
          <li>No Facebook / Meta Pixel or retargeting beacons.</li>
          <li>No Google AdSense or programmatic advertising scripts.</li>
          <li>No data broker integrations or student data resale.</li>
          <li>No device fingerprinting via canvas or audio context exploitation.</li>
        </ul>
      </section>

      {/* 5. Managing Preferences */}
      <section id="managing-preferences" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-600" />
          <span>5. How to Manage or Customize Your Preferences</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          You can adjust your storage preferences at any time using our built-in preferences dialog:
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenPreferences}
            className="retro-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFD166] hover:bg-[#ffc63a] border-2 border-black text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Storage & Cookie Settings Modal</span>
          </button>
        </div>
      </section>

      {/* 6. Withdrawal & Erasure */}
      <section id="withdrawal" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-rose-600" />
          <span>6. Withdrawing Consent & One-Click Erasure</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Consent is completely revocable. To clear every trace of stored scores, streaks, and preferences from your browser right now:
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigateLegal('data-deletion')}
            className="retro-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-100 hover:bg-rose-200 border-2 border-black text-xs font-mono font-bold text-rose-950 shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Trash2 className="w-4 h-4 text-rose-700" />
            <span>Go to Data Management & Deletion Tool</span>
          </button>
        </div>
      </section>
    </LegalPageLayout>
  );
};
