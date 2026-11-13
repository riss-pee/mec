import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Globe,
  Award,
  Zap,
  PieChart,
  ShieldCheck,
} from 'lucide-react';
import { PlatformOverviewStats } from '../../types';
import { toast } from 'sonner';

interface AnalyticsReportsTabProps {
  stats: PlatformOverviewStats;
}

export const AnalyticsReportsTab: React.FC<AnalyticsReportsTabProps> = ({ stats }) => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'ytd'>('7d');

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Period\n' +
      `Total Students,${stats.totalStudents},${dateRange}\n` +
      `Total Teachers,${stats.totalTeachers},${dateRange}\n` +
      `Classrooms Registered,${stats.registeredClassrooms},${dateRange}\n` +
      `Active Sessions,${stats.activeClassroomSessions},${dateRange}\n` +
      `Completed Challenges,${stats.totalCompletedChallenges},${dateRange}\n` +
      'Fractions Accuracy,92%,Statewide\n' +
      'Geometry & Symmetry Accuracy,88%,Statewide\n' +
      'Mental Math Soroban Accuracy,95%,Statewide\n' +
      'Ray Optics Accuracy,84%,Statewide\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zirna_stem_analytics_${dateRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics CSV export generated and downloaded.');
  };

  const handleExportJSON = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      reportScope: 'Mizoram Education Centre STEM Analytics',
      dateRange,
      aggregatedStats: stats,
      domainMastery: {
        fractions: '92%',
        geometry: '88%',
        mentalMath: '95%',
        physics: '84%',
      },
      bilingualRatio: {
        english: '58%',
        mizo: '42%',
      },
    };
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zirna_diagnostics_${dateRange}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Diagnostic JSON bundle exported.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#38BDF8]" />
              <span>Statewide Analytics & Pedagogical Diagnostic Reports</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Aggregated institutional mastery metrics, engagement distributions, and official MBSE diagnostic exports.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-[#FFD166] hover:bg-[#ffc947] text-black font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Diagnostic JSON</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between pt-4 font-mono text-xs">
          <div className="flex items-center gap-1 bg-[#0E131F] p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                dateRange === '7d' ? 'bg-[#38BDF8] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                dateRange === '30d' ? 'bg-[#38BDF8] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setDateRange('ytd')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                dateRange === 'ytd' ? 'bg-[#38BDF8] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Academic Year to Date
            </button>
          </div>

          <div className="text-slate-400 text-[11px] hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#06D6A0]" />
            <span>Strict DPDP Privacy Compliant: No Student PII Included</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
          <span className="text-slate-400 text-[11px] uppercase font-bold block mb-1">Daily Active Users (DAU)</span>
          <div className="text-2xl font-black text-white">184 Learners</div>
          <div className="text-[11px] text-[#06D6A0] font-bold mt-1">+14% vs previous week</div>
        </div>

        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
          <span className="text-slate-400 text-[11px] uppercase font-bold block mb-1">Weekly Active Users (WAU)</span>
          <div className="text-2xl font-black text-white">890 Learners</div>
          <div className="text-[11px] text-[#38BDF8] font-bold mt-1">4.8 avg sessions/student</div>
        </div>

        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
          <span className="text-slate-400 text-[11px] uppercase font-bold block mb-1">Avg Session Length</span>
          <div className="text-2xl font-black text-[#FFD166]">28.4 Minutes</div>
          <div className="text-[11px] text-slate-400 font-bold mt-1">High engagement depth</div>
        </div>

        <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
          <span className="text-slate-400 text-[11px] uppercase font-bold block mb-1">Statewide Challenge Accuracy</span>
          <div className="text-2xl font-black text-emerald-400">91.8% Correct</div>
          <div className="text-[11px] text-slate-400 font-bold mt-1">Equal scoring weight</div>
        </div>
      </div>

      {/* Subject Domain Breakdown & Language Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Subject Accuracy */}
        <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD166]" />
              <span>Subject Domain Mastery Accuracy</span>
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Fractions & Spatial Division</span>
                <strong className="text-white">92%</strong>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-black">
                <div className="bg-[#FFD166] h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Geometry & Coordinate Symmetry</span>
                <strong className="text-white">88%</strong>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-black">
                <div className="bg-[#C4B5FD] h-full rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Mental Arithmetic & Soroban Counting</span>
                <strong className="text-white">95%</strong>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-black">
                <div className="bg-[#06D6A0] h-full rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Physics & Ray Tracing Optics</span>
                <strong className="text-white">84%</strong>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-black">
                <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bilingual Instruction Distribution */}
        <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Bilingual Instruction & Audio Telemetry</span>
            </h2>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#0E131F] rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block text-sm">English Instruction Mode</strong>
                <span className="text-slate-400 text-[11px]">Primary medium in urban high schools</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-[#38BDF8]">58%</div>
                <span className="text-[10px] text-slate-500">1,070 sessions</span>
              </div>
            </div>

            <div className="p-4 bg-[#0E131F] rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block text-sm">Mizo Language Mode (Zirlai)</strong>
                <span className="text-slate-400 text-[11px]">Localized audio guidance & native labels</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-[#06D6A0]">42%</div>
                <span className="text-[10px] text-slate-500">775 sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
