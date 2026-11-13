import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  School, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { UserRole, AuthModalView } from '../types';
import { toast } from 'sonner';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalView, openAuthModal, closeAuthModal, signIn, signUp, enterAsGuest } = useAuth();

  const [view, setView] = useState<AuthModalView>(authModalView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('');
  const [guestNickname, setGuestNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync internal view with prop
  React.useEffect(() => {
    setView(authModalView);
  }, [authModalView]);

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn({ email, password });
    } catch {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password) {
      toast.error('Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp({
        displayName,
        email,
        password,
        role,
        schoolName: schoolName.trim() || undefined,
        grade: grade.trim() || undefined,
      });
    } catch {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enterAsGuest(guestNickname.trim() || undefined);
  };

  const fillDemoTeacher = () => {
    setEmail('teacher@zirnastem.org');
    setPassword('teacher123');
  };

  const fillDemoStudent = () => {
    setEmail('alex@zirnastem.org');
    setPassword('student123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        role="dialog"
        aria-labelledby="auth-modal-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-md bg-[#FFFDF5] border-3 border-black brutal-shadow-lg rounded-2xl p-6 sm:p-8 text-slate-900 select-none overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-[#FFD166] border border-black flex items-center justify-center font-mono font-bold text-xs shadow-[1px_1px_0px_#000]">
              Z
            </span>
            <span className="font-mono font-black text-xs uppercase tracking-wider text-black">
              ZIRNA STEM PASSPORT
            </span>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* View Selection Tabs */}
        {view !== 'forgot-password' && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-white border-2 border-black rounded-lg mb-6 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setView('sign-in')}
              className={`py-2 rounded-md transition-all cursor-pointer ${
                view === 'sign-in'
                  ? 'bg-[#FFD166] text-black border border-black shadow-[1px_1px_0px_#000]'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setView('sign-up')}
              className={`py-2 rounded-md transition-all cursor-pointer ${
                view === 'sign-up'
                  ? 'bg-[#FFD166] text-black border border-black shadow-[1px_1px_0px_#000]'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* ============================================================
            VIEW 1: SIGN IN
            ============================================================ */}
        {view === 'sign-in' && (
          <div>
            <div className="mb-5">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-black text-black font-sans tracking-tight">
                Welcome back, Learner!
              </h2>
              <p className="text-xs text-slate-600 font-medium font-sans mt-1">
                Access your personalized STEM dashboard, learning streak, and classroom sessions.
              </p>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">Password</label>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-[11px] text-blue-700 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="retro-btn w-full py-2.5 bg-[#FFD166] hover:bg-[#ffc63a] text-black border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>

            {/* Quick Demo Logins for Fast Demonstration */}
            <div className="mt-6 pt-4 border-t border-black/10">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-2">
                Quick 1-Click Demo Accounts:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold">
                <button
                  type="button"
                  onClick={fillDemoTeacher}
                  className="px-2 py-1.5 rounded bg-[#EDE9FE] hover:bg-[#ddd6fe] border border-black text-purple-900 transition-colors text-center cursor-pointer"
                >
                  👩‍🏫 Fill Teacher
                </button>
                <button
                  type="button"
                  onClick={fillDemoStudent}
                  className="px-2 py-1.5 rounded bg-[#E0F2FE] hover:bg-[#bae6fd] border border-black text-sky-900 transition-colors text-center cursor-pointer"
                >
                  🚀 Fill Student
                </button>
              </div>
            </div>

            {/* Guest Entry Option */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setView('guest-picker')}
                className="text-xs font-mono text-slate-600 hover:text-black hover:underline cursor-pointer"
              >
                Don't have an account? Continue as Guest →
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 2: CREATE ACCOUNT
            ============================================================ */}
        {view === 'sign-up' && (
          <div>
            <div className="mb-4">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-black text-black font-sans tracking-tight">
                Create Your STEM Account
              </h2>
              <p className="text-xs text-slate-600 font-medium font-sans mt-1">
                Save your progress, unlock achievements, and join classroom team battles.
              </p>
            </div>

            {/* Role Selection: Student vs Teacher */}
            <div className="mb-4">
              <label className="block text-xs font-mono font-bold text-slate-800 mb-1.5">
                I am signing up as:
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 rounded-lg border-2 border-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    role === 'student'
                      ? 'bg-[#06D6A0] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-slate-600 hover:text-black'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-2.5 rounded-lg border-2 border-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    role === 'teacher'
                      ? 'bg-[#C4B5FD] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-slate-600 hover:text-black'
                  }`}
                >
                  <School className="w-4 h-4" />
                  <span>Teacher</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {role === 'student' ? 'Nickname / Display Name' : 'Full Name & Title'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'student' ? 'e.g. MizoLearner42' : 'e.g. Miss Lalrinawmi'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="learner@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional school info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">School (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Govt Mizo HS"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {role === 'student' ? 'Class/Grade' : 'Department'}
                  </label>
                  <input
                    type="text"
                    placeholder={role === 'student' ? 'Class 6' : 'Science Dept'}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                  />
                </div>
              </div>

              {/* Responsible privacy note */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Zero tracking. Pseudonymous student identities welcome. We collect only what is strictly required to save progress.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="retro-btn w-full py-2.5 bg-[#06D6A0] hover:bg-[#05b888] text-black border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Register & Launch Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================
            VIEW 3: GUEST PICKER
            ============================================================ */}
        {view === 'guest-picker' && (
          <div>
            <div className="mb-4">
              <h2 id="auth-modal-title" className="text-xl font-black text-black font-sans tracking-tight">
                Continue as Guest
              </h2>
              <p className="text-xs text-slate-600 font-medium font-sans mt-1">
                Explore all 7 STEM modules and join classroom sessions without creating a permanent account.
              </p>
            </div>

            <form onSubmit={handleGuestSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Choose a Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. StarLearner or Alex"
                  value={guestNickname}
                  onChange={(e) => setGuestNickname(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="retro-btn w-full py-2.5 bg-[#FFD166] hover:bg-[#ffc63a] text-black border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Playing as Guest</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => setView('sign-in')}
                className="w-full py-2 text-slate-600 hover:text-black text-xs font-mono cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </form>
          </div>
        )}

        {/* ============================================================
            VIEW 4: FORGOT PASSWORD
            ============================================================ */}
        {view === 'forgot-password' && (
          <div>
            <div className="mb-4">
              <h2 id="auth-modal-title" className="text-xl font-black text-black font-sans tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-slate-600 font-medium font-sans mt-1">
                Enter your email address to receive password reset instructions.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Password reset link sent to your email.');
                setView('sign-in');
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div>
                <label className="block font-bold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="retro-btn w-full py-2.5 bg-[#FFD166] text-black border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Send Reset Link
              </button>

              <button
                type="button"
                onClick={() => setView('sign-in')}
                className="w-full py-2 text-slate-600 hover:text-black text-xs font-mono cursor-pointer"
              >
                ← Return to Sign In
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
