import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadInvoice, getInvoiceDownloadUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, pdfBase64 } = await req.json();

    if (!bookingId || !pdfBase64) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { invoiceKey: true, userId: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.invoiceKey) {
      const url = await getInvoiceDownloadUrl(booking.invoiceKey);
      return NextResponse.json({ url });
    }

    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const s3Key = await uploadInvoice(bookingId, pdfBuffer);

    await prisma.booking.update({
      where: { id: bookingId },
      data: { invoiceKey: s3Key },
    });

    const url = await getInvoiceDownloadUrl(s3Key);
    return NextResponse.json({ url });

  } catch (error) {
    console.error("Invoice upload error:", error);
    return NextResponse.json({ error: "Failed to upload invoice" }, { status: 500 });
  }
}