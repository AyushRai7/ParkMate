"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import useRouter for navigation

export default function Admin() {
  const [placeName, setPlaceName] = useState(""); // Mall name
  const [totalSlots, setTotalSlots] = useState(""); // Total slots
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize useRouter

  const addParking = async () => {
    if (!placeName || !totalSlots) {
      setMessage("Mall name and total slots are required.");
      return;
    }

    if (parseInt(totalSlots, 10) <= 0) {
      setMessage("Total slots must be a positive number.");
      return;
    }

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName,
          totalSlots: parseInt(totalSlots, 10),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Parking spot added successfully!", { autoClose: 2000 });
        setMessage("Parking added successfully!");
        // Redirect to homepage after successful parking addition
        setTimeout(() => {
          router.push("/homepage"); // Redirect to homepage
        }, 1000); // Redirect after 1 second to give user feedback
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to add parking. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer position="top-right" />
      <div
        className=" w-[35%] flex flex-col py-7 px-7 shadow-md"
        style={{
          fontFamily: "Raleway, sans-serif",
          color: "rgb(13, 14, 62)",
        }}
      >
        <div className="mb-4 flex">
          <div className="flex flex-row mr-2 mb-2">
            <div className="w-1 h-10 bg-blue-900"></div>
            <div className="w-1 h-10 bg-red-600 ml-1 mt-2"></div>
          </div>
          <div
            className="flex"
            style={{
              fontFamily: "Raleway, sans-serif",
              color: "rgb(13, 14, 62)",
            }}
          >
            <h1 className="text-4xl">Add spot</h1>
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter place name"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="w-full border bg-gray-50 rounded p-2 mb-4"
          />
          <input
            type="number"
            placeholder="Enter total slots"
            value={totalSlots}
            onChange={(e) => setTotalSlots(e.target.value)}
            className="w-full border bg-gray-50 p-2 rounded"
          />

          <div className="mt-5">
            <button
              onClick={addParking}
              style={{
                fontFamily: "Raleway, sans-serif",
              }}
              className="bg-black hover:bg-red-600 text-white p-2 rounded-md w-full"
            >
              Submit
            </button>
          </div>
        </div>

        <div>
          {message && (
            <p
              style={{
                color: message.includes("successfully") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
