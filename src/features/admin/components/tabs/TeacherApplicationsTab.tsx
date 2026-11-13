import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  School,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  FileText,
  Mail,
  Building,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { TeacherApplication } from '../../../auth/types';
import {
  getTeacherApplications,
  reviewTeacherApplication,
} from '../../../auth/services/authService';
import { toast } from 'sonner';

export const TeacherApplicationsTab: React.FC = () => {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Review Modal State
  const [activeReviewApp, setActiveReviewApp] = useState<TeacherApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getTeacherApplications();
      setApplications(data);
    } catch {
      toast.error('Failed to load teacher applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReviewDecision = async (
    appId: string,
    decision: 'approved' | 'rejected',
    notes?: string
  ) => {
    setIsProcessing(true);
    try {
      await reviewTeacherApplication(appId, decision, notes);
      await loadApplications();
      setActiveReviewApp(null);
      setAdminNotes('');
      if (decision === 'approved') {
        toast.success('Teacher application approved! Account privileges have been activated.');
      } else {
        toast.info('Teacher application rejected.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update application.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  const filtered = applications.filter((app) => {
    const matchesFilter = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.designation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] animate-pulse" />
              <span className="text-[10px] font-black uppercase text-[#FFD166] tracking-wider bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                EDUCATOR ACCREDITATION GATE
              </span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span>Teacher Applications & Institutional Verification</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Review and grant student provisioning privileges to authorized educators across Mizoram and India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 text-amber-300 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingCount} Pending Review</span>
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-[#0E131F] border border-slate-800 rounded-xl">
            <div className="text-lg font-black text-white">{applications.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Total Submissions</div>
          </div>
          <div className="p-3 bg-[#0E131F] border border-amber-500/30 rounded-xl">
            <div className="text-lg font-black text-[#FFD166]">{pendingCount}</div>
            <div className="text-[10px] uppercase font-bold text-amber-400 mt-0.5">Awaiting Review</div>
          </div>
          <div className="p-3 bg-[#0E131F] border border-emerald-500/30 rounded-xl">
            <div className="text-lg font-black text-emerald-400">{approvedCount}</div>
            <div className="text-[10px] uppercase font-bold text-emerald-500 mt-0.5">Accredited</div>
          </div>
          <div className="p-3 bg-[#0E131F] border border-rose-500/30 rounded-xl">
            <div className="text-lg font-black text-rose-400">{rejectedCount}</div>
            <div className="text-[10px] uppercase font-bold text-rose-500 mt-0.5">Declined</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by teacher name, school, email, or designation..."
            className="w-full pl-9 pr-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#FFD166]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-[#0E131F] border border-slate-700 rounded-lg p-0.5">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md uppercase text-[10px] font-black transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#FFD166] text-black shadow-[1px_1px_0px_#000]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-slate-400 text-xs font-bold whitespace-nowrap">
            {filtered.length} found
          </span>
        </div>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading educator verification queue...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 bg-[#161D2B] border-2 border-black rounded-2xl text-center space-y-3">
          <GraduationCap className="w-8 h-8 mx-auto text-slate-600" />
          <h3 className="text-sm font-black text-white">No applications match current filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No teacher matches "${searchQuery}".`
              : 'There are currently no teacher applications in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const isPending = app.status === 'pending';
            const isApproved = app.status === 'approved';

            return (
              <div
                key={app.id}
                className="p-4 sm:p-5 bg-[#161D2B] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                        isPending
                          ? 'bg-amber-950/60 text-amber-300 border-amber-600'
                          : isApproved
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600'
                          : 'bg-rose-950/60 text-rose-300 border-rose-600'
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>
                    <strong className="text-sm font-black text-white">{app.fullName}</strong>
                    <span className="text-slate-400">• {app.designation}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{app.schoolName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{app.email}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic bg-[#0E131F] p-2.5 rounded-lg border border-slate-800">
                    "{app.reason}"
                  </p>

                  <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-2">
                    <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                    {app.reviewedAt && (
                      <span>
                        • Reviewed by {app.reviewedBy || 'Admin'} on {new Date(app.reviewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Controls */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewDecision(app.id, 'approved')}
                        disabled={isProcessing}
                        className="px-3 py-2 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black text-xs uppercase rounded-lg border border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveReviewApp(app);
                          setAdminNotes('');
                        }}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase rounded-lg border border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReviewApp(app);
                        setAdminNotes(app.adminNotes || '');
                      }}
                      className="px-3 py-1.5 bg-[#0E131F] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review / Reject Dialog Modal */}
      <AnimatePresence>
        {activeReviewApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#161D2B] border-2 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 text-slate-100"
            >
              <button
                onClick={() => setActiveReviewApp(null)}
                className="absolute right-4 top-4 w-8 h-8 rounded-lg border border-slate-700 bg-[#0E131F] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-white uppercase mb-1">
                Application Review — {activeReviewApp.fullName}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {activeReviewApp.schoolName} ({activeReviewApp.designation})
              </p>

              <div className="space-y-3 bg-[#0E131F] p-4 rounded-xl border border-slate-800 text-xs mb-4">
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Email Address</span>
                  <strong className="text-white">{activeReviewApp.email}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Educational Purpose</span>
                  <p className="text-slate-300 mt-0.5">{activeReviewApp.reason}</p>
                </div>

                {activeReviewApp.adminNotes && (
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Administrator Notes</span>
                    <p className="text-amber-300 mt-0.5">{activeReviewApp.adminNotes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-slate-400 font-bold text-xs uppercase">
                  Add Administrator Notes / Justification:
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Verified with MBSE School Directory; teacher approved for Class 6-8 STEM curriculum."
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-[#FFD166]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReviewDecision(activeReviewApp.id, 'approved', adminNotes)}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black text-xs uppercase rounded-xl border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Approve Application
                </button>

                <button
                  onClick={() => handleReviewDecision(activeReviewApp.id, 'rejected', adminNotes)}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase rounded-xl border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Reject Application
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
