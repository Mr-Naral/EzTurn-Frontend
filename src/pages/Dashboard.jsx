import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import {
    Search, Navigation, Star, Map as MapIcon,
    Filter, ArrowRight, MapPin, Scissors,
    ChevronRight, ChevronLeft, SlidersHorizontal,
    Loader2
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [userRole, setUserRole] = useState(null); // Added state for role check
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const shopsPerPage = 6;

    useEffect(() => {
        const initDashboard = async () => {
            try {
                setLoading(true);
                // Fetch Shops and User Profile concurrently for better performance
                const [shopsRes, userRes] = await Promise.all([
                    api.get('/shops'),
                    api.get('/auth/profile') // Assuming this returns the User object with role
                ]);
                
                setShops(shopsRes.data);
                setUserRole(userRes.data.role); // e.g., 'CUSTOMER' or 'SHOPKEEPER'
            } catch (err) {
                console.error("Dashboard Init Error", err);
            } finally {
                setLoading(false);
            }
        };
        initDashboard();
    }, []);

    // Logic for Search and Pagination
    const filteredShops = useMemo(() => {
        return shops.filter(shop =>
            shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [shops, searchQuery]);

    const indexOfLastShop = currentPage * shopsPerPage;
    const indexOfFirstShop = indexOfLastShop - shopsPerPage;
    const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);
    const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

    // Conditional Routing Helper
    const handleManagementRoute = () => {
        if (userRole === 'SHOPKEEPER') {
            navigate('/shop-dashboard');
        } else {
            navigate('/my-appointments');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* --- TOP NAVBAR --- */}
            <header className="bg-white border-b border-slate-300 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Scissors className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight hidden sm:block">EzTurn</h2>
                    </div>

                    <div className="flex-1 max-w-md mx-4 sm:mx-8">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by shop name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent border focus:bg-white focus:border-indigo-200 rounded-2xl outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div
                            onClick={handleManagementRoute} // Updated logic
                            className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 font-bold cursor-pointer hover:ring-4 hover:ring-slate-50 transition-all border border-slate-200"
                        >
                            <span>☰</span>
                        </div>
                        <div
                            onClick={() => navigate('/profile')}
                            className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 font-bold cursor-pointer hover:ring-4 hover:ring-slate-50 transition-all border border-slate-200"
                        >
                            U
                        </div>
                    </div>

                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT SIDE: MAP PLACEHOLDER --- */}
                    <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
                        <div className="sticky top-28 space-y-6">

                            {/* Quick Stats Card */}
                            <div className="bg-indigo-800 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" /> Near Solapur
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-4 rounded-2xl">
                                        <p className="text-indigo-200 text-[10px] font-black uppercase">Active Shops</p>
                                        <p className="text-2xl font-black">{shops.length}</p>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-2xl">
                                        <p className="text-indigo-200 text-[10px] font-black uppercase">
                                            {userRole === 'SHOPKEEPER' ? 'Shop Dashboard' : 'Your Appointments'}
                                        </p>
                                        <a 
                                            onClick={handleManagementRoute} // Updated logic
                                            className="text-xl text-white font-black cursor-pointer hover:text-indigo-300 "
                                        >
                                            <u>View</u>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder Card */}
                            <div className="bg-slate-200 rounded-[2.5rem] aspect-square lg:aspect-auto lg:h-[400px] flex flex-col items-center justify-center text-slate-500 border-4 border-white shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 opacity-50"></div>
                                <MapIcon className="w-12 h-12 mb-2 relative z-10 text-slate-400" />
                                <p className="font-bold relative z-10">Map View (Coming Soon)</p>
                                <p className="text-xs px-8 text-center mt-2 relative z-10">Google Maps will appear here once billing is verified.</p>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: SHOP LISTING --- */}
                    <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">Available Shops</h3>
                                <p className="text-slate-500 text-sm font-medium">Discover top-rated services near you</p>
                            </div>
                            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                <Filter className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* List rendering */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode='popLayout'>
                                {currentShops.length > 0 ? currentShops.map((shop) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ y: -5 }}
                                        key={shop.id}
                                        className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group cursor-pointer hover:shadow-xl hover:shadow-indigo-100/50 transition-all"
                                        onClick={() => navigate(`/shop-preview/${shop.id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                {shop.shopName?.charAt(0)}
                                            </div>
                                            <div className="bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-black text-amber-700">4.8</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{shop.shopName}</h4>
                                            <p className="text-slate-500 text-sm line-clamp-1 mb-4 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" /> {shop.address}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">OPEN NOW</span>
                                            <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                                                Book Turn <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-slate-400 font-bold">
                                            {searchQuery ? `No shops found matching "${searchQuery}"` : "No shops found"}
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex justify-center items-center gap-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-slate-700 text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;