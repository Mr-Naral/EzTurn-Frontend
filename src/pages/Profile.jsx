import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, LogOut, Settings, ShieldCheck, 
    Loader2, Wallet, Mail, Phone, Copy, Check, 
    CreditCard, Store // <--- Added Store here
} from 'lucide-react';
import api from '../api/axiosConfig';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await api.get('/auth/profile'); 
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [navigate]);

    const handleCopyReferral = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                            <ChevronLeft className="w-6 h-6 text-slate-600" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">My Account</h1>
                    </div>
                    <div className='flex '>
                    <button 
                        onClick={()=>navigate('/dashboard')} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-500 rounded-xl transition-all"
                    >
                        
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                    </div>
                    
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center shadow-sm border border-slate-100">
                            <div className="relative mb-4">
                                <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] rotate-6 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                                    <span className="-rotate-6 uppercase">{user.fullName?.charAt(0)}</span>
                                </div>
                                {user.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 p-2 border-4 border-white rounded-full">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">{user.fullName}</h2>
                            <p className="text-slate-500 font-medium mb-3">{user.email}</p>
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-widest border border-indigo-100">
                                {user.role}
                            </span>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em]">Available Balance</p>
                                        <h3 className="text-4xl font-black mt-2">₹{user.walletBalance?.toLocaleString()}</h3>
                                    </div>
                                    <CreditCard className="w-10 h-10 text-white/20" />
                                </div>
                                <div className="flex items-center gap-2 text-indigo-200/80 text-sm font-medium">
                                    <Wallet className="w-4 h-4" />
                                    <span>EzTurn Digital Wallet</span>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-4 sm:p-8 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 px-2">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Mail className="w-4 h-4 text-indigo-500" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Email</p>
                                    </div>
                                    <p className="font-bold text-slate-700 break-words">{user.email}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Phone className="w-4 h-4 text-orange-500" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number</p>
                                    </div>
                                    <p className="font-bold text-slate-700">{user.phoneNumber}</p>
                                </div>
                            </div>

                            <div className="mt-8 bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-bold text-indigo-900">Your Referral Code</h4>
                                        <p className="text-xs text-indigo-600/70">Invite your friends to earn rewards</p>
                                    </div>
                                    <div className="bg-indigo-600 text-white p-2 rounded-xl">
                                        <Copy className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-white border border-indigo-100 rounded-2xl px-6 py-4 font-mono font-black text-center text-indigo-600 tracking-[0.3em] text-lg shadow-inner">
                                        {user.myReferralCode}
                                    </div>
                                    <button 
                                        onClick={() => handleCopyReferral(user.myReferralCode)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-100"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : "Copy"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Manage Shops Button for Shopkeepers */}
                            {user.role === "SHOPKEEPER" && (
                                <button 
                                    onClick={() => navigate('/manage-shops')}
                                    className="w-full flex items-center justify-between p-6 bg-white rounded-3xl font-bold text-slate-700 shadow-sm border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-100 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                                            <Store className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-slate-900">Manage My Shops</p>
                                            <p className="text-xs text-slate-500 font-medium">Edit, Delete, or Add new locations</p>
                                        </div>
                                    </div>
                                    <ChevronLeft className="w-5 h-5 rotate-180 text-slate-400" />
                                </button>
                            )}

                            <button className="w-full flex items-center justify-between p-6 bg-white rounded-3xl font-bold text-slate-700 shadow-sm border border-slate-100 hover:border-indigo-300 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                        <Settings className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
                                    </div>
                                    <span>Security & Privacy</span>
                                </div>
                                <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-indigo-500 transition-colors"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;