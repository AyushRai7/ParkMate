"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

import BackNavigationButton from "@/components/invoice/BackButton";
import InvoiceLayout from "@/components/invoice/InvoiceLayout";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import InvoiceDetails from "@/components/invoice/InvoiceDetails";
import InvoiceFooter from "@/components/invoice/InvoiceFooter";
import DownloadInvoiceButton from "@/components/invoice/DownloadButton";
import LoadingState from "@/components/invoice/LoadingState";

interface BookingDetails {
  id: string;
  placeName: string;
  userName: string;
  phoneNumber: string;
  vehicleNumber: string;
  vehicleType: "CAR" | "BIKE";
  slotNumber: number | null;
  slotLabel: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
}

function InvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const bookingId = searchParams.get("bookingId");

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const loadInvoiceData = useCallback(async () => {
  if (!bookingId) return;

  try {
    setIsLoading(true);
    setError(null);

    const res = await fetch(`/api/booking/${bookingId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to load invoice");
    }

    const data = await res.json();
    setBookingDetails(data);

    if (data.status === "PENDING" || !data.slotNumber) {
      setIsConfirming(true);
      try {
        const confirmRes = await fetch("/api/confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        if (confirmRes.ok) {
          const refreshRes = await fetch(`/api/booking/${bookingId}`, {
            cache: "no-store",
          });
          if (refreshRes.ok) {
            setBookingDetails(await refreshRes.json());
          }
        }
      } finally {
        setIsConfirming(false);
      }
    }
  } catch (error: any) {
    setError(error.message || "Failed to load invoice");
  } finally {
    setIsLoading(false);
  }
}, [bookingId]);

  useEffect(() => {
  if (!bookingId) {
    setError("Invalid booking ID");
    return;
  }

  loadInvoiceData();
}, [bookingId, loadInvoiceData]);

  const handleDownload = async () => {
    if (!bookingDetails) {
      return;
    }

    if (!bookingDetails.slotNumber) {
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const primaryColor = [59, 130, 246];
      const darkColor = [31, 41, 55];
      const lightColor = [243, 244, 246];

      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, 210, 40, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text("ParkMate", 105, 20, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Booking Invoice", 105, 30, { align: "center" });

      pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

      pdf.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
      pdf.roundedRect(20, 50, 170, 30, 3, 3, "F");

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Parking Spot Number", 105, 62, { align: "center" });

      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(bookingDetails.slotLabel, 105, 74, { align: "center" });

      pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

      let yPos = 95;
      const lineHeight = 8;
      const labelX = 25;
      const valueX = 85;

      const details = [
        { label: "Venue Name:", value: bookingDetails.placeName },
        { label: "User Name:", value: bookingDetails.userName },
        { label: "Phone Number:", value: bookingDetails.phoneNumber },
        { label: "Vehicle Number:", value: bookingDetails.vehicleNumber },
        {
          label: "Vehicle Type:",
          value: bookingDetails.vehicleType === "CAR" ? "Car" : "Bike",
        },
        { label: "Status:", value: bookingDetails.status },
      ];

      pdf.setFontSize(11);
      details.forEach((detail, index) => {
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(20, yPos - 5, 170, 10, "F");
        }

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(107, 114, 128);
        pdf.text(detail.label, labelX, yPos);

        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        pdf.text(detail.value, valueX, yPos);

        yPos += lineHeight + 4;
      });

      yPos += 10;
      pdf.setDrawColor(229, 231, 235);
      pdf.line(20, yPos, 190, yPos);

      yPos += 8;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(156, 163, 175);
      pdf.text(`Booking ID: ${bookingDetails.id}`, 105, yPos, {
        align: "center",
      });

      yPos = 270;
      pdf.setDrawColor(229, 231, 235);
      pdf.line(20, yPos, 190, yPos);

      yPos += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Thank you for choosing ParkMate!", 105, yPos, {
        align: "center",
      });

      yPos += 6;
      pdf.setFontSize(9);
      pdf.text("Questions? Contact support@parkmate.com", 105, yPos, {
        align: "center",
      });

      const fileName = `ParkMate_Invoice_${bookingDetails.slotLabel}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
    }
  };

  const isSlotAssigned =
    bookingDetails?.slotNumber !== null &&
    bookingDetails?.slotNumber !== undefined;

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[160px]" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <BackNavigationButton />
      <InvoiceLayout>
        <div ref={invoiceRef}>
          <AnimatePresence mode="wait">
            {isLoading || isConfirming ? (
              <LoadingState
                key="loading"
                message={
                  isConfirming
                    ? "Confirming booking and assigning slot..."
                    : "Loading invoice..."
                }
              />
            ) : error ? (
              <div key="error" className="text-center py-12">
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
                  Failed to Load Invoice
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={loadInvoiceData}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push("/booking")}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition"
                  >
                    Back to Booking
                  </button>
                </div>
              </div>
            ) : bookingDetails ? (
              <div key="invoice" className="space-y-6">
                <InvoiceHeader />

                <InvoiceDetails
                  venueName={bookingDetails.placeName}
                  spotNumber={
                    bookingDetails.slotNumber ? bookingDetails.slotLabel : null
                  }
                  userName={bookingDetails.userName}
                  phoneNumber={bookingDetails.phoneNumber}
                  vehicleNumber={bookingDetails.vehicleNumber}
                  vehicleType={
                    bookingDetails.vehicleType === "CAR" ? "Car" : "Bike"
                  }
                  bookingId={bookingDetails.id}
                />

                <div className="exclude-from-print">
                  <DownloadInvoiceButton
                    disabled={!isSlotAssigned}
                    onDownload={handleDownload}
                  />

                  {!isSlotAssigned && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 text-center">
                        ⏳ Slot assignment pending. Download will be available
                        once payment is confirmed and slot is assigned.
                      </p>
                    </div>
                  )}
                </div>

                <InvoiceFooter />
              </div>
            ) : (
              <div key="no-data" className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Booking Data
                </h3>
                <p className="text-muted-foreground mb-4">
                  Unable to load booking information
                </p>
                <button
                  onClick={() => router.push("/booking")}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                >
                  Back to Booking
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </InvoiceLayout>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Invoice...</p>
          </div>
        </div>
      }
    >
      <InvoiceContent />
    </Suspense>
  );
}
