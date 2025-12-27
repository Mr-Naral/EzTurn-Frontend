import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/ui/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);   
            navigate('/dashboard');
        } catch (error) {
            alert("Login Failed: " + error.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            {isSubmitting && <Loader />}
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-indigo-600 tracking-tight">EzTurn</h1>
                    <p className="text-gray-500 mt-2">Welcome back! Please login.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all bg-white/50"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all bg-white/50"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                    >
                        <LogIn className="w-5 h-5" /> Sign In
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account? 
                    <Link to="/register" className="text-indigo-600 font-bold hover:underline ml-1">Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;