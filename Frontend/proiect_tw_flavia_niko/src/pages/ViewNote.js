import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const navigate = useNavigate();
  const [userFirst, setUserFirst] = useState('');
  const [userLast, setUserLast] = useState('');
  const user_id = localStorage.getItem('user_id');
  const [searchQuery, setSearchQuery] = useState('');

  const Highlight = ({ text, query }) => {
    if (!text) return null;
    if (!query) return <>{text}</>;
    const lower = text.toLowerCase();
    const q = query.toLowerCase();
    const parts = [];
    let start = 0;
    let idx = lower.indexOf(q, start);
    while (idx !== -1) {
      if (idx > start) parts.push({ text: text.slice(start, idx), match: false });
      parts.push({ text: text.slice(idx, idx + q.length), match: true });
      start = idx + q.length;
      idx = lower.indexOf(q, start);
    }
    if (start < text.length) parts.push({ text: text.slice(start), match: false });
    return (
      <>
        {parts.map((p, i) => (p.match ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/40">{p.text}</mark> : <span key={i}>{p.text}</span>))}
      </>
    );
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/note/${id}/details`);
        setNote(res.data);
      } catch (e) {
        console.error('Failed to load note', e);
      }
    };
    fetchNote();
    // fetch user name for header
    const fetchUser = async () => {
      try{
        if(!user_id) return;
        const r = await axios.get(`http://localhost:9000/api/user/${user_id}`);
        if(r.data){ setUserFirst(r.data.user_first_name || ''); setUserLast(r.data.user_last_name || ''); }
      } catch(e){ }
    }
    fetchUser();
  }, [id]);

  if (!note) return <div className="min-h-screen flex items-center justify-center">Loading note...</div>;

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
      <aside className="w-64 h-full hidden lg:flex flex-col border-r border-[#cfe7d3] dark:border-gray-800 bg-surface-light dark:bg-background-dark p-4 shrink-0">
        <div className="flex items-center gap-3 mb-6 px-2 mt-2">
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">StudioTeca</h1>
            <p className="text-text-sub dark:text-gray-400 text-xs font-normal leading-normal truncate">Your notes at a glance</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-white hover:bg-accent-green transition-colors">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          <button onClick={() => navigate('/all-notes')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
            <span className="material-symbols-outlined">description</span>
            <span className="text-sm font-medium">My Notes</span>
          </button>

          <button onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
            <span className="material-symbols-outlined">class</span>
            <span className="text-sm font-medium">Courses</span>
          </button>

          <button onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="text-sm font-medium">Calendar</span>
          </button>

          <button onClick={() => navigate('/all-notes')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
            <span className="material-symbols-outlined">star</span>
            <span className="text-sm font-medium">Favorites</span>
          </button>

        </nav>

        <div className="my-4 border-t border-[#cfe7d3] dark:border-gray-800" />
        <p className="px-3 text-xs font-semibold text-text-sub dark:text-gray-500 uppercase tracking-wider mb-1">Tags</p>
        <button onClick={() => navigate('/all-notes')} className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-sm font-medium">#ExamPrep</span>
        </button>
        <button onClick={() => navigate('/all-notes')} className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-sm font-medium">#Homework</span>
        </button>
        <button onClick={() => navigate('/all-notes')} className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-sm font-medium">#Research</span>
        </button>

        <div className="mt-auto flex flex-col gap-2">
          <button onClick={() => navigate('/trash')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
            <span className="material-symbols-outlined">delete</span>
            <span className="text-sm font-medium">Trash</span>
          </button>
          <button onClick={() => navigate('/settings')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button onClick={() => navigate('/newnotes')} className="flex w-full items-center justify-center gap-2 rounded-lg h-12 bg-primary hover:bg-[#0fd630] transition-colors text-text-main text-sm font-bold shadow-sm mt-2">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create New Note</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Highlight helper */}
        {false /* placeholder to keep helper below in file scope */}
        <header className="h-16 shrink-0 border-b border-[#cfe7d3] dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h2 className="text-lg font-bold"><Highlight text={note.title} query={searchQuery} /></h2>
              <div className="text-xs text-slate-500">{note.subject?.subject_name || 'General'} • {new Date(note.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block w-[420px]">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-text-sub dark:text-gray-500">search</span>
                </div>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white dark:bg-surface-dark text-text-main dark:text-white placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm shadow-sm" placeholder="Search your notes..." type="text" />
              </div>
            </div>

            <button title="Toggle theme" onClick={() => document.documentElement.classList.toggle('dark')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>

            <button title="Notifications" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <p className="hidden sm:block text-sm font-semibold">{userFirst ? `${userFirst} ${userLast}` : 'Account'}</p>
              <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8" />
            </div>
          </div>
        </header>

          <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 shadow">
              <div className="prose dark:prose-invert max-w-full">
                <p><Highlight text={note.content} query={searchQuery} /></p>
              </div>

            {note.resources && note.resources.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                  {note.resources.map(r => (
                    <li key={r.resource_id}><a className="text-primary" href={r.resource_url} target="_blank" rel="noreferrer">{r.resource_name || r.resource_url}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewNote;
