import React, { useState } from 'react';
import {
  Radio,
  Clock,
  Users,
  ShieldAlert,
  AlertTriangle,
  X,
  Play,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AdminLiveSession } from '../../types';
import { toast } from 'sonner';

interface LiveSessionsTabProps {
  sessions: AdminLiveSession[];
  onTerminateSession: (sessionId: string, reason: string) => Promise<void>;
}

export const LiveSessionsTab: React.FC<LiveSessionsTabProps> = ({
  sessions,
  onTerminateSession,
}) => {
  const [selectedSession, setSelectedSession] = useState<AdminLiveSession | null>(null);
  const [terminateReason, setTerminateReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenTerminate = (s: AdminLiveSession) => {
    setSelectedSession(s);
    setTerminateReason('');
  };

  const executeTerminate = async () => {
    if (!selectedSession) return;
    setIsProcessing(true);
    try {
      await onTerminateSession(selectedSession.id, terminateReason || 'Session terminated by platform administrator');
      toast.success(`Session ${selectedSession.code} terminated.`);
      setSelectedSession(null);
    } catch {
      toast.error('Failed to terminate session.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>Real-Time Classroom Session Radar</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Live observability over student smartboard connections, collaborative relays, and broadcast telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Broadcasts: {sessions.filter((s) => s.status === 'active' || s.status === 'lobby').length}</span>
            </span>
          </div>
        </div>

        {/* Ethical Safety Notice */}
        <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-[#0E131F] text-slate-400 font-mono text-xs flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-[#FFD166] shrink-0" />
          <span>
            <strong>Educational Score Integrity:</strong> Administrators have supervisory access to pause or terminate sessions in emergencies, but cannot tamper with or manipulate student challenge scores.
          </span>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`p-5 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between font-mono text-xs ${
              s.status === 'terminated' ? 'opacity-50 border-dashed' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#FFD166] text-black font-black text-xs border border-black shadow-[1px_1px_0px_#000]">
                    {s.code}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-white">{s.title}</h2>
                    <span className="text-[10px] text-slate-400">{s.classroomName}</span>
                  </div>
                </div>

                {s.status === 'active' && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold animate-pulse">
                    ACTIVE BATTLE
                  </span>
                )}
                {s.status === 'lobby' && (
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    LOBBY STAGING
                  </span>
                )}
                {s.status === 'terminated' && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                    TERMINATED
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Selected Module:</span>
                  <strong className="text-[#38BDF8]">{s.moduleTitle}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Host Teacher:</span>
                  <span className="text-white font-medium">{s.hostName}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Connected Students:</span>
                  <span className="text-[#06D6A0] font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{s.participantsCount} Devices Linked</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Elapsed Time:</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Started {s.startedAt}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Duration Limit: {s.durationMinutes}m
              </span>

              {s.status !== 'terminated' ? (
                <button
                  onClick={() => handleOpenTerminate(s)}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Emergency Terminate</span>
                </button>
              ) : (
                <span className="text-[10px] text-rose-400 font-bold">Session Closed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Terminate Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono text-xs">
          <div className="bg-[#161D2B] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold uppercase tracking-wider text-rose-400">
                Confirm Emergency Session Termination
              </span>
              <button onClick={() => setSelectedSession(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Terminate Broadcast {selectedSession.code}?</strong>
                <span className="text-[11px]">
                  All {selectedSession.participantsCount} connected student smartboards will be disconnected gracefully. An administrative audit entry will be generated.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                Reason for Termination (Logged to Audit Trail):
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Teacher requested remote reset / network glitch"
                value={terminateReason}
                onChange={(e) => setTerminateReason(e.target.value)}
                className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-600"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={executeTerminate}
                disabled={isProcessing}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                {isProcessing ? 'Terminating...' : 'Confirm Termination'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
