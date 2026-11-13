import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  School,
  Users,
  ClipboardList,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../../i18n';
import { toast } from 'sonner';

interface TeacherNavigationProps {
  activeSection?: string;
  onNavigateHome: () => void;
  onNavigateClassrooms: () => void;
  onNavigateStudents: () => void;
  onNavigateAssignments: () => void;
  onNavigateDashboard: () => void;
  onOpenStoragePreferences: () => void;
}

export const TeacherNavigation: React.FC<TeacherNavigationProps> = ({
  activeSection = 'home',
  onNavigateHome,
  onNavigateClassrooms,
  onNavigateStudents,
  onNavigateAssignments,
  onNavigateDashboard,
  onOpenStoragePreferences,
}) => {
  const { user, signOut, setIsProfileModalOpen } = useAuth();
  const { lang, setLang } = useTranslation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await signOut();
    toast.success('Signed out. Returned to public hub.');
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#FFFDF5] border-b-3 border-black px-4 sm:px-8 py-2.5 shadow-sm select-none font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Educator Workspace Badge */}
        <div onClick={onNavigateHome} className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-[#06D6A0] border-2 border-black brutal-shadow-xs flex items-center justify-center font-black text-black text-sm">
            MEC
          </div>
          <div>
            <div className="text-sm sm:text-base font-black tracking-tight text-black font-sans uppercase leading-none flex items-center gap-2">
              <span>ZIRNA STEM</span>
              <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-400 px-1.5 py-0.2 rounded font-mono font-black">
                EDUCATOR
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-bold tracking-wider mt-0.5 flex items-center gap-1.5 truncate max-w-[220px]">
              <span>{user?.schoolName || 'Govt. Mizo High School'}</span>
            </div>
          </div>
        </div>

        {/* Focused Teacher Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={onNavigateHome}
            className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'home'
                ? 'bg-[#FFD166] border-black shadow-[2px_2px_0px_#000] text-black font-black'
                : 'border-transparent text-slate-700 hover:text-black hover:border-black/30'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={onNavigateClassrooms}
            className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'classrooms'
                ? 'bg-[#06D6A0] border-black shadow-[2px_2px_0px_#000] text-black font-black'
                : 'border-transparent text-slate-700 hover:text-black hover:border-black/30'
            }`}
          >
            <School className="w-3.5 h-3.5 text-emerald-800" />
            <span>My Classrooms</span>
          </button>

          <button
            onClick={onNavigateStudents}
            className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'students'
                ? 'bg-[#06D6A0] border-black shadow-[2px_2px_0px_#000] text-black font-black'
                : 'border-transparent text-slate-700 hover:text-black hover:border-black/30'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-800" />
            <span>My Students</span>
          </button>

          <button
            onClick={onNavigateAssignments}
            className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'assignments'
                ? 'bg-[#38BDF8] border-black shadow-[2px_2px_0px_#000] text-black font-black'
                : 'border-transparent text-slate-700 hover:text-black hover:border-black/30'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-cyan-800" />
            <span>Assignments</span>
          </button>

          <button
            onClick={onNavigateDashboard}
            className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'dashboard'
                ? 'bg-[#C4B5FD] border-black shadow-[2px_2px_0px_#000] text-black font-black'
                : 'border-transparent text-slate-700 hover:text-black hover:border-black/30'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-purple-800" />
            <span>Teacher Dashboard</span>
          </button>
        </div>

        {/* Right Controls: Language & Teacher Profile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Functional Bilingual Switcher: EN | MIZO */}
          <div
            role="radiogroup"
            aria-label="Language Selection"
            className="flex items-center bg-white border-2 border-black rounded-md p-0.5 text-[11px] font-bold shadow-[1px_1px_0px_#000]"
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

          {/* Teacher Profile Trigger & Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg border-2 border-black bg-white hover:bg-[#FFFDF5] shadow-[2px_2px_0px_#000] transition-all cursor-pointer text-xs"
              aria-label="Teacher profile menu"
              aria-expanded={isProfileMenuOpen}
            >
              <span className="text-base leading-none">{user?.avatar || '🦉'}</span>
              <div className="text-left hidden sm:block">
                <div className="font-black text-black leading-tight truncate max-w-[120px]">
                  {user?.displayName || 'Educator'}
                </div>
                <div className="text-[10px] text-purple-700 font-bold">
                  Classroom Host
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-black transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-[#FFFDF5] border-3 border-black rounded-xl brutal-shadow-lg p-3 z-40 text-left font-mono"
                  >
                    {/* Teacher Info Card */}
                    <div className="p-2.5 bg-white border-2 border-black rounded-lg mb-2 flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-[#06D6A0] border border-black flex items-center justify-center text-xl shrink-0">
                        {user?.avatar || '🦉'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-black truncate">{user?.displayName}</div>
                        <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
                        <div className="text-[9px] text-purple-700 font-bold truncate">Certified MBSE Educator</div>
                      </div>
                    </div>

                    {/* Teacher Menu Items */}
                    <div className="space-y-1 text-xs font-bold">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onNavigateDashboard();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#FFD166] text-black transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Teacher Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#FFD166]/50 text-black transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Customize Avatar</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onNavigateClassrooms();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#06D6A0]/40 text-black transition-colors cursor-pointer"
                      >
                        <School className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Manage Classrooms</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenStoragePreferences();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-black transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                        <span>Privacy & Storage Settings</span>
                      </button>

                      <div className="pt-1.5 border-t border-black/10">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-rose-50 text-rose-700 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md border-2 border-black bg-white hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle teacher mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
            className="lg:hidden pt-3 pb-2 border-t-2 border-black/10 mt-2 space-y-1 text-xs font-bold"
          >
            <button
              onClick={() => {
                onNavigateHome();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                onNavigateClassrooms();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <School className="w-3.5 h-3.5" />
              <span>My Classrooms</span>
            </button>
            <button
              onClick={() => {
                onNavigateStudents();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5" />
              <span>My Students</span>
            </button>
            <button
              onClick={() => {
                onNavigateAssignments();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Assignments</span>
            </button>
            <button
              onClick={() => {
                onNavigateDashboard();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Teacher Dashboard</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
