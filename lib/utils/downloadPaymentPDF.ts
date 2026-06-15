import jsPDF from "jspdf";

export interface PaymentPDFData {
  transactionId: string;
  type: "credit" | "debit";
  category: string;
  amount: string | number;
  balanceBefore?: string | number;
  balanceAfter?: string | number;
  status: string;
  description?: string | null;
  notes?: string | null;
  createdAt: string;
  processedAt?: string | null;
  memberName?: string;
  memberId?: string;
  memberEmail?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  membership_fee: "Membership Fee",
  pension_installment: "Pension Installment",
  joining_commission: "Joining Commission",
  installment_commission: "Installment Commission",
  team_commission: "Team Commission",
  executive_commission: "Executive Commission",
  refund: "Refund",
  adjustment: "Adjustment",
  transfer_in: "Transfer In",
  transfer_out: "Transfer Out",
  renewal_fee: "Renewal Fee",
};

function fmt(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return "—";
  return parseFloat(String(v)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(d: string | undefined | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function downloadPaymentPDF(data: PaymentPDFData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = pageW - margin * 2;

  // ── Header bar ──────────────────────────────────────────────
  doc.setFillColor(6, 136, 71); // #068847
  doc.rect(0, 0, pageW, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Expro", margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Payment Receipt", margin, 24);
  doc.text("expro.com.bd", pageW - margin, 16, { align: "right" });
  doc.text("info@expro.com.bd", pageW - margin, 24, { align: "right" });

  // ── Status badge area ────────────────────────────────────────
  const status = data.status.toLowerCase();
  const statusColor =
    status === "completed" ? [22, 163, 74] :
    status === "pending"   ? [217, 119, 6]  :
    status === "failed"    ? [220, 38, 38]  :
                             [107, 114, 128];

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageW - margin - 36, 10, 36, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(
    data.status.charAt(0).toUpperCase() + data.status.slice(1),
    pageW - margin - 18,
    16.5,
    { align: "center" }
  );

  let y = 50;

  // ── Receipt title + transaction ID ──────────────────────────
  doc.setTextColor(3, 7, 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Transaction Receipt", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(`Transaction ID: ${data.transactionId}`, margin, y);
  doc.text(`Generated: ${fmtDate(new Date().toISOString())}`, pageW - margin, y, { align: "right" });
  y += 10;

  // ── Divider ──────────────────────────────────────────────────
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Amount hero ──────────────────────────────────────────────
  const isCredit = data.type === "credit";
  doc.setFillColor(isCredit ? 240 : 254, isCredit ? 253 : 242, isCredit ? 244 : 242);
  doc.roundedRect(margin, y, contentW, 28, 4, 4, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(isCredit ? "Amount Credited" : "Amount Debited", margin + 8, y + 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(isCredit ? 22 : 220, isCredit ? 163 : 38, isCredit ? 74 : 38);
  doc.text(
    `${isCredit ? "+" : "-"} BDT ${fmt(data.amount)}`,
    margin + 8,
    y + 22
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(
    CATEGORY_LABELS[data.category] || data.category,
    pageW - margin - 8,
    y + 15,
    { align: "right" }
  );
  y += 36;

  // ── Detail rows helper ───────────────────────────────────────
  const drawRow = (label: string, value: string, highlight = false) => {
    if (highlight) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y - 4, contentW, 10, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(label, margin + 4, y + 2);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(3, 7, 18);
    doc.text(value, pageW - margin - 4, y + 2, { align: "right" });
    y += 10;
    doc.setDrawColor(243, 244, 246);
    doc.setLineWidth(0.2);
    doc.line(margin, y - 2, pageW - margin, y - 2);
  };

  // ── Section: Payment Details ─────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(3, 7, 18);
  doc.text("Payment Details", margin, y);
  y += 7;

  drawRow("Transaction ID", data.transactionId, true);
  drawRow("Type", isCredit ? "Credit" : "Debit", false);
  drawRow("Category", CATEGORY_LABELS[data.category] || data.category, true);
  drawRow("Status", data.status.charAt(0).toUpperCase() + data.status.slice(1), false);
  drawRow("Date & Time", fmtDate(data.createdAt), true);
  if (data.processedAt) {
    drawRow("Processed At", fmtDate(data.processedAt), false);
  }
  y += 4;

  // ── Section: Balance Info ────────────────────────────────────
  if (data.balanceBefore !== undefined || data.balanceAfter !== undefined) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(3, 7, 18);
    doc.text("Balance Information", margin, y);
    y += 7;

    if (data.balanceBefore !== undefined) {
      drawRow("Balance Before", `BDT ${fmt(data.balanceBefore)}`, true);
    }
    drawRow("Amount", `${isCredit ? "+" : "-"} BDT ${fmt(data.amount)}`, false);
    if (data.balanceAfter !== undefined) {
      drawRow("Balance After", `BDT ${fmt(data.balanceAfter)}`, true);
    }
    y += 4;
  }

  // ── Section: Member Info (if provided) ──────────────────────
  if (data.memberName || data.memberId || data.memberEmail) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(3, 7, 18);
    doc.text("Member Information", margin, y);
    y += 7;

    if (data.memberName) drawRow("Name", data.memberName, true);
    if (data.memberId)   drawRow("Member ID", data.memberId, false);
    if (data.memberEmail) drawRow("Email", data.memberEmail, true);
    y += 4;
  }

  // ── Description / Notes ──────────────────────────────────────
  if (data.description) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(3, 7, 18);
    doc.text("Description", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    const lines = doc.splitTextToSize(data.description, contentW - 8);
    doc.text(lines, margin + 4, y);
    y += lines.length * 5 + 6;
  }

  // ── Footer ───────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageW - margin, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(
    "This is a system-generated receipt. For queries, contact support@expro.com.bd",
    pageW / 2,
    footerY + 6,
    { align: "center" }
  );
  doc.text(
    `Expro  ·  expro.com.bd  ·  Page 1 of 1`,
    pageW / 2,
    footerY + 12,
    { align: "center" }
  );

  // ── Save ─────────────────────────────────────────────────────
  const fileName = `expro-receipt-${data.transactionId.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
}
