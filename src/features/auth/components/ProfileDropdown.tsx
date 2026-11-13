import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  LogOut, 
  Sliders, 
  GraduationCap, 
  School, 
  Flame, 
  Award, 
  LayoutDashboard,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { useAuth } from '../AuthContext';

interface ProfileDropdownProps {
  onNavigateDashboard: () => void;
  onNavigateClassroom: () => void;
  onOpenStoragePreferences: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onNavigateDashboard,
  onNavigateClassroom,
  onOpenStoragePreferences,
}) => {
  const { user, isAuthenticated, isGuest, isTeacher, signOut, openAuthModal, setIsProfileModalOpen } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center">
        <button
          onClick={() => {
            window.location.hash = 'auth';
          }}
          className="retro-btn px-4 py-1.5 rounded-md bg-[#FFD166] border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5 hover:bg-[#ffc947] transition-all"
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative select-none font-mono">
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-lg border-2 border-black bg-white hover:bg-[#FFFDF5] shadow-[2px_2px_0px_#000] transition-all cursor-pointer text-xs"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{user.avatar || '🚀'}</span>
        <div className="text-left hidden sm:block">
          <div className="font-black text-black leading-tight truncate max-w-[110px]">
            {user.displayName}
          </div>
          <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
            {user.role === 'admin' ? (
              <span className="text-amber-800 font-bold">Admin</span>
            ) : isTeacher ? (
              <span className="text-purple-700">Educator</span>
            ) : isGuest ? (
              <span className="text-amber-700">Guest</span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                {user.streakDays}d streak
              </span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 bg-[#FFFDF5] border-3 border-black rounded-xl brutal-shadow-lg p-3 z-40 text-left font-mono"
            >
              {/* User Header */}
              <div className="p-2.5 bg-white border-2 border-black rounded-lg mb-2.5 flex items-center gap-3">
                <span className="text-2xl">{user.avatar}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-black text-xs text-black truncate">{user.displayName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold">
                    <span className="px-1.5 py-0.2 rounded bg-[#FFD166] text-black border border-black">
                      {user.points} XP
                    </span>
                    {user.schoolName && (
                      <span className="text-slate-500 truncate max-w-[100px]">{user.schoolName}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1 text-xs font-bold">
                {user.role === 'admin' && (
                  <a
                    href="#admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-amber-100 hover:bg-[#FFD166] text-black transition-colors cursor-pointer border border-amber-300 mb-1"
                  >
                    <Shield className="w-4 h-4 stroke-[2.2] text-amber-700" />
                    <span>Administrator Console</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateDashboard();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#FFD166] text-black transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 stroke-[2.2]" />
                  <span>{isTeacher ? 'Teacher Dashboard' : 'Student Dashboard'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#FFD166]/50 text-black transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.2] text-amber-600" />
                  <span>Personalize Avatar</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateClassroom();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#06D6A0] text-black transition-colors cursor-pointer"
                >
                  <School className="w-4 h-4 stroke-[2.2]" />
                  <span>Classroom Arena</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenStoragePreferences();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#E0F2FE] text-black transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 stroke-[2.2]" />
                  <span>Storage & Privacy</span>
                </button>

                {isGuest && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal('sign-up');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-[#FFD166] border border-black text-black font-black transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Save My Progress</span>
                  </button>
                )}

                <div className="pt-1.5 border-t border-black/10">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 stroke-[2.2]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
