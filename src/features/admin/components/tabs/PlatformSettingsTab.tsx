import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Save,
  ToggleLeft,
  ToggleRight,
  Database,
  Server,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { PlatformSettings } from '../../types';
import { isSupabaseConfigured } from '../../../../lib/supabase';
import { toast } from 'sonner';

interface PlatformSettingsTabProps {
  settings: PlatformSettings;
  onUpdateSettings: (settings: Partial<PlatformSettings>) => Promise<PlatformSettings>;
}

export const PlatformSettingsTab: React.FC<PlatformSettingsTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [publicReg, setPublicReg] = useState(settings.publicRegistrationOpen);
  const [guestAccess, setGuestAccess] = useState(settings.guestAccessEnabled);
  const [childPrivacy, setChildPrivacy] = useState(settings.strictChildPrivacy);
  const [timeoutMinutes, setTimeoutMinutes] = useState(settings.defaultSessionTimeoutMinutes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateSettings({
        maintenanceMode,
        publicRegistrationOpen: publicReg,
        guestAccessEnabled: guestAccess,
        strictChildPrivacy: childPrivacy,
        defaultSessionTimeoutMinutes: Number(timeoutMinutes),
      });
      toast.success('Global platform settings updated.');
    } catch {
      toast.error('Failed to update platform settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Platform Configuration & Security Governance</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Control global availability switches, default classroom limits, and student privacy enforcement rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-bold">
              Release: {settings.version}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Switches */}
        <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-slate-800">
            Access Control & Platform Availability
          </h2>

          <div className="space-y-3">
            {/* Maintenance Mode */}
            <div className="p-3 bg-[#0E131F] rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block text-sm">Maintenance Mode</strong>
                <span className="text-slate-400 text-[11px]">Temporarily restrict student access for platform updates</span>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className="cursor-pointer"
              >
                {maintenanceMode ? (
                  <ToggleRight className="w-6 h-6 text-rose-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>

            {/* Public Registration */}
            <div className="p-3 bg-[#0E131F] rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block text-sm">Public Student/Teacher Registration</strong>
                <span className="text-slate-400 text-[11px]">Allow new self-serve sign-ups without institutional invitation</span>
              </div>
              <button
                type="button"
                onClick={() => setPublicReg(!publicReg)}
                className="cursor-pointer"
              >
                {publicReg ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>

            {/* Guest Sandbox Access */}
            <div className="p-3 bg-[#0E131F] rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block text-sm">Guest Sandbox Access</strong>
                <span className="text-slate-400 text-[11px]">Permit instantaneous zero-barrier exploration without sign-in</span>
              </div>
              <button
                type="button"
                onClick={() => setGuestAccess(!guestAccess)}
                className="cursor-pointer"
              >
                {guestAccess ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>

            {/* Strict Child Privacy Enforcement */}
            <div className="p-3 bg-[#0E131F] rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block text-sm">Strict Child Privacy Mode</strong>
                <span className="text-slate-400 text-[11px]">Mandate pseudonymous identifiers and zero external trackers</span>
              </div>
              <button
                type="button"
                onClick={() => setChildPrivacy(!childPrivacy)}
                className="cursor-pointer"
              >
                {childPrivacy ? (
                  <ToggleRight className="w-6 h-6 text-[#06D6A0]" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Operational Limits & Infrastructure Status */}
        <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-slate-800">
              Operational Limits & System Telemetry
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                  Default Classroom Session Timeout (Minutes):
                </label>
                <input
                  type="number"
                  min={15}
                  max={180}
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white"
                />
                <span className="text-slate-500 text-[10px] block mt-1">
                  Sessions idle past this duration will automatically conclude.
                </span>
              </div>

              {/* Infrastructure Status */}
              <div className="p-3.5 bg-[#0E131F] rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">
                  Infrastructure Engine
                </span>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Database Engine:</span>
                  </span>
                  <strong className="text-white">
                    {isSupabaseConfigured ? 'Supabase Cloud (PostgreSQL)' : 'Local Resilience Engine'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Multiplayer Broadcast Bus:</span>
                  </span>
                  <strong className="text-emerald-400">BroadcastChannel (100% Online)</strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Security Engine:</span>
                  </span>
                  <strong className="text-amber-400">Owner-Controlled RLS</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#FFD166] hover:bg-[#ffc947] text-black font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Platform Config...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
