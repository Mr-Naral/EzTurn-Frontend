import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import ServicesList from '../../components/ui/ServicesList';

const ShopPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchShopData = async () => {
        try {
            // Fetch both profile and shop details
            const [shopRes, profileRes] = await Promise.all([
                api.get(`/shops/${id}`),
                api.get('/auth/profile').catch(() => ({ data: null })) // Handle guest view
            ]);
            
            setShop(shopRes.data);
            setCurrentUser(profileRes.data);
        } catch (err) {
            console.error("Error loading preview:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
        </div>
    );

    if (!shop) return <div className="p-20 text-center font-bold">Shop not found.</div>;

    // Check if the current logged-in user is the owner of this shop
    // Supporting both flat (ownerId) and nested (owner.id) structures
    const isOwner = currentUser && (shop.ownerId === currentUser.id || shop.owner?.id === currentUser.id);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Immersive Header */}
            <div className="h-64 bg-gradient-to-br from-indigo-600 to-purple-700 relative">
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 transition-all z-20"
                >
                    <ChevronLeft />
                </button>
                
                <div className="absolute -bottom-12 left-8 flex items-end gap-6 z-10">
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl p-2">
                        <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-indigo-600 font-black text-4xl">
                            {shop.shopName.charAt(0)}
                        </div>
                    </div>
                    <div className="pb-6">
                        <h1 className="text-3xl font-black text-white drop-shadow-md">{shop.shopName}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-white rounded-lg text-xs font-bold">
                                <Star className="w-3 h-3 fill-white" /> 4.8
                            </span>
                            <span className="text-indigo-900 text-sm font-medium flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {shop.address}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-8 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* Left Column: About & Services */}
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <h3 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tight">About the Shop</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                {shop.description || "Welcome to our shop! We provide premium services tailored to your needs. Visit us for an exceptional experience."}
                            </p>
                        </section>

                        {/* Services List Component Integration */}
                        <section className="pt-4">
                            <ServicesList 
                                services={shop.services || []} 
                                isOwner={isOwner} 
                                shopId={shop.id} 
                                onRefresh={fetchShopData} 
                            />
                        </section>
                    </div>

                    {/* Right Column: Status Cards */}
                    <div className="space-y-4">
                        <div className="sticky top-28 space-y-4">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quick Info</h3>
                            
                            <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                <Clock className="text-indigo-600 mb-2 w-5 h-5" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Status</p>
                                <p className="font-bold text-green-600 text-lg">Open Now</p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                <ShieldCheck className="text-indigo-600 mb-2 w-5 h-5" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Badge</p>
                                <p className="font-bold text-slate-700 text-lg">Verified Partner</p>
                            </div>

                            {isOwner && (
                                <div className="p-6 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                                    <p className="text-indigo-700 font-black text-xs uppercase mb-2">Owner Dashboard</p>
                                    <button 
                                        onClick={() => navigate(`/shop-edit/${shop.id}`)}
                                        className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                    >
                                        Edit Shop Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ShopPreview;