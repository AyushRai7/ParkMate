import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

interface BookingDetails {
  _id: string;
  userName: string;
  placeName: string;
  vehicleType: "Car" | "Bike";
  vehicleNumber: string;
  timeSlot: string;
  spotsToBook: number;
}

const generateInvoice = (bookingDetails: BookingDetails): string => {
  const doc = new PDFDocument();

  // Load custom font
  const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSans.ttf");
  doc.registerFont("CustomFont", fontPath);
  doc.font("CustomFont");

  // Ensure invoices folder exists
  const invoiceDir = path.join(process.cwd(), "public", "invoices");
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const invoiceFileName = `invoice_${bookingDetails._id}.pdf`;
  const invoicePath = path.join(invoiceDir, invoiceFileName);

  doc.pipe(fs.createWriteStream(invoicePath));

  // Invoice content
  doc.fontSize(18).text("Parking Invoice", { underline: true });
  doc.moveDown();

  doc.fontSize(12).text(`User: ${bookingDetails.userName}`);
  doc.text(`Mall: ${bookingDetails.placeName}`);
  doc.text(
    `Vehicle: ${bookingDetails.vehicleType} - ${bookingDetails.vehicleNumber}`
  );
  doc.text(`Time Slot: ${bookingDetails.timeSlot}`);
  doc.text(`Spots Booked: ${bookingDetails.spotsToBook}`);

  doc.end();

  return `/invoices/${invoiceFileName}`;
};



export default generateInvoice;
