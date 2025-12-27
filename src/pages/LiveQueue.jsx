import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ChevronLeft, Timer, User, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const LiveQueue = () => {
    const { id:shopId } = useParams();
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [myAppointment, setMyAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQueueData = async () => {
            try {
                // 1. Fetch all appointments for this shop for today
                const res = await api.get(`/appointments/shop/${shopId}`);
                const allAppointments = res.data;
                
                // 2. Identify the logged-in user's appointment (if any)
                // Assuming your auth context or a helper gets current user email/id
                // For this display, we find the one marked 'PENDING' or 'CONFIRMED'
                setQueue(allAppointments);
                
                // In a real app, you'd compare against current userId from your Auth state
                // Here we find the user's specific turn to highlight it at the top
                const mine = allAppointments.find(appt => appt.isMine === true); // Backend should flag this
                setMyAppointment(mine || allAppointments[0]); // Fallback to first for demo
            } catch (err) {
                console.error("Error fetching queue", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQueueData();
        // Optional: Set up polling every 30 seconds for "Live" feel
        const interval = setInterval(fetchQueueData, 30000);
        return () => clearInterval(interval);
    }, [shopId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            {/* Header */}
            <header className="p-6 bg-white border-b flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                        <ChevronLeft />
                    </button>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Live Queue</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {queue[0]?.shop?.shopName || "Service Center"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-black text-indigo-700">{queue.length} In Queue</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-6">
                {/* 1. YOUR STATUS CARD (Top Highlight) */}
                {myAppointment && (
                    <div className="relative mb-10">
                        <div className="absolute -top-3 left-8 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-lg">
                            Your Estimated Turn
                        </div>
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <Timer className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black italic">
                                            {new Date(myAppointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Expected Start Time</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black text-indigo-400">#{myAppointment.tokenNumber}</p>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Token No.</p>
                                </div>
                            </div>
                            
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-2/3 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                            </div>
                            <p className="mt-4 text-xs font-bold text-slate-400 text-center">
                                There are <span className="text-white">{myAppointment.tokenNumber - 1}</span> people ahead of you.
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. LIVE QUEUE LIST */}
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">Queue Breakdown</h3>
                <div className="space-y-3">
                    {queue.map((appt, index) => {
                        const isMine = appt.id === myAppointment?.id;
                        return (
                            <div 
                                key={appt.id} 
                                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                                    isMine 
                                    ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/10' 
                                    : 'bg-white/60 border-slate-100 hover:bg-white hover:shadow-sm'
                                }`}
                            >
                                {/* Token Circle */}
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                                    isMine ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {appt.tokenNumber}
                                </div>

                                {/* User Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-black text-sm uppercase ${isMine ? 'text-indigo-600' : 'text-slate-700'}`}>
                                            {isMine ? 'You' : appt.customer.fullName}
                                        </p>
                                        {appt.status === 'COMPLETED' && (
                                            <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Done</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400">{appt.service.serviceName}</p>
                                </div>

                                {/* Timing summation */}
                                <div className="text-right">
                                    <div className="flex items-center gap-1 justify-end text-slate-700">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-sm font-black">
                                            {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        Duration: {appt.service.durationInMinutes}m
                                    </p>
                                </div>

                                {isMine && <ArrowRight className="w-5 h-5 text-indigo-400" />}
                            </div>
                        );
                    })}
                </div>
                
                {/* 3. FOOTER LEGEND */}
                <div className="mt-8 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <User className="text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-amber-700 uppercase mb-1">Queue Accuracy</p>
                        <p className="text-[11px] text-amber-800/70 font-medium leading-relaxed">
                            This queue is live. Timings are calculated based on the service duration of each customer. Please arrive 10 minutes before your turn.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LiveQueue;