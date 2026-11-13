import React from 'react';
import { LegalViewId } from '../../types/legal';
import { School, BookOpen, GraduationCap, Scale, ShieldCheck } from 'lucide-react';

interface TeacherFooterProps {
  onNavigateDashboard: () => void;
  onNavigateClassrooms: () => void;
  onNavigateStudents: () => void;
  onNavigateAssignments: () => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
  onOpenStoragePreferences: () => void;
}

export const TeacherFooter: React.FC<TeacherFooterProps> = ({
  onNavigateDashboard,
  onNavigateClassrooms,
  onNavigateStudents,
  onNavigateAssignments,
  onNavigateLegal,
  onOpenStoragePreferences,
}) => {
  return (
    <footer className="bg-[#0b1a30] text-slate-300 border-t-3 border-black pt-10 pb-8 px-4 sm:px-8 font-sans select-none text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
        {/* Col 1: ZIRNA STEM STUDIO */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center gap-2 text-white font-black text-base">
            <span className="w-6 h-6 rounded bg-[#06D6A0] text-black font-black flex items-center justify-center text-xs border border-black shadow-[1px_1px_0px_#000]">
              MEC
            </span>
            <span>ZIRNA STEM STUDIO</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Collaborative STEM classroom management and multiplayer educational simulations aligned with MBSE/NCERT syllabi.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Certified Educator Workspace • Zero student surveillance</span>
          </div>
        </div>

        {/* Col 2: Teaching */}
        <div className="space-y-2 font-mono">
          <h4 className="font-bold text-white uppercase text-xs mb-2 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-[#06D6A0]" />
            <span>Teaching & Classes</span>
          </h4>
          <div>
            <button
              onClick={onNavigateDashboard}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Teacher Command Dashboard
            </button>
          </div>
          <div>
            <button
              onClick={onNavigateClassrooms}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Manage Classrooms & Rosters
            </button>
          </div>
          <div>
            <button
              onClick={onNavigateStudents}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Student Account Provisioning
            </button>
          </div>
          <div>
            <button
              onClick={onNavigateAssignments}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Assignments & Reports
            </button>
          </div>
        </div>

        {/* Col 3: Support & Information */}
        <div className="space-y-2 font-mono">
          <h4 className="font-bold text-white uppercase text-xs mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Support & Documentation</span>
          </h4>
          <div>
            <button
              onClick={() => onNavigateLegal('about')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Curriculum & Alignment
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('accessibility')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Accessibility Standards
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('contact')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Educator Help & Support Desk
            </button>
          </div>
        </div>

        {/* Col 4: Privacy & Legal */}
        <div className="space-y-2 font-mono">
          <h4 className="font-bold text-white uppercase text-xs mb-2 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span>Privacy & Legal</span>
          </h4>
          <div>
            <button
              onClick={() => onNavigateLegal('privacy')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Privacy Policy
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('terms')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Terms of Service
            </button>
          </div>
          <div>
            <button
              onClick={onOpenStoragePreferences}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Storage & Cookie Preferences
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('data-deletion')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Student Data Rights & Deletion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500 text-center sm:text-left">
        <div>© 2026 ZIRNA STEM STUDIO • Directorate of School Education, Govt. of Mizoram</div>
        <div className="text-slate-400">
          MBSE Grade 6-8 Certified Educational Platform
        </div>
      </div>
    </footer>
  );
};
