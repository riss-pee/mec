import React from 'react';
import {
  Users,
  GraduationCap,
  School,
  Shield,
  Radio,
  Trophy,
  Activity,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PlatformOverviewStats, AdminDashboardTab, AdminAuditLog } from '../../types';

interface OverviewTabProps {
  stats: PlatformOverviewStats;
  auditLogs: AdminAuditLog[];
  onNavigateTab: (tab: AdminDashboardTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, auditLogs, onNavigateTab }) => {
  const maxWeeklyChallenges = Math.max(...stats.weeklyActivity.map((w) => w.challenges), 350);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Status Banner */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#06D6A0]">
              SYSTEM HEALTH: ALL SERVICES OPERATIONAL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight">
            Platform Operations & Intelligence Center
          </h1>
          <p className="text-slate-400 text-xs font-mono mt-1">
            Mizoram STEM Studio statewide analytics, active classroom sessions, and security governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('sessions')}
            className="px-4 py-2.5 bg-[#FFD166] hover:bg-[#ffc947] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <Radio className="w-4 h-4 text-black" />
            <span>Live Classrooms ({stats.activeClassroomSessions})</span>
          </button>

          <button
            onClick={() => onNavigateTab('privacy')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Privacy Desk</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 font-mono">
        {/* Total Students */}
        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Students</span>
            <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.totalStudents}</div>
            <div className="text-[10px] text-[#06D6A0] font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18% this month</span>
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Teachers</span>
            <School className="w-4 h-4 text-[#FFD166]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.totalTeachers}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">across 4 districts</div>
          </div>
        </div>

        {/* Registered Classrooms */}
        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Classrooms</span>
            <Users className="w-4 h-4 text-[#C4B5FD]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.registeredClassrooms}</div>
            <div className="text-[10px] text-[#06D6A0] font-bold mt-1">Active rosters</div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Live Sessions</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{stats.activeClassroomSessions}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">Connected smartboards</div>
          </div>
        </div>

        {/* Challenges Solved */}
        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Challenges</span>
            <Trophy className="w-4 h-4 text-[#FFD166]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.totalCompletedChallenges.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">92.4% avg accuracy</div>
          </div>
        </div>

        {/* Total Admins */}
        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Admins</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">{stats.totalAdmins}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">MEC Directorate</div>
          </div>
        </div>
      </div>

      {/* Main Charts & Popular Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 7-Day Challenge Submissions Bar Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5 font-mono">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#38BDF8]" />
                <span>Weekly Platform Activity & Submissions</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Daily completed STEM challenges and unique active learners across institutions.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
              Current Week
            </span>
          </div>

          {/* Neo-Brutalist Visual Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {stats.weeklyActivity.map((day) => {
              const heightPct = Math.round((day.challenges / maxWeeklyChallenges) * 100);
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-white bg-black px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                    {day.challenges} labs • {day.activeUsers} users
                  </div>
                  <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-lg relative flex flex-col justify-end overflow-hidden border-t-2 border-x-2 border-black h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-[#06D6A0] to-[#38BDF8] rounded-t border-t-2 border-black transition-all duration-500 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.4)]"
                    />
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                    {day.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Most Frequently Used Modules */}
        <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 font-mono">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD166]" />
                <span>Top STEM Workshops</span>
              </h2>
              <button
                onClick={() => onNavigateTab('modules')}
                className="text-xs text-[#FFD166] hover:underline flex items-center gap-1 font-bold"
              >
                <span>All 7</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 font-mono">
              {stats.topModules.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3 bg-[#0E131F] border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-[#FFD166]/15 border border-[#FFD166]/30 text-[#FFD166] text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{m.title}</div>
                      <div className="text-[10px] text-slate-400">{m.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#06D6A0]">{m.count.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">runs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-lg border border-slate-700 transition-colors text-center"
            >
              View In-Depth Analytics & Export Reports →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Administrative Audit Feed */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 font-mono">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Recent Administrative Activity & Security Events
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('audit')}
            className="text-xs text-[#38BDF8] hover:underline font-bold"
          >
            View Full Audit Trail ({auditLogs.length}) →
          </button>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {auditLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3 bg-[#0E131F] border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    log.status === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {log.action}
                </span>
                <span className="text-slate-300 font-medium">{log.details}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
                <span>{log.adminName}</span>
                <span>•</span>
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
