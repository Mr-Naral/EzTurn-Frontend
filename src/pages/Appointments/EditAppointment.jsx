import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axiosConfig';

const EditAppointment = () => {
    const { id: appointmentId } = useParams();
    const navigate = useNavigate();
    
    const [appointment, setAppointment] = useState(null);
    const [newTime, setNewTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                // Fetch existing booking details
                const res = await api.get(`/appointments/${appointmentId}`);
                setAppointment(res.data);
                
                // Format the existing startTime for the input field (removes seconds/milliseconds)
                if (res.data.startTime) {
                    const date = new Date(res.data.startTime);
                    const formattedDate = date.toISOString().slice(0, 16);
                    setNewTime(formattedDate);
                }
            } catch (err) {
                console.error("Error fetching appointment", err);
                alert("Could not load appointment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [appointmentId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            // Send the updated time to the backend
            // Note: We use the same 'startTime' logic so the backend recalculates the queue
            await api.patch(`/appointments/${appointmentId}/time`, {
                startTime: newTime
            });
            
            alert("Turn time updated successfully!");
            navigate('/my-appointments');
        } catch (err) {
            alert("Update failed: " + (err.response?.data?.message || "Server Error"));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-black text-slate-400">
            LOADING YOUR TURN...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <header className="p-6 flex items-center gap-4 bg-white border-b">
                <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <ChevronLeft/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tight">Reschedule Turn</h1>
            </header>

            <main className="max-w-xl mx-auto p-6 mt-8">
                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
                    {/* Header Info */}
                    <div className="bg-slate-900 p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                                    {appointment?.shop?.shopName}
                                </p>
                                <h2 className="text-3xl font-black">{appointment?.service?.serviceName}</h2>
                            </div>
                            <div className="bg-indigo-600 px-4 py-2 rounded-2xl font-black text-sm">
                                Token #{appointment?.tokenNumber}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                                New Preferred Start Time
                            </label>
                            <div className="relative">
                                <input 
                                    required
                                    type="datetime-local" 
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-4 ring-indigo-50 text-slate-700"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Informative Alert */}
                        <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Queue Recalculation</p>
                                <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                                    Changing your time will move your position in the queue. Your new token number and actual start time will be updated based on other customers.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => navigate('/my-appointments')}
                                className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={updating}
                                type="submit" 
                                className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                {updating ? (
                                    <Loader2 className="animate-spin"/>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5"/> 
                                        Update Timing
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditAppointment;