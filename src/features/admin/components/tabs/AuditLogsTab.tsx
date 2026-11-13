import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Terminal,
} from 'lucide-react';
import { AdminAuditLog } from '../../types';
import { toast } from 'sonner';

interface AuditLogsTabProps {
  logs: AdminAuditLog[];
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(search.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'all' || l.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const handleExportLogs = () => {
    const jsonBlob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zirna_admin_audit_ledger_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Security audit ledger exported successfully.');
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <span>Immutable Administrative Audit & Security Ledger</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Cryptographic logging of all administrative actions, permission changes, and access verification events.
            </p>
          </div>

          <button
            onClick={handleExportLogs}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Ledger (JSON)</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail by actor, resource, or detail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFD166]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold shrink-0">Filter Event:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FFD166]"
            >
              <option value="all">All Security Events</option>
              <option value="ADMIN_SIGN_IN">Admin Sign In</option>
              <option value="USER_ROLE_CHANGED">Role Changed</option>
              <option value="USER_SUSPENDED">User Suspended</option>
              <option value="MODULE_CONFIG_UPDATED">Module Updated</option>
              <option value="SESSION_TERMINATED_BY_ADMIN">Session Terminated</option>
              <option value="PRIVACY_REQUEST_COMPLETED">Privacy Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E131F] text-slate-400 border-b-2 border-black uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp & IP</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Admin Actor</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-white">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleDateString()} • {log.ipAddress}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-slate-900 border-slate-700 text-amber-300">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-white">{log.adminName}</div>
                      <div className="text-[10px] text-slate-400">{log.adminEmail}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[#38BDF8] font-bold">{log.targetResource}</span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-300 text-[11px] truncate" title={log.details}>
                        {log.details}
                      </p>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="text-emerald-400 font-bold text-[11px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SUCCESS</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold text-[11px] inline-flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>FLAGGED</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
