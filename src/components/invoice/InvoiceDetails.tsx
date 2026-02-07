import { motion } from "framer-motion";
import { MapPin, User, Phone, Car, Hash } from "lucide-react";

interface InvoiceDetailsProps {
  venueName: string;
  spotNumber: string | null;
  userName: string;
  phoneNumber: string;
  vehicleNumber: string;
  vehicleType: "Car" | "Bike";
  bookingId: string;
}

const InvoiceDetails = ({
  venueName,
  spotNumber,
  userName,
  phoneNumber,
  vehicleNumber,
  vehicleType,
  bookingId,
}: InvoiceDetailsProps) => {
  const details = [
    { label: "Venue Name", value: venueName, icon: MapPin },
    { label: "User Name", value: userName, icon: User },
    { label: "Phone Number", value: phoneNumber, icon: Phone },
    { label: "Vehicle Number", value: vehicleNumber, icon: Hash },
    { label: "Vehicle Type", value: vehicleType, icon: Car },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Parking Spot (PRIMARY HIGHLIGHT) */}
      <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">
          Parking Spot Number
        </p>

        <p className="text-4xl font-bold text-primary">
          {spotNumber || "—"}
        </p>

        {!spotNumber && (
          <p className="mt-2 text-xs text-amber-400">
            Slot assignment pending
          </p>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {details.map((detail, index) => {
          const Icon = detail.icon;
          return (
            <motion.div
              key={detail.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4"
            >
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Icon className="h-4 w-4 text-primary" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {detail.label}
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {detail.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Booking ID */}
      <div className="pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Booking ID:{" "}
          <span className="font-mono text-foreground">
            {bookingId}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default InvoiceDetails;
