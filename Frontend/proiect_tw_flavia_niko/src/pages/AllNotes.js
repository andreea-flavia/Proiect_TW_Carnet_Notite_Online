import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllNotes = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [userName, setUserName] = useState('User');

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const notesRes = await axios.get(`http://localhost:9000/api/user/${userId}/notes`);

                if (notesRes.data && notesRes.data.Notes) {
                setNotes(notesRes.data.Notes); 
                } else {
                setNotes(Array.isArray(notesRes.data) ? notesRes.data : []);
                }
            } catch (err) {
                // console.error("Error fetching data:", err);
            }
            };
        fetchData();
    }, [userId]);

    // Logica de filtrare
    const filteredNotes = notes.filter(n => {
        const matchesSearch = n.note_title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || n.Subject?.subject_name === selectedSubject;
        return matchesSearch && matchesSubject;
    });

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
                    <button onClick={() => navigate('/new-note')} className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all">
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative min-w-[140px]">
                            <select 
                                className="w-full pl-4 pr-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary appearance-none dark:text-slate-100"
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="All">All Subjects</option>
                                {subjects.map(s => (
                                    <option key={s.subject_id} value={s.subject_name}>{s.subject_name}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">expand_more</span>
                        </div>
                    </div>
                </header>

                {/* GRID DE NOTITE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map(n => (
                            <div key={n.note_id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-purple-500/5 transition-all group relative">
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
                                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{n.note_title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                                    {n.note_content}
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-xs text-slate-400">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="text-slate-400 hover:text-blue-500"><span className="material-symbols-outlined text-lg">edit</span></button>
                                        <button className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
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