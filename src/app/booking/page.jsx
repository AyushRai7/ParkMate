"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Booking() {
  const [placeName, setPlaceName] = useState("");
  const [spotsToBook, setSpotsToBook] = useState(1);
  const [availableSlotsOfCar, setAvailableSlotsOfCar] = useState(null);
  const [availableSlotsOfBike, setAvailableSlotsOfBike] = useState(null);
  const [totalCarSlots, setTotalCarSlots] = useState(null);
  const [totalBikeSlots, setTotalBikeSlots] = useState(null);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [timeSlot, setTimeSlot] = useState("10 AM - 12 PM");

  const router = useRouter();

  // useEffect to compute next spot using real total slots
  useEffect(() => {
    if (
      totalCarSlots !== null &&
      totalBikeSlots !== null &&
      availableSlotsOfCar !== null &&
      availableSlotsOfBike !== null
    ) {
      if (vehicleType === "Car") {
        const nextCarSpot = totalCarSlots - availableSlotsOfCar + 1;
        setSpotsToBook(nextCarSpot > 0 ? nextCarSpot : 1);
      } else if (vehicleType === "Bike") {
        const nextBikeSpot = totalBikeSlots - availableSlotsOfBike + 1;
        setSpotsToBook(nextBikeSpot > 0 ? nextBikeSpot : 1);
      }
    } else {
      setSpotsToBook(1);
    }
  }, [
    vehicleType,
    totalCarSlots,
    totalBikeSlots,
    availableSlotsOfCar,
    availableSlotsOfBike,
  ]);

  const searchvenue = async () => {
    if (!placeName.trim()) {
      toast.error("Please enter a venue name");
      return;
    }

    try {
      const res = await fetch(
        `/api/parking?placeName=${encodeURIComponent(placeName)}`
      );
      const data = await res.json();

      if (res.ok) {
        setAvailableSlotsOfCar(data.availableSlotsOfCar);
        setAvailableSlotsOfBike(data.availableSlotsOfBike);
        setTotalCarSlots(data.totalSlotsOfCar);
        setTotalBikeSlots(data.totalSlotsOfBike);
        toast.success("Venue found! Check available spots.");
      } else {
        toast.error(data.message || "Venue not found.");
        setAvailableSlotsOfCar(null);
        setAvailableSlotsOfBike(null);
        setTotalCarSlots(null);
        setTotalBikeSlots(null);
        setSpotsToBook(1);
      }
    } catch (error) {
      toast.error("Failed to fetch venue information. Try again.");
      console.error("Error:", error);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setPhoneNumber(value);
  };

  const bookSpot = async () => {
    if (
      !placeName ||
      !userName ||
      !phoneNumber ||
      !vehicleNumber ||
      !vehicleType ||
      !timeSlot
    ) {
      toast.warning("All fields are required.");
      return;
    }

    if (!/^[1-9]\d{9}$/.test(phoneNumber)) {
      toast.error("Invalid phone number.");
      return;
    }

    const currentAvailable =
      vehicleType === "Car" ? availableSlotsOfCar : availableSlotsOfBike;

    if (currentAvailable < 1) {
      toast.info(`No available ${vehicleType.toLowerCase()} spots.`);
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
        if (vehicleType === "Car") {
          setAvailableSlotsOfCar(data.remainingSlots);
        } else {
          setAvailableSlotsOfBike(data.remainingSlots);
        }

        toast.success(
          `Successfully booked P${spotsToBook}. Remaining spots: ${data.remainingSlots}`,
          { autoClose: 2000 }
        );

        setTimeout(() => {
          router.push(
            `/invoice?placeName=${placeName}&userName=${userName}&phoneNumber=${phoneNumber}&vehicleNumber=${vehicleNumber}&vehicleType=${vehicleType}&timeSlot=${timeSlot}&spotsBooked=${spotsToBook}`
          );
        }, 2000);
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } catch (error) {
      toast.error("Failed to book parking spot. Try again.");
      console.error("Error:", error);
    }
  };

  const currentAvailable =
    vehicleType === "Car" ? availableSlotsOfCar : availableSlotsOfBike;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      placeName.trim() &&
      (availableSlotsOfCar !== null || availableSlotsOfBike !== null)
    ) {
      bookSpot();
    } else {
      searchvenue();
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
            <h1
              className="text-3xl mb-4"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              Book a Parking Spot
            </h1>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter venue name"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              type="button"
              onClick={searchvenue}
              className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-3"
            >
              Search venue
            </button>
          </div>

          {currentAvailable !== null && (
            <div>
              <p className="mb-2">
                Available {vehicleType} Spots:{" "}
                <span className="font-semibold">{currentAvailable}</span>
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
                type="submit"
                className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-3"
              >
                Book Spot
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
