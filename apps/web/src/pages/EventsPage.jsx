import React, { useState } from 'react';
import { Calendar, Users, CheckCircle2, Plus, Clock, MapPin, X, Edit3, Trash2, HeartHandshake, ShieldCheck, Mail, Hash } from 'lucide-react';
import { fetchApi, formatDate } from '../lib/api';

const INITIAL_EVENTS = [
  {
    id: 'e1',
    title: 'SCOPE HackFest 2026',
    category: 'Hackathon',
    date: 'Oct 14 - 16, 2026',
    time: '48 Hours Live',
    location: 'Tech Park Hall & Virtual',
    organizer: 'VIT SCOPE Alumni Chapter',
    description: 'Build production-ready agentic AI workflows and distributed tools. Over ₹2.5L in prize pools and fast-track interviews with alumni-led startups.',
    capacity: 350,
    registeredCount: 284,
    tags: ['AI/ML', 'Web3', 'Cloud']
  },
  {
    id: 'e2',
    title: 'Navigating Senior Engineering Roles',
    category: 'Workshop',
    date: 'Oct 22, 2026',
    time: '6:30 PM - 8:00 PM IST',
    location: 'Google Meet',
    organizer: 'Vivek Pandyarajan (Class of 2003)',
    description: 'An interactive technical deep-dive into distributed systems architecture, system design interviews, and transition paths to Staff/Principal roles.',
    capacity: 100,
    registeredCount: 89,
    tags: ['System Design', 'Careers', 'Leadership']
  },
  {
    id: 'e3',
    title: 'Alumni Founder & VC Mixer',
    category: 'Event',
    date: 'Nov 05, 2026',
    time: '5:00 PM onwards',
    location: 'Indiranagar, Bengaluru',
    organizer: 'Ashwini Purohit & Startup Circle',
    description: 'Curated networking evening for student founders, active alumni entrepreneurs, angel syndicates, and seed-stage operators.',
    capacity: 60,
    registeredCount: 52,
    tags: ['Startups', 'Fundraising', 'Networking']
  },
  {
    id: 'e4',
    title: 'VIT GreenTech Hackathon',
    category: 'Hackathon',
    date: 'Nov 21 - 22, 2026',
    time: '36 Hours Live',
    location: 'Vellore Campus & Virtual',
    organizer: 'VIT Sustainability Collective',
    description: 'Build practical solutions for clean energy, water conservation, and sustainable campus operations.',
    capacity: 240,
    registeredCount: 96,
    tags: ['Climate Tech', 'IoT', 'Sustainability']
  },
  {
    id: 'e5',
    title: 'Women in Technology Leadership Circle',
    category: 'Event',
    date: 'Dec 04, 2026',
    time: '6:00 PM - 8:00 PM IST',
    location: 'Chennai & Virtual',
    organizer: 'VIT Women Alumni Network',
    description: 'A candid evening of mentoring, career stories, and practical advice from technology leaders across the alumni network.',
    capacity: 120,
    registeredCount: 71,
    tags: ['Mentoring', 'Leadership', 'Community']
  }
];

const CATEGORIES = ['All', 'Hackathon', 'Workshop', 'Event'];

