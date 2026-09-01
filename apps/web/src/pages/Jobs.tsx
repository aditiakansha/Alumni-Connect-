import React, { useState, useEffect } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: '', type: 'FULL_TIME', applyUrl: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/jobs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }); 
    if (response.ok) {
      const data = await response.json();
      setJobs(data);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      fetchJobs();
      setFormData({ title: '', company: '', location: '', description: '', type: 'FULL_TIME', applyUrl: '' });
    } else {
      alert('Failed to post job. Please ensure you are logged in as an ALUMNI or ADMIN.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Job & Internship Board</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Job Title" required className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input name="company" value={formData.company} onChange={handleInputChange} placeholder="Company" required className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (Optional)" className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <select name="type" value={formData.type} onChange={handleInputChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
          <input name="applyUrl" value={formData.applyUrl} onChange={handleInputChange} placeholder="Application URL (Optional)" className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2" />
        </div>
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Job Description & Requirements" required className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={4}></textarea>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">Post Opportunity</button>
      </form>

      <div className="space-y-6">
        {jobs.map((job: any) => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
                <p className="text-slate-600 font-medium">{job.company}</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-indigo-100">
                {job.type.replace('_', ' ')}
              </span>
            </div>
            {job.location && (
              <p className="text-slate-500 text-sm mb-4">
                📍 {job.location} 
              </p>
            )}
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-4">{job.description}</p>
            
            <div className="flex justify-end border-t border-slate-100 pt-4 mt-4">
              {job.applyUrl && (
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Apply Here →
                </a>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No opportunities posted yet.
          </div>
        )}
      </div>
    </div>
  );
}