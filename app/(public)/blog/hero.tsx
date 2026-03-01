import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-[590px] md:h-[600px] w-full">
      {/* Background Layer with Image and Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/blog-media/blog-hero.jpg"
          alt="Blog item one"
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

      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center h-full">
        <div className="max-w-2xl text-white space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm md:text-base font-medium mb-2">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Home
            </Link>
            <span className="text-white">•</span>
            <span className="text-[#36F293]">Blog Details</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            Blog & Media
          </h1>

          <p className="font-dm-sans text-[16px] md:text-[18px] font-normal leading-[160%] text-gray-200 max-w-xl">
            Welcome to the Blog & Media hub of Expro Welfare Foundation, where
            we share stories of impact, community initiatives, events, and
            important updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