export default function EventsPage({ isAdmin }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sponsorEventTarget, setSponsorEventTarget] = useState(null);
  const [registerEventTarget, setRegisterEventTarget] = useState(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalForm, setProposalForm] = useState({ title: '', category: 'Hackathon', date: '', time: '', location: '', organizer: '', description: '', capacity: 100, tags: '' });

  // Student Registration Verification State
  const [regForm, setRegForm] = useState({
    regNumber: '',
    schoolEmail: ''
  });
  const [regError, setRegError] = useState('');

  // Event Form State (Admin)
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Hackathon',
    date: '',
    time: '',
    location: '',
    organizer: '',
    description: '',
    capacity: 100,
    tagsInput: 'AI, Web, Cloud'
  });

  // Sponsorship Form State (Public)
  const [sponsorForm, setSponsorForm] = useState({
    companyName: '',
    contactEmail: '',
    tier: 'Silver',
    message: ''
  });
  const currentUserId = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}').id; } catch { return null; } })();

  React.useEffect(() => {
    fetchApi('/events').then((apiEvents) => {
      if (apiEvents.length) {
        setEvents((current) => [...apiEvents.map((event) => ({
          ...event,
          category: event.type,
          date: formatDate(event.startDate),
          time: event.endDate ? `${formatDate(event.startDate)} - ${formatDate(event.endDate)}` : 'Details available after registration',
          organizer: 'AlumniConnect community',
          capacity: 0,
          registeredCount: 0,
          tags: event.isOnline ? ['Online'] : ['In person']
        })), ...current.filter((event) => String(event.id).startsWith('e'))]);
      }
    }).catch(() => {});
  }, []);

  const filteredEvents = events.filter(
    (e) => selectedCategory === 'All' || e.category === selectedCategory
  );

  // Registration Flow
  const handleRegisterClick = (item) => {
    if (registeredEvents.has(item.id)) {
      // Direct unregister toggle if already registered
      setRegisteredEvents((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      setEvents((evs) =>
        evs.map((ev) => (ev.id === item.id ? { ...ev, registeredCount: ev.registeredCount - 1 } : ev))
      );
    } else {
      // Prompt verification modal
      setRegError('');
      setRegForm({ regNumber: '', schoolEmail: '' });
      setRegisterEventTarget(item);
    }
  };

  const handleApiRsvp = async (item) => {
    try {
      await fetchApi(`/events/${item.id}/rsvp`, { method: 'POST', body: JSON.stringify({ status: 'GOING' }) });
      setRegisteredEvents((prev) => new Set(prev).add(item.id));
    } catch {
      handleRegisterClick(item);
    }
  };

  const handleVerifyAndRegister = (e) => {
    e.preventDefault();
    const email = regForm.schoolEmail.trim().toLowerCase();
    const regNo = regForm.regNumber.trim().toUpperCase();

    // Verification check for university email domain
    if (!email.endsWith('@vitstudent.ac.in') && !email.endsWith('@vit.ac.in')) {
      setRegError('Please provide a valid VIT student/campus email (@vitstudent.ac.in or @vit.ac.in).');
      return;
    }

    if (regNo.length < 8) {
      setRegError('Please enter a valid Registration Number (e.g. 21BCE1234).');
      return;
    }

    // Complete registration
    setRegisteredEvents((prev) => new Set(prev).add(registerEventTarget.id));
    setEvents((evs) =>
      evs.map((ev) =>
        ev.id === registerEventTarget.id ? { ...ev, registeredCount: ev.registeredCount + 1 } : ev
      )
    );

    setRegisterEventTarget(null);
  };

  // Admin Event Handlers
  const handleOpenEventModal = (item = null) => {
    if (!isAdmin) return;
    if (item) {
      setEditingId(item.id);
      setEventForm({
        title: item.title,
        category: item.category,
        date: item.date,
        time: item.time,
        location: item.location,
        organizer: item.organizer,
        description: item.description,
        capacity: item.capacity,
        tagsInput: item.tags ? item.tags.join(', ') : ''
      });
    } else {
      setEditingId(null);
      setEventForm({
        title: '',
        category: 'Hackathon',
        date: '',
        time: '',
        location: '',
        organizer: '',
        description: '',
        capacity: 100,
        tagsInput: 'AI, Web, Cloud'
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    const tagsArray = eventForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...eventForm,
                capacity: Number(eventForm.capacity),
                tags: tagsArray
              }
            : item
        )
      );
    } else {
      const newEvent = {
        ...eventForm,
        id: `ev-${Date.now()}`,
        registeredCount: 0,
        capacity: Number(eventForm.capacity),
        tags: tagsArray
      };
      setEvents([newEvent, ...events]);
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (item) => {
    if (!isAdmin && (!item.createdById || item.createdById !== currentUserId)) return;
    const id = item.id;
    if (window.confirm('Are you sure you want to remove this event?')) {
      const remove = () => setEvents((prev) => prev.filter((item) => item.id !== id));
      if (String(id).startsWith('submitted-')) {
        remove();
      } else {
        fetchApi(`/events/${id}`, { method: 'DELETE' }).then(remove).catch((error) => alert(error.message));
      }
    }
  };

  // Sponsorship Submission
  const handleSponsorSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank you! Sponsorship inquiry from "${sponsorForm.companyName}" for "${sponsorEventTarget.title}" (${sponsorForm.tier} Tier) has been received.`
    );
    setSponsorEventTarget(null);
    setSponsorForm({ companyName: '', contactEmail: '', tier: 'Silver', message: '' });
  };

  const handleProposalSubmit = (e) => {
    e.preventDefault();
    const submitted = { ...proposalForm, id: `submitted-${Date.now()}`, createdById: currentUserId, capacity: Number(proposalForm.capacity), registeredCount: 0, tags: proposalForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean) };
    setEvents((current) => [submitted, ...current]);
    setIsProposalOpen(false);
    setProposalForm({ title: '', category: 'Hackathon', date: '', time: '', location: '', organizer: '', description: '', capacity: 100, tags: '' });
  };

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#ffc002] block mb-2">
            Campus & Industry Connect
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#002148]">
            Events & Hackathons<span className="text-[#ffc002]">.</span>
          </h1>
        </div>

        <button
          onClick={() => setIsProposalOpen(true)}
          className="inline-flex items-center gap-2 border border-[#002148] text-[#002148] hover:bg-[#002148]/5 text-xs font-semibold px-5 py-3 rounded-2xl transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Suggest an event
        </button>
        {isAdmin && (
          <button
            onClick={() => handleOpenEventModal()}
            className="inline-flex items-center gap-2 bg-[#002148] hover:bg-[#001733] text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-[#002148]/20 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Post New Event
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#002148] text-white shadow-sm font-bold'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((item) => {
          const isRegistered = registeredEvents.has(item.id);
          const isFull = item.registeredCount >= item.capacity;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#002148]/5 text-[#002148] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#002148]/10">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Users className="w-3.5 h-3.5" />
                      <span>{item.registeredCount} / {item.capacity}</span>
                    </div>

                    {(isAdmin || (item.createdById && item.createdById === currentUserId)) && (
                      <div className="flex items-center gap-1">
                        {isAdmin && <button
                          onClick={() => handleOpenEventModal(item)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-[#002148] rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>}
                        <button
                          onClick={() => handleDeleteEvent(item)}
                          className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#002148] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-3">By {item.organizer}</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-2 text-xs text-slate-500 mb-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#002148]" />
                    <span className="font-medium text-slate-700">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ffc002]" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.tags?.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Register & Sponsor */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  disabled={isFull && !isRegistered}
                  onClick={() => (String(item.id).startsWith('e') ? handleRegisterClick(item) : handleApiRsvp(item))}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isRegistered
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : isFull
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#002148] hover:bg-[#001733] text-white shadow-md shadow-[#002148]/20 active:scale-95'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Registered (Click to Cancel)
                    </>
                  ) : isFull ? (
                    'Housefull'
                  ) : (
                    'Register for Event'
                  )}
                </button>

                <button
                  onClick={() => setSponsorEventTarget(item)}
                  className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold border border-slate-200 text-[#002148] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-[#ffc002]" />
                  <span>Sponsor this Event</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Registration Verification Popup */}
      {registerEventTarget && (
        <div className="fixed inset-0 z-50 bg-[#002148]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setRegisterEventTarget(null)}
              className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#002148]/10 text-[#002148] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#002148]">
                Student Verification
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Confirm your identity to register for{' '}
                <span className="font-bold text-[#002148]">{registerEventTarget.title}</span>.
              </p>
            </div>

            {regError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {regError}
              </div>
            )}

            <form onSubmit={handleVerifyAndRegister} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Registration Number</label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21BCE1042"
                    value={regForm.regNumber}
                    onChange={(e) => setRegForm({ ...regForm, regNumber: e.target.value.toUpperCase() })}
                    className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002148]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official VIT Student Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student.name@vitstudent.ac.in"
                    value={regForm.schoolEmail}
                    onChange={(e) => setRegForm({ ...regForm, schoolEmail: e.target.value })}
                    className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002148]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Accepts @vitstudent.ac.in domains only.</p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRegisterEventTarget(null)}
                  className="px-4 py-2.5 font-bold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold rounded-xl bg-[#002148] hover:bg-[#001733] text-white shadow-md shadow-[#002148]/20 transition-all active:scale-95"
                >
                  Verify & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isProposalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002148]/60 p-4">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <button onClick={() => setIsProposalOpen(false)} className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            <span className="eyebrow">Host something for the network</span>
            <h3 className="font-serif text-2xl font-bold text-[#002148]">Suggest an event or hackathon</h3>
            <p className="mt-1 text-xs text-slate-500">Share the details and the community can review your proposal.</p>
            <form onSubmit={handleProposalSubmit} className="mt-6 space-y-4">
              <input required className="form-input" placeholder="Event or hackathon title" value={proposalForm.title} onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-3"><select className="form-input" value={proposalForm.category} onChange={(e) => setProposalForm({ ...proposalForm, category: e.target.value })}><option>Hackathon</option><option>Workshop</option><option>Event</option></select><input required className="form-input" placeholder="Organizer name" value={proposalForm.organizer} onChange={(e) => setProposalForm({ ...proposalForm, organizer: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3"><input required className="form-input" placeholder="Date" value={proposalForm.date} onChange={(e) => setProposalForm({ ...proposalForm, date: e.target.value })} /><input required className="form-input" placeholder="Time" value={proposalForm.time} onChange={(e) => setProposalForm({ ...proposalForm, time: e.target.value })} /></div>
              <input required className="form-input" placeholder="Location or meeting link" value={proposalForm.location} onChange={(e) => setProposalForm({ ...proposalForm, location: e.target.value })} />
              <textarea required className="form-input min-h-28" placeholder="Tell us about the event" value={proposalForm.description} onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3"><input type="number" min="1" className="form-input" placeholder="Capacity" value={proposalForm.capacity} onChange={(e) => setProposalForm({ ...proposalForm, capacity: e.target.value })} /><input className="form-input" placeholder="Tags: AI, careers" value={proposalForm.tags} onChange={(e) => setProposalForm({ ...proposalForm, tags: e.target.value })} /></div>
              <button className="primary-button w-full justify-center"><Plus className="h-4 w-4" /> Submit proposal</button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Event Modal */}
      {isAdmin && isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002148]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-100">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#002148] mb-1">
              {editingId ? 'Edit Event / Hackathon' : 'Post New Event'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">Configure schedule, format, and seat quotas.</p>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SCOPE AI Hackathon 2026"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                    className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Nov 12, 2026"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 5:00 PM IST"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / Meeting URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SJT Hall 201 or Google Meet link"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Host / Organizer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ACM Student Chapter / Alumni Lead"
                  value={eventForm.organizer}
                  onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={eventForm.tagsInput}
                  onChange={(e) => setEventForm({ ...eventForm, tagsInput: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#002148] hover:bg-[#001733] text-white shadow-lg shadow-[#002148]/20 transition-all active:scale-95"
                >
                  {editingId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Sponsor Event Modal */}
      {sponsorEventTarget && (
        <div className="fixed inset-0 z-50 bg-[#002148]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSponsorEventTarget(null)}
              className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffc002] bg-[#002148] px-2.5 py-1 rounded-full">
                Sponsorship Pledge
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#002148] mt-2">
                Sponsor Event
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Partner with SCOPE for <span className="font-bold text-[#002148]">{sponsorEventTarget.title}</span>.
              </p>
            </div>

            <form onSubmit={handleSponsorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Acme Tech or Personal Alumni Pledge"
                  value={sponsorForm.companyName}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, companyName: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Corporate or Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="partner@company.com"
                  value={sponsorForm.contactEmail}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, contactEmail: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sponsorship Tier</label>
                <select
                  value={sponsorForm.tier}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value })}
                  className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="Bronze">Bronze Tier (₹25,000 / Brand Presence)</option>
                  <option value="Silver">Silver Tier (₹50,000 / Booth + Resume Access)</option>
                  <option value="Gold">Gold Tier (₹1,00,000 / Keynote + Mentorship Track)</option>
                  <option value="Title Sponsor">Title Sponsor (₹2,50,000 / Naming Rights)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Note / Custom Deliverables</label>
                <textarea
                  rows={3}
                  placeholder="Specific student domains you want to target, internship opportunities, or hardware donations..."
                  value={sponsorForm.message}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, message: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSponsorEventTarget(null)}
                  className="px-4 py-2.5 font-bold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold rounded-xl bg-[#002148] hover:bg-[#001733] text-white shadow-md shadow-[#002148]/20 transition-all active:scale-95"
                >
                  Submit Sponsorship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
