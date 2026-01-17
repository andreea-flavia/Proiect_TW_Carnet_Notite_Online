import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const user_id = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const buttonHover = "hover:translate-x-1 transition-transform duration-200";
  const user_first_name = localStorage.getItem('user_first_name') || 'User';
  const user_last_name = localStorage.getItem('user_last_name') || '';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user_id) {
          const res = await axios.get(`http://localhost:9000/api/favorites?user_id=${user_id}`);
          const raw = res.data || [];
          const normalized = raw.map(n => ({
            ...n,
            note_id: n.note_id,
            title: n.title || n.note_title,
            content: n.content || n.note_content,
            subject: n.subject || n.Subject,
            is_favorite: true
          }));
          setFavorites(normalized);
        } else {
          // guest fallback: read fav ids from localStorage and fetch notes
          const guest = JSON.parse(localStorage.getItem('guest_favs') || '[]');
          if (guest.length === 0) {
            setFavorites([]);
          } else {
            const res = await axios.get('http://localhost:9000/api/note');
            const raw = res.data || [];
            const normalized = raw.map(n => ({
              ...n,
              note_id: n.note_id,
              title: n.title || n.note_title,
              content: n.content || n.note_content,
              subject: n.subject || n.Subject,
              is_favorite: guest.includes(Number(n.note_id))
            }));
            setFavorites(normalized.filter(n => guest.includes(Number(n.note_id))));
          }
        }
      } catch (err) {
        console.error('Error fetching favorites', err);
      }
    };
    fetchFavorites();
  }, [user_id]);

  const handleToggleFavorite = async (note_id, currentStatus) => {
    try {
      const payload = { user_id };
      if (!currentStatus) {
        await axios.post(`http://localhost:9000/api/favorites/${note_id}`, payload);
      } else {
        await axios.delete(`http://localhost:9000/api/favorites/${note_id}`, { data: payload });
      }
      setFavorites(prev => prev.filter(n => n.note_id !== note_id));
    } catch (err) {
      console.error('Error toggling favorite', err);
    }
  };

  const filteredFavorites = favorites.filter(n => {
    const subjectName = n.subject ? (n.subject.subject_name || n.subject.subject_title || '') : '';
    const haystack = `${n.title || ''} ${n.content || ''} ${subjectName}`.toLowerCase();
    return haystack.includes(searchQuery.trim().toLowerCase());
  });

  const highlightText = (text, query) => {
    if (!query) return text || '';
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = String(text || '').split(new RegExp(`(${safe})`, 'gi'));
    return parts.map((part, i) => (
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/40 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    ));
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
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-white dark:bg-surface-dark text-text-main dark:text-white placeholder-text-sub dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm shadow-sm" placeholder="Search favorites by title or subject..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className={`md:hidden p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ${buttonHover}`}>
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className={`p-2 relative text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ${buttonHover}`}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Favorites</h2>
            {filteredFavorites.length === 0 ? (
              <div className="text-text-sub">No favorite notes yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map(n => (
                  <div key={n.note_id} className="bg-white dark:bg-surface-dark rounded-xl border border-[#cfe7d3] dark:border-gray-700 p-4 shadow-sm cursor-pointer" onClick={() => navigate(`/note/${n.note_id}`)}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-text-main dark:text-white">{highlightText(n.title, searchQuery)}</h3>
                        <p className="text-sm text-text-sub dark:text-gray-400">{highlightText(n.subject ? (n.subject.subject_name || n.subject.subject_title) : '', searchQuery)}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(n.note_id, n.is_favorite); }} className={`p-1.5 rounded-md text-yellow-500 hover:bg-yellow-50 ${buttonHover}`}>
                        <span className="material-symbols-outlined fill-1">star</span>
                      </button>
                    </div>
                    <p className="text-sm text-text-main/80 dark:text-gray-400 line-clamp-4">{highlightText(n.content, searchQuery)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Favorites;
