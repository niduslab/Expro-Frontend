import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  Heart, 
  Lightbulb, 
  Flag, 
  Scale, 
  GraduationCap, 
  Briefcase, 
  HeartHandshake, 
  Building2, 
  Sprout 
} from 'lucide-react';

const CoreValues = () => {
  const values = [
    { icon: Users, label: "Democracy" },
    { icon: ShieldCheck, label: "Transparency" },
    { icon: Award, label: "Responsibility" },
    { icon: Heart, label: "Unity" },
    { icon: Lightbulb, label: "Innovation" },
    { icon: Flag, label: "Peace & Prosperity" },
    { icon: Scale, label: "Gender Equality" },
    { icon: GraduationCap, label: "Human Resources" },
    { icon: Briefcase, label: "Self-reliance" },
    { icon: HeartHandshake, label: "Respect for Women" },
    { icon: Building2, label: "Good Governance" },
    { icon: Sprout, label: "Environmental Balance" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
            Core Values
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
            Principles That Guide Us
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center justify-center p-8 rounded-xl border border-gray-300 transition-all duration-300 min-h-45 bg-white hover:border-[#36F293]/30 hover:shadow-[0_4px_20px_rgba(54,242,147,0.1)]"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 bg-[#F5F7FA] text-[#008A4B] group-hover:bg-[#EBFDF3]">
                <value.icon size={24} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 text-center">
                {value.label}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreValues;

