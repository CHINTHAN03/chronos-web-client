import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';
import { CheckCircle2, Copy, Terminal, Code2, Activity, Trash2, ArrowRight } from 'lucide-react';

export default function Telemetry() {
    const userId = localStorage.getItem('userId');

   
    const [activeTab, setActiveTab] = useState('metrics'); 

    
    const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
    const [modules, setModules] = useState('');
    const [blockers, setBlockers] = useState('');
    const [goals, setGoals] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

   
    const [snippetTitle, setSnippetTitle] = useState('');
    const [snippetCode, setSnippetCode] = useState('');
    const [savedSnippets, setSavedSnippets] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const localSnippets = JSON.parse(localStorage.getItem('command_cache') || '[]');
        setSavedSnippets(localSnippets);
    }, []);

    const submitLog = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            await api.post(`logs/${userId}`, {
                logDate, completedModules: modules, activeBlockers: blockers, sprintGoals: goals
            });
            setMessage({ text: 'Telemetry successfully committed to the primary node.', type: 'success' });
            setModules(''); setBlockers(''); setGoals('');
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to sync telemetry.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveSnippet = (e) => {
        e.preventDefault();
        if (!snippetTitle || !snippetCode) return;
        const newSnippet = { id: Date.now(), title: snippetTitle, code: snippetCode };
        const updatedSnippets = [newSnippet, ...savedSnippets];
        
        setSavedSnippets(updatedSnippets);
        localStorage.setItem('command_cache', JSON.stringify(updatedSnippets));
        setSnippetTitle('');
        setSnippetCode('');
    };

    const copyToClipboard = (id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteSnippet = (id) => {
        const updated = savedSnippets.filter(s => s.id !== id);
        setSavedSnippets(updated);
        localStorage.setItem('command_cache', JSON.stringify(updated));
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto relative z-10 pb-10"
        >
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        Dev Telemetry
                    </h2>
                    <p className="text-[11px] font-mono text-white/40 mt-2 uppercase tracking-[0.2em]">
                        Log sprint progress & stash terminal operations
                    </p>
                </div>

                
                <div className="flex bg-white/[0.03] p-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-inner w-fit">
                    <button 
                        onClick={() => setActiveTab('metrics')} 
                        className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all duration-300 ${activeTab === 'metrics' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/40 hover:text-white border border-transparent hover:bg-white/5'}`}
                    >
                        <Activity size={14} /> Metrics
                    </button>
                    <button 
                        onClick={() => setActiveTab('cache')} 
                        className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all duration-300 ${activeTab === 'cache' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/40 hover:text-white border border-transparent hover:bg-white/5'}`}
                    >
                        <Terminal size={14} /> Command Vault
                    </button>
                </div>
            </div>

            {message.text && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-8 p-4 rounded-xl text-sm font-medium border backdrop-blur-md flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]'}`}>
                    {message.type === 'success' && <CheckCircle2 size={16} />}
                    {message.text}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {activeTab === 'metrics' ? (
                    <motion.div 
                        key="metrics-tab"
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-white/[0.02] rounded-3xl border border-white/10 p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        
                        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.02)]"><Activity size={18} className="text-white" /></div>
                            <h3 className="text-xl font-bold text-white/90 tracking-tight">Commit Daily Metrics</h3>
                        </div>

                        <form onSubmit={submitLog} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[13px] font-bold text-white/70 uppercase tracking-widest font-mono">Log Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={logDate} 
                                        onChange={(e) => setLogDate(e.target.value)}
                                        style={{ colorScheme: 'dark' }} 
                                        className="w-full md:w-1/3 px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm font-mono shadow-inner" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-white/70 uppercase tracking-widest font-mono">Completed Modules</label>
                                    <textarea required rows="4" placeholder="What did you successfully build today?" value={modules} onChange={(e) => setModules(e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-black/70 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all resize-none text-sm shadow-inner"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-white/70 uppercase tracking-widest font-mono">Active Blockers <span className="font-normal opacity-40">(Optional)</span></label>
                                    <textarea rows="4" placeholder="Any infrastructure or code impediments?" value={blockers} onChange={(e) => setBlockers(e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all resize-none text-sm shadow-inner"></textarea>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[13px] font-bold text-white/70 uppercase tracking-widest font-mono">Sprint Goals</label>
                                    <input type="text" required placeholder="What is the next immediate target?" value={goals} onChange={(e) => setGoals(e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-black/70 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm shadow-inner" />
                                </div>
                            </div>
                            
                            <button type="submit" disabled={isSubmitting}
                                className={`w-full py-4 mt-6 rounded-xl text-sm font-bold text-black bg-white hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                {isSubmitting ? <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> Syncing to Core...</> : <>Commit to Database <ArrowRight size={16}/></>}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="cache-tab"
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex flex-col gap-8"
                    >
                        <div className="bg-white/[0.02] rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                                <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl"><Terminal size={18} className="text-white" /></div>
                                <h3 className="text-xl font-bold text-white/90 tracking-tight">Stash New Command</h3>
                            </div>
                            
                            <form onSubmit={saveSnippet} className="space-y-6">
                                <input type="text" required placeholder="e.g., Force kill port 8080" value={snippetTitle} onChange={(e) => setSnippetTitle(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm shadow-inner" />
                                <textarea required rows="3" placeholder="sudo lsof -i :8080..." value={snippetCode} onChange={(e) => setSnippetCode(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-black/80 border border-white/10 text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none text-base font-mono shadow-inner"></textarea>
                                <button type="submit" className="px-8 py-4 rounded-xl font-bold text-white text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                    Stash Snippet
                                </button>
                            </form>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                            {savedSnippets.length === 0 ? (
                                <div className="h-40 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-white/20 font-mono text-xs uppercase tracking-[0.2em] bg-black/20">
                                    Vault is empty
                                </div>
                            ) : (
                                savedSnippets.map((snippet) => (
                                    <div key={snippet.id} className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 group hover:border-white/20 transition-all backdrop-blur-md">
                                        <div className="flex justify-between items-start mb-5">
                                            <h4 className="font-bold text-white/80 text-base flex items-center gap-3 tracking-tight">
                                                <Code2 size={16} className="text-white/40" /> {snippet.title}
                                            </h4>
                                            <button onClick={() => deleteSnippet(snippet.id)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="bg-black/60 border border-white/5 rounded-xl p-4 flex justify-between items-center relative overflow-hidden group/code">
                                            <code className="font-mono text-sm text-white/60 break-all pr-12 tracking-wide leading-relaxed">{snippet.code}</code>
                                            <button 
                                                onClick={() => copyToClipboard(snippet.id, snippet.code)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white rounded-lg transition-colors backdrop-blur-md"
                                                title="Copy to clipboard"
                                            >
                                                {copiedId === snippet.id ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}