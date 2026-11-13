import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Download,
  X,
  UserCheck,
} from 'lucide-react';
import { AdminPrivacyRequest, PrivacyRequestStatus } from '../../types';
import { toast } from 'sonner';

interface PrivacyRequestsTabProps {
  requests: AdminPrivacyRequest[];
  onUpdateStatus: (requestId: string, status: PrivacyRequestStatus, adminNotes?: string) => Promise<void>;
}

export const PrivacyRequestsTab: React.FC<PrivacyRequestsTabProps> = ({
  requests,
  onUpdateStatus,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<AdminPrivacyRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenAction = (req: AdminPrivacyRequest) => {
    setSelectedRequest(req);
    setAdminNotes(req.adminNotes || '');
  };

  const executeStatusUpdate = async (status: PrivacyRequestStatus) => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await onUpdateStatus(selectedRequest.id, status, adminNotes);
      toast.success(`Privacy request ${selectedRequest.id} marked as ${status}.`);
      setSelectedRequest(null);
    } catch {
      toast.error('Failed to update privacy request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span>Data Protection, Privacy & Subject Rights Desk</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Review and fulfill student and parental data erasure, export, and consent revocation requests in adherence with the Digital Personal Data Protection (DPDP) Act 2023.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 font-bold">
              Pending Queue: {requests.filter((r) => r.status === 'pending' || r.status === 'reviewing').length}
            </span>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-5 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    {req.id}
                  </span>
                  <strong className="text-sm text-white capitalize">
                    {req.type.replace('-', ' ')} Request
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px]">
                      PENDING REVIEW
                    </span>
                  )}
                  {req.status === 'reviewing' && (
                    <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-[10px]">
                      UNDER VERIFICATION
                    </span>
                  )}
                  {req.status === 'completed' && (
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                      COMPLETED
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px]">
                      REJECTED
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#0E131F] rounded-xl border border-slate-800 mb-3 text-[11px]">
                <div>
                  <span className="text-slate-500 block uppercase text-[9px]">Requester / Guardian</span>
                  <strong className="text-white">{req.requesterName}</strong>
                  <div className="text-slate-400 text-[10px]">{req.userEmail}</div>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase text-[9px]">Target Student Record</span>
                  <strong className="text-[#FFD166]">{req.studentIdentifier || 'Direct Account'}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase text-[9px]">Legal Compliance Deadline</span>
                  <strong className="text-[#38BDF8] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{new Date(req.legalDeadline).toLocaleDateString()}</span>
                  </strong>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-3">{req.details}</p>

              {req.adminNotes && (
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-[11px] mb-3">
                  <span className="text-amber-400 font-bold block mb-0.5">Admin Resolution Log:</span>
                  <span>{req.adminNotes}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Submitted: {new Date(req.submittedAt).toLocaleDateString()}
              </span>

              <button
                onClick={() => handleOpenAction(req)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold cursor-pointer"
              >
                Review & Process Request →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#161D2B] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold uppercase tracking-wider text-slate-300">
                Process Privacy Request: {selectedRequest.id}
              </span>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300">
              Execute resolution for <strong>{selectedRequest.requesterName}</strong> ({selectedRequest.userEmail}).
            </p>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                Administrative Audit Notes:
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log verification steps taken, archive dispatched, or data scrub completed..."
                className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-600"
              />
            </div>

            <div className="pt-3 flex flex-wrap justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => executeStatusUpdate('rejected')}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-rose-950/60 text-rose-300 border border-rose-800 rounded font-bold cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => executeStatusUpdate('reviewing')}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800 rounded font-bold cursor-pointer"
              >
                Mark In Review
              </button>
              <button
                onClick={() => executeStatusUpdate('completed')}
                disabled={isProcessing}
                className="px-4 py-1.5 bg-[#06D6A0] text-black font-bold rounded border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Approve & Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
