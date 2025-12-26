import connectDb from "@/database/connection";
import Booking from "@/model/booking";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid booking ID" },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return Response.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return Response.json(booking, { status: 200 });
  } catch (err) {
    console.error("GET /booking/[id] error:", err);
    return Response.json(
      { message: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
