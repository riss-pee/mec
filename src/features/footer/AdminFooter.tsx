import React from 'react';
import { ShieldAlert, Terminal, Lock, Cpu } from 'lucide-react';
import { LegalViewId } from '../../types/legal';

interface AdminFooterProps {
  onNavigateLegal?: (viewId: LegalViewId) => void;
}

export const AdminFooter: React.FC<AdminFooterProps> = ({ onNavigateLegal }) => {
  return (
    <footer className="bg-[#0A0D14] border-t-2 border-black py-6 px-4 sm:px-8 text-slate-400 font-mono text-[11px] select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded bg-[#FFD166] text-black font-black flex items-center justify-center text-[10px] border border-black">
            Z
          </span>
          <span className="text-white font-bold">ZIRNA STEM PLATFORM</span>
          <span>•</span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <Cpu className="w-3 h-3" />
            <span>Telemetry Operational (99.98% uptime)</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Govt. of Mizoram DSE Directives</span>
          </span>
          <span>•</span>
          {onNavigateLegal && (
            <button
              onClick={() => onNavigateLegal('privacy')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          )}
          <span>•</span>
          <span className="text-slate-500">Release v2.4.0-MBSE</span>
        </div>
      </div>
    </footer>
  );
};
