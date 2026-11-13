import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, HardDrive, Check, AlertCircle, Trash2, HelpCircle } from 'lucide-react';
import { getStoredConsent, saveConsent, resetConsent } from '../../utils/consentManager';
import { StorageConsentPreferences, LegalViewId } from '../../types/legal';
import { toast } from 'sonner';

interface StoragePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
}

export const StoragePreferencesModal: React.FC<StoragePreferencesModalProps> = ({
  isOpen,
  onClose,
  onNavigateLegal,
}) => {
  const [prefs, setPrefs] = useState<StorageConsentPreferences>(() => {
    return getStoredConsent() || {
      version: '1.0',
      timestamp: '',
      hasConsented: false,
      essential: true,
      functional: true,
      analytics: false,
    };
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredConsent();
      if (current) {
        setPrefs(current);
      }
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    saveConsent({
      essential: true,
      functional: prefs.functional,
      analytics: prefs.analytics,
    });
    toast.success('Storage & privacy preferences updated.');
    onClose();
  };

  const handleWithdrawConsent = () => {
    resetConsent();
    setPrefs({
      version: '1.0',
      timestamp: '',
      hasConsented: false,
      essential: true,
      functional: false,
      analytics: false,
    });
    toast.info('Storage consent withdrawn. Non-essential storage disabled.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="storage-prefs-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="bg-[#FFFDF5] border-3 border-black rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 brutal-shadow-lg font-sans text-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#FFD166] border-2 border-black flex items-center justify-center font-mono font-bold text-black text-sm">
                ⚙️
              </span>
              <div>
                <h2 id="storage-prefs-title" className="font-mono font-bold text-sm uppercase text-black">
                  Storage & Cookie Preferences
                </h2>
                <p className="text-[11px] font-mono text-slate-600">
                  Manage how ZIRNA STEM STUDIO saves data in your browser
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md border-2 border-black bg-white hover:bg-slate-100 text-black shadow-[1px_1px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Close storage preferences dialog"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Preferences Body */}
          <div className="py-4 space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Choose which client-side storage technologies may run on your device. We never use advertising cookies or third-party behavioral trackers.
            </p>

            {/* Category 1: Strictly Necessary */}
            <div className="p-3.5 rounded-lg border-2 border-black bg-white space-y-1.5 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs uppercase text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strictly Necessary Storage</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300">
                  Always Active
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Required to store your privacy consent state (<code>zirna_storage_consent_v1</code>) so the website respects your preferences. Cannot be turned off.
              </p>
            </div>

            {/* Category 2: Functional Learning State */}
            <div className="p-3.5 rounded-lg border-2 border-black bg-white space-y-2 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-between">
                <label htmlFor="pref-functional" className="font-mono font-bold text-xs uppercase text-slate-900 flex items-center gap-1.5 cursor-pointer">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span>Functional Learning State</span>
                </label>
                <input
                  id="pref-functional"
                  type="checkbox"
                  checked={prefs.functional}
                  onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                  className="w-4 h-4 accent-black cursor-pointer rounded focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Allows saving challenge game points, consecutive correct streak multipliers, language preference (Mizo/English), and star ratings across 30 symmetry puzzles.
              </p>
            </div>

            {/* Category 3: Analytics & Diagnostic Telemetry */}
            <div className="p-3.5 rounded-lg border-2 border-slate-300 bg-slate-50 space-y-2 opacity-80">
              <div className="flex items-center justify-between">
                <label htmlFor="pref-analytics" className="font-mono font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5 cursor-pointer">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Optional Diagnostic Telemetry</span>
                </label>
                <input
                  id="pref-analytics"
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  className="w-4 h-4 accent-black cursor-pointer rounded focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Currently <strong>none implemented</strong>. If enabled in future updates, this would send anonymous, aggregated simulation error reports to assist educational developers.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono font-bold">
            <button
              onClick={handleWithdrawConsent}
              className="text-rose-700 hover:text-rose-900 underline flex items-center gap-1 text-[11px] order-2 sm:order-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Withdraw Consent / Reset</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-white hover:bg-slate-100 border-2 border-black text-black shadow-[1px_1px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#06D6A0] hover:bg-[#05b385] border-2 border-black text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
