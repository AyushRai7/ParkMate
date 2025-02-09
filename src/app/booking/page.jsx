"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Booking() {
  const [placeName, setPlaceName] = useState("");
  const [spotsToBook, setSpotsToBook] = useState(1);
  const [availableSlots, setAvailableSlots] = useState(null);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [timeSlot, setTimeSlot] = useState("10 AM - 12 PM");
  
  const router = useRouter(); // Initialize router

  const searchMall = async () => {
    if (!placeName.trim()) {
      toast.error("Please enter a mall name");
      return;
    }

    try {
      const res = await fetch(
        `/api/parking?placeName=${encodeURIComponent(placeName)}`
      );
      const data = await res.json();

      if (res.ok) {
        setAvailableSlots(data.availableSlots);
        setSpotsToBook(data.totalSlots - data.availableSlots + 1);
        toast.success("Mall found! Check available spots.");
      } else {
        toast.error(data.message || "Mall not found.");
        setAvailableSlots(null);
        setSpotsToBook(1);
      }
    } catch (error) {
      toast.error("Failed to fetch mall information. Try again.");
      console.error("Error:", error);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setPhoneNumber(value);
  };

  const bookSpot = async () => {
    if (!placeName || !userName || !phoneNumber || !vehicleNumber || !vehicleType || !timeSlot) {
      toast.warning("All fields are required.");
      return;
    }

    if (!/^[1-9]\d{9}$/.test(phoneNumber)) {
      toast.error("Invalid phone number.");
      return;
    }

    if (availableSlots < 1) {
      toast.info("No available spots.");
      return;
    }

    try {
      const res = await fetch(`/api/parking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName,
          userName,
          phoneNumber,
          vehicleNumber,
          vehicleType,
          timeSlot,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAvailableSlots(data.remainingSlots);
        setSpotsToBook(data.remainingSlots === 0 ? null : data.remainingSlots + 1);
        toast.success(`Successfully booked P${spotsToBook}. Remaining spots: ${data.remainingSlots}`);

        // Redirect to homepage after 2 seconds
        setTimeout(() => {
          router.push("/homepage");
        }, 2000);
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } catch (error) {
      toast.error("Failed to book parking spot. Try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer position="top-right" />
      <div className="p-6 w-[35%] mx-auto bg-white shadow-md rounded-lg">
        <div className="flex">
          <div className="flex flex-row mr-2 mb-2">
            <div className="w-1 h-10 bg-blue-900"></div>
            <div className="w-1 h-10 bg-red-600 ml-1 mt-2"></div>
          </div>
          <div className="flex items-center">
            <h1 className="text-3xl mb-4" style={{ fontFamily: "Raleway, sans-serif", color: "rgb(13, 14, 62)" }}>
              Book a Parking Spot
            </h1>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter mall name"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={searchMall}
            className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-3"
          >
            Search Mall
          </button>
        </div>

        {availableSlots !== null && (
          <div>
            <p className="mb-2">
              Available Spots: <span className="font-semibold">{availableSlots}</span>
            </p>

            <input
              type="text"
              value={`P${spotsToBook}`}
              readOnly
              className="w-full p-2 border rounded mb-2 bg-gray-100"
            />

            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength="10"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
            </select>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="10 AM - 12 PM">10 AM - 12 PM</option>
              <option value="12 PM - 2 PM">12 PM - 2 PM</option>
              <option value="2 PM - 4 PM">2 PM - 4 PM</option>
              <option value="4 PM - 6 PM">4 PM - 6 PM</option>
            </select>
            <button
              onClick={bookSpot}
              className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-3"
            >
              Book Spot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
