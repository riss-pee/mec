import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { FileText, CheckCircle2, BookOpen, AlertCircle, Shield, Award, HelpCircle } from 'lucide-react';

interface TermsOfServiceViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({
  onNavigateLegal,
  onBackToHub,
}) => {
  const toc = [
    { id: 'acceptance', label: '1. Acceptance' },
    { id: 'description', label: '2. Platform Description' },
    { id: 'audience', label: '3. Educational Purpose' },
    { id: 'acceptable-use', label: '4. Acceptable Use' },
    { id: 'ip-ownership', label: '5. Intellectual Property' },
    { id: 'disclaimer', label: '6. Educational Disclaimers' },
    { id: 'availability', label: '7. Availability & Offline' },
    { id: 'liability', label: '8. Limitation of Liability' },
    { id: 'modifications', label: '9. Changes to Terms' },
    { id: 'jurisdiction', label: '10. Governing Law' },
  ];

  return (
    <LegalPageLayout
      id="terms"
      title="Terms of Service"
      subtitle="Fair, transparent terms governing the educational use of ZIRNA STEM STUDIO simulations and classroom tools."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. Acceptance */}
      <section id="acceptance" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>1. Acceptance of Terms</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Welcome to <strong>ZIRNA STEM STUDIO</strong>. By accessing or using this website, its educational modules, interactive math manipulatives, or physics simulators, you agree to comply with and be bound by these Terms of Service (&ldquo;Terms&rdquo;).
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          If you are accessing the Platform on behalf of an educational institution, school, or classroom, you represent that you have authority to utilize these open digital resources for teaching purposes. If you do not agree to these Terms, please do not use the Platform.
        </p>
      </section>

      {/* 2. Platform Description */}
      <section id="description" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>2. Description of ZIRNA STEM STUDIO</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          ZIRNA STEM STUDIO is a free digital workshop featuring seven dedicated educational modules:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-800 my-2">
          <div className="p-2.5 rounded bg-amber-50 border border-amber-300">01. Fraction Zirna Playground</div>
          <div className="p-2.5 rounded bg-emerald-50 border border-emerald-300">02. Fraction Grid Game MIZO</div>
          <div className="p-2.5 rounded bg-purple-50 border border-purple-300">03. Symmetry Mirror Match</div>
          <div className="p-2.5 rounded bg-orange-50 border border-orange-300">04. Interactive Abacus Studio</div>
          <div className="p-2.5 rounded bg-rose-50 border border-rose-300">05. Coordinate Cannon Defense</div>
          <div className="p-2.5 rounded bg-sky-50 border border-sky-300">06. Ray Tracing Optics Lab</div>
          <div className="p-2.5 rounded bg-yellow-50 border border-yellow-300">07. Number Line Cruiser</div>
        </div>
        <p className="text-xs text-slate-600 italic">
          All seven modules run directly inside modern web browsers using standard HTML5 Canvas, SVG, Web Audio, and Web Storage APIs.
        </p>
      </section>

      {/* 3. Educational Purpose */}
      <section id="audience" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>3. Educational Purpose & Intended Audience</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          The Platform is intended strictly for instructional, educational, and self-study purposes. It serves:
        </p>
        <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
          <li><strong>Primary & Secondary Students:</strong> Developing intuition for fractions, coordinate geometry, mental arithmetic, reflection symmetry, and light ray optics.</li>
          <li><strong>Educators & Tutors:</strong> Utilizing interactive manipulatives on classroom projectors, interactive whiteboards, or computer labs.</li>
          <li><strong>Homeschoolers & Parents:</strong> Engaging learners with tactile, gamified conceptual learning.</li>
        </ul>
      </section>

      {/* 4. Acceptable Use */}
      <section id="acceptable-use" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>4. Acceptable Use & User Responsibilities</span>
        </h2>
        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
          <p><strong>Permitted Uses:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-slate-800">
            <li>Using the Platform for non-commercial teaching, school demonstrations, and student assignments.</li>
            <li>Projecting simulations on classroom displays or distributing direct links to students.</li>
            <li>Downloading locally exported progress data for personal review.</li>
          </ul>

          <p className="pt-2"><strong>Prohibited Activities:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-slate-800">
            <li>Attempting to disrupt the service through denial-of-service (DoS) attacks or automated scraping.</li>
            <li>Misrepresenting the authorship of ZIRNA STEM STUDIO or asserting proprietary ownership over the public codebase.</li>
            <li>Embedding the Platform inside commercial paywalled frames without prior written consent.</li>
          </ul>
        </div>
      </section>

      {/* 5. Intellectual Property */}
      <section id="ip-ownership" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>5. Intellectual Property & Open-Source Attribution</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          The visual interface, pedagogical curricula, custom Mizo audio translations, interactive physics engines, and game challenge decks are proprietary to {ZIRNA_ORGANIZATION.legalEntityPlaceholder} or licensed under open-source software licenses.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          Third-party libraries used in the platform—including React, Lucide Icons, Motion, and Tailwind CSS—are the intellectual property of their respective maintainers under permissive open-source licenses (MIT, Apache 2.0, ISC). See our <a href="#asset-licenses" onClick={(e) => { e.preventDefault(); onNavigateLegal('about'); }} className="text-emerald-700 font-bold underline">Licensing Documentation</a> for full details.
        </p>
      </section>

      {/* 6. Educational Disclaimers */}
      <section id="disclaimer" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>6. Educational Simulations Disclaimer</span>
        </h2>
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-300 text-xs text-rose-950 space-y-2">
          <p className="font-bold">Pedagogical Approximations:</p>
          <p>
            The ray-tracing optics lab, coordinate artillery physics, and fractions models are educational visual models intended to illustrate foundational STEM principles. They are <strong>pedagogical approximations</strong> designed for classroom instruction, not calibrated engineering tools.
          </p>
          <p>
            They should not be relied upon for safety-critical optical device fabrication, ballistic trajectory planning, or professional civil engineering calculations.
          </p>
        </div>
      </section>

      {/* 7. Availability & Offline */}
      <section id="availability" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>7. Availability & Offline Resilience</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          We strive to keep the platform accessible 24/7 without disruptions. Because all seven modules execute entirely on the client&rsquo;s web browser, once loaded into browser cache, simulations continue to operate without an active internet connection.
        </p>
        <p className="text-xs text-slate-600">
          However, we do not guarantee uninterrupted server availability of CDN assets, and we reserve the right to deploy maintenance updates or feature enhancements.
        </p>
      </section>

      {/* 8. Limitation of Liability */}
      <section id="liability" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-700" />
          <span>8. Limitation of Liability</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          To the maximum extent permitted under applicable law, the Platform and its contents are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, either express or implied.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          Under no circumstances shall {ZIRNA_ORGANIZATION.legalEntityPlaceholder}, its educators, developers, or operators be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or inability to use the Platform.
        </p>
      </section>

      {/* 9. Modifications */}
      <section id="modifications" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-700" />
          <span>9. Modifications to These Terms</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          We may update or revise these Terms periodically to reflect pedagogical additions, technical changes, or statutory updates. Any updates will be published on this page with a revised &ldquo;Last Updated&rdquo; date. Continued use of the Platform after such modifications constitutes acceptance of the revised Terms.
        </p>
      </section>

      {/* 10. Governing Law */}
      <section id="jurisdiction" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-black" />
          <span>10. Governing Law & Dispute Resolution</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          These Terms and any disputes arising out of or related to the use of ZIRNA STEM STUDIO shall be governed by and construed in accordance with the laws of <strong>India</strong>, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.
        </p>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs space-y-1.5 text-slate-800">
          <div><strong>Primary Jurisdiction:</strong> {ZIRNA_ORGANIZATION.jurisdiction}</div>
          <div><strong>Inquiries / Clarifications:</strong> {ZIRNA_ORGANIZATION.contactEmailPlaceholder}</div>
        </div>
      </section>
    </LegalPageLayout>
  );
};
