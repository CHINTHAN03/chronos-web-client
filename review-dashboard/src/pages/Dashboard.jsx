import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Orbit } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    
    const navItems = [
        { name: 'Dev Telemetry', path: 'telemetry' },
        { name: 'Release Pipeline', path: 'automations' },
    ];

    return (
        <div className="min-h-screen flex bg-black text-white font-sans selection:bg-white/30 relative">
            
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>

            <aside className="w-72 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 fixed h-full shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                
                <div className="p-8 flex items-center gap-4 border-b border-white/10">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        <Orbit size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">Chronos</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mt-1">Engine v1.0</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <div className="px-4 mb-4 text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
                        Workspaces
                    </div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `block px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    isActive 
                                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.02]' 
                                        : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-white/40 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300"
                    >
                        <LogOut size={18} />
                        Terminate Session
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-72 p-10 overflow-x-hidden relative z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-600/10 via-cyan-600/5 to-transparent blur-[120px] rounded-full pointer-events-none"></div>
                <Outlet />
            </main>
        </div>
    );
}