import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Layers,
  BarChart3,
  Settings,
  Shield,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'sonner';

interface AdminNavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onExitToHub: () => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  activeTab,
  onSelectTab,
  onExitToHub,
}) => {
  const { user, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await signOut();
    onExitToHub();
    toast.success('Signed out from Administrator console.');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'teacher-applications', label: 'Teacher Applications', icon: GraduationCap },
    { id: 'classrooms', label: 'Classrooms', icon: School },
    { id: 'modules', label: 'STEM Modules', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#101522] border-b-2 border-black px-4 sm:px-6 py-2.5 text-slate-100 font-mono select-none text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Security Level Badge */}
        <div onClick={onExitToHub} className="flex items-center gap-2.5 cursor-pointer">
          <span className="w-8 h-8 rounded-lg bg-[#FFD166] text-black font-black flex items-center justify-center text-sm border-2 border-black shadow-[2px_2px_0px_#000]">
            Z
          </span>
          <div>
            <div className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>ZIRNA PLATFORM</span>
              <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-600 px-1 py-0.2 rounded">
                ADMIN
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Directorate of School Education</div>
          </div>
        </div>

        {/* Desktop Admin Tabs */}
        <div className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFD166] text-black border-black shadow-[2px_2px_0px_#000]'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Exit to Hub & Admin Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExitToHub}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-bold"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Public Hub</span>
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 cursor-pointer"
            >
              <span className="text-sm">🛡️</span>
              <span className="font-bold text-white hidden sm:inline max-w-[110px] truncate">
                {user?.displayName || 'Admin'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-56 bg-[#161D2B] border-2 border-black rounded-xl p-3 z-40 text-left font-mono shadow-[4px_4px_0px_#000]"
                  >
                    <div className="p-2 bg-[#0E131F] rounded-lg border border-slate-800 mb-2">
                      <div className="font-black text-xs text-white truncate">{user?.displayName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSelectTab('settings');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Platform Settings</span>
                      </button>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-950/50 text-rose-400 flex items-center gap-2 cursor-pointer"
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

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300"
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
            className="xl:hidden pt-3 pb-2 border-t border-slate-800 mt-2 space-y-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-300"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
