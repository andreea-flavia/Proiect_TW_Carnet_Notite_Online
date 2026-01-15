import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


const slides = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArEz6ju9_lnRrVtlxI_-k-ERBMPkABPwr2z0e--C-2M5Pb6m5Icm1gO_gT9rCylAuZO5pTcJZ7z3youGWOa1sSZ0AlcTf3sfnkBDsrB8EPy1NpvlOUiu6YQURLDgDiVB2nljbd14Umwtyq1xYl6-n-ilLvaZZKgptkILjxqf38EdrsNsooBTfpVdzjrxlDy1mYZOVVyP5vOBfhNQt1eeRmZ-gTxAZR35LZ2-C3ru4gm_oKh1w0sE-UNXCivApHj1J4PlrmBLFGlS3N",
    quote: "The best way to organize my seminar notes. Simple and effective."
  },
  {
    image: "https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1200",
    quote: "No more lost papers in your backpack. StudioTeca keeps everything just one click away."
  },
  {
    image: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1200",
    quote: "Exam season is no longer a nightmare when your courses are organized by groups and subjects."
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
    quote: "Collaborating with classmates has never been more fun. Study smarter, not harder!"
  },
  {
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200",
    quote: "From that 'holy' passing grade to merit scholarships, it all starts with great organization."
  },
  {
    image: "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=1200",
    quote: "An interface so simple you can track your grades even during a fast-paced lecture."
  }
];


const Home = () => {
  const navigate = useNavigate();

const [currentSlide, setCurrentSlide] = useState(0); 

useEffect(() => {
  if (slides.length <= 1) return;

  const timer = setInterval(() => {
    setCurrentSlide((prev) => {
      const nextIndex = prev === slides.length - 1 ? 0 : prev + 1;
      return nextIndex;
    });
  }, 5000); 

  return () => clearInterval(timer);
}, []);


  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
  navigate('/Register');
};

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#0d141b] dark:text-slate-50 antialiased">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        
        {/* Header Section */}
        <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-[#0d141b] dark:text-slate-50">StudioTeca</h2>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:px-6">
          <div className="w-full max-w-[1080px] bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            
            {/* Left Column: Home Form */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
              <div className="max-w-[420px] mx-auto w-full flex flex-col gap-8">
                <div className="flex flex-col gap-3 text-left">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0d141b] dark:text-white leading-[1.1]">
                    Welcome!
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                    Ready to ace your exams? Log in to access your seminar notes and course materials.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button onClick={handleLoginClick} className="group flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary hover:bg-purple-600 transition-all text-white shadow-lg shadow-purple-500/20 active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[24px]">school</span>
                    <span className="text-base font-bold tracking-wide">Log in with @stud.ase.ro</span>
                  </button>

                  <button 
                    onClick={handleRegisterClick} 
                    className="group flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:text-primary transition-all text-slate-600 dark:text-slate-300 font-medium active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[22px]">person_add</span>
                    <span className="text-base">Request acces for institutional account</span>
                  </button>
                </div>

                

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 text-xs text-purple-800 dark:text-purple-200">
                  <span className="material-symbols-outlined text-lg">info</span>
                  <p>By logging in, you agree to the university's Acceptable Use Policy.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual/Image */}
            <div className="hidden md:flex flex-1 bg-slate-50 dark:bg-[#15202b] items-center justify-center relative p-12">
              <div 
                className="absolute inset-0 opacity-10 dark:opacity-5" 
                style={{ backgroundImage: 'radial-gradient(#7C3AED 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              ></div>
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  data-alt="Student studying with laptop and notebooks on a clean desk"
                  style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white w-full bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex gap-2 mb-2">
                      <span className="material-symbols-outlined text-yellow-400">star</span>
                      <span className="material-symbols-outlined text-yellow-400">star</span>
                      <span className="material-symbols-outlined text-yellow-400">star</span>
                      <span className="material-symbols-outlined text-yellow-400">star</span>
                      <span className="material-symbols-outlined text-yellow-400">star</span>
                    </div>
                    <p className="text-lg font-medium transition-opacity duration-500">
                      "{slides[currentSlide].quote}"
                    </p>
                    <div className="flex gap-2 mt-4">
                      {slides.map((_, index) => (
                        <div 
                          key={index}
                          className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 text-center px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Cookie Settings</a>
            </div> */}
            <p className="text-sm text-slate-400">© 2026 StudioTeca. Designed for students.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
