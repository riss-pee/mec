import React, { useState } from 'react';
import {
  FileText,
  Megaphone,
  Building,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';
import { PlatformSettings } from '../../types';
import { toast } from 'sonner';

interface ContentManagementTabProps {
  settings: PlatformSettings;
  onUpdateSettings: (settings: Partial<PlatformSettings>) => Promise<PlatformSettings>;
}

export const ContentManagementTab: React.FC<ContentManagementTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [noticeText, setNoticeText] = useState(settings.systemNoticeText);
  const [noticeActive, setNoticeActive] = useState(settings.systemNoticeActive);
  const [orgName, setOrgName] = useState(settings.organizationName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [isSaving, setIsSaving] = useState(false);

  // Sanitize helper preventing script injection
  const sanitize = (str: string) => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();

  const handleSaveNotice = async () => {
    setIsSaving(true);
    try {
      await onUpdateSettings({
        systemNoticeText: sanitize(noticeText),
        systemNoticeActive: noticeActive,
      });
      toast.success('Homepage announcement published successfully.');
    } catch {
      toast.error('Failed to update announcement.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrg = async () => {
    setIsSaving(true);
    try {
      await onUpdateSettings({
        organizationName: sanitize(orgName),
        supportEmail: sanitize(supportEmail),
      });
      toast.success('Organization credentials and support contacts updated.');
    } catch {
      toast.error('Failed to update organization details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#FFD166]" />
              <span>Public Communications & Institutional Content</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Control statewide announcements, banner bulletins, and educational institution accreditation details.
            </p>
          </div>

          <div className="text-slate-400 font-mono text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#06D6A0]" />
            <span>XSS Sanitization & Input Defense Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Statewide Announcement Banner */}
        <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#FFD166]" />
                <span>Homepage Broadcast Bulletin</span>
              </h2>

              <button
                type="button"
                onClick={() => setNoticeActive(!noticeActive)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                {noticeActive ? (
                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-slate-500" />
                )}
                <span className="text-[11px] font-bold">{noticeActive ? 'Live' : 'Hidden'}</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                  Announcement Message:
                </label>
                <textarea
                  rows={4}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="Enter notice to display across top banner..."
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FFD166]"
                />
              </div>

              {/* Live Preview */}
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                  Preview on Student Screen:
                </span>
                <div className="p-3 rounded-lg border-2 border-black bg-[#FFD166] text-black font-mono font-bold text-[11px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  <span>{noticeText || 'No announcement configured'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSaveNotice}
              disabled={isSaving}
              className="px-4 py-2 bg-[#FFD166] hover:bg-[#ffc947] text-black font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Publishing...' : 'Publish Announcement'}</span>
            </button>
          </div>
        </div>

        {/* Institutional Accreditation & Support Contacts */}
        <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-[#38BDF8]" />
                <span>Organizational Credential Details</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                  Operating Organization Name:
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FFD166]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                  Supervisory Authority:
                </label>
                <input
                  type="text"
                  disabled
                  value="Directorate of School Education, Govt. of Mizoram"
                  className="w-full px-3 py-2 bg-[#0E131F]/50 border border-slate-800 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                  Official Support Contact Email:
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FFD166]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSaveOrg}
              disabled={isSaving}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-cyan-400 text-black font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Updating...' : 'Update Organization Details'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
