
import React, { useState } from 'react';
import { 
  Home, 
  ChevronDown, 
  Database, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Users, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Command & Control');

  const menuItems = [
    { name: 'Command & Control', icon: Home, hasSub: false },
    { name: 'Administration Consoles', icon: Database, hasSub: true },
    { name: 'Decensat Treasury Tools', icon: Layers, hasSub: true },
    { name: 'Surescrow & Sig Alpha', icon: ShieldCheck, hasSub: false },
    { name: 'Sovereign Guidance AI Preferences', icon: Cpu, hasSub: false },
    { name: 'SME Referral$', icon: Users, hasSub: false },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-y-auto z-50">
      <div className="p-6 flex items-center gap-3 border-b border-gray-50">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">DCS</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800">Decensat</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              activeItem === item.name 
                ? 'bg-orange-50 text-orange-600 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="text-sm">{item.name}</span>
            </div>
            {item.hasSub && <ChevronDown size={16} className="opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
