import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllStudyGroups = () => {
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', desc: '' });
    
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    // Date utilizator (hardcoded sau din context/localStorage)
    const user_first_name = localStorage.getItem('user_first_name') || 'Student';
    const user_last_name = localStorage.getItem('user_last_name') || '';

    useEffect(() => {
        fetchGroups();
    }, []);

const fetchGroups = async () => {
    try {
        const res = await axios.get(`http://localhost:9000/api/user/${userId}/groups`);
        // console.log("Groups loaded:", res.data); // Ar trebui sa vezi un array de obiecte
        setGroups(res.data); 
    } catch (err) {
        console.error("Fetch error:", err);
    }
};

    const handleJoin = async () => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            alert("Error: You must be logged in to join a group.");
            return;
        }
        if (!joinCode || joinCode.trim().length < 4) {
            alert("Please enter a valid invitation code.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:9000/api/group/member', {
                user_id: userId,
                group_code: joinCode.trim()
            });
            if (res.status === 201 || res.status === 200) {
                alert("Successfully joined the study group!");
                setJoinCode('');
                fetchGroups(); 
            }
        } catch (err) {
            console.error("Join group error:", err.response?.data);
            const errorMessage = err.response?.data?.error || "An error occurred while joining the group.";
            alert(errorMessage);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id'); 

        if (!userId) {
            alert("Errow with user!");
            return;
        }
        const groupPayload = {
            group_name: newGroup.name,
            group_desc: newGroup.desc,
            created_by: userId 
        };
        try {
            // console.log("Se trimit datele catre server:", groupPayload);
            const res = await axios.post('http://localhost:9000/api/group', groupPayload);
            alert(`Group created! Acces code: ${res.data.group_code}`);
            setShowCreateModal(false);
            setNewGroup({ name: '', desc: '' });
            fetchGroups();
        } catch (err) {
            alert("Error creating group!");
            alert("Error creating group! Check console!");
        }
    };

    const filteredGroups = groups.filter(g => 
        g.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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



    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#131118] dark:text-white font-display">
            {/* Sidebar*/}
            <aside className="w-64 h-full hidden lg:flex flex-col border-r border-[#cfe7d3] dark:border-gray-800 bg-surface-light dark:bg-background-dark p-4 shrink-0 transition-all">
                <div className="flex items-center gap-3 mb-8 px-2 mt-2">
                <div className="flex flex-col overflow-hidden">
                    <h1 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">StudioTeca</h1>
                    <p className="text-text-sub dark:text-gray-400 text-xs font-normal leading-normal truncate">Ace your exams!</p>
                </div>
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
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span className="text-sm font-medium">Calendar</span>
                </a>
                <button
                    onClick={() => navigate('/favorites')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors"
                >
                    <span className="material-symbols-outlined">star</span>
                    <span className="text-sm font-medium">Favorites</span>
                </button>
                {/* BUTONUL ADAUGAT INAPOI */}
                <button
                    onClick={() => navigate('/ShareNotesWithFriends')}
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
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                {/* Search Bar Top */}
                <div className="w-full px-8 pt-6 pb-4">
                    <div className="relative max-w-2xl mx-auto">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#706189]">search</span>
                        <input 
                            className="w-full pl-12 pr-4 py-3 rounded-full border-none bg-white dark:bg-[#1f1a29] shadow-sm focus:ring-2 focus:ring-primary text-base outline-none transition-all" 
                            placeholder="Search your groups by name..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <hr className="w-full border-t border-gray-200 dark:border-gray-800" />

                <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col xl:flex-row gap-10">
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-5xl font-black tracking-tight leading-tight">My Study Groups</h2>
                                <p className="text-[#706189] dark:text-gray-400 mt-2 text-lg">
                                    {groups.length === 0 ? (
                                        "You haven't joined any communities yet"
                                    ) : (
                                        `You are active in ${groups.length} ${groups.length === 1 ? 'community' : 'communities'}`
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredGroups.map((g) => (
                                <div key={g.group_id} className="group bg-white dark:bg-[#1f1a29] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/20">
                                    <div className="h-44 bg-gradient-to-br from-primary to-[#4c1d95] flex items-center justify-center relative overflow-hidden">
                                        
                                        <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
                                        
                                        <span className="material-symbols-outlined text-7xl text-white/30 group-hover:scale-110 group-hover:text-white/50 transition-all duration-500 relative z-10">
                                            groups
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                <Highlight text={g.group_name} query={searchQuery} />
                                            </h3>
                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                                                Member
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#706189] dark:text-gray-400 mt-2 line-clamp-2">
                                            <Highlight 
                                                text={g.group_desc || "No description provided."} 
                                                query={searchQuery} 
                                            />
                                        </p>
                                        <div className="flex items-center gap-4 mt-4 text-xs font-bold text-primary bg-primary/5 w-fit px-3 py-1 rounded-lg">
                                            <span className="material-symbols-outlined text-sm">key</span>
                                            <span className="tracking-widest">{g.group_code}</span>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/group/${g.group_id}`)}
                                            className="w-full mt-6 py-3 rounded-xl bg-background-light dark:bg-white/5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
                                        >
                                            View Group
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sticky Sidebar (Join Panel) */}
                    <div className="w-80 shrink-0">
                        <div className="sticky top-10">
                            <div className="bg-white dark:bg-[#1f1a29] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden">
                                
                                {/* Section: CREATE */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-2">New Community</h3>
                                    <p className="text-sm text-[#706189] mb-6 leading-relaxed">
                                        Can't find your group? Create one for your classmates.
                                    </p>
                                    <button 
                                        onClick={() => setShowCreateModal(true)}
                                        className="w-full bg-primary text-white px-6 py-4 rounded-xl text-base font-bold shadow-md hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                        Create Group
                                    </button>
                                </div>

                                {/* Divider Line */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 flex-1"></div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                                    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 flex-1"></div>
                                </div>

                                {/* Section: JOIN */}
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Join a Group</h3>
                                    <p className="text-sm text-[#706189] mb-6 leading-relaxed">
                                        Enter the code shared by your colleagues.
                                    </p>
                                    <div className="space-y-4">
                                        <input 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none text-sm font-mono text-center tracking-widest" 
                                            placeholder="CODE24" 
                                            type="text"
                                            maxLength={10}
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                        />
                                        <button 
                                            onClick={handleJoin}
                                            className="w-full bg-white dark:bg-white/5 text-primary border-2 border-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">login</span>
                                            Join Now
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Group Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-[#1f1a29] rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                            <h3 className="text-2xl font-black mb-2">Create Study Group</h3>
                            <p className="text-gray-500 mb-6">Start a new learning community</p>
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold mb-1 block ml-1 text-gray-700 dark:text-gray-300">Group Name</label>
                                    <input 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        value={newGroup.name}
                                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold mb-1 block ml-1 text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
                                        value={newGroup.desc}
                                        onChange={(e) => setNewGroup({...newGroup, desc: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 rounded-xl font-bold border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20">Create Group</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AllStudyGroups;