'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import { publicApiRequest } from '@/lib/api/axios';
import { toast } from 'sonner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  contact?: string;
  address?: string;
  message?: string;
}

const ContactFormSection = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    address: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await publicApiRequest.post('/public/contactmessage', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.contact,
        subject: 'Contact Form Inquiry',
        message: formData.message,
        address: formData.address,
        priority: 'normal',
        status: 'new',
      });

      if (response.data.success) {
        setSubmitStatus('success');
        const successMsg = 'Thank you for your message! We will get back to you soon.';
        setSubmitMessage(successMsg);
        toast.success(successMsg);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          contact: '',
          address: '',
          message: '',
        });
      }
    } catch (error: any) {
      setSubmitStatus('error');
      let errorMsg = 'Failed to send message. Please try again.';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        errorMsg = errorMessages;
      }
      
      setSubmitMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8FAF0] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00A651]"></span>
            <span className="text-sm font-medium text-[#00341C]">Contact Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] text-center">
            Let’s Talk With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-7 bg-[#F6F6F6] p-6 md:p-8 lg:p-10 rounded-xl">
            <h3 className="text-2xl font-bold text-[#111111] mb-6">Get In Touch</h3>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">{submitMessage}</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{submitMessage}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#111111]">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Abdul"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400 ${
                      errors.firstName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-transparent focus:border-[#00A651]'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs font-medium">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#111111]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Rahman"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400 ${
                      errors.lastName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-transparent focus:border-[#00A651]'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs font-medium">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[#111111]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400 ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-transparent focus:border-[#00A651]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="block text-sm font-medium text-[#111111]">
                    Contact
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    placeholder="+8801764XXXXXXX"
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400 ${
                      errors.contact
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-transparent focus:border-[#00A651]'
                    }`}
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-xs font-medium">{errors.contact}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-[#111111]">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Bogura Town"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400 ${
                    errors.address
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-[#00A651]'
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs font-medium">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#111111]">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Enter your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400 resize-none ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-[#00A651]'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs font-medium">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#0E8B44] hover:bg-[#0b7036] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-300 text-center"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Now'}
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
              {/* Customer Service */}
              <div className="flex items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 p-3 bg-[#F4FBF7] rounded-lg mr-4">
                  <Phone className="w-6 h-6 text-[#00A651]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#111111] mb-1">Customer Service</h4>
                  <p className="text-gray-600">01304-493937</p>
                </div>
              </div>

              {/* Mail Address */}
              <div className="flex items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 p-3 bg-[#F4FBF7] rounded-lg mr-4">
                  <Mail className="w-6 h-6 text-[#00A651]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#111111] mb-1">Mail Address</h4>
                  <p className="text-gray-600">ewf.bogura.bd@gmail.com</p>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 p-3 bg-[#F4FBF7] rounded-lg mr-4">
                  <MapPin className="w-6 h-6 text-[#00A651]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#111111] mb-1">Office Address</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Nishindhara under Bogura Pourashova of Bogura SadarUpazila in Bogura district
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
