import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllNotes = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [headerSearch, setHeaderSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [sortOrder, setSortOrder] = useState('none');
    const [userName, setUserName] = useState('User');

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const notesRes = await axios.get(`http://localhost:9000/api/user/${userId}/notes`);

                // backend returns a user object with `myNotes` array
                let fetched = [];
                if (notesRes.data && Array.isArray(notesRes.data.myNotes)) {
                    fetched = notesRes.data.myNotes;
                } else if (Array.isArray(notesRes.data)) {
                    fetched = notesRes.data;
                }

                // normalize fields so UI can keep using note_title / note_content
                const normalized = fetched.map(n => ({
                    ...n,
                    note_id: n.note_id,
                    note_title: n.title || n.note_title,
                    note_content: n.content || n.note_content,
                    Subject: n.subject || n.Subject
                }));

                setNotes(normalized);
            } catch (err) {
                // console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [userId]);

    // fetch subjects for dropdown
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get('http://localhost:9000/api/subject');
                if (Array.isArray(res.data)) setSubjects(res.data);
            } catch (e) {
                // ignore
            }
        };
        fetchSubjects();
    }, []);

    // Logica de filtrare
    const filteredNotes = notes.filter(n => {
        const title = (n.note_title || '').toString();
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || n.Subject?.subject_name === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    // sortare dupa titlu notitei
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (sortOrder === 'none') return 0;
        const ta = (a.note_title || '').toLowerCase();
        const tb = (b.note_title || '').toLowerCase();
        if (ta < tb) return sortOrder === 'asc' ? -1 : 1;
        if (ta > tb) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleDelete = async (e, noteId) => {
        e.stopPropagation();
        if (!window.confirm('Sigur vrei să ștergi această notiță?')) return;
        try {
            await axios.delete(`http://localhost:9000/api/note/${noteId}`);
            setNotes(prev => prev.filter(n => n.note_id !== noteId));
        } catch (err) {
            console.error('Failed to delete note', err);
            alert('Eroare la ștergere. Verifică consola.');
        }
    };

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
                {parts.map((p, i) => p.match ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/40">{p.text}</mark> : <span key={i}>{p.text}</span>)}
            </>
        );
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed inset-y-0 left-0 bg-white dark:bg-slate-900 z-10">
                <div className="p-6 text-indigo-900 dark:text-indigo-100">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {userName[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm leading-tight">{userName}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Student Account</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">dashboard</span>
                            <span>Dashboard</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium">
                            <span className="material-symbols-outlined text-[22px]">description</span>
                            <span>My Notes</span>
                        </button>
                    </nav>
                </div>
                <div className="mt-auto p-6">
                    <button onClick={() => navigate('/newnotes')} className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Note
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">My Notes</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and organize your course materials</p>
                        </div>
                        <button className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" onClick={() => document.documentElement.classList.toggle('dark')}>
                            <span className="material-symbols-outlined">dark_mode</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[300px]">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input 
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary dark:text-slate-100" 
                                placeholder="Search by title..." 
                                type="text"
                                onChange={(e) => { setSearchTerm(e.target.value); setHeaderSearch(e.target.value); }}
                            />
                        </div>
                        <div className="relative min-w-[140px]">
                            <select 
                                className="w-full pl-4 pr-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary appearance-none dark:text-slate-100"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="All">All Subjects</option>
                                {subjects.map(s => (
                                    <option key={s.subject_id} value={s.subject_name}>{s.subject_name}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">expand_more</span>
                        </div>

                        <div className="relative min-w-[160px]">
                            <select
                                className="w-full pl-4 pr-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary appearance-none dark:text-slate-100"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="none">Sort: None</option>
                                <option value="asc">Sort by Title (A → Z)</option>
                                <option value="desc">Sort by Title (Z → A)</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">sort</span>
                        </div>
                    </div>
                </header>

                {/* GRID DE NOTITE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedNotes.length > 0 ? (
                        sortedNotes.map(n => (
                            <div key={n.note_id} onClick={() => navigate(`/note/${n.note_id}`)} className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-purple-500/5 transition-all group relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined text-base">science</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {n.Subject?.subject_name || "General"}
                                        </span>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors"><Highlight text={n.note_title} query={headerSearch} /></h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                                    <Highlight text={n.note_content && (n.note_content.length > 200 ? n.note_content.substring(0, 197) + '...' : n.note_content)} query={headerSearch} />
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-xs text-slate-400">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/editnote/${n.note_id}`); }} className="text-slate-400 hover:text-blue-500"><span className="material-symbols-outlined text-lg">edit</span></button>
                                        <button onClick={(e) => handleDelete(e, n.note_id)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-slate-400">
                            No notes found for your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AllNotes;