import { motion } from "framer-motion";
import { Search, User, Car } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  usernameQuery: string;
  vehicleQuery: string;
  onUsernameChange: (value: string) => void;
  onVehicleChange: (value: string) => void;
}

export default function SearchBar({
  usernameQuery,
  vehicleQuery,
  onUsernameChange,
  onVehicleChange,
}: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
    >
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by Username"
          value={usernameQuery}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="h-12 pl-12 bg-card/50 border-border/50 focus:border-primary/50"
        />
      </div>

      <div className="relative">
        <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by Vehicle Number"
          value={vehicleQuery}
          onChange={(e) => onVehicleChange(e.target.value)}
          className="h-12 pl-12 bg-card/50 border-border/50 focus:border-primary/50"
        />
      </div>
    </motion.div>
  );
}
