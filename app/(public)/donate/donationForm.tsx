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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (currentStep: number) => {
    let result;

    if (currentStep === 1) {
      const stepOneSchema = donationSchema.pick({ cause: true, amount: true });
      result = stepOneSchema.safeParse(form);
    } else if (currentStep === 2) {
      const stepTwoSchema = donationSchema.pick({
        name: true,
        email: true,
        phone: true,
        message: true,
      });
      result = stepTwoSchema.safeParse(form);
    } else {
      return; // <--- if step is not 1 or 2, exit early
    }

    if (result.success) {
      setErrors({});
      setStep(currentStep + 1);
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);

      const firstMessage = result.error.issues[0]?.message;
      if (firstMessage) toast.error(firstMessage);
    }
  };

  const handleSubmit = () => {
    try {
      donationSchema.parse(form);
      setErrors({});
      toast.success("Donation completed successfully");
      setForm(initialForm);
      setStep(1);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0])
            fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
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
          errors={errors}
        />
      )}

      {step === 2 && (
        <StepTwo
          form={form}
          errors={errors}
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
          errors={errors}
        />
      )}
    </div>
  );
};

export default Donationform;
