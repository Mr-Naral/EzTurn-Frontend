import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added useNavigate
import { Search, Clock, ListOrdered, Edit, XCircle, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const MyAppointments = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate(); // 2. Initialize navigate

    const fetchBookings = async () => {
        try {
            const res = await api.get('/appointments/my-bookings');
            setBookings(res.data);
        } catch (err) {
            console.error("Error fetching bookings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // 3. Handlers for Actions
    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this turn?")) {
            try {
                // Assuming your backend PATCH endpoint handles status updates
                await api.patch(`/appointments/${id}/status?status=CANCELLED`);
                fetchBookings(); // Refresh list after cancellation
            } catch (err) {
                alert("Failed to cancel appointment");
            }
        }
    };

    const handleEditRedirect = (id) => {
        // 4. Redirect to the edit form route
        navigate(`/edit-appointment/${id}`);
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.shop.shopName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'ALL' || b.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">MY TURNS</h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Manage your appointments & live status</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search shops..." 
                                className="pl-11 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm font-bold text-sm outline-none focus:ring-2 ring-indigo-500 w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="bg-white p-3 rounded-2xl border-none shadow-sm font-bold text-sm outline-none cursor-pointer"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shop & Service</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Token</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Turn</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <p className="font-black text-slate-800">{b.shop.shopName}</p>
                                        <p className="text-xs font-bold text-indigo-600 uppercase">{b.service.serviceName}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-black">
                                            #{b.tokenNumber}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                            <Clock className="w-4 h-4 text-slate-400"/>
                                            {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(b.status)}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                title="View Live Queue"
                                                onClick={() => navigate(`/shop-queue/${b.shop.id}`)}
                                                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            >
                                                <ListOrdered className="w-5 h-5"/>
                                            </button>
                                            
                                            {/* 5. Added onClick handlers for Edit and Cancel */}
                                            {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleEditRedirect(b.id)}
                                                        title="Edit Time"
                                                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <Edit className="w-5 h-5"/>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancel(b.id)}
                                                        title="Cancel Turn"
                                                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <XCircle className="w-5 h-5"/>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">No appointments found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyAppointments;