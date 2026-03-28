import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import TopNav from '../components/layout/TopNav';
import { useAuth } from '../context/AuthContext.jsx';
import { changePassword, updateProfile } from '../services/authApi';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currency: 'GHS',
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    if (!user) return;
    setFormState({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      currency: user.currency || 'GHS',
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async () => {
    if (status.loading) return;
    setStatus({ loading: true, error: '', success: '' });
    try {
      const response = await updateProfile({
        firstName: formState.firstName,
        lastName: formState.lastName,
        currency: formState.currency,
      });
      updateUser(response.user);
      setStatus({ loading: false, error: '', success: 'Profile updated.' });
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Unable to update profile.', success: '' });
    }
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePasswordSave = async () => {
    if (passwordStatus.loading) return;
    setPasswordStatus({ loading: true, error: '', success: '' });
    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ loading: false, error: '', success: 'Password updated.' });
    } catch (err) {
      setPasswordStatus({ loading: false, error: err.message || 'Unable to update password.', success: '' });
    }
  };

  return (
    <AppShell sideNavVariant="settings" className="bg-background text-on-background min-h-screen">
      <main className="pb-12 lg:pl-72 pr-8 min-h-screen bg-surface transition-all">
        <TopNav variant="settings" />
<div className="max-w-5xl mx-auto space-y-12 pt-24">
            {/* Profile Header Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-2">
                    <h3 className="text-2xl font-bold text-on-background">Account Profile</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Manage your personal information, avatar,
                        and public identity on SpendWise.</p>
                </div>
                <div
                    className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-transparent">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label
                                        className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">First
                                        Name</label>
                                    <input
                                        className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary text-on-surface font-medium"
                                        type="text"
                                        value={formState.firstName}
                                        onChange={handleChange('firstName')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label
                                        className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Last
                                        Name</label>
                                    <input
                                        className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary text-on-surface font-medium"
                                        type="text"
                                        value={formState.lastName}
                                        onChange={handleChange('lastName')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label
                                        className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email
                                        Address</label>
                                    <input
                                        className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary text-on-surface font-medium opacity-70 cursor-not-allowed"
                                        type="email"
                                        value={formState.email}
                                        readOnly
                                    />
                                </div>
                            </div>
                            {status.error && <p className="text-sm text-error font-semibold">{status.error}</p>}
                            {status.success && <p className="text-sm text-primary font-semibold">{status.success}</p>}
                            <button
                                className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-70"
                                type="button"
                                onClick={handleSave}
                                disabled={status.loading}
                            >
                                {status.loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Currency & Region Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-2">
                    <h3 className="text-2xl font-bold text-on-background">Preferences</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Set your primary currency and regional
                        formats for accurate financial reporting.</p>
                </div>
                <div className="md:col-span-2 bg-surface-container p-8 rounded-xl">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-secondary-container rounded-full text-on-secondary-container">
                                    <span className="material-symbols-outlined" data-icon="payments">payments</span>
                                </div>
                                <div>
                                    <p className="font-bold text-on-surface">Primary Currency</p>
                                    <p className="text-xs text-on-surface-variant">Default currency for all dashboards</p>
                                </div>
                            </div>
                            <select
                                className="bg-surface-container-high border-none rounded-lg px-4 py-2 font-bold text-primary focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                                value={formState.currency}
                                onChange={handleChange('currency')}
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="GHS">GHS - Ghana Cedi</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-tertiary-container rounded-full text-on-tertiary-container">
                                    <span className="material-symbols-outlined" data-icon="language">language</span>
                                </div>
                                <div>
                                    <p className="font-bold text-on-surface">Language</p>
                                    <p className="text-xs text-on-surface-variant">System interface language</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-on-surface px-4">English (Global)</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Security Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-2">
                    <h3 className="text-2xl font-bold text-on-background">Security</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Update your password and enable
                        multi-factor authentication for enhanced protection.</p>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label
                                    className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current
                                    Password</label>
                                <input
                                    className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                                    placeholder="••••••••••••"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange('currentPassword')}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label
                                        className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">New
                                        Password</label>
                                    <input
                                        className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange('newPassword')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label
                                        className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Confirm
                                        New Password</label>
                                    <input
                                        className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange('confirmPassword')}
                                    />
                                </div>
                            </div>
                        </div>
                        {passwordStatus.error && <p className="text-sm text-error font-semibold">{passwordStatus.error}</p>}
                        {passwordStatus.success && (
                          <p className="text-sm text-primary font-semibold">{passwordStatus.success}</p>
                        )}
                        <div className="flex justify-between items-center">
                            <button className="text-primary font-bold text-sm hover:underline">Forgot password?</button>
                            <button
                                className="bg-primary text-on-primary px-8 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-primary-dim transition-all disabled:opacity-70"
                                type="button"
                                onClick={handlePasswordSave}
                                disabled={passwordStatus.loading}
                            >
                                {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                    <div
                        className="p-6 bg-error-container/10 border border-error-container/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-error" data-icon="warning">warning</span>
                            <div>
                                <p className="font-bold text-on-error-container">Two-Factor Authentication</p>
                                <p className="text-xs text-on-error-container/70">Your account is currently less secure.
                                    Enable 2FA.</p>
                            </div>
                        </div>
                        <button
                            className="text-xs font-bold bg-white text-error px-4 py-2 rounded-lg border border-error/20 hover:bg-error/5 transition-colors">Enable
                            Now</button>
                    </div>
                </div>
            </section>
            {/* Notifications Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-2">
                    <h3 className="text-2xl font-bold text-on-background">Notifications</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Control which alerts and weekly reports
                        you receive via email or push notifications.</p>
                </div>
                <div className="md:col-span-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-surface-container">
                        <div
                            className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                            <div className="space-y-0.5">
                                <p className="font-bold text-on-surface">Budget Alerts</p>
                                <p className="text-sm text-on-surface-variant">Notify when I reach 80% of any budget limit
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input checked="" className="sr-only peer" type="checkbox" />
                                <div
                                    className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                                </div>
                            </label>
                        </div>
                        <div
                            className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                            <div className="space-y-0.5">
                                <p className="font-bold text-on-surface">Weekly Financial Insights</p>
                                <p className="text-sm text-on-surface-variant">Receive a summary of your spending every
                                    Monday</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input checked="" className="sr-only peer" type="checkbox" />
                                <div
                                    className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                                </div>
                            </label>
                        </div>
                        <div
                            className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                            <div className="space-y-0.5">
                                <p className="font-bold text-on-surface">Security Notifications</p>
                                <p className="text-sm text-on-surface-variant">Get alerted of new login attempts from
                                    unknown devices</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input checked="" className="sr-only peer" type="checkbox" />
                                <div
                                    className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>
            {/* Dangerous Area */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-8 border-t border-surface-container">
                <div className="md:col-span-1 space-y-2">
                    <h3 className="text-2xl font-bold text-error">Account Management</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Permanently delete your account and all
                        associated financial history.</p>
                </div>
                <div className="md:col-span-2">
                    <button
                        className="bg-surface-container-lowest text-error border border-error/20 px-8 py-3 rounded-xl font-bold text-sm hover:bg-error/5 transition-all">Deactivate
                        Account</button>
                </div>
            </section>
        </div>
      </main>
      <>
{/* FAB (Suppressed as per rules for Settings page) */}
      </>
    </AppShell>
  );
};

export default SettingsPage;
