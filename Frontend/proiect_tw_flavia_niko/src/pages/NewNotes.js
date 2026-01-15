import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

function NewNotes() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  
  const [tags, setTags] = useState([]); 
  const [tag_id, setTagId] = useState('');
  
  const navigate = useNavigate();



  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/subject');
        setSubjects(res.data || []);
      } catch (err) {
        console.error('Failed to load subjects', err);
      }
    };
    fetchSubjects();
  }, []);

 useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/tag');
        setTags(response.data);
      } catch (err) {
        console.log("Error loading tags:", err);
      }
    };
    fetchTags();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('You must be logged in to save notes');
      return;
    }
    if (!title.trim() || !content.trim() || !subjectId) {
      alert('Please provide a title, subject and content');
      return;
    }
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        user_id: Number(user_id),
        subject_id: Number(subjectId),
        is_public: false
      };
      await axios.post('http://localhost:9000/api/note', payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving note', err);
      alert('Error saving note');
    }
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
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
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
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-light dark:bg-primary/10 text-primary group transition-colors" href="#">
            <span className="material-symbols-outlined fill-1">add_circle</span>
            <span className="text-sm font-semibold">New Note</span>
          </a>
          <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subjects</p>
          <div className="flex flex-col gap-0.5">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">functions</span>
              <span className="text-sm font-medium">Mathematics</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">terminal</span>
              <span className="text-sm font-medium">Computer Science</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">payments</span>
              <span className="text-sm font-medium">Economics</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">magnification_small</span>
              <span className="text-sm font-medium">Biology</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-sub dark:text-gray-400 hover:bg-accent-purple dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">account_balance</span>
              <span className="text-sm font-medium">History</span>
            </a>
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
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-2 text-text-sub text-sm">
              <span>Notes</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="font-medium text-text-main dark:text-white">Create New Note</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-text-sub hover:text-text-main dark:hover:text-white transition-colors">Cancel</button>
            <button type="button" onClick={handleSave} className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span>
              Save Note
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full text-4xl font-extrabold border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 dark:bg-transparent text-slate-900 dark:text-white p-0" placeholder="Note Title..." type="text" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                {/* Alege subjects */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                  <div className="relative">
                    <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none">
                      <option disabled value="">Select a subject</option>
                      {subjects.map(s => (
                        <option key={s.subject_id} value={s.subject_id}>{s.subject_name || s.name || s.title || ('Subject ' + s.subject_id)}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">auto_stories</span>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-xl pointer-events-none">expand_more</span>
                  </div>
                </div>
                {/* alege Tag */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tags</label>
                  <div className="relative">

                    {/* <span className="material-symbols-outlined absolute left-3 text-slate-400 text-xl">sell</span>
                    <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="Add tags (e.g. #exam, #lecture)" type="text" /> */}
                  
                    <select value={tag_id} onChange={ e => setTagId(e.target.value)} className = "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none">
                      <option disabled value="">Select a tag</option>
                      {tags.map( t => (
                        <option key={t.tag_id} value={t.tag_id}> {t.tag_name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">sell </span>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">expand_more</span>


                  </div>
                </div>
                {/* ------ */}
              </div>
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-lg sticky top-0 z-10 border border-slate-100 dark:border-slate-700">
                <button className="editor-toolbar-btn" title="Bold"><span className="material-symbols-outlined">format_bold</span></button>
                <button className="editor-toolbar-btn" title="Italic"><span className="material-symbols-outlined">format_italic</span></button>
                <button className="editor-toolbar-btn" title="Strikethrough"><span className="material-symbols-outlined">format_strikethrough</span></button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button className="editor-toolbar-btn" title="Heading 1"><span className="material-symbols-outlined">format_h1</span></button>
                <button className="editor-toolbar-btn" title="Heading 2"><span className="material-symbols-outlined">format_h2</span></button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button className="editor-toolbar-btn" title="Bulleted List"><span className="material-symbols-outlined">format_list_bulleted</span></button>
                <button className="editor-toolbar-btn" title="Numbered List"><span className="material-symbols-outlined">format_list_numbered</span></button>
                <button className="editor-toolbar-btn" title="Checklist"><span className="material-symbols-outlined">checklist</span></button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button className="editor-toolbar-btn" title="Code Block"><span className="material-symbols-outlined">code</span></button>
                <button className="editor-toolbar-btn" title="Quote"><span className="material-symbols-outlined">format_quote</span></button>
                <button className="editor-toolbar-btn" title="Link"><span className="material-symbols-outlined">link</span></button>
                <div className="ml-auto flex items-center gap-1">
                  <button className="editor-toolbar-btn" title="Preview Mode"><span className="material-symbols-outlined">visibility</span></button>
                  <button className="editor-toolbar-btn" title="Fullscreen"><span className="material-symbols-outlined">fullscreen</span></button>
                </div>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full min-h-[500px] text-lg leading-relaxed border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 dark:bg-transparent resize-none p-0 text-slate-800 dark:text-slate-200" placeholder="Start typing your study notes here... Markdown is supported."></textarea>
            </div>
          </div>

          <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hidden xl:flex flex-col p-6 space-y-8 overflow-y-auto">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                Attachments
                <button className="text-primary hover:underline lowercase font-normal">Add more</button>
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-primary hover:bg-primary-light transition-all group">
                  <span className="material-symbols-outlined text-text-sub group-hover:text-primary">upload_file</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-main dark:text-white">Upload File</p>
                    <p className="text-[10px] text-text-sub">Images, PDF, Docx</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-blue-500">image</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-main dark:text-white">biology_chart.png</p>
                    <p className="text-[10px] text-text-sub">1.2 MB</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 ml-auto hover:text-red-500 cursor-pointer">close</span>
                </button>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Integrations</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-50 text-red-600">
                    <span className="material-symbols-outlined">smart_display</span>
                  </div>
                  <span className="text-xs font-semibold text-text-main dark:text-white">YouTube</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <span className="material-symbols-outlined">auto_stories</span>
                  </div>
                  <span className="text-xs font-semibold text-text-main dark:text-white">Kindle</span>
                </button>
              </div>
              <button className="w-full py-2.5 bg-accent-purple dark:bg-slate-800 text-primary dark:text-primary-light text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">Embed Content</button>
            </section>
            <section className="p-4 bg-primary rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-sm font-bold mb-1">Markdown Tip</h4>
                <p className="text-xs text-white/80 leading-relaxed">Use <code className="bg-white/20 px-1 rounded">#</code> for titles and <code className="bg-white/20 px-1 rounded">**bold**</code> for emphasis.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-7xl text-white/10 select-none">lightbulb</span>
            </section>
          </aside>
        </div>

        <div className="xl:hidden fixed bottom-6 right-6 flex flex-col gap-3">
          <button className="h-14 w-14 bg-white border border-slate-200 shadow-xl rounded-full flex items-center justify-center text-text-sub hover:text-primary transition-colors">
            <span className="material-symbols-outlined">attachment</span>
          </button>
          <button onClick={handleSave} className="h-14 w-14 bg-primary text-white shadow-xl rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors">
            <span className="material-symbols-outlined">save</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default NewNotes;
