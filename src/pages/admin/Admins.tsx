import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  Mail,
  Lock,
  User,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { Profile } from '@/types';
import { adminService } from '@/services/admins/adminService';
import { Modal } from '@/components/common/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const Admins: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Admin Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revoke Admin
  const [adminToRemove, setAdminToRemove] = useState<Profile | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (err) {
      toast.error('Failed to load administrators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || !password) {
      toast.error('All fields are required.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await adminService.addAdmin({
        email: email.trim(),
        full_name: fullName.trim(),
        password,
      });

      setAdmins((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
      toast.success(`Administrator ${created.full_name || created.email} added successfully!`);
      setIsModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeAdmin = async () => {
    if (!adminToRemove) return;
    setIsRevoking(true);
    try {
      await adminService.removeAdmin(adminToRemove.id);
      setAdmins((prev) => prev.filter((a) => a.id !== adminToRemove.id));
      toast.success(`Admin access for ${adminToRemove.full_name || adminToRemove.email} has been revoked.`);
      setAdminToRemove(null);
    } catch (err: any) {
      toast.error(err.message || 'Cannot remove admin.');
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-heading font-medium tracking-widest uppercase mb-1">
            <Users className="w-4 h-4" />
            <span>Access Control & Team</span>
          </div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tight text-white">
            Authorized Administrators
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Grant dashboard and catalogue management privileges to trusted brand co-founders and team members.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto shadow-luxury"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Security Advisory */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-400 space-y-1">
          <p className="font-heading font-semibold text-neutral-200">
            Administrator Permissions Scope
          </p>
          <p>
            Administrators have full authorization to add, edit, or delete caps, modify selling prices, configure brand settings, and invite additional administrators.
          </p>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 text-neutral-400 font-heading uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Admin Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Date Granted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    Loading administrator roster...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    No administrators found.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => {
                  const isCurrent = currentUser?.id === adm.id || currentUser?.email === adm.email;

                  return (
                    <tr key={adm.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-heading font-bold text-brand-gold">
                            {adm.full_name ? adm.full_name[0].toUpperCase() : 'A'}
                          </div>
                          <div>
                            <p className="font-heading font-semibold text-white">
                              {adm.full_name || 'Administrator'}
                            </p>
                            {isCurrent && (
                              <span className="text-[10px] text-brand-gold font-mono">
                                (Current Session)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-300 font-mono">
                        {adm.email || 'Confidential'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-heading font-semibold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Admin</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-400">
                        {new Date(adm.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {admins.length > 1 && !isCurrent ? (
                          <button
                            onClick={() => setAdminToRemove(adm)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors"
                            title="Revoke Admin Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-neutral-600 italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Administrator Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Authorize New Administrator"
        description="Create credentials for a trusted team member to manage the ValyrianCrown platform."
      >
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ama Osei"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Admin Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ama@valyriancrown.com"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Initial Password * (min. 6 characters)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              The administrator will use this password to sign into the dashboard at /admin/login.
            </p>
          </div>

          <div className="p-3 bg-neutral-100 rounded text-[11px] text-neutral-600 flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
            <span>
              This will create a verified profile with role <code className="font-bold">admin</code> in Supabase.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-heading uppercase text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-brand-black text-brand-cream hover:bg-neutral-800 rounded text-xs font-heading font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Admin...' : 'Grant Admin Privileges'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Revoke Admin Confirmation Modal */}
      <Modal
        isOpen={Boolean(adminToRemove)}
        onClose={() => setAdminToRemove(null)}
        title="Revoke Administrator Access"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            Are you sure you want to revoke administrator access for{' '}
            <strong className="text-neutral-900">
              {adminToRemove?.full_name || adminToRemove?.email}
            </strong>?
            They will no longer be able to log in to the admin panel.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setAdminToRemove(null)}
              className="px-4 py-2 text-xs font-heading uppercase text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isRevoking}
              onClick={handleRevokeAdmin}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-heading font-semibold uppercase tracking-wider disabled:opacity-50"
            >
              {isRevoking ? 'Revoking...' : 'Revoke Privileges'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
