import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cookie, Sliders, X, Check, ArrowRight } from 'lucide-react';
import { getStoredConsent, saveConsent } from '../../utils/consentManager';
import { StorageConsentPreferences, LegalViewId } from '../../types/legal';

interface CookieConsentBannerProps {
  onOpenPreferences: () => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPreferences,
  onNavigateLegal,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent || !consent.hasConsented) {
      // Small delay for polite, non-jarring appearance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      functional: true,
      analytics: false,
    });
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      essential: true,
      functional: false,
      analytics: false,
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.aside
        role="region"
        aria-label="Storage and Privacy Consent"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 bg-[#FFFDF5] border-3 border-black rounded-xl p-5 sm:p-6 brutal-shadow-lg font-sans text-slate-900"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFD166] border-2 border-black flex items-center justify-center shrink-0 text-black shadow-[1px_1px_0px_#000]">
            <Cookie className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Browser Storage & Privacy Notice</span>
              </h3>
            </div>

            <p className="text-xs leading-relaxed text-slate-700">
              ZIRNA STEM STUDIO uses client-side browser storage (<code>localStorage</code>) to save your challenge scores, streaks, and language preferences locally. We do not use tracking or advertising cookies.
            </p>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 pb-1">
              <button
                onClick={() => onNavigateLegal('cookies')}
                className="underline hover:text-black font-bold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
              >
                Cookie & Storage Policy
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateLegal('privacy')}
                className="underline hover:text-black font-bold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
              >
                Privacy Policy
              </button>
            </div>

            {/* Three Distinct, Equal Options (No Dark Patterns) */}
            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
              <button
                onClick={handleAcceptAll}
                className="retro-btn flex-1 min-w-[120px] px-3.5 py-2 rounded-lg bg-[#06D6A0] hover:bg-[#05b385] border-2 border-black text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black text-center"
              >
                Accept All
              </button>

              <button
                onClick={handleRejectNonEssential}
                className="retro-btn flex-1 min-w-[140px] px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border-2 border-black text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black text-center"
              >
                Reject Non-Essential
              </button>

              <button
                onClick={onOpenPreferences}
                className="retro-btn px-3 py-2 rounded-lg bg-[#FFD166] hover:bg-[#ffc63a] border-2 border-black text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black flex items-center justify-center gap-1.5"
                title="Customize specific storage preferences"
                aria-label="Customize storage preferences"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preferences</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
