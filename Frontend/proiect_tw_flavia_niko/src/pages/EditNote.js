import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditNote() {
  const { id } = useParams(); // Preluăm ID-ul din URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [existingResources, setExistingResources] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalName, setModalName] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  // --- ADAUGAT PENTRU TOOLBAR ---
  const textareaRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await axios.delete(`http://localhost:9000/api/resource/${resourceId}`);
      setExistingResources((prev) => prev.filter(r => r.resource_id !== resourceId));
    } catch (err) {
      console.error('Failed to delete resource', err);
      alert('Could not delete resource');
    }
  };

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

        const tagsRes = await axios.get('http://localhost:9000/api/tag');
        setTags(tagsRes.data || []);

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
          if (noteRes.data.tags) {
            setSelectedTags(noteRes.data.tags.map(t => t.tag_id));
          }

          if (noteRes.data.Group_Notes && noteRes.data.Group_Notes.length > 0) {
              setSelectedGroupId(noteRes.data.Group_Notes[0].group_id);
          }
        }

        
        

      } catch (err) {
        console.error('Failed to load data', err);
      }
    };
    fetchData();
  }, [id]);

  const handleTagClick = (tagId) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(tagId)) {
        return prevSelected.filter((id) => id !== tagId);
      }
      return [...prevSelected, tagId];
    });
  };

  // 2. Funcția de Actualizare
  const handleUpdate = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('Trebuie sa fii logat pentru a actualiza notite');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('subject_id', Number(subjectId));
      formData.append('updated_by', Number(user_id));
      formData.append('tags', JSON.stringify(selectedTags));

      // Add new files
      selectedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      await axios.put(`http://localhost:9000/api/note/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

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
    {/* 1. SIDEBAR STÂNGA (Navigație) */}
    <aside className="w-64 h-full hidden lg:flex flex-col border-r border-[#cfe7d3] dark:border-gray-800 bg-surface-light dark:bg-background-dark shrink-0 p-4">
      <div className="flex items-center gap-3 mb-8 px-2 mt-2">
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">StudioTeca</h1>
          <p className="text-text-sub dark:text-gray-400 text-xs font-normal leading-normal truncate">Ace your exams!</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 grow">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-white hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group">
          <span className="material-symbols-outlined text-[22px] group-hover:text-primary">dashboard</span>
          <span className="text-sm font-medium">Dashboard</span>
        </button>
        <button onClick={() => navigate('/all-notes')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group">
          <span className="material-symbols-outlined text-[22px] group-hover:text-primary">description</span>
          <span className="text-sm font-medium">My Notes</span>
        </button>
        <button onClick={() => navigate('/studygroups')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark hover:translate-x-1 transition-all duration-200 group">
          <span className="material-symbols-outlined text-[22px] group-hover:text-primary">groups</span>
          <span className="text-sm font-medium">Study Groups</span>
        </button>
        <div className="my-4 border-t border-[#cfe7d3] dark:border-gray-800" />
      </nav>
    </aside>

    {/* 2. AREA CENTRALĂ + SIDEBAR DREAPTA */}
    <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      
      {/* HEADER (Fix sus) */}
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
        <span className="material-symbols-outlined text-[20px]"> group_add
          {/* {selectedGroupId ? 'group_check' : 'group_add'} */}
        </span>
        {selectedGroupId 
          ? "Group Selected"
          : 'Share to Group'}
      </button>

          <button type="button" onClick={handleUpdate} className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-sm">save</span>
            Save Changes
          </button>
        </div>
      </header>

      {/* CONTAINER CONTENT (Editor + Attachments) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* COLOANA EDITOR (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
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
                    {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">auto_stories</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => {
                    const isSelected = selectedTags.includes(t.tag_id);
                    return (
                      <button
                        key={t.tag_id}
                        type="button"
                        onClick={() => handleTagClick(t.tag_id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isSelected ? 'bg-primary border-primary text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{isSelected ? 'check_circle' : 'sell'}</span>
                        #{t.tag_name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Toolbar Formare */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-lg sticky top-0 z-10 border border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => applyFormatting('**', '**')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"><span className="material-symbols-outlined">format_bold</span></button>
              <button type="button" onClick={() => applyFormatting('_', '_')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"><span className="material-symbols-outlined">format_italic</span></button>
              <button type="button" onClick={() => applyFormatting('\n- ')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"><span className="material-symbols-outlined">format_list_bulleted</span></button>
              <button type="button" onClick={() => applyFormatting('`', '`')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"><span className="material-symbols-outlined">code</span></button>
            </div>

            <textarea 
              ref={textareaRef}
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full min-h-[500px] text-lg leading-relaxed border-none focus:ring-0 bg-transparent resize-none p-0 text-slate-800 dark:text-slate-200" 
              placeholder="Start editing your notes..."
            />
          </div>
        </div>

        {/* 3. SIDEBAR DREAPTA (Attachments) */}
        <aside className="w-80 xl:w-96 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 hidden lg:flex flex-col shrink-0">
          <div className="p-6 overflow-y-auto h-full space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attachments</h3>
            
            {/* Buton Upload */}
            <div className="space-y-4">
              <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="w-full flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-primary cursor-pointer transition-all group shadow-sm">
                <span className="material-symbols-outlined text-text-sub group-hover:text-primary">upload_file</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-text-main dark:text-white">Upload New</p>
                  <p className="text-[10px] text-text-sub">Images, PDF, Docx</p>
                </div>
              </label>

              {/* Listă fișiere */}
              <div className="space-y-2">
                {/* Resurse existente */}
                {existingResources.map((res) => {
                  const isImage = res.resource_name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                  return (
                    <div key={res.resource_id} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl relative group shadow-sm">
                      {isImage ? (
                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => openImage(res)}>
                          <img src={`http://localhost:9000${res.resource_url}`} className="w-10 h-10 object-cover rounded" alt="thumb" />
                          <p className="text-xs font-medium truncate w-32">{res.resource_name}</p>
                        </div>
                      ) : (
                        <a href={`http://localhost:9000${res.resource_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 flex-1">
                          <span className="material-symbols-outlined text-blue-500">description</span>
                          <p className="text-xs font-medium truncate w-32">{res.resource_name}</p>
                        </a>
                      )}
                      <span onClick={() => handleDeleteResource(res.resource_id)} className="material-symbols-outlined text-slate-300 hover:text-red-500 cursor-pointer text-lg">close</span>
                    </div>
                  );
                })}

                {/* Fișiere noi selectate */}
                {selectedFiles.map((file, index) => (
                  <div key={index} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-blue-200 rounded-xl relative shadow-sm">
                    <span className="material-symbols-outlined text-primary">add_circle</span>
                    <div className="text-left flex-1 overflow-hidden">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      <p className="text-[9px] text-text-sub">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <span onClick={() => removeFile(index)} className="material-symbols-outlined text-slate-300 hover:text-red-500 cursor-pointer">close</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL IMAGE PREVIEW (Lightbox) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="max-w-[90%] max-h-[90%] p-4 relative" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">close</span> Close
            </button>
            <img src={modalSrc} alt={modalName} className="max-w-full max-h-[80vh] rounded-lg" />
          </div>
        </div>
      )}

      {/* MODAL GROUP SELECT (codul tău de modal grup rămâne neschimbat aici) */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay fundal - Face blur la tot ce e în spate */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowGroupModal(false)}
          ></div>

          {/* Fereastra Modal */}
          <div className="relative bg-white dark:bg-[#1f1a29] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Select Study Group</h3>
                <button 
                  onClick={() => setShowGroupModal(false)}
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Lista de grupuri cu Scrollbar personalizat */}
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {myGroups && myGroups.length > 0 ? (
                  myGroups.map((group) => {
                    const isSelected = selectedGroupId === group.group_id;
                    return (
                      <div 
                        key={group.group_id}
                        onClick={() => setSelectedGroupId(group.group_id)}
                        className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between group ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/30'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`font-bold ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                            {group.group_name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                            Code: {group.group_code}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-primary animate-in zoom-in">check_circle</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-slate-300 text-5xl mb-2">group_off</span>
                    <p className="text-sm text-slate-500">You haven't joined any groups yet.</p>
                  </div>
                )}
              </div>

              {/* Butoane de Acțiune */}
              <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => {
                    setSelectedGroupId(null);
                    setShowGroupModal(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Clear Selection
                </button>
                <button 
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm Choice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
);
}

export default EditNote;