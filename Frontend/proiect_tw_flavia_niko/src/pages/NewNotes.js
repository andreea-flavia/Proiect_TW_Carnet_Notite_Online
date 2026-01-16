import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState('');
  const [ytLang, setYtLang] = useState('auto');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkPreview, setLinkPreview] = useState(null);
  const [localTranscriptText, setLocalTranscriptText] = useState('');
  const [localTranscriptError, setLocalTranscriptError] = useState('');
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

    // Repunem focusul și menținem selecția
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

  // 1. Încărcăm materiile și datele notiței (dacă edităm)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjRes = await axios.get('http://localhost:9000/api/subject');
        setSubjects(subjRes.data || []);

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

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('user_id', Number(user_id));
    formData.append('subject_id', Number(subjectId));
    formData.append('is_public', false);

    selectedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      if (id) {
        await axios.put(`http://localhost:9000/api/note/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
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

  const handleFetchTranscript = async () => {
    if (!youtubeUrl.trim()) {
      setYtError('Introdu un link YouTube');
      return;
    }
    setYtError('');
    setYtLoading(true);
    try {
      const res = await axios.get('http://localhost:9000/api/integrations/youtube/transcript', {
        params: { url: youtubeUrl.trim(), ...(ytLang !== 'auto' ? { lang: ytLang } : {}) }
      });
      const transcript = res.data?.transcript || '';
      if (!transcript) {
        setYtError('Nu am găsit transcript pentru acest video');
      } else {
        const block = `\n\n---\nTranscript YouTube:\n${transcript}\n---\n`;
        setContent(prev => (prev || '') + block);
      }
    } catch (err) {
      const apiError = err.response?.data?.error;
      const details = err.response?.data?.details;
      const msg = apiError ? (details ? `${apiError} (${details})` : apiError) : 'Eroare la preluarea transcriptului';
      setYtError(msg);
    } finally {
      setYtLoading(false);
    }
  };

  const handleLinkPreview = async () => {
    if (!linkUrl.trim()) {
      setLinkError('Introdu un link');
      return;
    }
    setLinkError('');
    setLinkLoading(true);
    setLinkPreview(null);
    try {
      const res = await axios.get('http://localhost:9000/api/integrations/link/preview', {
        params: { url: linkUrl.trim() }
      });
      setLinkPreview(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Eroare la preluarea metadatelor';
      setLinkError(msg);
    } finally {
      setLinkLoading(false);
    }
  };

  const handleInsertLinkPreview = () => {
    if (!linkPreview) return;
    const block = `\n\n---\nSursă: ${linkPreview.siteName || 'Website'}\nTitlu: ${linkPreview.title}\nLink: ${linkPreview.url}\n${linkPreview.description ? `Descriere: ${linkPreview.description}\n` : ''}---\n`;
    setContent(prev => (prev || '') + block);
  };

  const parseTranscriptFile = async (file) => {
    const text = await file.text();
    if (!text) return '';
    // Remove BOM
    const raw = text.replace(/^\uFEFF/, '');
    // Strip VTT header
    const noHeader = raw.replace(/^WEBVTT[\s\S]*?\n\n/i, '');
    // Remove timestamps and indexes
    const lines = noHeader.split(/\r?\n/);
    const cleaned = lines.filter(line => {
      const t = line.trim();
      if (!t) return false;
      if (/^\d+$/.test(t)) return false; // index
      if (/^\d{2}:\d{2}:\d{2}[\.,]\d{3}\s*-->/.test(t)) return false; // srt timestamp
      if (/^\d{2}:\d{2}\.\d{3}\s*-->/.test(t)) return false; // vtt timestamp
      return true;
    });
    return cleaned.join(' ').replace(/\s+/g, ' ').trim();
  };

  const handleLocalTranscriptUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalTranscriptError('');
    try {
      const parsed = await parseTranscriptFile(file);
      if (!parsed) {
        setLocalTranscriptError('Nu am putut extrage text din fișier');
      } else {
        setLocalTranscriptText(parsed);
      }
    } catch (err) {
      setLocalTranscriptError('Eroare la citirea fișierului');
    }
  };

  const handleInsertLocalTranscript = () => {
    if (!localTranscriptText) return;
    const block = `\n\n---\nTranscript local:\n${localTranscriptText}\n---\n`;
    setContent(prev => (prev || '') + block);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
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
          <button onClick={() => navigate('/all-notes')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors text-left">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-sm font-medium">My Notes</span>
          </button>
          <button onClick={() => navigate('/calendar')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors text-left">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-sm font-medium">Schedule</span>
          </button>
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
              {id ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
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

              {/* Toolbar Editor FUNCȚIONAL */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-lg sticky top-0 z-10 border border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => applyFormatting('**', '**')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined">format_bold</span></button>
                <button type="button" onClick={() => applyFormatting('_', '_')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined">format_italic</span></button>
                <button type="button" onClick={() => applyFormatting('\n- ')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined">format_list_bulleted</span></button>
                <button type="button" onClick={() => applyFormatting('`', '`')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined">code</span></button>
                <button type="button" onClick={() => {
                  const url = prompt("Enter URL:", "https://");
                  if (url) applyFormatting('[', `](${url})`);
                }} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined">link</span></button>
              </div>

              {/* YouTube Transcript Import */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Importă transcript YouTube</h4>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    placeholder="https://www.youtube.com/watch?v=..."
                    type="url"
                  />
                  <select
                    value={ytLang}
                    onChange={(e) => setYtLang(e.target.value)}
                    className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  >
                    <option value="auto">Auto</option>
                    <option value="en">English</option>
                    <option value="ro">Română</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="tr">Türkçe</option>
                    <option value="ar">العربية</option>
                    <option value="fa">فارسی</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleFetchTranscript}
                    disabled={ytLoading}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg disabled:opacity-60"
                  >
                    {ytLoading ? 'Se preia...' : 'Importă'}
                  </button>
                </div>
                {ytError && <p className="text-xs text-red-500">{ytError}</p>}
              </div>

              {/* Link Metadata Import */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Importă link + metadate</h4>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    placeholder="https://..."
                    type="url"
                  />
                  <button
                    type="button"
                    onClick={handleLinkPreview}
                    disabled={linkLoading}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg disabled:opacity-60"
                  >
                    {linkLoading ? 'Se preia...' : 'Previzualizează'}
                  </button>
                </div>
                {linkError && <p className="text-xs text-red-500">{linkError}</p>}
                {linkPreview && (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white/70 dark:bg-slate-900/70 space-y-2">
                    <p className="text-xs text-slate-400">{linkPreview.siteName || 'Website'}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{linkPreview.title}</p>
                    {linkPreview.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{linkPreview.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleInsertLinkPreview}
                        className="px-3 py-2 text-xs font-bold bg-primary text-white rounded-md"
                      >
                        Adaugă în notiță
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Local Transcript Upload */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Importă transcript local (.srt/.vtt)</h4>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="file"
                    accept=".srt,.vtt"
                    onChange={handleLocalTranscriptUpload}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleInsertLocalTranscript}
                    disabled={!localTranscriptText}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg disabled:opacity-60"
                  >
                    Adaugă în notiță
                  </button>
                </div>
                {localTranscriptError && <p className="text-xs text-red-500">{localTranscriptError}</p>}
                {localTranscriptText && (
                  <p className="text-xs text-slate-500">Transcript încărcat. Apasă „Adaugă în notiță”.</p>
                )}
              </div>

              <textarea 
                ref={textareaRef}
                value={content} 
                onChange={e => setContent(e.target.value)} 
                className="w-full min-h-[500px] text-lg leading-relaxed border-none focus:ring-0 placeholder-slate-300 dark:bg-transparent resize-none p-0 text-slate-800 dark:text-slate-200" 
                placeholder="Start typing..."
              ></textarea>
            </div>
          </div>

          <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hidden xl:flex flex-col p-6 space-y-8 overflow-y-auto">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                ATTACHMENTS
              </h3>
              <div className="space-y-2">
                <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-primary cursor-pointer transition-all group">
                  <span className="material-symbols-outlined text-text-sub group-hover:text-primary">upload_file</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-main dark:text-white">Upload File</p>
                    <p className="text-[10px] text-text-sub">Images, PDF, Docx</p>
                  </div>
                </label>

                {existingResources.map((res) => {
                  const isImage = res.resource_name && res.resource_name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                  return (
                    <div key={res.resource_id} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl relative group">
                      {isImage ? (
                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => openImage(res)}>
                          <img src={`http://localhost:9000${res.resource_url}`} alt={res.resource_name} className="w-12 h-12 object-cover rounded-md" />
                          <div className="text-left overflow-hidden">
                            <p className="text-sm font-medium text-text-main dark:text-white truncate">{res.resource_name}</p>
                            <p className="text-[10px] text-text-sub">Saved image</p>
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
                    <span onClick={() => removeFile(index)} className="material-symbols-outlined text-slate-300 hover:text-red-500 cursor-pointer">close</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

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