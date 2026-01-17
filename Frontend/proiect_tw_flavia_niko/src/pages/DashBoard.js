import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashBoard = () => {
  const buttonHover = "hover:translate-x-1 transition-transform duration-200";
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

  const [user_first_name, set_first_name] = useState('User');
  const [user_last_name, set_last_name] = useState('');
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupsWithMembers, setGroupsWithMembers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const user_id = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch_user_name = async () => {
      if (user_id) {
        try {
          const response = await axios.get(`http://localhost:9000/api/user/${user_id}`);
          if (response.data) {
            set_first_name(response.data.user_first_name);
            set_last_name(response.data.user_last_name);
          }
        } catch (e) {
          console.log("Error fetching user name:", e);
        }
      }
    }

    fetch_user_name();
  }, [user_id]);

  // Fetch notifications and poll periodically
  useEffect(() => {
    let mounted = true;
    const fetchNotifs = async () => {
      if (!user_id) return;
      try {
        const res = await axios.get(`http://localhost:9000/api/notifications?user_id=${user_id}`);
        if (mounted) setNotifications(res.data || []);
      } catch (e) {
        console.warn('Error fetching notifications', e);
      }
    };
    fetchNotifs();
    const id = setInterval(fetchNotifs, 8000);
    return () => { mounted = false; clearInterval(id); };
  }, [user_id]);

  // close notif dropdown on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const filteredNotes = allNotes.filter(n => 
    Number(n.user_id) === Number(user_id) && 
    (selectedSubject ? (n.subject && n.subject.subject_name === selectedSubject) : true)
  );

  useEffect(() => {
  const fetchAll = async () => {
    try {
      const notesRes = await axios.get('http://localhost:9000/api/note');
      
      const rawData = notesRes.data || [];
      const normalized = rawData.map(n => ({
        ...n,
        note_id: n.note_id,
        title: n.title || n.note_title, 
        content: n.content || n.note_content,
        subject: n.subject || n.Subject,
        tags: n.tags || n.Tags || []
      }));

      // Fetch user's favorites and mark notes accordingly
      let favSet = new Set();
      if (user_id) {
        try {
          const favRes = await axios.get(`http://localhost:9000/api/favorites?user_id=${user_id}`);
          const favNotes = favRes.data || [];
          favNotes.forEach(fn => favSet.add(Number(fn.note_id)));
        } catch (e) {
          console.warn('Could not fetch favorites for user', e);
        }
      } else {
        // guest fallback: read guest favorites from localStorage
        try {
          const guest = JSON.parse(localStorage.getItem('guest_favs') || '[]');
          guest.forEach(id => favSet.add(Number(id)));
        } catch (e) { /* ignore */ }
      }

      const withFav = normalized.map(n => ({ ...n, is_favorite: favSet.has(Number(n.note_id)) }));
      setAllNotes(withFav);

      const subjRes = await axios.get('http://localhost:9000/api/subject');
      setSubjects(subjRes.data || []);

      // Fetch user's groups
      if (user_id) {
        try {
          const groupsRes = await axios.get(`http://localhost:9000/api/user/${user_id}/groups`);
          const groupsList = Array.isArray(groupsRes.data) ? groupsRes.data : [];
          setGroups(groupsList);

          // Fetch full details for each group to get member count
          const groupsWithMembersData = await Promise.all(
            groupsList.map(async (g) => {
              try {
                const fullRes = await axios.get(`http://localhost:9000/api/group/${g.group_id}/full`);
                return {
                  ...g,
                  members: fullRes.data.members || []
                };
              } catch (e) {
                console.warn(`Could not fetch members for group ${g.group_id}`, e);
                return { ...g, members: [] };
              }
            })
          );
          setGroupsWithMembers(groupsWithMembersData);
        } catch (e) {
          console.warn('Could not fetch groups', e);
        }
      }
    } catch (err) {
      console.error('Error fetching notes or subjects', err);
    }
  };

  fetchAll();
}, [user_id]);

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

  // --- ADAUGAT: Funcția de Toggle Favorite ---
  const handleToggleFavorite = async (note_id, currentStatus) => {
    try {
      // If user not logged in, maintain favorites locally in localStorage
      if (!user_id) {
        try {
          const guest = JSON.parse(localStorage.getItem('guest_favs') || '[]');
          const idNum = Number(note_id);
          if (!currentStatus) {
            if (!guest.includes(idNum)) guest.push(idNum);
          } else {
            const idx = guest.indexOf(idNum);
            if (idx !== -1) guest.splice(idx, 1);
          }
          localStorage.setItem('guest_favs', JSON.stringify(guest));
          setAllNotes(prevNotes => prevNotes.map(note => note.note_id === note_id ? { ...note, is_favorite: !currentStatus } : note));
          return;
        } catch (e) { console.warn('guest favs error', e); }
      }

      const payload = { user_id };
      if (!currentStatus) {
        await axios.post(`http://localhost:9000/api/favorites/${note_id}`, payload);
        try {
          const note = allNotes.find(n => n.note_id === note_id);
          const message = note?.note_title ? `Added "${note.note_title}" to favorites.` : 'Added a note to favorites.';
          const notifRes = await axios.post('http://localhost:9000/api/notifications', {
            user_id,
            message,
            meta: { note_id }
          });
          if (notifRes?.data) {
            setNotifications(prev => [notifRes.data, ...prev]);
          }
        } catch (e) {
          console.warn('Failed to create notification', e);
        }
      } else {
        await axios.delete(`http://localhost:9000/api/favorites/${note_id}`, { data: payload });
      }

      // Update local state to reflect persisted change
      setAllNotes(prevNotes => prevNotes.map(note => note.note_id === note_id ? { ...note, is_favorite: !currentStatus } : note));
    } catch (err) {
      console.error("Error updating favorite status:", err);
    }
  };

  const handleDelete = async (note_id) => {
    if (window.confirm("Sigur vrei să ștergi această notiță?")) {
      try {
        await axios.delete(`http://localhost:9000/api/note/${note_id}`);
        setAllNotes(prevNotes => prevNotes.filter(note => note.note_id !== note_id));
      } catch (err) {
        console.error("Eroare la ștergere:", err);
        alert("Nu s-a putut șterge notița. Verifică dacă serverul este pornit.");
      }
    }
  };

  const handleEdit = (note_id) => {
    navigate(`/editnote/${note_id}`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white overflow-hidden h-screen flex">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-white hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group text-left ${buttonHover}`}
              >
              <span className="material-symbols-outlined text-[22px] text-text-main dark:text-white group-hover:text-primary transition-colors">
                  dashboard
              </span>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          <button 
            onClick={() => navigate('/all-notes')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group text-left ${buttonHover}`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">description</span>
            <span className="text-sm font-medium">My Notes</span>
          </button>
          {/* Opțiunea Favorites în Sidebar */}
          <button 
            onClick={() => navigate('/favorites')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors text-left w-full ${buttonHover}`}
          >
            <span className="material-symbols-outlined">star</span>
            <span className="text-sm font-medium">Favorites</span>
          </button>
          <button
            onClick={() => navigate('/sharenoteswithfriends')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group text-left ${buttonHover}`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">group_add</span>
            <span className="text-sm font-medium">Share with Friends</span>
          </button>

          <button
            onClick={() => navigate('/studygroups')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group text-left ${buttonHover}`}
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

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 shrink-0 border-b border-[#cfe7d3] dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <button className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ${buttonHover}`}>
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-sub dark:text-gray-500 group-focus-within:text-primary transition-colors">search</span>
              </div>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-white dark:bg-surface-dark text-text-main dark:text-white placeholder-text-sub dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm shadow-sm" placeholder="Search your notes by keyword, tag, or subject..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className={`md:hidden p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ${buttonHover}`}>
              <span className="material-symbols-outlined">search</span>
            </button>
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(o => !o)} className={`p-2 relative text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ${buttonHover}`}>
                <span className="material-symbols-outlined">notifications</span>
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">{notifications.filter(n => !n.is_read).length}</span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 && <div className="p-3 text-sm text-text-sub">No notifications</div>}
                    {notifications.map(n => (
                      <div key={n.notification_id} onClick={async () => {
                        try {
                          await axios.put(`http://localhost:9000/api/notifications/${n.notification_id}/read`);
                        } catch(e) { console.warn(e); }
                        setNotifications(prev => prev.map(x => x.notification_id === n.notification_id ? { ...x, is_read: true } : x));
                        if (n.meta && n.meta.note_id) navigate(`/note/${n.meta.note_id}`);
                      }} className={`p-3 border-t border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-dark ${n.is_read ? 'opacity-60' : ''}`}>
                        <div className="text-sm">{n.message}</div>
                        <div className="text-xs text-text-sub mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1" />
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <p className="hidden sm:block text-sm font-semibold text-text-main dark:text-white">
                {user_first_name} {user_last_name}
              </p>
              <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8"
                style={{ backgroundImage: 'url("https://plus.unsplash.com/premium_vector-1750338927346-6a72ca5301dd?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <section className="@container">
            <div className="relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark border border-[#cfe7d3] dark:border-gray-700 min-h-[200px] flex flex-col justify-end p-6 md:p-8 group shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-20 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBP5wcRe1BYgW9J9keX6YOwn6ZG5PO_y3tGhzM7taI4Tw4l8J6QHNpCNnk5IcBh4-fVreBweRFa52_kh-t4KGovZKWdFjAz9ajy2533TPWyw_0SfKITVyBpYEChjhaoSYBAvx6sucwVpykdENrlRJvkWsR8O8O8cjJOetnA-JAB6nBVkV4QSCQffS9QhM1yQa91r5MowyKd1ZVsnDmZ8K_swMq6ouE0I0shw9ft1PStJZ0v_moLf2cuPl7z968ZFxzsJ6IMCmsRLN9g")' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark/90 via-transparent to-transparent" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-2">
                  Welcome, {user_first_name}!
                </h2>
                <p className="text-text-main/80 dark:text-gray-300 text-lg">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-text-main dark:text-white">Recent Notes</h3>
              </div>
              <button 
                onClick={() => navigate('/all-notes')} 
                className={`flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group ${buttonHover}`}
              >
                View All Notes
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            <Link to="/newnotes" className={`group flex flex-col items-center justify-center min-h-[260px] bg-background-light dark:bg-background-dark/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary p-5 transition-all duration-200 hover:bg-primary/5 ${buttonHover}`}>
              <div className="h-14 w-14 rounded-full bg-white dark:bg-surface-dark shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">Create New Note</h3>
              <p className="text-sm text-text-sub dark:text-gray-500 text-center">Capture your thoughts instantly</p>
            </Link>

            {filteredNotes && filteredNotes.length > 0 ? (
              filteredNotes
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
              .slice(0, 3) 
              .map(n => (
                <div key={n.note_id} onClick={() => navigate(`/note/${n.note_id}`)} className="cursor-pointer group flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-[#cfe7d3] dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative">
                  {(() => {
                    const subjectName = n.subject ? (n.subject.subject_name || n.subject.subject_title) : '';
                    const colorVars = getSubjectColorVars(subjectName);
                    return (
                      <>
                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-[var(--bar-color)] rounded-r-md" style={colorVars} />
                        <div className="flex justify-between items-start mb-3 ml-2" style={colorVars}>
                          <div>
                            <span className="inline-block px-2 py-1 rounded bg-[var(--badge-bg)] text-[var(--badge-text)] dark:bg-[var(--badge-bg-dark)] dark:text-[var(--badge-text-dark)] text-[10px] font-bold uppercase tracking-wider mb-1">
                              <Highlight text={subjectName || 'Subject'} query={searchQuery} />
                            </span>
                            <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight">
                              <Highlight text={n.title || ''} query={searchQuery} />
                            </h3>
                          </div>
                          <button onClick={(e) => e.stopPropagation()} className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-primary ${buttonHover}`}>
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                        </div>
                      </>
                    );
                  })()}
                  <div className="flex-1 ml-2 mb-4">
                    {(() => {
                      const full = n.content || '';
                      const preview = full.length > 200 ? (full.substring(0, 197) + '...') : full;
                      return <p className="text-sm text-text-main/80 dark:text-gray-400 line-clamp-3 leading-relaxed"><Highlight text={preview} query={searchQuery} /></p>;
                    })()}
                  </div>
                  
                  <div className="ml-2 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-text-sub dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 
                      {n.createdAt ? new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : ''}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* --- ADAUGAT: Butonul Steluta lângă Edit --- */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleFavorite(n.note_id, n.is_favorite); }}
                        className={`p-1.5 rounded-md transition-colors ${n.is_favorite ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'} ${buttonHover}`}
                        title={n.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <span className={`material-symbols-outlined text-[18px] ${n.is_favorite ? 'fill-1' : ''}`}>
                          star
                        </span>
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(n.note_id); }}
                        className={`p-1.5 hover:bg-primary/10 rounded-md text-gray-400 hover:text-primary transition-colors ${buttonHover}`} 
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(n.note_id); }} 
                        className={`p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-500 transition-colors ${buttonHover}`} 
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-text-sub">No notes yet. Create your first note.</div>
            )}
          </section>

          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-text-main dark:text-white">Recent Study Groups</h3>
              </div>
              <button 
                onClick={() => navigate('/studygroups')} 
                className={`flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group ${buttonHover}`}
              >
                View All Groups
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupsWithMembers && groupsWithMembers.length > 0 ? (
                groupsWithMembers.slice(0, 3).map(g => (
                  <div 
                    key={g.group_id} 
                    onClick={() => navigate(`/group/${g.group_id}`)} 
                    className="cursor-pointer group flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-[#cfe7d3] dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative"
                  >
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-md" />
                    <div className="flex items-start gap-4 mb-4 ml-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight mb-1">
                          {g.group_name}
                        </h3>
                        <p className="text-xs text-text-sub dark:text-gray-400 font-medium">
                          {g.members?.length || 0} members
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 ml-2 mb-4">
                      <p className="text-sm text-text-main/80 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {g.group_desc || 'No description'}
                      </p>
                    </div>
                    <div className="ml-2 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-text-sub dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        Code: {g.group_code}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-text-sub">No groups yet. Join or create your first group.</div>
              )}
            </div>
          </section>
        </div>

        <button onClick={() => navigate('/newnotes')} className={`md:hidden fixed bottom-6 right-6 h-14 w-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform z-30 ${buttonHover}`}>
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </main>
    </div>
  );
};

export default DashBoard;