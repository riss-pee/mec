import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  School,
  User,
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Compass,
  AlertCircle,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthPageViewMode } from '../types';
import { toast } from 'sonner';

interface AuthPageViewProps {
  onSuccess: () => void;
  onBackToHub: () => void;
}

export const AuthPageView: React.FC<AuthPageViewProps> = ({ onSuccess, onBackToHub }) => {
  const { studentLogin, signIn, submitTeacherRequest, enterAsGuest, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthPageViewMode>('student-login');

  // Student Login State (Username + PIN)
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPin, setStudentPin] = useState('');

  // Teacher Login State (Email + Password)
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  // Teacher Application Request State
  const [reqFullName, setReqFullName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqSchool, setReqSchool] = useState('');
  const [reqDesignation, setReqDesignation] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);

  // Guest Nickname
  const [guestNickname, setGuestNickname] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fast Auto-fill Demo Helpers
  const fillStudentDemo = () => {
    setStudentUsername('alex.class06');
    setStudentPin('123456');
    setErrorMsg(null);
  };

  const fillTeacherDemo = () => {
    setTeacherEmail('teacher@zirnastem.org');
    setTeacherPassword('teacher123');
    setErrorMsg(null);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await studentLogin({
        username: studentUsername.trim(),
        pinOrPassword: studentPin.trim(),
      });
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect student username or PIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signIn({
        email: teacherEmail.trim(),
        password: teacherPassword,
      });
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Teacher login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await submitTeacherRequest({
        fullName: reqFullName,
        email: reqEmail,
        schoolName: reqSchool,
        designation: reqDesignation,
        reason: reqReason,
      });
      setIsApplicationSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Application submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enterAsGuest(guestNickname.trim() || undefined);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 flex flex-col font-sans selection:bg-[#FFD166] selection:text-black">
      {/* Top Header Bar */}
      <header className="bg-white border-b-3 border-black px-4 sm:px-8 py-3 flex items-center justify-between select-none">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to STEM Studio Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#FFD166] border border-black flex items-center justify-center font-mono font-bold text-xs shadow-[1px_1px_0px_#000]">
            Z
          </span>
          <span className="font-mono font-black text-xs uppercase tracking-wider text-black">
            ZIRNA STEM PASSPORT
          </span>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 gap-8 items-center justify-center">
        {/* ============================================================
            LEFT PANEL: BRANDING, PIXEL ART & 6 CORE BENEFITS
            ============================================================ */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#06D6A0]/20 border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
              <span>CHILD-FRIENDLY & SURVEILLANCE-FREE STEM PASSPORT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-mono font-black text-black tracking-tight leading-tight">
              Your Learning Journey, All in One Place
            </h1>
            <p className="text-sm font-mono text-slate-700 leading-relaxed">
              Explore interactive mathematics, optics, and geometry workshops. Students sign in with a simple username—no personal email address required.
            </p>
          </div>

          {/* 6 Key Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2 font-bold text-black mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                <span>1. Save Your Progress</span>
              </div>
              <p className="text-[11px] text-slate-600">Continue learning seamlessly from where you left off.</p>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2 font-bold text-black mb-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>2. Track Learning Streaks</span>
              </div>
              <p className="text-[11px] text-slate-600">Build non-punitive daily study habits without penalty.</p>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2 font-bold text-black mb-1">
                <Award className="w-4 h-4 text-[#C4B5FD]" />
                <span>3. Earn Achievements</span>
              </div>
              <p className="text-[11px] text-slate-600">Unlock 8 meaningful STEM badges as you master labs.</p>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2 font-bold text-black mb-1">
                <LayoutDashboard className="w-4 h-4 text-[#38BDF8]" />
                <span>4. Access Your Dashboard</span>
              </div>
              <p className="text-[11px] text-slate-600">Review completed courses, accuracy metrics, and analytics.</p>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2 font-bold text-black mb-1">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>5. Join Classrooms</span>
              </div>
              <p className="text-[11px] text-slate-600">Participate in live collaborative battles with your school team.</p>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2 font-bold text-black mb-1">
                <Compass className="w-4 h-4 text-[#FFD166]" />
                <span>6. Discover Pathways</span>
              </div>
              <p className="text-[11px] text-slate-600">Explore structured MBSE and NCERT syllabus tracks.</p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] font-mono text-[11px] flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="text-slate-800">
              <strong>Children's Privacy Protection:</strong> Student accounts are created directly by certified teachers with pseudonymous usernames. No personal student data is ever sold or tracked.
            </span>
          </div>
        </div>

        {/* ============================================================
            RIGHT PANEL: AUTHENTICATION FORM (TABS: STUDENT, TEACHER, REQUEST)
            ============================================================ */}
        <div className="w-full lg:w-1/2 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFDF5] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 sm:p-8 font-mono select-none"
          >
            {/* Top Tab Mode Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F5F0] border-2 border-black rounded-xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('student-login'); setErrorMsg(null); }}
                className={`py-2 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  mode === 'student-login'
                    ? 'bg-[#FFD166] text-black border border-black shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => { setMode('teacher-login'); setErrorMsg(null); }}
                className={`py-2 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  mode === 'teacher-login'
                    ? 'bg-[#C4B5FD] text-black border border-black shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Teacher
              </button>

              <button
                type="button"
                onClick={() => { setMode('teacher-request'); setErrorMsg(null); }}
                className={`py-2 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  mode === 'teacher-request'
                    ? 'bg-[#06D6A0] text-black border border-black shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Apply
              </button>
            </div>

            {/* Error Notice */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg border-2 border-rose-500 bg-rose-50 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: STUDENT USERNAME LOGIN */}
            {mode === 'student-login' && (
              <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">Student Username</label>
                    <span className="text-[10px] text-slate-500">No email required</span>
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. alex.class06"
                      value={studentUsername}
                      onChange={(e) => setStudentUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs font-bold text-black"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">Student PIN or Password</label>
                    <span className="text-[10px] text-slate-500">Issued by teacher</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="6-digit PIN (e.g. 123456)"
                      value={studentPin}
                      onChange={(e) => setStudentPin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs font-bold text-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full py-3 bg-[#FFD166] hover:bg-[#ffc947] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying Student Passport...' : 'Enter Student Passport'}</span>
                </button>

                {/* Fast Student Demo Fill */}
                <div className="pt-3 border-t border-black/10">
                  <button
                    type="button"
                    onClick={fillStudentDemo}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-black/20 text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ Fill Demo Student (alex.class06 / 123456)</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: TEACHER LOGIN */}
            {mode === 'teacher-login' && (
              <form onSubmit={handleTeacherSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Teacher Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="teacher@school.edu"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] font-mono text-xs font-bold text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Account Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] font-mono text-xs font-bold text-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full py-3 bg-[#C4B5FD] hover:bg-[#b3a1fc] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <School className="w-4 h-4" />
                  <span>{isSubmitting ? 'Authenticating Teacher...' : 'Enter Teacher Command Center'}</span>
                </button>

                {/* Fast Teacher Demo Fill */}
                <div className="pt-3 border-t border-black/10">
                  <button
                    type="button"
                    onClick={fillTeacherDemo}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-black/20 text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ Fill Demo Teacher (teacher@zirnastem.org)</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: REQUEST TEACHER ACCOUNT (APPROVAL WORKFLOW) */}
            {mode === 'teacher-request' && (
              <div>
                {isApplicationSubmitted ? (
                  <div className="space-y-4 text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
                      ✓
                    </div>
                    <h3 className="text-base font-black text-black">Application Under Review</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your teacher account request for <strong>{reqSchool}</strong> has been submitted. Our administrator will review your application before activating your teaching access.
                    </p>
                    <button
                      onClick={() => {
                        setIsApplicationSubmitted(false);
                        setMode('teacher-login');
                      }}
                      className="px-4 py-2 bg-black text-white rounded-lg font-bold text-xs"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTeacherRequestSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Full Name & Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pu Lalthanzuala Colney"
                        value={reqFullName}
                        onChange={(e) => setReqFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-[#06D6A0]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Institutional Email</label>
                      <input
                        type="email"
                        required
                        placeholder="teacher@school.edu"
                        value={reqEmail}
                        onChange={(e) => setReqEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-[#06D6A0]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">School or Institution</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Synod Higher Secondary School"
                        value={reqSchool}
                        onChange={(e) => setReqSchool(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-[#06D6A0]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Designation / Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Class 7 Mathematics Lead"
                        value={reqDesignation}
                        onChange={(e) => setReqDesignation(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-[#06D6A0]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Reason for Request</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="e.g. Setting up class STEM battles..."
                        value={reqReason}
                        onChange={(e) => setReqReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-[#06D6A0]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application for Admin Review'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Guest Option */}
            <div className="mt-5 pt-4 border-t border-black/10 text-center">
              <button
                type="button"
                onClick={() => {
                  enterAsGuest();
                  onSuccess();
                }}
                className="text-xs text-slate-600 hover:text-black font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>Or explore as Instant Guest (No sign-in)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
