import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Clock, IndianRupee, Loader2, Trash2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const ServiceEdit = () => {
    const { id:serviceId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ serviceName: '', durationInMinutes: '', price: '' });

    useEffect(() => {
        api.get(`/services/${serviceId}`).then(res => {
            setFormData(res.data);
            setLoading(false);
        });
    }, [serviceId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/services/${serviceId}`, formData);
            navigate(-1);
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6">
            <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-sm border p-8">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 rounded-full"><ChevronLeft/></button>
                    <h2 className="text-xl font-black">EDIT SERVICE</h2>
                    <div className="w-10"></div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <input className="w-full p-4 bg-slate-50 rounded-xl font-bold border-none" value={formData.serviceName} onChange={(e)=>setFormData({...formData, serviceName: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" className="p-4 bg-slate-50 rounded-xl font-bold border-none" value={formData.durationInMinutes} onChange={(e)=>setFormData({...formData, durationInMinutes: e.target.value})} />
                        <input type="number" className="p-4 bg-slate-50 rounded-xl font-bold border-none" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                        <Save className="w-5 h-5"/> Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ServiceEdit;