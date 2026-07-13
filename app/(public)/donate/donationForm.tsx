"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Stepper from "@/components/ui/stepper";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import { donationSchema } from "@/components/zodschema/donateSchema";
import { ZodError } from "zod";
import { payDonation } from "@/lib/api/functions/donation";

interface FormType {
  amount: string;
  cause: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  payment: string;
}
const Donationform = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    amount: "",
    cause: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    payment: "bkash",
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

  const handleSubmit = async () => {
    // Validate the full form before talking to the API.
    try {
      donationSchema.parse(form);
      setErrors({});
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0])
            fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
        const firstMessage = error.issues[0]?.message;
        if (firstMessage) toast.error(firstMessage);
      }
      return;
    }

    // Open to both members and guests — a logged-in member is associated
    // automatically via the bearer token attached by the API client.
    setSubmitting(true);
    const toastId = toast.loading("Initiating secure payment...");

    try {
      const res = await payDonation({
        project_id: null,
        amount: Number(form.amount),
        donor_name: form.name,
        donor_email: form.email,
        donor_phone: form.phone,
        purpose: form.cause,
        message: form.message || undefined,
        is_anonymous: false,
        payment_method: "bkash",
      });

      // bKash returns bkashURL; SSLCommerz (if ever enabled) returns gateway_url.
      const redirectUrl = res.data?.bkashURL || res.data?.gateway_url;

      if (res.success && redirectUrl) {
        toast.success("Redirecting to bKash...", { id: toastId });
        window.location.href = redirectUrl;
        return; // keep the spinner while the browser navigates away
      }

      toast.error(res.message || "Could not start the payment. Please try again.", {
        id: toastId,
      });
      setSubmitting(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Payment initiation failed. Please try again.";
      toast.error(message, { id: toastId });
      setSubmitting(false);
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
          submitting={submitting}
          errors={errors}
        />
      )}
    </div>
  );
};

export default Donationform;
