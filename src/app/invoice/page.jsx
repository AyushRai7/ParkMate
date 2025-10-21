"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "react-toastify/dist/ReactToastify.css";
import footer_logo_name from "../assets/footer_logo_name.png";

export default function InvoicePage() {
  const invoiceRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const details = {
      placeName: searchParams.get("placeName"),
      userName: searchParams.get("userName"),
      phoneNumber: searchParams.get("phoneNumber"),
      vehicleNumber: searchParams.get("vehicleNumber"),
      vehicleType: searchParams.get("vehicleType"),
      timeSlot: searchParams.get("timeSlot"),
      spotsToBook: searchParams.get("spotsBooked"),
    };
    setBookingDetails(details);
  }, [searchParams]);

  const downloadInvoice = async () => {
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("invoice.pdf");
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading invoice!");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 bg-gray-50">
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
            <p>
              <strong>Place Name:</strong> {bookingDetails.placeName}
            </p>
            <p>
              <strong>User Name:</strong> {bookingDetails.userName}
            </p>
            <p>
              <strong>Phone Number:</strong> {bookingDetails.phoneNumber}
            </p>
            <p>
              <strong>Vehicle Number:</strong> {bookingDetails.vehicleNumber}
            </p>
            <p>
              <strong>Vehicle Type:</strong> {bookingDetails.vehicleType}
            </p>
            <p>
              <strong>Time Slot:</strong> {bookingDetails.timeSlot}
            </p>
            <p>
              <strong>Spot Number:</strong> P{bookingDetails.spotsToBook}
            </p>

            <button
              onClick={downloadInvoice}
              className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-4 exclude-from-print"
            >
              Download Invoice
            </button>
          </div>
        ) : (
          <p className="text-center text-red-600">
            Loading booking details...
          </p>
        )}
      </div>

      <div className="flex justify-center mt-6 exclude-from-print">
        <button
          onClick={() => router.push("/homepage")}
          className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
        >
          <span className="text-lg">←</span> Back to Home
        </button>
      </div>
    </div>
  );
}
