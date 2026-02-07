"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InvoiceLayoutProps {
  children: ReactNode;
}

const InvoiceLayout = ({ children }: InvoiceLayoutProps) => {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 print:bg-white print:p-0">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="
          w-full max-w-lg
          glass-card bg-card/80 backdrop-blur-xl
          rounded-2xl
          p-6 md:p-8
          shadow-2xl
          print:bg-white print:shadow-none print:rounded-none print:max-w-none
        "
      >
        {children}
      </motion.div>
    </div>
  );
};

export default InvoiceLayout;
