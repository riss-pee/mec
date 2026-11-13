import React, { useState } from 'react';
import {
  Users,
  School,
  Radio,
  Archive,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { AdminClassroomItem } from '../../types';
import { toast } from 'sonner';

interface ClassroomManagementTabProps {
  classrooms: AdminClassroomItem[];
  onUpdateStatus: (classroomId: string, status: 'active' | 'archived' | 'flagged') => Promise<void>;
}

export const ClassroomManagementTab: React.FC<ClassroomManagementTabProps> = ({
  classrooms,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');

  const filteredClassrooms = classrooms.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (
    c: AdminClassroomItem,
    nextStatus: 'active' | 'archived' | 'flagged'
  ) => {
    try {
      await onUpdateStatus(c.id, nextStatus);
      toast.success(`${c.name} status updated to ${nextStatus}.`);
    } catch {
      toast.error('Failed to update classroom status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
              <School className="w-5 h-5 text-[#C4B5FD]" />
              <span>Statewide Classroom Administration & Rosters</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Review institutional classrooms, verify certified educator ownership, and oversee student cohort privacy.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-bold">
              Total Classrooms: {classrooms.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="pt-4 font-mono text-xs">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by classroom name, school, teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFD166]"
            />
          </div>
        </div>
      </div>

      {/* Classroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClassrooms.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between font-mono text-xs"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{c.grade}</span>
                  <h2 className="text-sm font-bold text-white">{c.name}</h2>
                </div>

                {c.status === 'active' && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    ACTIVE
                  </span>
                )}
                {c.status === 'archived' && (
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold">
                    ARCHIVED
                  </span>
                )}
                {c.status === 'flagged' && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                    FLAGGED
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Institution:</span>
                  <strong className="text-white text-right">{c.schoolName}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Certified Teacher:</span>
                  <span className="text-[#FFD166]">{c.teacherName}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Cohort Members:</span>
                  <span className="text-[#38BDF8] font-bold">{c.studentCount} Students</span>
                </div>

                {c.activeSessionCode ? (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between mt-2">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>Live Session Active</span>
                    </span>
                    <strong className="text-white font-mono bg-black/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      {c.activeSessionCode}
                    </strong>
                  </div>
                ) : (
                  <div className="p-2 bg-[#0E131F] rounded-lg text-slate-500 text-[11px] text-center mt-2">
                    No active multiplayer session running currently
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Created: {new Date(c.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                {c.status !== 'active' && (
                  <button
                    onClick={() => handleStatusChange(c, 'active')}
                    className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold hover:bg-emerald-500/30 cursor-pointer"
                  >
                    Set Active
                  </button>
                )}
                {c.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusChange(c, 'archived')}
                    className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Archive
                  </button>
                )}
                {c.status !== 'flagged' && (
                  <button
                    onClick={() => handleStatusChange(c, 'flagged')}
                    className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded font-bold hover:bg-rose-500/20 cursor-pointer"
                  >
                    Flag
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
