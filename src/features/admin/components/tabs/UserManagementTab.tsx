import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  ShieldAlert,
  GraduationCap,
  School,
  Shield,
  MoreVertical,
  Trash2,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AdminUserItem, UserAccountStatus } from '../../types';
import { UserRole } from '../../../auth/types';
import { toast } from 'sonner';

interface UserManagementTabProps {
  users: AdminUserItem[];
  onUpdateStatus: (userId: string, status: UserAccountStatus, reason: string) => Promise<void>;
  onUpdateRole: (userId: string, role: UserRole, reason: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  onUpdateStatus,
  onUpdateRole,
  onDeleteUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected user for inspection / actions modal
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'role' | 'suspend' | 'delete' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>('student');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.schoolName && u.schoolName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenModal = (user: AdminUserItem, mode: 'view' | 'role' | 'suspend' | 'delete') => {
    setSelectedUser(user);
    setModalMode(mode);
    setActionReason('');
    setSelectedNewRole(user.role);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalMode(null);
    setActionReason('');
    setIsProcessing(false);
  };

  const executeStatusChange = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      const nextStatus: UserAccountStatus = selectedUser.status === 'active' ? 'suspended' : 'active';
      await onUpdateStatus(selectedUser.id, nextStatus, actionReason || 'Status toggled by administrator');
      toast.success(`Account status updated for ${selectedUser.displayName}`);
      handleCloseModal();
    } catch {
      toast.error('Failed to update user status.');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeRoleChange = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await onUpdateRole(selectedUser.id, selectedNewRole, actionReason || 'Role updated by platform administrator');
      toast.success(`Role changed to ${selectedNewRole} for ${selectedUser.displayName}`);
      handleCloseModal();
    } catch {
      toast.error('Failed to change user role.');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDeleteUser = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await onDeleteUser(selectedUser.id);
      toast.success(`Account ${selectedUser.displayName} scrubbed permanently.`);
      handleCloseModal();
    } catch {
      toast.error('Failed to delete user.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="p-5 sm:p-6 bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#38BDF8]" />
              <span>Identity & Access Directory</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Manage student, teacher, and administrative permissions while strictly safeguarding child identity records.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-bold">
              Total Accounts: {users.length}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 font-mono text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, school..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFD166]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold shrink-0">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FFD166]"
            >
              <option value="all">All Roles</option>
              <option value="student">Student / Learner</option>
              <option value="teacher">Teacher / Educator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FFD166]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-[#161D2B] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0E131F] text-slate-400 border-b-2 border-black uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">User & Identity</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">School / Organization</th>
                <th className="py-3 px-4">Points & Streak</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching users found for this filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.displayName}</span>
                        {u.role === 'admin' && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold">
                            SUPER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.role === 'student' && (
                        <span className="px-2 py-0.5 rounded border border-[#06D6A0]/40 bg-[#06D6A0]/10 text-[#06D6A0] font-bold text-[10px] uppercase">
                          Student
                        </span>
                      )}
                      {u.role === 'teacher' && (
                        <span className="px-2 py-0.5 rounded border border-[#C4B5FD]/40 bg-[#C4B5FD]/10 text-[#C4B5FD] font-bold text-[10px] uppercase">
                          Teacher
                        </span>
                      )}
                      {u.role === 'admin' && (
                        <span className="px-2 py-0.5 rounded border border-[#FFD166]/40 bg-[#FFD166]/10 text-[#FFD166] font-bold text-[10px] uppercase">
                          Admin
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{u.schoolName || 'Independent Learner'}</div>
                      <div className="text-[10px] text-slate-400">{u.grade || 'General'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#FFD166] font-bold">{u.points.toLocaleString()} XP</div>
                      <div className="text-[10px] text-slate-400">{u.streakDays} day streak</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-400 text-[11px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(u, 'view')}
                          title="View Profile Details"
                          className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenModal(u, 'role')}
                          title="Change Authorized Role"
                          className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenModal(u, 'suspend')}
                          title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            u.status === 'active'
                              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleOpenModal(u, 'delete')}
                          title="Delete Account"
                          className="p-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-[#0E131F] border-t border-slate-800 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">
            Showing Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredUsers.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {modalMode && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#161D2B] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl w-full max-w-md p-6 font-mono text-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-bold uppercase tracking-wider text-slate-300 text-[11px]">
                {modalMode === 'view' && 'User Profile Intelligence'}
                {modalMode === 'role' && 'Update Authorized User Role'}
                {modalMode === 'suspend' && (selectedUser.status === 'active' ? 'Suspend Account' : 'Reactivate Account')}
                {modalMode === 'delete' && 'Scrub User Account Permanently'}
              </span>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode */}
            {modalMode === 'view' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#0E131F] rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFD166] text-black font-bold flex items-center justify-center text-lg">
                    {selectedUser.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{selectedUser.displayName}</div>
                    <div className="text-slate-400">{selectedUser.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-[#0E131F] rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase">Role</span>
                    <strong className="text-white capitalize">{selectedUser.role}</strong>
                  </div>
                  <div className="p-2.5 bg-[#0E131F] rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase">Account Status</span>
                    <strong className={selectedUser.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}>
                      {selectedUser.status.toUpperCase()}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-[#0E131F] rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase">Total STEM XP</span>
                    <strong className="text-[#FFD166]">{selectedUser.points.toLocaleString()} Points</strong>
                  </div>
                  <div className="p-2.5 bg-[#0E131F] rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase">Learning Streak</span>
                    <strong className="text-[#06D6A0]">{selectedUser.streakDays} Consecutive Days</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-[#0E131F] rounded-lg border border-slate-800 text-[11px]">
                  <span className="text-slate-500 block uppercase">Institution</span>
                  <div className="text-white font-medium">{selectedUser.schoolName || 'Individual Explorer'}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Grade / Group: {selectedUser.grade || 'N/A'}</div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Role Change Mode */}
            {modalMode === 'role' && (
              <div className="space-y-4">
                <p className="text-slate-300">
                  Select new role for <strong>{selectedUser.displayName}</strong>. Role modifications will be written to the administrative audit ledger.
                </p>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                    Authorized Role:
                  </label>
                  <select
                    value={selectedNewRole}
                    onChange={(e) => setSelectedNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white"
                  >
                    <option value="student">Student / Learner</option>
                    <option value="teacher">Teacher / Educator</option>
                    <option value="admin">Platform Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                    Administrative Reason:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Promoted to district STEM coordinator"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button onClick={handleCloseModal} className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold">
                    Cancel
                  </button>
                  <button
                    onClick={executeRoleChange}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-[#38BDF8] hover:bg-cyan-400 text-black font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000]"
                  >
                    {isProcessing ? 'Updating...' : 'Confirm Role Change'}
                  </button>
                </div>
              </div>
            )}

            {/* Suspend / Reactivate Mode */}
            {modalMode === 'suspend' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>
                    Are you sure you wish to {selectedUser.status === 'active' ? 'suspend' : 'reactivate'}{' '}
                    <strong>{selectedUser.displayName}</strong>?
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                    Reason for action:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Temporary investigation of classroom join code spam"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-lg text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button onClick={handleCloseModal} className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold">
                    Cancel
                  </button>
                  <button
                    onClick={executeStatusChange}
                    disabled={isProcessing}
                    className={`px-4 py-2 font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000] text-black ${
                      selectedUser.status === 'active' ? 'bg-amber-400 hover:bg-amber-300' : 'bg-emerald-400 hover:bg-emerald-300'
                    }`}
                  >
                    {isProcessing ? 'Updating...' : selectedUser.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                  </button>
                </div>
              </div>
            )}

            {/* Delete Mode */}
            {modalMode === 'delete' && (
              <div className="space-y-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Irreversible Action:</strong>
                    <span>
                      Permanently erase <strong>{selectedUser.displayName}</strong> ({selectedUser.email}). All progress metrics and credentials will be removed.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button onClick={handleCloseModal} className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold">
                    Cancel
                  </button>
                  <button
                    onClick={executeDeleteUser}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg border border-black shadow-[2px_2px_0px_#000]"
                  >
                    {isProcessing ? 'Scrubbing...' : 'Confirm Permanent Deletion'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
