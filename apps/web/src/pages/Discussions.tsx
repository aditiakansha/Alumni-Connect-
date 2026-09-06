import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '../components/AppShell';

interface Author { name?: string; }

interface Thread {
  id: string;
  title: string;
  content: string;
  author?: Author;
  category?: string;
  tag?: string;
  upvotes?: number;
  _count?: { replies?: number };
}

interface Reply { id: string; content: string; author?: Author; }
interface ThreadDetail extends Thread { replies?: Reply[]; }

const CATEGORIES = ['All Topics', 'Career Advice', 'Tech & AI', 'Relocation'];

const AVATAR_COLORS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600' },
  { bg: 'bg-blue-100', text: 'text-blue-600' },
];

function avatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function tagStyle(tag: string) {
  if (tag.toLowerCase() === 'pinned') return 'bg-slate-100 text-slate-600';
  if (tag.toLowerCase() === 'ama') return 'bg-purple-50 text-purple-600';
  return 'bg-slate-100 text-slate-600';
}

export default function Discussions() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<ThreadDetail | null>(null);
  const [threadForm, setThreadForm] = useState({ title: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Topics');

  useEffect(() => { fetchThreads(); }, []);

  const fetchThreads = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/discussions', { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setThreads(await response.json());
  };

  const fetchThreadDetail = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/discussions/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setActiveThread(await response.json());
  };

  const handleThreadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content: replyContent })
    });
    if (response.ok) {
      setReplyContent('');
      fetchThreadDetail(activeThread.id);
    } else {
      alert('Failed to post reply.');
    }
  };

  const filteredThreads = useMemo(() => {
    if (activeCategory === 'All Topics') return threads;
    return threads.filter((t) => (t.category || '').toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]));
  }, [threads, activeCategory]);

  return (
    <AppShell>
      {activeThread ? (
        <div className="px-5 pt-6">
          <button onClick={() => setActiveThread(null)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-6 inline-block">
            ← Back to All Discussions
          </button>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{activeThread.title}</h2>
            <p className="text-slate-500 text-sm mb-4">Posted by {activeThread.author?.name || 'Alumni'}</p>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">{activeThread.content}</p>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-3">Replies</h3>

          <form onSubmit={handleReplySubmit} className="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-slate-200">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              required
              className="border border-slate-200 p-2.5 rounded-lg w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            ></textarea>
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">
              Post Reply
            </button>
          </form>

          <div className="space-y-3">
            {activeThread.replies?.map((reply) => {
              const name = reply.author?.name || 'Alumni';
              const avatar = avatarStyle(name);
              return (
                <div key={reply.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatar.bg} ${avatar.text}`}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-800 text-xs font-semibold mb-1">{name}</p>
                    <p className="text-slate-700 whitespace-pre-wrap text-sm">{reply.content}</p>
                  </div>
                </div>
              );
            })}
            {(!activeThread.replies || activeThread.replies.length === 0) && (
              <p className="text-slate-500 text-sm">No replies yet. Be the first to reply!</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="px-5 pt-5 mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                placeholder="Search topics, questions, alumni..."
                className="w-full bg-white border border-slate-200 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="px-5 mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="px-5 mb-8">
            <form onSubmit={handleThreadSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">Y</div>
                <p className="text-sm font-semibold text-slate-800">Start a Discussion</p>
                <span className="ml-auto text-xs text-slate-400">Alumni Chapter • 24-000</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">General</span>
              </div>
              <input
                type="text"
                value={threadForm.title}
                onChange={(e) => setThreadForm({ ...threadForm, title: e.target.value })}
                placeholder="Discussion Title"
                required
                className="border border-slate-200 p-2.5 rounded-lg w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={threadForm.content}
                onChange={(e) => setThreadForm({ ...threadForm, content: e.target.value })}
                placeholder="What would you like to discuss? Share insights, ask career questions, or ask for guidance..."
                required
                className="border border-slate-200 p-2.5 rounded-lg w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              ></textarea>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-slate-400 text-lg">
                  <span>📎</span>
                  <span>😊</span>
                </div>
                <button type="submit" className="flex items-center gap-1.5 bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors font-semibold text-sm">
                  Publish Thread →
                </button>
              </div>
            </form>
          </div>

          <div className="px-5 mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-500 font-semibold tracking-wide text-xs uppercase">Community Threads</span>
            <div className="flex gap-3 text-xs font-medium">
              <span className="text-slate-400">Trending</span>
              <span className="text-indigo-600">Recent</span>
            </div>
          </div>

          <div className="px-5 space-y-4">
            {filteredThreads.map((thread) => {
              const name = thread.author?.name || 'Alumni';
              const avatar = avatarStyle(name);
              return (
                <div
                  key={thread.id}
                  onClick={() => fetchThreadDetail(thread.id)}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatar.bg} ${avatar.text}`}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        {thread.tag && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${tagStyle(thread.tag)}`}>{thread.tag}</span>
                        )}
                        {thread.category && <span className="text-[10px] text-slate-400 font-medium">{thread.category}</span>}
                      </div>
                      <h2 className="text-base font-bold text-slate-900 leading-snug">{thread.title}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">{name}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2 mb-3">{thread.content}</p>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">▲ {thread.upvotes ?? 0} upvotes</span>
                    <span>{thread._count?.replies ?? 0} replies</span>
                  </div>
                </div>
              );
            })}

            {filteredThreads.length === 0 && (
              <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                No discussion threads found.
              </div>
            )}
          </div>

          {threads.length > 0 && (
            <div className="text-center mt-6 text-sm">
              <p className="text-slate-400 mb-1">You're all caught up on top discussions.</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-800">Load archived threads</button>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}