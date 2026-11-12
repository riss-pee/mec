import React, { useState, useEffect } from 'react';
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
  Play
} from 'lucide-react';
import { MODULES_REGISTRY, ModuleInfo } from './data/modulesRegistry';
import { toast } from 'sonner';

interface HubProps {
  onSelectModule: (id: string) => void;
  onOpenCommandPalette: () => void;
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

type FilterCategory = 'all' | 'fractions' | 'geometry' | 'arithmetic' | 'physics';

export const Hub: React.FC<HubProps> = ({ onSelectModule, onOpenCommandPalette }) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTopTab, setActiveTopTab] = useState<'individuals' | 'groups'>('individuals');
  const [selectedLang, setSelectedLang] = useState<'EN' | 'MIZO'>('EN');
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const heroSlides = [
    {
      title: 'Empowering Your Educational Journey',
      highlight: 'Zirna STEM Studio',
      description: 'Discover curated school courses, interactive STEM math playgrounds, and comprehensive physics ray-tracing laboratories for elementary through high school learners.',
      badge: 'OFFICIAL MIZORAM EDUCATION CENTRE CURRICULUM',
      bgPattern: 'bg-[#FFD166]',
    },
    {
      title: 'Master Interactive STEM Skills',
      highlight: 'Learn by Doing',
      description: 'Hands-on tactile tools: customize grid dimensions, solve 30 symmetry reflection puzzles, cut real-time fraction pies, and simulate vector artillery trajectories.',
      badge: 'EXPERIMENT-BASED LEARNING LABS',
      bgPattern: 'bg-[#06D6A0]',
    },
    {
      title: 'Bilingual Math & Science for Mizoram',
      highlight: 'Mizo & English Audio',
      description: 'Fully localized mathematical audio and text instruction designed specifically for students and educators in Mizoram and across India.',
      badge: 'K-12 STEM CLASSROOM READY',
      bgPattern: 'bg-[#C4B5FD]',
    },
  ];

  // Auto advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
    { id: 'all', label: 'All Modules', count: MODULES_REGISTRY.length },
    { id: 'fractions', label: 'Fractions & Parts', count: 2 },
    { id: 'geometry', label: 'Geometry & Spatial', count: 2 },
    { id: 'arithmetic', label: 'Arithmetic & Place Value', count: 2 },
    { id: 'physics', label: 'Physics & Optics', count: 1 },
  ];

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

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 selection:bg-[#FFD166] selection:text-black font-sans pb-28">
      {/* ============================================================
          1. TOP UTILITY HEADER (MEC Style)
          ============================================================ */}
      <div className="bg-[#FFFDF5] border-b-2 border-black px-4 sm:px-8 py-1.5 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTopTab('individuals')}
            className={`px-3 py-1 rounded-md transition-all font-bold ${
              activeTopTab === 'individuals'
                ? 'bg-[#FFD166] text-black border border-black shadow-[1px_1px_0px_#000]'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            For Individuals
          </button>
          <button
            onClick={() => setActiveTopTab('groups')}
            className={`px-3 py-1 rounded-md transition-all font-bold ${
              activeTopTab === 'groups'
                ? 'bg-[#FFD166] text-black border border-black shadow-[1px_1px_0px_#000]'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            For Groups & Schools
          </button>
        </div>

        <div className="flex items-center gap-4 text-slate-700">
          <span className="hidden md:inline-block font-mono text-[11px] text-slate-600">
            Govt. Recognized • Mizoram Education Centre
          </span>
          <div className="flex items-center gap-2 font-mono font-bold text-[11px]">
            <span className="cursor-pointer hover:text-black">FB</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-black">X</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-black">IG</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-black">YT</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. MAIN MEC NAVIGATION BAR
          ============================================================ */}
      <nav className="sticky top-0 z-40 bg-white border-b-3 border-black px-4 sm:px-8 py-3 shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* MEC Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#06D6A0] border-2 border-black brutal-shadow-sm flex items-center justify-center font-mono font-black text-black text-base">
              MEC
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-black font-sans uppercase leading-none">
                Mizoram Education Centre
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-600 tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] inline-block animate-pulse" />
                <span>ZIRNA STEM STUDIO</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider">
            <button
              onClick={() => {
                const el = document.getElementById('explore-workshops');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-black hover:text-[#06D6A0] transition-colors cursor-pointer"
            >
              Explore Courses
            </button>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center gap-1 text-slate-700 hover:text-black transition-colors"
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isResourcesOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsResourcesOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-[#FFFDF5] border-3 border-black rounded-lg brutal-shadow-lg p-2.5 z-40 text-left font-mono"
                    >
                      <div className="text-[10px] uppercase font-black text-slate-500 px-2 py-1 border-b border-black/10 mb-1">
                        Interactive Workshops
                      </div>
                      <button
                        onClick={() => { onSelectModule('fraction-zirna'); setIsResourcesOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[#FFD166] text-xs font-bold transition-colors"
                      >
                        Math Puzzle & Slices
                      </button>
                      <button
                        onClick={() => { onSelectModule('symmetry-match'); setIsResourcesOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[#C4B5FD] text-xs font-bold transition-colors"
                      >
                        Geometry & Symmetry
                      </button>
                      <button
                        onClick={() => { onSelectModule('optics-lab'); setIsResourcesOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[#38BDF8] text-xs font-bold transition-colors"
                      >
                        Ray Tracing Physics Lab
                      </button>
                      <button
                        onClick={() => { onSelectModule('abacus-math'); setIsResourcesOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[#FB923C] text-xs font-bold transition-colors"
                      >
                        Soroban Mental Math
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('learning-experience');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-700 hover:text-black transition-colors cursor-pointer"
            >
              The Experience
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('mobile-download');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-700 hover:text-black transition-colors cursor-pointer"
            >
              Mobile App
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('footer-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-700 hover:text-black transition-colors cursor-pointer"
            >
              About
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle: EN | MIZO */}
            <div className="flex items-center bg-[#F5F5F0] border-2 border-black rounded-md p-0.5 text-xs font-mono font-bold">
              <button
                onClick={() => setSelectedLang('EN')}
                className={`px-2 py-0.5 rounded-xs transition-all ${selectedLang === 'EN' ? 'bg-black text-white' : 'text-slate-700 hover:text-black'}`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLang('MIZO')}
                className={`px-2 py-0.5 rounded-xs transition-all ${selectedLang === 'MIZO' ? 'bg-black text-white' : 'text-slate-700 hover:text-black'}`}
              >
                MIZO
              </button>
            </div>

            {/* Quick Launcher Button */}
            <button
              onClick={onOpenCommandPalette}
              className="retro-btn flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#FFD166] border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000]"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Launcher</span>
              <kbd className="text-[10px] bg-black text-white px-1 rounded">?K</kbd>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            3. HERO SLIDER BANNER (MEC Style with Retro Neo-Brutalist Frame)
            ============================================================ */}
        <section className="mt-8 mb-14">
          <div className="relative bg-white border-3 border-black brutal-shadow rounded-2xl overflow-hidden p-8 sm:p-12 lg:p-16">
            {/* Retro graph paper inside hero */}
            <div className="absolute inset-0 retro-paper-grid opacity-70 pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFD166] border-2 border-black text-black font-mono font-bold text-xs uppercase tracking-wider mb-6 shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>{heroSlides[activeSlide].badge}</span>
              </div>

              {/* Main H1 - Retaining branding & wording */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight font-sans uppercase leading-tight mb-4">
                {heroSlides[activeSlide].title}
                <br />
                <span className="bg-[#FFD166] px-3 py-0.5 border-2 border-black brutal-shadow-sm rounded-md inline-block mt-2 -rotate-1">
                  {heroSlides[activeSlide].highlight}
                </span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed mb-8 max-w-2xl font-sans">
                {heroSlides[activeSlide].description}
              </p>

              {/* Hero Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={launchRandom}
                  className="retro-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF6B6B] text-black border-2 border-black font-mono font-bold text-sm shadow-[4px_4px_0px_#000]"
                >
                  <Shuffle className="w-4 h-4 stroke-[2.5]" />
                  <span>Explore Random Lab</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('explore-workshops');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="retro-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black border-2 border-black font-mono font-bold text-sm shadow-[4px_4px_0px_#000]"
                >
                  <BookOpen className="w-4 h-4 stroke-[2.5]" />
                  <span>Browse All 7 Modules</span>
                </button>
              </div>
            </div>

            {/* Carousel Dot Indicators (MEC Style) */}
            <div className="absolute bottom-6 right-8 flex items-center gap-2 z-10">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all ${
                    activeSlide === idx ? 'bg-black w-8' : 'bg-white hover:bg-slate-200'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            4. "EXPLORE COURSES" 3-CATEGORY CARDS (Exact MEC Structure)
            ============================================================ */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-black font-sans uppercase tracking-tight">
              Explore Courses & Pathways
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1 font-mono">
              Choose a path tailored to your goals and start learning today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: School STEM Courses */}
            <div 
              onClick={() => setSelectedCategory('fractions')}
              className="retro-card rounded-xl p-6 bg-white border-3 border-black brutal-shadow hover:brutal-shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full border-3 border-black bg-[#FFD166] flex items-center justify-center brutal-shadow-sm mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-10 h-10 text-black stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-black font-sans mb-2">
                School Courses
              </h3>
              <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
                Explore MBSE, NCERT, and visual elementary math: Fraction Zirna, Fraction Grid, and visual pie charts.
              </p>
              <span className="text-[11px] font-mono font-bold text-black bg-[#FFD166] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                Grades 2 to 8 Curriculum ?
              </span>
            </div>

            {/* Card 2: Professional STEM & Physics Labs */}
            <div 
              onClick={() => setSelectedCategory('physics')}
              className="retro-card rounded-xl p-6 bg-white border-3 border-black brutal-shadow hover:brutal-shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full border-3 border-black bg-[#38BDF8] flex items-center justify-center brutal-shadow-sm mb-4 group-hover:scale-105 transition-transform">
                <Atom className="w-10 h-10 text-black stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-black font-sans mb-2">
                Physics & Optics Labs
              </h3>
              <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
                Real-time ray tracing through convex/concave lenses, curved mirrors, Cartesian defense, and coordinate vectors.
              </p>
              <span className="text-[11px] font-mono font-bold text-black bg-[#38BDF8] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                Middle & High School STEM ?
              </span>
            </div>

            {/* Card 3: Mental Math & Arithmetic Practice */}
            <div 
              onClick={() => setSelectedCategory('arithmetic')}
              className="retro-card rounded-xl p-6 bg-white border-3 border-black brutal-shadow hover:brutal-shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full border-3 border-black bg-[#06D6A0] flex items-center justify-center brutal-shadow-sm mb-4 group-hover:scale-105 transition-transform">
                <Binary className="w-10 h-10 text-black stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-black font-sans mb-2">
                Exam & Mental Math
              </h3>
              <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
                Soroban Japanese abacus, vertical counter beads, and Number Line Cruiser for integer addition and subtraction.
              </p>
              <span className="text-[11px] font-mono font-bold text-black bg-[#06D6A0] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                Speed Math & Olympiad Prep ?
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
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-600 bg-[#FFD166] px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] mb-2">
                <span>Interactive Learning Deck</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight">
                Featured STEM Modules
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 font-mono mt-1">
                Filter by subject or search across all interactive workshops.
              </p>
            </div>

            {/* Retro Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
              <input
                type="text"
                placeholder="Search in modules..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white border-2 border-black brutal-shadow-sm rounded-md pl-9 pr-3 py-1.5 text-xs font-mono text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
              />
            </div>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
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

          {/* The 7 Module Cards in Retro Neo-Brutalist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((mod) => {
              const IconComp = ICON_MAP[mod.iconName] || PieChart;
              return (
                <div
                  key={mod.id}
                  className="retro-card glass-card rounded-xl p-0 flex flex-col justify-between overflow-hidden bg-white"
                >
                  {/* Top Colorful Header Strip */}
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
                          Key: <kbd className="bg-black text-white px-1.5 py-0.5 rounded-xs">[{mod.shortcut}]</kbd>
                        </span>

                        <button
                          onClick={() => onSelectModule(mod.id)}
                          className="retro-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-mono font-bold text-xs text-black"
                          style={{ backgroundColor: mod.colorScheme.primary }}
                        >
                          <span>Launch Game</span>
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
            6. "THE LEARNING EXPERIENCE" 3-ROW STORY (Exact MEC Structure)
            ============================================================ */}
        <section id="learning-experience" className="mb-20 pt-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight">
              The Learning Experience
            </h2>
            <p className="text-sm font-medium text-slate-600 font-mono mt-2 max-w-xl mx-auto">
              Designed to help you master real-world skills through interactive learning and expert guidance.
            </p>
          </div>

          <div className="space-y-12">
            {/* Row 1: Learn by doing (Image Right) */}
            <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <span className="text-xs font-mono font-black uppercase text-black bg-[#FFD166] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                  PRACTICAL STEM LABS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black font-sans">
                  Learn by doing
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                  Move beyond theory. Our curriculum focuses on interactive exercises and real-world projects that build practical STEM skills you can use immediately.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-mono font-bold text-slate-800">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Interactive real-world pizza slice and grid representations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>30 syllabus challenges for geometric coordinate reflections</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Cartesian artillery trajectories and quadrant coordinate defense</span>
                  </li>
                </ul>
              </div>

              {/* Graphic Card */}
              <div className="w-full lg:w-96 rounded-xl border-3 border-black bg-[#FFF9E6] p-5 brutal-shadow text-left font-mono">
                <div className="text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
                  <span>Fraction Visualizer</span>
                  <span className="bg-[#FFD166] px-2 py-0.5 rounded border border-black">LIVE LAB</span>
                </div>
                <div className="w-32 h-32 mx-auto rounded-full border-3 border-black bg-white flex items-center justify-center mb-4 relative overflow-hidden brutal-shadow-sm">
                  <div className="absolute inset-0 bg-[#FFD166]" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
                  <div className="absolute inset-0 bg-[#06D6A0]" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }} />
                  <span className="relative font-mono font-black text-sm z-10 bg-white px-2 py-0.5 border border-black rounded">3 / 4</span>
                </div>
                <div className="text-center text-xs font-bold text-slate-700">
                  Visual fraction division & dynamic denominator slices
                </div>
              </div>
            </div>

            {/* Row 2: Learn with interactive simulations (Image Left - Alternating) */}
            <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-10 flex flex-col-reverse lg:flex-row items-center gap-10">
              {/* Graphic Card */}
              <div className="w-full lg:w-96 rounded-xl border-3 border-black bg-[#E8F8F5] p-5 brutal-shadow text-left font-mono">
                <div className="text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
                  <span>Ray Tracing Engine</span>
                  <span className="bg-[#06D6A0] px-2 py-0.5 rounded border border-black text-black">PHYSICS</span>
                </div>
                <div className="h-32 rounded-lg border-2 border-black bg-white flex items-center justify-center mb-4 relative overflow-hidden notebook-paper-grid">
                  <div className="w-16 h-24 rounded-full border-2 border-cyan-600 bg-cyan-100/40" />
                  <div className="absolute w-full h-0.5 bg-red-500/70" />
                  <div className="absolute w-2 h-2 rounded-full bg-amber-500 right-10" />
                </div>
                <div className="text-center text-xs font-bold text-slate-700">
                  Configurable focal lengths, convex lenses & curved mirrors
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <span className="text-xs font-mono font-black uppercase text-black bg-[#06D6A0] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                  REAL-TIME SIMULATION
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black font-sans">
                  Learn with simulations
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                  Never learn alone. Get immediate visual and physical feedback as you tweak variables, move optics torches, and fire coordinate cannon shots.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-mono font-bold text-slate-800">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Instant physics ray calculations at 60 frames per second</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Interactive drawing sandbox with live reflection mirrors</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Real-time decimals, percentages, and fractional ratio conversions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Row 3: Learn in your language & on your schedule */}
            <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <span className="text-xs font-mono font-black uppercase text-black bg-[#C4B5FD] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                  LOCALIZED EXCELLENCE
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black font-sans">
                  Learn in your language
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                  Balance your studies with your life. Access materials 24/7, learn in Mizo or English, and master arithmetic with synthesized voice and tactile bead sounds.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-mono font-bold text-slate-800">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Mizo and English dual language support in modules</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Self-paced progression with localized audio feedback</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#06D6A0] border border-black flex items-center justify-center text-black shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Soroban Japanese abacus and mental arithmetic counting</span>
                  </li>
                </ul>
              </div>

              {/* Graphic Card */}
              <div className="w-full lg:w-96 rounded-xl border-3 border-black bg-[#EDE9FE] p-5 brutal-shadow text-left font-mono">
                <div className="text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
                  <span>Soroban Abacus</span>
                  <span className="bg-[#C4B5FD] px-2 py-0.5 rounded border border-black">AUDIO FX</span>
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
                  Tactile place-value counting with audio synthesizer
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            7. "LEARN SKILLS ON THE GO" MOBILE BANNER (Exact MEC Structure)
            ============================================================ */}
        <section id="mobile-download" className="mb-20">
          <div className="bg-[#1E3A8A] text-white border-3 border-black brutal-shadow rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
              <div className="max-w-xl space-y-5">
                <span className="inline-block text-xs font-mono font-bold bg-[#FFD166] text-black px-3 py-1 rounded border border-black shadow-[2px_2px_0px_#000]">
                  MOBILE & TABLET ACCESS
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
                  Learn Skills on the go. Anytime, Anywhere.
                </h2>
                <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed font-sans">
                  Over thousands of students across Mizoram and India practice fractions, coordinates, and ray-tracing optics right on their devices.
                </p>

                {/* App Badges & QR Code */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-black border-2 border-white rounded-lg flex items-center gap-2 shadow-sm font-mono text-xs font-bold">
                      <span>Apple App Store</span>
                    </div>
                    <div className="px-4 py-2 bg-black border-2 border-white rounded-lg flex items-center gap-2 shadow-sm font-mono text-xs font-bold">
                      <span>Google Play</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white text-black px-3.5 py-2 rounded-lg border-2 border-black font-mono text-xs font-bold">
                    <QrCode className="w-5 h-5 text-black" />
                    <span>Scan & Launch Hub</span>
                  </div>
                </div>
              </div>

              {/* Retro Illustrated Phone Screen Graphic */}
              <div className="w-64 sm:w-72 rounded-3xl border-3 border-black bg-white p-3.5 brutal-shadow rotate-1 shrink-0 text-black font-mono">
                <div className="h-4 w-20 mx-auto bg-black rounded-full mb-3" />
                <div className="rounded-xl border-2 border-black bg-[#F5F5F0] p-3 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-black/10 pb-1.5 font-bold">
                    <span>Zirna STEM</span>
                    <span className="text-[10px] bg-[#06D6A0] px-1 rounded">ACTIVE</span>
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
                    Swipe between modules
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            8. KEY SUPPORTERS & PARTNERS (Exact MEC Layout)
            ============================================================ */}
        <section className="mb-20 text-center">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600 mb-6">
            Key Supporters & Academic Collaborators
          </h3>
          <div className="bg-white border-3 border-black brutal-shadow rounded-xl p-6 sm:p-8 flex flex-wrap items-center justify-around gap-8 text-black font-serif font-bold text-base sm:text-lg">
            <span className="tracking-widest">BANK OF AMERICA</span>
            <span className="tracking-wider">CollegeBoard</span>
            <span>Ann & John Doerr</span>
            <span className="italic">BILL & MELINDA GATES Fdn</span>
            <span className="tracking-widest uppercase">TATA TRUSTS</span>
            <span className="font-mono text-sm uppercase">Valhalla Foundation</span>
          </div>
        </section>
      </div>

      {/* ============================================================
          9. COMPREHENSIVE MEC FOOTER
          ============================================================ */}
      <footer id="footer-section" className="bg-[#0b1a30] text-slate-300 border-t-3 border-black pt-16 pb-12 px-4 sm:px-8 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Mission column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <span className="w-8 h-8 rounded bg-[#06D6A0] border border-black flex items-center justify-center text-black font-mono font-bold text-xs">
                MEC
              </span>
              <span>Mizoram Education Centre</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Our mission is to empower learners with world-class education, intuitive STEM simulations, and practical mathematical tools.
            </p>
            <div className="text-xs font-mono text-[#06D6A0] font-bold">
              Zirna is a recognized educational initiative.
            </div>
          </div>

          {/* About Links */}
          <div className="space-y-2 text-xs font-mono">
            <h4 className="font-bold text-white uppercase text-sm mb-3">About</h4>
            <div><a href="#explore-workshops" className="hover:text-white transition-colors">Our Curriculum</a></div>
            <div><a href="#learning-experience" className="hover:text-white transition-colors">Interactive Methodology</a></div>
            <div><a href="#mobile-download" className="hover:text-white transition-colors">Mobile Platforms</a></div>
            <div><span className="text-slate-500">Mizoram Board Alignment</span></div>
            <div><span className="text-slate-500">Teacher Tools & Editor</span></div>
          </div>

          {/* STEM Courses Links */}
          <div className="space-y-2 text-xs font-mono">
            <h4 className="font-bold text-white uppercase text-sm mb-3">STEM Modules</h4>
            <div><button onClick={() => onSelectModule('fraction-zirna')} className="hover:text-white transition-colors">Fraction Zirna Playground</button></div>
            <div><button onClick={() => onSelectModule('fraction-grid')} className="hover:text-white transition-colors">Fraction Grid Game MIZO</button></div>
            <div><button onClick={() => onSelectModule('symmetry-match')} className="hover:text-white transition-colors">Symmetry Mirror Match</button></div>
            <div><button onClick={() => onSelectModule('abacus-math')} className="hover:text-white transition-colors">Interactive Abacus Studio</button></div>
            <div><button onClick={() => onSelectModule('coordinate-defense')} className="hover:text-white transition-colors">Coordinate Cannon Defense</button></div>
            <div><button onClick={() => onSelectModule('optics-lab')} className="hover:text-white transition-colors">Ray Tracing Optics Lab</button></div>
            <div><button onClick={() => onSelectModule('number-line-cruiser')} className="hover:text-white transition-colors">Number Line Cruiser</button></div>
          </div>

          {/* Contact & Apps */}
          <div className="space-y-3 text-xs font-mono">
            <h4 className="font-bold text-white uppercase text-sm mb-3">Community & Help</h4>
            <p className="text-slate-400">
              Need classroom guidance or teacher workshops?
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
              <div>Aizawl, Mizoram, India</div>
              <div className="text-emerald-400 mt-1">mizorameducationcentre.com</div>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 Zirna Academy • Mizoram Education Centre. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
