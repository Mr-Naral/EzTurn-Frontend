import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axiosConfig';
import { Clock, Scissors, ChevronRight, Info } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const ShopView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const shopRes = await api.get(`/shops/${id}`); // You'll need this simple GET in backend
                const servicesRes = await api.get(`/services/shop/${id}`);
                setShop(shopRes.data);
                setServices(servicesRes.data);
            } catch (err) {
                console.error("Error fetching shop details");
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, [id]);

    const handleBookToken = (serviceId) => {
        // Navigate to payment/confirmation with service details
        navigate(`/checkout?shopId=${id}&serviceId=${serviceId}`);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-white">
            {/* Shop Hero Section */}
            <div className="h-64 bg-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white"
                >
                    <ChevronRight className="rotate-180" />
                </button>
            </div>

            <div className="px-6 -mt-12 relative z-10">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h1 className="text-3xl font-black text-gray-900">{shop?.shopName}</h1>
                    <p className="text-gray-500 mt-1">{shop?.address}</p>
                    
                    <div className="flex gap-4 mt-6">
                        <div className="flex-1 bg-green-50 p-3 rounded-2xl text-center">
                            <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Wait Time</p>
                            <p className="text-lg font-black text-green-700">~15 Mins</p>
                        </div>
                        <div className="flex-1 bg-blue-50 p-3 rounded-2xl text-center">
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Queue</p>
                            <p className="text-lg font-black text-blue-700">3 People</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services List */}
            <div className="p-6 mt-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Select Service</h3>
                <div className="space-y-3">
                    {services.map(service => (
                        <motion.div 
                            key={service.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBookToken(service.id)}
                            className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-indigo-200 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                                    <Scissors className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{service.serviceName}</h4>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {service.durationInMinutes} mins
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-indigo-600">₹{service.price}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">+ ₹10 Fee</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopView;


// // ShopPreview.jsx
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ChevronLeft, MapPin, Star, Clock, ShieldCheck, Scissors } from 'lucide-react';
// import api from '../../api/axiosConfig';

// const ShopPreview = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [shop, setShop] = useState(null);

//     useEffect(() => {
//         api.get(`/shops/${id}`).then(res => setShop(res.data));
//     }, [id]);

//     if (!shop) return null;

//     return (
//         <div className="min-h-screen bg-white">
//             {/* Immersive Header */}
//             <div className="h-64 bg-gradient-to-br from-indigo-600 to-purple-700 relative">
//                 <button 
//                     onClick={() => navigate(-1)}
//                     className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 transition-all"
//                 >
//                     <ChevronLeft />
//                 </button>
//                 <div className="absolute -bottom-12 left-8 flex items-end gap-6">
//                     <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl p-2">
//                         <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-indigo-600 font-black text-4xl">
//                             {shop.shopName.charAt(0)}
//                         </div>
//                     </div>
//                     <div className="pb-6">
//                         <h1 className="text-3xl font-black text-white drop-shadow-md">{shop.shopName}</h1>
//                         <div className="flex items-center gap-2 mt-1">
//                             <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-white rounded-lg text-xs font-bold">
//                                 <Star className="w-3 h-3 fill-white" /> 4.8
//                             </span>
//                             <span className="text-indigo-900 text-sm font-medium flex items-center gap-1">
//                                 <MapPin className="w-4 h-4" /> {shop.address}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <main className="max-w-4xl mx-auto px-8 mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
//                 {/* Details Section */}
//                 <div className="md:col-span-2 space-y-8">
//                     <section>
//                         <h3 className="text-xl font-black text-slate-800 mb-3">About the Shop</h3>
//                         <p className="text-slate-600 leading-relaxed font-medium">
//                             {shop.description || "No description provided for this shop yet."}
//                         </p>
//                     </section>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
//                             <Clock className="text-indigo-600 mb-2" />
//                             <p className="text-xs font-black text-slate-400 uppercase">Status</p>
//                             <p className="font-bold text-green-600">Open Now</p>
//                         </div>
//                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
//                             <ShieldCheck className="text-indigo-600 mb-2" />
//                             <p className="text-xs font-black text-slate-400 uppercase">Verified</p>
//                             <p className="font-bold text-slate-700">EzTurn Partner</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Booking Sticky Sidebar */}
//                 <div className="flex gap-2">
//                     <div className="sticky top-28 bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
//                         <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Standard Hair Cut</p>
//                         <h4 className="text-3xl font-black mb-6">₹120</h4>
//                         <ul className="space-y-4 mb-8 text-sm font-medium text-indigo-100">
//                             <li className="flex items-center gap-2"><Scissors className="w-4 h-4" /> Professional Styling</li>
//                             <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> ~45 Minutes</li>
//                         </ul>
//                         <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
//                             Book A Turn
//                         </button>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default ShopPreview;