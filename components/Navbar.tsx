import React from 'react';
import { NavLink } from 'react-router-dom';
import { Music, Radio, Users, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-indigo-600 text-white' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Gym Sync</span>
          </div>
          
          <div className="flex space-x-2">
            <NavLink to="/session" className={getLinkClass}>
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Session</span>
            </NavLink>
            <NavLink to="/queue" className={getLinkClass}>
              <Radio className="w-4 h-4" />
              <span className="hidden sm:inline">Queue</span>
            </NavLink>
            <NavLink to="/connect" className={getLinkClass}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Devices</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;