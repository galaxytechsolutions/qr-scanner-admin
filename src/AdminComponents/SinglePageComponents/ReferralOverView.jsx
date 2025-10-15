import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Image, Row, Spinner, Stack } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaCalendarAlt,
  FaUserTie,
  FaMapPin,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

// Mock data for a single referral
const mockReferral = {
  _id: "ref-001",
  name: "Aarav Sharma",
  phoneNo: "9876543210",
  email: "aarav.sharma@example.com",
  whatsappActive: true,
  constituency: "Adilabad",
  status: "pending",
  profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  refferredBy: {
    _id: "staff-101",
    name: "Riya Patel",
    role: "Field Staff",
  },
  createdAt: "2023-10-27T10:00:00Z",
};

const getStatusBadge = (status) => {
  const styles = {
    accepted: { bg: "success-subtle", text: "success" },
    rejected: { bg: "danger-subtle", text: "danger" },
    pending: { bg: "warning-subtle", text: "warning" },
  };
  const style = styles[status] || styles.pending;
  return (
    <Badge bg={style.bg} text={style.text} className="px-2 py-1 text-capitalize">
      {status}
    </Badge>
  );
};

const ReferralOverView = () => {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  // In real implementation, fetch referral by ID from API
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setReferral(mockReferral); // Replace with fetched data
      setLoading(false);  // Set loading to false when data is fetched
    }, 1000);
  }, []);
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="text-center mt-5">
        <h5 className="text-danger">No referral data found</h5>
      </div>
    );
  }

  return (
    <Container className="my-5 page-content">
      <Row className="justify-content-center">
        <Col lg={6} md={10}>
          <Card className="shadow-sm rounded-3 border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <Image
                  src={referral.profilePic || "/avatars/default-avatar.png"}
                  alt="Referral"
                  roundedCircle
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                <div className="ms-3">
                  <h3 className="fw-bold mb-1">{referral.name}</h3>
                  {getStatusBadge(referral.status)}
                </div>
              </div>

              <hr className="my-4" />

              {/* Details */}
              <Stack gap={3}>
                <InfoItem icon={<FaPhoneAlt />} label="Phone" value={referral.phoneNo} />
                <InfoItem icon={<FaEnvelope />} label="Email" value={referral.email} />
                <InfoItem
                  icon={<FaWhatsapp />}
                  label="WhatsApp"
                  value={
                    referral.whatsappActive ? (
                      <Badge bg="success-subtle" text="success" className="fw-semibold">Active</Badge>
                    ) : (
                      <Badge bg="secondary-subtle" text="secondary" className="fw-semibold">Inactive</Badge>
                    )
                  }
                />
                <InfoItem icon={<FaMapPin />} label="Constituency" value={referral.constituency} />
              </Stack>

              <hr className="my-4" />

              <Stack gap={3}>
                <InfoItem icon={<FaUserTie />} label="Referred By" value={referral.refferredBy.name} />
                <InfoItem icon={<FaCalendarAlt />} label="Referred On" value={new Date(referral.createdAt).toLocaleDateString()} />
              </Stack>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center gap-3">
    {icon && <div className="text-muted" style={{ width: "20px" }}>{icon}</div>}
    <div className="d-grid" style={{ gridTemplateColumns: "120px auto", flex: 1 }}>
      <span className="fw-semibold text-muted">{label}</span>
      <span className="text-dark">: {value}</span>
    </div>
  </div>
);

export default ReferralOverView;