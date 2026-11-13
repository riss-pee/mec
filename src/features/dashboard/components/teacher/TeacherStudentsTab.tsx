import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  UserPlus,
  Key,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
  Award,
  CheckCircle2,
  Lock,
  Unlock,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import { UserProfile, CreateStudentRequest, GeneratedStudentCredentials } from '../../../auth/types';
import {
  getStudentsByTeacher,
  createStudentAccount,
  resetStudentCredentials,
  getStoredUsers,
  saveUsers,
} from '../../../auth/services/authService';
import { AVATAR_LIBRARY, AVATAR_CATEGORIES, getAvatarById } from '../../../../data/avatarLibrary';
import { toast } from 'sonner';

const CLASSROOM_OPTIONS = [
  { id: 'cls-6a', name: 'Class 6-A — Fractions & Decimals', grade: 'Class 6' },
  { id: 'cls-6b', name: 'Class 6-B — Geometry & Symmetry', grade: 'Class 6' },
  { id: 'cls-7a', name: 'Class 7-A — Ray Tracing & Optics', grade: 'Class 7' },
];

export const TeacherStudentsTab: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formClassroomId, setFormClassroomId] = useState(CLASSROOM_OPTIONS[0].id);
  const [formRollNumber, setFormRollNumber] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar-astro-rocket');

  // Generated Credentials Modal State
  const [credsModalData, setCredsModalData] = useState<GeneratedStudentCredentials | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Reset PIN State
  const [resetPinModalData, setResetPinModalData] = useState<{
    displayName: string;
    username: string;
    pin: string;
  } | null>(null);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const list = await getStudentsByTeacher(user?.id || 'teacher-01');
      setStudents(list);
    } catch {
      toast.error('Failed to load students roster.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [user]);

  // Auto suggest username based on name
  const handleNameChange = (val: string) => {
    setFormDisplayName(val);
    if (!formUsername || formUsername.startsWith(formDisplayName.toLowerCase().slice(0, 3))) {
      const suggested = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 8);
      if (suggested) {
        setFormUsername(`${suggested}.class06`);
      }
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDisplayName.trim() || !formUsername.trim()) {
      toast.error('Please provide student name and username.');
      return;
    }

    if (!user) {
      toast.error('You must be signed in as a teacher.');
      return;
    }

    setIsSubmitting(true);
    try {
      const targetClass = CLASSROOM_OPTIONS.find((c) => c.id === formClassroomId) || CLASSROOM_OPTIONS[0];
      const avatarObj = getAvatarById(selectedAvatarId);

      const req: CreateStudentRequest = {
        displayName: formDisplayName.trim(),
        username: formUsername.trim().toLowerCase(),
        classroomId: targetClass.id,
        classroomName: targetClass.name,
        grade: targetClass.grade,
        rollNumber: formRollNumber.trim() || undefined,
        avatar: avatarObj.emoji,
        avatarId: avatarObj.id,
      };

      const creds = await createStudentAccount(req, user);
      await loadStudents();
      setIsAddModalOpen(false);
      setCredsModalData(creds);

      // Reset form
      setFormDisplayName('');
      setFormUsername('');
      setFormRollNumber('');
      toast.success(`Account created for ${creds.displayName}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create student account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPin = async (student: UserProfile) => {
    try {
      const newPin = await resetStudentCredentials(student.id);
      await loadStudents();
      setResetPinModalData({
        displayName: student.displayName,
        username: student.username || student.displayName.toLowerCase().replace(/\s+/g, ''),
        pin: newPin,
      });
      toast.success(`Reset PIN for ${student.displayName}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset PIN.');
    }
  };

  const handleToggleStatus = (student: UserProfile) => {
    const nextStatus = student.status === 'suspended' ? 'active' : 'suspended';
    const allUsers = getStoredUsers();
    const idx = allUsers.findIndex((u) => u.id === student.id);
    if (idx !== -1) {
      allUsers[idx].status = nextStatus;
      saveUsers(allUsers);
      loadStudents();
      toast.info(`Account for ${student.displayName} is now ${nextStatus.toUpperCase()}`);
    }
  };

  const handleCopyCredentials = (creds: { displayName: string; username: string; pin: string }) => {
    const slipText = `==============================\nZIRNA STEM STUDIO — STUDENT LOGIN SLIP\n==============================\nStudent Name: ${creds.displayName}\nLogin URL: ${window.location.origin}/#/auth\nUsername: ${creds.username}\nTemporary 6-Digit PIN: ${creds.pin}\n\n* Keep this PIN private and memorize your username!`;
    navigator.clipboard.writeText(slipText);
    setCopiedCreds(true);
    toast.success('Login slip copied to clipboard!');
    setTimeout(() => setCopiedCreds(false), 2500);
  };

  // Filter students
  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stu.username && stu.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (stu.rollNumber && stu.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass =
      selectedClassFilter === 'all' || stu.classroomId === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Header & Action Bar */}
      <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0]" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                ZERO-EMAIL CHILD ACCOUNTS
              </span>
              <span className="text-xs text-slate-500">• MBSE Compliant</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase">
              Student Accounts & Roster Management
            </h2>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              Provision safe learner logins using simple usernames and 6-digit PINs. Zero email or personal data required.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="retro-btn px-5 py-3 rounded-xl bg-[#06D6A0] hover:bg-[#05b88a] text-black border-2 border-black font-mono font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] cursor-pointer flex items-center gap-2 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student Account</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, username (@puia.class06), or roll number..."
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-mono focus:outline-hidden focus:bg-[#FFFDF5] shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-mono font-bold focus:outline-hidden cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              <option value="all">All Classrooms ({students.length})</option>
              {CLASSROOM_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <span className="text-xs font-bold text-slate-600 whitespace-nowrap px-2">
              Showing {filteredStudents.length} of {students.length}
            </span>
          </div>
        </div>
      </div>

      {/* Student List Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-500">
          Loading student accounts...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 bg-white border-3 border-black rounded-2xl brutal-shadow text-center space-y-3">
          <Users className="w-8 h-8 mx-auto text-slate-400" />
          <h3 className="text-base font-black text-black">No student accounts found</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            {searchQuery
              ? `No student matched your search query "${searchQuery}".`
              : 'You have not provisioned any student accounts for this classroom yet.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="retro-btn inline-flex items-center gap-2 px-4 py-2 bg-[#FFD166] text-black font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create First Student Account</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((stu) => {
            const avatar = getAvatarById(stu.avatarId);
            const isSuspended = stu.status === 'suspended';

            return (
              <motion.div
                key={stu.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] transition-all flex flex-col justify-between ${
                  isSuspended ? 'bg-slate-100 opacity-75' : 'bg-[#FFFDF5]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg border-2 border-black bg-white flex items-center justify-center text-xl shadow-[1px_1px_0px_#000]">
                        {avatar.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-black text-black flex items-center gap-1.5">
                          <span>{stu.displayName}</span>
                          {stu.rollNumber && (
                            <span className="text-[10px] bg-black text-white px-1.5 py-0.2 rounded font-mono">
                              #{stu.rollNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-purple-700">
                          @{stu.username || 'username'}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                        isSuspended
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-black/15 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Class:</span>
                      <strong className="text-black truncate max-w-[170px]">{stu.classroomName || 'Class 6-A'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mastery Points:</span>
                      <strong className="text-black">{stu.points || 100} pts</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Streak:</span>
                      <strong className="text-amber-600">{stu.streakDays || 1} days 🔥</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Login PIN:</span>
                      <span className="font-mono font-black text-black tracking-widest">
                        {stu.temporaryPin ? stu.temporaryPin : '••••••'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-black/10 flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleResetPin(stu)}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-black rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Key className="w-3 h-3 text-purple-600" />
                    <span>Reset PIN</span>
                  </button>

                  <button
                    onClick={() =>
                      handleCopyCredentials({
                        displayName: stu.displayName,
                        username: stu.username || 'username',
                        pin: stu.temporaryPin || '123456',
                      })
                    }
                    className="py-1.5 px-2.5 bg-[#FFD166] hover:bg-[#ffc947] border border-black rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Copy Login Slip"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Slip</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(stu)}
                    className={`py-1.5 px-2.5 border border-black rounded font-bold text-[10px] flex items-center justify-center cursor-pointer transition-colors ${
                      isSuspended
                        ? 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900'
                        : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                    }`}
                    title={isSuspended ? 'Activate Account' : 'Suspend Account'}
                  >
                    {isSuspended ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ============================================================
          MODAL 1: ADD STUDENT ACCOUNT
          ============================================================ */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-[#FFFDF5] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  NEW STUDENT PROVISIONING
                </span>
              </div>

              <h3 className="text-xl font-black text-black uppercase font-sans mb-1">
                Create Student Account
              </h3>
              <p className="text-xs text-slate-600 mb-5">
                No email address required. The system will auto-generate a secure 6-digit temporary PIN for classroom sign-in.
              </p>

              <form onSubmit={handleCreateStudent} className="space-y-4">
                {/* Full / Display Name */}
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDisplayName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Lalthanpuia Sailo"
                    className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-lg text-xs font-mono focus:outline-hidden focus:bg-[#FFFDF5] shadow-[2px_2px_0px_#000]"
                  />
                </div>

                {/* Username */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-black text-black uppercase">
                      Student Username *
                    </label>
                    <span className="text-[10px] text-slate-500">Only letters, numbers, dots</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                    placeholder="e.g. puia.class06"
                    className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-lg text-xs font-mono focus:outline-hidden focus:bg-[#FFFDF5] shadow-[2px_2px_0px_#000]"
                  />
                </div>

                {/* Classroom Assignment */}
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    Classroom Assignment *
                  </label>
                  <select
                    value={formClassroomId}
                    onChange={(e) => setFormClassroomId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-lg text-xs font-mono font-bold focus:outline-hidden cursor-pointer shadow-[2px_2px_0px_#000]"
                  >
                    {CLASSROOM_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Roll Number (Optional) */}
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    School Roll Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formRollNumber}
                    onChange={(e) => setFormRollNumber(e.target.value)}
                    placeholder="e.g. 14"
                    className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-lg text-xs font-mono focus:outline-hidden focus:bg-[#FFFDF5] shadow-[2px_2px_0px_#000]"
                  />
                </div>

                {/* Avatar Picker Preview */}
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-2">
                    Pick Starting Pixel Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_LIBRARY.slice(0, 12).map((av) => (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setSelectedAvatarId(av.id)}
                        className={`p-2 rounded-lg border-2 text-xl flex items-center justify-center cursor-pointer transition-transform ${
                          selectedAvatarId === av.id
                            ? 'border-black bg-[#FFD166] scale-110 shadow-[2px_2px_0px_#000]'
                            : 'border-black/20 bg-white hover:border-black'
                        }`}
                        title={av.name}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    {isSubmitting ? (
                      <span>Creating Safe Account...</span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Provision Student Account</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL 2: GENERATED CREDENTIALS CONFIRMATION (1-TIME VIEW)
          ============================================================ */}
      <AnimatePresence>
        {credsModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#FFFDF5] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  CREDENTIALS GENERATED
                </span>
              </div>

              <h3 className="text-xl font-black text-black uppercase font-sans mb-1">
                Student Account Ready!
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Please copy or record these login credentials now. Give them directly to the student for logging into ZIRNA STEM STUDIO.
              </p>

              {/* Login Slip Card */}
              <div className="bg-white border-2 border-dashed border-black rounded-xl p-4 shadow-[2px_2px_0px_#000] space-y-3 mb-5">
                <div className="flex justify-between items-center border-b border-black/10 pb-2">
                  <span className="text-xs font-black text-slate-600 uppercase">Student Name</span>
                  <strong className="text-sm text-black font-bold">{credsModalData.displayName}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-black/10 pb-2">
                  <span className="text-xs font-black text-slate-600 uppercase">Username</span>
                  <span className="text-sm font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {credsModalData.username}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-600 uppercase">Temporary PIN</span>
                  <span className="text-base font-black text-black bg-[#FFD166] px-3 py-1 rounded border-2 border-black tracking-widest">
                    {credsModalData.temporaryPin}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleCopyCredentials({
                      displayName: credsModalData.displayName,
                      username: credsModalData.username,
                      pin: credsModalData.temporaryPin,
                    })
                  }
                  className="w-full py-2.5 bg-[#FFD166] hover:bg-[#ffc947] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
                >
                  {copiedCreds ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCreds ? 'Copied Slip to Clipboard!' : 'Copy Student Login Slip'}</span>
                </button>

                <button
                  onClick={() => setCredsModalData(null)}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 text-black font-bold text-xs rounded-xl border-2 border-black cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL 3: RESET PIN CONFIRMATION
          ============================================================ */}
      <AnimatePresence>
        {resetPinModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#FFFDF5] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFD166] border-2 border-black mx-auto mb-3 flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <Key className="w-6 h-6" />
              </div>

              <h4 className="text-lg font-black text-black uppercase font-sans mb-1">
                New Temporary PIN Generated
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                PIN for <strong>{resetPinModalData.displayName}</strong> has been updated:
              </p>

              <div className="text-2xl font-black font-mono tracking-widest bg-white border-2 border-black py-3 rounded-xl shadow-[2px_2px_0px_#000] mb-5">
                {resetPinModalData.pin}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopyCredentials({
                      displayName: resetPinModalData.displayName,
                      username: resetPinModalData.username,
                      pin: resetPinModalData.pin,
                    })
                  }
                  className="flex-1 py-2 bg-[#FFD166] text-black font-bold text-xs rounded-lg border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
                >
                  Copy Slip
                </button>
                <button
                  onClick={() => setResetPinModalData(null)}
                  className="py-2 px-4 bg-white hover:bg-slate-100 text-black font-bold text-xs rounded-lg border-2 border-black cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
