import connectDb from "@/database/connection";
import Booking from "@/model/booking";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid booking ID" },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (err) {
    console.error("GET /booking/[id] error:", err);
    return NextResponse.json(
      { message: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
