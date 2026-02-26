import React from 'react';

const ContactMap = () => {
  return (
    <section className="pb-16 md:pb-15 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57930.379154075126!2d89.3702374!3d24.84168475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc54e7e81df441%3A0x27133ed921fe73f4!2sBogura!5e0!3m2!1sen!2sbd!4v1772009943911!5m2!1sen!2sbd" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
            className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
