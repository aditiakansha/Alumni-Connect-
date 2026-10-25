import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Save, UserRound } from 'lucide-react';
import { fetchApi } from '../lib/api';

const blank = { role: 'STUDENT', fullName: '', avatarUrl: '', graduationYear: '', degree: '', branch: '', currentPosition: '', currentCompany: '', location: '', bio: '', linkedinUrl: '' };

export default function ProfilePage() {
  const [form, setForm] = useState(blank);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchApi('/auth/me')
      .then((user) => {
        setEmail(user.email);
        setForm({ ...blank, role: user.role, ...user.profile, fullName: user.profile?.fullName || user.name || '' });
      })
      .catch((error) => setNotice(error.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const profile = await fetchApi('/alumni/me', {
        method: 'PUT',
        body: JSON.stringify({ ...form, graduationYear: form.graduationYear ? Number(form.graduationYear) : null }),
      });
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name: profile.fullName, avatarUrl: profile.avatarUrl, profile, role: form.role }));
      setForm({ ...form, ...profile });
      setNotice('Profile updated successfully.');
    } catch (error) {
      setNotice(error.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="mx-auto max-w-3xl px-6 py-16 text-sm text-slate-500">Loading your profile…</main>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#002148]"><ArrowLeft className="h-4 w-4" /> Back home</Link>
      <div className="mb-8 flex items-center gap-4">
        {form.avatarUrl ? <img src={form.avatarUrl} alt="" className="h-20 w-20 rounded-2xl object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#002148] text-white"><UserRound className="h-8 w-8" /></div>}
        <div><span className="eyebrow">Your network profile</span><h1 className="page-title text-3xl">{form.fullName || 'Your profile'}<span className="text-[#ffc002]">.</span></h1><p className="text-sm text-slate-500">{email}</p></div>
      </div>
      <form onSubmit={save} className="panel space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold text-slate-700">Profile type<select name="role" value={form.role} onChange={update} className="form-input mt-1"><option value="STUDENT">Student</option><option value="ALUMNI">Alumni</option></select></label>
          <label className="text-xs font-bold text-slate-700">Full name<input required name="fullName" value={form.fullName || ''} onChange={update} className="form-input mt-1" /></label>
          <label className="text-xs font-bold text-slate-700">Profile photo URL<input name="avatarUrl" value={form.avatarUrl || ''} onChange={update} className="form-input mt-1" /></label>
          <label className="text-xs font-bold text-slate-700">Location<input name="location" value={form.location || ''} onChange={update} className="form-input mt-1" /></label>
          <label className="text-xs font-bold text-slate-700">Graduation year<input type="number" name="graduationYear" value={form.graduationYear || ''} onChange={update} className="form-input mt-1" /></label>
          <label className="text-xs font-bold text-slate-700">Degree<input name="degree" value={form.degree || ''} onChange={update} className="form-input mt-1" /></label>
          <label className="text-xs font-bold text-slate-700">Branch / field<input name="branch" value={form.branch || ''} onChange={update} className="form-input mt-1" /></label>
          <label className="text-xs font-bold text-slate-700">Current position<input name="currentPosition" value={form.currentPosition || ''} onChange={update} className="form-input mt-1" /></label>
          <label className="text-xs font-bold text-slate-700">Company<input name="currentCompany" value={form.currentCompany || ''} onChange={update} className="form-input mt-1" /></label>
        </div>
        <label className="block text-xs font-bold text-slate-700">LinkedIn profile URL<input type="url" name="linkedinUrl" value={form.linkedinUrl || ''} onChange={update} className="form-input mt-1" /></label>
        <label className="block text-xs font-bold text-slate-700">Bio<textarea name="bio" rows={5} value={form.bio || ''} onChange={update} className="form-input mt-1 resize-none" /></label>
        {form.linkedinUrl && <a href={form.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#002148] hover:underline">View LinkedIn profile <ExternalLink className="h-4 w-4" /></a>}
        {notice && <p className="text-sm text-slate-600">{notice}</p>}
        <button disabled={saving} className="primary-button"><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save changes'}</button>
      </form>
    </main>
  );
}
