import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { toast } from 'sonner';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onBackToHub: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onBackToHub }) => {
  const { adminSignIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await adminSignIn({ email: email.trim(), password });
      toast.success('Admin authorization verified.');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Access Denied: Administrative credentials could not be verified.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@zirnastem.org');
    setPassword('admin123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative selection:bg-[#FFD166] selection:text-black overflow-hidden">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#38BDF8 1px, transparent 1px), radial-gradient(#06D6A0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* Top Bar Return Button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          onClick={onBackToHub}
          className="px-3.5 py-1.5 rounded-lg border-2 border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_#000]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Portal</span>
        </button>

        <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold">
          SECURITY LEVEL 4
        </span>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-md bg-[#111622] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 sm:p-8"
      >
        {/* Header Badge */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#FFD166] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] text-black">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-mono text-[11px] font-black tracking-widest text-[#FFD166] uppercase">
              ZIRNA STEM PLATFORM
            </div>
            <h1 className="font-mono font-black text-lg text-white tracking-tight">
              Administrator Gateway
            </h1>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="mb-5 p-3 rounded-lg border-2 border-slate-800 bg-[#0B0F19] text-slate-400 text-xs font-mono flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Restricted environment. Access is monitored and logged in compliance with Directorate of School Education cybersecurity directives.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 rounded-xl border-2 border-rose-600 bg-rose-950/60 text-rose-200 text-xs font-mono flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Authorization Refused:</span>
              <span>{errorMsg}</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
              Administrative Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zirnastem.org"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0B0F19] border-2 border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FFD166] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
              Security Key / Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-[#0B0F19] border-2 border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FFD166] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 bg-[#FFD166] hover:bg-[#ffc947] text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4 stroke-[2.5]" />
                  <span>Verify & Enter Dashboard</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Fast-fill Shortcut */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="text-[11px] font-mono text-slate-500 mb-2">
            EVALUATION & DEMONSTRATION ACCESS
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="w-full py-2 px-3 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>⚡ Auto-fill Owner Admin Demo Credentials</span>
          </button>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-8 text-center font-mono text-[11px] text-slate-600">
        Directorate of School Education • Mizoram Education Centre (MEC)
      </div>
    </div>
  );
};
