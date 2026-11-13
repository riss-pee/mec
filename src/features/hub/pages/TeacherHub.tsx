import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  School,
  Play,
  Plus,
  Copy,
  Check,
  Flame,
  Award,
  BarChart3,
  Trophy,
  Clock,
  Sparkles,
  Settings,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileDown,
  BookOpen,
  UserPlus,
  Key,
  RefreshCw,
  Layers,
  CheckCircle2,
  Search,
  ArrowUpRight,
  UserCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { UserProfile, CreateStudentRequest, GeneratedStudentCredentials } from '../../auth/types';
import {
  getStudentsByTeacher,
  createStudentAccount,
  resetStudentCredentials,
} from '../../auth/services/authService';
import { getActiveSession } from '../../classroom/services/classroomService';
import { MODULES_REGISTRY } from '../../../data/modulesRegistry';
import { AVATAR_LIBRARY, getAvatarById } from '../../../data/avatarLibrary';
import { toast } from 'sonner';

interface TeacherHubProps {
  onSelectModule: (id: string) => void;
  onNavigateClassroom: () => void;
  onNavigateTeacherDashboard: (initialTab?: string) => void;
  onOpenStoragePreferences: () => void;
}

export const TeacherHub: React.FC<TeacherHubProps> = ({
  onSelectModule,
  onNavigateClassroom,
  onNavigateTeacherDashboard,
  onOpenStoragePreferences,
}) => {
  const { user, setIsProfileModalOpen } = useAuth();
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [searchStudent, setSearchStudent] = useState('');
  const activeSession = getActiveSession();

  // Add Student Modal State
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formClassroom, setFormClassroom] = useState('cls-6a');
  const [formRollNo, setFormRollNo] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar-astro-rocket');

  // Generated Credentials Modal State
  const [credsData, setCredsData] = useState<GeneratedStudentCredentials | null>(null);
  const [copiedSlip, setCopiedSlip] = useState(false);

  // Load students for quick roster view
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const list = await getStudentsByTeacher(user?.id || 'teacher-demo-01');
        setStudents(list);
      } catch (err) {
        console.error('Failed to load teacher students:', err);
      } finally {
        setIsLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [user]);

  const teacherName = user?.displayName || 'Miss Lalrintluangi';
  const schoolName = user?.schoolName || 'Govt. Mizo High School, Aizawl';

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!formUsername || formUsername.startsWith(formName.toLowerCase().slice(0, 3))) {
      const clean = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
      if (clean) {
        setFormUsername(`${clean}.class06`);
      }
    }
  };

  const handleCreateStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) {
      toast.error('Student name and username are required.');
      return;
    }
    setIsSubmittingStudent(true);
    try {
      const clsName =
        formClassroom === 'cls-6a'
          ? 'Class 6-A — Fractions & Decimals'
          : formClassroom === 'cls-6b'
          ? 'Class 6-B — Geometry & Symmetry'
          : 'Class 7-A — Optics & Ray Tracing';

      const req: CreateStudentRequest = {
        displayName: formName.trim(),
        username: formUsername.trim(),
        classroomId: formClassroom,
        classroomName: clsName,
        rollNumber: formRollNo.trim() || undefined,
        avatarId: selectedAvatarId,
      };

      const teacherProfile: UserProfile = user || {
        id: 'teacher-demo-01',
        displayName: 'Miss Lalrintluangi',
        nickname: 'Miss Lalrin',
        role: 'teacher',
        schoolName: 'Govt. Mizo High School, Aizawl',
        avatar: '🍎',
        streakDays: 14,
        longestStreak: 14,
        points: 3450,
        totalLearningMinutes: 420,
        createdAt: new Date().toISOString(),
        isGuest: false,
      };

      const result = await createStudentAccount(req, teacherProfile);
      setCredsData(result);

      // Add to local student state
      const newStudentUser: UserProfile = {
        id: result.studentId,
        displayName: result.displayName,
        username: result.username,
        nickname: result.displayName.split(' ')[0],
        role: 'student',
        classroomId: result.classroomId,
        classroomName: result.classroomName,
        teacherId: teacherProfile.id,
        avatar: '🚀',
        avatarId: selectedAvatarId,
        streakDays: 0,
        longestStreak: 0,
        points: 0,
        totalLearningMinutes: 0,
        createdAt: result.createdAt,
        isGuest: false,
        temporaryPin: result.temporaryPin,
      };

      setStudents((prev) => [newStudentUser, ...prev]);
      setIsAddStudentModalOpen(false);
      setFormName('');
      setFormUsername('');
      setFormRollNo('');
      toast.success(`Account created for ${result.displayName}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create student account.');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const handleResetPin = async (student: UserProfile) => {
    try {
      const newPin = await resetStudentCredentials(student.id);
      toast.success(
        `PIN reset for ${student.displayName}! New PIN: ${newPin}`,
        { duration: 8000 }
      );
    } catch (err: any) {
      toast.error(err.message || 'Could not reset student PIN.');
    }
  };

  const handleCopySlip = () => {
    if (!credsData) return;
    const slip = `ZIRNA STEM STUDIO — STUDENT LOGIN SLIP\n------------------------------------\nStudent Name : ${credsData.displayName}\nUsername     : ${credsData.username}\nPIN Code     : ${credsData.temporaryPin}\nClassroom    : ${credsData.classroomName}\nPortal URL   : ${window.location.origin}/#auth\n------------------------------------\nKeep this slip safe! Zero email required.`;
    navigator.clipboard.writeText(slip);
    setCopiedSlip(true);
    toast.success('Login slip copied to clipboard!');
    setTimeout(() => setCopiedSlip(false), 2000);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.displayName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (s.username && s.username.toLowerCase().includes(searchStudent.toLowerCase()))
  );

  return (
    <div className="space-y-10 py-6 sm:py-8 font-sans">
      {/* ============================================================
          1. EDUCATOR WELCOME & STATUS HEADER
      ============================================================ */}
      <section className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 brutal-shadow-sm relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Educator Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#06D6A0] border-3 border-black flex items-center justify-center text-3xl sm:text-4xl shadow-[3px_3px_0px_#000]">
                🍎
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#06D6A0] border-2 border-black flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#06D6A0]/20 border border-[#06D6A0] text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  ACCREDITED EDUCATOR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-mono">
                  MBSE CURRICULUM COHORT
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-sans">
                Good morning, {teacherName}!
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 flex items-center gap-2">
                <School className="w-4 h-4 text-slate-500" />
                <span>{schoolName}</span>
                <span className="text-slate-300">•</span>
                <span>Your classrooms are ready for today's learning activities.</span>
              </p>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="px-4 py-2.5 bg-[#FFD166] hover:bg-[#ffc947] text-black font-mono font-bold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Student (Zero Email)</span>
            </button>
            <button
              onClick={() => onNavigateTeacherDashboard('sessions')}
              className="px-4 py-2.5 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-mono font-bold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ Start Live Session</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. CLASSROOM OVERVIEW METRICS (4 Neo-Brutalist Metric Cards)
      ============================================================ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Classrooms */}
        <div className="bg-[#FFFDF5] border-3 border-black rounded-xl p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              My Classrooms
            </span>
            <School className="w-4 h-4 text-black" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">3</span>
            <span className="text-xs font-bold text-emerald-700 font-mono">Cohorts Active</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            Class 6-A, Class 6-B & Class 7-A
          </p>
        </div>

        {/* Metric 2: Total Registered Students */}
        <div className="bg-[#FFFDF5] border-3 border-black rounded-xl p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Registered Students
            </span>
            <Users className="w-4 h-4 text-[#118AB2]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">
              {students.length > 0 ? students.length : 76}
            </span>
            <span className="text-xs font-bold text-blue-700 font-mono">Zero-Email Accounts</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            100% teacher-supervised & PIN-secured
          </p>
        </div>

        {/* Metric 3: Active Live Sessions */}
        <div className="bg-[#FFFDF5] border-3 border-black rounded-xl p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Live STEM Sessions
            </span>
            <Flame className="w-4 h-4 text-[#EF476F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">
              {activeSession ? '1' : '0'}
            </span>
            <span className="text-xs font-bold text-rose-600 font-mono animate-pulse">
              {activeSession ? 'Battle in Progress' : 'Ready to Launch'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            {activeSession ? `Join Code: ${activeSession.code}` : 'No active classroom room'}
          </p>
        </div>

        {/* Metric 4: Pending Assignments */}
        <div className="bg-[#FFFDF5] border-3 border-black rounded-xl p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Assignments Active
            </span>
            <Award className="w-4 h-4 text-[#FFD166]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black font-mono">2</span>
            <span className="text-xs font-bold text-amber-700 font-mono">35 Submissions</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">
            Equivalent Fractions & Ray Tracing
          </p>
        </div>
      </section>

      {/* ============================================================
          3. ACTIVE CLASSROOM LIVE BATTLE MONITOR (Prominent Banner)
      ============================================================ */}
      {activeSession ? (
        <section className="bg-gradient-to-r from-[#FFD166]/20 via-[#06D6A0]/15 to-[#38BDF8]/20 border-3 border-black rounded-2xl p-6 brutal-shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF476F] inline-block animate-ping" />
                <span className="px-2.5 py-0.5 rounded-full bg-[#EF476F] text-white text-[11px] font-mono font-black uppercase tracking-wider">
                  LIVE MULTIPLAYER SESSION
                </span>
                <span className="px-2 py-0.5 rounded bg-black text-white font-mono text-xs font-black">
                  CODE: {activeSession.code}
                </span>
              </div>
              <h3 className="text-xl font-black text-black font-sans">
                {activeSession.title}
              </h3>
              <p className="text-xs font-medium text-slate-700 flex items-center gap-4">
                <span>Class 6-A</span>
                <span>•</span>
                <span>18 Students Enrolled</span>
                <span>•</span>
                <span>14 Active in Arena</span>
                <span>•</span>
                <span>2 Teams Competing</span>
              </p>
            </div>

            {/* Live Scoreboard Preview */}
            <div className="flex items-center gap-4 bg-white/90 border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000]">
              <div className="text-center px-3 border-r border-black/20">
                <div className="text-[10px] font-mono font-bold text-rose-700 uppercase">Red Strikers</div>
                <div className="text-lg font-black font-mono text-black">450 pts</div>
              </div>
              <div className="text-center px-3">
                <div className="text-[10px] font-mono font-bold text-blue-700 uppercase">Blue Comets</div>
                <div className="text-lg font-black font-mono text-black">410 pts</div>
              </div>
              <button
                onClick={onNavigateClassroom}
                className="px-4 py-2 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-mono font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5"
              >
                <span>Enter Live Arena</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================
          4. MY CLASSROOMS (Grid Cards & Cohort Management)
      ============================================================ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black font-sans flex items-center gap-2">
              <School className="w-6 h-6 text-black" />
              <span>My Classrooms</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Organize grades, student cohorts and squad battle teams
            </p>
          </div>
          <button
            onClick={() => onNavigateTeacherDashboard('classrooms')}
            className="self-start sm:self-auto px-3.5 py-1.5 bg-white hover:bg-slate-100 text-black font-mono font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Classroom</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Classroom 1 */}
          <div className="bg-white border-3 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-[#FFD166] border border-black font-mono font-bold text-[11px] text-black">
                  Class 6
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#06D6A0] inline-block" />
                  Active Cohort
                </span>
              </div>
              <h3 className="text-lg font-black text-black">Class 6-A — Fractions & Decimals</h3>
              <p className="text-xs text-slate-600 mt-1">
                MBSE Chapter 3 & 4. Primary classroom cohort.
              </p>
              <div className="mt-4 pt-4 border-t border-black/10 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">STUDENTS</span>
                  <span className="font-bold text-black">28 Enrolled</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SQUADS</span>
                  <span className="font-bold text-black">2 Teams</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 flex items-center justify-between">
              <button
                onClick={() => onNavigateTeacherDashboard('students')}
                className="text-xs font-mono font-bold text-black hover:text-[#06D6A0] flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Classroom</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateClassroom()}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#FFD166] border border-black cursor-pointer"
                title="Launch Classroom Battle"
              >
                <Zap className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Classroom 2 */}
          <div className="bg-white border-3 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-[#C4B5FD] border border-black font-mono font-bold text-[11px] text-black">
                  Class 6
                </span>
                <span className="text-[11px] font-mono text-slate-600 font-bold">
                  Last Active: Yesterday
                </span>
              </div>
              <h3 className="text-lg font-black text-black">Class 6-B — Geometry & Symmetry</h3>
              <p className="text-xs text-slate-600 mt-1">
                Rotational symmetry, mirror reflection and shapes.
              </p>
              <div className="mt-4 pt-4 border-t border-black/10 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">STUDENTS</span>
                  <span className="font-bold text-black">24 Enrolled</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SQUADS</span>
                  <span className="font-bold text-black">2 Teams</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 flex items-center justify-between">
              <button
                onClick={() => onNavigateTeacherDashboard('students')}
                className="text-xs font-mono font-bold text-black hover:text-[#06D6A0] flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Classroom</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateClassroom()}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#FFD166] border border-black cursor-pointer"
                title="Launch Classroom Battle"
              >
                <Zap className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Classroom 3 */}
          <div className="bg-white border-3 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-[#38BDF8] border border-black font-mono font-bold text-[11px] text-black">
                  Class 7
                </span>
                <span className="text-[11px] font-mono text-slate-600 font-bold">
                  Last Active: 2h ago
                </span>
              </div>
              <h3 className="text-lg font-black text-black">Class 7-A — Optics & Ray Tracing</h3>
              <p className="text-xs text-slate-600 mt-1">
                Snell's Law, concave mirrors, refraction simulations.
              </p>
              <div className="mt-4 pt-4 border-t border-black/10 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">STUDENTS</span>
                  <span className="font-bold text-black">24 Enrolled</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SQUADS</span>
                  <span className="font-bold text-black">2 Teams</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 flex items-center justify-between">
              <button
                onClick={() => onNavigateTeacherDashboard('students')}
                className="text-xs font-mono font-bold text-black hover:text-[#06D6A0] flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Classroom</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateClassroom()}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#FFD166] border border-black cursor-pointer"
                title="Launch Classroom Battle"
              >
                <Zap className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. MY STUDENTS (Roster Quick View & Zero-Email Provisioning)
      ============================================================ */}
      <section className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 brutal-shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black font-sans flex items-center gap-2">
              <Users className="w-6 h-6 text-black" />
              <span>My Students (Class 6-A Roster)</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Zero-email student accounts provisioned by teacher with 4-digit PIN access
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or username..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs font-mono border-2 border-black rounded-lg focus:outline-none focus:bg-amber-50 w-48 sm:w-60"
              />
            </div>
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#FFD166] hover:bg-[#ffc947] text-black font-mono font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Student</span>
            </button>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.slice(0, 6).map((student) => {
            const avatar = getAvatarById(student.avatarId);
            return (
              <div
                key={student.id}
                className="bg-[#FFFDF5] border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_#000] flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-2xl shadow-xs shrink-0">
                    {avatar?.emoji || student.avatar || '🚀'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-black truncate">
                      {student.displayName}
                    </h4>
                    <p className="text-xs font-mono text-slate-600 font-medium truncate">
                      @{student.username || student.id}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 border border-slate-300 font-bold">
                        {student.classroomName || 'Class 6-A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => handleResetPin(student)}
                    className="text-[11px] font-bold text-slate-700 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset PIN</span>
                  </button>
                  <button
                    onClick={() => {
                      const slip = `ZIRNA CREDENTIALS\nName: ${student.displayName}\nUsername: ${student.username || student.id}\nClassroom: ${student.classroomName || 'Class 6-A'}`;
                      navigator.clipboard.writeText(slip);
                      toast.success(`Copied login info for ${student.displayName}`);
                    }}
                    className="text-[11px] font-bold text-slate-700 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>Copy Slip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">
            Showing top {Math.min(6, filteredStudents.length)} of {students.length} students
          </span>
          <button
            onClick={() => onNavigateTeacherDashboard('students')}
            className="font-bold text-black hover:text-[#06D6A0] flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Student Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ============================================================
          6. ASSIGNMENTS & TEACHING INSIGHTS (Two-column Grid)
      ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Assignments & Activities */}
        <section className="bg-white border-3 border-black rounded-2xl p-6 brutal-shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div>
              <h3 className="text-lg font-black text-black font-sans flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-black" />
                <span>Active Assignments</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Track homework progress across STEM modules
              </p>
            </div>
            <button
              onClick={() => toast.info('Assignment creator dialog')}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-black font-mono font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              + Create
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#FFFDF5] border-2 border-black rounded-xl">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="px-1.5 py-0.5 rounded bg-[#FFD166] border border-black font-bold">
                  Fraction Zirna Playground
                </span>
                <span className="text-slate-600 font-bold">Due Friday</span>
              </div>
              <h4 className="font-black text-sm text-black">
                MBSE Chapter 3 — Equivalent Fractions & Mixed Slices
              </h4>
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-600">
                <span>Submissions: 21 / 28 students</span>
                <span className="font-bold text-emerald-700">75% Completion</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-1 overflow-hidden border border-black/20">
                <div className="bg-[#06D6A0] h-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="p-3.5 bg-[#FFFDF5] border-2 border-black rounded-xl">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="px-1.5 py-0.5 rounded bg-[#38BDF8] border border-black font-bold">
                  Ray Tracing Optics Lab
                </span>
                <span className="text-slate-600 font-bold">Due Monday</span>
              </div>
              <h4 className="font-black text-sm text-black">
                Concave Lens Divergence & Focal Point Finding
              </h4>
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-600">
                <span>Submissions: 14 / 28 students</span>
                <span className="font-bold text-amber-700">50% Completion</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-1 overflow-hidden border border-black/20">
                <div className="bg-[#38BDF8] h-full" style={{ width: '50%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Teaching Insights & Diagnostic Analytics */}
        <section className="bg-white border-3 border-black rounded-2xl p-6 brutal-shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div>
              <h3 className="text-lg font-black text-black font-sans flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-black" />
                <span>Classroom Diagnostic Insights</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Aggregated concept mastery & areas needing review
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold">
              UPDATED TODAY
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-emerald-900 block font-sans text-sm">
                  Strong Mastery: Simplifying Fractions (84% Class Average)
                </span>
                <p className="text-emerald-800 text-xs mt-0.5 font-sans">
                  Students understand dividing numerator and denominator by common factors effortlessly.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border-2 border-amber-600 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-amber-900 block font-sans text-sm">
                  Review Recommended: Lens Focal Distance Inversion (42% Struggle Rate)
                </span>
                <p className="text-amber-800 text-xs mt-0.5 font-sans">
                  Students in Class 7-A confuse virtual focus with real focal points in ray tracing.
                </p>
                <button
                  onClick={() => onSelectModule('optics-lab')}
                  className="mt-2 px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-black font-bold text-[11px] rounded border border-black cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Launch Optics Demo in Class</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-2 border-slate-300 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-black block">Weekly Engagement Rate</span>
                <span className="text-slate-500 text-[11px]">Active participation in STEM modules</span>
              </div>
              <span className="text-lg font-black text-black">92%</span>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          7. ADD STUDENT MODAL (Zero Email Provisioning)
      ============================================================ */}
      <AnimatePresence>
        {isAddStudentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 max-w-lg w-full brutal-shadow-lg relative"
            >
              <div className="flex items-center justify-between border-b-2 border-black/10 pb-4 mb-5">
                <div>
                  <h3 className="text-xl font-black text-black font-sans">
                    + Provision Student Account
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 font-mono">
                    Zero-email, child-safe school credentials
                  </p>
                </div>
                <button
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="p-1 rounded-lg border-2 border-black hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateStudentSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lalhmingmawii Sailo"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg focus:bg-amber-50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. hmingi.class06"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-black rounded-lg focus:bg-amber-50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Classroom Cohort
                    </label>
                    <select
                      value={formClassroom}
                      onChange={(e) => setFormClassroom(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-black rounded-lg bg-white focus:outline-none"
                    >
                      <option value="cls-6a">Class 6-A</option>
                      <option value="cls-6b">Class 6-B</option>
                      <option value="cls-7a">Class 7-A</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Select Pixel Art Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-2 border-2 border-black/10 rounded-lg">
                    {AVATAR_LIBRARY.slice(0, 12).map((av) => (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setSelectedAvatarId(av.id)}
                        className={`p-2 rounded-lg border-2 text-xl flex items-center justify-center cursor-pointer transition-all ${
                          selectedAvatarId === av.id
                            ? 'border-black bg-[#FFD166] scale-105 shadow-[2px_2px_0px_#000]'
                            : 'border-transparent hover:bg-slate-100'
                        }`}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="px-4 py-2 border-2 border-black rounded-lg hover:bg-slate-100 cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingStudent}
                    className="px-5 py-2 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    {isSubmittingStudent ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          8. GENERATED CREDENTIALS PRINT/COPY SLIP MODAL
      ============================================================ */}
      <AnimatePresence>
        {credsData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 max-w-md w-full brutal-shadow-lg relative font-mono"
            >
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#06D6A0] border-2 border-black mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  🎉
                </div>
                <h3 className="text-xl font-black text-black font-sans">
                  Account Created Successfully!
                </h3>
                <p className="text-xs text-slate-600">
                  Provide this credential slip to the student for PIN sign-in.
                </p>
              </div>

              {/* Physical Slip Style Card */}
              <div className="p-5 bg-amber-50 border-2 border-dashed border-black rounded-xl space-y-3 relative">
                <div className="flex items-center justify-between pb-2 border-b border-black/20">
                  <span className="font-bold text-black text-xs">ZIRNA LOGIN SLIP</span>
                  <span className="text-[10px] text-slate-500">ZERO EMAIL</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Student Name:</span>
                    <span className="font-bold text-black">{credsData.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Username:</span>
                    <span className="font-bold text-black">@{credsData.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Temporary PIN:</span>
                    <span className="font-black text-rose-600 text-sm">{credsData.temporaryPin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cohort:</span>
                    <span className="font-bold text-black">{credsData.classroomName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleCopySlip}
                  className="flex-1 py-2.5 bg-[#FFD166] hover:bg-[#ffc947] text-black font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedSlip ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSlip ? 'Copied Slip!' : 'Copy Login Slip'}</span>
                </button>
                <button
                  onClick={() => setCredsData(null)}
                  className="px-5 py-2.5 bg-black text-white font-black text-xs rounded-xl border-2 border-black hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
