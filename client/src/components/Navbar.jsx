import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, History, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-ink-800 bg-ink-900/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-copper-700 text-parchment-50 shadow-xl shadow-copper-900/40 group-hover:bg-copper-600 transition-all duration-500">
            <BrainCircuit size={26} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-parchment-50 font-serif italic">
            InterviewPrep <span className="text-copper-500 font-sans not-italic">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all duration-500 ${
                  isActive 
                    ? 'bg-ink-800 text-copper-400 shadow-inner' 
                    : 'text-parchment-200/60 hover:text-parchment-50 hover:bg-ink-800/50'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline uppercase tracking-widest">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
