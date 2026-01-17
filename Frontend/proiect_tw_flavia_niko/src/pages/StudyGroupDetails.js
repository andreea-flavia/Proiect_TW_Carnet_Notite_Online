import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroupDetails = () => {
    const buttonHover = "hover:translate-x-1 transition-transform duration-200";
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Feed');
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredNotes = useMemo(() => {
        if (!groupData?.groupNotes) return [];
        return groupData.groupNotes.filter(n => {
            const title = (n.title || '').toString().toLowerCase();
            const content = (n.note_content || '').toString().toLowerCase();
            const term = searchTerm.toLowerCase();
            return title.includes(term) || content.includes(term);
        });
    }, [groupData, searchTerm]);

    const getSubjectColorVars = (subjectName) => {
        const name = subjectName || 'Subject';
        const subjectIndex = subjects.findIndex(s => (s.subject_name || s.subject_title) === name);
        let idx = subjectIndex;
        if (idx < 0) {
            let hash = 0;
            for (let i = 0; i < name.length; i += 1) {
                hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
            }
            idx = hash % 48; // plenty of unique hues
        }
        const hue = (idx * 137.508) % 360; // golden-angle distribution
        return {
            '--bar-color': `hsl(${hue} 70% 45%)`,
            '--badge-bg': `hsl(${hue} 85% 90% / 0.95)`,
            '--badge-text': `hsl(${hue} 60% 30%)`,
            '--badge-bg-dark': `hsl(${hue} 60% 22% / 0.7)`,
            '--badge-text-dark': `hsl(${hue} 85% 85%)`
        };
    };

    const isCurrentUserAdmin = useMemo(() => {
        const currentUserId = parseInt(localStorage.getItem('user_id'));
        return groupData?.members?.some(member =>
            member.user_id === currentUserId &&
            member.Group_Members?.role === 'ADMIN'
        ) || false;
    }, [groupData]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get('http://localhost:9000/api/subject');
                if (Array.isArray(res.data)) setSubjects(res.data);
            } catch (e) {
                console.error("Error fetching subjects:", e);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:9000/api/group/${groupId}/full`);

                // console.log("Date primite:", response.data);
                const data = response.data;
                if (data.groupNotes) {
                    data.groupNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                setGroupData(data);
                setLoading(false);
            } catch (err) {
                console.error("Eroare la incarcarea grupului", err);
                setLoading(false);
            }
        };

        if (groupId) {
            fetchDetails();
        }
    }, [groupId]);

    if (loading) return <div className="p-10 text-center font-bold">Loading group hub...</div>;
    if (!groupData) return <div className="p-10 text-center text-red-500">Group not found!</div>;

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await axios.delete(`http://localhost:9000/api/group/${groupId}/member/${memberId}`);
            setGroupData(prev => ({
                ...prev,
                members: prev.members.filter(m => m.user_id !== memberId)
            }));
            alert('Member removed successfully');
        } catch (err) {
            console.error('Error removing member:', err);
            alert('Failed to remove member');
        }
    };

    const handleLeaveGroup = async () => {
        const userId = localStorage.getItem('user_id');
        if (!window.confirm('Are you sure you want to leave this group?')) return;
        try {
            await axios.delete(`http://localhost:9000/api/group/${groupId}/member/${userId}`);
            alert('You have left the group.');
            navigate('/studygroups');
        } catch (err) {
            console.error('Error leaving group:', err);
            alert('Failed to leave group');
        }
    };

    const handleDeleteGroup = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this group? This action cannot be undone.');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:9000/api/group/${groupId}`);
                alert('Group deleted successfully.');
                navigate('/studygroups');
            } catch (e) {
                console.error('Error deleting group:', e);
                alert('Failed to delete group');
            }
        }
    };


    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#131118] dark:text-white">
            {/* Sidebar */}
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
                        <span className="material-symbols-outlined text-[22px] text-text-main dark:text-white group-hover:text-primary transition-colors">dashboard</span>
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group"
                    >
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary">star</span>
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
                        className={`flex w-full items-center justify-center gap-2 rounded-xl h-12 bg-primary hover:bg-[#cfe7d3] transition-all duration-300 text-white hover:text-[#2d4a31] text-sm font-bold shadow-lg shadow-primary/10 mt-2 group border border-transparent hover:border-[#b8d9bc] ${buttonHover}`}
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">
                            add
                        </span>
                        <span>Create New Note</span>
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar de sus */}
                <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-[#1f1a29]/80 backdrop-blur-md border-b border-[#dfdbe6] dark:border-[#2d243a] sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm text-[#706189] dark:text-gray-400 font-medium">
                            <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/studygroups')}>All Groups</span>
                            <span className="mx-2 material-symbols-outlined text-[16px]">chevron_right</span>
                            <span className="text-[#131118] dark:text-white font-bold">{groupData.group_name}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto flex gap-8">

                        {/* Middle Content: Feed */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-4xl font-black tracking-tight mb-2">{groupData.group_name}</h2>
                                    <p className="text-[#706189] dark:text-gray-400 text-lg">{groupData.group_desc}</p>
                                </div>
                                {/* <button className="bg-white dark:bg-[#1f1a29] border border-primary/20 hover:border-primary text-primary font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined">video_camera_front</span>
                                    Join Live Session
                                </button> */}
                            </div>

                            {/* Tabs Dinamice */}
                            <div className="border-b border-[#dfdbe6] dark:border-[#2d243a] flex gap-8">
                                {/* 'Feed', 'Resources', 'Members', 'Settings' */}
                                {['Feed', 'Settings'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-sm font-bold tracking-wide transition-all ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-[#706189] dark:text-gray-400 hover:text-primary'}`}
                                    >
                                        Group {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Notite Dinamice (Feed) */}
                            <div className="flex flex-col gap-4">
                                {/* Search Bar */}
                                {activeTab === 'Feed' && (
                                    <div className="relative w-full mb-2">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#706189] dark:text-gray-400">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search notes in this group..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#cfe7d3] dark:border-[#2d243a] bg-white dark:bg-[#1f1a29] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-[#706189]/50 dark:placeholder-gray-500"
                                        />
                                    </div>
                                )}

                                {/* Butonul de adaugare integrat la inceputul feed-ului */}
                                {activeTab === 'Feed' && (
                                    <>
                                        <Link
                                            to="/newnotes"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl h-14 bg-white dark:bg-[#1f1a29] border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 text-primary text-sm font-bold mb-2 group shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform duration-300">
                                                add_circle
                                            </span>
                                            <span>Share a new note with this group</span>
                                        </Link>
                                        {filteredNotes && filteredNotes.length > 0 ? (
                                            filteredNotes.map((note) => {
                                                const subjectName = note.subject ? note.subject.subject_name : 'General';
                                                const colorVars = getSubjectColorVars(subjectName);
                                                return (
                                                    <Link
                                                        key={note.note_id}
                                                        to={`/note/${note.note_id}`}
                                                        className="bg-white dark:bg-[#1f1a29] p-5 rounded-xl shadow-sm border border-transparent hover:border-primary/30 transition-all cursor-pointer group no-underline relative overflow-hidden"
                                                        style={colorVars}
                                                    >
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--bar-color)]" />
                                                        <div className="flex justify-between items-start mb-3 ml-2">
                                                            {/* Afisare Materie */}
                                                            <span className="px-3 py-1 bg-[var(--badge-bg)] text-[var(--badge-text)] dark:bg-[var(--badge-bg-dark)] dark:text-[var(--badge-text-dark)] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                                <Highlight text={subjectName} query={searchTerm} />
                                                            </span>

                                                            {/* Afisare Data si Ora */}
                                                            <span className="text-[#706189] dark:text-gray-400 text-xs">
                                                                {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        {/* titlu */}
                                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                                            <Highlight text={note.title} query={searchTerm} />
                                                        </h3>
                                                        <p className="text-[#706189] dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                            <Highlight text={note.note_content} query={searchTerm} />
                                                        </p>

                                                        {/* TAGS DISPLAY */}
                                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                                            {note.tags && note.tags.length > 0 ? (
                                                                note.tags.map((t) => (
                                                                    <span
                                                                        key={t.tag_id}
                                                                        className="px-2 py-1 rounded text-[10px] font-bold border transition-transform hover:scale-105"
                                                                        style={{
                                                                            backgroundColor: `${t.tag_desc}15`,
                                                                            color: t.tag_desc,
                                                                            borderColor: `${t.tag_desc}40`
                                                                        }}
                                                                    >
                                                                        #{t.tag_name}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-[10px] text-gray-300 dark:text-gray-600 italic">
                                                                    No tags
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-[#f2f0f4] dark:border-[#2d243a]">
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                                                                    {note.author?.user_first_name[0]}{note.author?.user_last_name[0]}
                                                                </div>
                                                                <span className="text-sm font-medium">{note.author?.user_first_name} {note.author?.user_last_name}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-10 text-gray-400">
                                                {searchTerm ? 'No notes match your search.' : 'No notes shared in this group yet.'}
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'Settings' && (
                                    <div className="space-y-6">

                                        {/* 1. MEMBER MANAGEMENT - List membrii cu butoane de remove */}
                                        <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl border border-[#dfdbe6] dark:border-[#2d243a]">
                                            <h5 className="text-sm font-bold uppercase tracking-wider text-[#706189] mb-4">Group Members</h5>
                                            <div className="space-y-2">
                                                {groupData.members?.map((member) => (
                                                    <div key={member.user_id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#2d243a] rounded-lg transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                                                                {member.user_first_name[0]}{member.user_last_name[0]}
                                                            </div>
                                                            <span className="text-sm font-medium">{member.user_first_name} {member.user_last_name}</span>
                                                        </div>
                                                        {member.Group_Members?.role === 'ADMIN' ? (
                                                            <span className="text-[10px] text-red-500 font-bold uppercase">ADMIN</span>
                                                        ) : (
                                                            isCurrentUserAdmin && (
                                                                <button
                                                                    onClick={() => handleRemoveMember(member.user_id)}
                                                                    className="text-xs text-red-500 hover:text-red-700 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                                                                >
                                                                    REMOVE
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 2. REGENERATE INVITE CODE
                                        {isCurrentUserAdmin && (
                                            <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl border border-[#dfdbe6] dark:border-[#2d243a]">
                                                <h5 className="text-sm font-bold uppercase tracking-wider text-[#706189] mb-4">Invite Code</h5>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={groupData.group_code} 
                                                        readOnly 
                                                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-[#2d243a] rounded-lg text-sm font-mono font-bold text-primary"
                                                    />
                                                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-purple-600 transition-colors">
                                                        Regenerate
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-2">Generate new code to invalidate old invites</p>
                                            </div>
                                        )} */}

                                        {/* 3. LEAVE GROUP */}
                                        <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl border border-[#dfdbe6] dark:border-[#2d243a]">
                                            <h5 className="text-sm font-bold uppercase tracking-wider text-[#706189] mb-4">Group Actions</h5>
                                            <button
                                                onClick={handleLeaveGroup}
                                                className="w-full px-4 py-2.5 border-2 border-orange-500 text-orange-500 rounded-lg font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all">
                                                Leave Group
                                            </button>
                                        </div>

                                        {/* 4. DELETE GROUP - Doar pentru ADMIN */}
                                        {isCurrentUserAdmin && (
                                            <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl border-2 border-red-200 dark:border-red-900/30">
                                                <h5 className="text-sm font-bold uppercase tracking-wider text-red-500 mb-4">Delete Group</h5>
                                                <button
                                                    onClick={handleDeleteGroup}
                                                    className="w-full px-4 py-2.5 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-all">
                                                    Delete Group
                                                </button>
                                                <p className="text-[10px] text-gray-400 mt-2">This action cannot be undone. All notes in this group will be deleted.</p>
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-80 flex flex-col gap-6">
                            {/* Info Widget */}
                            <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl shadow-sm border border-[#dfdbe6] dark:border-[#2d243a]">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#706189] dark:text-gray-400 mb-4">Group Info</h4>
                                <div className="p-4 bg-background-light dark:bg-[#2d243a] rounded-xl mb-4">
                                    <p className="text-xs font-bold text-[#706189] dark:text-gray-400 mb-1">INVITE CODE</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-mono font-black tracking-widest text-primary uppercase">{groupData.group_code}</span>
                                        <button onClick={() => navigator.clipboard.writeText(groupData.group_code)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors">
                                            {/* <span className="material-symbols-outlined text-[20px]">content_copy</span> */}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Members Widget */}
                            <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl shadow-sm border border-[#dfdbe6] dark:border-[#2d243a] flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#706189] dark:text-gray-400">Group Members</h4>
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{groupData.members?.length}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {groupData.members && groupData.members.length > 0 ? (
                                        groupData.members.map((member) => (
                                            <div
                                                key={member.user_id}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light dark:hover:bg-[#2d243a] transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                        {member.user_first_name[0]}{member.user_last_name[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-[#131118] dark:text-white">{member.user_first_name} {member.user_last_name}</p>
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${member.Group_Members?.role === 'ADMIN'
                                                            ? 'text-red-500'
                                                            : 'text-primary'
                                                            }`}>
                                                            {member.Group_Members?.role || 'MEMBER'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-[#706189] dark:text-gray-400">
                                            <p className="text-sm">No members yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default GroupDetails;