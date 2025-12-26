"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "react-toastify/dist/ReactToastify.css";
import footer_logo_name from "../assets/footer_logo_name.png";
import { ArrowLeft } from "lucide-react";

function InvoiceContent() {
  const [bookingDetails, setBookingDetails] = useState(null);
const router = useRouter();
const searchParams = useSearchParams();
const invoiceRef = useRef(null);

const bookingId = searchParams.get("bookingId");

useEffect(() => {
  if (!bookingId) {
    toast.error("Invalid invoice");
    router.push("/booking");
    return;
  }

  const confirmAndFetch = async () => {
    try {
      const confirmRes = await fetch("/api/confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const confirmData = await confirmRes.json();

      if (!confirmRes.ok) {
        toast.error(confirmData.message || "Booking confirmation failed");
        router.push("/booking");
        return;
      }

      const res = await fetch(`/api/booking/${bookingId}`);
      if (!res.ok) {
        toast.error("Failed to load invoice");
        router.push("/booking");
        return;
      }

      const data = await res.json();
      setBookingDetails(data);

      toast.success(`Spot P${data.slotNumber} booked successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      router.push("/booking");
    }
  };

  confirmAndFetch();
}, [bookingId, router]);


  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      ignoreElements: (el) => el.classList.contains("exclude-from-print"),
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("Invoice.pdf");
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <ToastContainer position="top-right" />
      <div
        ref={invoiceRef}
        className="p-6 w-full max-w-md bg-white shadow-md rounded-lg"
        style={{ fontFamily: "Raleway, sans-serif", color: "rgb(13, 14, 62)" }}
      >
        <div className="flex items-center justify-center gap-1 mb-4">
          <Image
            src={footer_logo_name}
            alt="Logo Name"
            className="h-6 w-auto object-contain"
            priority
          />
        </div>

        <h1 className="text-2xl sm:text-3xl mb-6 text-center text-blue-900 font-bold">
          Booking Invoice
        </h1>

        {bookingDetails ? (
          <div className="text-base sm:text-lg">
            <p><strong>Place Name:</strong> {bookingDetails.placeName}</p>
            <p><strong>User Name:</strong> {bookingDetails.userName}</p>
            <p><strong>Phone Number:</strong> {bookingDetails.phoneNumber}</p>
            <p><strong>Vehicle Number:</strong> {bookingDetails.vehicleNumber}</p>
            <p><strong>Vehicle Type:</strong> {bookingDetails.vehicleType}</p>
            <p><strong>Spot Number:</strong> P{bookingDetails.slotNumber}</p>

            <button
              onClick={downloadInvoice}
              className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-4 exclude-from-print"
            >
              Download Invoice
            </button>
          </div>
        ) : (
          <p className="text-center text-red-600">Loading booking details...</p>
        )}
      </div>

      <button
         onClick={() => router.push("/homepage")}
        className="fixed top-6 left-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500 mt-10">Loading Invoice...</p>}>
      <InvoiceContent />
    </Suspense>
  );
}
