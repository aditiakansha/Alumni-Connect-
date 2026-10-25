import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchApi } from '../lib/api';

const emptyProfile = {
  role: '',
  fullName: '',
  avatarUrl: '',
  graduationYear: '',
  degree: '',
  branch: '',
  currentPosition: '',
  currentCompany: '',
  location: '',
  bio: '',
  linkedinUrl: '',
};

export default function ProfileModal({ isOpen, onClose }) {
  const [form, setForm] = useState(emptyProfile);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStatus('');
    if (!localStorage.getItem('accessToken')) return;

    fetchApi('/auth/me')
      .then((user) => setForm({
        ...emptyProfile,
        role: '',
        fullName: user.profile?.fullName || user.name || '',
        avatarUrl: user.profile?.avatarUrl || user.avatarUrl || '',
        graduationYear: user.profile?.graduationYear || '',
        degree: user.profile?.degree || '',
        branch: user.profile?.branch || '',
        currentPosition: user.profile?.currentPosition || '',
        currentCompany: user.profile?.currentCompany || '',
        location: user.profile?.location || '',
        bio: user.profile?.bio || '',
        linkedinUrl: user.profile?.linkedinUrl || '',
      }))
      .catch((error) => setStatus(error.message));
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      const profile = await fetchApi('/alumni/me', {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
        }),
      });
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: profile.fullName,
        avatarUrl: profile.avatarUrl,
        profile,
      }));
      onClose();
    } catch (error) {
      setStatus(error.message || 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002148]/50 p-4" onClick={onClose}>
      <section className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close profile form">
          <X className="h-5 w-5" />
        </button>
        <span className="eyebrow">Make your profile discoverable</span>
        <h2 className="page-title mt-1 text-3xl">Create your profile<span className="text-[#ffc002]">.</span></h2>
        <p className="mt-2 text-sm text-slate-500">First choose how you want to appear in the network, then add your details.</p>

        {!localStorage.getItem('accessToken') ? (
          <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Please sign in with Google before creating your profile.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold text-slate-700">I am a *</p>
              <div className="grid grid-cols-2 gap-3">
                {[['STUDENT', 'Student', 'Show your education and campus journey'], ['ALUMNI', 'Alumni', 'Show your work and career journey']].map(([value, label, description]) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, role: value })} className={`rounded-2xl border p-4 text-left transition ${form.role === value ? 'border-[#002148] bg-[#002148]/5 ring-2 ring-[#ffc002]' : 'border-slate-200 hover:border-[#002148]/40'}`}>
                    <span className="block font-bold text-[#002148]">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                  </button>
                ))}
              </div>
            </div>
            {!form.role && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Choose Student or Alumni to continue.</p>}
            {form.role && <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-700">Full name *<input required name="fullName" value={form.fullName} onChange={update} className="form-input mt-1" /></label>
              <label className="text-xs font-bold text-slate-700">Profile photo URL<input name="avatarUrl" value={form.avatarUrl} onChange={update} className="form-input mt-1" placeholder="https://..." /></label>
              <label className="text-xs font-bold text-slate-700">Graduation year<input type="number" name="graduationYear" value={form.graduationYear} onChange={update} className="form-input mt-1" /></label>
              <label className="text-xs font-bold text-slate-700">Degree<input name="degree" value={form.degree} onChange={update} className="form-input mt-1" placeholder="B.Tech Computer Science" /></label>
              <label className="text-xs font-bold text-slate-700">Branch / field<input name="branch" value={form.branch} onChange={update} className="form-input mt-1" /></label>
              {form.role === 'ALUMNI' && <>
                <label className="text-xs font-bold text-slate-700">Current job title<input name="currentPosition" value={form.currentPosition} onChange={update} className="form-input mt-1" /></label>
                <label className="text-xs font-bold text-slate-700">Company<input name="currentCompany" value={form.currentCompany} onChange={update} className="form-input mt-1" /></label>
              </>}
              <label className="text-xs font-bold text-slate-700">Location<input name="location" value={form.location} onChange={update} className="form-input mt-1" placeholder="Bengaluru, India" /></label>
            </div>
            <label className="block text-xs font-bold text-slate-700">LinkedIn profile URL<input type="url" name="linkedinUrl" value={form.linkedinUrl} onChange={update} className="form-input mt-1" placeholder="https://www.linkedin.com/in/username" /></label>
            <label className="block text-xs font-bold text-slate-700">Short bio<textarea name="bio" value={form.bio} onChange={update} rows={4} className="form-input mt-1 resize-none" placeholder="Tell the network what you do and what you are interested in." /></label>
            {status && <p className="text-sm text-red-600">{status}</p>}
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={saving} className="rounded-xl bg-[#002148] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a2f5c] disabled:opacity-60">{saving ? 'Saving…' : 'Save profile'}</button></div>
            </>}
          </form>
        )}
      </section>
    </div>
  );
}
