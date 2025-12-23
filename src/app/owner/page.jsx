"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SlidersHorizontal } from "lucide-react";

export default function Owner() {
  const [placeName, setPlaceName] = useState("");
  const [totalSlotsOfCar, setTotalSlotsOfCar] = useState("");
  const [totalSlotsOfBike, setTotalSlotsOfBike] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [ownedVenues, setOwnedVenues] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterTimeSlot, setFilterTimeSlot] = useState("");
  const [filterVenue, setFilterVenue] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchVehicleNo, setSearchVehicleNo] = useState("");


const [filterVehicles, setFilterVehicles] = useState([]);
const [filterTimeSlots, setFilterTimeSlots] = useState([]);
const [filterVenues, setFilterVenues] = useState([]);

const filteredBookings = bookings.filter((b) => {
  return (
    (filterVehicles.length === 0 || filterVehicles.includes(b.vehicleType)) &&
    (filterTimeSlots.length === 0 || filterTimeSlots.includes(b.timeSlot)) &&
    (filterVenues.length === 0 || filterVenues.includes(b.placeName)) &&
    (!searchUser || b.userName.toLowerCase().includes(searchUser.toLowerCase())) &&
    (!searchVehicleNo || b.vehicleNumber.toLowerCase().includes(searchVehicleNo.toLowerCase()))
  );
});

  // Filter bookings with both search and filter
  const toggleValue = (value, setter, current) => {
  setter(
    current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
  );
};

const removeChip = (value) => {
  setFilterVehicles((prev) => prev.filter((v) => v !== value));
  setFilterTimeSlots((prev) => prev.filter((v) => v !== value));
  setFilterVenues((prev) => prev.filter((v) => v !== value));
};

