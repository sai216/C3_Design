
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProjectData, Milestone } from '../types';
import { 
  Clock, 
  Wallet, 
  CheckCircle, 
  Sparkles,
  Coins,
  Send,
  X,
  MessageSquare,
  Calendar,
  RefreshCw,
  Flag,
  CreditCard,
  PieChart as PieIcon,
  Info,
  ArrowLeftRight,
  Plus
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAIGuidance, createAIChat } from '../services/gemini';

interface Props {
  project: ProjectData;
}

const Dashboard: React.FC<Props> = ({ project }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [aiNote, setAiNote] = useState('Generating intelligent guidance...');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const chatInstance = useRef<any>(null);

  useEffect(() => {
    const isLarge = project.duration >= 90;
    const count = isLarge ? Math.ceil(project.duration / 30) : 1;
    const ms: Milestone[] = [];
    
    for (let i = 1; i <= count; i++) {
      ms.push({
        id: i,
        label: isLarge ? `Phase ${i}: ${i * 30} Day Progress Check` : 'Standard Delivery Window',
        status: i === 1 ? 'current' : 'pending',
        date: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        paymentAmount: project.budget / count
      });
    }
    setMilestones(ms);

    const fetchAI = async () => {
      try {
        const text = await getAIGuidance(`${project.name}, ${project.duration} days, budget $${project.budget}`);
        setAiNote(text || "Maintain steady liquidity reserves for your Decensat project.");
      } catch (e) {
        setAiNote("Decensat treasury protocol active.");
      }
    };
    fetchAI();

    chatInstance.current = createAIChat(`Project: ${project.name}, Duration: ${project.duration} days, Budget: $${project.budget}. This is a Decensat ecosystem project.`);
  }, [project]);

  // DERIVED STATE: Always recalculates when milestones change
  const paidAmount = useMemo(() => {
    return milestones
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + m.paymentAmount, 0);
  }, [milestones]);

  const remainingBalance = useMemo(() => {
    return Math.max(0, project.budget - paidAmount);
  }, [project.budget, paidAmount]);

  const progressPercentage = useMemo(() => {
    if (milestones.length === 0) return 0;
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    return (completedCount / milestones.length) * 100;
  }, [milestones]);

  const disbursementData = useMemo(() => {
    let cumulative = 0;
    return milestones.map((m) => {
      if (m.status === 'completed') {
        cumulative += m.paymentAmount;
      }
      return {
        name: `P${m.id}`,
        paid: cumulative,
        total: project.budget
      };
    });
  }, [milestones, project.budget]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping) return;
    const userMsg = userInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setUserInput('');
    setIsTyping(true);

    try {
      const result = await chatInstance.current.sendMessage({ message: userMsg });
      setChatMessages(prev => [...prev, { role: 'model', text: result.text || "I'm sorry, Decensat AI is temporarily unavailable." }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Connection to Decensat Sovereign AI interrupted." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBooking = () => {
    if (!isBooked) {
      setIsBooking(true);
      setTimeout(() => {
        setIsBooked(true);
        setIsBooking(false);
        setChatMessages(prev => [...prev, { role: 'model', text: "Progress verification call automatically booked with the Decensat team." }]);
      }, 1500);
    }
  };

  const handleExecutePayment = () => {
    const currentIndex = milestones.findIndex(m => m.status === 'current');
    if (currentIndex === -1) return;
    
    // Create new state array to trigger re-render
    const newMilestones = [...milestones];
    newMilestones[currentIndex].status = 'completed';
    
    if (currentIndex + 1 < newMilestones.length) {
      newMilestones[currentIndex + 1].status = 'current';
    }
    
    setMilestones(newMilestones);
  };

  const stats = [
    { label: 'Amount Paid', value: `$${paidAmount.toLocaleString()}`, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Remaining Balance', value: `$${remainingBalance.toLocaleString()}`, icon: Wallet, color: 'text-orange-500' },
    { label: 'Time Remaining', value: `${project.duration} Days`, icon: Clock, color: 'text-blue-500' },
  ];

  const pieData = [{ name: 'Paid', value: paidAmount }, { name: 'Remaining', value: remainingBalance }];
  const COLORS = ['#10b981', '#f97316'];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 relative min-h-screen max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500">Decensat Guidance Console • Treasury Tracking</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleBooking} className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isBooked ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            {isBooking ? <RefreshCw size={16} className="animate-spin" /> : <Calendar size={16} />} 
            {isBooked ? 'Call Booked (DCS)' : 'Book Progress Call'}
          </button>
          <button 
            onClick={handleExecutePayment} 
            disabled={milestones.every(m => m.status === 'completed')} 
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:bg-slate-200 transition-all shadow-md flex items-center gap-2"
          >
            <Coins size={16} /> Release Next Tranche
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}><stat.icon size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer text-left">
              <div className="flex justify-center mb-10 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-12 h-12 bg-orange-200 rounded-full blur-xl animate-pulse"></div>
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-100 border border-orange-200"></div>
                  <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                    <ArrowLeftRight size={20} />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-100 border border-orange-200"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-2">Stable Coin Cross Chain</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Decensat Swap</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer text-left">
              <div className="flex justify-center mb-10 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-12 h-12 bg-orange-200 rounded-full blur-xl animate-pulse"></div>
                </div>
                <div className="relative flex items-center">
                  <div className="px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-2 text-orange-600 shadow-sm font-bold text-lg">
                    $ <Plus size={16} /> <Coins size={16} />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-2">OnRamp/Buy</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Currency</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer text-left">
              <div className="flex justify-center mb-10 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-12 h-12 bg-orange-200 rounded-full blur-xl animate-pulse"></div>
                </div>
                <div className="relative flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-300"></div>
                  <div className="w-12 h-0.5 bg-orange-100 flex items-center justify-center relative">
                    <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-sm absolute left-1/2 -translate-x-1/2"></div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-300"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-2">Buy Digital Currencies</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Decensat Bridge</p>
            </div>
          </div>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">Treasury Inflow Progress <CreditCard size={18} className="text-slate-400" /></h3>
                <p className="text-xs text-slate-400">Total payments released vs. Total project budget</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Allocated</span>
                <span className="text-sm font-bold text-slate-900">${project.budget.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={disbursementData}>
                  <defs>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(value) => `$${(value/1000)}k`} />
                  <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Cumulative Paid']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="stepAfter" dataKey="total" stroke="#e2e8f0" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
                  <Area type="stepAfter" dataKey="paid" stroke="#10b981" fillOpacity={1} fill="url(#colorPaid)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">Execution Roadmap {project.duration >= 90 ? <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Decensat Smart Escrow</span> : <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${isBooked ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{isBooked ? 'Call Verified' : 'Manual Progress Check'}</span>}</h3>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{Math.round(progressPercentage)}% Settled</p>
                <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div></div>
              </div>
            </div>
            <div className="relative h-24 mb-12 px-4">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
              <div className="absolute inset-0 flex justify-between items-center">
                {milestones.map((ms, idx) => (
                  <div key={ms.id} className="relative flex flex-col items-center group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-20 transition-all duration-500 border-4 border-white shadow-md ${ms.status === 'completed' ? 'bg-emerald-500 text-white' : ms.status === 'current' ? 'bg-orange-600 text-white ring-8 ring-orange-50 animate-pulse scale-110' : 'bg-slate-200 text-slate-500'}`}>
                      {ms.status === 'completed' ? <CheckCircle size={14} /> : (idx === milestones.length - 1 ? <Flag size={14} /> : <span className="text-[10px] font-bold">{ms.id}</span>)}
                    </div>
                    <div className="absolute top-10 flex flex-col items-center">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${ms.status === 'current' ? 'text-orange-600' : 'text-slate-400'}`}>{idx === 0 ? 'Start' : (idx === milestones.length - 1 ? 'Final' : `Ph ${ms.id}`)}</span>
                      <span className="text-[9px] text-slate-300 whitespace-nowrap">{ms.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-50">
              {milestones.map((ms) => (
                <div key={ms.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-500 ${ms.status === 'current' ? 'border-orange-200 bg-orange-50/30 shadow-sm' : ms.status === 'completed' ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-50 bg-white'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ms.status === 'completed' ? 'text-emerald-500' : ms.status === 'current' ? 'text-orange-600' : 'text-slate-300'}`}>{ms.status === 'completed' ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}</div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className={`text-sm font-bold ${ms.status === 'completed' ? 'text-emerald-700' : 'text-slate-800'}`}>{ms.label}</p>
                      <p className="text-[10px] text-slate-400">Status: {ms.status === 'completed' ? `Settled on ${ms.date}` : (ms.status === 'current' ? 'Ready for Release' : 'Awaiting Progress')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">${ms.paymentAmount.toLocaleString()}</p>
                      <span className={`text-[9px] font-bold uppercase ${ms.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'}`}>{ms.status === 'completed' ? 'Settled' : 'In Queue'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 text-orange-500 opacity-20 pointer-events-none"><Sparkles size={120} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40"><Sparkles size={20} className="text-white" /></div>
                <div><h3 className="font-bold text-xl leading-tight">Decensat AI</h3><p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Treasury Advisor</p></div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 italic bg-white/5 p-4 rounded-2xl border border-white/5">"{aiNote}"</p>
              <button onClick={() => setIsChatOpen(true)} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 group">Open Counsel Chat <MessageSquare size={18} className="group-hover:translate-x-1 transition-transform" /></button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-slate-800">Funds Allocation</h3><PieIcon size={18} className="text-slate-400" /></div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">{pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} /></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs font-bold text-emerald-700 uppercase">Paid</span></div><span className="text-sm font-bold text-slate-800">${paidAmount.toLocaleString()}</span></div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-2xl"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-xs font-bold text-orange-700 uppercase">Remaining</span></div><span className="text-sm font-bold text-slate-800">${remainingBalance.toLocaleString()}</span></div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Decensat Support</h4>
            <button className="w-full p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><Info size={18} /></div>
              <div className="text-left"><p className="text-xs font-bold text-slate-800">Knowledge Base</p><p className="text-[10px] text-slate-500">Decensat Documentation</p></div>
            </button>
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3"><Sparkles className="text-orange-500" /><div><h3 className="font-bold">DCS Counsel Chat</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sovereign Advisor</p></div></div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {chatMessages.length === 0 && <div className="text-center py-12"><div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"><MessageSquare size={32} className="text-slate-300" /></div><p className="text-slate-500 font-medium">Greetings. I am your Decensat Treasury Advisor.</p><p className="text-xs text-slate-400">Ask about funding tranches, disbursement cycles, or DCS compliance.</p></div>}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'}`}>{msg.text}</div>
                </div>
              ))}
              {isTyping && <div className="flex justify-start"><div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1"><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span></div></div>}
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask DCS Advisor..." className="flex-1 p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm" />
                <button type="submit" disabled={!userInput.trim() || isTyping} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md"><Send size={20} /></button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
