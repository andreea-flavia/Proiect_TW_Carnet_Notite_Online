import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
      {/* Sidebar Simplificat pentru navigare înapoi */}
      <aside className="w-64 h-full hidden lg:flex flex-col border-r border-[#cfe7d3] dark:border-gray-800 bg-surface-light dark:bg-background-dark p-4 shrink-0 transition-all">
        <div className="flex items-center gap-3 mb-8 px-2 mt-2">
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">Ace your exams!</h1>
          </div>
        </div>
        <nav className="flex flex-col gap-1 grow">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main dark:text-gray-300 hover:bg-accent-green transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
        <header className="h-16 shrink-0 border-b border-[#cfe7d3] dark:border-gray-800 flex items-center px-6">
          <h2 className="text-xl font-bold text-primary">Your Study Calendar</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
          {/* Grila Calendarului */}
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-xl border border-[#cfe7d3] dark:border-gray-700 max-w-md w-full">
            <Calendar 
              onChange={setDate} 
              value={date} 
              className="rounded-lg border-none font-display w-full"
            />
          </div>

          <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center w-full max-w-md">
            <h3 className="font-bold text-primary flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">event</span>
              Data selectată:
            </h3>
            <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
              {date.toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarView;