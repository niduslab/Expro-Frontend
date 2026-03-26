import Gallery from "@/components/public/landing/Gallery";

const Galleries = () => {
  return (
    <>
      <div className="pt-8">
        <div className="relative top-24"></div>

        <div className="pt-2">
          <Gallery header2={"EWF Image Gallery"} galleryId={1} />
        </div>
      </div>
    </>
  );
};

export default Galleries;
