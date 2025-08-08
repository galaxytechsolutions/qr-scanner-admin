import React from "react";
import { Tabs, Tab, Row, Col, Card } from "react-bootstrap";
// import { HelpCircle } from "react-feather"; // or from 'react-icons/fi'
// import { HighlightIcons } from "@/lib/constants";
// import { formatEnumString } from "@/lib/utils";
import { mockProperty } from "../../Admin Pages/SingleProperty";

const PropertyDetails = () => {
  const property = mockProperty;

  return (
    <div className="mb-5">
      {/* Highlights Section */}
      {/* <div className="mt-4 mb-5">
        <h3 className="text-primary fw-semibold">Highlights</h3>
        <Row className="mt-4 g-4">
          {property.highlights.map((highlight, index) => {
            const Icon = HighlightIcons[highlight] || HelpCircle;
            return (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <Card className="text-center p-4 border rounded shadow-sm h-100">
                  <Icon size={32} className="mb-2 text-primary" />
                  <div className="text-muted">{formatEnumString(highlight)}</div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div> */}

      {/* Tabs Section */}
      <div>
        <h3 className="text-primary fw-semibold mb-3">Fees and Policies</h3>
        <p className="text-muted">
          The fees below are based on community-supplied data and may exclude additional fees and utilities.
        </p>

        <Tabs defaultActiveKey="required-fees" className="mt-4">
          <Tab eventKey="required-fees" title="Required Fees">
            <div className="mt-4 w-100" style={{ maxWidth: "400px" }}>
              <h6>One time move in fees</h6>
              <hr />
              <div className="d-flex justify-content-between py-2 px-3 bg-light border">
                <span className="fw-medium">Application Fee</span>
                <span>₹{property.applicationFee}</span>
              </div>
              <hr className="m-0" />
              <div className="d-flex justify-content-between py-2 px-3 bg-light border">
                <span className="fw-medium">Security Deposit</span>
                <span>₹{property.securityDeposit}</span>
              </div>
              <hr />
            </div>
          </Tab>

          <Tab eventKey="pets" title="Pets">
            <p className="mt-4">
              Pets are <strong>{property.isPetsAllowed ? "allowed" : "not allowed"}</strong>
            </p>
          </Tab>

          <Tab eventKey="parking" title="Parking">
            <p className="mt-4">
              Parking is <strong>{property.isParkingIncluded ? "included" : "not included"}</strong>
            </p>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetails;