const clearAllFilters = () => {
  setFilterVehicles([]);
  setFilterTimeSlots([]);
  setFilterVenues([]);
};


  useEffect(() => {
    fetchVenues();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/booking?bookingId=${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Booking deleted!");
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting booking");
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/venues", { credentials: "include" });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Fetch failed:", errorText);
        setMessage("Failed to fetch venues.");
        return;
      }

      const data = await res.json();
      const venues = data.venues || [];
      setOwnedVenues(venues);

      const venueNames = venues.map((venue) => venue.placeName);
      if (venueNames.length > 0) {
        fetchBookings(venueNames);
      }
    } catch (error) {
      console.error("Venue Fetch Error:", error);
      setMessage("Error loading venues.");
    }
  };

  const fetchBookings = async (venueNames) => {
    try {
      const query = venueNames
        .map((name) => `venueNames[]=${encodeURIComponent(name)}`)
        .join("&");
      const res = await fetch(`/api/booking?${query}`);
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Booking Fetch Error:", error);
      toast.error("Something went wrong while fetching bookings");
    }
  };

  const addParking = async () => {
    if (!placeName || !totalSlotsOfCar || !totalSlotsOfBike) {
      setMessage("Venue name and total slots are required.");
      return;
    }
    if (parseInt(totalSlotsOfCar) <= 0 || parseInt(totalSlotsOfBike) <= 0) {
      setMessage("Total slots must be positive numbers.");
      return;
    }
    try {
      const res = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          placeName,
          totalSlotsOfCar: parseInt(totalSlotsOfCar),
          totalSlotsOfBike: parseInt(totalSlotsOfBike),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Venue added successfully!", { autoClose: 2000 });
        setPlaceName("");
        setTotalSlotsOfCar("");
        setTotalSlotsOfBike("");
        setShowForm(false);
        fetchVenues();
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to add venue. Try again later.");
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addParking();
  };

  return (
    <div className="p-3 md:p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
        <div className="flex items-center">
          <div className="flex flex-row mr-2 mb-3">
            <div className="w-1 h-8 bg-blue-900"></div>
            <div className="w-1 h-8 bg-red-600 ml-1 mt-2"></div>
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-3xl font-bold"
            style={{ fontFamily: "Raleway, sans-serif", color: "rgb(13, 14, 62)" }}
          >
            Admin Dashboard
          </h1>
        </div>
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white py-2 px-3 rounded hover:bg-red-600"
          >
            Add Venue
          </button>
        </div>
      </div>

      {/* Add Venue Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg mx-2 md:mx-4 shadow-lg rounded-lg p-4 sm:p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>

            <div className="mb-4 flex items-center">
              <div className="flex flex-row mr-2 mb-2">
                <div className="w-1 h-8 sm:h-10 bg-blue-900"></div>
                <div className="w-1 h-8 sm:h-10 bg-red-600 ml-1 mt-2"></div>
              </div>
              <h1 className="text-2xl sm:text-4xl" style={{ fontFamily: "Raleway, sans-serif", color: "rgb(13, 14, 62)" }}>
                Add Spot
              </h1>
            </div>

            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Venue Name"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Total Car Slots"
                value={totalSlotsOfCar}
                onChange={(e) => setTotalSlotsOfCar(e.target.value)}
                className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Total Bike Slots"
                value={totalSlotsOfBike}
                onChange={(e) => setTotalSlotsOfBike(e.target.value)}
                className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-black text-white w-full py-2 rounded hover:bg-red-600">
                Submit
              </button>
              {message && <p className={`mt-2 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="w-full md:w-1/2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Search by vehicle number"
          value={searchVehicleNo}
          onChange={(e) => setSearchVehicleNo(e.target.value)}
          className="w-full md:w-1/2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bookings/Table */}
      <div className="mt-2 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Bookings for Your Venues</h2>
          <button
    onClick={() => setShowFilter(!showFilter)}
    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
  >
    {showFilter ? "✕" : <SlidersHorizontal className="w-5 h-5" />}
  </button>
        </div>


{/* FILTER SECTION */}
<div className="relative flex justify-end mb-3">
  <div
    className={`absolute right-0 top-1 w-72 bg-white border rounded-xl shadow-lg p-4
      transition-all duration-300 origin-top-right
      ${showFilter
        ? "scale-100 opacity-100 translate-y-0"
        : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
      }`}
  >
    {/* <h3 className="text-lg font-semibold mb-3">Filters</h3> */}

    {/* Vehicle Type */}
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Vehicle Type</p>
      <div className="flex gap-2">
        {["Car", "Bike"].map((v) => (
          <button
            key={v}
            onClick={() =>
              toggleValue(v, setFilterVehicles, filterVehicles)
            }
            className={`px-3 py-1 rounded-full text-sm border transition
              ${filterVehicles.includes(v)
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>

    {/* Time Slot */}
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Time Slot</p>
      <div className="flex flex-wrap gap-2">
        {[
          "10 AM - 12 PM",
          "12 PM - 2 PM",
          "2 PM - 4 PM",
          "4 PM - 6 PM",
        ].map((t) => (
          <button
            key={t}
            onClick={() =>
              toggleValue(t, setFilterTimeSlots, filterTimeSlots)
            }
            className={`px-3 py-1 rounded-full text-xs border transition
              ${filterTimeSlots.includes(t)
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>

    {/* Venue */}
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Venue</p>
      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
        {ownedVenues.map((v) => (
          <button
            key={v._id}
            onClick={() =>
              toggleValue(v.placeName, setFilterVenues, filterVenues)
            }
            className={`px-3 py-1 rounded-full text-xs border transition
              ${filterVenues.includes(v.placeName)
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {v.placeName}
          </button>
        ))}
      </div>
    </div>

    {/* Clear */}
    {(filterVehicles.length > 0 ||
      filterTimeSlots.length > 0 ||
      filterVenues.length > 0) && (
      <button
        onClick={clearAllFilters}
        className="text-sm text-red-600 hover:underline"
      >
        Clear all filters
      </button>
    )}
  </div>
</div>



        {filteredBookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-left bg-white rounded shadow mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Venue</th>
                  <th className="px-4 py-2">Vehicle</th>
                  <th className="px-4 py-2">Spot</th>
                  <th className="px-4 py-2">Vehicle No.</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b, idx) => (
                  <tr key={b._id || idx} className="border-t text-xs sm:text-base">
                    <td className="px-4 py-2">{b.userName || "N/A"}</td>
                    <td className="px-4 py-2">{b.placeName}</td>
                    <td className="px-4 py-2">{b.vehicleType}</td>
                    <td className="px-4 py-2">{b.slotNumber}</td>
                    <td className="px-4 py-2">{b.vehicleNumber}</td>
                    <td className="px-4 py-2">{b.timeSlot}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteBooking(b._id)}
                        className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 text-xs sm:text-base"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
