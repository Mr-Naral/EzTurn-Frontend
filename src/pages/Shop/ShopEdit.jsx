import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ChevronLeft, Store, MapPin, AlignLeft, 
    Navigation, Loader2, Save, AlertCircle, 
    Info, Smartphone, RefreshCw
} from 'lucide-react';
import api from '../../api/axiosConfig';

const ShopEdit = () => {
    const { id } = useParams(); // Get shop ID from URL
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        shopName: '',
        address: '',
        description: '',
        latitude: '',
        longitude: ''
    });
    
    const [loading, setLoading] = useState(true);
    const [isFetchingLoc, setIsFetchingLoc] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // 1. Load existing Shop data on mount
    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const response = await api.get(`/shops/${id}`);
                const { shopName, address, description, latitude, longitude } = response.data;
                setFormData({ shopName, address, description, latitude, longitude });
            } catch (err) {
                setError("Could not load shop details. It may have been deleted.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShopDetails();
    }, [id]);

    const handleGetLocation = () => {
        setIsFetchingLoc(true);
        setError('');

        if (!navigator.geolocation) {
            setError("Your browser doesn't support geolocation.");
            setIsFetchingLoc(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setIsFetchingLoc(false);
            },
            () => {
                setError("Location access denied. Please enable GPS.");
                setIsFetchingLoc(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            // Using PUT for updates
            await api.put(`/shops/${id}`, payload);
            navigate('/manage-shops');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update shop details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Edit Shop</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-10 text-white text-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <RefreshCw className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-black">Update Information</h2>
                        <p className="text-slate-300 mt-2 font-medium">Refine your business details and location</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-3xl flex items-center gap-4 text-sm font-bold animate-shake">
                                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Shop Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Shop Name</label>
                                <div className="relative group">
                                    <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input 
                                        required
                                        type="text"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold text-slate-700"
                                        value={formData.shopName}
                                        onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Shop Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input 
                                        required
                                        type="text"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold text-slate-700"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Service Description</label>
                                <div className="relative group">
                                    <AlignLeft className="absolute left-5 top-6 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <textarea 
                                        required
                                        rows="3"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold text-slate-700 resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* GPS Card */}
                            <div className="bg-indigo-50/50 rounded-[2.5rem] p-6 border border-indigo-100 space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-indigo-600" />
                                        <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">Coordinates (GPS)</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleGetLocation}
                                        className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1 transition-all"
                                    >
                                        {isFetchingLoc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                                        Update To Current Location
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Latitude</p>
                                        <p className="font-mono text-sm text-indigo-600 font-black truncate">{formData.latitude}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Longitude</p>
                                        <p className="font-mono text-sm text-indigo-600 font-black truncate">{formData.longitude}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-indigo-400 font-medium px-2 flex items-start gap-2">
                                    <Info className="w-3 h-3 mt-0.5" /> 
                                    Update coordinates only if the shop location has moved.
                                </p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6" />
                                        Save Changes
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

export default ShopEdit;