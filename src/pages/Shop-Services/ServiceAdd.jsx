import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Scissors, Clock, IndianRupee, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const ServiceAdd = () => {
    // const { shopId } = useParams();
    const { id: shopId } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        serviceName: '',
        durationInMinutes: '',
        price: ''
    });
    // console.log(shopId,'shopId')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        const payload = {
            serviceName: formData.serviceName,
            durationInMinutes: Number(formData.durationInMinutes),
            price: Number(formData.price),
            shopId: Number(shopId)   // 👈 CRITICAL
        };
    
        console.log(payload, "FINAL PAYLOAD");
    
        try {
            await api.post('/services', payload);
            navigate(-1);
        } catch (err) {
            console.error("Error adding service", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-12">
            <header className="bg-white border-b p-5 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
                    <h1 className="text-xl font-black text-slate-800">ADD NEW SERVICE</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 mt-10">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-indigo-600 p-8 text-white">
                        <Scissors className="w-10 h-10 mb-3 opacity-80" />
                        <h2 className="text-2xl font-black">Service Details</h2>
                        <p className="text-indigo-100 text-sm">Define what you offer and how much it costs.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Service Name</label>
                            <div className="relative group">
                                <input required type="text" placeholder="e.g. Premium Haircut" 
                                    className="w-full pl-6 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold"
                                    value={formData.serviceName}
                                    onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Duration (Mins)</label>
                                <div className="relative flex items-center">
                                    <Clock className="absolute left-4 w-4 h-4 text-slate-400" />
                                    <input required type="number" placeholder="30" 
                                        className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold"
                                        value={formData.durationInMinutes}
                                        onChange={(e) => setFormData({...formData, durationInMinutes: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Price (₹)</label>
                                <div className="relative flex items-center">
                                    <IndianRupee className="absolute left-4 w-4 h-4 text-slate-400" />
                                    <input required type="number" placeholder="500" 
                                        className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <button disabled={isSubmitting} type="submit" 
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus className="w-5 h-5"/> Create Service</>}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ServiceAdd;