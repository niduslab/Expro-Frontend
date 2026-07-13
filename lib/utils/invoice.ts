// Shared client-side invoice generator.
// Builds a styled, print-ready invoice and opens it in a new window
// (auto-triggering the print dialog so the user can Save as PDF).
// Falls back to downloading an .html file if popups are blocked.

export interface InvoiceMember {
  name?: string;
  memberId?: string;
  mobile?: string;
  email?: string;
}

export interface InvoiceData {
  title?: string; // e.g. "PAYMENT INVOICE"
  invoiceNo: string;
  paidAt?: string; // human-readable
  member: InvoiceMember;
  rows: Array<[string, string]>; // detail rows
  amountLabel?: string;
  amount: string; // formatted, e.g. "৳1,200.00"
  chargesLabel?: string;
  charges?: string; // formatted
  totalLabel?: string;
  total: string; // formatted
}

export const formatBdt = (value: any) =>
  `৳${parseFloat(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const titleCase = (value: any) =>
  String(value ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const formatDateTime = (value: any) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

function buildInvoiceHtml(data: InvoiceData): string {
  const issuedAt = new Date().toLocaleString();
  const title = data.title || "PAYMENT INVOICE";
  const m = data.member;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${data.invoiceNo}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111827; margin: 0; padding: 40px; }
  .sheet { max-width: 720px; margin: 0 auto; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #068847; padding-bottom: 16px; }
  .brand { font-size: 26px; font-weight: 800; color: #068847; letter-spacing: 1px; }
  .brand small { display:block; font-size: 12px; font-weight: 500; color:#6B7280; letter-spacing: 0; }
  .doc-title { text-align: right; }
  .doc-title h1 { margin: 0; font-size: 22px; color:#111827; }
  .doc-title p { margin: 4px 0 0; font-size: 12px; color:#6B7280; }
  .parties { display:flex; justify-content: space-between; margin: 28px 0; gap: 24px; }
  .parties h3 { font-size: 12px; text-transform: uppercase; color:#6B7280; margin:0 0 6px; letter-spacing: .5px; }
  .parties p { margin: 2px 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  td { padding: 9px 12px; font-size: 13px; border-bottom: 1px solid #F3F4F6; }
  td.k { color:#6B7280; width: 45%; }
  td.v { font-weight: 600; text-align: right; }
  .totals { margin-top: 24px; border-top: 2px solid #E5E7EB; }
  .totals td { border: none; padding: 6px 12px; }
  .totals .grand td { font-size: 18px; font-weight: 800; color:#068847; border-top: 1px solid #E5E7EB; padding-top: 12px; }
  .foot { margin-top: 40px; text-align:center; font-size: 11px; color:#9CA3AF; border-top: 1px solid #F3F4F6; padding-top: 16px; }
  @media print { body { padding: 0; } .noprint { display: none; } }
  .noprint { text-align:center; margin-bottom: 24px; }
  .btn { background:#068847; color:#fff; border:none; padding:10px 22px; border-radius:8px; font-size:14px; cursor:pointer; }
</style>
</head>
<body>
  <div class="noprint">
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="sheet">
    <div class="head">
      <div class="brand">EXPRO<small>Welfare Foundation</small></div>
      <div class="doc-title">
        <h1>${title}</h1>
        <p>Issued: ${issuedAt}</p>
      </div>
    </div>

    <div class="parties">
      <div>
        <h3>Billed To</h3>
        <p><strong>${m.name || "Member"}</strong></p>
        <p>Member ID: ${m.memberId || "—"}</p>
        <p>Mobile: ${m.mobile || "—"}</p>
        ${m.email ? `<p>Email: ${m.email}</p>` : ""}
      </div>
      <div style="text-align:right">
        <h3>Payment Reference</h3>
        <p><strong>${data.invoiceNo}</strong></p>
        <p>${data.paidAt || "—"}</p>
      </div>
    </div>

    <table>
      ${data.rows.map(([k, v]) => `<tr><td class="k">${k}</td><td class="v">${v}</td></tr>`).join("")}
    </table>

    <table class="totals">
      <tr><td class="k">${data.amountLabel || "Amount"}</td><td class="v">${data.amount}</td></tr>
      ${data.charges ? `<tr><td class="k">${data.chargesLabel || "Charges / Fees"}</td><td class="v">${data.charges}</td></tr>` : ""}
      <tr class="grand"><td>${data.totalLabel || "Total Paid"}</td><td style="text-align:right">${data.total}</td></tr>
    </table>

    <div class="foot">
      This is a system-generated invoice and does not require a signature.<br/>
      Expro Welfare Foundation
    </div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };</script>
</body>
</html>`;
}

export function downloadInvoice(data: InvoiceData): void {
  const html = buildInvoiceHtml(data);
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) {
    // Popup blocked – fall back to downloading the HTML file
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${data.invoiceNo}.html`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
