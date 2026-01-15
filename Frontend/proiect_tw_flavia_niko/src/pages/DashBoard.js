import React from 'react';

const DashBoard = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white overflow-hidden h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 h-full hidden lg:flex flex-col border-r border-[#cfe7d3] dark:border-gray-800 bg-surface-light dark:bg-background-dark p-4 shrink-0 transition-all">
        <div className="flex items-center gap-3 mb-8 px-2 mt-2">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0 border border-gray-200 dark:border-gray-700"
            data-alt="Student profile picture showing a smiling face"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAw7fSMa8SMOEBhQ6S6sarYw6dq98UaYxPFw3OSVwOouPHMXcuUuXod9FOsgk2NR62cNR4O8yb1e4SkeOLFbSKCQORm9HB7ihXdeZ-yVB8HgG2o3VwxIDEvEz0SzzYqYlNLFEsUTiVOHOTavIU5V3PtytNQzrKHBeHc6LzRvE4Htwqy5hYcpc4jNDo0DRg3zPFfGMq1iYy5ibnoLFm9GSlSmxNOmPmCo9RxybQD37pgPnql-HuXdhxmWO95LPZOow6MY4MRcl7zYxEf")',
            }}
          />
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">Friendly Notes</h1>
            <p className="text-text-sub dark:text-gray-400 text-xs font-normal leading-normal truncate">Manage your learning</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 grow">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/20 dark:bg-primary/10 text-text-main dark:text-white group transition-colors" href="#">
            <span className="material-symbols-outlined text-primary dark:text-primary fill-1">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-sm font-medium">All Notes</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <span className="material-symbols-outlined">class</span>
            <span className="text-sm font-medium">Courses</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="text-sm font-medium">Calendar</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <span className="material-symbols-outlined">star</span>
            <span className="text-sm font-medium">Favorites</span>
          </a>
          <div className="my-4 border-t border-[#cfe7d3] dark:border-gray-800" />
          <p className="px-3 text-xs font-semibold text-text-sub dark:text-gray-500 uppercase tracking-wider mb-1">Tags</p>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-sm font-medium">#ExamPrep</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-sm font-medium">#Homework</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-sm font-medium">#Research</span>
          </a>
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <span className="material-symbols-outlined">delete</span>
            <span className="text-sm font-medium">Trash</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green dark:hover:bg-surface-dark transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
          <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-12 bg-primary hover:bg-[#0fd630] transition-colors text-text-main text-sm font-bold shadow-sm mt-2">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create New Note</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 shrink-0 border-b border-[#cfe7d3] dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-sub dark:text-gray-500 group-focus-within:text-primary transition-colors">search</span>
              </div>
              <input className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-white dark:bg-surface-dark text-text-main dark:text-white placeholder-text-sub dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm shadow-sm" placeholder="Search your notes by keyword, tag, or subject..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="md:hidden p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 relative text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1" />
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <p className="hidden sm:block text-sm font-semibold text-text-main dark:text-white">Alex Morgan</p>
              <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfLK3pD-ADZZQQ-Kryfjs2w1h7rNOcvLZKQNO0JExepjue2xQcbMU3g62q1LTAEsHtwrj5F4aWUMvLuQj8gVjIwGNgiE9-gpwbEjoorOf7dOV1V7lvP4_oqQpjLNLzjYI4lNe1IuluNc4q__PgbhFxNS1XIvdqBcxaKtkctTSFfNbyPRA2HlQFjyiTJekYYAN5_PJt5Yci1DZEvCDB3vJmBOn53XORBAsWsKYAvjjqhIkTZhfI4l5HA8hFDUUdDw5n867KG-z_VPDU")' }} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <section className="@container">
            <div className="relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark border border-[#cfe7d3] dark:border-gray-700 min-h-[200px] flex flex-col justify-end p-6 md:p-8 group shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-20 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBP5wcRe1BYgW9J9keX6YOwn6ZG5PO_y3tGhzM7taI4Tw4l8J6QHNpCNnk5IcBh4-fVreBweRFa52_kh-t4KGovZKWdFjAz9ajy2533TPWyw_0SfKITVyBpYEChjhaoSYBAvx6sucwVpykdENrlRJvkWsR8O8O8cjJOetnA-JAB6nBVkV4QSCQffS9QhM1yQa91r5MowyKd1ZVsnDmZ8K_swMq6ouE0I0shw9ft1PStJZ0v_moLf2cuPl7z968ZFxzsJ6IMCmsRLN9g")' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark/90 via-transparent to-transparent" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-2">Good Morning, Alex! 👋</h2>
                <p className="text-text-main/80 dark:text-gray-300 text-lg">You have 3 upcoming exams and 2 notes to review. Ready to learn?</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sticky top-0 z-20 pt-2 pb-4 bg-background-light dark:bg-background-dark transition-all">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-text-main px-4 text-sm font-bold shadow-sm transition-transform active:scale-95">All Notes</button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-[#cfe7d3] dark:border-gray-700 px-4 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-[#e7f3e9] dark:hover:bg-gray-800 transition-colors">Biology <span className="w-2 h-2 rounded-full bg-green-500" /></button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-[#cfe7d3] dark:border-gray-700 px-4 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-[#e7f3e9] dark:hover:bg-gray-800 transition-colors">History <span className="w-2 h-2 rounded-full bg-red-500" /></button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-[#cfe7d3] dark:border-gray-700 px-4 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-[#e7f3e9] dark:hover:bg-gray-800 transition-colors">Math <span className="w-2 h-2 rounded-full bg-blue-500" /></button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-[#cfe7d3] dark:border-gray-700 pl-3 pr-2 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-[#e7f3e9] dark:hover:bg-gray-800 transition-colors"><span className="material-symbols-outlined text-[18px]">filter_list</span> More</button>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label className="text-sm text-text-sub dark:text-gray-500 font-medium mr-1">Sort by:</label>
              <div className="relative">
                <select className="appearance-none bg-white dark:bg-surface-dark border border-[#cfe7d3] dark:border-gray-700 text-text-main dark:text-white py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Alphabetical</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2.5 text-gray-500 text-[18px] pointer-events-none">expand_more</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {/* Cards omitted for brevity (static examples from original design) */}
            <div className="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-[#cfe7d3] dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative">
              <div className="absolute left-0 top-4 bottom-4 w-1 bg-green-500 rounded-r-md" />
              <div className="flex justify-between items-start mb-3 ml-2">
                <div>
                  <span className="inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase tracking-wider mb-1">Biology</span>
                  <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight">Intro to Molecular Biology</h3>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-primary">
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>
              <div className="flex-1 ml-2 mb-4">
                <p className="text-sm text-text-main/80 dark:text-gray-400 line-clamp-3 leading-relaxed">Mitochondria functions are critical for cellular respiration. Remember the Krebs cycle steps: Citrate -&gt; Isocitrate -&gt; Alpha-Ketoglutarate...</p>
              </div>
              <div className="ml-2 flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-medium text-text-sub bg-[#e7f3e9] dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-md">#ExamPrep</span>
                <span className="text-xs font-medium text-text-sub bg-[#e7f3e9] dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-md">#CellStructure</span>
              </div>
              <div className="ml-2 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-text-sub dark:text-gray-500">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> Oct 12, 2023</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-primary/10 rounded-md text-gray-400 hover:text-primary transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                  <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-500 transition-colors" title="Delete"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              </div>
            </div>

            {/* Add New Placeholder Card */}
            <button className="group flex flex-col items-center justify-center min-h-[260px] bg-background-light dark:bg-background-dark/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary p-5 transition-all duration-200 hover:bg-primary/5 cursor-pointer">
              <div className="h-14 w-14 rounded-full bg-white dark:bg-surface-dark shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">Create New Note</h3>
              <p className="text-sm text-text-sub dark:text-gray-500 text-center">Capture your thoughts instantly</p>
            </button>
          </section>
        </div>

        <button className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-text-main active:scale-95 transition-transform z-30">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </main>
    </div>
  );
};

export default DashBoard;
