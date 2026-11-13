import React, { useState } from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { Mail, MapPin, Building2, UserCheck, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ContactViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigateLegal,
  onBackToHub,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error('Please enter a message or inquiry before submitting.');
      return;
    }

    // Honest handling: Since this is a client-side platform without an external backend,
    // we generate a mailto link and provide on-screen confirmation.
    const subject = encodeURIComponent(`[ZIRNA Inquiry - ${formData.category.toUpperCase()}] from ${formData.name || 'Anonymous User'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\nCategory: ${formData.category}\n\nMessage:\n${formData.message}`
    );
    
    // Open user's email client
    window.location.href = `mailto:${ZIRNA_ORGANIZATION.contactEmailPlaceholder}?subject=${subject}&body=${body}`;
    
    setSubmitted(true);
    toast.success('Inquiry prepared in your email client.');
  };

  const toc = [
    { id: 'directory', label: '1. Official Directory' },
    { id: 'grievance', label: '2. Grievance Officer' },
    { id: 'send-inquiry', label: '3. Send an Inquiry' },
  ];

  return (
    <LegalPageLayout
      id="contact"
      title="Contact Us & Grievance Redressal"
      subtitle="Reach out to the ZIRNA STEM STUDIO team for classroom inquiries, teacher training, accessibility feedback, or privacy requests."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. Official Directory */}
      <section id="directory" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <span>1. Official Communications Directory</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-2">
            <h3 className="font-bold uppercase text-slate-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>General & Educational Inquiries</span>
            </h3>
            <p className="text-slate-600 font-sans">
              For questions from teachers, school administrators, and students:
            </p>
            <p className="font-bold text-indigo-700 bg-white p-2 rounded border border-slate-200">
              {ZIRNA_ORGANIZATION.contactEmailPlaceholder}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-2">
            <h3 className="font-bold uppercase text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Registered Physical Address</span>
            </h3>
            <p className="text-slate-600 font-sans">
              Headquarters & Educational Studio:
            </p>
            <p className="font-bold text-slate-800 bg-white p-2 rounded border border-slate-200">
              {ZIRNA_ORGANIZATION.addressPlaceholder}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grievance Officer */}
      <section id="grievance" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <span>2. Statutory Grievance Redressal (DPDP Act & IT Rules)</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Digital Personal Data Protection Act, 2023, the details of our designated Grievance Officer are set out below:
        </p>
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 font-mono text-xs space-y-1.5 text-emerald-950">
          <div><strong>Designated Grievance Officer:</strong> {ZIRNA_ORGANIZATION.grievanceOfficerPlaceholder}</div>
          <div><strong>Designation:</strong> Data Protection Officer & Grievance Head</div>
          <div><strong>Email Address:</strong> {ZIRNA_ORGANIZATION.contactEmailPlaceholder}</div>
          <div><strong>Response Acknowledgement:</strong> Within 48 hours</div>
          <div><strong>Redressal Period:</strong> Grievances are addressed within statutory timelines (maximum 30 days).</div>
        </div>
      </section>

      {/* 3. Send an Inquiry */}
      <section id="send-inquiry" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <span>3. Send a Message or School Inquiry</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Have a question about deploying ZIRNA in your school, requesting bilingual workshop training, or reporting an issue? Use the form below to initiate communication:
        </p>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Inquiry Prepared Successfully!</span>
            </div>
            <p className="text-xs leading-relaxed">
              Your default email client has been opened with your message pre-filled for <code>{ZIRNA_ORGANIZATION.contactEmailPlaceholder}</code>. If your client did not launch automatically, you may send your inquiry directly to our address.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', category: 'general', message: '' });
              }}
              className="text-xs font-mono font-bold text-emerald-800 underline mt-2"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="block text-xs font-mono font-bold text-slate-800">
                  Your Name (Optional)
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Teacher Lalthanga"
                  className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white text-xs font-sans text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="block text-xs font-mono font-bold text-slate-800">
                  Your Email (Optional, if you desire a reply)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@school.edu.in"
                  className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white text-xs font-sans text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-category" className="block text-xs font-mono font-bold text-slate-800">
                Inquiry Category
              </label>
              <select
                id="contact-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white text-xs font-mono text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <option value="general">General Feedback or Question</option>
                <option value="classroom">Classroom / School Deployment</option>
                <option value="accessibility">Accessibility Barrier Report</option>
                <option value="privacy">Privacy / Data Concern</option>
                <option value="translation">Mizo Translation Feedback</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="block text-xs font-mono font-bold text-slate-800">
                Message <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we assist your classroom or learning journey?"
                className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white text-xs font-sans text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>

            <div className="p-3 rounded bg-amber-50 border border-amber-300 text-[11px] font-mono text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Note:</strong> This form does not silently store your message in an external database. Clicking &ldquo;Send Message&rdquo; opens your system email client to transmit your inquiry directly to our official inbox.
              </span>
            </div>

            <button
              type="submit"
              className="retro-btn flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#06D6A0] hover:bg-[#05b385] border-2 border-black text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <Send className="w-4 h-4" />
              <span>Prepare & Send Message</span>
            </button>
          </form>
        )}
      </section>
    </LegalPageLayout>
  );
};
