import React from 'react';
import { ArrowLeft, Printer, Shield, BookOpen, AlertCircle } from 'lucide-react';
import { LegalViewId } from '../../types/legal';

interface LegalPageLayoutProps {
  id: LegalViewId;
  title: string;
  subtitle: string;
  lastUpdated: string;
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
  children: React.ReactNode;
  tableOfContents?: { id: string; label: string }[];
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  id,
  title,
  subtitle,
  lastUpdated,
  onNavigateLegal,
  onBackToHub,
  children,
  tableOfContents,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const navItems: { id: LegalViewId; label: string }[] = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'refund', label: 'Refund Policy' },
    { id: 'cookies', label: 'Cookie & Storage' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'data-deletion', label: 'Data Management' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F0] text-slate-900 font-sans selection:bg-[#FFD166] selection:text-black">
      {/* Sticky Tactical Header */}
      <header className="sticky top-0 z-30 bg-[#FFFDF5] border-b-3 border-black px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="retro-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-[#FFF9E6] border-2 border-black text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Return to ZIRNA Hub Overview"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back to Hub</span>
            </button>
            <div className="h-5 w-px bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#FFD166] border border-black flex items-center justify-center text-black font-black text-xs font-mono">
                Z
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
                Legal & Compliance Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-50 border-2 border-black text-xs font-mono font-bold text-slate-800 shadow-[1px_1px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              title="Print document or save as PDF"
              aria-label="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={() => onNavigateLegal('data-deletion')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#06D6A0] hover:bg-[#05b385] border-2 border-black text-xs font-mono font-bold text-black shadow-[1px_1px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Manage stored data and deletion options"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Manage My Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Bar for All Legal Sections */}
      <nav 
        aria-label="Legal Center Navigation" 
        className="bg-white border-b-2 border-black/80 px-4 sm:px-8 py-2 overflow-x-auto shadow-xs"
      >
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-mono font-bold whitespace-nowrap">
          {navItems.map((item) => {
            const isActive = item.id === id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateLegal(item.id)}
                className={`px-3 py-1.5 rounded-md transition-colors border ${
                  isActive
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_#FFD166]'
                    : 'bg-transparent text-slate-700 border-transparent hover:border-black hover:bg-[#FFFDF5]'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Document Header Card */}
        <div className="bg-white rounded-xl border-3 border-black p-6 sm:p-8 brutal-shadow mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 pb-3 border-b border-slate-200">
            <span className="bg-[#FFF9E6] px-2 py-0.5 rounded border border-black/30 font-bold text-black">
              Official Governance Document
            </span>
            <span>
              Last Updated: <strong className="text-black">{lastUpdated}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight mt-4">
            {title}
          </h1>
          <p className="text-base text-slate-700 font-medium mt-2 leading-relaxed font-sans">
            {subtitle}
          </p>

          {/* Table of contents quick anchors if provided */}
          {tableOfContents && tableOfContents.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200 bg-slate-50/70 p-4 rounded-lg border border-slate-200">
              <div className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Jump to Section</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {tableOfContents.map((toc) => (
                  <a
                    key={toc.id}
                    href={`#${toc.id}`}
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-black text-slate-800 hover:text-black transition-colors"
                  >
                    {toc.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legal Body Content */}
        <article className="prose prose-slate max-w-none text-slate-800 space-y-6">
          {children}
        </article>

        {/* Statutory & Owner Verification Notice Box */}
        <div className="mt-12 bg-amber-50 rounded-xl border-2 border-amber-400 p-5 text-xs font-mono text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-wide text-amber-950">
              Notice for Website Administrator & Legal Counsel:
            </p>
            <p className="leading-relaxed">
              Bracketed placeholders (e.g. <code>[Insert Official Organization Name]</code>) must be replaced with verified organizational records. Please verify final terms against applicable statutory frameworks including India's <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong> and applicable intermediary/grievance guidelines.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
