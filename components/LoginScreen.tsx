
import React from 'react';
import { Shield } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl text-orange-600">
          <Shield size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Decensat C3 Portal</h2>
        <p className="text-slate-500 mb-8">Secure access to sovereign guidance and treasury tools for the Decensat ecosystem.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-700 ml-1">Corporate Email</label>
            <input 
              type="email" 
              required
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="name@decensat.com"
            />
          </div>
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-700 ml-1">Master Password</label>
            <input 
              type="password" 
              required
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl mt-4"
          >
            Sign In to DCS Console
          </button>
        </form>
        <p className="mt-8 text-xs text-slate-400">
          Authorized Decensat personnel only. All activities are logged and monitored.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
