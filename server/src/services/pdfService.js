
import { PDFDocument } from "pdfkit";

export const generateReceiptPDF = (receipt, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 55 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${receipt.receiptNumber.replaceAll("/", "-")}.pdf"`
  );

  doc.pipe(res);

  doc.fontSize(22).text("DONATION RECEIPT", { align: "center" });
  doc.moveDown();

  doc.fontSize(11).text("NGO DONATION PLATFORM", { align: "center" });
  doc.text("Demo receipt — replace with verified Trust details", {
    align: "center",
  });

  doc.moveDown(2);
  doc.fontSize(12);

  const line = (label, value) => {
    doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
    doc.font("Helvetica").text(String(value ?? "Not provided"));
    doc.moveDown(0.7);
  };

  line("Receipt Number", receipt.receiptNumber);
  line("Date", new Date(receipt.issuedAt).toLocaleDateString("en-IN"));
  line("Donor Name", receipt.donorName);
  line("Donor PAN", receipt.donorPan || "Not provided");
  line("Donation Amount", `INR ${receipt.amount.toLocaleString("en-IN")}`);
  line("Payment Reference", receipt.paymentReference);
  line("Financial Year", receipt.financialYear);

  doc.moveDown(2);
  doc.fontSize(10).text(
    "This document is a demo donation receipt. It is not a valid 80G tax exemption certificate. Official 80G details and declarations must be added and verified by the Trust before issuing statutory certificates.",
    { align: "justify" }
  );

  doc.moveDown(2);
  doc.text("Thank you for your contribution.", { align: "center" });

  doc.end();
};
