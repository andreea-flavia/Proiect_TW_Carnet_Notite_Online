import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SharedNotesWithFriends = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [emailInvite, setEmailInvite] = useState('');
    const [activeNote, setActiveNote] = useState(null); 
    const [collaborators, setCollaborators] = useState([]); // State pentru colegii cu acces
    const userId = localStorage.getItem('user_id');

    // 1. Preluăm notițele recente
    useEffect(() => {
        const fetchRecent = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`http://localhost:9000/api/user/${userId}/notes`);
                const fetched = Array.isArray(res.data.myNotes) ? res.data.myNotes : (Array.isArray(res.data) ? res.data : []);
                setNotes(fetched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error("Error fetching recent notes:", err);
            }
        };
        fetchRecent();
    }, [userId]);

    // 2. Preluăm colaboratorii când se schimbă notița selectată
    useEffect(() => {
        const fetchCollaborators = async () => {
            if (!activeNote) {
                setCollaborators([]); // Resetăm dacă e exemplul hardcodat
                return;
            }
            try {
                const res = await axios.get(`http://localhost:9000/api/note/${activeNote.note_id}/collaborators`);
                setCollaborators(res.data);
            } catch (err) {
                console.error("Error fetching collaborators:", err);
            }
        };
        fetchCollaborators();
    }, [activeNote]);

    const microNote = {
        title: "Curs Microeconomie",
        isHardcoded: true,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPBIyb4FrRRgJlCYKN8Ji77p62u1WpdqCiit3wRtLvXWcuiLdxUBSqre7LU1NwM9mtb8W2_ouXIH4Sb-sYS-LO8EueX357rROI4zy9_FHdbCftQjDpUgar34KP7XxyehN9cK3NTd_3Z4Tl1qisfVb5qal8sVl2XF3jLSfheTAvaBoh_tGkSdZNFZCwk432BVJ-DCA-spA2fVDwlDYOSAokIrDcSc_RYm_HPEu08WeRdUFd0t6cnBc2ClYa6p50pewbaILKM1HaOp1z",
        banner: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaJX7Yjxs8QPyjZ-Y0WR_m_kxb4df6FIUkqtUWzrX5zyDsPvfzAUzQAZWQk8bOG3WXLG5qQK8J_txlh_Sip1SQClv6ns2t2TOS1FysBK8DFeKlcEbvPJe7B8xqj99L0xV78GWKrKsRSfb3j_gTiaCmXmKn1z21KQ9HPSBbh-hHfnAMqZfJ_mflxfOWgMFAOwSLHYNVlXS1L2OqFyqXqAvRxmXxfuQJUBi4VpdJU679sYyNHnx0n9DtjplbSHo_WX8A6SDErjxywYDZ"
    };

    const displayNote = activeNote || microNote;

    // 3. Funcția de Invitare (Functionalitate de bază)
    const handleInvite = async () => {
        if (!emailInvite.trim()) {
            alert("Te rugăm să introduci o adresă de email.");
            return;
        }

        if (!activeNote) {
            alert("Te rugăm să selectezi o notiță reală din listă pentru a invita colegi.");
            return;
        }

        try {
            // Trimitem cererea la backend
            const response = await axios.post('http://localhost:9000/api/note/share', {
                note_id: activeNote.note_id,
                email: emailInvite,
                owner_id: userId
            });

            alert(`Invitația a fost trimisă cu succes către ${emailInvite}!`);
            setEmailInvite('');
            
            // Reîncărcăm lista de colaboratori pentru a include noua persoană
            const updatedCollab = await axios.get(`http://localhost:9000/api/note/${activeNote.note_id}/collaborators`);
            setCollaborators(updatedCollab.data);

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Eroare la trimiterea invitației.";
            alert(errorMsg);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
            <div className="flex flex-col h-screen">
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-50">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
                                <span className="material-symbols-outlined">auto_stories</span>
                            </div>
                            <h2 className="text-xl font-extrabold tracking-tight text-primary">StudioTeca</h2>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-primary/20 overflow-hidden">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz7XR7CUg0IWC4WjX0PGjIJEHi48zoTg0h6qYSfw6i9ljalToZukZKlw2HdPA6XS2v2HW1zg4iZiVESX2oz3XmERVW-whl7Uihvh6lEXNyXN7xN0khnS2pd1IxwaiGbMPftyp06SKK160vX_l01XEBz9ZOhj5r2cnMKVw5uhp3OQOtHVPPsTnSN_afGsYwup7ngQyFdOqhaE0d_RgLgx2Ck1JT--6lhNoffyzhwXel8dhE4EgsMr9_NRbrHo3N4XPjsiH6IHaDTK8F" alt="User" />
                    </div>
                </header>

                <main className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar */}
                    <aside className="w-80 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto hidden md:flex flex-col">
                        <div className="p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Notițe Recente</h3>
                            <div className="space-y-3">
                                <div onClick={() => setActiveNote(null)} className={`group cursor-pointer p-3 rounded-xl border transition-all ${!activeNote ? 'bg-white dark:bg-background-dark border-primary/20 shadow-soft-purple sidebar-item-active' : 'border-transparent hover:bg-white'}`}>
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img className="w-full h-full object-cover" src={microNote.img} alt="Micro" />
                                        </div>
                                        <div className="flex flex-col justify-center min-w-0">
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{microNote.title}</h4>
                                            <p className="text-xs text-primary font-medium mt-0.5">Exemplu</p>
                                        </div>
                                    </div>
                                </div>

                                {notes.map(n => (
                                    <div key={n.note_id} onClick={() => setActiveNote(n)} className={`group cursor-pointer p-3 rounded-xl border transition-all ${activeNote?.note_id === n.note_id ? 'bg-white dark:bg-background-dark border-primary/20 shadow-soft-purple sidebar-item-active' : 'border-transparent hover:bg-white'}`}>
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <span className={`material-symbols-outlined ${activeNote?.note_id === n.note_id ? 'text-primary' : 'text-slate-400'}`}>description</span>
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 truncate">{n.title || n.note_title}</h4>
                                                <p className="text-xs text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Workspace */}
                    <section className="flex-1 bg-white dark:bg-background-dark overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-8">
                            <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-400">
                                <button onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors">Dashboard</button>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">Distribuie Notițe</span>
                            </nav>

                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-1 overflow-hidden">
                                <div className="relative h-48 rounded-t-xl overflow-hidden bg-primary/5">
                                    <img className="w-full h-full object-cover opacity-60" src={displayNote.isHardcoded ? displayNote.banner : "https://lh3.googleusercontent.com/aida-public/AB6AXuCaJX7Yjxs8QPyjZ-Y0WR_m_kxb4df6FIUkqtUWzrX5zyDsPvfzAUzQAZWQk8bOG3WXLG5qQK8J_txlh_Sip1SQClv6ns2t2TOS1FysBK8DFeKlcEbvPJe7B8xqj99L0xV78GWKrKsRSfb3j_gTiaCmXmKn1z21KQ9HPSBbh-hHfnAMqZfJ_mflxfOWgMFAOwSLHYNVlXS1L2OqFyqXqAvRxmXxfuQJUBi4VpdJU679sYyNHnx0n9DtjplbSHo_WX8A6SDErjxywYDZ"} alt="Banner" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 text-white">
                                        <div>
                                            <h1 className="text-3xl font-extrabold mb-1">{displayNote.title || displayNote.note_title}</h1>
                                            <p className="text-white/80 text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">group</span>
                                                Gestionat de tine & {collaborators.length} colegi
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Adaugă persoane</h3>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">alternate_email</span>
                                                <input 
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-xl outline-none transition-all" 
                                                    placeholder="Introduceți email-ul colegului..." 
                                                    type="email"
                                                    value={emailInvite}
                                                    onChange={(e) => setEmailInvite(e.target.value)}
                                                />
                                            </div>
                                            <button 
                                                onClick={handleInvite}
                                                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
                                            >
                                                <span>Invită</span>
                                                <span className="material-symbols-outlined text-base">send</span>
                                            </button>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 dark:border-slate-800"/>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Colegi cu acces</h3>
                                        
                                        {/* Randare dinamică a colaboratorilor */}
                                        {collaborators.length > 0 ? collaborators.map(collab => (
                                            <div key={collab.user_id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-primary">
                                                        {collab.user_first_name[0]}{collab.user_last_name[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">{collab.user_first_name} {collab.user_last_name}</h4>
                                                        <p className="text-xs text-slate-400">{collab.email}</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 text-xs font-bold rounded-full">Acces Vizualizare</span>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-slate-400 italic">Niciun coleg adăugat încă.</p>
                                        )}

                                        {/* Rândul Proprietarului (Mereu prezent) */}
                                        <div className="flex items-center justify-between p-3 rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">TU</div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Tu (Proprietar)</h4>
                                                    <p className="text-xs text-slate-400">student.me@stud.ase.ro</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Proprietar</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                        Doar persoanele cu acces pot vedea această notiță
                                    </div>
                                    <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm transition-transform active:scale-95">
                                        Finalizează
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default SharedNotesWithFriends;