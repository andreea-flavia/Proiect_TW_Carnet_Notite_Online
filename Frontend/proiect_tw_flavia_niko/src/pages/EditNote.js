import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditNote() {
  const { id } = useParams(); // Preluăm ID-ul din URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [existingResources, setExistingResources] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalName, setModalName] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate();

  // --- ADAUGAT PENTRU TOOLBAR ---
  const textareaRef = useRef(null);

  const applyFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    const newText = beforeText + prefix + selectedText + suffix + afterText;
    setContent(newText);

    // Repunem focusul și menținem selecția pentru o experiență fluidă
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length;
      textarea.setSelectionRange(
        newCursorPos,
        newCursorPos + selectedText.length
      );
    }, 0);
  };
  // ------------------------------

  // 1. Încărcăm materiile și datele notiței la deschiderea paginii
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const subjRes = await axios.get('http://localhost:9000/api/subject');
        setSubjects(subjRes.data || []);

        if (userId) {
          const groupsRes = await axios.get(`http://localhost:9000/api/user/${userId}/groups`);
          setMyGroups(groupsRes.data || []);
        }

        const noteRes = await axios.get(`http://localhost:9000/api/note/${id}/details`);
        if (noteRes.data) {
          setTitle(noteRes.data.title || ''); 
          setContent(noteRes.data.content || '');
          setSubjectId(noteRes.data.subject_id || '');
          setExistingResources(noteRes.data.resources || []);
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
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('Trebuie sa fii logat pentru a actualiza notite');
      return;
    }

    try {
      const payload = {
        title: title.trim(),   
        content: content.trim(), 
        subject_id: Number(subjectId),
        updated_by: Number(user_id)
      };

      await axios.put(`http://localhost:9000/api/note/${id}`, payload);

      if (selectedGroupId && id) {
        try {
          const groupPayload = {
            note_id: Number(id),
            group_id: Number(selectedGroupId),
            created_by: Number(user_id)
          };
          await axios.post('http://localhost:9000/api/group/note', groupPayload);
        } catch (e) {
          if (e.response?.status === 400) {
            console.warn('The note is already shared with this group.');
          } else {
            console.error('Error sharing note with group:', e);
          }
        }
      }

      if (selectedGroupId) {
        navigate(`/group/${selectedGroupId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error updating note', err);
      alert('Error updating note');
    }
  };

  const openImage = (res) => {
    const url = res.resource_url && (res.resource_url.startsWith('http') ? res.resource_url : `http://localhost:9000${res.resource_url}`);
    setModalSrc(url);
    setModalName(res.resource_name || 'image');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc('');
    setModalName('');
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 h-full hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark shrink-0">
        <div className="flex items-center gap-3 p-6">
          <div className="bg-primary p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-white">edit_note</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">StudioTeca</h1>
        </div>
        <nav className="flex flex-col gap-1 px-4 grow">
           <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-2 text-text-sub text-sm">
            <span>Notes</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-medium text-text-main dark:text-white">Edit Note</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-semibold text-text-sub hover:text-text-main dark:hover:text-white transition-colors">Cancel</button>
            <button
              type="button"
              onClick={() => setShowGroupModal(true)}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 border-2 
                ${selectedGroupId 
                  ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                  : 'bg-transparent border-dashed border-gray-300 dark:border-gray-700 text-[#706189] dark:text-gray-400 hover:border-primary hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {selectedGroupId ? 'group_check' : 'group_add'}
              </span>
              {selectedGroupId ? 'Group Selected' : 'Share to Group'}
            </button>
            <button type="button" onClick={handleUpdate} className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined text-sm">save</span>
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
              className="w-full text-4xl font-extrabold border-none focus:ring-0 bg-transparent text-slate-900 dark:text-white p-0" 
              placeholder="Note Title..." 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                <div className="relative">
                  <select 
                    value={subjectId} 
                    onChange={e => setSubjectId(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary appearance-none text-slate-900 dark:text-white"
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

            {/* ADAUGAT: Bara cu instrumente (Identică cu NewNotes) */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-lg sticky top-0 z-10 border border-slate-100 dark:border-slate-700 shadow-sm">
              <button type="button" onClick={() => applyFormatting('**', '**')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Bold"><span className="material-symbols-outlined">format_bold</span></button>
              <button type="button" onClick={() => applyFormatting('_', '_')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Italic"><span className="material-symbols-outlined">format_italic</span></button>
              <button type="button" onClick={() => applyFormatting('\n- ')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="List"><span className="material-symbols-outlined">format_list_bulleted</span></button>
              <button type="button" onClick={() => applyFormatting('`', '`')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Code"><span className="material-symbols-outlined">code</span></button>
              <button type="button" onClick={() => {
                const url = prompt("Enter URL:", "https://");
                if (url) applyFormatting('[', `](${url})`);
              }} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Link"><span className="material-symbols-outlined">link</span></button>
            </div>

            <textarea 
              ref={textareaRef}
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full min-h-[400px] text-lg leading-relaxed border-none focus:ring-0 bg-transparent resize-none p-0 text-slate-800 dark:text-slate-200" 
              placeholder="Start editing your notes..."
            />

            {existingResources && existingResources.length > 0 && (
              <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Attached Resources</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {existingResources.map(r => {
                    const isImage = r.resource_name && r.resource_name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                    const url = r.resource_url && (r.resource_url.startsWith('http') ? r.resource_url : `http://localhost:9000${r.resource_url}`);
                    return (
                      <div key={r.resource_id} className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                        {isImage ? (
                          <div className="cursor-pointer" onClick={() => openImage(r)}>
                            <img src={url} alt={r.resource_name} className="w-full h-32 object-cover rounded-lg" />
                            <p className="text-xs mt-3 text-slate-500 truncate px-1">{r.resource_name}</p>
                          </div>
                        ) : (
                          <a href={url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center h-32 text-primary">
                            <span className="material-symbols-outlined text-4xl">description</span>
                            <p className="text-xs mt-3 text-slate-500 truncate w-full text-center px-1">{r.resource_name}</p>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox / Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="max-w-[90%] max-h-[90%] p-4 relative" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">close</span> Close
            </button>
            <img src={modalSrc} alt={modalName} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl shadow-black/50" />
            <p className="text-white text-center mt-4 font-medium">{modalName}</p>
          </div>
        </div>
      )}

      {showGroupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#131118]/60 backdrop-blur-sm"
            onClick={() => setShowGroupModal(false)}
          ></div>

          <div className="relative bg-white dark:bg-[#1f1a29] w-full max-w-md rounded-2xl shadow-2xl border border-[#dfdbe6] dark:border-[#2d243a] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black tracking-tight">Select Study Group</h3>
                <button
                  onClick={() => setShowGroupModal(false)}
                  className="text-[#706189] hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {myGroups.length > 0 ? (
                  myGroups.map((group) => (
                    <div
                      key={group.group_id}
                      onClick={() => setSelectedGroupId(group.group_id)}
                      className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between group ${
                        selectedGroupId === group.group_id
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent bg-background-light dark:bg-[#2d243a] hover:border-primary/30'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`font-bold ${selectedGroupId === group.group_id ? 'text-primary' : ''}`}>
                          {group.group_name}
                        </span>
                        <span className="text-[10px] font-mono text-[#706189] dark:text-gray-400 uppercase tracking-widest">
                          Code: {group.group_code}
                        </span>
                      </div>
                      {selectedGroupId === group.group_id && (
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#706189]">You are not a member of any group yet.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroupId(null);
                    setShowGroupModal(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-[#706189] hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditNote;