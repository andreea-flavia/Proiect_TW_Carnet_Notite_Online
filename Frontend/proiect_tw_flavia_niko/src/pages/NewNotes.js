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
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
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

  const buttonHover = "hover:translate-x-1 transition-transform duration-200";
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
        const userId = localStorage.getItem('user_id');
        const subjRes = await axios.get('http://localhost:9000/api/subject');
        setSubjects(subjRes.data || []);

        const tagsRes = await axios.get('http://localhost:9000/api/tag');
        setTags(tagsRes.data || []);

        if (userId) {
          const groupsRes = await axios.get(`http://localhost:9000/api/user/${userId}/groups`);
          setMyGroups(groupsRes.data || []);
        }

        if (id) {
          const noteRes = await axios.get(`http://localhost:9000/api/note/${id}/details`);
          if (noteRes.data) {
            setTitle(noteRes.data.title || '');
            setContent(noteRes.data.content || '');
            setSubjectId(noteRes.data.subject_id || '');
            setExistingResources(noteRes.data.resources || []);
            if (noteRes.data.tags) {
              setSelectedTags(noteRes.data.tags.map(t => t.tag_id));
            }
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

  const handleTagClick = (tagId) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(tagId)) {
        return prevSelected.filter((id) => id !== tagId);
      }
      return [...prevSelected, tagId];
    });
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

    formData.append('tagIds', JSON.stringify(selectedTags));

    selectedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      let savedNoteId = id;
      if (id) {
        await axios.put(`http://localhost:9000/api/note/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const res = await axios.post('http://localhost:9000/api/note', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        savedNoteId = res.data.note_id || res.data.id;
      }

      if (selectedGroupId && savedNoteId) {
        try {
          const payload = {
            note_id: Number(savedNoteId),
            group_id: Number(selectedGroupId),
            created_by: Number(user_id)
          };
          await axios.post('http://localhost:9000/api/group/note', payload);
        } catch (e) {
          if (e.response?.status === 400) {
            console.warn('Note already added to this group.');
          } else {
            console.error('Error adding note to group:', e);
          }
        }
      }

      if (selectedGroupId) {
        navigate(`/group/${selectedGroupId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error saving note', err);
      alert('Error saving note');
    }
  };

  const handleFetchTranscript = async () => {
    if (!youtubeUrl.trim()) {
      setYtError('Add a YouTube link');
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
        setYtError('Nu am gasit transcript pentru acest video');
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
      setLinkError('Add a link');
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
            <button
              type="button"
              onClick={() => setShowGroupModal(true)}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 border-2 
                ${selectedGroupId
                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                  : 'bg-transparent border-dashed border-gray-300 dark:border-gray-700 text-[#706189] dark:text-gray-400 hover:border-primary hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">group_add
                {/* {selectedGroupId ? 'group_check' : 'group_add'} */}
              </span>
              {selectedGroupId ? 'Group Selected' : 'Share to Group'}
            </button>
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
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tags</label>
                  <div className="flex flex-wrap gap-2 p-1">
                    {tags.map((t) => {
                      const isSelected = selectedTags.includes(t.tag_id);
                      return (
                        <button
                          key={t.tag_id}
                          type="button"
                          onClick={() => handleTagClick(t.tag_id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border
                            ${isSelected
                              ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 translate-y-[-1px]'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary/50'
                            }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isSelected ? 'check_circle' : 'sell'}
                          </span>
                          #{t.tag_name}
                        </button>
                      );
                    })}
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
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">smart_display</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Import YouTube transcript</h4>
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
                    {ytLoading ? 'Se preia...' : 'Import'}
                  </button>
                </div>
                {ytError && <p className="text-xs text-red-500">{ytError}</p>}
              </div>

              {/* Link Metadata Import */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">link</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Import link + metadate</h4>
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
                    {linkLoading ? 'Se preia...' : 'Preview'}
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
                        Add to note
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Local Transcript Upload */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500">upload_file</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Import local transcript (.srt/.vtt)</h4>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="file"
                    accept=".srt,.vtt"
                    onChange={handleLocalTranscriptUpload}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                  />
                  <button
                    type="button"
                    onClick={handleInsertLocalTranscript}
                    disabled={!localTranscriptText}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg disabled:opacity-60"
                  >
                    Add to note
                  </button>
                </div>
                {localTranscriptError && <p className="text-xs text-red-500">{localTranscriptError}</p>}
                {localTranscriptText && (
                  <p className="text-xs text-slate-500">Transcript loaded. Press "Add to note".</p>
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
                      className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between group ${selectedGroupId === group.group_id
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

export default NewNotes;