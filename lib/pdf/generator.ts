import jsPDF from "jspdf";

export interface PDFNoticeData {
  title: string;
  senderName: string;
  senderAddress: string;
  senderPhone?: string;
  senderEmail?: string;
  recipientName: string;
  recipientDesignation?: string;
  recipientCompany?: string;
  recipientAddress: string;
  jurisdiction?: string;
  date: string;
  amountInvolved?: string;
  disputeDescription: string;
  legalBasis: string;
  reliefRequested: string;
  deadlineDays: number;
  fullDraftText?: string;
  timelineEvents?: {date: string, description: string}[];
}

/**
 * Client-side utility to generate and download a professional legal notice PDF.
 * Formatted cleanly with proper jurisdiction awareness and lawful compliance language.
 */
export function generateLegalNoticePDF(data: PDFNoticeData, filename = "Legal_Demand_Notice.pdf"): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let cursorY = 20;

  // Header Banner
  doc.setFillColor(10, 17, 40); // Deep Navy
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFillColor(197, 160, 89); // Gold accent line
  doc.rect(0, 28, pageWidth, 2, "F");

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("FORMAL LEGAL DEMAND NOTICE (DRAFT)", pageWidth / 2, 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(212, 178, 111); // Soft Gold
  doc.text("PREPARED UNDER APPLICABLE INDIAN LAWS & STATUTES", pageWidth / 2, 21, { align: "center" });

  cursorY = 38;

  // Metadata row (Mode, Jurisdiction & Date)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("MODE: SPEED POST A.D. / REGISTERED EMAIL", margin, cursorY);
  if (data.jurisdiction) {
    doc.text(`JURISDICTION: ${data.jurisdiction.toUpperCase()}`, margin + contentWidth * 0.42, cursorY);
  }
  doc.text(`DATE: ${data.date || new Date().toLocaleDateString("en-IN")}`, pageWidth - margin, cursorY, { align: "right" });

  cursorY += 8;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);

  cursorY += 8;

  // Parties Section
  // RECIPIENT (TO)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(10, 17, 40);
  doc.text("TO (OPPOSITE PARTY):", margin, cursorY);
  cursorY += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(data.recipientName, margin, cursorY);
  cursorY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  if (data.recipientDesignation || data.recipientCompany) {
    const org = [data.recipientDesignation, data.recipientCompany].filter(Boolean).join(", ");
    doc.text(org, margin, cursorY);
    cursorY += 4.5;
  }

  const recipientLines = doc.splitTextToSize(data.recipientAddress, contentWidth * 0.45);
  doc.text(recipientLines, margin, cursorY);

  // SENDER (FROM) - on the right column
  const rightColX = margin + contentWidth * 0.52;
  let senderY = cursorY - (data.recipientDesignation || data.recipientCompany ? 14 : 9.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(10, 17, 40);
  doc.text("FROM (SENDER / CITIZEN):", rightColX, senderY);
  senderY += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(data.senderName, rightColX, senderY);
  senderY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const senderLines = doc.splitTextToSize(data.senderAddress, contentWidth * 0.45);
  doc.text(senderLines, rightColX, senderY);
  senderY += senderLines.length * 4.5;

  if (data.senderPhone || data.senderEmail) {
    const contactInfo = [data.senderPhone, data.senderEmail].filter(Boolean).join(" | ");
    doc.text(contactInfo, rightColX, senderY);
  }

  cursorY = Math.max(cursorY + recipientLines.length * 4.5, senderY) + 8;

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 7;

  // Subject line
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, cursorY, contentWidth, 12, "F");
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, cursorY, contentWidth, 12, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(10, 17, 40);
  const subject = `SUBJECT: NOTICE IN THE MATTER OF ${data.title.toUpperCase()}${data.amountInvolved ? ` - DEMAND FOR ${data.amountInvolved}` : ""}`;
  const subjectWrapped = doc.splitTextToSize(subject, contentWidth - 6);
  doc.text(subjectWrapped, margin + 3, cursorY + 5);

  cursorY += 18;

  // Full body content or structured sections
  const checkNewPage = (addedHeight: number) => {
    if (cursorY + addedHeight > pageHeight - 25) {
      doc.addPage();
      cursorY = 25;
    }
  };

  const addSection = (heading: string, bodyText: string) => {
    checkNewPage(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(10, 17, 40);
    doc.text(heading, margin, cursorY);
    cursorY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitLines = doc.splitTextToSize(bodyText, contentWidth);

    for (let i = 0; i < splitLines.length; i++) {
      checkNewPage(5);
      doc.text(splitLines[i], margin, cursorY);
      cursorY += 4.5;
    }
    cursorY += 4;
  };

  addSection("1. BACKGROUND FACTS & GRIEVANCE:", data.disputeDescription);
  
  if (data.timelineEvents && data.timelineEvents.length > 0) {
    const timelineStr = data.timelineEvents.map((e, i) => `${i + 1}. ${e.date}: ${e.description}`).join("\n");
    addSection("2. CHRONOLOGICAL TIMELINE OF EVENTS:", timelineStr);
    addSection("3. STATUTORY BASIS & APPLICABLE LAWS:", data.legalBasis);
    addSection("4. SPECIFIC RELIEF / ACTION SOUGHT:", data.reliefRequested);
    addSection(
      "5. MANDATORY COMPLIANCE TIMELINE:",
      `You are requested to address and satisfy the demands set forth above within ${data.deadlineDays} days of receipt of this notice, failing which the Sender reserves the full legal right to initiate appropriate civil or consumer legal proceedings before the competent court or forum having jurisdiction, entirely at your risk and legal consequences.`
    );
  } else {
    addSection("2. STATUTORY BASIS & APPLICABLE LAWS:", data.legalBasis);
    addSection("3. SPECIFIC RELIEF / ACTION SOUGHT:", data.reliefRequested);
    addSection(
      "4. MANDATORY COMPLIANCE TIMELINE:",
      `You are requested to address and satisfy the demands set forth above within ${data.deadlineDays} days of receipt of this notice, failing which the Sender reserves the full legal right to initiate appropriate civil or consumer legal proceedings before the competent court or forum having jurisdiction, entirely at your risk and legal consequences.`
    );
  }


  // Signoff Block
  checkNewPage(30);
  cursorY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Yours faithfully,", margin, cursorY);
  cursorY += 12;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 17, 40);
  doc.text(data.senderName, margin, cursorY);
  cursorY += 4.5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Aggrieved Citizen / Complainant", margin, cursorY);

  cursorY += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Disclaimer: General drafting assistance only. Not a substitute for a qualified advocate.", margin, cursorY);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Generated via Nyay Mitra AI Civic Legal Technology Platform | Page " + i + " of " + totalPages,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save(filename);
}
