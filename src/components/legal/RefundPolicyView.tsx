import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { CreditCard, CheckCircle2, AlertCircle, HeartHandshake, HelpCircle } from 'lucide-react';

interface RefundPolicyViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
}

export const RefundPolicyView: React.FC<RefundPolicyViewProps> = ({
  onNavigateLegal,
  onBackToHub,
}) => {
  const toc = [
    { id: 'free-service', label: '1. 100% Free Service' },
    { id: 'refund-applicability', label: '2. Refund Applicability' },
    { id: 'future-services', label: '3. Future Paid Offerings' },
    { id: 'billing-inquiries', label: '4. Questions & Support' },
  ];

  return (
    <LegalPageLayout
      id="refund"
      title="Refund Policy"
      subtitle="Clear, honest disclosure regarding the financial model and free access to ZIRNA STEM STUDIO."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. 100% Free Service */}
      <section id="free-service" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-600" />
          <span>1. Free & Open Educational Access</span>
        </h2>
        <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-2">
          <p className="font-bold text-sm">
            ZIRNA STEM STUDIO is entirely free for all students, teachers, and schools.
          </p>
          <p className="text-xs leading-relaxed">
            All seven interactive learning modules—including the Fraction Zirna Playground, Fraction Grid MIZO, Symmetry Mirror Match, Abacus Studio, Coordinate Cannon Defense, Ray Tracing Optics Lab, and Number Line Cruiser—are provided at <strong>zero financial cost</strong>.
          </p>
        </div>
        <p className="text-sm leading-relaxed text-slate-700">
          The Platform does not charge registration fees, monthly subscription costs, per-student licensing charges, or paywall unlock fees. We do not solicit donations or credit card details through this website.
        </p>
      </section>

      {/* 2. Refund Applicability */}
      <section id="refund-applicability" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          <span>2. Applicability of Refunds</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Because no payments, monetary transactions, or financial exchanges occur on ZIRNA STEM STUDIO:
        </p>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs space-y-2 text-slate-800">
          <p>
            <strong>Refunds are NOT applicable to the current service.</strong>
          </p>
          <p>
            No user will ever be billed, charged, or debited by this website. Consequently, there are no cancellation penalties, chargeback requirements, or return procedures.
          </p>
        </div>
        <p className="text-xs text-slate-600">
          If any unauthorized third-party site or party claims to bill you for access to ZIRNA STEM STUDIO, please be aware that it is fraudulent. Do not submit payment information.
        </p>
      </section>

      {/* 3. Future Paid Offerings */}
      <section id="future-services" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>3. Conditional Framework for Future Offerings</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          If the operating organization ({ZIRNA_ORGANIZATION.legalEntityPlaceholder}) introduces optional paid services in the future (such as printed physical classroom STEM kits, teacher certification workshops, or proctored school Olympiads):
        </p>
        <ul className="text-xs space-y-2 text-slate-700 list-disc list-inside">
          <li>This Refund Policy will be formally amended before any financial transactions are accepted.</li>
          <li>A clear, statutory cooling-off and cancellation period will be published in accordance with the Consumer Protection Act, 2019 and relevant e-commerce rules.</li>
          <li>All prices, taxes (GST), and delivery terms will be stated transparently before checkout without pre-ticked add-ons.</li>
          <li>The core seven interactive web simulation modules will remain free for classroom and self-study use.</li>
        </ul>
      </section>

      {/* 4. Billing Inquiries */}
      <section id="billing-inquiries" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-black" />
          <span>4. Billing Inquiries & Assistance</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          If you have questions regarding the platform&rsquo;s funding model, institutional deployment, or access permissions:
        </p>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs space-y-1.5 text-slate-800">
          <div><strong>Operating Entity:</strong> {ZIRNA_ORGANIZATION.legalEntityPlaceholder}</div>
          <div><strong>Support Desk:</strong> {ZIRNA_ORGANIZATION.contactEmailPlaceholder}</div>
          <div><strong>Notice:</strong> We do not ask for debit/credit card numbers or UPI PINs via email or phone.</div>
        </div>
      </section>
    </LegalPageLayout>
  );
};
