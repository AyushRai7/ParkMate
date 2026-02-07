import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Car, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  vehicleTypeFilter: "all" | "car" | "bike";
  onVehicleTypeChange: (type: "all" | "car" | "bike") => void;
  venueFilters: string[];
  selectedVenues: string[];
  onVenueToggle: (venue: string) => void;
  onClearAll: () => void;
}

export default function FilterDropdown({
  isOpen,
  onToggle,
  vehicleTypeFilter,
  onVehicleTypeChange,
  venueFilters,
  selectedVenues,
  onVenueToggle,
  onClearAll,
}: FilterDropdownProps) {
  const hasActiveFilters = vehicleTypeFilter !== "all" || selectedVenues.length > 0;

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className={cn(
          "rounded-full w-10 h-10 border-border/50",
          hasActiveFilters && "border-primary bg-primary/10"
        )}
      >
        <Filter className={cn("w-4 h-4", hasActiveFilters && "text-primary")} />
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-50 w-72 glass-card rounded-xl border border-border/50 shadow-xl overflow-hidden"
          >
            <div className="p-4">
              {/* Vehicle Type Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Vehicle Type
                </h4>
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "All", icon: null },
                    { value: "car", label: "Car", icon: Car },
                    { value: "bike", label: "Bike", icon: Bike },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onVehicleTypeChange(option.value as "all" | "car" | "bike")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        vehicleTypeFilter === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {option.icon && <option.icon className="w-4 h-4" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue Filter */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Venues
                </h4>
                <ScrollArea className="h-32">
                  <div className="flex flex-wrap gap-2">
                    {venueFilters.map((venue) => (
                      <button
                        key={venue}
                        onClick={() => onVenueToggle(venue)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          selectedVenues.includes(venue)
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {venue}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Clear All */}
              {hasActiveFilters && (
                <button
                  onClick={onClearAll}
                  className="flex items-center gap-2 mt-4 text-sm text-destructive hover:text-destructive/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
