import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, CheckCircle2, Loader2, IndianRupee } from 'lucide-react';
import api from '../../api/axiosConfig';

const AppointmentBooking = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/services/${serviceId}`).then(res => setService(res.data));
    }, [serviceId]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Sends the serviceId and the requested start time
            await api.post('/appointments', {
                serviceId: serviceId,
                startTime: startTime // Format: YYYY-MM-DDTHH:mm
            });
            navigate('/my-appointments'); // Redirect to registry
        } catch (err) {
            alert("Booking failed: " + err.response?.data?.message || "Server Error");
        } finally {
            setLoading(false);
        }
    };

    if (!service) return <div className="p-10 text-center font-black">FETCHING SERVICE...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <header className="p-6 flex items-center gap-4 bg-white border-b">
                <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full"><ChevronLeft/></button>
                <h1 className="text-xl font-black uppercase tracking-tight">Confirm Booking</h1>
            </header>

            <main className="max-w-xl mx-auto p-6 mt-8">
                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-indigo-600 p-8 text-white">
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-2">{service.shop.shopName}</p>
                        <h2 className="text-3xl font-black">{service.serviceName}</h2>
                        <div className="flex gap-6 mt-4">
                            <span className="flex items-center gap-1 text-sm font-bold"><Clock className="w-4 h-4"/> {service.durationInMinutes} mins</span>
                            <span className="flex items-center gap-1 text-sm font-bold"><IndianRupee className="w-4 h-4"/> {service.price}</span>
                        </div>
                    </div>

                    <form onSubmit={handleBooking} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Your Preferred Start Time</label>
                            <input 
                                required
                                type="datetime-local" 
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-4 ring-indigo-50"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Queue Note</p>
                            <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                Your actual turn time may vary based on the customers ahead of you in the live queue.
                            </p>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : <><CheckCircle2 className="w-5 h-5"/> Secure My Turn</>}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AppointmentBooking;