import React from 'react';
import { LegalViewId } from '../../types/legal';
import { ShieldCheck, BookOpen, GraduationCap, Scale, Heart } from 'lucide-react';

interface StudentFooterProps {
  onNavigateHome: () => void;
  onNavigateLearning: () => void;
  onNavigateClassroom: () => void;
  onNavigateAchievements: () => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
  onOpenStoragePreferences: () => void;
}

export const StudentFooter: React.FC<StudentFooterProps> = ({
  onNavigateHome,
  onNavigateLearning,
  onNavigateClassroom,
  onNavigateAchievements,
  onNavigateLegal,
  onOpenStoragePreferences,
}) => {
  return (
    <footer className="bg-[#0b1a30] text-slate-300 border-t-3 border-black pt-10 pb-8 px-4 sm:px-8 font-sans select-none text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
        {/* Col 1: ZIRNA STEM STUDIO */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center gap-2 text-white font-black text-base">
            <span className="w-6 h-6 rounded bg-[#FFD166] text-black font-black flex items-center justify-center text-xs border border-black shadow-[1px_1px_0px_#000]">
              Z
            </span>
            <span>ZIRNA STEM STUDIO</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Open educational STEM learning companion for school learners. Interactive physics, optics, geometry, and mathematics.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero trackers • No email required for students</span>
          </div>
        </div>

        {/* Col 2: My Learning */}
        <div className="space-y-2 font-mono">
          <h4 className="font-bold text-white uppercase text-xs mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#FFD166]" />
            <span>My Learning</span>
          </h4>
          <div>
            <button
              onClick={onNavigateHome}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Student Home Overview
            </button>
          </div>
          <div>
            <button
              onClick={onNavigateLearning}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              My Courses & Pathways
            </button>
          </div>
          <div>
            <button
              onClick={onNavigateAchievements}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Achievements & Badges
            </button>
          </div>
          <div>
            <button
              onClick={onNavigateClassroom}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              My Classroom Arena
            </button>
          </div>
        </div>

        {/* Col 3: Support & Information */}
        <div className="space-y-2 font-mono">
          <h4 className="font-bold text-white uppercase text-xs mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Support & Information</span>
          </h4>
          <div>
            <button
              onClick={() => onNavigateLegal('about')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              About the Platform
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('accessibility')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Accessibility Statement
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('contact')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Help & Contact Support
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
              Cookie & Storage Settings
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateLegal('data-deletion')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left py-0.5"
            >
              Data Protection & Rights
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500 text-center sm:text-left">
        <div>© 2026 ZIRNA STEM STUDIO • Directorate of School Education, Govt. of Mizoram</div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Made for learners in Mizoram with</span>
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" />
        </div>
      </div>
    </footer>
  );
};
