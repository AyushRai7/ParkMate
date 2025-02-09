import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

// Function to generate invoice PDF
const generateInvoice = (bookingDetails) => {
  const doc = new PDFDocument();

  // Load a custom font instead of built-in fonts
  const fontPath = path.resolve(__dirname, "../public/fonts/NotoSans.ttf");
  doc.registerFont("CustomFont", fontPath);
  doc.font("CustomFont");

  // Ensure invoices folder exists
  const invoiceDir = path.join(process.cwd(), "public", "invoices");
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const invoicePath = path.join(invoiceDir, `invoice_${bookingDetails._id}.pdf`);
  doc.pipe(fs.createWriteStream(invoicePath));

  // Invoice content
  doc.text(`Parking Invoice`);
  doc.text(`User: ${bookingDetails.userName}`);
  doc.text(`Mall: ${bookingDetails.placeName}`);
  doc.text(`Vehicle: ${bookingDetails.vehicleType} - ${bookingDetails.vehicleNumber}`);
  doc.text(`Time Slot: ${bookingDetails.timeSlot}`);
  doc.text(`Spots Booked: ${bookingDetails.spotsToBook}`);

  doc.end();

  return `/invoices/invoice_${bookingDetails._id}.pdf`;
};

export default generateInvoice;
