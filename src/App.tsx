import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hub } from './Hub';
import { NavigationDock } from './components/NavigationDock';
import { ModuleWrapper } from './components/ModuleWrapper';
import { CommandPalette } from './components/CommandPalette';
import { MODULES_REGISTRY, ModuleInfo } from './data/modulesRegistry';
import { LegalViewId } from './types/legal';

// Legal & Governance Views
import { PrivacyPolicyView } from './components/legal/PrivacyPolicyView';
import { TermsOfServiceView } from './components/legal/TermsOfServiceView';
import { RefundPolicyView } from './components/legal/RefundPolicyView';
import { CookiePolicyView } from './components/legal/CookiePolicyView';
import { AccessibilityStatementView } from './components/legal/AccessibilityStatementView';
import { AboutView } from './components/legal/AboutView';
import { ContactView } from './components/legal/ContactView';
import { DataDeletionView } from './components/legal/DataDeletionView';
import { CookieConsentBanner } from './components/legal/CookieConsentBanner';
import { StoragePreferencesModal } from './components/legal/StoragePreferencesModal';

// Auth & Dashboard & Classroom Views
import { useAuth } from './features/auth/AuthContext';
import { AuthModal } from './features/auth/components/AuthModal';
import { AuthPageView } from './features/auth/components/AuthPageView';
import { ProfileCustomizationModal } from './features/auth/components/ProfileCustomizationModal';
import { GuestLimitModal } from './features/guest/components/GuestLimitModal';
import {
  getGuestChallengesTodayCount,
  getGuestChallengeLimit,
  isGuestLimitReached,
} from './features/guest/guestAccessService';
import { StudentDashboard } from './features/dashboard/components/StudentDashboard';
import { TeacherDashboard } from './features/dashboard/components/TeacherDashboard';
import { ClassroomArenaView } from './features/classroom/components/ClassroomArenaView';
import { AdminLoginView } from './features/admin/components/AdminLoginView';
import { AdminDashboardLayout } from './features/admin/components/AdminDashboardLayout';
import { toast } from 'sonner';

// Lazy load each module for optimal performance
const FractionZirnaApp = lazy(() => import('./modules/fraction-zirna/App'));
const FractionGridApp = lazy(() => import('./modules/fraction-grid/App'));
const SymmetryApp = lazy(() => import('./modules/symmetry-match/App'));
const AbacusApp = lazy(() => import('./modules/abacus-math/App'));
const CoordinateDefenseApp = lazy(() => import('./modules/coordinate-defense/App'));
const OpticsLabApp = lazy(() => import('./modules/optics-lab/App'));
const NumberLineCruiserApp = lazy(() => import('./modules/number-line-cruiser/App'));

const MODULE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'fraction-zirna': FractionZirnaApp,
  'fraction-grid': FractionGridApp,
  'symmetry-match': SymmetryApp,
  'abacus-math': AbacusApp,
  'coordinate-defense': CoordinateDefenseApp,
  'optics-lab': OpticsLabApp,
  'number-line-cruiser': NumberLineCruiserApp,
};

const LEGAL_ROUTES: Record<string, LegalViewId> = {
  privacy: 'privacy',
  terms: 'terms',
  refund: 'refund',
  cookies: 'cookies',
  accessibility: 'accessibility',
  about: 'about',
  contact: 'contact',
  'data-deletion': 'data-deletion',
};

type SpecialView = 'dashboard' | 'classroom' | 'teacher' | 'admin' | 'admin/login' | 'admin/dashboard' | 'auth' | null;

