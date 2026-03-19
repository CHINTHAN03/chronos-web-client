import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Fingerprint, Orbit, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('auth/authenticate', { email, password });
            localStorage.setItem('jwt_token', response.data.token);
            localStorage.setItem('userId', response.data.userId); 
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Unauthorized node.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden font-sans selection:bg-white/30">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 blur-[100px] rounded-full animate-spin-slow pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

            <div className="w-full max-w-[400px] z-10 p-6">
                
                <div className="flex flex-col items-center mb-12">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        
                        <Orbit size={24} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        Chronos
                    </h1>
                    <p className="text-[11px] text-white/40 mt-2 font-mono uppercase tracking-[0.3em]">
                        Dev-Sync Gateway
                    </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-medium">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                                <Fingerprint size={12} /> Identity Node
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-sm font-medium"
                                placeholder="developer@system.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                Access Cipher
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-sm font-mono tracking-widest"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 mt-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> Authenticating...</>
                            ) : (
                                <>Initialize Session <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="mt-8 flex justify-center gap-4 text-[10px] text-white/30 font-mono uppercase tracking-widest">
                    <span>SYS: ONLINE</span>
                    <span className="w-1 h-1 rounded-full bg-white/30 self-center"></span>
                    <span>V 1.0.0</span>
                </div>
            </div>

            <style jsx="true">{`
                @keyframes spin-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    );
}