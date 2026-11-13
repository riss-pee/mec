import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { BookOpen, Sparkles, Compass, MapPin, Building2, Mail, Phone, Globe, ShieldCheck } from 'lucide-react';

interface AboutViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateLegal,
  onBackToHub,
}) => {
  const toc = [
    { id: 'mission', label: '1. Mission & Vision' },
    { id: 'pedagogy', label: '2. Pedagogical Philosophy' },
    { id: 'bilingual', label: '3. Bilingual Local Context' },
    { id: 'org-details', label: '4. Organization Details' },
    { id: 'governance', label: '5. Governance & Non-Profit Intent' },
  ];

  return (
    <LegalPageLayout
      id="about"
      title="About ZIRNA STEM STUDIO"
      subtitle="Intuitive, tactile, bilingual STEM simulations created to make mathematics and physics visceral, playful, and accessible."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. Mission & Vision */}
      <section id="mission" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>1. Our Mission: Tactile STEM for Every Learner</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          <strong>ZIRNA</strong> (meaning <em>&ldquo;Learning&rdquo;</em> in the Mizo language) was created to address a universal classroom challenge: mathematics and physics are often taught through dry abstraction, formulas, and memorization rather than physical, spatial intuition.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          Our suite brings abstract concepts to life—letting students slice fractions like pizzas, shoot coordinate cannons along linear vector paths, manipulate Soroban abacus beads with realistic sound, reflect geometric shapes across diagonal mirror axes, and trace real optical rays through glass prisms and lenses.
        </p>
      </section>

      {/* 2. Pedagogical Philosophy */}
      <section id="pedagogy" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600" />
          <span>2. Pedagogical Philosophy: Concrete to Abstract</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono my-2">
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-300 space-y-1.5">
            <h3 className="font-bold uppercase text-yellow-950">1. Concrete Manipulation</h3>
            <p className="text-slate-700 font-sans">
              Interact with physical metaphors: pizza slices, beads, cars on roads, mirror reflections, and light beams.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1.5">
            <h3 className="font-bold uppercase text-emerald-950">2. Real-Time Feedback</h3>
            <p className="text-slate-700 font-sans">
              Instant visual and synthesized audio confirmation reinforces intuition without penalizing curiosity or error.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-300 space-y-1.5">
            <h3 className="font-bold uppercase text-purple-950">3. Mathematical Rigor</h3>
            <p className="text-slate-700 font-sans">
              Seamlessly transitions from tactile play to formal syllabus notation (NCERT, MBSE, and international STEM curricula).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Bilingual Context */}
      <section id="bilingual" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>3. Bilingual Local Context (Mizo & English)</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Recognizing the vital importance of mother-tongue and regional-language conceptual grounding, several modules (notably <em>Fraction Grid Game</em> and <em>Symmetry Mirror Match</em>) feature full bilingual translations in <strong>Mizo</strong> (the official language of Mizoram, India) alongside standard English.
        </p>
        <p className="text-xs text-slate-600">
          Students can switch between languages instantaneously, building confidence in both vernacular terminology and universal mathematical vocabulary.
        </p>
      </section>

      {/* 4. Organization Details */}
      <section id="org-details" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>4. Organization Details & Legal Identity</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          The following entity profile provides operational transparency for schools, regulatory bodies, and community partners:
        </p>

        <div className="overflow-x-auto border-2 border-black rounded-lg">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold border-r border-slate-200 text-slate-900 w-1/3">Platform Name</td>
                <td className="p-3 text-slate-800">{ZIRNA_ORGANIZATION.name}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold border-r border-slate-200 text-slate-900">Operating Legal Entity</td>
                <td className="p-3 text-slate-800 bg-amber-50/50">{ZIRNA_ORGANIZATION.legalEntityPlaceholder}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold border-r border-slate-200 text-slate-900">Registered Office / Address</td>
                <td className="p-3 text-slate-800 bg-amber-50/50">{ZIRNA_ORGANIZATION.addressPlaceholder}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold border-r border-slate-200 text-slate-900">Primary Contact Email</td>
                <td className="p-3 text-indigo-700 font-bold bg-amber-50/50">{ZIRNA_ORGANIZATION.contactEmailPlaceholder}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold border-r border-slate-200 text-slate-900">Official Website Domain</td>
                <td className="p-3 text-slate-800">mizorameducationcentre.com / zirnastem.org</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold border-r border-slate-200 text-slate-900">Registration / Society No.</td>
                <td className="p-3 text-slate-800 bg-amber-50/50">{ZIRNA_ORGANIZATION.registrationPlaceholder}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold border-r border-slate-200 text-slate-900">Jurisdiction</td>
                <td className="p-3 text-slate-800">{ZIRNA_ORGANIZATION.jurisdiction}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Governance */}
      <section id="governance" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>5. Governance & Non-Commercial Educational Mandate</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          ZIRNA STEM STUDIO is operated for open public educational benefit. We do not monetize student learning data, run advertisements, or gate foundational math simulations behind commercial subscriptions.
        </p>
      </section>
    </LegalPageLayout>
  );
};
