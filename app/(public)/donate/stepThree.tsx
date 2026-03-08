"use client";

import {
  Banknote,
  Smartphone,
  CreditCard,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function StepThree({
  form,
  setForm,
  setStep,
  handleChange,
  handleSubmit,
}: any) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied! `);
  };
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-gray-950 text-lg flex items-center gap-2">
        <CreditCard size={18} /> Payment Method
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* bKash */}
        <button
          onClick={() => setForm({ ...form, payment: "bKash" })}
          className={`rounded-xl p-4 text-center transition
            ${
              form.payment === "bKash"
                ? "bg-green-700 text-white border border-green-700"
                : "hover:bg-gray-100 text-gray-600 border border-slate-300"
            }`}
        >
          <Smartphone className="mx-auto mb-2" />
          bKash
        </button>

        {/* BANK */}
        <button
          onClick={() => setForm({ ...form, payment: "Bank" })}
          className={`border rounded-xl p-4 text-center transition
            ${
              form.payment === "Bank"
                ? "bg-green-700 text-white border border-green-700"
                : "hover:bg-gray-100 text-gray-600 border border-slate-300"
            }`}
        >
          <Banknote className="mx-auto mb-2" />
          Bank Transfer
        </button>
      </div>

      {form.payment === "bKash" && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex pb-1 items-center justify-between">
            <p className="text-xs text-gray-500 mb-1">Send Money To</p>
            <button
              onClick={() => copyToClipboard("01339321781", "bKash number")}
              className="text-gray-500 hover:text-green-700"
              title="Copy Account Number"
            >
              <Copy size={14} />
            </button>
          </div>
          <p className="text-xl font-semibold text-green-700">01339-321781</p>
          {copied && (
            <div className="flex items-center gap-2 mt-2">
              {" "}
              <p className="text-sm  text-slate-500 ">Bkash number copied. </p>
              <CheckCircle size={14} className="text-green-500" />
            </div>
          )}
        </div>
      )}

      {form.payment === "Bank" && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bank Account Details
          </h3>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Account Name</p>
            <p className="text-xl font-semibold text-green-700">
              EWF Project Humanity
            </p>
          </div>

          <div className="flex flex-col justify-between w-full sm:flex-row gap-2 ">
            {/* Account Number with copy */}
            <div className="bg-gray-50 w-1/2 rounded-xl p-4 border border-gray-200 flex justify-between items-center">
              <div className="flex flex-col w-full">
                <div className="flex pb-1 w-full items-center justify-between">
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <button
                    onClick={() =>
                      copyToClipboard("0602302000494", "Account number")
                    }
                    className="text-gray-500 hover:text-green-700"
                    title="Copy Account Number"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <div className="flex w-1/2">
                  {" "}
                  <p className="text-xl font-semibold text-green-700">
                    0602302000494
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Name */}
            <div className="bg-gray-50 w-1/2 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Bank</p>
              <p className="text-xl font-semibold text-green-700">
                Sonali Bank PLC
              </p>
            </div>
          </div>

          {copied && (
            <div className="flex items-center gap-2 mt-2">
              {" "}
              <p className="text-sm  text-slate-500 ">
                Account number copied.{" "}
              </p>
              <CheckCircle size={14} className="text-green-500" />
            </div>
          )}
        </div>
      )}

      <input
        type="text"
        name="transactionId"
        placeholder="Transaction ID"
        value={form.transactionId}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 text-gray-500 border-slate-300"
      />

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2 border rounded-lg text-gray-500"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-700"
        >
          Complete Donation
        </button>
      </div>
    </div>
  );
}
