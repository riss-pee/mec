import React from 'react';
import { LegalViewId } from '../../types/legal';
import { MODULES_REGISTRY } from '../../data/modulesRegistry';
import { useTranslation } from '../../i18n';
import { 
  ShieldCheck, 
  Trash2, 
  Sliders, 
  BookOpen, 
  GraduationCap,
  Scale,
  Sparkles,
  MapPin,
  Building2
} from 'lucide-react';

interface SiteFooterProps {
  onSelectModule?: (id: string) => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
  onOpenStoragePreferences: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onSelectModule,
  onNavigateLegal,
  onOpenStoragePreferences,
}) => {
  const { t } = useTranslation();

  return (
    <footer 
      id="site-footer" 
      role="contentinfo" 
      aria-label="Site and Governance Footer"
      className="bg-[#0b1a30] text-slate-300 border-t-3 border-black pt-14 pb-12 px-4 sm:px-8 font-sans select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        
        {/* ============================================================
            COL 1: BRAND, MISSION & ORGANIZATIONAL IDENTITY
            ============================================================ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-white font-black text-lg">
            <span className="w-8 h-8 rounded bg-[#06D6A0] border border-black flex items-center justify-center text-black font-mono font-bold text-xs shadow-[1px_1px_0px_#000]">
              Z
            </span>
            <span className="font-sans tracking-tight">ZIRNA STEM STUDIO</span>
          </div>

          <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans">
            {t.footer.missionDesc}
          </p>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.footer.zeroSurveillance}</span>
            </div>
            <div>{t.footer.zeroSurveillanceDesc}</div>
          </div>

          {/* Clean Entity Badge — No raw development brackets */}
          <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Building2 className="w-3.5 h-3.5 text-[#FFD166]" />
              <span>{t.footer.entityName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.footer.entityAddress}</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            COL 2: THE 7 INTERACTIVE STEM MODULES
            ============================================================ */}
        <div className="space-y-2.5 text-xs font-mono">
          <h4 className="font-bold text-white uppercase text-sm mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#FFD166]" />
            <span>{t.footer.colModulesTitle}</span>
          </h4>
          {MODULES_REGISTRY.map((m) => (
            <div key={m.id}>
              {onSelectModule ? (
                <button
                  onClick={() => onSelectModule(m.id)}
                  className="hover:text-white transition-colors text-left flex items-center gap-2 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:underline w-full py-0.5"
                >
                  <span className="text-[10px] text-slate-500 font-bold">[{m.number}]</span>
                  <span className="hover:underline">{m.title}</span>
                </button>
              ) : (
                <a
                  href={`#${m.id}`}
                  className="hover:text-white transition-colors flex items-center gap-2 text-slate-400 focus-visible:outline-none focus-visible:underline w-full py-0.5"
                >
                  <span className="text-[10px] text-slate-500 font-bold">[{m.number}]</span>
                  <span className="hover:underline">{m.title}</span>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* ============================================================
            COL 3: RESOURCES & PEDAGOGY
            ============================================================ */}
        <div className="space-y-2.5 text-xs font-mono">
          <h4 className="font-bold text-white uppercase text-sm mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
            <span>{t.footer.colResourcesTitle}</span>
          </h4>
          <div>
            <button
              onClick={() => onNavigateLegal('about')}
              className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline py-0.5"
            >
              {t.footer.aboutLink}
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('about')}
              className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline py-0.5"
            >
              {t.footer.curriculumLink}
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('accessibility')}
              className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline py-0.5"
            >
              {t.footer.accessibilityLink}
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('contact')}
              className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline py-0.5"
            >
              {t.footer.contactLink}
            </button>
          </div>
        </div>

        {/* ============================================================
            COL 4: LEGAL, PRIVACY & DATA SOVEREIGNTY
            ============================================================ */}
        <div className="space-y-3 text-xs font-mono">
          <h4 className="font-bold text-white uppercase text-sm mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#C4B5FD]" />
            <span>{t.footer.colLegalTitle}</span>
          </h4>

          <div className="space-y-2">
            <div>
              <button
                onClick={() => onNavigateLegal('privacy')}
                className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline"
              >
                {t.footer.privacyLink}
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigateLegal('terms')}
                className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline"
              >
                {t.footer.termsLink}
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigateLegal('refund')}
                className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline"
              >
                {t.footer.refundLink}
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigateLegal('cookies')}
                className="text-slate-400 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:underline"
              >
                {t.footer.cookieLink}
              </button>
            </div>
          </div>

          {/* Interactive Privacy Action Controls */}
          <div className="pt-2 space-y-2">
            <button
              onClick={onOpenStoragePreferences}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#FFD166]" />
                <span className="truncate">{t.footer.btnStoragePreferences}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold shrink-0">Edit</span>
            </button>

            <button
              onClick={() => onNavigateLegal('data-deletion')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="truncate">{t.footer.btnDataDeletion}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold shrink-0">Purge</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          SUB-FOOTER BAR
          ============================================================ */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          {t.footer.copyrightNotice}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigateLegal('privacy')}
            className="hover:text-slate-300 transition-colors focus-visible:underline"
          >
            {t.footer.privacyLink}
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateLegal('terms')}
            className="hover:text-slate-300 transition-colors focus-visible:underline"
          >
            {t.footer.termsLink}
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateLegal('accessibility')}
            className="hover:text-slate-300 transition-colors focus-visible:underline"
          >
            Accessibility
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateLegal('data-deletion')}
            className="hover:text-slate-300 transition-colors focus-visible:underline"
          >
            {t.footer.dataRightsLink}
          </button>
          <span>•</span>
          <a
            href="#admin/login"
            className="hover:text-amber-400 transition-colors focus-visible:underline text-slate-500 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Admin Portal</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
