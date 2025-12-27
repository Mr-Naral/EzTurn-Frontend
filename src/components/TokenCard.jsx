import { motion } from 'framer-motion';
import { Ticket, MapPin, Calendar } from 'lucide-react';

const TokenCard = ({ token }) => {
    return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden"
        >
            {/* Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em]">Your Turn</p>
                    <h2 className="text-5xl font-black mt-1">#{token.tokenNumber}</h2>
                </div>
                <Ticket className="w-10 h-10 opacity-50" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <Calendar className="w-5 h-5 text-indigo-200" />
                    <div>
                        <p className="text-[10px] text-indigo-200 uppercase font-bold">Reporting Time</p>
                        <p className="font-bold">{new Date(token.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-indigo-200" />
                    <p className="text-sm font-medium">{token.shopName}</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-indigo-200 italic font-medium underline">
                    Please arrive 5 minutes before your time.
                </p>
            </div>
        </motion.div>
    );
};