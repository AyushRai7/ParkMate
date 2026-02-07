import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      const allVenues = await prisma.venue.findMany({
        select: {
          id: true,
          name: true,
          totalCarSlots: true,
          totalBikeSlots: true,
        },
        orderBy: {
          name: 'asc'
        }
      });

      return NextResponse.json({
        success: true,
        venues: allVenues,
        count: allVenues.length
      });
    }

    const venue = await prisma.venue.findUnique({
      where: { name: name.trim() },
      include: {
        bookings: {
          where: {
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
            }
          },
          select: {
            vehicleType: true,
            status: true
          }
        }
      }
    });

    if (!venue) {      
      const allVenues = await prisma.venue.findMany({
        select: { name: true },
        take: 10
      });

      return NextResponse.json(
        {
          error: "Venue not found",
          searchedFor: name,
          availableVenues: allVenues.map(v => v.name),
          suggestion: "Please check the venue name and try again"
        },
        { status: 404 }
      );
    }

    const carBookings = venue.bookings.filter(b => b.vehicleType === "CAR").length;
    const bikeBookings = venue.bookings.filter(b => b.vehicleType === "BIKE").length;

    const availableCarSlots = venue.totalCarSlots - carBookings;
    const availableBikeSlots = venue.totalBikeSlots - bikeBookings;
    return NextResponse.json({
      success: true,
      venue: {
        id: venue.id,
        name: venue.name,
        totalCarSlots: venue.totalCarSlots,
        totalBikeSlots: venue.totalBikeSlots,
        availableCarSlots: Math.max(0, availableCarSlots),
        availableBikeSlots: Math.max(0, availableBikeSlots),
        bookedCarSlots: carBookings,
        bookedBikeSlots: bikeBookings,
      }
    });
  } catch (error: any) {
    console.error("❌ Venue search error:", error);
    return NextResponse.json(
      { 
        error: "Failed to search venue", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { search, limit = 10 } = body;

    const venues = await prisma.venue.findMany({
      where: search ? {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      } : undefined,
      select: {
        id: true,
        name: true,
        totalCarSlots: true,
        totalBikeSlots: true,
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      venues,
      count: venues.length
    });
  } catch (error: any) {
    console.error("Venue search error:", error);
    return NextResponse.json(
      { error: "Failed to search venues", details: error.message },
      { status: 500 }
    );
  }
}