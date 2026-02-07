"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import Navbar from "@/components/booking/Navbar";
import Footer from "@/components/homepage/Footer";
import SearchSection from "@/components/booking/SearchSection";
import VenueCard from "@/components/booking/VenueCard";
import BookingForm from "@/components/booking/Form";
import FareSummary from "@/components/booking/FareSummary";

interface Venue {
  id: string;
  name: string;
  totalCarSlots: number;
  totalBikeSlots: number;
  bookedCarSlots: number;
  bookedBikeSlots: number;
  availableCarSlots: number;
  availableBikeSlots: number;
}

export default function BookingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isUser = session?.user?.isUser || false;
  const user = session?.user || null;

  const [venueQuery, setVenueQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueNotFound, setVenueNotFound] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
    vehicleNumber: "",
    vehicleType: "car" as "car" | "bike",
  });

  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please login to book a parking spot");
      router.push("/login?role=USER&redirect=/booking");
      return;
    }

    if (!isUser) {
      toast.error("Only user accounts can book parking slots");
      router.push("/login?role=USER&redirect=/booking");
    }
  }, [isAuthenticated, isUser, router]);

  // Pre-fill user name from session
  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({
        ...prev,
        userName: user.name || "",
      }));
    }
  }, [user]);

  const handleSearch = async () => {
    if (!venueQuery.trim()) {
      return;
    }
    setIsSearching(true);
    setVenueNotFound(false);

    try {
      const response = await fetch(
        `/api/booking?venue=${encodeURIComponent(venueQuery.trim())}`,
      );
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setVenueNotFound(true);
          setVenue(null);
          setHasSearched(true);
        } else {
          throw new Error(data.error || "Failed to search venue");
        }
        return;
      }

      if (data.success && data.venue) {
        setVenue(data.venue);
        setHasSearched(true);
        setVenueNotFound(false);
      } else {
        setVenueNotFound(true);
        setVenue(null);
        setHasSearched(true);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      setVenueNotFound(true);
      setVenue(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateFare = (vehicleType: "car" | "bike") => {
    const baseFare = vehicleType === "car" ? 100 : 50;
    const gst = Math.round(baseFare * 0.18);
    return baseFare + gst;
  };

  const handleBookNow = async () => {
    if (!formData.userName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }

    if (!formData.vehicleNumber.trim()) {
      toast.error("Enter your vehicle number");
      return;
    }

    if (!venue) {
      toast.error("Search for a venue before booking");
      return;
    }

    const availableSlots =
      formData.vehicleType === "car"
        ? venue.availableCarSlots
        : venue.availableBikeSlots;

    if (availableSlots <= 0) {
      return;
    }

    setIsBooking(true);

    try {
      const bookingResponse = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: venue.name,
          userName: formData.userName.trim(),
          phoneNumber: formData.phone.trim(),
          vehicleType: formData.vehicleType.toUpperCase(),
          vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok) {
        if (bookingResponse.status === 401) {
          toast.error("Session expired. Please login again");
          router.push("/login?role=USER&redirect=/booking");
          return;
        }

        throw new Error(bookingData.error || "Failed to create booking");
      }

      if (!bookingData.success || !bookingData.bookingId) {
        throw new Error("Booking creation failed - no booking ID received");
      }

      const bookingId = bookingData.bookingId;
      const totalAmount = calculateFare(formData.vehicleType);

      const paymentResponse = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: bookingId,
          amount: totalAmount,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Failed to initiate payment");
      }

      if (!paymentData.url) {
        throw new Error("No payment URL received");
      }

      window.location.href = paymentData.url;
    } catch (error: any) {
      console.error("Booking error:", error);
      setIsBooking(false);
    }
  };

  const handleChangeVenue = () => {
    setHasSearched(false);
    setVenueQuery("");
    setVenue(null);
    setVenueNotFound(false);
    setFormData({
      userName: user?.name || "",
      phone: "",
      vehicleNumber: "",
      vehicleType: "car",
    });
  };

  const carAvailable = venue ? venue.availableCarSlots > 0 : false;
  const bikeAvailable = venue ? venue.availableBikeSlots > 0 : false;
  const isSlotAvailable =
    (formData.vehicleType === "car" && carAvailable) ||
    (formData.vehicleType === "bike" && bikeAvailable);

  // Don't render if not authenticated as user
  if (!isAuthenticated || !isUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      {/* Main content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <SearchSection
            venueQuery={venueQuery}
            onVenueQueryChange={setVenueQuery}
            onSearch={handleSearch}
            hasSearched={hasSearched}
            isSearching={isSearching}
          />

          {/* Venue Not Found Message */}
          {hasSearched && venueNotFound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mt-8 p-6 glass-card rounded-xl border border-destructive/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-destructive"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Venue Not Found
                </h3>
                <p className="text-muted-foreground mb-4">
                  We couldn&apos;t find &quot;{venueQuery}&quot;. Please check
                  the spelling or try a different venue.
                </p>
                <button
                  onClick={handleChangeVenue}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                >
                  Try Another Venue
                </button>
              </div>
            </motion.div>
          )}

          {/* Booking Form Section - Show only if venue found */}
          <AnimatePresence>
            {hasSearched && venue && !venueNotFound && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {/* Venue Info Card */}
                  <div className="mb-8">
                    <VenueCard
                      venue={{
                        name: venue.name,
                        address: "Mumbai, Maharashtra",
                        carSlots: {
                          available: venue.availableCarSlots,
                          total: venue.totalCarSlots,
                        },
                        bikeSlots: {
                          available: venue.availableBikeSlots,
                          total: venue.totalBikeSlots,
                        },
                        timing: "24/7 Open",
                      }}
                    />
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid lg:grid-cols-5 gap-8">
                    {/* Booking Form - Takes 3 columns */}
                    <div className="lg:col-span-3">
                      <BookingForm
                        formData={formData}
                        onFormChange={handleFormChange}
                        carAvailable={carAvailable}
                        bikeAvailable={bikeAvailable}
                      />
                    </div>

                    {/* Fare Summary - Takes 2 columns */}
                    <div className="lg:col-span-2">
                      <FareSummary
                        vehicleType={formData.vehicleType}
                        isSlotAvailable={isSlotAvailable}
                        onBookNow={handleBookNow}
                        onChangevenue={handleChangeVenue}
                        isBooking={isBooking}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
