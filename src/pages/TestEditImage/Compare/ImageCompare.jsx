import React, { useState } from "react";

const ImageCompare = () => {
  const [position, setPosition] = useState(50);

  const beforeImg = require("../../../assets/guide/guide_change_image.png");
  const afterImg = require("../../../assets/guide/guide_person_image.png");

  const handleDrag = (e) => {
    const container = e.target.closest(".compare-container");
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setPosition(percent);
  };

  return (
    <div
      className="relative w-full h-80 max-w-3xl overflow-hidden cursor-ew-resize select-none compare-container"
      onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
      onMouseDown={handleDrag}
      onTouchMove={(e) => handleDrag(e.touches[0])}
      onTouchStart={(e) => handleDrag(e.touches[0])}
    >
      {/* Before image */}
      <img
        src={beforeImg}
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Before"
      />

      {/* After image with clipped width */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={afterImg}
          className="w-full h-full object-cover"
          alt="After"
        />
      </div>

      {/* Divider Bar */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${position}%` }}
      >
        <div className="w-1 bg-white shadow-md h-full" />
      </div>
    </div>
  );
};

export default ImageCompare;
