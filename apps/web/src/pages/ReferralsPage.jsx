import React, { useEffect, useState } from 'react';
import { Handshake, Send, ExternalLink, Trash2 } from 'lucide-react';
import { fetchApi } from '../lib/api';
import alumniData from '../data/alumniData.json';

const emptyForm = { contactKey: '', targetRole: '', targetCompany: '', message: '' };

export default function ReferralsPage() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchApi('/referrals').then(setRequests).catch((error) => setNotice(`${error.message}. Sign in to view referrals.`));
  }, []);

  async function submit(event) {
    event.preventDefault();
    const contact = alumniData.alumni.find((person) => person.id === form.contactKey);
    if (!contact) return;
    try {
      const request = await fetchApi('/referrals/requests', {
        method: 'POST',
        body: JSON.stringify({ ...form, contactKey: contact.id, contactName: contact.name, contactRole: contact.role, contactCompany: contact.company, contactLinkedinUrl: contact.linkedinUrl }),
      });
      setRequests((current) => [request, ...current]);
      setForm(emptyForm);
      setNotice('Referral request saved.');
    } catch (error) {
      setNotice(`${error.message}. Sign in to send a referral request.`);
    }
  }

  async function removeRequest(request) {
    if (!window.confirm('Delete this referral request?')) return;
    try {
      await fetchApi(`/referrals/requests/${request.id}`, { method: 'DELETE' });
      setRequests((current) => current.filter((item) => item.id !== request.id));
      setNotice('Referral request deleted.');
    } catch (error) {
      setNotice(error.message || 'Unable to delete referral request.');
    }
  }

  return <main className="max-w-7xl mx-auto px-6 pt-10"><div className="mb-8"><span className="eyebrow">Open doors through the network</span><h1 className="page-title">Referrals<span className="text-[#ffc002]">.</span></h1><p className="mt-3 max-w-2xl text-sm text-slate-500">Choose an alumni from the directory and tell them what opportunity you need help with.</p></div>{notice && <p className="notice mb-6">{notice}</p>}<div className="grid gap-8 lg:grid-cols-[380px_1fr]"><form onSubmit={submit} className="panel h-fit space-y-4"><div className="flex items-center gap-2 mb-5"><Handshake className="w-5 h-5 text-[#ffc002]" /><h2 className="section-title">Request a referral</h2></div><label className="block text-xs font-bold text-slate-700">Ask an alumni<select className="form-input mt-1" required value={form.contactKey} onChange={(event) => setForm({ ...form, contactKey: event.target.value })}><option value="">Choose a directory contact</option>{alumniData.alumni.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.company}</option>)}</select></label>{form.contactKey && <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">{alumniData.alumni.find((person) => person.id === form.contactKey)?.role}</p>}<input className="form-input" required placeholder="Role or job you want a referral for" value={form.targetRole} onChange={(event) => setForm({ ...form, targetRole: event.target.value })} /><input className="form-input" placeholder="Company name (optional)" value={form.targetCompany} onChange={(event) => setForm({ ...form, targetCompany: event.target.value })} /><textarea className="form-input min-h-36" placeholder="Add a thoughtful note" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /><button className="primary-button w-full justify-center"><Send className="w-4 h-4" /> Send request</button></form><section><h2 className="section-title mb-4">Your requests</h2>{!requests.length && <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500">Your saved referral requests will appear here.</p>}<div className="space-y-4">{requests.map((request) => <article className="content-card" key={request.id}><div className="flex justify-between gap-4"><div><h3 className="card-title text-xl">{request.contactName}</h3><p className="mt-1 text-sm text-slate-500">{request.contactRole} · {request.contactCompany}</p><p className="mt-3 text-sm font-semibold text-[#002148]">Referral for {request.targetRole}{request.targetCompany ? ` at ${request.targetCompany}` : ''}</p></div><div className="flex items-center gap-4"><span className={`status-dot status-dot-${request.status.toLowerCase()}`} title={request.status} aria-label={request.status} /><button type="button" onClick={() => removeRequest(request)} className="text-red-600 hover:text-red-800" title="Delete request" aria-label="Delete referral request"><Trash2 className="h-4 w-4" /></button></div></div>{request.message && <p className="mt-5 text-sm text-slate-600">{request.message}</p>}{request.contactLinkedinUrl && <a href={request.contactLinkedinUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0A66C2] hover:underline">View LinkedIn <ExternalLink className="h-3.5 w-3.5" /></a>}</article>)}</div></section></div></main>;
}
