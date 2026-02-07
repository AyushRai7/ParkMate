import { motion } from "framer-motion";
import { Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadInvoiceButtonProps {
  disabled?: boolean;
  onDownload?: () => void;
}

const DownloadInvoiceButton = ({
  disabled = false,
  onDownload,
}: DownloadInvoiceButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-3 print:hidden"
    >
      {/* Primary CTA */}
      <Button
        onClick={onDownload}
        disabled={disabled}
        className="
          w-full h-12 rounded-xl font-semibold
          bg-primary text-primary-foreground
          hover:bg-primary/90
          transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <Download className="w-4 h-4 mr-2" />
        Download Invoice
      </Button>

      {/* Disabled helper */}
      {disabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            flex items-center justify-center gap-2
            rounded-lg border border-amber-500/20
            bg-amber-500/10
            py-2 px-4
          "
        >
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-300">
            Download available after slot assignment
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DownloadInvoiceButton;
