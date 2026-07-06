(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,361277,t=>{"use strict";let e=(0,t.i(475254).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);t.s(["default",0,e])},87316,t=>{"use strict";var e=t.i(361277);t.s(["Calendar",()=>e.default])},107233,t=>{"use strict";let e=(0,t.i(475254).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);t.s(["Plus",0,e],107233)},871689,t=>{"use strict";let e=(0,t.i(475254).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);t.s(["ArrowLeft",0,e],871689)},484023,t=>{"use strict";let e=(0,t.i(475254).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);t.s(["default",0,e])},440160,t=>{"use strict";var e=t.i(484023);t.s(["Download",()=>e.default])},561659,t=>{"use strict";let e=(0,t.i(475254).default)("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);t.s(["CreditCard",0,e],561659)},455607,t=>{"use strict";let e=(0,t.i(475254).default)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);t.s(["default",0,e])},346897,t=>{"use strict";var e=t.i(455607);t.s(["MapPin",()=>e.default])},343432,t=>{"use strict";let e=(0,t.i(475254).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);t.s(["Phone",0,e],343432)},688511,t=>{"use strict";let e=(0,t.i(475254).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);t.s(["Edit",0,e],688511)},103505,t=>{"use strict";t.s(["downloadInvoice",0,function(t){let e,a,i,o=(e=new Date().toLocaleString(),a=t.title||"PAYMENT INVOICE",i=t.member,`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${t.invoiceNo}</title>
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
        <h1>${a}</h1>
        <p>Issued: ${e}</p>
      </div>
    </div>

    <div class="parties">
      <div>
        <h3>Billed To</h3>
        <p><strong>${i.name||"Member"}</strong></p>
        <p>Member ID: ${i.memberId||"—"}</p>
        <p>Mobile: ${i.mobile||"—"}</p>
        ${i.email?`<p>Email: ${i.email}</p>`:""}
      </div>
      <div style="text-align:right">
        <h3>Payment Reference</h3>
        <p><strong>${t.invoiceNo}</strong></p>
        <p>${t.paidAt||"—"}</p>
      </div>
    </div>

    <table>
      ${t.rows.map(([t,e])=>`<tr><td class="k">${t}</td><td class="v">${e}</td></tr>`).join("")}
    </table>

    <table class="totals">
      <tr><td class="k">${t.amountLabel||"Amount"}</td><td class="v">${t.amount}</td></tr>
      ${t.charges?`<tr><td class="k">${t.chargesLabel||"Charges / Fees"}</td><td class="v">${t.charges}</td></tr>`:""}
      <tr class="grand"><td>${t.totalLabel||"Total Paid"}</td><td style="text-align:right">${t.total}</td></tr>
    </table>

    <div class="foot">
      This is a system-generated invoice and does not require a signature.<br/>
      Expro Welfare Foundation
    </div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };</script>
</body>
</html>`),r=window.open("","_blank","width=820,height=900");if(!r){let e=new Blob([o],{type:"text/html"}),a=URL.createObjectURL(e),i=document.createElement("a");i.href=a,i.download=`invoice-${t.invoiceNo}.html`,i.click(),URL.revokeObjectURL(a);return}r.document.open(),r.document.write(o),r.document.close()},"formatBdt",0,t=>`৳${parseFloat(t??0).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,"formatDateTime",0,t=>{if(!t)return"—";let e=new Date(t);return isNaN(e.getTime())?"—":e.toLocaleString()},"titleCase",0,t=>String(t??"").replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())])}]);