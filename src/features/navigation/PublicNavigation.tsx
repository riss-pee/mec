import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, User, Menu, X, BookOpen } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { LegalViewId } from '../../types/legal';
import { toast } from 'sonner';

interface PublicNavigationProps {
  onSelectModule: (id: string) => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
  scrollToSection: (elementId: string) => void;
}

export const PublicNavigation: React.FC<PublicNavigationProps> = ({
  onSelectModule,
  onNavigateLegal,
  scrollToSection,
}) => {
  const { lang, setLang, t } = useTranslation();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b-3 border-black px-4 sm:px-8 py-3 shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* MEC Logo & Brand */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#06D6A0] border-2 border-black brutal-shadow-sm flex items-center justify-center font-mono font-black text-black text-base">
            MEC
          </div>
          <div>
            <div className="text-base sm:text-lg font-black tracking-tight text-black font-sans uppercase leading-none">
              {t.nav.brandTitle}
            </div>
            <div className="text-[11px] font-mono font-bold text-slate-600 tracking-wider flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] inline-block animate-pulse" />
              <span>{t.nav.brandSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => scrollToSection('explore-workshops')}
            className="text-black hover:text-[#06D6A0] transition-colors cursor-pointer"
          >
            {t.nav.exploreCourses}
          </button>

          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              className="flex items-center gap-1 text-slate-700 hover:text-black transition-colors cursor-pointer"
            >
              <span>{t.nav.resources}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isResourcesOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsResourcesOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#FFFDF5] border-3 border-black rounded-lg brutal-shadow-lg p-2.5 z-40 text-left font-mono"
                  >
                    <div className="text-[10px] uppercase font-black text-slate-500 px-2 py-1 border-b border-black/10 mb-1">
                      {t.nav.resourcesDropdownTitle}
                    </div>
                    <button
                      onClick={() => { onSelectModule('fraction-zirna'); setIsResourcesOpen(false); }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-[#FFD166] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Math Puzzle & Slices
                    </button>
                    <button
                      onClick={() => { onSelectModule('symmetry-match'); setIsResourcesOpen(false); }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-[#C4B5FD] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Geometry & Symmetry
                    </button>
                    <button
                      onClick={() => { onSelectModule('optics-lab'); setIsResourcesOpen(false); }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-[#38BDF8] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ray Tracing Physics Lab
                    </button>
                    <button
                      onClick={() => { onSelectModule('abacus-math'); setIsResourcesOpen(false); }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-[#06D6A0] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Soroban Mental Math
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => scrollToSection('learning-experience')}
            className="text-slate-700 hover:text-black transition-colors cursor-pointer"
          >
            {t.nav.theExperience}
          </button>
          <button
            onClick={() => onNavigateLegal('about')}
            className="text-slate-700 hover:text-black transition-colors cursor-pointer"
          >
            {t.nav.about}
          </button>
        </div>

        {/* Right Controls: Language & Sign In */}
        <div className="flex items-center gap-3">
          {/* Functional Bilingual Switcher: EN | MIZO */}
          <div 
            role="radiogroup" 
            aria-label="Language Selection"
            className="flex items-center bg-[#F5F5F0] border-2 border-black rounded-md p-0.5 text-xs font-mono font-bold"
          >
            <button
              role="radio"
              aria-checked={lang === 'EN'}
              onClick={() => {
                setLang('EN');
                toast.success('Language switched to English');
              }}
              className={`px-2 py-0.5 rounded-xs transition-all cursor-pointer ${
                lang === 'EN' ? 'bg-black text-white font-black' : 'text-slate-700 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              role="radio"
              aria-checked={lang === 'MIZO'}
              onClick={() => {
                setLang('MIZO');
                toast.success('Tawng thlan: Mizo');
              }}
              className={`px-2 py-0.5 rounded-xs transition-all cursor-pointer ${
                lang === 'MIZO' ? 'bg-black text-white font-black' : 'text-slate-700 hover:text-black'
              }`}
            >
              MIZO
            </button>
          </div>

          {/* Single Prominent Sign In CTA */}
          <button
            onClick={() => {
              window.location.hash = 'auth';
            }}
            className="retro-btn px-4 py-1.5 rounded-md bg-[#FFD166] border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5 hover:bg-[#ffc947] transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md border-2 border-black bg-white hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle mobile navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pt-4 pb-2 border-t-2 border-black/10 mt-3 font-mono text-xs font-bold space-y-2"
          >
            <button
              onClick={() => {
                scrollToSection('explore-workshops');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t.nav.exploreCourses}
            </button>
            <button
              onClick={() => {
                scrollToSection('learning-experience');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t.nav.theExperience}
            </button>
            <button
              onClick={() => {
                onNavigateLegal('about');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t.nav.about}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
