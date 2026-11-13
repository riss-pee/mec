import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { Eye, Keyboard, Sparkles, CheckCircle2, AlertCircle, HelpCircle, Layers } from 'lucide-react';

interface AccessibilityStatementViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
}

export const AccessibilityStatementView: React.FC<AccessibilityStatementViewProps> = ({
  onNavigateLegal,
  onBackToHub,
}) => {
  const toc = [
    { id: 'commitment', label: '1. Our Commitment' },
    { id: 'standards', label: '2. WCAG 2.2 AA Standards' },
    { id: 'keyboard-support', label: '3. Keyboard Navigation & Shortcuts' },
    { id: 'visual-design', label: '4. Visual Contrast & Fonts' },
    { id: 'screen-readers', label: '5. Screen Reader Optimization' },
    { id: 'reduced-motion', label: '6. Motion & Audio Controls' },
    { id: 'known-limitations', label: '7. Known Limitations' },
    { id: 'feedback', label: '8. Feedback & Assistance' },
  ];

  return (
    <LegalPageLayout
      id="accessibility"
      title="Accessibility Statement"
      subtitle="Our formal commitment to digital inclusion, WCAG 2.2 AA compliance, and accessible STEM learning for all learners."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. Commitment */}
      <section id="commitment" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          <span>1. Our Commitment to Digital Inclusion</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          At <strong>ZIRNA STEM STUDIO</strong>, we believe that foundational mathematics and physics should be accessible to every student, including those with visual, auditory, motor, or cognitive disabilities.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          We continually audit, refine, and improve our interactive components to meet or exceed the <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong> standard, established by the World Wide Web Consortium (W3C).
        </p>
      </section>

      {/* 2. Standards */}
      <section id="standards" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>2. Core WCAG 2.2 AA Measures Implemented</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 space-y-2">
            <h3 className="font-bold uppercase text-emerald-950">Perceivable</h3>
            <ul className="list-disc list-inside space-y-1 text-emerald-900 font-sans">
              <li>High-contrast color palettes exceeding 4.5:1 ratio for normal text and 3:1 for large graphical elements.</li>
              <li>Visible high-contrast focus rings on all interactive controls.</li>
              <li>Semantic HTML elements with descriptive ARIA roles and landmarks.</li>
              <li>Alternative text labels for informative icons and diagrams.</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-300 space-y-2">
            <h3 className="font-bold uppercase text-indigo-950">Operable</h3>
            <ul className="list-disc list-inside space-y-1 text-indigo-900 font-sans">
              <li>100% keyboard accessibility across navigation docks, module switchers, and dialogs.</li>
              <li>Global hotkeys (numbers 1&ndash;7 to launch modules, Esc to return to Hub).</li>
              <li>No keyboard traps; logical tab index order maintained throughout.</li>
              <li>Generous touch target sizes (&ge; 44&times;44 px) on buttons and sliders.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Keyboard Support */}
      <section id="keyboard-support" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-amber-600" />
          <span>3. Global Keyboard Shortcuts & Navigation Guide</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          ZIRNA STEM STUDIO features built-in tactical keyboard hotkeys for rapid classroom and screen navigation:
        </p>
        <div className="overflow-x-auto border-2 border-black rounded-lg">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#FFFDF5] border-b-2 border-black font-bold text-black">
                <th className="p-3 border-r border-black">Key Command</th>
                <th className="p-3 border-r border-black">Action / Shortcut</th>
                <th className="p-3">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr>
                <td className="p-3 font-bold border-r border-slate-200"><kbd className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">1</kbd> to <kbd className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">7</kbd></td>
                <td className="p-3 border-r border-slate-200">Instantly launch corresponding STEM module</td>
                <td className="p-3 text-slate-600">Global (when not focused on text input)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold border-r border-slate-200"><kbd className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">Escape</kbd></td>
                <td className="p-3 border-r border-slate-200">Return to Hub Overview / Close any open modal</td>
                <td className="p-3 text-slate-600">Any active module or dialog</td>
              </tr>
              <tr>
                <td className="p-3 font-bold border-r border-slate-200"><kbd className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">Tab</kbd> / <kbd className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">Shift + Tab</kbd></td>
                <td className="p-3 border-r border-slate-200">Navigate forward / backward through interactive controls</td>
                <td className="p-3 text-slate-600">Universal</td>
              </tr>
              <tr>
                <td className="p-3 font-bold border-r border-slate-200"><kbd className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">Enter</kbd> / <kbd className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">Space</kbd></td>
                <td className="p-3 border-r border-slate-200">Activate button, trigger toggle, or select option</td>
                <td className="p-3 text-slate-600">Universal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Visual Design */}
      <section id="visual-design" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span>4. Visual Contrast, Typography & Zoom Scaling</span>
        </h2>
        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
          <p>
            <strong>Tactile Neo-Brutalist High Contrast:</strong> Our aesthetic is deliberately built around solid black borders (<code>border-2 border-black</code>), high-contrast badges, and distinct color accents. All standard text is rendered in deep slate (#0f172a / black) over crisp off-white (#FFFDF5 / #F5F5F0), exceeding WCAG AAA standards in numerous interfaces.
          </p>
          <p>
            <strong>Responsive Zoom Support:</strong> The layout supports standard browser text scaling and zoom up to <strong>200%</strong> without breaking content flow, causing horizontal scrolling, or hiding interactive controls.
          </p>
          <p>
            <strong>Dyslexia & Reading Accessibility:</strong> Clear geometric typography (Space Grotesk and JetBrains Mono) with open counters and distinct character shapes reduces visual crowding.
          </p>
        </div>
      </section>

      {/* 5. Screen Readers */}
      <section id="screen-readers" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>5. Screen Reader & Non-Visual Access</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          We test and support popular assistive screen readers including NVDA, JAWS, VoiceOver (macOS/iOS), and TalkBack (Android). Interactive buttons use explicit <code>aria-label</code> descriptions rather than bare icons.
        </p>
      </section>

      {/* 6. Reduced Motion */}
      <section id="reduced-motion" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>6. Reduced Motion & Audio Discretion</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Students with vestibular sensitivity or ADHD benefit from predictable, gentle motion:
        </p>
        <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
          <li><strong>System Reduced Motion:</strong> When your device operating system has &ldquo;Reduce Motion&rdquo; enabled, transition animations are minimized or disabled.</li>
          <li><strong>Tactile Audio Mute:</strong> Audio synthesized effects (beads, clicks, celebratory chimes) can be muted globally with one click in the header or module toolbar.</li>
        </ul>
      </section>

      {/* 7. Known Limitations */}
      <section id="known-limitations" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>7. Known Limitations & Ongoing Enhancements</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          While we strive for comprehensive accessibility, certain complex dynamic STEM models—such as the real-time continuous ray-tracing canvas in Optics Lab and rapid trajectory physics in Coordinate Cannon Defense—heavily depend on 2D visual coordinate rendering.
        </p>
        <p className="text-xs text-slate-600">
          We are actively developing tabular text alternatives and sonified audio representations for geometric ray angles and coordinate grids in upcoming releases.
        </p>
      </section>

      {/* 8. Feedback */}
      <section id="feedback" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-black" />
          <span>8. Accessibility Feedback & Assistance</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          If you encounter any accessibility barrier or have suggestions to improve the learning experience for students with disabilities, please contact our team:
        </p>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs space-y-1.5 text-slate-800">
          <div><strong>Accessibility Coordinator:</strong> {ZIRNA_ORGANIZATION.grievanceOfficerPlaceholder}</div>
          <div><strong>Feedback Channel:</strong> {ZIRNA_ORGANIZATION.contactEmailPlaceholder}</div>
          <div><strong>Response Time:</strong> We review all accessibility feedback within 3 business days.</div>
        </div>
      </section>
    </LegalPageLayout>
  );
};
