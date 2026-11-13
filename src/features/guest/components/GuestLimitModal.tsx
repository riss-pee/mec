import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Flame,
  Award,
  Users,
  LayoutDashboard,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface GuestLimitModalProps {
  completedCount: number;
  limit: number;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onDismiss: () => void;
}

export const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
  completedCount,
  limit,
  onOpenSignIn,
  onOpenSignUp,
  onDismiss,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-lg bg-[#FFFDF5] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 sm:p-8 text-slate-900"
      >
        {/* Close X */}
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded bg-[#FFD166] border-2 border-black flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_#000]">
            ⚡
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
            DAILY GUEST EXPLORATION COMPLETE ({completedCount}/{limit})
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-2">
          Enjoying ZIRNA STEM STUDIO?
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed mb-5">
          You've solved today's {limit} free interactive challenges! Create your free account or sign in to continue unlimited STEM learning:
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs">
          <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#06D6A0]/20 border border-[#06D6A0] text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-black text-[11px]">Save Progress</strong>
              <span className="text-[10px] text-slate-500">Resume any time on any device</span>
            </div>
          </div>

          <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#FFD166]/20 border border-[#FFD166] text-amber-800 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-black text-[11px]">Daily Streaks</strong>
              <span className="text-[10px] text-slate-500">Non-punitive learning habits</span>
            </div>
          </div>

          <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#C4B5FD]/20 border border-[#C4B5FD] text-purple-800 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-black text-[11px]">Earn Badges</strong>
              <span className="text-[10px] text-slate-500">8 milestone achievements</span>
            </div>
          </div>

          <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#38BDF8]/20 border border-[#38BDF8] text-cyan-800 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-black text-[11px]">Classroom Battles</strong>
              <span className="text-[10px] text-slate-500">Collaborate with your school team</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onDismiss();
              onOpenSignIn();
            }}
            className="w-full py-3 bg-[#FFD166] hover:bg-[#ffc947] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <span>Sign In to ZIRNA Passport</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDismiss();
                onOpenSignUp();
              }}
              className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-black font-bold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer text-center"
            >
              Create Free Account
            </button>

            <button
              onClick={onDismiss}
              className="py-2.5 px-4 bg-transparent hover:bg-black/5 text-slate-600 hover:text-black font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Privacy reassurance */}
        <div className="mt-5 pt-4 border-t border-black/10 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero third-party trackers • No email required for students</span>
        </div>
      </motion.div>
    </div>
  );
};
