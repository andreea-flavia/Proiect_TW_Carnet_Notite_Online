import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditNote() {
  const { id } = useParams(); // Preluăm ID-ul din URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  // 1. Încărcăm materiile și datele notiței la deschiderea paginii
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Preluăm lista de materii
        const subjRes = await axios.get('http://localhost:9000/api/subject');
        setSubjects(subjRes.data || []);

        // Preluăm detaliile notiței specifice
        const noteRes = await axios.get(`http://localhost:9000/api/note/${id}`);
        if (noteRes.data) {
          setTitle(noteRes.data.title);
          setContent(noteRes.data.content);
          setSubjectId(noteRes.data.subject_id);
        }
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };
    fetchData();
  }, [id]);

  // 2. Funcția de Actualizare
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        subject_id: Number(subjectId),
      };

      // Trimitem cererea de actualizare (PUT)
      await axios.put(`http://localhost:9000/api/note/${id}`, payload);
      
      // REDIRECȚIONARE: Ne întoarcem la Dashboard
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Error updating note', err);
      alert('Error updating note');
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
      {/* Sidebar (Păstrat exact ca în NewNotes) */}
      <aside className="w-64 h-full hidden lg:flex flex-col border-r border-slate-200 bg-surface-light shrink-0">
        <div className="flex items-center gap-3 p-6">
          <div className="bg-primary p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-white">edit_note</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">StudioTeca</h1>
        </div>
        <nav className="flex flex-col gap-1 px-4 grow">
           <button onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
        {/* Header cu butonul Save (Update) */}
        <header className="h-16 shrink-0 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-2 text-text-sub text-sm">
            <span>Notes</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-medium text-text-main">Edit Note</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="px-4 py-2 text-sm font-semibold text-text-sub hover:text-text-main transition-colors">Cancel</button>
            <button type="button" onClick={handleUpdate} className="px-5 py-2 bg-primary hover:bg-purple-600 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">update</span>
              Save Changes
            </button>
          </div>
        </header>

        {/* Formularul de editare */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full text-4xl font-extrabold border-none focus:ring-0 text-slate-900 p-0" 
              placeholder="Note Title..." 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                <div className="relative">
                  <select 
                    value={subjectId} 
                    onChange={e => setSubjectId(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option disabled value="">Select a subject</option>
                    {subjects.map(s => (
                      <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">auto_stories</span>
                </div>
              </div>
            </div>

            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full min-h-[500px] text-lg leading-relaxed border-none focus:ring-0 resize-none p-0 text-slate-800" 
              placeholder="Start editing your notes..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditNote;