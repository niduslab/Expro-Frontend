"use client";

import {
  Heart,
  HandHelping,
  GraduationCap,
  Leaf,
  Activity,
  Home,
  Banknote,
  HeartHandshake,
  Ungroup,
} from "lucide-react";

const amounts = [500, 1000, 2000, 5000];

const causes = [
  { name: "Orphan Welfare", icon: Heart },
  { name: "Education", icon: GraduationCap },
  { name: "Disaster Relief", icon: HandHelping },
  { name: "Healthcare", icon: Activity },
  { name: "Environment", icon: Leaf },
  { name: "Community", icon: Home },
  { name: "Other", icon: Ungroup },
];

export default function StepOne({
  form,
  setForm,
  step,
  handleNext,
  handleChange,
  errors,
}: {
  form: any;
  setForm: any;
  setStep: any;
  handleChange: any;
  step: number;
  handleNext: (currentStep: number) => void;
  errors: Record<string, string>;
}) {
  return (
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
                className={`border cursor-pointer border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 transition
                      ${
                        form.cause === c.name
                          ? "bg-green-700 text-white border border-green-700"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
              >
                <Icon size={22} />
                <span className="text-sm ">{c.name}</span>
              </button>
            );
          })}
        </div>{" "}
        {errors.cause && (
          <p className="text-red-500 text-sm mt-1">{errors.cause}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <h2 className="font-semibold text-slate-950 text-lg mb-4 flex items-center gap-2">
          <Banknote size={18} /> Choose Amount
        </h2>

        {/* Amount buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => setForm({ ...form, amount: a.toString() })} // store as string
              className={`border cursor-pointer border-slate-200 rounded-lg py-3 font-medium transition
        ${
          form.amount === a.toString()
            ? "bg-green-700 text-white border border-green-700"
            : "hover:bg-gray-100 text-gray-600"
        }`}
            >
              ৳ {a}
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <input
          type="number"
          name="amount"
          placeholder="Enter any amount..."
          value={form.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 text-gray-700 rounded-lg p-3 mt-4"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      <button
        onClick={() => handleNext(step)}
        className="w-full bg-green-700 cursor-pointer hover:bg-green-700 text-white py-3 rounded-lg"
      >
        Continue
      </button>
    </div>
  );
}
