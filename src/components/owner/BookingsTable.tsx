"use client";

import { motion } from "framer-motion";
import { Calendar, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BookingRow from "./BookingsRow";
import FilterDropdown from "./Filter";

interface Booking {
  id: string;
  user: string;
  venue: string;
  vehicleType: "car" | "bike";
  spotNumber: string;
  vehicleNumber: string;
}

interface BookingsTableProps {
  bookings: Booking[];
  onDelete: (id: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  vehicleTypeFilter: "all" | "car" | "bike";
  onVehicleTypeChange: (type: "all" | "car" | "bike") => void;
  venueFilters: string[];
  selectedVenues: string[];
  onVenueToggle: (venue: string) => void;
  onClearFilters: () => void;
}

export default function BookingsTable({
  bookings,
  onDelete,
  isFilterOpen,
  onFilterToggle,
  vehicleTypeFilter,
  onVehicleTypeChange,
  venueFilters,
  selectedVenues,
  onVenueToggle,
  onClearFilters,
}: BookingsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Bookings for Your Venues
            </h2>
            <p className="text-sm text-muted-foreground">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
        </div>

        <FilterDropdown
          isOpen={isFilterOpen}
          onToggle={onFilterToggle}
          vehicleTypeFilter={vehicleTypeFilter}
          onVehicleTypeChange={onVehicleTypeChange}
          venueFilters={venueFilters}
          selectedVenues={selectedVenues}
          onVenueToggle={onVenueToggle}
          onClearAll={onClearFilters}
        />
      </div>

      {/* Table Container */}
      <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold text-foreground">User</TableHead>
                  <TableHead className="font-semibold text-foreground">Venue</TableHead>
                  <TableHead className="font-semibold text-foreground">Vehicle Type</TableHead>
                  <TableHead className="font-semibold text-foreground">Spot</TableHead>
                  <TableHead className="font-semibold text-foreground">Vehicle Number</TableHead>
                  <TableHead className="font-semibold text-foreground w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No bookings found
            </h3>
            <p className="text-muted-foreground text-center text-sm">
              {venueFilters.length > 0 || vehicleTypeFilter !== "all" || selectedVenues.length > 0
                ? "Try adjusting your filters"
                : "Bookings will appear here when customers book your venues"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}