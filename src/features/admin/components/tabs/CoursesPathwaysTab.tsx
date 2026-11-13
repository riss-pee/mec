import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Layers,
  ArrowUpDown,
  Edit,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AdminCoursePathway } from '../../types';
import { MODULES_REGISTRY } from '../../../../data/modulesRegistry';
import { toast } from 'sonner';

interface CoursesPathwaysTabProps {
  pathways: AdminCoursePathway[];
  onUpdatePathway: (pathwayId: string, updates: Partial<AdminCoursePathway>) => Promise<void>;
}

export const CoursesPathwaysTab: React.FC<CoursesPathwaysTabProps> = ({
  pathways,
  onUpdatePathway,
}) => {
  const [selectedPathway, setSelectedPathway] = useState<AdminCoursePathway | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (p: AdminCoursePathway) => {
    setSelectedPathway(p);
    setEditTitle(p.title);
    setEditTagline(p.tagline);
  };

  const handleSave = async () => {
    if (!selectedPathway) return;
    setIsSaving(true);
    try {
      await onUpdatePathway(selectedPathway.id, {
        title: editTitle,
        tagline: editTagline,
      });
      toast.success(`Pathway ${editTitle} updated.`);
      setSelectedPathway(null);
    } catch {
      toast.error('Failed to update pathway.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (p: AdminCoursePathway) => {
    try {
      await onUpdatePathway(p.id, { isFeatured: !p.isFeatured });
      toast.success(`Featured status updated for ${p.title}`);
    } catch {
      toast.error('Failed to toggle featured status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#06D6A0]" />
              <span>Curriculum Pathways & Course Tracks</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Sequence interactive STEM modules into structured progression tracks matching MBSE and NCERT guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-bold">
              Active Tracks: {pathways.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pathways List */}
      <div className="space-y-4 font-mono text-xs">
        {pathways.map((p, idx) => (
          <div
            key={p.id}
            className="p-5 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <span
                  style={{ backgroundColor: p.color }}
                  className="w-8 h-8 rounded-lg border-2 border-black text-black font-black flex items-center justify-center text-sm shadow-[2px_2px_0px_#000]"
                >
                  0{idx + 1}
                </span>
                <div>
                  <h2 className="text-sm font-bold text-white">{p.title}</h2>
                  <p className="text-[11px] text-slate-400">{p.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFeatured(p)}
                  className={`px-2.5 py-1 rounded border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    p.isFeatured
                      ? 'bg-amber-400/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{p.isFeatured ? 'Featured on Home' : 'Standard'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit Track</span>
                </button>
              </div>
            </div>

            {/* Modules in Pathway */}
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mb-2">
                Sequenced Workshops in Track ({p.moduleIds.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {p.moduleIds.map((modId, seq) => {
                  const found = MODULES_REGISTRY.find((m) => m.id === modId);
                  return (
                    <div
                      key={modId}
                      className="px-3 py-1.5 bg-[#0E131F] border border-slate-800 rounded-lg flex items-center gap-2 text-slate-300"
                    >
                      <span className="w-4 h-4 rounded bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center font-bold">
                        {seq + 1}
                      </span>
                      <span className="font-bold text-white">{found ? found.title : modId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Pathway Modal */}
      {selectedPathway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono text-xs">
          <div className="bg-[#161D2B] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold uppercase tracking-wider text-slate-300">
                Edit Course Pathway: {selectedPathway.title}
              </span>
              <button onClick={() => setSelectedPathway(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">
                  Track Name:
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
                  Pedagogical Tagline:
                </label>
                <textarea
                  rows={2}
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedPathway(null)}
                className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[#06D6A0] text-black font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Pathway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
