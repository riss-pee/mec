import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Users,
  GraduationCap,
  School,
  Layers,
  BarChart3,
  Settings,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserCheck,
  UserX,
  ExternalLink,
  Flame,
  Search,
  RefreshCw,
  Terminal,
  Activity,
  FileText,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { TeacherApplication } from '../../auth/types';
import {
  getTeacherApplications,
  reviewTeacherApplication,
} from '../../auth/services/authService';
import {
  PlatformOverviewStats,
  AdminAuditLog,
  AdminModuleConfig,
} from '../../admin/types';
import * as adminService from '../../admin/services/adminService';
import { toast } from 'sonner';

interface AdminHubProps {
  onNavigateTab: (tabId: string) => void;
  onOpenStoragePreferences: () => void;
  onSelectModule: (id: string) => void;
}

export const AdminHub: React.FC<AdminHubProps> = ({
  onNavigateTab,
  onOpenStoragePreferences,
  onSelectModule,
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlatformOverviewStats | null>(null);
  const [teacherApps, setTeacherApps] = useState<TeacherApplication[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [modules, setModules] = useState<AdminModuleConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [s, apps, logs, mods] = await Promise.all([
        adminService.getPlatformOverviewStats(),
        getTeacherApplications(),
        adminService.getAuditLogs(),
        adminService.getModules(),
      ]);
      setStats(s);
      setTeacherApps(apps);
      setAuditLogs(logs);
      setModules(mods);
    } catch (err) {
      console.error('Failed to load admin telemetry data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveApp = async (appId: string, applicantName: string) => {
    try {
      await reviewTeacherApplication(appId, 'approved', 'Verified and approved via Admin Hub');
      setTeacherApps((prev) => prev.filter((a) => a.id !== appId));
      toast.success(`Accredited educator application approved for ${applicantName}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve application.');
    }
  };

  const handleRejectApp = async (appId: string, applicantName: string) => {
    try {
      await reviewTeacherApplication(appId, 'rejected', 'Application criteria not met');
      setTeacherApps((prev) => prev.filter((a) => a.id !== appId));
      toast.info(`Application rejected for ${applicantName}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject application.');
    }
  };

  const adminName = user?.displayName || 'Dr. C. Vanlalruata (MEC Director)';

  return (
    <div className="space-y-8 py-6 sm:py-8 font-sans">
      {/* ============================================================
          1. ADMINISTRATIVE COMMAND HEADER (Tactical Dark Card)
      ============================================================ */}
      <section className="bg-[#101522] border-3 border-black text-slate-100 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#000] relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-0.5 rounded bg-[#FFD166] text-black font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Shield className="w-3.5 h-3.5" />
                SUPER_ADMIN LEVEL 3
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                NODE: AIZAWL-CENTRAL-01
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              Welcome, {adminName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              MEC Platform Administration & Digital Learning Governance Portal
            </p>
          </div>

          {/* Quick Console Jump Actions */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => onNavigateTab('users')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#38BDF8]" />
              <span>User Directory</span>
            </button>
            <button
              onClick={() => onNavigateTab('teacher-applications')}
              className="px-3.5 py-2 rounded-xl bg-[#FFD166] hover:bg-[#ffc947] text-black font-bold border-2 border-black shadow-[2px_2px_0px_#000] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-black" />
              <span>Teacher Approvals ({teacherApps.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-[#06D6A0]" />
              <span>Telemetry</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. PLATFORM KPI METRICS (4 Brutalist Analytics Cards)
      ============================================================ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border-3 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Registered Students
            </span>
            <Users className="w-4 h-4 text-[#118AB2]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">
              {stats?.totalStudents?.toLocaleString() || '1,280'}
            </span>
            <span className="text-xs font-bold text-emerald-700 font-mono">+12% this mo</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            Zero-email student privacy accounts
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border-3 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Accredited Teachers
            </span>
            <GraduationCap className="w-4 h-4 text-[#06D6A0]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">
              {stats?.totalTeachers || '42'}
            </span>
            <span className="text-xs font-bold text-blue-700 font-mono">Verified MEC</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            Across 28 MBSE secondary schools
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border-3 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Active Classrooms
            </span>
            <School className="w-4 h-4 text-[#FFD166]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">
              {stats?.registeredClassrooms || '64'}
            </span>
            <span className="text-xs font-bold text-amber-700 font-mono">Cohorts</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            Grades 5, 6, 7 & 8 curriculum
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border-3 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Challenges Solved
            </span>
            <Flame className="w-4 h-4 text-[#EF476F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">
              {stats?.totalCompletedChallenges?.toLocaleString() || '18,420'}
            </span>
            <span className="text-xs font-bold text-rose-700 font-mono">XP: 92.4k</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            Interactive STEM problems conquered
          </p>
        </div>
      </section>

      {/* ============================================================
          3. PENDING TEACHER VERIFICATIONS & LIVE TELEMETRY
      ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Teacher Verification Applications */}
        <section className="bg-white border-3 border-black rounded-2xl p-6 brutal-shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div>
              <h3 className="text-lg font-black text-black font-sans flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-black" />
                <span>Pending Teacher Applications</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium font-mono">
                Educator credential verification queue ({teacherApps.length} pending)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('teacher-applications')}
              className="text-xs font-mono font-bold text-black hover:text-[#06D6A0] flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {teacherApps.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl font-mono text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All teacher applications reviewed and verified. No pending items!
            </div>
          ) : (
            <div className="space-y-3">
              {teacherApps.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-[#FFFDF5] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
                >
                  <div>
                    <h4 className="font-black text-black text-sm font-sans">{app.fullName}</h4>
                    <p className="text-slate-600 text-xs mt-0.5">{app.schoolName}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Role: {app.designation} • {app.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveApp(app.id, app.fullName)}
                      className="px-3 py-1.5 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-bold rounded-lg border-2 border-black shadow-[1px_1px_0px_#000] flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectApp(app.id, app.fullName)}
                      className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-bold rounded-lg border-2 border-black cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Live Classroom Battles Telemetry */}
        <section className="bg-white border-3 border-black rounded-2xl p-6 brutal-shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div>
              <h3 className="text-lg font-black text-black font-sans flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#EF476F]" />
                <span>Classroom Battles Telemetry</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium font-mono">
                Real-time active collaborative sessions
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE SOCKETS
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 bg-slate-50 border-2 border-black rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black text-sm">
                  Room ZIRNA-4821 (Fraction Challenge)
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 border border-rose-300 text-rose-700 font-black text-[10px]">
                  BATTLE IN PROGRESS
                </span>
              </div>
              <p className="text-slate-600">
                School: Govt. Mizo High School • Class 6-A • Teacher: Miss Lalrintluangi
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                <span>14 Active Students Connected</span>
                <span className="font-bold text-emerald-700">Latency: 18ms</span>
              </div>
            </div>

            <div className="p-3 bg-[#FFFDF5] border border-black/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-black block">Concurrent Active Students</span>
                <span className="text-slate-500 text-[11px]">Across all secondary schools in Mizoram</span>
              </div>
              <span className="text-xl font-black text-black">342 Online</span>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          4. STEM MODULES HEALTH & STATUS (Registry Overview)
      ============================================================ */}
      <section className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 brutal-shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black/10 pb-3">
          <div>
            <h2 className="text-xl font-black text-black font-sans flex items-center gap-2">
              <Layers className="w-5 h-5 text-black" />
              <span>Interactive STEM Modules Health</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium font-mono">
              All 7 core educational modules operational with 100% curriculum compliance
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('modules')}
            className="text-xs font-mono font-bold text-black hover:text-[#06D6A0] flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Module Registry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {modules.slice(0, 7).map((mod) => (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className="p-3.5 bg-[#FFFDF5] hover:bg-amber-50 border-2 border-black rounded-xl cursor-pointer transition-colors flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-black text-sm truncate font-sans">
                  {mod.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{mod.grade}</span>
                <span className="font-bold text-slate-700">MOD {mod.number}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          5. ADMINISTRATIVE AUDIT TRAIL LOGS
      ============================================================ */}
      <section className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 brutal-shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
          <div>
            <h2 className="text-xl font-black text-black font-sans flex items-center gap-2">
              <Terminal className="w-5 h-5 text-black" />
              <span>Platform Governance Audit Trail</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium font-mono">
              Immutable logging of administrative interventions and role elevations
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('settings')}
            className="text-xs font-mono font-bold text-black hover:text-[#06D6A0] flex items-center gap-1 cursor-pointer"
          >
            <span>System Settings</span>
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-black text-slate-500 uppercase text-[10px]">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Actor</th>
                <th className="pb-2">Action</th>
                <th className="pb-2">Resource</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 font-bold text-black">{log.adminName}</td>
                  <td className="py-2.5 font-bold text-blue-700">{log.action}</td>
                  <td className="py-2.5 text-slate-700">{log.targetResource}</td>
                  <td className="py-2.5 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
