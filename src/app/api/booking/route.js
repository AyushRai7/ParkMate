import connectDb from "@/database/connection";
import Booking from "@/model/booking";
import Parking from "@/model/parking";
import User from "@/model/user"; // Import the User model


export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // Get user ID from query params

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    // Fetch bookings for the user
    const bookings = await Booking.find({ userId });

    if (!bookings.length) {
      return new Response(JSON.stringify({ message: "No bookings found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    const { placeName, totalSlots } = body;
    if (!placeName || !totalSlots) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Ensure `totalSlots` is a number
    if (isNaN(totalSlots) || totalSlots <= 0) {
      return new Response(
        JSON.stringify({ message: "Invalid totalSlots value" }),
        { status: 400 }
      );
    }

    // Save to DB
    const newParkingSpot = new Parking({ placeName, totalSlots });
    await newParkingSpot.save();

    return new Response(
      JSON.stringify({ message: "Parking spot added successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const bookingId = url.searchParams.get("bookingId");

    if (!bookingId) {
      return new Response(
        JSON.stringify({ message: "Booking ID is required" }),
        { status: 400 }
      );
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return new Response(
        JSON.stringify({ message: "Booking not found" }),
        { status: 404 }
      );
    }

    // Restore the slots in parking
    const parking = await Parking.findById(booking.parkingId);
    if (parking) {
      parking.availableSlots += booking.spotsBooked;
      await parking.save();
    }

    // Delete the booking
    await booking.deleteOne();

    return new Response(
      JSON.stringify({ message: "Booking canceled successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
