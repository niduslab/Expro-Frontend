import React from 'react';
import { Target, Eye, Flag, Heart } from 'lucide-react';

const CorePurpose = () => {
  const items = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To create self-sufficient, self-employed and self-empowered communities through increasing capabilities by providing need based supports like awareness raising, Agriculture, Educational Activities, Fashion Design, Woman entrepreneurship, Tailoring tanning, Markets and Livelihoods Program & food processing etc."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "We expect a society where established human rights and social justice and ensured self-sufficiency of the community."
    },
    {
      icon: Flag,
      title: "Our Goal",
      description: "Ensuring basic human rights through economic development."
    },
    {
      icon: Heart,
      title: "Our Aim",
      description: "To ensure the sustainable legal rights of the poor, unemployed and underemployed by providing the best possible efforts to bring them to a better and orderly life with dignity in their families and society through capacity building, adaptability, responsiveness, best use of their own/available resources, participation in development work, and establishment of good governance. To ensure the fundamental rights of the people through economic development."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F5F7FA]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
            Core Purpose
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
            Mission, Vision & Goals
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-8 md:p-10 rounded-[12px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start h-full"
            >
              <div className="w-14 h-14 rounded-[8px] bg-[#008A4B] flex items-center justify-center mb-6 text-white shrink-0">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>
              
              <p className="text-gray-600 font-dm-sans leading-relaxed text-[15px] md:text-[16px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CorePurpose;
