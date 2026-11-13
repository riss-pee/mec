import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Plus,
  Trophy,
  Trash2,
  ArrowRightLeft,
  UserMinus,
  Sparkles,
  X,
  Check,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import { ClassroomTeam, UserProfile } from '../../../auth/types';
import {
  getStoredTeams,
  createTeam,
  deleteTeam,
  moveStudentToTeam,
  removeStudentFromTeam,
  getStudentsByTeacher,
} from '../../../auth/services/authService';
import { getAvatarById } from '../../../../data/avatarLibrary';
import { toast } from 'sonner';

const CLASSROOM_OPTIONS = [
  { id: 'cls-6a', name: 'Class 6-A — Fractions & Decimals' },
  { id: 'cls-6b', name: 'Class 6-B — Geometry & Symmetry' },
  { id: 'cls-7a', name: 'Class 7-A — Ray Tracing & Optics' },
];

const PRESET_COLORS = [
  { label: 'Amber', hex: '#FFD166' },
  { label: 'Emerald', hex: '#06D6A0' },
  { label: 'Sky', hex: '#38BDF8' },
  { label: 'Purple', hex: '#C4B5FD' },
  { label: 'Pink', hex: '#F472B6' },
  { label: 'Orange', hex: '#FB923C' },
];

export const TeacherTeamsTab: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<ClassroomTeam[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('cls-6a');

  // Create Team Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].hex);

  const refreshData = async () => {
    const storedTeams = getStoredTeams();
    setTeams(storedTeams);

    if (user?.id) {
      const stuList = await getStudentsByTeacher(user.id);
      setStudents(stuList);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    createTeam(newTeamName.trim(), selectedClassId, selectedColor);
    refreshData();
    setIsCreateModalOpen(false);
    setNewTeamName('');
    toast.success(`Team "${newTeamName.trim()}" created!`);
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    if (confirm(`Are you sure you want to delete ${teamName}? Students will return to the unassigned pool.`)) {
      deleteTeam(teamId);
      refreshData();
      toast.info(`Deleted ${teamName}`);
    }
  };

  const handleMoveStudent = (studentId: string, targetTeamId: string) => {
    moveStudentToTeam(studentId, targetTeamId);
    refreshData();
    toast.success('Student team assignment updated');
  };

  const handleRemoveStudent = (studentId: string, teamId: string, studentName: string) => {
    removeStudentFromTeam(studentId, teamId);
    refreshData();
    toast.info(`Removed ${studentName} from team`);
  };

  // Filter teams for selected classroom
  const classTeams = teams.filter((t) => t.classroomId === selectedClassId);

  // All student IDs currently in any team for this class
  const assignedStudentIds = new Set<string>();
  classTeams.forEach((t) => {
    t.studentIds.forEach((id) => assignedStudentIds.add(id));
  });

  // Students in this classroom who are NOT assigned to any team
  const unassignedStudents = students.filter(
    (s) => (s.classroomId === selectedClassId || !s.classroomId) && !assignedStudentIds.has(s.id)
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Header & Classroom Filter */}
      <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                COLLABORATIVE MULTIPLAYER SQUADS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase">
              Classroom Teams & Squad Management
            </h2>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              Organize students into squads (Alpha, Beta, Gamma, Delta) for live team battles and peer learning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2.5 bg-white border-2 border-black rounded-xl text-xs font-mono font-bold focus:outline-hidden cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              {CLASSROOM_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="retro-btn px-4 py-2.5 rounded-xl bg-[#FFD166] hover:bg-[#ffc947] text-black border-2 border-black font-mono font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Team</span>
            </button>
          </div>
        </div>

        {/* Team Overview Stats */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-lg font-black text-black">{classTeams.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Active Teams</div>
          </div>
          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-lg font-black text-purple-700">{assignedStudentIds.size}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Assigned Players</div>
          </div>
          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-lg font-black text-amber-600">{unassignedStudents.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Unassigned Pool</div>
          </div>
          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-lg font-black text-emerald-600">
              {classTeams.length > 0
                ? Math.round(classTeams.reduce((acc, t) => acc + (t.accuracy || 85), 0) / classTeams.length)
                : 90}
              %
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Avg Accuracy</div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classTeams.map((team) => {
          const teamMembers = students.filter((s) => team.studentIds.includes(s.id));

          return (
            <motion.div
              key={team.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Team Header Stripe */}
                <div
                  className="px-5 py-3 border-b-2 border-black flex items-center justify-between"
                  style={{ backgroundColor: team.color }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-black" />
                    <h3 className="font-sans font-black text-base uppercase text-black">
                      {team.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-black bg-white/80 border border-black px-2 py-0.5 rounded font-mono">
                      {teamMembers.length} Members
                    </span>
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="w-7 h-7 bg-white hover:bg-rose-100 border border-black rounded flex items-center justify-center text-slate-800 hover:text-rose-700 cursor-pointer transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-2 p-3 bg-white border-b border-black/15 text-xs text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Total Score</span>
                    <div className="font-black text-base text-black">{team.score} pts</div>
                  </div>
                  <div className="border-l border-black/10">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</span>
                    <div className="font-black text-base text-emerald-600">{team.accuracy}%</div>
                  </div>
                </div>

                {/* Team Roster */}
                <div className="p-4 space-y-2">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-2">
                    ROSTER ({teamMembers.length})
                  </div>

                  {teamMembers.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 italic bg-white border border-dashed border-black/20 rounded-xl">
                      No students assigned yet. Select students from the unassigned pool below.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {teamMembers.map((member) => {
                        const avatar = getAvatarById(member.avatarId);
                        return (
                          <div
                            key={member.id}
                            className="p-2 bg-white border border-black rounded-lg shadow-[1px_1px_0px_#000] flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-base">{avatar.emoji}</span>
                              <div className="truncate">
                                <span className="font-black text-black truncate block">
                                  {member.displayName}
                                </span>
                                <span className="text-[10px] text-slate-500">@{member.username}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Move to another team */}
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleMoveStudent(member.id, e.target.value);
                                  }
                                }}
                                defaultValue=""
                                className="text-[10px] font-bold bg-slate-50 hover:bg-slate-100 border border-black rounded px-1.5 py-1 cursor-pointer"
                              >
                                <option value="" disabled>
                                  Move...
                                </option>
                                {classTeams
                                  .filter((t) => t.id !== team.id)
                                  .map((t) => (
                                    <option key={t.id} value={t.id}>
                                      To {t.name}
                                    </option>
                                  ))}
                              </select>

                              {/* Remove from team */}
                              <button
                                onClick={() => handleRemoveStudent(member.id, team.id, member.displayName)}
                                className="p-1 hover:bg-rose-100 rounded text-slate-600 hover:text-rose-700 cursor-pointer"
                                title="Remove to Unassigned Pool"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Unassigned Students Pool */}
      <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
          <div>
            <h3 className="text-base font-black text-black uppercase font-sans">
              Unassigned Students Pool ({unassignedStudents.length})
            </h3>
            <p className="text-xs text-slate-600">
              Students in this classroom ready to be assigned to competitive squads.
            </p>
          </div>
        </div>

        {unassignedStudents.length === 0 ? (
          <div className="p-6 text-center text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl font-bold">
            All students in this classroom have been allocated to a team!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unassignedStudents.map((stu) => {
              const avatar = getAvatarById(stu.avatarId);
              return (
                <div
                  key={stu.id}
                  className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-lg">{avatar.emoji}</span>
                    <div className="truncate">
                      <strong className="block text-black truncate">{stu.displayName}</strong>
                      <span className="text-[10px] text-slate-500">@{stu.username}</span>
                    </div>
                  </div>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleMoveStudent(stu.id, e.target.value);
                      }
                    }}
                    defaultValue=""
                    className="text-[10px] font-bold bg-[#FFD166] hover:bg-[#ffc947] border border-black rounded px-2 py-1 cursor-pointer shrink-0"
                  >
                    <option value="" disabled>
                      Assign Team ▾
                    </option>
                    {classTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================
          MODAL: CREATE NEW TEAM
          ============================================================ */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#FFFDF5] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 sm:p-8"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <h3 className="text-xl font-black text-black uppercase font-sans mb-1">
                Create Classroom Team
              </h3>
              <p className="text-xs text-slate-600 mb-5">
                Add a new squad for multiplayer math challenges and team leaderboards.
              </p>

              <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. Team Falcon"
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-mono focus:outline-hidden focus:bg-[#FFFDF5] shadow-[2px_2px_0px_#000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-2">
                    Team Badge Color
                  </label>
                  <div className="flex items-center gap-3">
                    {PRESET_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c.hex}
                        onClick={() => setSelectedColor(c.hex)}
                        className={`w-8 h-8 rounded-full border-2 border-black cursor-pointer transition-transform ${
                          selectedColor === c.hex ? 'scale-125 shadow-[2px_2px_0px_#000]' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FFD166] hover:bg-[#ffc947] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Team</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
