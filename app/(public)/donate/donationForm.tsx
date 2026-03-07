"use client";

import React, { useState } from "react";
import {
  Heart,
  HandHelping,
  GraduationCap,
  Leaf,
  Activity,
  Home,
  Banknote,
  Smartphone,
  CreditCard,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import Stepper from "@/components/ui/stepper";

const Donationform = () => {
  const [step, setStep] = useState(1);

  const initialForm = {
    amount: 0,
    cause: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    payment: "",
    transactionId: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const amounts = [500, 1000, 2000, 5000];

  const causes = [
    { name: "Orphan Welfare", icon: Heart },
    { name: "Education", icon: GraduationCap },
    { name: "Disaster Relief", icon: HandHelping },
    { name: "Healthcare", icon: Activity },
    { name: "Environment", icon: Leaf },
    { name: "Community", icon: Home },
  ];

  const handleSubmit = () => {
    toast.success("Donation completed successfully ");

    setForm(initialForm);
    setStep(1);
  };

  return (
    <div className="max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 xl:p-28 space-y-8">
      <div className="my-4 px-">
        <h1 className="text-slate-950 py-2 font-bold text-2xl md:text-4xl">
          Donation Form
        </h1>
        <p className="text-slate-500 py-2 font-light text-xs md:text-xl">
          Humans are for humanity; life is for one another.
        </p>
      </div>
      {/* PROGRESS */}
      <Stepper step={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-8 ">
          {/* Donation Towards */}
          <div>
            <h2 className="font-semibold text-gray-950 text-lg mb-4 flex items-center gap-2">
              <HeartHandshake size={18} /> Donation Towards
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {causes.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.name}
                    onClick={() => setForm({ ...form, cause: c.name })}
                    className={`border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 transition
                    ${
                      form.cause === c.name
                        ? "bg-green-600 text-white border-green-600"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-sm ">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <h2 className="font-semibold text-slate-950 text-lg mb-4 flex items-center gap-2">
              <Banknote size={18} /> Choose Amount
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setForm({ ...form, amount: a })}
                  className={`border rounded-lg py-3 font-medium transition
                  ${
                    form.amount === a
                      ? "bg-green-600 text-white border-green-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  ৳ {a}
                </button>
              ))}
            </div>

            <input
              type="number"
              name="amount"
              placeholder="Custom amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-700 rounded-lg p-3 mt-4"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
          />

          <textarea
            name="message"
            placeholder="Message (optional)"
            value={form.message}
            onChange={handleChange}
            className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
          />

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border rounded-lg text-slate-500"
            >
              Back
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-semibold text-gray-950 text-lg flex items-center gap-2">
            <CreditCard size={18} /> Payment Method
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* BKASH */}
            <button
              onClick={() => setForm({ ...form, payment: "bKash" })}
              className={`border rounded-xl p-4 text-center transition
              ${
                form.payment === "bKash"
                  ? "bg-green-600 text-white border-green-600"
                  : "hover:bg-gray-100 text-gray-600"
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
                  ? "bg-green-600 text-white border-green-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Banknote className="mx-auto mb-2" />
              Bank Transfer
            </button>
          </div>

          {form.payment === "bKash" && (
            <div className="bg-gray-100 text-slate-950 p-4 rounded-lg text-sm">
              Send money to: <b>01339-321781</b>
            </div>
          )}

          {form.payment === "Bank" && (
            <div className="bg-gray-100 p-4 text-slate-950 rounded-lg text-sm space-y-1">
              <p>Account Name: EWF Project Humanity</p>
              <p>Account Number: 0602302000494</p>
              <p>Bank: Sonali Bank PLC</p>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Donation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donationform;
