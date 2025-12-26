"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Booking() {
const [placeName, setPlaceName] = useState("");
const [availableSlotsOfCar, setAvailableSlotsOfCar] = useState(null);
const [availableSlotsOfBike, setAvailableSlotsOfBike] = useState(null);

const [userName, setUserName] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [vehicleNumber, setVehicleNumber] = useState("");
const [vehicleType, setVehicleType] = useState("Car");
const [venueFound, setVenueFound] = useState(false);


const searchVenue = async () => {
  if (!placeName.trim()) {
    toast.error("Please enter a venue name");
    return;
  }

  try {
    const res = await fetch(
      `/api/parking?placeName=${encodeURIComponent(placeName)}`
    );
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Venue not found");
      setVenueFound(false);
      return;
    }

    setAvailableSlotsOfCar(data.availableSlotsOfCar);
    setAvailableSlotsOfBike(data.availableSlotsOfBike);
    setVenueFound(true);
    toast.success("Venue found! Check available spots.");
  } catch (error) {
    toast.error("Failed to fetch venue information");
    console.error(error);
  }
};

const handlePhoneNumberChange = (e) => {
  const value = e.target.value;
  if (!/^\d*$/.test(value)) return;
  setPhoneNumber(value);
};

const currentAvailable =
    vehicleType === "Car" ? availableSlotsOfCar : availableSlotsOfBike;

const handleBookingAndPayment = async () => {
  if (
    !placeName ||
    !userName ||
    !phoneNumber ||
    !vehicleNumber ||
    !vehicleType 
  ) {
    toast.warning("All fields are required.");
    return;
  }

  if (!/^[1-9]\d{9}$/.test(phoneNumber)) {
    toast.error("Invalid phone number.");
    return;
  }

  

  if (currentAvailable < 1) {
    toast.info(`No available ${vehicleType.toLowerCase()} spots.`);
    return;
  }

  const amount = vehicleType === "Car" ? 100 : 50;

  try {
    const res = await fetch("/api/parking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placeName,
        userName,
        phoneNumber,
        vehicleNumber,
        vehicleType,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Booking failed");
      return;
    }

    if (vehicleType === "Car") {
      setAvailableSlotsOfCar(data.remainingSlots);
    } else {
      setAvailableSlotsOfBike(data.remainingSlots);
    }

    const paymentRes = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        bookingId: data.bookingId,
        vehicleType,
      }),
    });

    const paymentData = await paymentRes.json();

    if (paymentData.url) {
      window.location.href = paymentData.url;
    } else {
      toast.error("Failed to start payment");
    }
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  if (
    placeName.trim() &&
    (availableSlotsOfCar !== null || availableSlotsOfBike !== null)
  ) {
    handleBookingAndPayment();
  } else {
    searchVenue();
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <ToastContainer position="top-right" />
      <div className="p-6 w-full max-w-md bg-white shadow-md rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Book a Parking Spot
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter venue name"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
            />
            <button
              type="button"
              onClick={searchVenue}
              className="w-full bg-black hover:bg-red-600 text-white py-2 rounded-md mt-2 transition"
            >
              Search Venue
            </button>
          </div>

          {venueFound && (
            <>
              <p className="text-gray-700">
                Available {vehicleType} Spots:{" "}
                <span className="font-semibold">{currentAvailable}</span>
              </p>

              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength="10"
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="text"
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>

              <p className="text-sm text-gray-600">
                Fare:{" "}
                <span className="font-semibold text-black">
                  ₹{vehicleType === "Car" ? 100 : 50}
                </span>
              </p>

              <button
                type="submit"
                className="w-full bg-black hover:bg-red-600 text-white py-2 rounded-md transition"
              >
                Book & Pay
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
