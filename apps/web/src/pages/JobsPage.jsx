import React, { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, ExternalLink, MapPin, Plus, Search, Upload, X, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../lib/api';

const DEMO_JOBS = [
  { id: 'demo-1', title: 'Frontend Engineer', company: 'VIT Alumni Labs', type: 'FULL_TIME', location: 'Bengaluru / Hybrid', description: 'Build thoughtful product experiences with an alumni-led engineering team.' },
  { id: 'demo-2', title: 'Product Design Intern', company: 'Northstar Studio', type: 'INTERNSHIP', location: 'Remote', description: 'Work alongside designers and founders on products used by growing teams.' },
  { id: 'demo-3', title: 'Data Analyst', company: 'Reliance Industries', type: 'FULL_TIME', location: 'Jamnagar / On-site', description: 'Turn operational data into clear insights for engineering and business teams.' },
  { id: 'demo-4', title: 'Cloud Support Associate', company: 'AzureBridge Technologies', type: 'FULL_TIME', location: 'Chennai / Hybrid', description: 'Help customers troubleshoot cloud deployments and build reliable solutions.' },
  { id: 'demo-5', title: 'Research Assistant', company: 'VIT Innovation Lab', type: 'PART_TIME', location: 'Vellore / On-site', description: 'Support applied research projects across AI, electronics, and sustainable systems.' }
];

export default function JobsPage({ isAdmin }) {
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [applications, setApplications] = useState(() => JSON.parse(localStorage.getItem('jobApplications') || '{}'));
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [savingApplication, setSavingApplication] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', type: 'FULL_TIME', location: '', description: '', applyUrl: '' });
  useEffect(() => { fetchApi('/jobs').then((data) => { if (data.length) setJobs((current) => [...data, ...current.filter((job) => job.id.startsWith('demo-'))]); }).catch(() => {}); fetchApi('/jobs/applications').then((saved) => { const byJob = Object.fromEntries(saved.map((application) => [application.jobKey, application])); setApplications(byJob); localStorage.setItem('jobApplications', JSON.stringify(byJob)); }).catch(() => {}); }, []);
  const filteredJobs = useMemo(() => jobs.filter((job) => `${job.title} ${job.company} ${job.location || ''}`.toLowerCase().includes(query.toLowerCase()) && (type === 'ALL' || job.type === type)), [jobs, query, type]);
  async function submitJob(event) {
    event.preventDefault(); setNotice('');
    try { const created = await fetchApi('/jobs', { method: 'POST', body: JSON.stringify(form) }); setJobs((current) => [created, ...current]); setShowForm(false); setForm({ title: '', company: '', type: 'FULL_TIME', location: '', description: '', applyUrl: '' }); }
    catch (error) { setNotice(`${error.message}. Sign in with an alumni or admin account to post.`); }
  }
  async function applyToJob(event) {
    event.preventDefault();
    if (!selectedJob || !resume) return;
    setSavingApplication(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
      const application = await fetchApi('/jobs/applications', { method: 'POST', body: JSON.stringify({ jobKey: selectedJob.id, jobTitle: selectedJob.title, company: selectedJob.company, resumeName: resume.name, resumeData: reader.result }) });
      const next = { ...applications, [selectedJob.id]: application };
      localStorage.setItem('jobApplications', JSON.stringify(next));
      setApplications(next);
      setSelectedJob(null);
      setResume(null);
      setNotice(`Application saved for ${selectedJob.title}.`);
      } catch (error) { setNotice(`${error.message}. Please sign in before applying.`); }
      setSavingApplication(false);
    };
    reader.onerror = () => { setNotice('Unable to read that file. Please try again.'); setSavingApplication(false); };
    reader.readAsDataURL(resume);
  }
  async function deleteApplication(job) {
    if (!window.confirm('Delete this application and resume?')) return;
    try {
      await fetchApi(`/jobs/applications/${encodeURIComponent(job.id)}`, { method: 'DELETE' });
      const next = { ...applications };
      delete next[job.id];
      setApplications(next);
      localStorage.setItem('jobApplications', JSON.stringify(next));
      setNotice(`Application removed for ${job.title}.`);
    } catch (error) {
      setNotice(error.message || 'Unable to delete application.');
    }
  }
  return <main className="max-w-7xl mx-auto px-6 pt-10">
    <PageHeading eyebrow="Opportunities for the network" title="Jobs & Internships" action={isAdmin && <button onClick={() => setShowForm(!showForm)} className="primary-button"><Plus className="w-4 h-4" /> Post an opportunity</button>} />
    {showForm && <form onSubmit={submitJob} className="panel mb-8 grid md:grid-cols-2 gap-4"><Input label="Role title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required /><Input label="Company" value={form.company} onChange={(value) => setForm({ ...form, company: value })} required /><Input label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} /><label className="field"><span>Type</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="INTERNSHIP">Internship</option></select></label><Input label="Apply URL" value={form.applyUrl} onChange={(value) => setForm({ ...form, applyUrl: value })} /><label className="field md:col-span-2"><span>Description</span><textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><button className="primary-button md:col-span-2 justify-center">Publish opportunity</button></form>}
    {notice && <p className="notice mb-6">{notice}</p>}
    <div className="flex flex-col md:flex-row gap-3 mb-8"><label className="search-box flex-1"><Search className="w-4 h-4" /><input placeholder="Search roles, companies, locations" value={query} onChange={(event) => setQuery(event.target.value)} /></label><select className="filter-select" value={type} onChange={(event) => setType(event.target.value)}><option value="ALL">All types</option><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="INTERNSHIP">Internship</option></select></div>
    <div className="grid md:grid-cols-2 gap-6">{filteredJobs.map((job) => { const application = applications[job.id]; return <article className="content-card" key={job.id}><div className="flex items-start justify-between gap-4"><span className="eyebrow-pill">{job.type.replace('_', ' ')}</span><BriefcaseBusiness className="w-5 h-5 text-[#ffc002]" /></div><h2 className="card-title">{job.title}</h2><p className="font-semibold text-[#002148]">{job.company}</p><p className="text-sm text-slate-500 mt-2 flex gap-2 items-center"><MapPin className="w-4 h-4" />{job.location || 'Location flexible'}</p><p className="text-sm leading-6 text-slate-600 mt-5">{job.description}</p>{application ? <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"><span className="flex min-w-0 items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> <span className="truncate">Applied · {application.resumeName}</span></span><button type="button" onClick={() => deleteApplication(job)} className="shrink-0 text-red-600 hover:text-red-800" title="Delete application and resume" aria-label="Delete application and resume"><X className="h-4 w-4" /></button></div> : <button type="button" onClick={() => setSelectedJob(job)} className="primary-button mt-6"><Upload className="h-4 w-4" /> Apply with resume</button>}</article>; })}</div>
    {!filteredJobs.length && <EmptyState text="No opportunities match your search." />}
    {selectedJob && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002148]/50 p-4" onClick={() => setSelectedJob(null)}><section className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}><button onClick={() => setSelectedJob(null)} className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close application form"><X className="h-5 w-5" /></button><span className="eyebrow">Submit application</span><h2 className="page-title mt-1 text-3xl">{selectedJob.title}<span className="text-[#ffc002]">.</span></h2><p className="mt-2 text-sm text-slate-500">{selectedJob.company} · {selectedJob.location}</p><form onSubmit={applyToJob} className="mt-6 space-y-5"><label className="block text-xs font-bold text-slate-700">Resume<input type="file" required accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#002148] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white" /></label>{resume && <p className="text-xs text-slate-500">Selected: {resume.name}</p>}<button disabled={savingApplication} className="primary-button w-full justify-center"><Upload className="h-4 w-4" /> {savingApplication ? 'Saving…' : 'Save and apply'}</button></form></section></div>}
  </main>;
}
function PageHeading({ eyebrow, title, action }) { return <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"><div><span className="eyebrow">{eyebrow}</span><h1 className="page-title">{title}<span className="text-[#ffc002]">.</span></h1></div>{action}</div>; }
function Input({ label, value, onChange, required }) { return <label className="field"><span>{label}</span><input required={required} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
export function EmptyState({ text }) { return <div className="empty-state">{text}</div>; }
