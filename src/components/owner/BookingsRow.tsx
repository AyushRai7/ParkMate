"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Car, Bike, AlertCircle } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface Booking {
  id: string;
  user: string;
  venue: string;
  vehicleType: "car" | "bike";
  spotNumber: string;
  vehicleNumber: string;
}

interface BookingRowProps {
  booking: Booking;
  onDelete: (id: string) => void;
}

export default function BookingRow({ booking, onDelete }: BookingRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(booking.id);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <TableRow className="hover:bg-muted/50 transition-colors">
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {booking.user.charAt(0).toUpperCase()}
              </span>
            </div>
            <span>{booking.user}</span>
          </div>
        </TableCell>

        <TableCell>{booking.venue}</TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            {booking.vehicleType === "car" ? (
              <Car className="w-4 h-4 text-primary" />
            ) : (
              <Bike className="w-4 h-4 text-accent" />
            )}
            <span className="capitalize">{booking.vehicleType}</span>
          </div>
        </TableCell>

        <TableCell>
          <span className="px-2 py-1 rounded-md bg-muted text-sm font-mono">
            {booking.spotNumber}
          </span>
        </TableCell>

        <TableCell>
          <span className="font-mono text-sm">{booking.vehicleNumber}</span>
        </TableCell>

        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      {mounted &&
        createPortal(
          <AnimatePresence>
         {showConfirm && ( 
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => !isDeleting && setShowConfirm(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="glass-card rounded-2xl border border-border/50 p-6 shadow-2xl">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-center mb-2">
                    Delete Booking?
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Are you sure you want to delete the booking for{" "}
                    <span className="font-semibold text-foreground">
                      {booking.user}
                    </span>{" "}
                    at <span className="font-semibold text-foreground">{booking.venue}</span>?
                    This action cannot be undone.
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-4 w-4 rounded-full border-2 border-destructive-foreground/30 border-t-destructive-foreground"
                        />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
          document.body
        )}
    </>
  );
}
