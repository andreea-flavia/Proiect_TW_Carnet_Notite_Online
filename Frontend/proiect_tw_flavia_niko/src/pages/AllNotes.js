import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
                    Subject: n.subject || n.Subject,
                    tags: n.tags || n.Tags || []
                }));

                // console.log("Prima nota normalizata:", normalized[0]);

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

    // sortare dupa titlu sau data
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (sortOrder === 'none') return 0;

        if (sortOrder === 'date_desc' || sortOrder === 'date_asc') {
            const ta = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const tb = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return sortOrder === 'date_desc' ? tb - ta : ta - tb;
        }

        const ta = (a.note_title || '').toLowerCase();
        const tb = (b.note_title || '').toLowerCase();
        if (ta < tb) return sortOrder === 'title_asc' ? -1 : 1;
        if (ta > tb) return sortOrder === 'title_asc' ? 1 : -1;
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
                    <div className="flex flex-col overflow-hidden mb-8"> 
                        <h1 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">
                            Ace your exams!
                        </h1>
                        <p className="text-text-sub dark:text-gray-400 text-xs font-normal leading-normal truncate">
                            You are the best!
                        </p>
                    </div>
                    <nav className="flex flex-col gap-1 grow">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-white hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group"
                            >
                            <span className="material-symbols-outlined text-[22px] text-text-main dark:text-white group-hover:text-primary transition-colors">
                                dashboard
                            </span>
                            <span className="text-sm font-medium">Dashboard</span>
                            </button>
                        <button 
                        onClick={() => navigate('/all-notes')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group"
                        >
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary">description</span>
                        <span className="text-sm font-medium">My Notes</span>
                        </button>
                        <button
                        onClick={() => navigate('/favorites')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors"
                        >
                        <span className="material-symbols-outlined">star</span>
                        <span className="text-sm font-medium">Favorites</span>
                        </button>
                        <button
                        onClick={() => navigate('/sharenoteswithfriends')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group"
                        >
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary">group_add</span>
                        <span className="text-sm font-medium">Share with Friends</span>
                        </button>
                        <button
                        onClick={() => navigate('/studygroups')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group"
                        >
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary">groups</span>
                        <span className="text-sm font-medium">Study Groups</span>
                        </button>
                        <div className="my-4 border-t border-[#cfe7d3] dark:border-gray-800" />
                        <Link 
                        to="/newnotes" 
                        className="flex w-full items-center justify-center gap-2 rounded-xl h-12 bg-primary hover:bg-[#cfe7d3] transition-all duration-300 text-white hover:text-[#2d4a31] text-sm font-bold shadow-lg shadow-primary/10 mt-2 group border border-transparent hover:border-[#b8d9bc]"
                        >
                        <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">
                            add
                        </span>
                        <span>Create New Note</span>
                        </Link>
                        
                    </nav>
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
                                <option value="title_asc">Sort by Title (A → Z)</option>
                                <option value="title_desc">Sort by Title (Z → A)</option>
                                <option value="date_desc">Sort by Date (Newest)</option>
                                <option value="date_asc">Sort by Date (Oldest)</option>
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

                                </div>

                                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors"><Highlight text={n.note_title} query={headerSearch} /></h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                                    <Highlight text={n.note_content && (n.note_content.length > 200 ? n.note_content.substring(0, 197) + '...' : n.note_content)} query={headerSearch} />
                                </p>
                                
                                    {/* TAGS */}
                                    <div className="flex flex-wrap gap-2 mb-4 mt-2">
                    {n.tags && n.tags.length > 0 ? (
                        n.tags.map((t) => {
                            // ADAUGA ACEST LOG AICI:
                            console.log(`Nota: ${n.note_title} | Tag: ${t.tag_name} | Culoare: "${t.tag_desc}"`);
                            
                            return (
                                <span
                                    key={t.tag_id}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-transform hover:scale-105"
                                    style={{
                                        backgroundColor: `${t.tag_desc}15`, 
                                        color: t.tag_desc,
                                        borderColor: `${t.tag_desc}40`
                                    }}
                                >
                                    #{t.tag_name}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">
                            No tags
                        </span>
                    )}
                </div>
                                    {/*  */}
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