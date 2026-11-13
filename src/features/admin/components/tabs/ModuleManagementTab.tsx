import React, { useState } from 'react';
import {
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Settings2,
  CheckCircle2,
  AlertCircle,
  Eye,
  BarChart2,
  Edit,
  X,
  Layers,
} from 'lucide-react';
import { AdminModuleConfig } from '../../types';
import { toast } from 'sonner';

interface ModuleManagementTabProps {
  modules: AdminModuleConfig[];
  onUpdateModule: (moduleId: string, updates: Partial<AdminModuleConfig>) => Promise<void>;
}

export const ModuleManagementTab: React.FC<ModuleManagementTabProps> = ({
  modules,
  onUpdateModule,
}) => {
  const [selectedModule, setSelectedModule] = useState<AdminModuleConfig | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleActive = async (m: AdminModuleConfig) => {
    try {
      await onUpdateModule(m.id, { isActive: !m.isActive });
      toast.success(`${m.title} is now ${!m.isActive ? 'Active' : 'in Maintenance Mode'}`);
    } catch {
      toast.error('Failed to update module status.');
    }
  };

  const handleToggleFeatured = async (m: AdminModuleConfig) => {
    try {
      await onUpdateModule(m.id, { isFeatured: !m.isFeatured });
      toast.success(`${m.title} featured status updated.`);
    } catch {
      toast.error('Failed to update featured flag.');
    }
  };

  const handleOpenEdit = (m: AdminModuleConfig) => {
    setSelectedModule(m);
    setEditTitle(m.title);
    setEditSubtitle(m.subtitle);
    setEditGrade(m.grade);
    setEditDescription(m.description);
  };

  const handleSaveMetadata = async () => {
    if (!selectedModule) return;
    setIsSaving(true);
    try {
      await onUpdateModule(selectedModule.id, {
        title: editTitle,
        subtitle: editSubtitle,
        grade: editGrade,
        description: editDescription,
      });
      toast.success(`Metadata saved for ${selectedModule.title}`);
      setSelectedModule(null);
    } catch {
      toast.error('Failed to update module metadata.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FFD166]" />
              <span>STEM Workshop Management & Curriculum Deployment</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Control platform availability, metadata, grade level alignments, and homepage featured status for all 7 interactive STEM modules.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-emerald-400 font-bold">
              Active Modules: {modules.filter((m) => m.isActive).length} / {modules.length}
            </span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m) => (
          <div
            key={m.id}
            className={`p-5 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between font-mono text-xs transition-all ${
              !m.isActive ? 'opacity-65 border-dashed' : ''
            }`}
          >
            <div>
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-[#FFD166] text-black font-black flex items-center justify-center text-xs border border-black shadow-[1px_1px_0px_#000]">
                    {m.number}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{m.category}</span>
                    <h2 className="text-sm font-bold text-white leading-tight">{m.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {m.isFeatured && (
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                      FEATURED
                    </span>
                  )}
                  {m.isActive ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      LIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                      MAINTENANCE
                    </span>
                  )}
                </div>
              </div>

              {/* Subtitle & Description */}
              <div className="text-[11px] text-amber-300/80 font-bold mb-1.5">{m.subtitle}</div>
              <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">{m.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#0E131F] rounded-xl border border-slate-800 text-[11px] mb-4">
                <div>
                  <span className="text-slate-500 block uppercase text-[9px]">Grade Level</span>
                  <strong className="text-white">{m.grade}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px]">Total Runs</span>
                  <strong className="text-[#38BDF8]">{m.totalRuns.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px]">Completion</span>
                  <strong className="text-[#06D6A0]">{m.completionRate}%</strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Active Toggle */}
                <button
                  onClick={() => handleToggleActive(m)}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
                  title="Toggle Live Status"
                >
                  {m.isActive ? (
                    <ToggleRight className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-slate-500" />
                  )}
                  <span className="text-[11px]">{m.isActive ? 'Online' : 'Disabled'}</span>
                </button>

                {/* Featured Toggle */}
                <button
                  onClick={() => handleToggleFeatured(m)}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
                  title="Toggle Featured Status"
                >
                  <Sparkles
                    className={`w-4 h-4 ${m.isFeatured ? 'text-[#FFD166] fill-[#FFD166]' : 'text-slate-600'}`}
                  />
                  <span className="text-[11px]">{m.isFeatured ? 'Featured' : 'Standard'}</span>
                </button>
              </div>

              <button
                onClick={() => handleOpenEdit(m)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Metadata</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Metadata Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono text-xs">
          <div className="bg-[#161D2B] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl w-full max-w-lg p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="font-bold uppercase tracking-wider text-slate-300">
                Edit Module Metadata: {selectedModule.title}
              </div>
              <button onClick={() => setSelectedModule(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">
                  English Title:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">
                  Bilingual Mizo Subtitle / Instruction:
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">
                  Grade Level Alignment:
                </label>
                <input
                  type="text"
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">
                  Pedagogical Description:
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMetadata}
                disabled={isSaving}
                className="px-4 py-2 bg-[#FFD166] text-black font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
