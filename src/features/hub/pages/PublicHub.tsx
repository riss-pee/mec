import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  ArrowRight,
  PieChart,
  Grid3X3,
  FlipHorizontal2,
  Calculator,
  Crosshair,
  Sun,
  Car,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Check,
  ChevronDown,
  Globe,
  Smartphone,
  QrCode,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  Atom,
  Binary,
  Compass,
  Play,
  RotateCcw,
  Users,
  User,
  MonitorPlay,
  Trophy,
  School,
  LayoutDashboard,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { MODULES_REGISTRY, ModuleInfo } from '../../../data/modulesRegistry';
import { LegalViewId } from '../../../types/legal';
import { useTranslation } from '../../../i18n';
import { PixelMathHero, PixelOpticsHero, PixelDiscoveryHero } from '../../../components/pixel-art';
import { getActiveSession } from '../../classroom/services/classroomService';
import { toast } from 'sonner';

export type FilterCategory = 'all' | 'fractions' | 'geometry' | 'arithmetic' | 'physics';

interface PublicHubProps {
  onSelectModule: (id: string) => void;
  onNavigateLegal: (viewId: LegalViewId) => void;
  onOpenStoragePreferences: () => void;
  onNavigateClassroom: () => void;
  onNavigateTeacher: () => void;
  selectedCategory: FilterCategory;
  setSelectedCategory: (cat: FilterCategory) => void;
  scrollToSection: (elementId: string, category?: FilterCategory) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  PieChart,
  Grid3X3,
  FlipHorizontal2,
  Calculator,
  Crosshair,
  Sun,
  Car,
};

