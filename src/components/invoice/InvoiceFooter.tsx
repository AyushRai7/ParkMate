import { motion } from "framer-motion";

const InvoiceFooter = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="pt-6 mt-6 border-t border-gray-200 text-center space-y-2"
    >
      <p className="text-sm text-gray-600">
        Thank you for choosing <span className="font-semibold">ParkMate</span>!
      </p>
      <p className="text-xs text-gray-400">
        Need help? Contact us at{" "}
        <a
          href="mailto:support@parkmate.com"
          className="text-cyan-600 hover:underline"
        >
          support@parkmate.com
        </a>
      </p>
    </motion.div>
  );
};

export default InvoiceFooter;
