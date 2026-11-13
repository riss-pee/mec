import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Layers,
  School,
  Radio,
  Compass,
  BarChart3,
  Megaphone,
  ShieldAlert,
  Terminal,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Shield,
  Search,
  Bell,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { TeacherApplication } from '../../auth/types';
import { getTeacherApplications } from '../../auth/services/authService';
import {
  AdminDashboardTab,
  PlatformOverviewStats,
  AdminUserItem,
  AdminModuleConfig,
  AdminClassroomItem,
  AdminLiveSession,
  AdminCoursePathway,
  AdminPrivacyRequest,
  AdminAuditLog,
  PlatformSettings,
} from '../types';
import * as adminService from '../services/adminService';
import { OverviewTab } from './tabs/OverviewTab';
import { UserManagementTab } from './tabs/UserManagementTab';
import { ModuleManagementTab } from './tabs/ModuleManagementTab';
import { ClassroomManagementTab } from './tabs/ClassroomManagementTab';
import { LiveSessionsTab } from './tabs/LiveSessionsTab';
import { CoursesPathwaysTab } from './tabs/CoursesPathwaysTab';
import { AnalyticsReportsTab } from './tabs/AnalyticsReportsTab';
import { ContentManagementTab } from './tabs/ContentManagementTab';
import { PrivacyRequestsTab } from './tabs/PrivacyRequestsTab';
import { AuditLogsTab } from './tabs/AuditLogsTab';
import { PlatformSettingsTab } from './tabs/PlatformSettingsTab';
import { TeacherApplicationsTab } from './tabs/TeacherApplicationsTab';
import { toast } from 'sonner';

