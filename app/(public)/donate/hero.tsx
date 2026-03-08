import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-[590px] md:h-[600px] items-center overflow-hidden">
      {/* Background Layer with Image and Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/donate/donate-poster-hero.png"
          alt="Donation Hero poster"
          fill
          sizes="373px"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
          className="ml-auto w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(80deg, #00341C 0%, #002C18 20%, transparent 70%)",
          }}
        />
        {/* Mobile Gradient Overlay for better text readability on small screens */}
        <div className="absolute inset-0 bg-black/40 md:hidden" />
      </div>

      {/* Content */}

      <div className="relative z-10 container mx-auto pt-[50px] md:pt-0 px-6 md:px-12 lg:px-20 flex flex-col justify-center h-full">
        <div className="max-w-2xl text-white space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm md:text-base font-medium mb-2">
            <Link
              href="/"
              className="font-dm-sans text-white hover:text-gray-200 transition-colors"
            >
              Home
            </Link>
            <span className="text-white">•</span>
            <span className="text-[#36F293] font-dm-sans ">Donation</span>
          </div>

          <h1 className="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white">
            “Project Humanity” — Your Donation, A Smiling Face
          </h1>

          <p className="font-dm-sans  leading-relaxed max-w-3xl">
            <span className="font-bold">Project Humanity</span> is a charitable
            initiative of the Xpro Welfare Foundation. We believe that your
            small contribution can bring significant change to the lives of
            neglected and helpless people in society. Join our humanitarian
            journey today by donating according to your capacity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
