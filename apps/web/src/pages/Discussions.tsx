import React, { useState, useEffect } from 'react';

export default function Discussions() {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [threadForm, setThreadForm] = useState({ title: '', content: '' });
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/discussions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setThreads(data);
    }
  };

  const fetchThreadDetail = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/discussions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setActiveThread(data);
    }
  };

  const handleThreadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/discussions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(threadForm)
    });

    if (response.ok) {
      setThreadForm({ title: '', content: '' });
      fetchThreads();
    } else {
      alert('Failed to create thread.');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/discussions/${activeThread.id}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: replyContent })
    });

    if (response.ok) {
      setReplyContent('');
      fetchThreadDetail(activeThread.id);
    } else {
      alert('Failed to post reply.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Alumni Discussion Forum</h1>

      {activeThread ? (
        <div>
          <button 
            onClick={() => setActiveThread(null)} 
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-6 inline-block"
          >
            ← Back to All Discussions
          </button>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeThread.title}</h2>
            <p className="text-slate-500 text-sm mb-4">Posted by {activeThread.author?.name || 'Alumni'}</p>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{activeThread.content}</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-4">Replies</h3>
          
          <form onSubmit={handleReplySubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-slate-200">
            <textarea 
              value={replyContent} 
              onChange={(e) => setReplyContent(e.target.value)} 
              placeholder="Write your reply..." 
              required 
              className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              rows={3}
            ></textarea>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
              Post Reply
            </button>
          </form>

          <div className="space-y-4">
            {activeThread.replies?.map((reply: any) => (
              <div key={reply.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-xs mb-2">{reply.author?.name || 'Alumni'}</p>
                <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>
              </div>
            ))}
            {(!activeThread.replies || activeThread.replies.length === 0) && (
              <p className="text-slate-500 text-sm">No replies yet. Be the first to reply!</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={handleThreadSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Start a New Discussion</h2>
            <input 
              type="text" 
              value={threadForm.title} 
              onChange={(e) => setThreadForm({ ...threadForm, title: e.target.value })} 
              placeholder="Discussion Title" 
              required 
              className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
            <textarea 
              value={threadForm.content} 
              onChange={(e) => setThreadForm({ ...threadForm, content: e.target.value })} 
              placeholder="What would you like to discuss?" 
              required 
              className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              rows={4}
            ></textarea>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
              Publish Thread
            </button>
          </form>

          <div className="space-y-6">
            {threads.map((thread: any) => (
              <div 
                key={thread.id} 
                onClick={() => fetchThreadDetail(thread.id)} 
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-2">{thread.title}</h2>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">{thread.content}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>By {thread.author?.name || 'Alumni'}</span>
                  <span>{thread._count?.replies || 0} replies</span>
                </div>
              </div>
            ))}
            {threads.length === 0 && (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No discussion threads found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}