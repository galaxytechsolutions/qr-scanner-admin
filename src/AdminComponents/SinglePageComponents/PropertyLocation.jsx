import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { BsMap } from "react-icons/bs";

const PropertyLocation = ({ property }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
   const [coords, setCoords] = useState(null);
  const GOOGLE_API_KEY = process.env.REACT_APP_GEO_CODING_API; 

  // Build full address using location + mandal + city + state
  const fullAddress = [
    property?.location,
    property?.mandal,
    property?.city,
    "Telangana",
    // property?.state,
    "India",
  ]
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .join(", ");

  // Function to geocode address
  const tryGeocode = async (queryList) => {
    for (const q of queryList) {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${GOOGLE_API_KEY}`
        );
        const data = await res.json();
        console.log("Geocode response for", q, data);
        if (data.status === "OK" && data.results.length > 0) {
          const loc = data.results[0].geometry.location;
          return { longitude: loc.lng, latitude: loc.lat };
        }
      } catch (err) {
        console.error("Geocoding failed for:", q, err);
      }
    }
    return null;
  };

  // Get coordinates once on load
  useEffect(() => {
    if (!coords && fullAddress) {
      const queries = [
        fullAddress,
        // `${property?.location}, ${property?.mandal}, ${property?.city}, Telangana, India`,
        // `${property?.mandal}, ${property?.city}, Telangana, India`,
        // `${property?.city}, Telangana, India`,
      ];

      tryGeocode(queries).then((result) => {
        if (result) setCoords(result);
        else console.warn("Could not geocode any of:", queries);
      });
    }
  }, [coords, fullAddress, property]);

  // Initialize map once coords are available
  useEffect(() => {
    if (!coords || !mapContainerRef.current) return;

    const { longitude, latitude } = coords;
    const mapTilerKey = process.env.REACT_APP_MAP_TILER_API_KEY;

    // Remove old map if exists
    if (mapRef.current) mapRef.current.remove();

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`,
      center: [longitude, latitude],
      zoom: 15,
    });

    new maplibregl.Marker({ color: "#000" })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coords]);

  console.log("Google API Key:", process.env.REACT_APP_GEO_CODING_API);
console.log("MapTiler API Key:", process.env.REACT_APP_MAP_TILER_API_KEY);

  return (
    <div className="">
      <h5 className="fw-semibold mb-3">Map and Location</h5>
      <div className="d-flex justify-content-between align-items-center text-muted small mb-3 flex-wrap">
        <div className="d-flex align-items-center mb-2">
          <BsMap className="me-2 text-dark" />
          <span>Property Address:</span>
          <strong className="ms-2 text-dark">
            {fullAddress || "Address not available"}
          </strong>
        </div>
        {fullAddress && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center hover:underline gap-2 text-primary-600"
          >
            Get Directions
          </a>
        )}
      </div>
      <div
        ref={mapContainerRef}
        style={{ height: "300px", borderRadius: "8px", overflow: "hidden" }}
        className="w-100 border shadow-sm"
      >
        {!coords && (
          <p className="text-center mt-5 text-muted">Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default PropertyLocation;
