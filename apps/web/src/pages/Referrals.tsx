import React, { useState, useEffect } from 'react';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [form, setForm] = useState({ jobId: '', message: '' });

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/referrals', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setReferrals(data);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/referrals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (response.ok) {
      setForm({ jobId: '', message: '' });
      fetchReferrals();
    } else {
      alert('Failed to request referral.');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/referrals/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      fetchReferrals();
    } else {
      alert('Failed to update referral status.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Referral Requests</h1>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Request a Referral</h2>
        <input 
          type="text" 
          value={form.jobId} 
          onChange={(e) => setForm({ ...form, jobId: e.target.value })} 
          placeholder="Job ID" 
          required 
          className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        <textarea 
          value={form.message} 
          onChange={(e) => setForm({ ...form, message: e.target.value })} 
          placeholder="Why are you a good fit? Include context or link to your resume..." 
          required 
          className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          rows={3}
        ></textarea>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
          Submit Request
        </button>
      </form>

      <div className="space-y-6">
        {referrals.map((ref: any) => (
          <div key={ref.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Referral for Job: {ref.jobId}</h3>
                <p className="text-slate-500 text-sm">Requested by: {ref.student?.name || 'Student'}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border ${
                ref.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-100' :
                ref.status === 'DECLINED' ? 'bg-red-50 text-red-700 border-red-100' :
                'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {ref.status}
              </span>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap my-4">{ref.message}</p>

            {ref.status === 'PENDING' && (
              <div className="flex space-x-4 border-t border-slate-100 pt-4 mt-4">
                <button 
                  onClick={() => handleUpdateStatus(ref.id, 'ACCEPTED')}
                  className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleUpdateStatus(ref.id, 'DECLINED')}
                  className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
        {referrals.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No referral requests found.
          </div>
        )}
      </div>
    </div>
  );
}