import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '../components/AppShell';

interface Referral {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  status: 'IN_REVIEW' | 'REFERRED_INTERVIEWING' | 'MATCHING_SPONSOR';
  referrerName?: string;
  referrerTitle?: string;
  referrerNote?: string;
  submittedAt?: string;
  isPriority?: boolean;
}

const TABS = ['All Requests', 'My Submissions', 'Pending Review'] as const;
type Tab = typeof TABS[number];

function statusStyle(status: Referral['status']) {
  switch (status) {
    case 'IN_REVIEW': return { label: 'In Review', bg: 'bg-amber-50', text: 'text-amber-600' };
    case 'REFERRED_INTERVIEWING': return { label: 'Referred & Interviewing', bg: 'bg-emerald-50', text: 'text-emerald-600' };
    case 'MATCHING_SPONSOR': return { label: 'Matching Sponsor', bg: 'bg-blue-50', text: 'text-blue-600' };
  }
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}hr ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Referrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('All Requests');
  const [formData, setFormData] = useState({ company: '', jobId: '', pitch: '' });

  useEffect(() => { fetchReferrals(); }, []);

  const fetchReferrals = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/referrals', { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setReferrals(await response.json());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      fetchReferrals();
      setFormData({ company: '', jobId: '', pitch: '' });
    } else {
      alert('Failed to submit referral request.');
    }
  };

  const filteredReferrals = useMemo(() => {
    if (activeTab === 'All Requests') return referrals;
    if (activeTab === 'Pending Review') return referrals.filter((r) => r.status === 'IN_REVIEW' || r.status === 'MATCHING_SPONSOR');
    return referrals; // 'My Submissions' — swap for a real ownership filter once your API tells submissions apart
  }, [referrals, activeTab]);

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Alumni Referrals</h1>
      </div>

      <div className="px-5 mb-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            placeholder="Search companies, alumni, job title..."
            className="w-full bg-white border border-slate-200 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="px-5 mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request a referral */}
      <div className="px-5 mb-8">
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-slate-900">Request a Referral</h2>
            <span className="ml-auto text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase">Fast Track</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Connect directly with alumni at target companies</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company (e.g. Google)"
              required
              className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="jobId"
              value={formData.jobId}
              onChange={handleInputChange}
              placeholder="Job ID (e.g. #GOOG-84920)"
              required
              className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <textarea
            name="pitch"
            value={formData.pitch}
            onChange={handleInputChange}
            placeholder="Why are you a good fit? (grad year, relevant experience, skills...)"
            required
            className="border border-slate-200 p-2.5 rounded-lg w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          ></textarea>

          <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">📄 Attach resume</span>
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">🔗 LinkedIn URL</span>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">
            Submit Referral Request →
          </button>
        </form>
      </div>

      {/* Active feed */}
      <div className="px-5 mb-3 flex items-center justify-between text-sm">
        <span className="text-slate-500 font-semibold tracking-wide text-xs uppercase">Active Referral Feed</span>
        <span className="text-indigo-600 font-medium text-xs">Live Updates • Filter</span>
      </div>

      <div className="px-5 space-y-4">
        {filteredReferrals.map((ref) => {
          const status = statusStyle(ref.status);
          return (
            <div key={ref.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{ref.jobTitle}</h3>
                  <p className="text-sm text-slate-500">{ref.company}{ref.location ? ` • ${ref.location}` : ''}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>

              {ref.referrerName && (
                <div className="bg-slate-50 rounded-xl p-3 mt-3 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {ref.referrerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">
                      {ref.referrerName}{ref.referrerTitle ? ` • ${ref.referrerTitle}` : ''}
                    </p>
                    {ref.referrerNote && <p className="text-xs text-slate-500 mt-0.5">{ref.referrerNote}</p>}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Submitted {timeAgo(ref.submittedAt) || 'recently'}{ref.isPriority ? ' • Priority Flow' : ''}
                </span>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    Message Referrer
                  </button>
                  <button className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReferrals.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
            No referral requests yet.
          </div>
        )}
      </div>

      {referrals.length > 0 && (
        <div className="text-center mt-6 text-sm">
          <p className="text-slate-400 mb-1">You're all caught up with all alumni referrals.</p>
          <button className="text-indigo-600 font-medium hover:text-indigo-800">View archived referral history</button>
        </div>
      )}
    </AppShell>
  );
}