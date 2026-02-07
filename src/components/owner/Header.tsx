import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OwnerHeaderProps {
  onAddVenue: () => void;
}

export default function OwnerHeader({ onAddVenue }: OwnerHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="gradient-text">Owner</span>{" "}
          <span className="text-foreground">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your venues and bookings
        </p>
      </div>

      <Button
        onClick={onAddVenue}
        className="w-full sm:w-auto"
        size="lg"
      >
        <Plus className="w-5 h-5" />
        Add Venue
      </Button>
    </motion.div>
  );
}
