
import React, { useState } from 'react';
import { Calendar, DollarSign, Rocket, Info } from 'lucide-react';
import { ProjectData } from '../types';

interface Props {
  onSubmit: (data: ProjectData) => void;
}

const ProjectSetup: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    dailyRate: 150
  });

  const totalCost = formData.duration * formData.dailyRate;
  const isLargeProject = formData.duration >= 90;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">Decensat Pre-Step</h2>
        <p className="text-slate-500">Configure your Decensat project parameters and budget allocation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Project Identity</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Decensat Core V1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Days)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="10" 
                    max="365" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="flex-1 accent-orange-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-16 text-center font-bold text-orange-600 bg-orange-50 py-1 rounded-lg">
                    {formData.duration}d
                  </span>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-2xl flex gap-3 border border-orange-100">
                <Info className="text-orange-500 shrink-0" size={20} />
                <p className="text-xs text-orange-800 leading-tight">
                  {isLargeProject 
                    ? "Decensat Large Project Policy: Automated monthly progress checks and payment tranches enabled via Sovereign AI."
                    : "Decensat Standard Policy: Connect manually with Google Calendar to sync project milestones and trigger payments."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-orange-400" />
              Treasury Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Daily Resource Allocation</span>
                <span className="text-white">${formData.dailyRate}.00</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Duration Multiplier</span>
                <span className="text-white">x{formData.duration}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                <span className="text-slate-400 font-medium">Total Decensat Budget</span>
                <span className="text-3xl font-bold text-orange-400">${totalCost.toLocaleString()}</span>
              </div>
            </div>

            <button 
              disabled={!formData.name}
              onClick={() => onSubmit({
                name: formData.name,
                duration: formData.duration,
                budget: totalCost,
                startDate: new Date().toISOString()
              })}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                formData.name 
                  ? 'bg-white text-slate-900 hover:bg-orange-400 hover:text-white' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Rocket size={20} />
              Launch Decensat Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetup;
