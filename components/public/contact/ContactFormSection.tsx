import React from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactFormSection = () => {
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
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#111111]">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Abdul"
                    className="w-full px-4 py-3 rounded-lg border border-transparent bg-white focus:border-[#00A651] focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#111111]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Rahman"
                    className="w-full px-4 py-3 rounded-lg border border-transparent bg-white focus:border-[#00A651] focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400"
                  />
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
                    className="w-full px-4 py-3 rounded-lg border border-transparent bg-white focus:border-[#00A651] focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="block text-sm font-medium text-[#111111]">
                    Contact
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    placeholder="+8801764XXXXXXX"
                    className="w-full px-4 py-3 rounded-lg border border-transparent bg-white focus:border-[#00A651] focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400"
                  />
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
                  className="w-full px-4 py-3 rounded-lg border border-transparent bg-white focus:border-[#00A651] focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#111111]">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Enter your message here..."
                  className="w-full px-4 py-3 rounded-lg border border-transparent bg-white focus:border-[#00A651] focus:ring-0 outline-none transition-colors text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#0E8B44] hover:bg-[#0b7036] text-white font-bold rounded-lg transition-colors duration-300 text-center"
              >
                Submit Now
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
