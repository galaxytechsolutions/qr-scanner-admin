import React, { useState } from "react";
import { Card, Row, Col, Badge, Image as RBImage } from "react-bootstrap";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";

const PropertyCard = ({ application, userType, children }) => {
  const [imgSrc, setImgSrc] = useState(
    application?.property?.photoUrls?.[0] || "/placeholder.jpg"
  );

  const statusVariant =
    application?.status === "Approved"
      ? "success"
      : application?.status === "Denied"
      ? "danger"
      : "warning";

  const contactPerson =
    userType === "manager" ? application?.tenant : application?.manager;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Row className="align-items-center gy-4">
          {/* Property Info Section */}
          <Col xs={12} lg={4} className="d-flex">
            <RBImage
              src={imgSrc}
              onError={() => setImgSrc("/placeholder.jpg")}
              alt={application?.property?.name}
              width={200}
              height={150}
              rounded
              className="object-fit-cover me-3"
            />
            <div>
              <h5 className="fw-bold mb-2">{application?.property?.name}</h5>
              <div className="text-muted d-flex align-items-center mb-2">
                <FiMapPin className="me-2" />
                <span>
                  {application?.property?.location?.city}, {" "}
                  {application?.property?.location?.country}
                </span>
              </div>
              <div className="fs-5 fw-semibold">
                ₹{application?.property?.pricePerMonth}
                <span className="fs-6 fw-normal"> / month</span>
              </div>
            </div>
          </Col>

          {/* Status Info */}
          <Col xs={12} lg={3}>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Status:</span>
              <Badge bg={statusVariant}>{application?.status}</Badge>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Start Date:</span>
              <span>{new Date(application?.lease?.startDate).toLocaleDateString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">End Date:</span>
              <span>{new Date(application?.lease?.endDate).toLocaleDateString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Next Payment:</span>
              <span>{new Date(application?.lease?.nextPaymentDate).toLocaleDateString()}</span>
            </div>
          </Col>

          {/* Contact Info */}
          <Col xs={12} lg={5}>
            <div className="fw-semibold mb-2">
              {userType === "manager" ? "Tenant" : "Manager"}
            </div>
            <div className="d-flex align-items-start gap-3">
              <RBImage
                src="/landing-i1.png"
                alt={contactPerson?.name}
                roundedCircle
                width={40}
                height={40}
              />
              <div>
                <div className="fw-semibold">{contactPerson?.name}</div>
                <div className="text-primary d-flex align-items-center">
                  <FiPhoneCall className="me-2" /> {contactPerson?.phoneNumber}
                </div>
                <div className="text-primary d-flex align-items-center">
                  <FiMail className="me-2" /> {contactPerson?.email}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <hr className="my-4" />
        {children}
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;