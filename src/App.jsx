import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal, Heart, Cpu, Code2, Award, Calendar, Quote, 
  Sparkles, ArrowRight, ShieldCheck, GitCommit, Zap, UserCheck,
  MessageSquare, Network, Building2
} from 'lucide-react';

/* --- SOUND ENGINE (Web Audio API) --- 
   Generates sounds without external files */
const useSound = () => {
  const audioContext = useRef(null);

  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
  };

  const playTone = (freq, type, duration, vol = 0.1) => {
    if (!audioContext.current) return;
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);
    gain.gain.setValueAtTime(vol, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + duration);
  };

  const playTypingSound = () => {
    // Randomize pitch slightly for realism
    const freq = 800 + Math.random() * 400; 
    playTone(freq, 'square', 0.05, 0.02);
  };

  const playSuccessChime = () => {
    // A major chord
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 1.5, 0.1), i * 100);
    });
  };

  const playBootSound = () => {
    playTone(150, 'sawtooth', 0.5, 0.05);
    setTimeout(() => playTone(300, 'sine', 0.8, 0.05), 200);
  };

  return { initAudio, playTypingSound, playSuccessChime, playBootSound };
};

/* --- MAIN COMPONENT --- */
const Card = () => {
  const [stage, setStage] = useState('init'); // 'init', 'boot', 'card', 'thankyou'
  const [bootLines, setBootLines] = useState([]);
  const [cardVisible, setCardVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { initAudio, playTypingSound, playSuccessChime, playBootSound } = useSound();
  
  // Advanced Log Sequence
  const bootSequence = [
    { text: "> CONNECTING TO TECH.AT.CORE MAINFRAME...", delay: 3000 },
    { text: "> USER: KARTHIKEYA | TARGET: PREETHAM @ TECH.AT.CORE", delay: 3000 },
    { text: "> FETCHING GIT_HISTORY (LAST 365 DAYS)...", delay: 1800 },
    { text: "> FOUND COMMIT: 'First Day at Tech.at.Core' [HASH: FEB 03 -2025]", delay: 2400 },
    { text: "> LOADING MODULES: LangChain, AI_Agents, MCP...", delay: 1000 },
    { text: "> RESOLVING DEPENDENCIES: Guidance, Trust, Patience...", delay: 3800 },
    { text: "> DEBUGGING: Imposter_Syndrome... PATCHED BY MENTORSHIP", delay: 4800, color: "text-amber-400" },
    { text: "> COMPILING GROWTH_METRICS...", delay: 5800 },
    { text: "> STATUS: 1 YEAR MILESTONE ACHIEVED.", delay: 6600, color: "text-green-400" },
    { text: "> EXECUTING PROTOCOL: GRATITUDE_V1.0", delay: 7500, color: "text-cyan-400" },
  ];

  const startExperience = () => {
    initAudio();
    playBootSound();
    setStage('boot');
    
    let timeouts = [];
    
    bootSequence.forEach(({ text, delay, color }, index) => {
      const timeout = setTimeout(() => {
        setBootLines(prev => [...prev, { text, color }]);
        playTypingSound();
        const terminal = document.getElementById('terminal-content');
        if (terminal) terminal.scrollTop = terminal.scrollHeight;
      }, delay);
      timeouts.push(timeout);
    });

    // Transition to card
    const finalTimeout = setTimeout(() => {
      setStage('card');
      setTimeout(() => setCardVisible(true), 100);
      playSuccessChime();
    }, 8500);
    timeouts.push(finalTimeout);
  };

  const handleHandshake = () => {
    setShowConfetti(true);
    playSuccessChime();
    
    // Animate Card Out
    setCardVisible(false);
    
    // Switch to Thank You screen after card fade out starts
    setTimeout(() => {
        setStage('thankyou');
    }, 800);
  };

  // Helper for highlights
  const Highlight = ({ children, color = "text-cyan-400" }) => (
    <span className={`font-mono font-medium ${color} bg-slate-800/80 border border-slate-700/50 px-1.5 py-0.5 rounded text-sm mx-0.5 inline-block hover:scale-105 transition-transform cursor-default`}>
      {children}
    </span>
  );

  // Background Animation
  const Background = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.9)_2px,transparent_2px),linear-gradient(90deg,rgba(15,23,42,0.9)_2px,transparent_2px)] bg-[size:50px_50px] [transform:perspective(1000px)_rotateX(60deg)] opacity-20 animate-grid-flow"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    </div>
  );

  // Confetti
  const Confetti = () => {
    // Increased particle count for the finale
    const particles = Array.from({ length: 80 });
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti-drop"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animationDelay: `${Math.random() * 2}s`, // Varied delay
              animationDuration: `${3 + Math.random() * 3}s`, // Varied speed
            }}
          >
             {i % 4 === 0 ? <Heart size={Math.random() * 25 + 10} className="text-rose-500" fill="currentColor" /> : 
              i % 4 === 1 ? <Code2 size={Math.random() * 25 + 10} className="text-cyan-500" /> :
              i % 4 === 2 ? <Zap size={Math.random() * 25 + 10} className="text-yellow-400" fill="currentColor" /> :
              <Award size={Math.random() * 25 + 10} className="text-purple-500" />}
          </div>
        ))}
      </div>
    );
  };

  /* --- STAGE 1: INITIALIZE --- */
  if (stage === 'init') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
        <Background />
        <button 
          onClick={startExperience}
          className="group relative z-10 px-8 py-4 bg-slate-900 border border-cyan-500/50 text-cyan-400 rounded-lg overflow-hidden transition-all hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="flex items-center gap-3 relative">
            <GitCommit className="animate-pulse" />
            <span className="tracking-widest font-bold text-lg">INITIALIZE LINK</span>
          </div>
        </button>
      </div>
    );
  }

  /* --- STAGE 2: BOOT TERMINAL --- */
  if (stage === 'boot') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-mono relative">
        <Background />
        <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-800 shadow-2xl p-6 relative overflow-hidden z-10">
           {/* Scanline */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-20 animate-scan pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-rose-500"></div>
               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
             </div>
             <span className="text-xs text-slate-500">root@tech.at.core-internship:~</span>
           </div>
           
           <div id="terminal-content" className="h-64 overflow-y-auto space-y-2 text-sm md:text-base scroll-smooth">
             {bootLines.map((line, idx) => (
               <div key={idx} className={`${line.color || 'text-slate-300'} animate-fade-in font-mono`}>
                 {line.text}
               </div>
             ))}
             <div className="animate-pulse text-cyan-500 text-lg mt-2">_</div>
           </div>
        </div>
      </div>
    );
  }

  /* --- STAGE 3 & 4: CARD & FINAL THANK YOU --- */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-50 flex items-center justify-center p-4 md:p-8 relative overflow-hidden perspective-1000">
      <Background />
      {showConfetti && <Confetti />}

      {/* --- LETTER CARD --- */}
      {stage === 'card' && (
        <div 
            className={`
            max-w-5xl w-full bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_0_50px_rgba(15,23,42,0.6)] 
            overflow-hidden relative z-10 transition-all duration-1000 ease-out transform
            ${cardVisible ? 'opacity-100 rotate-x-0 translate-y-0 scale-100' : 'opacity-0 rotate-x-12 translate-y-20 scale-95'}
            `}
        >
            {/* Card Header */}
            <div className="bg-slate-950/50 border-b border-slate-800 p-4 md:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-2 rounded-lg border border-cyan-500/20">
                <Terminal size={20} className="text-cyan-400" />
                </div>
                <div>
                <div className="text-sm font-bold text-white tracking-wide">MENTORSHIP REPORT</div>
                <div className="text-xs text-slate-500 font-mono">ID: #TECH.AT.CORE | PREETHAM</div>
                </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full animate-pulse">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Connection Secure</span>
            </div>
            </div>

            {/* Card Content */}
            <div className="p-8 md:p-12 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
            
            {/* 1. Greeting */}
            <div className={`space-y-4 transition-all duration-1000 delay-300 ${cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                Hello Preetham
                <span className="text-cyan-500 animate-pulse">.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                Today quietly marks <span className="text-white font-semibold border-b border-cyan-500/50">one year</span> since I started my internship at <span className="text-cyan-400 font-semibold">Tech.at.Core</span>. I couldn't let it pass like a normal day.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* 2. Technical Growth */}
                <div className={`
                group bg-slate-800/20 border border-slate-700/50 rounded-xl p-6 
                hover:bg-slate-800/40 hover:border-cyan-500/30 transition-all duration-700 delay-500
                ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:scale-110 transition-transform">
                    <Cpu className="text-cyan-400" size={24} />
                    </div>
                    <h3 className="font-bold text-cyan-100 tracking-wide">THE ARCHITECT</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    You pushed me straight into the deep end of AI : LangChain, LangGraph, AI agents, MCP, and a whole ecosystem.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-slate-400 text-sm italic">
                    "The leave management agent becoming my major project is a direct reflection of the direction you set for me from day one."
                    </p>
                </div>
                </div>

                {/* 3. Emotional Support */}
                <div className={`
                group bg-slate-800/20 border border-slate-700/50 rounded-xl p-6 
                hover:bg-slate-800/40 hover:border-rose-500/30 transition-all duration-700 delay-700
                ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-500/10 rounded-lg group-hover:scale-110 transition-transform">
                    <Heart className="text-rose-400" size={24} fill="rgba(251, 113, 133, 0.2)" />
                    </div>
                    <h3 className="font-bold text-rose-100 tracking-wide">THE MENTOR</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    What makes this year unforgettable is the human side. Not once, but <span className="text-white font-medium">three times</span> during my academic breaks, you backed me with patience.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-slate-400 text-sm italic">
                    "During the FTE discussion, the way you handled everything with empathy and clarity meant more than I can explain."
                    </p>
                </div>
                </div>
            </div>

            {/* 4. The Impact (Remote/Ideology) */}
            <div className={`
                bg-gradient-to-r from-slate-900 to-slate-800/50 rounded-lg p-6 border border-slate-700/30
                transition-all duration-700 delay-1100
                ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                <Network size={16} /> Connection Report
                </h4>
                <p className="text-slate-300 leading-relaxed mb-4">
                Even though we've only met a few times offline, your presence and ideology have had a strong impact on how I approach work at <span className="text-cyan-200">Tech.at.Core</span>. You didn't just manage tasks — you shaped how I see growth, responsibility, and professionalism.
                </p>
                <div className="flex items-start gap-3 bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
                <Quote className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                <p className="text-indigo-100 italic">
                    "People say your first manager can make or break your career. I genuinely believe mine <span className="font-bold text-indigo-300">made it</span>."
                </p>
                </div>
            </div>

            {/* 5. Closing */}
            <div className={`
                text-slate-400 italic transition-all duration-700 delay-1200
                ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                "This internship year has been one of the most defining phases of my life. Thank you for believing in my potential even when I doubted myself."
            </div>

            {/* 6. Footer & Action */}
            <div className={`pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-end gap-8 transition-all duration-700 delay-1300 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div>
                <p className="text-slate-400 mb-1 font-mono text-sm">Sincerely,</p>
                <p className="text-3xl font-serif text-white mb-2 tracking-wide">Karthikeya</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 bg-slate-950/50 px-3 py-1 rounded-full border border-slate-800 inline-flex">
                    <Calendar size={12} /> 
                    <span>Feb 2025</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <Building2 size={12} />
                    <span>Tech.at.Core</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span>1 Year Anniversary</span>
                </div>
                </div>

                <button 
                onClick={handleHandshake}
                className={`
                    group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide transition-all 
                    shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] active:scale-95 flex items-center gap-3 overflow-hidden
                `}
                >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] opacity-70 font-mono font-normal mb-1"></span>
                    <span>HANDSHAKE ..?</span>
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            </div>
        </div>
      )}

      {/* --- FINAL THANK YOU SCREEN --- */}
      {stage === 'thankyou' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 animate-zoom-in">
             <div className="relative p-12 text-center">
                 {/* Decorative Circle Behind */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>

                 <h1 className="relative text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-indigo-400 mb-8 tracking-tighter drop-shadow-2xl">
                    THANK YOU
                 </h1>
                 
                 <div className="relative inline-block">
                     <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur border border-slate-700 px-6 py-2 rounded-full">
                         <Building2 size={16} className="text-cyan-400" />
                         <span className="text-xl text-slate-300 font-light tracking-[0.3em] uppercase">Preetham</span>
                     </div>
                 </div>

                 <div className="mt-12 text-slate-500 font-mono text-sm opacity-70">
                     SESSION CLOSED: GRATITUDE SENT
                 </div>
             </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes grid-flow {
          0% { background-position: 0 0; }
          100% { background-position: 0 50px; }
        }
        @keyframes confetti-drop {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-grid-flow { animation: grid-flow 3s linear infinite; }
        .animate-confetti-drop { animation: confetti-drop 3s ease-in forwards; }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
        .animate-fade-in { animation: fadeIn 0.1s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Card;
