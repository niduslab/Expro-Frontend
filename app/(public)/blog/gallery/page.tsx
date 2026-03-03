import DemoNoticeTicker from "@/components/dev-warning/page";
import Gallery from "@/components/public/landing/Gallery";
import React from "react";

const Galleries = () => {
  return (
    <>
      <div className="pt-8">
        <div className="relative top-24">
          <DemoNoticeTicker />
        </div>

        <div className="pt-2">
          <Gallery />
        </div>
      </div>
    </>
  );
};

export default Galleries;
