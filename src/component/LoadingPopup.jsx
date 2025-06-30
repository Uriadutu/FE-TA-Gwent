// components/LoadingPopup.jsx
import { motion } from "framer-motion";

const LoadingPopup = ({value}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-2"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingPopup;
