import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';
import { marked } from 'marked';
import { CheckCircle2, Copy, Download, GitCommit, LayoutTemplate, ShieldCheck, Database, AlertOctagon, Code, FileText, Braces, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Automations() {
    const userId = localStorage.getItem('userId');

    const [viewState, setViewState] = useState('config'); 
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [version, setVersion] = useState('v1.0.0');
    const [environment, setEnvironment] = useState('Production');
    const [audience, setAudience] = useState('Customer-Facing');
    const [ticketIds, setTicketIds] = useState('');
    const [approver, setApprover] = useState('');
    const [requiresDbMigration, setRequiresDbMigration] = useState(false);
    const [includeRollback, setIncludeRollback] = useState(false);

    const [releaseNotes, setReleaseNotes] = useState('');
    const [jsonArtifact, setJsonArtifact] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [pipelineMessage, setPipelineMessage] = useState({ text: '', type: '' });
    const [copied, setCopied] = useState(false);
    const [previewMode, setPreviewMode] = useState('html'); 

    const generateReleaseArtifact = async (e) => {
        e.preventDefault();
        setPreviewMode('html'); 
        setViewState('output'); 
        setIsGenerating(true);
        setPipelineMessage({ text: '', type: '' });
        setReleaseNotes('');
        setJsonArtifact('');

        try {
            const response = await api.get(`reports/generate/${userId}`, {
                params: { startDate, endDate, audience, _t: Date.now() } 
            });

            const pipelineId = `CI-${Math.floor(Math.random() * 90000) + 10000}`;
            const commitHash = Math.random().toString(16).substring(2, 9);
            const dateStr = new Date().toISOString();

            // --- SANITIZED HEADERS & METADATA ---
            const header = `# Release ${version}\n\n`;
            let metadata = `> **Environment:** \`${environment}\` | **Audience:** \`${audience}\`\n`;
            metadata += `> **Pipeline ID:** \`#${pipelineId}\` | **Latest Commit:** \`${commitHash}\`\n`;
            
            if (ticketIds || approver) metadata += `> **Tickets Resolved:** \`${ticketIds || 'None Linked'}\` | **Authorized By:** \`${approver || 'Auto-Merged'}\`\n`;
            
            // Removed emojis, replaced with professional status text
            if (requiresDbMigration || includeRollback) metadata += `> **DB Migration:** \`${requiresDbMigration ? 'CRITICAL REQUIRED' : 'None'}\` | **Rollback Protocol:** \`${includeRollback ? 'ACTIVE' : 'Standard'}\`\n`;
            
            metadata += `\n---\n\n`;
            
            let rollbackRunbook = '';
            if (includeRollback) {
                // Removed shield emoji
                rollbackRunbook = `\n\n---\n\n### Emergency Rollback Protocol\n*If critical telemetry fails post-deployment, execute the following immediately:*\n1. **Halt Traffic:** Route load balancer to static maintenance page.\n2. **Revert Image:** \`docker pull chronos-backend:previous-stable\`\n3. **DB Restore:** ${requiresDbMigration ? 'Execute \`flyway:undo\` script to reverse schema changes.' : 'No schema changes. Data is safe.'}\n4. **Restart:** \`docker-compose up -d --force-recreate\`\n5. **Notify:** Alert Lead DevOps and update status page.`;
            }

            const mdContent = header + metadata + response.data.content + rollbackRunbook;
            setReleaseNotes(mdContent);

            const jsonPayload = {
                metadata: {
                    version, environment, audience, pipelineId, commitHash, timestamp: dateStr,
                    soc2_compliance: {
                        authorizedBy: approver || "System Auto-Merge",
                        linkedTickets: ticketIds ? ticketIds.split(',').map(t => t.trim()) : []
                    },
                    riskFlags: { requiresDbMigration, rollbackRunbookAttached: includeRollback }
                },
                payload: { rawMarkdown: response.data.content }
            };
            setJsonArtifact(JSON.stringify(jsonPayload, null, 4));

            setPipelineMessage({ text: 'AST Artifacts successfully compiled.', type: 'success' });
            setTimeout(() => setPipelineMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setPipelineMessage({ text: 'Pipeline failed. Ensure telemetry exists for these dates.', type: 'error' });
            setTimeout(() => setViewState('config'), 3000); 
        } finally {
            setIsGenerating(false);
        }
    };

    const parseMarkdownToHTML = (md) => {
        if (!md) return '';
        const bodyHtml = marked.parse(md);

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #a1a1aa; background-color: #000000; margin: 0; padding: 40px; }
                    .markdown-body { max-width: 850px; margin: 0 auto; }
                    h1, h2, h3 { margin-top: 32px; margin-bottom: 16px; font-weight: 700; line-height: 1.25; color: #ffffff; letter-spacing: -0.02em; }
                    h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 1px solid rgba(255,255,255,0.1); }
                    h2 { font-size: 1.5em; padding-bottom: 0.3em; border-bottom: 1px solid rgba(255,255,255,0.1); }
                    h3 { font-size: 1.25em; color: #e4e4e7; }
                    blockquote { padding: 0 1.5em; color: #71717a; border-left: 2px solid #ffffff; margin: 0 0 16px 0; background: transparent; font-style: italic; }
                    code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; color: #ffffff; }
                    hr { height: 1px; padding: 0; margin: 32px 0; background-color: rgba(255,255,255,0.1); border: 0; }
                    a { color: #ffffff; text-decoration: underline; text-underline-offset: 4px; decoration-color: rgba(255,255,255,0.3); }
                    a:hover { text-decoration-color: #ffffff; }
                    ul, ol { padding-left: 2em; }
                    li { margin-bottom: 0.5em; }
                </style>
            </head>
            <body>
                <div class="markdown-body">
                    ${bodyHtml}
                </div>
            </body>
            </html>
        `;
    };

    const handleContextualDownload = () => {
        if (!releaseNotes) return;
        let content, filename, type;
        const safeVersion = version.replace(/\s+/g, '_');

        if (previewMode === 'markdown') {
            content = releaseNotes; filename = `Release_${safeVersion}.md`; type = 'text/markdown;charset=utf-8;';
        } else if (previewMode === 'html') {
            content = parseMarkdownToHTML(releaseNotes); filename = `Release_${safeVersion}.html`; type = 'text/html;charset=utf-8;';
        } else if (previewMode === 'json') {
            content = jsonArtifact; filename = `Audit_Trail_${safeVersion}.json`; type = 'application/json;charset=utf-8;';
        }

        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = () => {
        const textToCopy = previewMode === 'markdown' ? releaseNotes : previewMode === 'json' ? jsonArtifact : parseMarkdownToHTML(releaseNotes);
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderSkeleton = () => {
        const pulse = { animate: { opacity: [0.1, 0.3, 0.1] }, transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } };
        return (
            <div className="space-y-5 w-full max-w-4xl mx-auto p-10">
                <motion.div {...pulse} className="h-8 w-1/3 bg-white/20 rounded-lg mb-10"></motion.div>
                <motion.div {...pulse} className="h-4 w-full bg-white/10 rounded border-l-2 border-white/40 pl-4"></motion.div>
                <motion.div {...pulse} className="h-4 w-3/4 bg-white/10 rounded border-l-2 border-white/40 pl-4"></motion.div>
                <motion.div {...pulse} className="h-4 w-5/6 bg-white/10 rounded border-l-2 border-white/40 pl-4 mb-12"></motion.div>
                <motion.div {...pulse} className="h-4 w-full bg-white/20 rounded"></motion.div>
                <motion.div {...pulse} className="h-4 w-11/12 bg-white/20 rounded"></motion.div>
                <motion.div {...pulse} className="h-4 w-4/5 bg-white/20 rounded"></motion.div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto pb-10 flex flex-col min-h-screen relative z-10">
            
            <div className="mb-10 flex justify-between items-end shrink-0">
                <div>
                
                    <h2 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        Release Pipeline
                    </h2>
                    <p className="text-[11px] font-mono text-white/40 mt-2 uppercase tracking-[0.2em]">
                        Enterprise artifact synthesis
                    </p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                
                {viewState === 'config' && (
                    <motion.div 
                        key="config-view"
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full max-w-4xl mx-auto bg-white/[0.02] backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 p-10 flex flex-col relative overflow-hidden h-fit group"
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="flex items-center gap-4 mb-10 shrink-0 border-b border-white/10 pb-6">
                            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.02)]"><LayoutTemplate size={18} className="text-white" /></div>
                            <div>
                                <h3 className="text-lg font-bold text-white/90 tracking-tight">Pipeline Parameters</h3>
                            </div>
                        </div>

                        {pipelineMessage.text && (
                            <div className={`mb-8 p-4 rounded-xl text-sm font-medium border flex items-center gap-3 ${pipelineMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]'}`}>
                                {pipelineMessage.text}
                            </div>
                        )}

                        <form onSubmit={generateReleaseArtifact} className="flex flex-col space-y-8">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5 p-6 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                                    <h4 className="text-[15px] font-mono text-white/70 uppercase tracking-[0.2em] flex items-center gap-2 mb-6"><GitCommit size={12}/> Release Identity</h4>
                                    <div>
                                        <label className="block text-[13px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Version Tag</label>
                                        <input type="text" required value={version} onChange={(e) => setVersion(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm font-mono shadow-inner" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Target Environment</label>
                                        <select 
    value={environment} 
    onChange={(e) => setEnvironment(e.target.value)} 
    
    style={{ colorScheme: 'dark' }} 
    
    className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm font-medium cursor-pointer shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22white%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
>
    
    <option value="Production" className="bg-black">Production</option>
    <option value="Staging" className="bg-black">Staging</option>
    <option value="UAT" className="bg-black">UAT</option>
</select>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Documentation Audience</label>
                                       <select  value={audience} 
  onChange={(e) => setAudience(e.target.value)} 
  
  style={{ colorScheme: 'dark' }} 
  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm font-medium cursor-pointer shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22white%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
>
  
  <option value="Customer-Facing" className="bg-[#121212] text-white">Customer-Facing</option>
  <option value="Internal Engineering" className="bg-[#121212] text-white">Internal Engineering</option>
  <option value="Executive Summary" className="bg-[#121212] text-white">Executive Summary</option>
</select>
                                    </div>
                                </div>

                                <div className="space-y-5 p-6 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                                    <h4 className="text-[15px] font-mono text-white/70 uppercase tracking-[0.2em] flex items-center gap-2 mb-6"><ShieldCheck size={12}/> Sprint & Compliance</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[13px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Sprint Start</label>
                                            
                                            <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ colorScheme: 'dark' }} className="w-full px-3 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-[11px] font-mono shadow-inner" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Sprint End</label>
                                            <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ colorScheme: 'dark' }} className="w-full px-3 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-[11px] font-mono shadow-inner" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Linked Tickets (JIRA)</label>
                                        <input type="text" placeholder="e.g., CHR-101" value={ticketIds} onChange={(e) => setTicketIds(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm font-mono shadow-inner" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Authorized By (SOC 2)</label>
                                        <input type="text" placeholder="e.g., Jane Doe" value={approver} onChange={(e) => setApprover(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all text-sm font-medium shadow-inner" />
                                    </div>
                                </div>
                            </div>

                            
                            <div className="flex gap-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5 items-center justify-around shadow-inner backdrop-blur-sm">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative" onClick={() => setRequiresDbMigration(!requiresDbMigration)}>
                                        <input type="checkbox" className="sr-only" checked={requiresDbMigration} readOnly />
                                        <div className={`w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${requiresDbMigration ? 'bg-white' : 'bg-white/10'}`}>
                                            <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ease-in-out ${requiresDbMigration ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/40'}`}></div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-white/50 group-hover:text-white transition-colors flex items-center gap-2">
                                        <Database size={16} className={requiresDbMigration ? "text-white" : "text-white/40"} /> Requires DB Migration
                                    </span>
                                </label>
                                
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative" onClick={() => setIncludeRollback(!includeRollback)}>
                                        <input type="checkbox" className="sr-only" checked={includeRollback} readOnly />
                                        <div className={`w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${includeRollback ? 'bg-white' : 'bg-white/10'}`}>
                                            <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ease-in-out ${includeRollback ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/40'}`}></div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-white/50 group-hover:text-white transition-colors flex items-center gap-2">
                                        <AlertOctagon size={16} className={includeRollback ? "text-white" : "text-white/40"} /> Attach Rollback Protocol
                                    </span>
                                </label>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={isGenerating} className={`w-full py-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                    {isGenerating ? <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> Initializing Engine...</> : <>Synthesize Artifacts <ArrowRight size={16}/></>}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {viewState === 'output' && (
                    <motion.div 
                        key="output-view"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full bg-white/[0.02] backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 p-1 flex flex-col relative overflow-hidden h-[80vh]"
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="bg-black/40 rounded-t-[22px] p-4 flex flex-wrap gap-4 items-center justify-between border-b border-white/10 shrink-0 relative z-10">
                            
                            <div className="flex items-center gap-4">
                                <button onClick={() => setViewState('config')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-white/10">
                                    <ArrowLeft size={14}/> Config
                                </button>
                                
                                <div className="h-6 w-px bg-white/10"></div>

                                <div className="flex bg-black/60 p-1.5 rounded-xl border border-white/5 shadow-inner">
                                    <button onClick={() => setPreviewMode('markdown')} disabled={isGenerating} className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 ${previewMode === 'markdown' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white border border-transparent'}`}>
                                        <Code size={14}/> MD
                                    </button>
                                    <button onClick={() => setPreviewMode('html')} disabled={isGenerating} className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 ${previewMode === 'html' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white border border-transparent'}`}>
                                        <FileText size={14}/> HTML
                                    </button>
                                    <button onClick={() => setPreviewMode('json')} disabled={isGenerating} className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 ${previewMode === 'json' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white border border-transparent'}`}>
                                        <Braces size={14}/> JSON
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button onClick={handleContextualDownload} disabled={isGenerating || !releaseNotes} className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white/90 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 border border-white/10 justify-center">
                                    <Download size={14}/> Download {previewMode === 'markdown' ? '.MD' : previewMode === 'html' ? '.HTML' : '.JSON'}
                                </button>
                                <button onClick={copyToClipboard} disabled={isGenerating || !releaseNotes} className="ml-1 p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-lg transition-colors disabled:opacity-50" title="Copy Current View">
                                    {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col bg-black/60 rounded-b-[22px] relative shadow-inner">
                            <AnimatePresence mode="wait">
                                {isGenerating ? (
                                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full flex flex-col pt-16 items-center justify-start relative z-10">
                                        <div className="flex items-center gap-4 mb-12">
                                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-ping"></div>
                                            <span className="text-xs font-mono text-white/60 uppercase tracking-[0.3em]">Processing Neural Graph...</span>
                                        </div>
                                        {renderSkeleton()}
                                    </motion.div>
                                ) : (
                                    <motion.div key={`content-${previewMode}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="h-full w-full relative z-10">
                                        
                                        {previewMode === 'markdown' && (
                                            <pre className="whitespace-pre-wrap font-mono text-[13px] text-white/80 leading-relaxed custom-scrollbar h-full overflow-y-auto p-8 lg:px-12">
                                                {releaseNotes}
                                            </pre>
                                        )}

                                        {previewMode === 'html' && (
                                            <div className="h-full w-full">
                                                <iframe srcDoc={parseMarkdownToHTML(releaseNotes)} title="HTML Preview" className="w-full h-full border-none bg-transparent" />
                                            </div>
                                        )}

                                        {previewMode === 'json' && (
                                            <pre className="whitespace-pre-wrap font-mono text-[13px] text-white/60 leading-relaxed custom-scrollbar h-full overflow-y-auto p-8 lg:px-12 tracking-wide">
                                                {jsonArtifact}
                                            </pre>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}