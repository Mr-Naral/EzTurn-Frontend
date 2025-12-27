// ManageShops.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Edit3, Trash2, Eye, Plus, Loader2, ArrowRight } from 'lucide-react';
import api from '../../api/axiosConfig';

const ManageShops = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 5;

    const loadData = async () => {
        try {
            const [profileRes, shopsRes] = await Promise.all([
                api.get('/auth/profile'),
                api.get('/shops') // Assuming endpoint returns all shops
            ]);
            setUser(profileRes.data);
            // Filter shops owned by current user
            // console.log(shopsRes.data,"shosp data form manage shops")
            setShops(shopsRes.data.filter(s => s.owner.id === profileRes.data.id));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this shop?")) {
            await api.delete(`/shops/${id}`);
            loadData(); // Trigger a reload of the shop data
        }
    };

    const filteredShops = useMemo(() =>
        shops.filter(s => s.shopName.toLowerCase().includes(search.toLowerCase())),
        [shops, search]);

    const totalPages = Math.ceil(filteredShops.length / limit);
    const paginatedShops = filteredShops.slice((page - 1) * limit, page * limit);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-12">
            <header className="bg-white border-b sticky top-0 z-10 p-5">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/profile')} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
                        <h1 className="text-2xl font-black text-slate-800">Manage Shops</h1>
                    </div>
                    <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200"
                        onClick={() => navigate('/shop-add')}>
                        <Plus className="w-5 h-5" /> Add New Shop
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-8">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" placeholder="Search your shops..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-2 ring-indigo-100"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Shop Name</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Address</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedShops.map(shop => (
                                <tr key={shop.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                                                {shop.shopName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700">{shop.shopName}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-500 font-medium">{shop.address}</td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => navigate(`/shop-preview/${shop.id}`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Eye className="w-5 h-5" /></button>
                                            <button onClick={() => navigate(`/shop-edit/${shop.id}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(shop.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">Page {page} of {totalPages || 1}</p>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold disabled:opacity-50">Prev</button>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageShops;