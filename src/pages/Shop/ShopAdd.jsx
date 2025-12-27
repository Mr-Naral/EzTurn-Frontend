import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Store, MapPin, AlignLeft, 
    Navigation, Loader2, CheckCircle2, AlertCircle, 
    Info, Smartphone
} from 'lucide-react';
import api from '../../api/axiosConfig';

const ShopAdd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shopName: '',
        address: '',
        description: '',
        latitude: '',
        longitude: ''
    });
    const [isFetchingLoc, setIsFetchingLoc] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Function to get User's current Geolocation
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
            (err) => {
                setError("Location access denied. Please enable GPS and try again.");
                setIsFetchingLoc(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validation: Ensure coordinates exist
        if (!formData.latitude || !formData.longitude) {
            setError("Please fetch your shop location coordinates first.");
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                shopName: formData.shopName,
                address: formData.address,
                description: formData.description,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            await api.post('/shops', payload);
            // Redirect to the management list after success
            navigate('/manage-shops');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Minimal Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Setup Your Shop</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-white/20">
                            <Store className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black">Business Registration</h2>
                        <p className="text-indigo-100 mt-2 font-medium">Register your shop to start receiving digital bookings</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-3xl flex items-center gap-4 text-sm font-bold">
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
                                        placeholder="e.g. EzTurn Barber Shop"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
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
                                        placeholder="Near Bus Stand, Solapur"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
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
                                        placeholder="Describe your premium grooming services..."
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Geolocation Fetching Card */}
                            <div className="bg-indigo-50/50 rounded-[2.5rem] p-6 border border-indigo-100 space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-indigo-600" />
                                        <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">Coordinates (GPS)</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleGetLocation}
                                        className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1"
                                    >
                                        {isFetchingLoc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                                        {formData.latitude ? "Re-fetch Location" : "Auto-detect Location"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-indigo-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Latitude</p>
                                        <p className="font-mono text-sm text-indigo-600 font-black">{formData.latitude || '---'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-indigo-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Longitude</p>
                                        <p className="font-mono text-sm text-indigo-600 font-black">{formData.longitude || '---'}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-indigo-400 font-medium px-2 flex items-start gap-2">
                                    <Info className="w-3 h-3 mt-0.5" /> 
                                    Stand at your shop's entrance and click "Auto-detect" for precision.
                                </p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit"
                                disabled={isSubmitting || !formData.latitude}
                                className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-200 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Creating Shop...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-6 h-6" />
                                        Create Shop Now
                                    </>
                                )}
                            </button>
                            {!formData.latitude && !isSubmitting && (
                                <p className="text-center text-slate-400 text-[11px] mt-4 font-bold uppercase tracking-widest">
                                    * Geolocation required to enable button
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ShopAdd;