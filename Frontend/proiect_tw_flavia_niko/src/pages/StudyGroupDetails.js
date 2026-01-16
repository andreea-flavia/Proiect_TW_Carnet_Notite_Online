import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroupDetails = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Feed');

    const isCurrentUserAdmin = useMemo(() => {
        const currentUserId = parseInt(localStorage.getItem('user_id'));
        return groupData?.members?.some(member => 
            member.user_id === currentUserId && 
            member.Group_Members?.role === 'ADMIN'
        ) || false;
    }, [groupData]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:9000/api/group/${groupId}/full`);
                
                // console.log("Date primite:", response.data);
                setGroupData(response.data);
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

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#131118] dark:text-white">
            {/* Reutilizam Sidebar-ul tau aici */}
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
                    <span className="material-symbols-outlined">class</span>
                    <span className="text-sm font-medium">Courses</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span className="text-sm font-medium">Calendar</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
                    <span className="material-symbols-outlined">star</span>
                    <span className="text-sm font-medium">Favorites</span>
                </a>
                <button
                    onClick={() => navigate('/ShareNotes')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group"
                >
                    <span className="material-symbols-outlined text-[22px] group-hover:text-primary">share</span>
                    <span className="text-sm font-medium">Share</span>
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
                                        {groupData.groupNotes && groupData.groupNotes.length > 0 ? (
                                            groupData.groupNotes.map((note) => (
                                                <Link 
                                                    key={note.note_id} 
                                                    to={`/note/${note.note_id}`}
                                                    className="bg-white dark:bg-[#1f1a29] p-5 rounded-xl shadow-sm border border-transparent hover:border-primary/30 transition-all cursor-pointer group no-underline"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        {/* Afisare Materie */}
                                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                            {note.subject ? note.subject.subject_name : 'General'}
                                                        </span>
                                                        
                                                        {/* Afisare Data si Ora */}
                                                        <span className="text-[#706189] dark:text-gray-400 text-xs">
                                                            {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    {/* titlu */}
                                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{note.title}</h3>
                                                    <p className="text-[#706189] dark:text-gray-400 text-sm line-clamp-2 mb-4">{note.note_content}</p>
                                                    <div className="flex items-center justify-between pt-4 border-t border-[#f2f0f4] dark:border-[#2d243a]">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                                                                {note.author?.user_first_name[0]}{note.author?.user_last_name[0]}
                                                            </div>
                                                            <span className="text-sm font-medium">{note.author?.user_first_name} {note.author?.user_last_name}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 text-gray-400">No notes shared in this group yet.</div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'Settings' && (
                                    <div className="space-y-6">
                                        
                                        {/* 1. MEMBER MANAGEMENT - List membrii cu butoane de remove */}
                                        <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl border border-[#dfdbe6] dark:border-[#2d243a]">
                                            <h5 className="text-sm font-bold uppercase tracking-wider text-[#706189] mb-4">Manage Members</h5>
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
                                            <button className="w-full px-4 py-2.5 border-2 border-orange-500 text-orange-500 rounded-lg font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all">
                                                Leave Group
                                            </button>
                                        </div>

                                        {/* 4. DELETE GROUP - Doar pentru ADMIN */}
                                        {isCurrentUserAdmin && (
                                            <div className="bg-white dark:bg-[#1f1a29] p-6 rounded-xl border-2 border-red-200 dark:border-red-900/30">
                                                <h5 className="text-sm font-bold uppercase tracking-wider text-red-500 mb-4">🚨 Danger Zone</h5>
                                                <button className="w-full px-4 py-2.5 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-all">
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
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                                            member.Group_Members?.role === 'ADMIN' 
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