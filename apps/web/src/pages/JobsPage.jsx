import React, { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, ExternalLink, MapPin, Plus, Search } from 'lucide-react';
import { fetchApi } from '../lib/api';

const DEMO_JOBS = [
  { id: 'demo-1', title: 'Frontend Engineer', company: 'VIT Alumni Labs', type: 'FULL_TIME', location: 'Bengaluru / Hybrid', description: 'Build thoughtful product experiences with an alumni-led engineering team.', applyUrl: 'https://careers.example.com' },
  { id: 'demo-2', title: 'Product Design Intern', company: 'Northstar Studio', type: 'INTERNSHIP', location: 'Remote', description: 'Work alongside designers and founders on products used by growing teams.', applyUrl: 'https://careers.example.com' }
];

export default function JobsPage({ isAdmin }) {
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ title: '', company: '', type: 'FULL_TIME', location: '', description: '', applyUrl: '' });
  useEffect(() => { fetchApi('/jobs').then(setJobs).catch(() => {}); }, []);
  const filteredJobs = useMemo(() => jobs.filter((job) => `${job.title} ${job.company} ${job.location || ''}`.toLowerCase().includes(query.toLowerCase()) && (type === 'ALL' || job.type === type)), [jobs, query, type]);
  async function submitJob(event) {
    event.preventDefault(); setNotice('');
    try { const created = await fetchApi('/jobs', { method: 'POST', body: JSON.stringify(form) }); setJobs((current) => [created, ...current]); setShowForm(false); setForm({ title: '', company: '', type: 'FULL_TIME', location: '', description: '', applyUrl: '' }); }
    catch (error) { setNotice(`${error.message}. Sign in with an alumni or admin account to post.`); }
  }
  return <main className="max-w-7xl mx-auto px-6 pt-10">
    <PageHeading eyebrow="Opportunities for the network" title="Jobs & Internships" action={isAdmin && <button onClick={() => setShowForm(!showForm)} className="primary-button"><Plus className="w-4 h-4" /> Post an opportunity</button>} />
    {showForm && <form onSubmit={submitJob} className="panel mb-8 grid md:grid-cols-2 gap-4"><Input label="Role title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required /><Input label="Company" value={form.company} onChange={(value) => setForm({ ...form, company: value })} required /><Input label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} /><label className="field"><span>Type</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="INTERNSHIP">Internship</option></select></label><Input label="Apply URL" value={form.applyUrl} onChange={(value) => setForm({ ...form, applyUrl: value })} /><label className="field md:col-span-2"><span>Description</span><textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><button className="primary-button md:col-span-2 justify-center">Publish opportunity</button></form>}
    {notice && <p className="notice mb-6">{notice}</p>}
    <div className="flex flex-col md:flex-row gap-3 mb-8"><label className="search-box flex-1"><Search className="w-4 h-4" /><input placeholder="Search roles, companies, locations" value={query} onChange={(event) => setQuery(event.target.value)} /></label><select className="filter-select" value={type} onChange={(event) => setType(event.target.value)}><option value="ALL">All types</option><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="INTERNSHIP">Internship</option></select></div>
    <div className="grid md:grid-cols-2 gap-6">{filteredJobs.map((job) => <article className="content-card" key={job.id}><div className="flex items-start justify-between gap-4"><span className="eyebrow-pill">{job.type.replace('_', ' ')}</span><BriefcaseBusiness className="w-5 h-5 text-[#ffc002]" /></div><h2 className="card-title">{job.title}</h2><p className="font-semibold text-[#002148]">{job.company}</p><p className="text-sm text-slate-500 mt-2 flex gap-2 items-center"><MapPin className="w-4 h-4" />{job.location || 'Location flexible'}</p><p className="text-sm leading-6 text-slate-600 mt-5">{job.description}</p>{job.applyUrl && <a className="action-link mt-6" href={job.applyUrl} target="_blank" rel="noreferrer">View application <ExternalLink className="w-4 h-4" /></a>}</article>)}</div>
    {!filteredJobs.length && <EmptyState text="No opportunities match your search." />}
  </main>;
}
function PageHeading({ eyebrow, title, action }) { return <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"><div><span className="eyebrow">{eyebrow}</span><h1 className="page-title">{title}<span className="text-[#ffc002]">.</span></h1></div>{action}</div>; }
function Input({ label, value, onChange, required }) { return <label className="field"><span>{label}</span><input required={required} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
export function EmptyState({ text }) { return <div className="empty-state">{text}</div>; }