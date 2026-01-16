
import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { generateTermsSummary } from '../services/gemini';

interface Props {
  onAccept: () => void;
}

const TermsScreen: React.FC<Props> = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await generateTermsSummary();
        setAiSummary(summary || "Essential compliance rules apply to the Decensat platform.");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-orange-400" />
            <h2 className="text-2xl font-bold">Terms & Conditions</h2>
          </div>
          <p className="text-slate-400 text-sm">Please review and accept Decensat operating standards.</p>
        </div>

        <div className="p-8">
          <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
            <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : 'hidden'}`} />
              AI Summary of Decensat Governance
            </h3>
            <div className="text-blue-700 text-sm leading-relaxed whitespace-pre-wrap">
              {loading ? "Synthesizing Decensat legal frameworks..." : aiSummary}
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 border border-slate-100 rounded-xl mb-8 text-sm text-slate-600 bg-slate-50">
            <h4 className="font-bold mb-4">1. Scope of Service</h4>
            <p className="mb-4">Decensat provides a decentralized treasury management framework. All transactions are final once recorded on the blockchain. Users are responsible for private key security and compliance with their respective jurisdictions...</p>
            <h4 className="font-bold mb-4">2. Milestone Verification</h4>
            <p className="mb-4">For projects exceeding 90 days, automated monthly check-ins are mandatory. Funds are released based on the Sovereign Guidance AI verification protocol and Decensat internal audits...</p>
            <h4 className="font-bold mb-4">3. Fees and Escalations</h4>
            <p>A standard service fee of 2.5% is applied to all cross-chain swaps and on-ramp operations within the Decensat ecosystem...</p>
          </div>

          <label className="flex items-center gap-3 mb-8 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={() => setAgreed(!agreed)}
              className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
              I have read and agree to the Decensat Sovereign Governance Terms
            </span>
          </label>

          <button 
            disabled={!agreed}
            onClick={onAccept}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              agreed 
                ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={20} />
            Initialize Decensat Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsScreen;