interface AdminDashboardLayoutProps {
  onBackToHub: () => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ onBackToHub }) => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminDashboardTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Platform Data
  const [stats, setStats] = useState<PlatformOverviewStats | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [modules, setModules] = useState<AdminModuleConfig[]>([]);
  const [classrooms, setClassrooms] = useState<AdminClassroomItem[]>([]);
  const [sessions, setSessions] = useState<AdminLiveSession[]>([]);
  const [pathways, setPathways] = useState<AdminCoursePathway[]>([]);
  const [privacyRequests, setPrivacyRequests] = useState<AdminPrivacyRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [teacherApps, setTeacherApps] = useState<TeacherApplication[]>([]);

  // Load all admin data
  const loadPlatformData = async () => {
    try {
      const [
        s,
        u,
        m,
        c,
        sess,
        p,
        prv,
        aud,
        sett,
        apps,
      ] = await Promise.all([
        adminService.getPlatformOverviewStats(),
        adminService.getUsers(),
        adminService.getModules(),
        adminService.getClassrooms(),
        adminService.getLiveSessions(),
        adminService.getPathways(),
        adminService.getPrivacyRequests(),
        adminService.getAuditLogs(),
        adminService.getPlatformSettings(),
        getTeacherApplications(),
      ]);

      setStats(s);
      setUsers(u);
      setModules(m);
      setClassrooms(c);
      setSessions(sess);
      setPathways(p);
      setPrivacyRequests(prv);
      setAuditLogs(aud);
      setSettings(sett);
      setTeacherApps(apps);
    } catch {
      toast.error('Failed to load platform data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    onBackToHub();
  };

  // Nav item definitions
  const NAV_ITEMS: Array<{
    id: AdminDashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Directory', icon: Users, badge: users.length },
    {
      id: 'teacher-applications',
      label: 'Teacher Applications',
      icon: GraduationCap,
      badge: teacherApps.filter((a) => a.status === 'pending').length,
    },
    { id: 'modules', label: 'STEM Workshops', icon: Layers, badge: modules.length },
    { id: 'classrooms', label: 'Classroom Rosters', icon: School, badge: classrooms.length },
    {
      id: 'sessions',
      label: 'Live Sessions',
      icon: Radio,
      badge: sessions.filter((s) => s.status === 'active' || s.status === 'lobby').length,
    },
    { id: 'pathways', label: 'Curriculum Pathways', icon: Compass },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'content', label: 'Communications & Announcements', icon: Megaphone },
    {
      id: 'privacy',
      label: 'Privacy & Subject Rights',
      icon: ShieldAlert,
      badge: privacyRequests.filter((r) => r.status === 'pending' || r.status === 'reviewing').length,
    },
    { id: 'audit', label: 'Security & Audit Logs', icon: Terminal },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  if (isLoading || !stats || !settings) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-black border-t-[#FFD166] rounded-full animate-spin" />
          <div className="text-xs font-bold text-slate-400">Loading Administrator Intelligence Console...</div>
        </div>
      </div>
    );
  }

  const activeNavItem = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex font-sans selection:bg-[#FFD166] selection:text-black">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 lg:w-72 bg-[#101522] border-r-2 border-black flex flex-col justify-between transition-transform duration-200 ease-in-out font-mono text-xs ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#FFD166] text-black font-black flex items-center justify-center text-sm border-2 border-black shadow-[2px_2px_0px_#000]">
                Z
              </span>
              <div>
                <div className="font-mono text-[10px] font-black uppercase text-[#FFD166] tracking-widest">
                  ZIRNA STEM PLATFORM
                </div>
                <div className="font-mono font-bold text-xs text-white">
                  Administrator Console
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border flex items-center justify-between gap-3 font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFD166] text-black border-black shadow-[2px_2px_0px_#000]'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isActive
                          ? 'bg-black text-[#FFD166]'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Sign-out */}
        <div className="p-4 border-t border-slate-800 bg-[#0C101A]">
          <div className="p-2.5 rounded-xl border border-slate-800 bg-[#161D2B] mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="w-7 h-7 rounded-lg bg-[#FFD166] text-black font-bold flex items-center justify-center text-xs">
                🛡️
              </span>
              <div className="truncate">
                <div className="font-bold text-white text-[11px] truncate">
                  {user?.displayName || 'Administrator'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'admin@zirnastem.org'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHub}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
              title="Return to Public Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={handleSignOut}
              className="py-1.5 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/30 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
              title="Sign Out of Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0E131F]/90 backdrop-blur-md border-b-2 border-black px-4 sm:px-6 py-3 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="hidden sm:inline">Administrator</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-white font-bold">{activeNavItem?.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>STATEWIDE TELEMETRY SYNCED</span>
            </div>

            <button
              onClick={onBackToHub}
              className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#FFD166] text-black font-bold shadow-[2px_2px_0px_#000] hover:bg-[#ffc947] flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Portal</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'overview' && (
                <OverviewTab
                  stats={stats}
                  auditLogs={auditLogs}
                  onNavigateTab={(t) => setActiveTab(t)}
                />
              )}

              {activeTab === 'users' && (
                <UserManagementTab
                  users={users}
                  onUpdateStatus={async (id, status, reason) => {
                    await adminService.updateUserStatus(id, status, reason);
                    loadPlatformData();
                  }}
                  onUpdateRole={async (id, role, reason) => {
                    await adminService.updateUserRole(id, role, reason);
                    loadPlatformData();
                  }}
                  onDeleteUser={async (id) => {
                    await adminService.deleteUserAccount(id);
                    loadPlatformData();
                  }}
                />
              )}

              {activeTab === 'teacher-applications' && <TeacherApplicationsTab />}

              {activeTab === 'modules' && (
                <ModuleManagementTab
                  modules={modules}
                  onUpdateModule={async (id, updates) => {
                    await adminService.updateModuleConfig(id, updates);
                    loadPlatformData();
                  }}
                />
              )}

              {activeTab === 'classrooms' && (
                <ClassroomManagementTab
                  classrooms={classrooms}
                  onUpdateStatus={async (id, status) => {
                    await adminService.updateClassroomStatus(id, status);
                    loadPlatformData();
                  }}
                />
              )}

              {activeTab === 'sessions' && (
                <LiveSessionsTab
                  sessions={sessions}
                  onTerminateSession={async (id, reason) => {
                    await adminService.terminateLiveSession(id, reason);
                    loadPlatformData();
                  }}
                />
              )}

              {activeTab === 'pathways' && (
                <CoursesPathwaysTab
                  pathways={pathways}
                  onUpdatePathway={async (id, updates) => {
                    await adminService.updatePathway(id, updates);
                    loadPlatformData();
                  }}
                />
              )}

              {activeTab === 'analytics' && <AnalyticsReportsTab stats={stats} />}

              {activeTab === 'content' && (
                <ContentManagementTab
                  settings={settings}
                  onUpdateSettings={async (updates) => {
                    const res = await adminService.updatePlatformSettings(updates);
                    loadPlatformData();
                    return res;
                  }}
                />
              )}

              {activeTab === 'privacy' && (
                <PrivacyRequestsTab
                  requests={privacyRequests}
                  onUpdateStatus={async (id, status, notes) => {
                    await adminService.updatePrivacyRequestStatus(id, status, notes);
                    loadPlatformData();
                  }}
                />
              )}

              {activeTab === 'audit' && <AuditLogsTab logs={auditLogs} />}

              {activeTab === 'settings' && (
                <PlatformSettingsTab
                  settings={settings}
                  onUpdateSettings={async (updates) => {
                    const res = await adminService.updatePlatformSettings(updates);
                    loadPlatformData();
                    return res;
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
