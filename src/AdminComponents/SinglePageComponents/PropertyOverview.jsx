import React from "react";
import { BsMap, BsStarFill } from "react-icons/bs";
import { mockProperty } from "../../Admin Pages/SingleProperty";


const PropertyOverview = () => {
  const property = mockProperty;

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="text-muted small mb-1">
          {property.location?.country} / {property.location?.state} /
          <strong className="ms-1">{property.location?.city}</strong>
        </div>

        <h1 className="display-6 fw-bold my-3">{property.name}</h1>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center text-muted">
            <BsMap className="me-2 text-dark" />
            {property.location?.city}, {property.location?.state},{" "}
            {property.location?.country}
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center text-warning fw-medium">
              <BsStarFill className="me-1" />
              {property.averageRating.toFixed(1)} ({property.numberOfReviews} Reviews)
            </div>
            <div className="text-success fw-semibold">Verified Listing</div>
          </div>
        </div>
      </div>

      {/* Property Price & Specs */}
      <div className="border rounded p-4 mb-4 bg-light">
        <div className="row text-center">
          <div className="col">
            <small className="text-muted">Monthly Rent</small>
            <div className="fw-bold">
              ₹{property.pricePerMonth.toLocaleString()}
            </div>
          </div>
          <div className="vr mx-2" />
          <div className="col">
            <small className="text-muted">Bedrooms</small>
            <div className="fw-bold">{property.beds} bd</div>
          </div>
          <div className="vr mx-2" />
          <div className="col">
            <small className="text-muted">Bathrooms</small>
            <div className="fw-bold">{property.baths} ba</div>
          </div>
          <div className="vr mx-2" />
          <div className="col">
            <small className="text-muted">Square Feet</small>
            <div className="fw-bold">{property.squareFeet.toLocaleString()} sq ft</div>
          </div>
        </div>
      </div>

      {/* Property Type and Kind */}
      <div className="border rounded p-4 mb-5 bg-light">
        <div className="d-flex flex-wrap gap-4 align-items-center">
          <div>
            <div className="text-muted small">Property Kind</div>
            <div className="fw-medium">{property.propertyKind}</div>
          </div>
          <div className="vr my-auto" />
          <div>
            <div className="text-muted small">Property Type</div>
            <div className="fw-medium">{property.propertyType}</div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="my-5">
        <h4 className="fw-semibold mb-3">About {property.name}</h4>
        <p className="text-muted" style={{ lineHeight: "1.7" }}>
          {property.description}
        </p>
      </div>
    </div>
  );
};

export default PropertyOverview;
