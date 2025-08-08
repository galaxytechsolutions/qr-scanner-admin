import React, { useEffect, useRef } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
import { BsMap, BsCompass } from "react-icons/bs";
import { mockProperty } from "../../Admin Pages/SingleProperty";


const PropertyLocation = () => {
  const property = mockProperty;
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // const map = new maplibregl.Map({
    //   container: mapContainerRef.current,
    //   style: `https://api.maptiler.com/maps/hybrid/style.json?key=Yd9bwEYm5QBgaWb1BzyN`,
    //   center: [
    //     property.location.coordinates.longitude,
    //     property.location.coordinates.latitude,
    //   ],
    //   zoom: 15,
    // });

    // const marker = new maplibregl.Marker()
    //   .setLngLat([
    //     property.location.coordinates.longitude,
    //     property.location.coordinates.latitude,
    //   ])
    //   .addTo(map);

    // const markerElement = marker.getElement();
    // const path = markerElement.querySelector("path[fill='#3FB1CE']");
    // if (path) path.setAttribute("fill", "#000000");

    // return () => map.remove();
  }, [property]);

  return (
    <div className="py-5">
      <h3 className="fw-semibold text-primary mb-3">Map and Location</h3>

      <div className="d-flex justify-content-between align-items-center text-muted small mb-3 flex-wrap">
        <div className="d-flex align-items-center mb-2">
          <BsMap className="me-2 text-dark" />
          <span>Property Address:</span>
          <strong className="ms-2 text-dark">
            {property.location?.address || "Address not available"}
          </strong>
        </div>

        {/* <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center gap-2 text-decoration-none text-primary"
        >
          <BsCompass className="me-1" />
          <span>Get Directions</span>
        </a> */}
      </div>

      {/* <div
        ref={mapContainerRef}
        style={{
          height: "300px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className="w-100 border shadow-sm"
      /> */}
    </div>
  );
};

export default PropertyLocation;