export const PublicHub: React.FC<PublicHubProps> = ({
  onSelectModule,
  onNavigateLegal,
  onOpenStoragePreferences,
  onNavigateClassroom,
  onNavigateTeacher,
  selectedCategory,
  setSelectedCategory,
  scrollToSection,
}) => {
  const { lang, setLang, t } = useTranslation();
  const [searchFilter, setSearchFilter] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTopTab, setActiveTopTab] = useState<'individuals' | 'groups'>('individuals');
  const [classroomCodeInput, setClassroomCodeInput] = useState('ZIRNA-4821');

  const activeSession = getActiveSession();

  // Hero carousel slides data
  const carouselSlidesData = [
    {
      badge: t.carouselSlides[0].badge,
      title: t.carouselSlides[0].title,
      highlight: t.carouselSlides[0].highlight,
      description: t.carouselSlides[0].description,
      illustration: <PixelMathHero />,
      accentBg: 'bg-[#FFD166]',
    },
    {
      badge: t.carouselSlides[1].badge,
      title: t.carouselSlides[1].title,
      highlight: t.carouselSlides[1].highlight,
      description: t.carouselSlides[1].description,
      illustration: <PixelOpticsHero />,
      accentBg: 'bg-[#38BDF8]',
    },
    {
      badge: t.carouselSlides[2].badge,
      title: t.carouselSlides[2].title,
      highlight: t.carouselSlides[2].highlight,
      description: t.carouselSlides[2].description,
      illustration: <PixelDiscoveryHero />,
      accentBg: 'bg-[#C4B5FD]',
    },
  ];

  // Auto advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlidesData.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [carouselSlidesData.length]);

  const categories = [
    { id: 'all', label: t.modulesDeck.filterAll, count: MODULES_REGISTRY.length },
    { id: 'fractions', label: t.modulesDeck.filterFractions, count: 2 },
    { id: 'geometry', label: t.modulesDeck.filterGeometry, count: 2 },
    { id: 'arithmetic', label: t.modulesDeck.filterArithmetic, count: 2 },
    { id: 'physics', label: t.modulesDeck.filterPhysics, count: 1 },
  ];

  const getCategoryLabel = (catId: FilterCategory): string => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.label : catId;
  };

  const filteredModules = MODULES_REGISTRY.filter((mod) => {
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      mod.subtitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      mod.features.some((f) => f.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const launchRandom = () => {
    const randomIndex = Math.floor(Math.random() * MODULES_REGISTRY.length);
    const chosen = MODULES_REGISTRY[randomIndex];
    toast.success(`Launching Workshop: ${chosen.title}`);
    onSelectModule(chosen.id);
  };

  const launchClassroomMode = () => {
    toast.success('Entering Classroom Arena...');
    onNavigateClassroom();
  };

  const handleAudienceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveTopTab((prev) => (prev === 'individuals' ? 'groups' : 'individuals'));
    }
  };

  const handleCategoryClick = (category: FilterCategory, categoryName: string) => {
    setSelectedCategory(category);
    scrollToSection('explore-workshops');
    toast.info(`Filtered curriculum: ${categoryName}`);
  };

  const audienceContent = activeTopTab === 'individuals' ? t.audience.individuals : t.audience.groups;

  return (
    <div>
      {/* ============================================================
          1. TOP UTILITY BAR (MEC Style + Audience Selector)
      ============================================================ */}
      <header className="bg-[#FFFDF5] border-b-2 border-black px-4 sm:px-8 py-2 flex items-center justify-between text-xs font-mono select-none">
        {/* Accessible Audience Switcher Tabs */}
        <div 
          role="tablist" 
          aria-label="Target Audience Selection"
          onKeyDown={handleAudienceKeyDown}
          className="flex items-center gap-2"
        >
          <button
            role="tab"
            id="tab-individuals"
            aria-selected={activeTopTab === 'individuals'}
            aria-controls="hero-audience-panel"
            tabIndex={activeTopTab === 'individuals' ? 0 : -1}
            onClick={() => {
              setActiveTopTab('individuals');
              toast.info('Switched view: For Individuals');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              activeTopTab === 'individuals'
                ? 'bg-[#FFD166] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent text-slate-700 hover:text-black hover:bg-black/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.nav.topBarIndividuals}</span>
          </button>

          <button
            role="tab"
            id="tab-groups"
            aria-selected={activeTopTab === 'groups'}
            aria-controls="hero-audience-panel"
            tabIndex={activeTopTab === 'groups' ? 0 : -1}
            onClick={() => {
              setActiveTopTab('groups');
              toast.info('Switched view: For Groups & Schools');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              activeTopTab === 'groups'
                ? 'bg-[#FFD166] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent text-slate-700 hover:text-black hover:bg-black/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.nav.topBarGroups}</span>
          </button>
        </div>

        {/* Location & Quick Legal Info */}
        <div className="flex items-center gap-4 text-slate-700">
          <span className="hidden md:inline-block font-mono text-[11px] text-slate-600">
            {t.nav.subLocation}
          </span>
          <div className="flex items-center gap-2 font-mono font-bold text-[11px]">
            <button 
              onClick={() => onNavigateLegal('about')} 
              className="hover:text-black transition-colors focus-visible:underline cursor-pointer"
            >
              {t.nav.about}
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigateLegal('privacy')} 
              className="hover:text-black transition-colors focus-visible:underline cursor-pointer"
            >
              {t.nav.privacy}
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigateLegal('contact')} 
              className="hover:text-black transition-colors focus-visible:underline cursor-pointer"
            >
              {t.nav.help}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* ============================================================
            2. HERO SECTION WITH AUDIENCE CONTENT & CAROUSEL
        ============================================================ */}
        <section 
          id="hero-audience-panel"
          role="tabpanel"
          aria-labelledby={activeTopTab === 'individuals' ? 'tab-individuals' : 'tab-groups'}
          className="mt-8 mb-14"
        >
          <div className="relative bg-white border-3 border-black brutal-shadow rounded-2xl overflow-hidden p-6 sm:p-10 lg:p-14 min-h-[440px] flex flex-col justify-between">
            {/* Retro graph paper background grid */}
            <div className="absolute inset-0 retro-paper-grid opacity-60 pointer-events-none" />

            {/* Original Pixel-Art Background Illustration */}
            <div className="absolute right-4 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 w-64 sm:w-80 lg:w-[380px] xl:w-[420px] pointer-events-none z-1 hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`pixel-slide-${activeSlide}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  {carouselSlidesData[activeSlide].illustration}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left Content Area (Dynamic by Audience & Slide) */}
            <div className="relative z-10 max-w-xl lg:max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hero-text-${activeTopTab}-${activeSlide}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFD166] border-2 border-black text-black font-mono font-bold text-xs uppercase tracking-wider mb-5 shadow-[2px_2px_0px_#000]">
                    <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>
                      {activeTopTab === 'groups' ? audienceContent.badge : carouselSlidesData[activeSlide].badge}
                    </span>
                  </div>

                  {/* Main H1 */}
                  <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-black tracking-tight font-sans uppercase leading-tight mb-4">
                    {activeTopTab === 'groups' ? audienceContent.title : carouselSlidesData[activeSlide].title}
                    <br />
                    <span className="bg-[#FFD166] px-3 py-0.5 border-2 border-black brutal-shadow-sm rounded-md inline-block mt-2 -rotate-1">
                      {activeTopTab === 'groups' ? audienceContent.highlight : carouselSlidesData[activeSlide].highlight}
                    </span>
                  </h1>

                  {/* Hero Subtitle */}
                  <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mb-8 max-w-xl font-sans">
                    {activeTopTab === 'groups' ? audienceContent.description : carouselSlidesData[activeSlide].description}
                  </p>

                  {/* Dynamic Call to Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    {activeTopTab === 'individuals' ? (
                      <>
                        <button
                          onClick={launchRandom}
                          className="retro-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF6B6B] hover:bg-[#fa5252] text-black border-2 border-black font-mono font-bold text-sm shadow-[4px_4px_0px_#000] cursor-pointer"
                        >
                          <Shuffle className="w-4 h-4 stroke-[2.5]" />
                          <span>{audienceContent.primaryCta}</span>
                        </button>

                        <button
                          onClick={() => scrollToSection('explore-workshops')}
                          className="retro-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-black border-2 border-black font-mono font-bold text-sm shadow-[4px_4px_0px_#000] cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 stroke-[2.5]" />
                          <span>{audienceContent.secondaryCta}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={launchClassroomMode}
                          className="retro-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-[#06D6A0] hover:bg-[#05b888] text-black border-2 border-black font-mono font-black text-sm shadow-[4px_4px_0px_#000] cursor-pointer"
                        >
                          <Trophy className="w-4 h-4 stroke-[2.5]" />
                          <span>Enter Classroom Arena</span>
                        </button>

                        <button
                          onClick={onNavigateTeacher}
                          className="retro-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-black border-2 border-black font-mono font-bold text-sm shadow-[4px_4px_0px_#000] cursor-pointer"
                        >
                          <School className="w-4 h-4 stroke-[2.5]" />
                          <span>Teacher Command Panel</span>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Dot Indicators */}
            <div className="flex items-center justify-between pt-6 border-t border-black/10 mt-6 relative z-10">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#06D6A0]" />
                <span>Slide {activeSlide + 1} of {carouselSlidesData.length}</span>
              </div>

              <div className="flex items-center gap-2">
                {carouselSlidesData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-3 rounded-full border-2 border-black transition-all cursor-pointer ${
                      activeSlide === idx ? 'bg-black w-8' : 'bg-white hover:bg-slate-200 w-3'
                    }`}
                    aria-label={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. DEDICATED GROUPS & SCHOOLS COLLABORATIVE COMMAND STATION
        ============================================================ */}
        {activeTopTab === 'groups' && (
          <section className="mb-16">
            <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 space-y-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-black bg-[#06D6A0] px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] mb-2">
                    <span>LIVE CLASSROOM ARENA</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black font-sans uppercase tracking-tight">
                    Join Live Classroom Session
                  </h2>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    Students enter the 4-digit code provided on the teacher's smartboard to join Team Battles.
                  </p>
                </div>

                {/* Direct Code Join Form */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto font-mono">
                  <input
                    type="text"
                    value={classroomCodeInput}
                    onChange={(e) => setClassroomCodeInput(e.target.value.toUpperCase())}
                    placeholder="ZIRNA-4821"
                    className="px-4 py-2.5 bg-white border-2 border-black rounded-lg font-black text-sm tracking-widest text-center shadow-xs"
                  />
                  <button
                    onClick={onNavigateClassroom}
                    className="retro-btn px-5 py-2.5 bg-[#06D6A0] hover:bg-[#05b888] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Enter Live Arena</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={onNavigateTeacher}
                    className="retro-btn px-4 py-2.5 bg-[#FFD166] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    Host Session (Teacher)
                  </button>
                </div>
              </div>

              {/* Live Team Battles Standings Preview */}
              <div>
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                  <span className="font-black text-black uppercase">Active Team Battle Standings:</span>
                  <span className="text-emerald-700 font-bold">Session Code: {activeSession?.code || 'ZIRNA-4821'}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 rounded-xl border-2 border-black bg-[#FFF5F5] text-center">
                    <div className="font-black text-sm text-rose-700">TEAM ALPHA 🔴</div>
                    <div className="text-2xl font-black text-black my-1">{activeSession?.teams.alpha.score || 420} PTS</div>
                    <div className="text-[11px] text-slate-500">{activeSession?.teams.alpha.accuracy || 94}% Accuracy</div>
                  </div>

                  <div className="p-4 rounded-xl border-2 border-black bg-[#F0F9FF] text-center">
                    <div className="font-black text-sm text-sky-700">TEAM BETA 🔵</div>
                    <div className="text-2xl font-black text-black my-1">{activeSession?.teams.beta.score || 380} PTS</div>
                    <div className="text-[11px] text-slate-500">{activeSession?.teams.beta.accuracy || 89}% Accuracy</div>
                  </div>

                  <div className="p-4 rounded-xl border-2 border-black bg-[#ECFDF5] text-center">
                    <div className="font-black text-sm text-emerald-700">TEAM GAMMA 🟢</div>
                    <div className="text-2xl font-black text-black my-1">{activeSession?.teams.gamma.score || 460} PTS</div>
                    <div className="text-[11px] text-slate-500">{activeSession?.teams.gamma.accuracy || 96}% Accuracy</div>
                  </div>

                  <div className="p-4 rounded-xl border-2 border-black bg-[#FEFCE8] text-center">
                    <div className="font-black text-sm text-amber-700">TEAM DELTA 🟡</div>
                    <div className="text-2xl font-black text-black my-1">{activeSession?.teams.delta.score || 350} PTS</div>
                    <div className="text-[11px] text-slate-500">{activeSession?.teams.delta.accuracy || 85}% Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================
            4. COURSE CATEGORY CARDS WITH FUNCTIONAL FILTER
        ============================================================ */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-black font-sans uppercase tracking-tight">
              {t.categories.sectionTitle}
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1 font-mono">
              {t.categories.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: School STEM Courses */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick('fractions', t.categories.schoolCoursesTitle)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick('fractions', t.categories.schoolCoursesTitle);
                }
              }}
              className="retro-card rounded-xl p-6 bg-white border-3 border-black brutal-shadow hover:brutal-shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <div className="w-20 h-20 rounded-full border-3 border-black bg-[#FFD166] flex items-center justify-center brutal-shadow-sm mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-10 h-10 text-black stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-black font-sans mb-2">
                {t.categories.schoolCoursesTitle}
              </h3>
              <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
                {t.categories.schoolCoursesDesc}
              </p>
              <span className="text-[11px] font-mono font-bold text-black bg-[#FFD166] group-hover:bg-[#ffc63a] px-3 py-1.5 rounded border border-black shadow-[1px_1px_0px_#000] transition-colors">
                {t.categories.schoolCoursesTag}
              </span>
            </div>

            {/* Card 2: Professional STEM & Physics Labs */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick('physics', t.categories.physicsLabsTitle)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick('physics', t.categories.physicsLabsTitle);
                }
              }}
              className="retro-card rounded-xl p-6 bg-white border-3 border-black brutal-shadow hover:brutal-shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <div className="w-20 h-20 rounded-full border-3 border-black bg-[#38BDF8] flex items-center justify-center brutal-shadow-sm mb-4 group-hover:scale-105 transition-transform">
                <Atom className="w-10 h-10 text-black stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-black font-sans mb-2">
                {t.categories.physicsLabsTitle}
              </h3>
              <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
                {t.categories.physicsLabsDesc}
              </p>
              <span className="text-[11px] font-mono font-bold text-black bg-[#38BDF8] group-hover:bg-[#0ea5e9] px-3 py-1.5 rounded border border-black shadow-[1px_1px_0px_#000] transition-colors">
                {t.categories.physicsLabsTag}
              </span>
            </div>

            {/* Card 3: Mental Math & Arithmetic Practice */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick('arithmetic', t.categories.mentalMathTitle)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick('arithmetic', t.categories.mentalMathTitle);
                }
              }}
              className="retro-card rounded-xl p-6 bg-white border-3 border-black brutal-shadow hover:brutal-shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <div className="w-20 h-20 rounded-full border-3 border-black bg-[#06D6A0] flex items-center justify-center brutal-shadow-sm mb-4 group-hover:scale-105 transition-transform">
                <Binary className="w-10 h-10 text-black stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-black font-sans mb-2">
                {t.categories.mentalMathTitle}
              </h3>
              <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
                {t.categories.mentalMathDesc}
              </p>
              <span className="text-[11px] font-mono font-bold text-black bg-[#06D6A0] group-hover:bg-[#05b888] px-3 py-1.5 rounded border border-black shadow-[1px_1px_0px_#000] transition-colors">
                {t.categories.mentalMathTag}
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================
            5. THE 7 INTERACTIVE WORKSHOPS DECK (Featured Curriculum)
        ============================================================ */}
        <section id="explore-workshops" className="mb-20 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-700 bg-[#FFD166] px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] mb-2">
                <span>{t.modulesDeck.sectionTag}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight">
                {t.modulesDeck.sectionTitle}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 font-mono mt-1">
                {t.modulesDeck.sectionSubtitle}
              </p>
            </div>

            {/* Retro Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
              <input
                type="text"
                placeholder={t.modulesDeck.searchPlaceholder}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white border-2 border-black brutal-shadow-sm rounded-md pl-9 pr-3 py-1.5 text-xs font-mono text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
              />
            </div>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FilterCategory)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold border-2 border-black transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFD166] text-black brutal-shadow-sm -translate-y-0.5'
                    : 'bg-white hover:bg-[#FFF9E6] text-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Active Filter Feedback Banner */}
          {selectedCategory !== 'all' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-[#FFFDF5] border-2 border-black p-3 rounded-lg brutal-shadow-sm mb-8"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-black">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0] inline-block animate-pulse" />
                <span>
                  {t.modulesDeck.filteredBy}: <strong>{getCategoryLabel(selectedCategory)}</strong>
                </span>
                <span className="text-slate-500 font-normal">
                  ({filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'} found)
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  toast.success('Filters cleared: Showing all modules');
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-black hover:bg-slate-800 text-white font-mono font-bold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.modulesDeck.showAll}</span>
              </button>
            </motion.div>
          )}

          {/* The 7 Module Cards in Retro Neo-Brutalist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((mod) => {
              const IconComp = ICON_MAP[mod.iconName] || PieChart;
              return (
                <div
                  key={mod.id}
                  className="retro-card glass-card rounded-xl p-0 flex flex-col justify-between overflow-hidden bg-white"
                >
                  {/* Top Header Strip */}
                  <div 
                    className="px-4 py-2.5 border-b-2 border-black flex items-center justify-between"
                    style={{ backgroundColor: mod.colorScheme.primary }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 rounded-xs">
                        MOD {mod.number}
                      </span>
                      <span className="text-[11px] font-bold font-mono text-black uppercase tracking-wider">
                        {mod.grade}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold font-mono bg-white text-black px-2 py-0.5 rounded-xs border border-black shadow-[1px_1px_0px_#000]">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Icon & Title Row */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div 
                          className="p-2.5 rounded-lg border-2 border-black brutal-shadow-sm shrink-0"
                          style={{ backgroundColor: mod.colorScheme.primary }}
                        >
                          <IconComp className="w-6 h-6 text-black stroke-[2.2]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-black tracking-tight font-sans">
                            {mod.title}
                          </h3>
                          <p className="text-xs font-bold font-mono text-slate-600">
                            {mod.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-700 leading-relaxed mb-4 font-sans font-medium line-clamp-3">
                        {mod.description}
                      </p>
                    </div>

                    <div>
                      {/* Retro Sticky Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {mod.features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] font-mono font-bold bg-[#FFF9E6] border border-black text-black px-2 py-0.5 rounded-xs shadow-[1px_1px_0px_#000]"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-600">
                          {t.modulesDeck.keyShortcut}: <kbd className="bg-black text-white px-1.5 py-0.5 rounded-xs font-mono">[{mod.shortcut}]</kbd>
                        </span>

                        <button
                          onClick={() => onSelectModule(mod.id)}
                          className="retro-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-mono font-bold text-xs text-black cursor-pointer"
                          style={{ backgroundColor: mod.colorScheme.primary }}
                        >
                          <span>{t.modulesDeck.launchGame}</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            6. "THE LEARNING EXPERIENCE" 3-ROW STORY
        ============================================================ */}
        <section id="learning-experience" className="mb-20 pt-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight">
              {t.experience.sectionTitle}
            </h2>
            <p className="text-sm font-medium text-slate-600 font-mono mt-2 max-w-xl mx-auto">
              {t.experience.sectionSubtitle}
            </p>
          </div>

          <div className="space-y-12">
            {/* Row 1: Learn by doing */}
            <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <span className="text-xs font-mono font-black uppercase text-black bg-[#FFD166] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                  {t.experience.row1Tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black font-sans">
                  {t.experience.row1Title}
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                  {t.experience.row1Desc}
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-mono font-bold text-slate-800">
                  {t.experience.row1Points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Graphic Card */}
              <div className="w-full lg:w-96 rounded-xl border-3 border-black bg-[#FFF9E6] p-5 brutal-shadow text-left font-mono">
                <div className="text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
                  <span>{t.experience.row1VisualTitle}</span>
                  <span className="bg-[#FFD166] px-2 py-0.5 rounded border border-black">{t.experience.row1VisualTag}</span>
                </div>
                <div className="w-32 h-32 mx-auto rounded-full border-3 border-black bg-white flex items-center justify-center mb-4 relative overflow-hidden brutal-shadow-sm">
                  <div className="absolute inset-0 bg-[#FFD166]" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
                  <div className="absolute inset-0 bg-[#06D6A0]" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }} />
                  <span className="relative font-mono font-black text-sm z-10 bg-white px-2 py-0.5 border border-black rounded">3 / 4</span>
                </div>
                <div className="text-center text-xs font-bold text-slate-700">
                  {t.experience.row1VisualCaption}
                </div>
              </div>
            </div>

            {/* Row 2: Learn with interactive simulations */}
            <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-10 flex flex-col-reverse lg:flex-row items-center gap-10">
              <div className="w-full lg:w-96 rounded-xl border-3 border-black bg-[#E8F8F5] p-5 brutal-shadow text-left font-mono">
                <div className="text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
                  <span>{t.experience.row2VisualTitle}</span>
                  <span className="bg-[#06D6A0] px-2 py-0.5 rounded border border-black text-black">{t.experience.row2VisualTag}</span>
                </div>
                <div className="h-32 rounded-lg border-2 border-black bg-white flex items-center justify-center mb-4 relative overflow-hidden notebook-paper-grid">
                  <div className="w-16 h-24 rounded-full border-2 border-cyan-600 bg-cyan-100/40" />
                  <div className="absolute w-full h-0.5 bg-red-500/70" />
                  <div className="absolute w-2 h-2 rounded-full bg-amber-500 right-10" />
                </div>
                <div className="text-center text-xs font-bold text-slate-700">
                  {t.experience.row2VisualCaption}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <span className="text-xs font-mono font-black uppercase text-black bg-[#06D6A0] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                  {t.experience.row2Tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black font-sans">
                  {t.experience.row2Title}
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                  {t.experience.row2Desc}
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-mono font-bold text-slate-800">
                  {t.experience.row2Points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Row 3: Learn in your language & schedule */}
            <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <span className="text-xs font-mono font-black uppercase text-black bg-[#C4B5FD] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                  {t.experience.row3Tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black font-sans">
                  {t.experience.row3Title}
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                  {t.experience.row3Desc}
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-mono font-bold text-slate-800">
                  {t.experience.row3Points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Graphic Card */}
              <div className="w-full lg:w-96 rounded-xl border-3 border-black bg-[#EDE9FE] p-5 brutal-shadow text-left font-mono">
                <div className="text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
                  <span>{t.experience.row3VisualTitle}</span>
                  <span className="bg-[#C4B5FD] px-2 py-0.5 rounded border border-black">{t.experience.row3VisualTag}</span>
                </div>
                <div className="h-32 rounded-lg border-2 border-black bg-stone-900 p-3 flex flex-col justify-around text-center mb-4">
                  <div className="flex justify-around">
                    <span className="w-4 h-4 rounded-full bg-amber-400 border border-black inline-block" />
                    <span className="w-4 h-4 rounded-full bg-amber-400 border border-black inline-block" />
                    <span className="w-4 h-4 rounded-full bg-amber-400 border border-black inline-block" />
                  </div>
                  <div className="h-1 bg-stone-400 w-full" />
                  <div className="flex justify-around">
                    <span className="w-4 h-4 rounded-full bg-amber-200 border border-black inline-block" />
                    <span className="w-4 h-4 rounded-full bg-amber-200 border border-black inline-block" />
                    <span className="w-4 h-4 rounded-full bg-amber-200 border border-black inline-block" />
                  </div>
                </div>
                <div className="text-center text-xs font-bold text-slate-700">
                  {t.experience.row3VisualCaption}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            7. MOBILE APP BANNER
        ============================================================ */}
        <section id="mobile-download" className="mb-20">
          <div className="bg-[#1E3A8A] text-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
              <div className="max-w-xl space-y-5">
                <span className="inline-block text-xs font-mono font-bold bg-[#FFD166] text-black px-3 py-1 rounded border border-black shadow-[2px_2px_0px_#000]">
                  {t.mobileBanner.tag}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
                  {t.mobileBanner.title}
                </h2>
                <p className="text-sm sm:base text-blue-100 font-medium leading-relaxed font-sans">
                  {t.mobileBanner.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-black border-2 border-white rounded-lg flex items-center gap-2 shadow-sm font-mono text-xs font-bold">
                      <span>{t.mobileBanner.appStore}</span>
                    </div>
                    <div className="px-4 py-2 bg-black border-2 border-white rounded-lg flex items-center gap-2 shadow-sm font-mono text-xs font-bold">
                      <span>{t.mobileBanner.googlePlay}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white text-black px-3.5 py-2 rounded-lg border-2 border-black font-mono text-xs font-bold">
                    <QrCode className="w-5 h-5 text-black" />
                    <span>{t.mobileBanner.scanLaunch}</span>
                  </div>
                </div>
              </div>

              {/* Retro Phone Screen */}
              <div className="w-64 sm:w-72 rounded-3xl border-3 border-black bg-white p-3.5 brutal-shadow rotate-1 shrink-0 text-black font-mono">
                <div className="h-4 w-20 mx-auto bg-black rounded-full mb-3" />
                <div className="rounded-xl border-2 border-black bg-[#F5F5F0] p-3 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-black/10 pb-1.5 font-bold">
                    <span>Zirna STEM</span>
                    <span className="text-[10px] bg-[#06D6A0] px-1 rounded">{t.mobileBanner.phoneActive}</span>
                  </div>
                  <div className="bg-[#FFD166] p-2 rounded border border-black font-bold text-[11px]">
                    Mod 01: Fraction Slices
                  </div>
                  <div className="bg-[#38BDF8] p-2 rounded border border-black font-bold text-[11px]">
                    Mod 07: Ray Optics
                  </div>
                  <div className="bg-[#C4B5FD] p-2 rounded border border-black font-bold text-[11px]">
                    Mod 03: Symmetry Lab
                  </div>
                  <div className="text-[10px] text-center text-slate-500 pt-1">
                    {t.mobileBanner.phoneSwipe}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            8. EDUCATIONAL MISSION STATEMENT
        ============================================================ */}
        <section className="mb-20 text-center">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600 mb-6">
            {t.mission.tag}
          </h3>
          <div className="bg-white border-3 border-black brutal-shadow rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 max-w-2xl">
              <h4 className="text-lg font-black text-black font-sans uppercase">
                {t.mission.title}
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 font-sans">
                {t.mission.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigateLegal('about')}
                className="retro-btn px-4 py-2.5 rounded-lg bg-[#FFD166] hover:bg-[#ffc63a] border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer"
              >
                {t.mission.aboutBtn}
              </button>
              <button
                onClick={() => onNavigateLegal('privacy')}
                className="retro-btn px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer"
              >
                {t.mission.privacyBtn}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
