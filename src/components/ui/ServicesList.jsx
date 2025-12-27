import { useEffect, useState } from 'react';
import { Edit3, Trash2, Calendar, Clock, IndianRupee, Plus, Loader2, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const ServicesList = ({ isOwner, shopId }) => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch services from the backend
    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/services/shop/${shopId}`);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (shopId) {
            fetchServices();
        }
    }, [shopId]);

    // 2. Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this service?")) {
            try {
                await api.delete(`/services/${id}`);
                // Re-fetch list after deletion
                fetchServices();
            } catch (error) {
                alert("Failed to delete service. Try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Menu...</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h3 className="text-2xl font-black text-slate-800">Menu & Services</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        {services.length} {services.length === 1 ? 'Service' : 'Services'} Available
                    </p>
                </div>
                
                {isOwner && (
                    <button 
                        onClick={() => navigate(`/service-add/${shopId}`)} 
                        className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform flex items-center gap-2 px-4"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="text-sm font-bold">Add</span>
                    </button>
                )}
            </div>

            {services.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-slate-400 font-medium">No services listed yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {services.map((service) => (
                        <div 
                            key={service.id} 
                            className="group bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Scissors className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg">{service.serviceName}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                            <Clock className="w-3 h-3"/> {service.durationInMinutes} MINS
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px] font-black text-indigo-600 uppercase">
                                            <IndianRupee className="w-3 h-3"/> {service.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isOwner ? (
                                    <>
                                        <button 
                                            onClick={() => navigate(`/service-edit/${service.id}`)} 
                                            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Edit Service"
                                        >
                                            <Edit3 className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(service.id)} 
                                            className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete Service"
                                        >
                                            <Trash2 className="w-5 h-5"/>
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => navigate(`/book/${service.id}`)} 
                                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                                    >
                                        Book <Calendar className="w-4 h-4"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesList;