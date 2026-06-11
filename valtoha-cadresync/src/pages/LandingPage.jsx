import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4"
      style={{
        backgroundColor: '#fcf9f2',
        backgroundImage: "url('/landing-page.png')", // Direct public path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      
      {/* Central Content Box */}
      <div className="z-10 text-center max-w-xl flex flex-col items-center bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl">
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-2">
          Valtoha CLF
        </h1>
        <p className="text-md md:text-xl font-bold text-emerald-800 tracking-wide mb-12">
          DAY-NRLM • National Rural Livelihoods Mission
        </p>

        {/* Central Saffron Get Started Button */}
        <button 
          onClick={() => navigate('/login')}
          className="px-14 py-4.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg rounded-full shadow-xl shadow-amber-600/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 tracking-wider uppercase cursor-pointer"
        >
          Get Started
        </button>
      </div>

    </div>
  );
};

export default LandingPage;
