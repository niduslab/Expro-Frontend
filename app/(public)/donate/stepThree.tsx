"use client";

import { CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function StepThree({
  form,
  setForm,
  setStep,
  handleSubmit,
  submitting,
}: any) {
  // bKash is the donation gateway — select it by default.
  useEffect(() => {
    if (form.payment !== "bkash") {
      setForm((prev: any) => ({ ...prev, payment: "bkash" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-gray-950 text-lg flex items-center gap-2">
        <CreditCard size={18} /> Payment Method
      </h2>

      {/* bKash option */}
      <button
        type="button"
        onClick={() => setForm({ ...form, payment: "bkash" })}
        className={`w-full rounded-xl cursor-pointer p-5 text-left transition border
          ${
            form.payment === "bkash"
              ? "bg-pink-50 border-pink-600"
              : "hover:bg-gray-50 border-slate-300"
          }`}
      >
        <div className="flex items-center gap-3">
          <span className="bg-[#e2136e] text-white rounded-lg p-2 font-bold text-sm">
            bKash
          </span>
          <div>
            <p className="font-semibold text-gray-900">Pay with bKash</p>
            <p className="text-sm text-gray-500">
              Secure mobile payment via the bKash gateway
            </p>
          </div>
        </div>
      </button>

      {/* Amount summary */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">Donation Amount</span>
        <span className="text-xl font-semibold text-green-700">
          ৳ {form.amount || 0}
        </span>
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <ShieldCheck size={14} /> You will be redirected to the secure bKash
        gateway to complete your payment.
      </p>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={submitting}
          className="px-6 py-2 border rounded-lg cursor-pointer text-gray-500 disabled:opacity-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-green-700 cursor-pointer text-white rounded-lg hover:bg-green-800 disabled:opacity-60 flex items-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Redirecting..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
