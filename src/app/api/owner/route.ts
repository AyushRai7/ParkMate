import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth-utils";
import { BookingStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { response, owner } = await requireOwner(req);
    if (response) return response;

    const ownerId = owner!.id;
    const { searchParams } = new URL(req.url);
    const venue = searchParams.get("venue");
    const statusParam = searchParams.get("status");

    const status =
      statusParam &&
      Object.values(BookingStatus).includes(statusParam as BookingStatus)
        ? (statusParam as BookingStatus)
        : undefined;

    // Fetch bookings
    const bookings = await prisma.booking.findMany({
      where: {
        venue: {
          ownerId,
          ...(venue && {
            name: { contains: venue, mode: "insensitive" },
          }),
        },
        ...(status && { status }),
      },
      include: {
        venue: { 
          select: { 
            name: true, 
            totalCarSlots: true,
            totalBikeSlots: true 
          } 
        },
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch venues
    const venues = await prisma.venue.findMany({
      where: { ownerId },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: { in: ["PENDING", "CONFIRMED"] }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const stats = {
      totalVenues: venues.length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter(b => 
        b.status === "CONFIRMED" || b.status === "PENDING"
      ).length,
    };

    return NextResponse.json({ 
      success: true,
      bookings, 
      venues,
      stats 
    });
  } catch (err: any) {
    console.error("Owner GET error:", err);
    return NextResponse.json(
      { error: "Failed to load owner data", details: err.message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { response, owner } = await requireOwner(req);
    if (response) return response;

    const ownerId = owner!.id;
    const body = await req.json();
    const { name, totalCarSlots, totalBikeSlots } = body;

    if (!name || totalCarSlots === undefined || totalBikeSlots === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, totalCarSlots, totalBikeSlots" },
        { status: 400 }
      );
    }

    const carSlots = parseInt(totalCarSlots);
    const bikeSlots = parseInt(totalBikeSlots);

    if (isNaN(carSlots) || isNaN(bikeSlots) || carSlots < 0 || bikeSlots < 0) {
      return NextResponse.json(
        { error: "Slot counts must be valid non-negative numbers" },
        { status: 400 }
      );
    }

    const existing = await prisma.venue.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A venue with this name already exists" },
        { status: 409 }
      );
    }

    const venue = await prisma.venue.create({
      data: {
        name: name.trim(),
        totalCarSlots: carSlots,
        totalBikeSlots: bikeSlots,
        ownerId,
      },
    });

    return NextResponse.json({ 
      success: true, 
      venue,
      message: "Venue created successfully"
    }, { status: 201 });
  } catch (err: any) {
    console.error("Owner POST error:", err);
    return NextResponse.json(
      { error: "Failed to add venue", details: err.message },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { response, owner } = await requireOwner(req);
    if (response) return response;

    const ownerId = owner!.id;
    const { id, name, totalCarSlots, totalBikeSlots } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Venue ID is required" },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.findFirst({
      where: { id, ownerId },
    });

    if (!venue) {
      return NextResponse.json(
        { error: "Venue not found or you don't have permission" },
        { status: 404 }
      );
    }

    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(totalCarSlots !== undefined && { totalCarSlots: parseInt(totalCarSlots) }),
        ...(totalBikeSlots !== undefined && { totalBikeSlots: parseInt(totalBikeSlots) }),
      },
    });

    return NextResponse.json({ 
      success: true, 
      venue: updatedVenue,
      message: "Venue updated successfully"
    });
  } catch (err: any) {
    console.error("Owner PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update venue", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { response, owner } = await requireOwner(req);
    if (response) return response;

    const ownerId = owner!.id;
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    const venueId = searchParams.get("venueId");

    if (bookingId) {
      // Delete booking
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { venue: true },
      });

      if (!booking || booking.venue.ownerId !== ownerId) {
        return NextResponse.json(
          { error: "Booking not found or you don't have permission" },
          { status: 403 }
        );
      }

      await prisma.booking.delete({ where: { id: bookingId } });

      return NextResponse.json({ 
        success: true,
        message: "Booking deleted successfully" 
      });
    }

    if (venueId) {
      const venue = await prisma.venue.findFirst({
        where: { id: venueId, ownerId },
        include: {
          _count: { select: { bookings: true } }
        }
      });

      if (!venue) {
        return NextResponse.json(
          { error: "Venue not found or you don't have permission" },
          { status: 404 }
        );
      }

      if (venue._count.bookings > 0) {
        return NextResponse.json(
          { error: "Cannot delete venue with existing bookings" },
          { status: 400 }
        );
      }

      await prisma.venue.delete({ where: { id: venueId } });

      return NextResponse.json({ 
        success: true,
        message: "Venue deleted successfully" 
      });
    }

    return NextResponse.json(
      { error: "Either bookingId or venueId is required" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Owner DELETE error:", err);
    return NextResponse.json(
      { error: "Delete operation failed", details: err.message },
      { status: 500 }
    );
  }
}