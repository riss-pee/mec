import React, { useState, useEffect } from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalViewId, ZIRNA_ORGANIZATION } from '../../types/legal';
import { 
  inspectAllStoredData, 
  clearAllZirnaLocalData, 
  exportLocalDataAsJson, 
  StoredDataItem 
} from '../../utils/consentManager';
import { Shield, Trash2, Download, RefreshCw, CheckCircle2, AlertTriangle, HardDrive, FileJson, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface DataDeletionViewProps {
  onNavigateLegal: (viewId: LegalViewId) => void;
  onBackToHub: () => void;
}

export const DataDeletionView: React.FC<DataDeletionViewProps> = ({
  onNavigateLegal,
  onBackToHub,
}) => {
  const [storedItems, setStoredItems] = useState<StoredDataItem[]>([]);
  const [hasCleared, setHasCleared] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);

  const refreshData = () => {
    setStoredItems(inspectAllStoredData());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleClearData = () => {
    const result = clearAllZirnaLocalData();
    setHasCleared(true);
    setClearedCount(result.totalKeys);
    refreshData();
    toast.success(`Successfully cleared ${result.totalKeys} local storage item(s).`);
  };

  const handleExportData = () => {
    const jsonStr = exportLocalDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zirna-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded your local learning data snapshot as JSON.');
  };

  const toc = [
    { id: 'client-inspection', label: '1. Inspect Local Data' },
    { id: 'one-click-purge', label: '2. One-Click Erasure' },
    { id: 'export-portability', label: '3. Export Data (Portability)' },
    { id: 'external-inquiry', label: '4. External Deletion Requests' },
  ];

  const totalBytes = storedItems.reduce((acc, curr) => acc + curr.sizeBytes, 0);

  return (
    <LegalPageLayout
      id="data-deletion"
      title="Data Management & Deletion Center"
      subtitle="Inspect, export, and instantly erase all educational game progress and preferences stored inside your browser."
      lastUpdated="November 13, 2026"
      onNavigateLegal={onNavigateLegal}
      onBackToHub={onBackToHub}
      tableOfContents={toc}
    >
      {/* 1. Client Inspection */}
      <section id="client-inspection" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-600" />
              <span>1. Live Browser Storage Inspection</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Everything stored locally in your active browser session:
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-bold">
              Total Storage: {totalBytes} bytes
            </span>
            <button
              onClick={refreshData}
              className="p-1.5 rounded bg-white hover:bg-slate-50 border border-black shadow-[1px_1px_0px_#000]"
              title="Refresh local storage inspection"
              aria-label="Refresh storage inspection"
            >
              <RefreshCw className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-black rounded-lg">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#FFFDF5] border-b-2 border-black font-bold text-black">
                <th className="p-3 border-r border-black">Key</th>
                <th className="p-3 border-r border-black">Module</th>
                <th className="p-3 border-r border-black">Current Value</th>
                <th className="p-3">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {storedItems.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-indigo-700 border-r border-slate-200 whitespace-nowrap">
                    <code>{item.key}</code>
                  </td>
                  <td className="p-3 text-slate-800 border-r border-slate-200">
                    {item.module}
                  </td>
                  <td className="p-3 border-r border-slate-200 max-w-xs truncate text-slate-600">
                    {item.value !== null ? (
                      <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                        {item.value}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic font-mono">[empty / not set]</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 font-mono">
                    {item.sizeBytes} B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. One-Click Erasure */}
      <section id="one-click-purge" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-rose-600" />
          <span>2. Immediate One-Click Local Data Erasure</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Exercising your Right to Erasure takes zero waiting. Clicking the button below immediately purges all challenge scores, streaks, and game progress from your current browser storage sandbox.
        </p>

        {hasCleared && (
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <strong>Local Data Cleared!</strong> All game scores, streaks, and module settings have been completely deleted from this browser.
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleClearData}
            className="retro-btn flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Trash2 className="w-4 h-4" />
            <span>Erase All Stored Data Now</span>
          </button>
        </div>
      </section>

      {/* 3. Export Data (Portability) */}
      <section id="export-portability" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <FileJson className="w-5 h-5 text-emerald-600" />
          <span>3. Data Portability: Download Your Learning Data</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          In line with statutory data portability rights under modern data protection frameworks (including India&rsquo;s DPDP Act 2023), you can download a complete, machine-readable JSON copy of all local records:
        </p>
        <div className="pt-2">
          <button
            onClick={handleExportData}
            className="retro-btn flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFD166] hover:bg-[#ffc63a] border-2 border-black text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Download className="w-4 h-4" />
            <span>Export Local Data Snapshot (.json)</span>
          </button>
        </div>
      </section>

      {/* 4. External Deletion Requests */}
      <section id="external-inquiry" className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-sm space-y-4">
        <h2 className="text-xl font-black text-black font-sans uppercase flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          <span>4. Formal External Privacy Inquiries & Verification</span>
        </h2>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono space-y-2 text-slate-800">
          <p>
            <strong>Important Technical Note:</strong> Because ZIRNA STEM STUDIO does not maintain remote user databases or cloud profiles, there is no remote student record to delete from an external server. The self-service erasure above fully purges all records that exist.
          </p>
          <p>
            However, if a school administrator, parent, or guardian wishes to confirm organizational non-retention or submit a formal statutory notice:
          </p>
          <div className="pt-2 text-slate-900">
            <div><strong>Recipient:</strong> Data Protection / Grievance Officer</div>
            <div><strong>Email:</strong> {ZIRNA_ORGANIZATION.contactEmailPlaceholder}</div>
            <div><strong>Address:</strong> {ZIRNA_ORGANIZATION.addressPlaceholder}</div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
};
