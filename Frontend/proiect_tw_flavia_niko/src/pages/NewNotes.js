import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function NewNotes() {
const { id } = useParams(); // Preluăm ID-ul pentru editare
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
const [selectedFiles, setSelectedFiles] = useState([]); // State pentru atașamente  
  const [existingResources, setExistingResources] = useState([]); // Resurse deja atașate (pentru edit) 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalName, setModalName] = useState('');
    const navigate = useNavigate();

// 1. Încărcăm materiile și datele notiței (dacă edităm)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjRes = await axios.get('http://localhost:9000/api/subject');
        setSubjects(subjRes.data || []);

        // Dacă avem ID în URL, suntem pe modul Editare
        if (id) {
          const noteRes = await axios.get(`http://localhost:9000/api/note/${id}/details`);
          if (noteRes.data) {
            setTitle(noteRes.data.title || '');
            setContent(noteRes.data.content || '');
            setSubjectId(noteRes.data.subject_id || '');
            setExistingResources(noteRes.data.resources || []);
          }
        }
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };
    fetchData();
  }, [id]);

 // 2. Gestionare fișiere (Upload)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Eliminare fișier din listă înainte de salvare
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Sterge o resursa existenta (atașament salvat deja)
  const handleDeleteResource = async (resourceId) => {
    try {
      await axios.delete(`http://localhost:9000/api/resource/${resourceId}`);
        setExistingResources((prev) => prev.filter(r => r.resource_id !== resourceId));
      } catch (err) {
        console.error('Failed to delete resource', err);
alert('Could not delete resource');
      }
    };
    
  const openImage = (res) => {
    setModalSrc(`http://localhost:9000${res.resource_url}`);
    setModalName(res.resource_name || 'image');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc('');
    setModalName('');
  };

  // 3. Salvare (POST pentru notiță nouă, PUT pentru editare)
  const handleSave = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      alert('Trebuie să fii logat pentru a salva notițe');
      return;
    }
    if (!title.trim() || !content.trim() || !subjectId) {
      alert('Te rugăm să completezi Titlul, Materia și Conținutul');
      return;
    }
    
    // Folosim FormData pentru a putea trimite fișiere (imagini, documente)
      const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('user_id', Number(user_id));
    formData.append('subject_id', Number(subjectId));
    formData.append('is_public', false);

    // Adăugăm fiecare fișier selectat în FormData
    selectedFiles.forEach((file) => {
      formData.append('attachments', file); // 'attachments' trebuie să coincidă cu ce așteaptă backend-ul (Multer)
    });

    try {
      if (id) {
        // Editare
        await axios.put(`http://localhost:9000/api/note/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Creare notiță nouă
      await axios.post('http://localhost:9000/api/note', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
}
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving note', err);
      alert('Error saving note');
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
{/* Sidebar - Neschimbat conform designului tău */}
      <aside className="w-64 h-full hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark shrink-0">
        <div className="flex items-center gap-3 p-6">
          <div className="bg-primary p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-white">edit_note</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">StudioTeca</h1>
        </div>
        <nav className="flex flex-col gap-1 px-4 grow overflow-y-auto">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-sm font-medium">My Notes</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-sm font-medium">Schedule</span>
          </a>
          <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Workspace</p>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-light dark:bg-primary/10 text-primary group transition-colors">
            <span className="material-symbols-outlined fill-1">{id ? 'edit' : 'add_circle'}</span>
              <span className="text-sm font-semibold">{id ? 'Edit Note' : 'New Note'}</span>
          </div>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-text-sub mb-2">Storage Usage</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[45%]"></div>
            </div>
            <p className="text-[10px] text-text-sub mt-2">2.3 GB of 5 GB used</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
{/* Header cu butoanele de Cancel și Save */}
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-text-sub text-sm">
              <span>Notes</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="font-medium text-text-main dark:text-white">{id ? 'Edit Note' : 'Create New Note'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-semibold text-text-sub hover:text-text-main dark:hover:text-white transition-colors">Cancel</button>
            <button type="button" onClick={handleSave} className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span>
{id ? 'Update Note' : '              Save Note'}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
{/* Zona Centrală: Titlu, Materie și Conținut */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full text-4xl font-extrabold border-none focus:ring-0 placeholder-slate-300 dark:bg-transparent text-slate-900 dark:text-white p-0" placeholder="Note Title..." type="text" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                  <div className="relative">
                    <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 appearance-none">
                      <option disabled value="">Select a subject</option>
                      {subjects.map(s => (
                        <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">auto_stories</span>
                                      </div>
                </div>
                                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tags</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">sell</span>
                    <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2" placeholder="Add tags..." type="text" />
                  </div>
                </div>
                              </div>

              {/* Toolbar Editor */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-lg sticky top-0 z-10 border border-slate-100">
                <button className="p-2 hover:bg-white rounded"><span className="material-symbols-outlined">format_bold</span></button>
                <button className="p-2 hover:bg-white rounded"><span className="material-symbols-outlined">format_italic</span></button>
                <button className="p-2 hover:bg-white rounded"><span className="material-symbols-outlined">format_list_bulleted</span></button>
                <button className="p-2 hover:bg-white rounded"><span className="material-symbols-outlined">code</span></button>
                <button className="p-2 hover:bg-white rounded"><span className="material-symbols-outlined">link</span></button>
                              </div>

              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full min-h-[500px] text-lg leading-relaxed border-none focus:ring-0 placeholder-slate-300 dark:bg-transparent resize-none p-0 text-slate-800 dark:text-slate-200" placeholder="Start typing..."></textarea>
            </div>
          </div>

{/* ASIDE ATTACHMENTS (Aceasta este zona din dreapta pozei tale) */}
          <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hidden xl:flex flex-col p-6 space-y-8 overflow-y-auto">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                ATTACHMENTS
              </h3>
              <div className="space-y-2">
                {/* Input ascuns pentru fișiere declanșat de label-ul de mai jos */}
                <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-primary cursor-pointer transition-all group">
                  <span className="material-symbols-outlined text-text-sub group-hover:text-primary">upload_file</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-main dark:text-white">Upload File</p>
                    <p className="text-[10px] text-text-sub">Images, PDF, Docx</p>
                  </div>
                </label>

                {/* Lista fișierelor pe care le-ai selectat de pe calculator */}
                {/* Existing uploaded resources (from server) */}
                {existingResources.map((res) => {
                  const isImage = res.resource_name && res.resource_name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                  return (
                    <div key={res.resource_id} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl relative group">
                      {isImage ? (
                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => openImage(res)}>
                  <img src={`http://localhost:9000${res.resource_url}`} alt={res.resource_name} className="w-12 h-12 object-cover rounded-md" />
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-medium text-text-main dark:text-white truncate">{res.resource_name}</p>
                    <p className="text-[10px] text-text-sub">Saved image — click to view</p>
                  </div>
                                </div>
            ) : (
                        <a href={`http://localhost:9000${res.resource_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 flex-1">
              <span className="material-symbols-outlined text-blue-500">description</span>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-medium text-text-main dark:text-white truncate">{res.resource_name}</p>
                            <p className="text-[10px] text-text-sub">Saved attachment</p>
                  </div>
</a>
                      )}
                  <span onClick={() => handleDeleteResource(res.resource_id)} className="material-symbols-outlined text-slate-300 hover:text-red-500 cursor-pointer">close</span>
                </div>
                  );
                })}

                {selectedFiles.map((file, index) => (
                  <div key={index} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl relative group">
                    <span className="material-symbols-outlined text-blue-500">
                      {file.type.startsWith('image/') ? 'image' : 'description'}
                    </span>
                  <div className="text-left flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-text-main dark:text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-text-sub">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    {/* Buton de eliminare (X) pentru a scoate fișierul înainte de salvare */}
                    <span onClick={() => removeFile(index)} className="material-symbols-outlined text-slate-300 hover:text-red-500 cursor-pointer">close</span>
                  </div>
                  ))}
              </div>
                          </section>
          </aside>
        </div>
</main>
      {/* Image modal/lightbox */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeModal}>
            <div className="max-w-[90%] max-h-[90%] p-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end mb-2">
          <button onClick={closeModal} className="text-white bg-slate-800/50 px-3 py-1 rounded">Close</button>
            </div>
            <img src={modalSrc} alt={modalName} className="max-w-full max-h-[80vh] rounded shadow-lg mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}

export default NewNotes;