export default function App() {
  const {
    user,
    isTeacher,
    isAdmin,
    openAuthModal,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isFirstLoginModalOpen,
    setIsFirstLoginModalOpen,
  } = useAuth();

  const getInitialRoute = (): {
    moduleId: string | null;
    legalId: LegalViewId | null;
    specialView: SpecialView;
  } => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (rawHash === 'auth' || rawHash === 'login' || rawHash === 'signin') {
      return { moduleId: null, legalId: null, specialView: 'auth' };
    }
    if (rawHash === 'admin/login' || rawHash === 'admin-login') {
      return { moduleId: null, legalId: null, specialView: 'admin/login' };
    }
    if (rawHash === 'admin' || rawHash === 'admin/dashboard' || rawHash === 'admin-dashboard') {
      return { moduleId: null, legalId: null, specialView: 'admin/dashboard' };
    }
    if (rawHash === 'dashboard' || rawHash === 'classroom' || rawHash === 'teacher') {
      return { moduleId: null, legalId: null, specialView: rawHash as SpecialView };
    }
    if (rawHash && LEGAL_ROUTES[rawHash]) {
      return { moduleId: null, legalId: LEGAL_ROUTES[rawHash], specialView: null };
    }
    if (rawHash && MODULES_REGISTRY.some((m) => m.id === rawHash)) {
      return { moduleId: rawHash, legalId: null, specialView: null };
    }
    return { moduleId: null, legalId: null, specialView: null };
  };

  const initial = getInitialRoute();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(initial.moduleId);
  const [activeLegalView, setActiveLegalView] = useState<LegalViewId | null>(initial.legalId);
  const [activeSpecialView, setActiveSpecialView] = useState<SpecialView>(initial.specialView);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isGuestLimitModalOpen, setIsGuestLimitModalOpen] = useState(false);

  // Sync hash with active view
  useEffect(() => {
    if (activeSpecialView) {
      window.location.hash = activeSpecialView;
    } else if (activeLegalView) {
      window.location.hash = activeLegalView;
    } else if (activeModuleId) {
      window.location.hash = activeModuleId;
    } else {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, [activeModuleId, activeLegalView, activeSpecialView]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'auth' || hash === 'login' || hash === 'signin') {
        setActiveSpecialView('auth');
        setActiveModuleId(null);
        setActiveLegalView(null);
      } else if (hash === 'admin/login' || hash === 'admin-login') {
        setActiveSpecialView('admin/login');
        setActiveModuleId(null);
        setActiveLegalView(null);
      } else if (hash === 'admin' || hash === 'admin/dashboard' || hash === 'admin-dashboard') {
        setActiveSpecialView('admin/dashboard');
        setActiveModuleId(null);
        setActiveLegalView(null);
      } else if (hash === 'dashboard' || hash === 'classroom' || hash === 'teacher') {
        setActiveSpecialView(hash as SpecialView);
        setActiveModuleId(null);
        setActiveLegalView(null);
      } else if (hash && LEGAL_ROUTES[hash]) {
        setActiveLegalView(LEGAL_ROUTES[hash]);
        setActiveSpecialView(null);
        setActiveModuleId(null);
      } else if (hash && MODULES_REGISTRY.some((m) => m.id === hash)) {
        setActiveModuleId(hash);
        setActiveLegalView(null);
        setActiveSpecialView(null);
      } else {
        setActiveModuleId(null);
        setActiveLegalView(null);
        setActiveSpecialView(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen for guest challenge limit triggers
  useEffect(() => {
    const handleGuestCheck = () => {
      if (!user && isGuestLimitReached()) {
        setIsGuestLimitModalOpen(true);
      }
    };
    window.addEventListener('zirna_guest_challenge_complete', handleGuestCheck);
    return () => window.removeEventListener('zirna_guest_challenge_complete', handleGuestCheck);
  }, [user]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Escape') {
        if (isPreferencesOpen) {
          setIsPreferencesOpen(false);
          return;
        }
        if (activeSpecialView !== null) {
          setActiveSpecialView(null);
          toast.info('Returned to Hub Overview');
          return;
        }
        if (activeLegalView !== null) {
          setActiveLegalView(null);
          toast.info('Returned to Hub Overview');
          return;
        }
        if (activeModuleId !== null) {
          setActiveModuleId(null);
          toast.info('Returned to Hub Overview');
          return;
        }
      }

      if (!activeLegalView && !activeSpecialView && ['1', '2', '3', '4', '5', '6', '7'].includes(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const found = MODULES_REGISTRY.find((m) => m.shortcut === e.key);
        if (found) {
          setActiveModuleId(found.id);
          setActiveLegalView(null);
          setActiveSpecialView(null);
          toast.success(`Launched ${found.title}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModuleId, activeLegalView, activeSpecialView, isPreferencesOpen]);

  const handleNavigateLegal = (viewId: LegalViewId) => {
    setActiveLegalView(viewId);
    setActiveModuleId(null);
    setActiveSpecialView(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setActiveLegalView(null);
    setActiveModuleId(null);
    setActiveSpecialView(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    setActiveLegalView(null);
    setActiveSpecialView(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDashboard = () => {
    if (!user) {
      openAuthModal('sign-in');
      return;
    }
    setActiveSpecialView('dashboard');
    setActiveLegalView(null);
    setActiveModuleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateClassroom = () => {
    setActiveSpecialView('classroom');
    setActiveLegalView(null);
    setActiveModuleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTeacher = () => {
    setActiveSpecialView('teacher');
    setActiveLegalView(null);
    setActiveModuleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeModule = MODULES_REGISTRY.find((m) => m.id === activeModuleId) || null;
  const ActiveComponent = activeModuleId ? MODULE_COMPONENTS[activeModuleId] : null;

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 flex flex-col font-sans selection:bg-[#FFD166] selection:text-black">
      <AnimatePresence mode="wait">
        {/* Dedicated Split-Screen Authentication Experience (Part 6) */}
        {activeSpecialView === 'auth' ? (
          <motion.div
            key="auth-page-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <AuthPageView
              onSuccess={handleBackToHub}
              onBackToHub={handleBackToHub}
            />
          </motion.div>
        ) : activeSpecialView === 'admin/login' ? (
          <motion.div
            key="admin-login-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <AdminLoginView
              onSuccess={() => setActiveSpecialView('admin/dashboard')}
              onBackToHub={handleBackToHub}
            />
          </motion.div>
        ) : activeSpecialView === 'admin' || activeSpecialView === 'admin/dashboard' ? (
          <motion.div
            key="admin-dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            {isAdmin ? (
              <AdminDashboardLayout onBackToHub={handleBackToHub} />
            ) : (
              <AdminLoginView
                onSuccess={() => setActiveSpecialView('admin/dashboard')}
                onBackToHub={handleBackToHub}
              />
            )}
          </motion.div>
        ) : activeSpecialView === 'dashboard' ? (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            {isTeacher ? (
              <TeacherDashboard
                onSelectModule={handleSelectModule}
                onNavigateClassroom={handleNavigateClassroom}
                onBackToHub={handleBackToHub}
              />
            ) : (
              <StudentDashboard
                onSelectModule={handleSelectModule}
                onNavigateClassroom={handleNavigateClassroom}
                onBackToHub={handleBackToHub}
              />
            )}
          </motion.div>
        ) : activeSpecialView === 'classroom' ? (
          <motion.div
            key="classroom-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <ClassroomArenaView
              onSelectModule={handleSelectModule}
              onNavigateTeacherDashboard={handleNavigateTeacher}
              onBackToHub={handleBackToHub}
            />
          </motion.div>
        ) : activeSpecialView === 'teacher' ? (
          <motion.div
            key="teacher-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <TeacherDashboard
              onSelectModule={handleSelectModule}
              onNavigateClassroom={handleNavigateClassroom}
              onBackToHub={handleBackToHub}
            />
          </motion.div>
        ) : activeLegalView ? (
          /* State B: Legal & Compliance View Active */
          <motion.div
            key={activeLegalView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col"
          >
            {activeLegalView === 'privacy' && (
              <PrivacyPolicyView onNavigateLegal={handleNavigateLegal} onBackToHub={handleBackToHub} />
            )}
            {activeLegalView === 'terms' && (
              <TermsOfServiceView onNavigateLegal={handleNavigateLegal} onBackToHub={handleBackToHub} />
            )}
            {activeLegalView === 'refund' && (
              <RefundPolicyView onNavigateLegal={handleNavigateLegal} onBackToHub={handleBackToHub} />
            )}
            {activeLegalView === 'cookies' && (
              <CookiePolicyView
                onNavigateLegal={handleNavigateLegal}
                onBackToHub={handleBackToHub}
                onOpenPreferences={() => setIsPreferencesOpen(true)}
              />
            )}
            {activeLegalView === 'accessibility' && (
              <AccessibilityStatementView onNavigateLegal={handleNavigateLegal} onBackToHub={handleBackToHub} />
            )}
            {activeLegalView === 'about' && (
              <AboutView onNavigateLegal={handleNavigateLegal} onBackToHub={handleBackToHub} />
            )}
            {activeLegalView === 'contact' && (
              <ContactView onNavigateLegal={handleNavigateLegal} onBackToHub={handleBackToHub} />
            )}
            {activeLegalView === 'data-deletion' && (
              <DataDeletionView onNavigateLegal={handleNavigateLegal} onBackToHub={handleBackToHub} />
            )}
          </motion.div>
        ) : activeModuleId && activeModule && ActiveComponent ? (
          /* State C: Educational Module Active with Collaborative Overlay */
          <motion.div
            key={activeModuleId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex-1 flex flex-col"
          >
            <ModuleWrapper
              module={activeModule}
              onBackToHub={handleBackToHub}
              onSwitchModule={handleSelectModule}
              onNavigateLegal={handleNavigateLegal}
              onOpenStoragePreferences={() => setIsPreferencesOpen(true)}
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-black border-t-[#FFD166] rounded-full animate-spin" />
                      <div className="text-xs font-mono font-bold text-black">Opening {activeModule.title}...</div>
                    </div>
                  </div>
                }
              >
                <ActiveComponent />
              </Suspense>
            </ModuleWrapper>
          </motion.div>
        ) : (
          /* State D: Main Hub Overview */
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex-1"
          >
            <Hub
              onSelectModule={handleSelectModule}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onNavigateLegal={handleNavigateLegal}
              onOpenStoragePreferences={() => setIsPreferencesOpen(true)}
              onNavigateDashboard={handleNavigateDashboard}
              onNavigateClassroom={handleNavigateClassroom}
              onNavigateTeacher={handleNavigateTeacher}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Retro Tactical Navigation Dock */}
      {!activeLegalView && !activeSpecialView && (
        <NavigationDock
          activeModule={activeModuleId}
          onSelectModule={handleSelectModule}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      )}

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={handleSelectModule}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Profile & Pixel Avatar Customization Modal */}
      <ProfileCustomizationModal
        isOpen={isProfileModalOpen || isFirstLoginModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setIsFirstLoginModalOpen(false);
        }}
      />

      {/* Guest Exploration Limit Modal (Non-coercive reminder after daily limit) */}
      {isGuestLimitModalOpen && !user && (
        <GuestLimitModal
          completedCount={getGuestChallengesTodayCount()}
          limit={getGuestChallengeLimit()}
          onOpenSignIn={() => {
            setIsGuestLimitModalOpen(false);
            setActiveSpecialView('auth');
          }}
          onOpenSignUp={() => {
            setIsGuestLimitModalOpen(false);
            setActiveSpecialView('auth');
          }}
          onDismiss={() => setIsGuestLimitModalOpen(false)}
        />
      )}

      {/* Cookie / Browser Storage Consent Banner */}
      <CookieConsentBanner
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onNavigateLegal={handleNavigateLegal}
      />

      {/* Granular Storage Preferences Dialog */}
      <StoragePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onNavigateLegal={handleNavigateLegal}
      />
    </div>
  );
}
