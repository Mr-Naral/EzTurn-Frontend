import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, Gift, Copy, Share2, TrendingUp, History } from 'lucide-react';
import api from '../api/axiosConfig';

const Wallet = () => {
    const [userData, setUserData] = useState({ walletBalance: 0, myReferralCode: '' });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            const res = await api.get('/auth/me'); // Get current user profile
            setUserData(res.data);
        };
        fetchWallet();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(userData.myReferralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Wallet Header Card */}
            <div className="bg-black p-8 rounded-b-[40px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Available Credits</p>
                <div className="flex items-end gap-2 mt-2">
                    <h1 className="text-5xl font-black">₹{userData.walletBalance}</h1>
                    <span className="text-green-400 font-bold mb-2 flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4" /> +5% Cashback active
                    </span>
                </div>
                
                <div className="mt-8 flex gap-4">
                    <button className="flex-1 bg-white/10 backdrop-blur-md py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/10">
                        <History className="w-4 h-4" /> History
                    </button>
                    <button className="flex-1 bg-indigo-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
                        <Gift className="w-4 h-4" /> Rewards
                    </button>
                </div>
            </div>

            {/* Referral Section */}
            <div className="p-6">
                <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Invite & Earn ₹50</h3>
                        <p className="text-gray-500 text-sm mt-2">
                            Share your code with friends. When they complete their first turn, you both get credits!
                        </p>
                    </div>

                    <div className="bg-gray-50 border-2 border-dashed border-indigo-200 rounded-3xl p-6 flex flex-col items-center">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Your Unique Code</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-black text-indigo-600 tracking-widest">
                                {userData.myReferralCode || "EZT-789"}
                            </span>
                            <button 
                                onClick={copyToClipboard}
                                className={`p-2 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
                    >
                        <Share2 className="w-5 h-5" /> Share Referral Link
                    </motion.button>
                </div>

                {/* Info Section */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-3xl border border-gray-100">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3">
                            <WalletIcon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm">Instant Use</h4>
                        <p className="text-[10px] text-gray-500 mt-1">Apply credits at checkout for instant discounts.</p>
                    </div>
                    <div className="p-4 bg-white rounded-3xl border border-gray-100">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                            <Gift className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm">No Limit</h4>
                        <p className="text-[10px] text-gray-500 mt-1">Invite as many friends as you want. Earn daily.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;