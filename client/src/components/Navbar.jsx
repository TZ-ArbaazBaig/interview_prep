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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/20 group-hover:bg-primary-500 transition-colors">
            <BrainCircuit size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-50">
            InterviewPrep <span className="text-primary-500">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-primary-400' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
