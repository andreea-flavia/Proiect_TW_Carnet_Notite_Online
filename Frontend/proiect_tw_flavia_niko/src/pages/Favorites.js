import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const user_id = localStorage.getItem('user_id');
  const navigate = useNavigate();

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

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Favorites</h2>
        {favorites.length === 0 ? (
          <div className="text-text-sub">No favorite notes yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(n => (
              <div key={n.note_id} className="bg-white dark:bg-surface-dark rounded-xl border border-[#cfe7d3] dark:border-gray-700 p-4 shadow-sm cursor-pointer" onClick={() => navigate(`/note/${n.note_id}`)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white">{n.title}</h3>
                    <p className="text-sm text-text-sub dark:text-gray-400">{n.subject ? (n.subject.subject_name || n.subject.subject_title) : ''}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(n.note_id, n.is_favorite); }} className="p-1.5 rounded-md text-yellow-500 hover:bg-yellow-50">
                    <span className="material-symbols-outlined fill-1">star</span>
                  </button>
                </div>
                <p className="text-sm text-text-main/80 dark:text-gray-400 line-clamp-4">{n.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
