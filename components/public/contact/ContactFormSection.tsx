"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useContactMessageCreate } from "@/lib/hooks/admin/useContactmessages";
import type { ContactMessageCreatePayload } from "@/lib/types/admin/ContactMessageType";
import { useForm } from "react-hook-form";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  message: string;
}

const INPUT_BASE =
  "w-full px-4 py-3 rounded-lg border bg-white focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400";
const INPUT_ERROR = "border-red-500 focus:border-red-500";
const INPUT_NORMAL = "border-transparent focus:border-[#00A651]";

const ContactFormSection = () => {
  const { create, isCreating, isSuccess, creationError, reset } =
    useContactMessageCreate();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      address: "",
      message: "",
    },
  });

  // Show toast + reset form on success
  useEffect(() => {
    if (isSuccess) {
      toast.success(
        "Thank you for your message! We will get back to you soon.",
      );
      resetForm();
      reset(); // reset hook state so banner can be dismissed on next submit
    }
  }, [isSuccess, resetForm, reset]);

  // Show toast on error
  useEffect(() => {
    if (creationError) {
      toast.error(creationError);
    }
  }, [creationError]);

  const onSubmit = async (formData: FormData) => {
    const payload: ContactMessageCreatePayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.contact,
      subject: "Contact Form Inquiry",
      message: formData.message,
      priority: "normal",
      status: "new",
    };

    await create(payload);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8FAF0] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00A651]"></span>
            <span className="text-sm font-medium text-[#00341C]">
              Contact Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] text-center">
            Let's Talk With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-2 md:px-4 lg:px-8">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-7 bg-[#F6F6F6] p-6 md:p-8 lg:p-10 rounded-xl">
            <h3 className="text-2xl font-bold text-[#111111] mb-6">
              Get In Touch
            </h3>

            {/* Inline success / error banners */}
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Thank you for your message! We will get back to you soon.
                </p>
              </div>
            )}
            {creationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{creationError}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#111111]"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Abdul"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className={`${INPUT_BASE} ${errors.firstName ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#111111]"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Rahman"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className={`${INPUT_BASE} ${errors.lastName ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#111111]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={`${INPUT_BASE} ${errors.email ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-[#111111]"
                  >
                    Contact
                  </label>
                  <input
                    id="contact"
                    type="tel"
                    placeholder="+8801764XXXXXXX"
                    {...register("contact", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[\d\s\-\+\(\)]+$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                    className={`${INPUT_BASE} ${errors.contact ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.contact.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-[#111111]"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Bogura Town"
                  {...register("address", {
                    required: "Address is required",
                  })}
                  className={`${INPUT_BASE} ${errors.address ? INPUT_ERROR : INPUT_NORMAL}`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#111111]"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Enter your message here..."
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters long",
                    },
                  })}
                  className={`${INPUT_BASE} resize-none ${errors.message ? INPUT_ERROR : INPUT_NORMAL}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-4 px-6 bg-[#0E8B44] hover:bg-[#0b7036] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-300 text-center"
              >
                {isCreating ? "Submitting..." : "Submit Now"}
              </button>
            </form>
          </div>

          {/* Right Column - Image & Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Image */}
            <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden">
              <Image
                src="/images/contact-us/talk-with-us-expro.jpg"
                alt="Volunteers helping people"
                fill
                className="object-cover"
              />
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 p-3 bg-[#F4FBF7] rounded-lg mr-4">
                  <Phone className="w-6 h-6 text-[#00A651]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#111111] mb-1">
                    Customer Service
                  </h4>
                  <p className="text-gray-600">01304-493937</p>
                </div>
              </div>

              <div className="flex items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 p-3 bg-[#F4FBF7] rounded-lg mr-4">
                  <Mail className="w-6 h-6 text-[#00A651]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#111111] mb-1">
                    Mail Address
                  </h4>
                  <p className="text-gray-600">ewf.bogura.bd@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 p-3 bg-[#F4FBF7] rounded-lg mr-4">
                  <MapPin className="w-6 h-6 text-[#00A651]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#111111] mb-1">
                    Office Address
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Nishindhara under Bogura Pourashova of Bogura SadarUpazila
                    in Bogura district
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
