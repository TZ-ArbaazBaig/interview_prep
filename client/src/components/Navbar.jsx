import { Link, useLocation } from 'react-router-dom';
import { Layout } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-obsidian-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-violet-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative h-10 w-10 flex items-center justify-center bg-obsidian-800 border border-obsidian-700 rounded-lg group-hover:border-violet-500/50 transition-all duration-500 overflow-hidden">
                <Layout className="text-violet-500" size={24} />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-black tracking-tighter text-white uppercase leading-none">
                Vault <span className="text-violet-500">AI</span>
              </span>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-silver-400 uppercase opacity-60 mt-1">
                Interview Prep
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-8">
            <Link 
              to="/history" 
              className={`group flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.1em] transition-all ${
                location.pathname === '/history' ? 'text-violet-400' : 'text-silver-400 hover:text-white'
              }`}
            >
              <div className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full transition-colors ${
                location.pathname === '/history' ? 'bg-violet-400' : 'bg-silver-600 group-hover:bg-violet-500'
              }`} />
              History
            </Link>
            <Link 
              to="/" 
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-sm bg-violet-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] text-white hover:bg-violet-600 shadow-violet-glow transition-all active:scale-95"
            >
              Start New
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-obsidian-800">
              <span className="text-silver-400 text-[10px] font-mono font-bold uppercase hidden md:block">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0]}
              </span>
              <UserButton 
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-sm border border-obsidian-700"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
