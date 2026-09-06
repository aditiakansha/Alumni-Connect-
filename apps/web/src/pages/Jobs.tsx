import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '../components/AppShell';

type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP';

interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  type: JobType;
  applyUrl?: string;
  salary?: string;
  createdAt?: string;
}

const AVATAR_COLORS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { bg: 'bg-pink-100', text: 'text-pink-600' },
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600' },
];

function avatarStyle(company: string) {
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function badgeStyle(type: JobType) {
  switch (type) {
    case 'INTERNSHIP': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'FULL_TIME': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'PART_TIME': return 'bg-amber-50 text-amber-700 border-amber-100';
  }
}

function typeLabel(type: JobType) {
  return type === 'FULL_TIME' ? 'Full-time' : type === 'PART_TIME' ? 'Part-time' : 'Internship';
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return null;
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

const FILTERS = ['All Roles', 'Internships', 'Full-time', 'Remote Only'] as const;
type Filter = typeof FILTERS[number];

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All Roles');
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: '', type: 'FULL_TIME' as JobType, applyUrl: ''
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/jobs', { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setJobs(await response.json());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      fetchJobs();
      setFormData({ title: '', company: '', location: '', description: '', type: 'FULL_TIME', applyUrl: '' });
      setShowForm(false);
    } else {
      alert('Failed to post job. Please ensure you are logged in as an ALUMNI or ADMIN.');
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = search.trim() === '' ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All Roles' ||
        (activeFilter === 'Internships' && job.type === 'INTERNSHIP') ||
        (activeFilter === 'Full-time' && job.type === 'FULL_TIME') ||
        (activeFilter === 'Remote Only' && (job.location || '').toLowerCase().includes('remote'));
      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, activeFilter]);

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job & Internship Board</h1>
          <p className="text-sm text-slate-500 mt-0.5">Discover handpicked alumni opportunities</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2.5 rounded-full font-semibold text-sm shadow-sm hover:bg-indigo-700 transition-colors shrink-0"
        >
          <span className="text-lg leading-none">+</span> Post Job
        </button>
      </div>

      {showForm && (
        <div className="mx-5 mb-6">
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Job Title" required className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="company" value={formData.company} onChange={handleInputChange} placeholder="Company" required className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (Optional)" className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <select name="type" value={formData.type} onChange={handleInputChange} className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              <input name="applyUrl" value={formData.applyUrl} onChange={handleInputChange} placeholder="Application URL (Optional)" className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Job Description & Requirements" required className="border border-slate-200 p-2.5 rounded-lg w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={4}></textarea>
            <div className="flex gap-2">
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">Post Opportunity</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="px-5 mb-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, skills, or companies..."
            className="w-full bg-white border border-slate-200 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeFilter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-5 mb-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filteredJobs.length}</span> opportunities
        </span>
        <span className="text-indigo-600 font-medium">Latest first</span>
      </div>

      <div className="px-5 space-y-4">
        {filteredJobs.map((job) => {
          const avatar = avatarStyle(job.company);
          const posted = timeAgo(job.createdAt);
          return (
            <div key={job.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${avatar.bg} ${avatar.text}`}>
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-bold text-slate-900 leading-tight truncate">{job.title}</h2>
                      <p className="text-sm text-slate-500">{job.company}{job.location ? ` • ${job.location}` : ''}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold border shrink-0 ${badgeStyle(job.type)}`}>
                      {typeLabel(job.type)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-2">{job.description}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {job.salary ? job.salary : ''}{job.salary && posted ? ' • ' : ''}{posted || ''}
                </span>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    Referral
                  </button>
                  {job.applyUrl && (
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-white bg-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Apply
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
            No opportunities match your search.
          </div>
        )}
      </div>
    </AppShell>
  );
}