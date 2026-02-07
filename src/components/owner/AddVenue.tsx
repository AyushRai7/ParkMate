"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Car, Bike, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddVenueModal({
  isOpen,
  onClose,
  onSuccess,
}: AddVenueModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalCarSlots: "",
    totalBikeSlots: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }

    const carSlots = parseInt(formData.totalCarSlots);
    const bikeSlots = parseInt(formData.totalBikeSlots);

    if (isNaN(carSlots) || carSlots < 0) {
      return;
    }

    if (isNaN(bikeSlots) || bikeSlots < 0) {
      return;
    }

    if (carSlots === 0 && bikeSlots === 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          totalCarSlots: carSlots,
          totalBikeSlots: bikeSlots,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add venue");
      }

      setFormData({
        name: "",
        totalCarSlots: "",
        totalBikeSlots: "",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Add venue error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        totalCarSlots: "",
        totalBikeSlots: "",
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Wrapper – PERFECT CENTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card rounded-2xl border border-border/50 p-6 shadow-2xl md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                      Add Parking Spot
                    </h2>
                  </div>

                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 transition hover:bg-muted disabled:opacity-50"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Venue Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Phoenix Mall"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={isLoading}
                      className="h-12 border-border/50 bg-background/50 focus:border-primary/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-muted-foreground">
                        <Car className="mr-1 inline h-4 w-4" />
                        Car Slots
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={formData.totalCarSlots}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalCarSlots: e.target.value,
                          })
                        }
                        disabled={isLoading}
                        className="h-12 border-border/50 bg-background/50 focus:border-primary/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-muted-foreground">
                        <Bike className="mr-1 inline h-4 w-4" />
                        Bike Slots
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={formData.totalBikeSlots}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalBikeSlots: e.target.value,
                          })
                        }
                        disabled={isLoading}
                        className="h-12 border-border/50 bg-background/50 focus:border-primary/50"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 h-12 w-full"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                      />
                    ) : (
                      "Add Venue"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
