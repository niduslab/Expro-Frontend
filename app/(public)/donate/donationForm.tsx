"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Stepper from "@/components/ui/stepper";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";

const Donationform = () => {
  const [step, setStep] = useState(1);

  const initialForm = {
    amount: "",
    cause: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    payment: "",
    transactionId: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    toast.success("Donation completed successfully");
    setForm(initialForm);
    setStep(1);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-8">
      <div className="my-4">
        <h1 className="text-slate-950 py-2 font-bold text-2xl md:text-4xl">
          Donation Form
        </h1>
        <p className="text-slate-500 py-2 font-light text-xs md:text-xl">
          Humans are for humanity; life is for one another.
        </p>
      </div>

      <Stepper step={step} />

      {step === 1 && (
        <StepOne
          form={form}
          setForm={setForm}
          setStep={setStep}
          handleChange={handleChange}
        />
      )}

      {step === 2 && (
        <StepTwo
          form={form}
          setForm={setForm}
          setStep={setStep}
          handleChange={handleChange}
        />
      )}

      {step === 3 && (
        <StepThree
          form={form}
          setForm={setForm}
          setStep={setStep}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Donationform;
