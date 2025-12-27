import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 bg-blue-600 shadow-xl shadow-blue-500/50"
      />
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 font-medium text-gray-600 tracking-widest uppercase text-xs"
      >
        Optimizing your turn...
      </motion.p>
    </div>
  );
};

export default Loader;