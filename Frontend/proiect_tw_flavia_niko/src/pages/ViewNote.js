import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/note/${id}/details`);
        setNote(res.data);
      } catch (e) {
        console.error('Failed to load note', e);
      }
    };
    fetchNote();
  }, [id]);

  if (!note) return <div className="min-h-screen flex items-center justify-center">Loading note...</div>;

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
      <aside className="w-64 h-full hidden lg:flex flex-col border-r border-[#cfe7d3] dark:border-gray-800 bg-surface-light dark:bg-background-dark p-4 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2 mt-2">
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">StudioTeca</h1>
            <p className="text-text-sub dark:text-gray-400 text-xs font-normal leading-normal truncate">Your notes at a glance</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 shrink-0 border-b border-[#cfe7d3] dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h2 className="text-lg font-bold">{note.title}</h2>
              <div className="text-xs text-slate-500">{note.subject?.subject_name || 'General'} • {new Date(note.createdAt).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/editnote/${note.note_id}`)} className="px-4 py-2 bg-primary text-white rounded-lg">Edit</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 shadow">
            <div className="prose dark:prose-invert max-w-full">
              <p>{note.content}</p>
            </div>

            {note.resources && note.resources.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                  {note.resources.map(r => (
                    <li key={r.resource_id}><a className="text-primary" href={r.resource_url} target="_blank" rel="noreferrer">{r.resource_name || r.resource_url}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewNote;
