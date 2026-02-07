"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";


import Navbar from "@/components/owner/Navbar";
import Footer from "@/components/homepage/Footer";
import OwnerHeader from "@/components/owner/Header";
import AddVenueModal from "@/components/owner/AddVenue";
import SearchBar from "@/components/owner/SearchBar";
import BookingsTable from "@/components/owner/BookingsTable";

interface Booking {
  id: string;
  userName: string;
  phoneNumber: string;
  vehicleType: "CAR" | "BIKE";
  slotNumber: number | null;
  vehicleNumber: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  venue: {
    name: string;
    totalCarSlots: number;
    totalBikeSlots: number;
  };
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
}

interface Venue {
  id: string;
  name: string;
  totalCarSlots: number;
  totalBikeSlots: number;
  createdAt: string;
  _count: {
    bookings: number;
  };
}

export default function OwnerPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usernameQuery, setUsernameQuery] = useState("");
  const [vehicleQuery, setVehicleQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [vehicleTypeFilter, setVehicleTypeFilter] =
    useState<"all" | "CAR" | "BIKE">("all");
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchOwnerData = useCallback(async () => {
  try {
    setDataLoading(true);
    setError(null);

    const response = await fetch("/api/owner", {
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        toast.error("Session expired. Please sign in again.");
        router.push("/login?role=OWNER");
        return;
      }
      throw new Error("Unable to load dashboard data");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to load dashboard");
    }

    setBookings(data.bookings || []);
    setVenues(data.venues || []);

    toast.success("Dashboard updated");
  } catch (err: any) {
    setError(err.message);
    toast.error(err.message || "Failed to load owner dashboard");
  } finally {
    setDataLoading(false);
  }
}, [router]);


  /* ---------------- AUTH CHECK ---------------- */

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login?role=OWNER");
      return;
    }

    if (session?.user && !session.user.isOwner) {
      router.push("/login?role=OWNER&error=no-access");
      return;
    }

    if (session?.user?.isOwner) {
      fetchOwnerData();
    }
  }, [status, session, router, fetchOwnerData]);

  /* ---------------- DERIVED DATA ---------------- */

  const allVenues = useMemo(() => venues.map(v => v.name), [venues]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesUsername = b.userName
        .toLowerCase()
        .includes(usernameQuery.toLowerCase());

      const matchesVehicle = b.vehicleNumber
        .toLowerCase()
        .includes(vehicleQuery.toLowerCase());

      const matchesType =
        vehicleTypeFilter === "all" || b.vehicleType === vehicleTypeFilter;

      const matchesVenue =
        selectedVenues.length === 0 ||
        selectedVenues.includes(b.venue.name);

      return (
        matchesUsername &&
        matchesVehicle &&
        matchesType &&
        matchesVenue
      );
    });
  }, [
    bookings,
    usernameQuery,
    vehicleQuery,
    vehicleTypeFilter,
    selectedVenues,
  ]);

  /* ---------------- ACTIONS ---------------- */

  const handleDelete = async (id: string) => {
  try {
    const res = await fetch(`/api/owner?bookingId=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to delete booking");
    }

    toast.success("Booking deleted");
    fetchOwnerData();
  } catch (err: any) {
    toast.error(err.message || "Could not delete booking");
  }
};


  const handleVenueAdded = () => {
  toast.success("Venue added successfully");
  fetchOwnerData();
};


  if (status === "loading" || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary"
        />
      </div>
    );
  }

  if (!session?.user?.isOwner) return null;

  if (error) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={() => {
          toast.message("Retrying…");
          fetchOwnerData();
        }}
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Try Again
      </button>
    </div>
  );
}



  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <OwnerHeader onAddVenue={() => setIsModalOpen(true)} />

          <SearchBar
            usernameQuery={usernameQuery}
            vehicleQuery={vehicleQuery}
            onUsernameChange={setUsernameQuery}
            onVehicleChange={setVehicleQuery}
          />

          <BookingsTable
            bookings={filteredBookings.map(b => ({
              id: b.id,
              user: b.userName || b.user.name || "Unknown",
              venue: b.venue.name,
              vehicleType: b.vehicleType.toLowerCase() as "car" | "bike",
              spotNumber: b.slotNumber
                ? `${b.vehicleType[0]}-${b.slotNumber}`
                : "N/A",
              vehicleNumber: b.vehicleNumber,
            }))}
            onDelete={handleDelete}
            isFilterOpen={isFilterOpen}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            vehicleTypeFilter={
              vehicleTypeFilter.toLowerCase() as "all" | "car" | "bike"
            }
            onVehicleTypeChange={t =>
              setVehicleTypeFilter(t.toUpperCase() as any)
            }
            venueFilters={allVenues}
            selectedVenues={selectedVenues}
            onVenueToggle={v =>
              setSelectedVenues(prev =>
                prev.includes(v)
                  ? prev.filter(x => x !== v)
                  : [...prev, v]
              )
            }
            onClearFilters={() => {
              setVehicleTypeFilter("all");
              setSelectedVenues([]);
            }}
          />
        </div>
      </main>

      <Footer />

      <AddVenueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleVenueAdded}
      />
    </div>
  );
}
