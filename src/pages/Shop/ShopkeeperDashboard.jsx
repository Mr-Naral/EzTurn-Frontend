import { useEffect, useState, useMemo } from 'react';
import { 
    Play, SkipForward, CheckCircle, Clock, 
    IndianRupee, Users, Timer, TrendingUp, 
    AlertCircle, Loader2, Store, ChevronDown
} from 'lucide-react';
import api from '../../api/axiosConfig';

const ShopkeeperDashboard = () => {
    const [shops, setShops] = useState([]); // List of shops owned by the user
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // 1. Initial Load: Fetch all shops belonging to this owner
    useEffect(() => {
        const initDashboard = async () => {
            try {
                const shopRes = await api.get('/shops/my-shops'); // Your new owner route
                setShops(shopRes.data);
                
                if (shopRes.data.length > 0) {
                    setSelectedShopId(shopRes.data[0].id); // Default to first shop
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching owner shops", err);
                setLoading(false);
            }
        };
        initDashboard();
    }, []);

    // 2. Fetch Appointments whenever the selectedShopId changes
    useEffect(() => {
        if (!selectedShopId) return;

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [selectedShopId]);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get(`/appointments/shop/${selectedShopId}`);
            // Sorting: Tokens in order (e.g., 1, 2, 3...)
            const sorted = res.data.sort((a, b) => a.tokenNumber - b.tokenNumber);
            setAppointments(sorted);
        } catch (err) {
            console.error("Dashboard Load Error", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        setActionLoading(true);
        try {
            await api.patch(`/appointments/${id}/status?status=${status}`);
            await fetchDashboardData();
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    // --- Metrics Calculations ---
    const pendingAppts = useMemo(() => 
        appointments.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED'), 
    [appointments]);

    const completedAppts = useMemo(() => 
        appointments.filter(a => a.status === 'COMPLETED'), 
    [appointments]);
    
    const totalRevenueGenerated = completedAppts.reduce((sum, a) => sum + (a.service?.price || 0), 0);
    const potentialRevenue = pendingAppts.reduce((sum, a) => sum + (a.service?.price || 0), 0);
    const totalWorkloadTime = pendingAppts.reduce((sum, a) => sum + (a.service?.durationInMinutes || 0), 0);
    const currentCustomer = pendingAppts[0];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    if (shops.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <Store size={64} className="text-slate-300 mb-4" />
            <h2 className="text-2xl font-black text-slate-800">No Shops Found</h2>
            <p className="text-slate-500 max-w-xs mt-2">You haven't registered any shops under this account yet.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* HEADER & SHOP SWITCHER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Dashboard</h1>
                        <p className="text-slate-500 font-medium">Manage your queue and live earnings</p>
                    </div>

                    {shops.length > 1 && (
                        <div className="relative inline-block">
                            <select 
                                value={selectedShopId}
                                onChange={(e) => setSelectedShopId(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 px-6 py-3 pr-12 rounded-2xl font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                            >
                                {shops.map(s => (
                                    <option key={s.id} value={s.id}>{s.shopName}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    )}
                </div>

                {/* 1. TOP METRICS BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard icon={<IndianRupee/>} label="Earned Today" value={`₹${totalRevenueGenerated}`} color="text-green-600" />
                    <MetricCard icon={<TrendingUp/>} label="Potential" value={`₹${potentialRevenue}`} color="text-indigo-600" />
                    <MetricCard icon={<Timer/>} label="Wait Time" value={`${totalWorkloadTime}m`} color="text-amber-600" />
                    <MetricCard icon={<Users/>} label="In Queue" value={pendingAppts.length} color="text-slate-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* 2. LIVE ACTION PANEL */}
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">In the Chair</h2>
                        {currentCustomer ? (
                            <div className="bg-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <span className="bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Current Session</span>
                                    <h3 className="text-4xl font-black mt-4 break-words">{currentCustomer.customer.fullName}</h3>
                                    <p className="text-indigo-300 font-bold uppercase text-sm mt-1">{currentCustomer.service.serviceName}</p>
                                    
                                    <div className="mt-8 flex items-center gap-6">
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Token</p>
                                            <p className="text-3xl font-black">#{currentCustomer.tokenNumber}</p>
                                        </div>
                                        <div className="h-10 w-px bg-slate-700"></div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Price</p>
                                            <p className="text-3xl font-black">₹{currentCustomer.service.price}</p>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex flex-col gap-3">
                                        <button 
                                            onClick={() => updateStatus(currentCustomer.id, 'COMPLETED')}
                                            disabled={actionLoading}
                                            className="w-full py-5 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
                                        >
                                            {actionLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20}/> Finish & Next</>}
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(currentCustomer.id, 'CANCELLED')}
                                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-bold transition-all text-sm"
                                        >
                                            No Show / Cancel
                                        </button>
                                    </div>
                                </div>
                                <Users className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5" />
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
                                <AlertCircle className="mx-auto text-slate-300 mb-4" size={48}/>
                                <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Queue Empty</p>
                            </div>
                        )}
                    </div>

                    {/* 3. FULL QUEUE LIST */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Queue</h2>
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase">Customer</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center">Token</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center">Bill</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase">Status</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {appointments.map((appt) => (
                                            <tr key={appt.id} className={`hover:bg-slate-50/50 transition-colors ${appt.status === 'COMPLETED' ? 'opacity-40 bg-slate-50' : ''}`}>
                                                <td className="p-6">
                                                    <p className="font-black text-slate-800">{appt.customer.fullName}</p>
                                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{appt.service.serviceName}</p>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className="font-black text-slate-400 text-lg">#{appt.tokenNumber}</span>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <p className="font-black text-slate-700">₹{appt.service.price}</p>
                                                    <p className="text-[9px] font-bold text-slate-400">{appt.service.durationInMinutes}m</p>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                        appt.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 
                                                        appt.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    {(appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED') && (
                                                        <button 
                                                            onClick={() => updateStatus(appt.id, 'COMPLETED')}
                                                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                            title="Mark as Completed"
                                                        >
                                                            <SkipForward size={18}/>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-4 bg-slate-50 rounded-2xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className={`text-2xl font-black ${color} leading-none`}>{value}</p>
        </div>
    </div>
);

export default ShopkeeperDashboard;