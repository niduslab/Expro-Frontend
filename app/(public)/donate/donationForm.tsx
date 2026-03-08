"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Stepper from "@/components/ui/stepper";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import { donationSchema } from "./validation";
import { ZodError } from "zod";
interface FormType {
  amount: string;
  cause: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  payment: string;
  transactionId: string;
}
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

  const [form, setForm] = useState<FormType>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    try {
      donationSchema.parse(form);
      toast.success("Donation completed successfully");
      setForm(initialForm);
      setStep(1);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // use error.issues instead of error.errors
        toast.error(error.issues[0]?.message ?? "Invalid input");
      }
    }
  };
  const handleNext = (currentStep: number) => {
    try {
      if (currentStep === 1) {
        donationSchema.pick({ cause: true, amount: true }).parse(form);
      }
      if (currentStep === 2) {
        donationSchema
          .pick({ name: true, email: true, phone: true, message: true })
          .parse(form);
      }
      setStep(currentStep + 1);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0]?.message ?? "Invalid input");
      }
    }
  };
  return (
    <div className="max-w-2xl mx-auto  border-t-2 border-green-200 bg-white shadow-xl rounded-2xl p-6 space-y-8">
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
          step={step}
          handleNext={handleNext}
        />
      )}

      {step === 2 && (
        <StepTwo
          form={form}
          setStep={setStep}
          handleChange={handleChange}
          step={step}
          handleNext={handleNext}
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
