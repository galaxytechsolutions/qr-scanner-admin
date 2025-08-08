import React, { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const ImagePreviews = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Manual Controls
  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Auto Slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentImageIndex]); // Depend on index to reset interval smoothly

  return (
    <div
      className="position-relative w-100"
      style={{ height: "450px", overflow: "hidden" }}
    >
      {images.map((image, index) => (
        <div
          key={image}
          className={`position-absolute top-0 start-0 w-100 h-100 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            zIndex: index === currentImageIndex ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <img
            src={image}
            alt={`Property Image ${index + 1}`}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </div>
      ))}

      {/* Previous Button */}
      {/* <button
        onClick={handlePrev}
        className="position-absolute top-50 start-0 translate-middle-y btn btn-primary bg-opacity-75 rounded-circle p-2"
        aria-label="Previous image"
      >
        <BsChevronLeft className="text-white" size={20} />
      </button>

      {/* Next Button */}
      <button
        // onClick={handleNext}
        // className="position-absolute top-50 end-0 translate-middle-y btn btn-primary bg-opacity-75 rounded-circle p-2"
        // aria-label="Next image"
      > 
        <BsChevronRight className="text-white" size={20} />
      </button>
    </div>
  );
};

export default ImagePreviews;
