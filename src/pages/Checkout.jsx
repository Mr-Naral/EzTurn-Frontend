import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import { ShieldCheck, Wallet, CreditCard, ArrowRight } from 'lucide-react';
import Loader from '../components/ui/Loader';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const shopId = searchParams.get('shopId');
    const serviceId = searchParams.get('serviceId');

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                // userId 1 is hardcoded here; in production, get it from your AuthContext
                const res = await api.get(`/payments/details?serviceId=${serviceId}&userId=1`);
                setDetails(res.data);
            } catch (err) {
                console.error("Failed to fetch fee breakdown");
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentDetails();
    }, [serviceId]);

    const handlePayment = async () => {
        // Logic to trigger Razorpay/Stripe Popup
        const options = {
            key: "YOUR_RAZORPAY_KEY", // Enter your test key here
            amount: details.totalToPay * 100, // Amount in paise
            currency: "INR",
            name: "EzTurn",
            description: "Service Booking Fee",
            handler: async function (response) {
                // On success, notify backend to finalize token and commission
                await api.post('/payments/process', {
                    appointmentId: 1, // Get this from booking response
                    razorpayPaymentId: response.razorpay_payment_id
                });
                navigate('/success');
            },
            theme: { color: "#4F46E5" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-green-500" /> Payment Summary
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between text-gray-500">
                        <span>Service Price</span>
                        <span className="font-bold text-gray-800">₹{details.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Platform Fee (EzTurn)</span>
                        <span className="font-bold text-indigo-600">+ ₹{details.platformFee}</span>
                    </div>
                    <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-2xl">
                        <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Wallet Cashback</span>
                        <span className="font-bold">- ₹{details.discount}</span>
                    </div>

                    <div className="border-t border-dashed pt-4 mt-4 flex justify-between items-center">
                        <span className="text-xl font-black text-gray-900">Total</span>
                        <span className="text-3xl font-black text-indigo-600">₹{details.totalToPay}</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
                >
                    <CreditCard /> Pay Now <ArrowRight className="w-5 h-5" />
                </motion.button>
            </div>

            <p className="text-center text-gray-400 text-xs mt-8 px-8">
                By paying, you agree to EzTurn's terms of service and instant booking policy.
            </p>
        </div>
    );
};

export default Checkout;