import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VehicleType, BookingStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!session.user.isUser) {
      return NextResponse.json(
        { error: "You need a user account to make bookings" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    
    const body = await req.json();
    const {
      name,
      userName,
      phoneNumber,
      vehicleType,
      vehicleNumber,
    } = body;

    if (!name || !userName || !phoneNumber || !vehicleType || !vehicleNumber) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          received: { name, userName, phoneNumber, vehicleType, vehicleNumber }
        },
        { status: 400 }
      );
    }

    if (!Object.values(VehicleType).includes(vehicleType)) {
      return NextResponse.json(
        { 
          error: "Invalid vehicle type. Must be CAR or BIKE",
          received: vehicleType
        },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.findUnique({
      where: { name: name.trim() },
      include: {
        bookings: {
          where: {
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
            },
            vehicleType,
          },
        },
      },
    });

    if (!venue) {      
      const availableVenues = await prisma.venue.findMany({
        select: { name: true }
      });
      
      return NextResponse.json(
        { 
          error: "Venue not found",
          searchedFor: name,
          availableVenues: availableVenues.map(v => v.name)
        },
        { status: 404 }
      );
    }

    const totalSlots =
      vehicleType === VehicleType.CAR
        ? venue.totalCarSlots
        : venue.totalBikeSlots;

    const bookedCount = venue.bookings.length;
    if (bookedCount >= totalSlots) {
      return NextResponse.json(
        { 
          error: "No slots available",
          totalSlots,
          bookedCount,
          vehicleType
        },
        { status: 400 }
      );
    }
    
    const booking = await prisma.booking.create({
      data: {
        userId,
        venueId: venue.id,
        userName,
        phoneNumber,
        vehicleType,
        vehicleNumber,
        status: BookingStatus.PENDING,
        slotNumber: null,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), 
      },
    });
    
    return NextResponse.json(
      {
        success: true,
        bookingId: booking.id,
        message: "Booking created. Please complete payment to confirm your slot.",
        booking: {
          id: booking.id,
          venueName: venue.name,
          vehicleType: booking.vehicleType,
          status: booking.status,
          expiresAt: booking.expiresAt,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Booking error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueName = searchParams.get("venue");
    const status = searchParams.get("status");

    if (venueName) {

      const venue = await prisma.venue.findUnique({
        where: { name: venueName.trim() },
        include: {
          bookings: {
            where: {
              status: {
                in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
              }
            },
            select: {
              vehicleType: true
            }
          }
        }
      });

      if (!venue) {
        return NextResponse.json(
          { error: "Venue not found" },
          { status: 404 }
        );
      }

      const bookedCarSlots = venue.bookings.filter(b => b.vehicleType === "CAR").length;
      const bookedBikeSlots = venue.bookings.filter(b => b.vehicleType === "BIKE").length;

      const response = {
        success: true,
        venue: {
          id: venue.id,
          name: venue.name,
          totalCarSlots: venue.totalCarSlots,
          totalBikeSlots: venue.totalBikeSlots,
          bookedCarSlots,
          bookedBikeSlots,
          availableCarSlots: venue.totalCarSlots - bookedCarSlots,
          availableBikeSlots: venue.totalBikeSlots - bookedBikeSlots,
        }
      };

      return NextResponse.json(response);
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const where: any = { userId };
    if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
      where.status = status as BookingStatus;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        venue: {
          select: {
            name: true,
            totalCarSlots: true,
            totalBikeSlots: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length
    });
  } catch (error: any) {
    console.error("❌ GET booking error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
}