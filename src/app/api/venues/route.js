import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Venue from "@/model/parking";
import connectDb from "@/database/connection";

export async function POST(req) {
  try {
    await connectDb();
    const cookieStore = cookies();
    const token = cookieStore.get("ownerToken")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { placeName, totalSlotsOfCar, totalSlotsOfBike } = await req.json();

    const newVenue = new Venue({
      placeName,
      totalSlotsOfCar,
      totalSlotsOfBike,
      ownerId: decoded.id,
    });

    await newVenue.save();

    return new Response(JSON.stringify({ message: "Venue created", venue: newVenue }), {
      status: 201,
    });
  } catch (error) {
    console.error("POST Venue Error:", error.message);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDb();
    const cookieStore = await cookies();
    const token = cookieStore.get("ownerToken")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const venues = await Venue.find({ ownerId: decoded.id });

    return new Response(JSON.stringify({ venues }), {
      status: 200,
    });
  } catch (error) {
    console.error("GET Venue Error:", error.message);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
