import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import { User, Phone, Mail, Lock, UserPlus, Ticket, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'CUSTOMER',
        referralCode: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' }); // 'success' or 'error'
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // Cleanup payload: convert empty referral string to null for backend
        const payload = {
            ...formData,
            referralCode: formData.referralCode.trim() || null
        };

        try {
            await api.post('/auth/register', payload);
            setStatus({ type: 'success', message: 'Account created! Please verify your email.' });
            
            // Delay navigation so user can see success message
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || "Registration failed. Please try again.";
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
            <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100"
            >
                <div className="text-center mb-8">
                    <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join us to manage your stock and sales</p>
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                    {status.message && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className={`flex items-center gap-3 p-4 rounded-xl mb-6 text-sm font-medium ${
                                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}
                        >
                            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Role Selection */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-2">
                        {['CUSTOMER', 'SHOPKEEPER'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setFormData({ ...formData, role })}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                    formData.role === role ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input name="fullName" type="text" placeholder="Full Name" required 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all"
                            onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input name="email" type="email" placeholder="Email Address" required 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all"
                            onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input name="phoneNumber" type="tel" placeholder="Phone Number" required 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all"
                            onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input name="password" type="password" placeholder="Password" required 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all"
                            onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <Ticket className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input name="referralCode" type="text" placeholder="Referral Code (Optional)" 
                            className="w-full pl-12 pr-4 py-3.5 bg-indigo-50/50 border border-indigo-100 border-dashed rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all"
                            onChange={handleChange} />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5"/>}
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Already have an account? <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">Log In</button>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;