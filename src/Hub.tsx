import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LegalViewId } from './types/legal';
import { useAuth } from './features/auth/AuthContext';
import { SiteFooter } from './components/common/SiteFooter';

// Navigation Components (Role-Based)
import { PublicNavigation } from './features/navigation/PublicNavigation';
import { StudentNavigation } from './features/navigation/StudentNavigation';
import { TeacherNavigation } from './features/navigation/TeacherNavigation';
import { AdminNavigation } from './features/navigation/AdminNavigation';

// Footer Components (Role-Based)
import { StudentFooter } from './features/footer/StudentFooter';
import { TeacherFooter } from './features/footer/TeacherFooter';
import { AdminFooter } from './features/footer/AdminFooter';

// Hub Pages (Role-Based)
import { PublicHub, FilterCategory } from './features/hub/pages/PublicHub';
import { StudentHub } from './features/hub/pages/StudentHub';
import { TeacherHub } from './features/hub/pages/TeacherHub';
import { AdminHub } from './features/hub/pages/AdminHub';

interface HubProps {
  onSelectModule: (id: string) => void;
  onOpenCommandPalette: () => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
  onOpenStoragePreferences: () => void;
  onNavigateDashboard: () => void;
  onNavigateClassroom: () => void;
  onNavigateTeacher: () => void;
}

export const Hub: React.FC<HubProps> = ({
  onSelectModule,
  onOpenCommandPalette,
  onNavigateLegal,
  onOpenStoragePreferences,
  onNavigateDashboard,
  onNavigateClassroom,
  onNavigateTeacher,
}) => {
  const { user, isTeacher, isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');

  // Smooth scroll with sticky navbar offset (-75px)
  const scrollToSection = useCallback((elementId: string, category?: FilterCategory) => {
    if (category) {
      setSelectedCategory(category);
    }
    const el = document.getElementById(elementId);
    if (el) {
      const yOffset = -75;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  // ============================================================
  // SCENARIO 1: ADMINISTRATOR WORKSPACE
  // ============================================================
  if (user && (isAdmin || user.role === 'admin')) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] text-slate-900 selection:bg-[#FFD166] selection:text-black font-sans flex flex-col justify-between">
        <div>
          {/* Tactical Dark Admin Navigation */}
          <AdminNavigation
            activeTab="overview"
            onSelectTab={(tabId) => {
              window.location.hash = 'admin/dashboard';
            }}
            onExitToHub={() => {
              window.location.hash = '';
            }}
          />

          {/* Admin Platform Overview Hub */}
          <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
            <AdminHub
              onNavigateTab={(tabId) => {
                window.location.hash = 'admin/dashboard';
              }}
              onOpenStoragePreferences={onOpenStoragePreferences}
              onSelectModule={onSelectModule}
            />
          </main>
        </div>

        {/* Minimal Platform Governance Footer */}
        <AdminFooter onNavigateLegal={onNavigateLegal} />
      </div>
    );
  }

  // ============================================================
  // SCENARIO 2: TEACHER / EDUCATOR WORKSPACE
  // ============================================================
  if (user && (isTeacher || user.role === 'teacher')) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] text-slate-900 selection:bg-[#FFD166] selection:text-black font-sans flex flex-col justify-between">
        <div>
          {/* Dedicated Teacher Navigation */}
          <TeacherNavigation
            activeSection="home"
            onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onNavigateClassrooms={() => onNavigateTeacher()}
            onNavigateStudents={() => onNavigateTeacher()}
            onNavigateAssignments={() => onNavigateTeacher()}
            onNavigateDashboard={() => onNavigateTeacher()}
            onOpenStoragePreferences={onOpenStoragePreferences}
          />

          {/* Teacher Hub Management Workspace */}
          <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
            <TeacherHub
              onSelectModule={onSelectModule}
              onNavigateClassroom={onNavigateClassroom}
              onNavigateTeacherDashboard={(tab) => onNavigateTeacher()}
              onOpenStoragePreferences={onOpenStoragePreferences}
            />
          </main>
        </div>

        {/* Tailored Educator Footer */}
        <TeacherFooter
          onNavigateDashboard={onNavigateTeacher}
          onNavigateClassrooms={onNavigateTeacher}
          onNavigateStudents={onNavigateTeacher}
          onNavigateAssignments={onNavigateTeacher}
          onNavigateLegal={onNavigateLegal}
          onOpenStoragePreferences={onOpenStoragePreferences}
        />
      </div>
    );
  }

  // ============================================================
  // SCENARIO 3: STUDENT / LEARNER WORKSPACE
  // ============================================================
  if (user && user.role === 'student') {
    return (
      <div className="min-h-screen bg-[#F5F5F0] text-slate-900 selection:bg-[#FFD166] selection:text-black font-sans flex flex-col justify-between">
        <div>
          {/* Child-Friendly Student Workspace Navigation */}
          <StudentNavigation
            activeSection="home"
            onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onNavigateLearning={() => scrollToSection('continue-learning')}
            onNavigateClassroom={onNavigateClassroom}
            onNavigateAchievements={() => scrollToSection('my-achievements')}
            onOpenStoragePreferences={onOpenStoragePreferences}
          />

          {/* Personalized Student Hub Companion */}
          <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
            <StudentHub
              onSelectModule={onSelectModule}
              onNavigateClassroom={onNavigateClassroom}
              onNavigateAchievements={() => scrollToSection('my-achievements')}
              onOpenStoragePreferences={onOpenStoragePreferences}
            />
          </main>
        </div>

        {/* Child-Safe Educational Student Footer */}
        <StudentFooter
          onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onNavigateLearning={() => scrollToSection('continue-learning')}
          onNavigateClassroom={onNavigateClassroom}
          onNavigateAchievements={() => scrollToSection('my-achievements')}
          onNavigateLegal={onNavigateLegal}
          onOpenStoragePreferences={onOpenStoragePreferences}
        />
      </div>
    );
  }

  // ============================================================
  // SCENARIO 4: PUBLIC / GUEST EXPERIENCE
  // ============================================================
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 selection:bg-[#FFD166] selection:text-black font-sans pb-16">
      {/* Clean Public Navigation with single Sign In CTA */}
      <PublicNavigation
        onSelectModule={onSelectModule}
        onNavigateLegal={onNavigateLegal}
        scrollToSection={scrollToSection}
      />

      {/* Public Marketing & Curriculum Exploration Hub */}
      <PublicHub
        onSelectModule={onSelectModule}
        onNavigateLegal={onNavigateLegal}
        onOpenStoragePreferences={onOpenStoragePreferences}
        onNavigateClassroom={onNavigateClassroom}
        onNavigateTeacher={onNavigateTeacher}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        scrollToSection={scrollToSection}
      />

      {/* Comprehensive Public Site Footer */}
      <SiteFooter
        onSelectModule={onSelectModule}
        onNavigateLegal={onNavigateLegal}
        onOpenStoragePreferences={onOpenStoragePreferences}
      />
    </div>
  );
};
