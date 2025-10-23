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
import { Instance } from "../../Instence/Instence";
import { ImgBaseUrl } from "../../Instence/ImgInstence";

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
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchReferral = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Instance.get(`referral/${id}`);
        setReferral(res.data.referral);
        console.log("Fetched referral:", res.data?.referral);
      } catch (err) {
        setError("Failed to fetch referral data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferral();
  }, [id]);

  if (loading) {
    return (
      <div className="page-content text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="page-content text-center mt-5">
        <h5 className="text-danger">{error || "No referral data found."}</h5>
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
                  src={`${ImgBaseUrl}${referral.friendProfilePic}`}
                  alt={referral.friendName}
                  roundedCircle
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                <div className="ms-3">
                  <h3 className="fw-bold mb-1">{referral.friendName}</h3>
                  {getStatusBadge(referral.status)}
                </div>
              </div>

              <hr className="my-4" />

              {/* Details */}
              <Stack gap={3}>
                <InfoItem icon={<FaPhoneAlt />} label="Phone" value={referral.friendPhone} />
                <InfoItem icon={<FaEnvelope />} label="Email" value={referral.friendEmail} />
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
                <InfoItem icon={<FaMapPin />} label="Constituency" value={referral.constituency || "N/A"} />
              </Stack>

              <hr className="my-4" />

              <Stack gap={3}>
                <InfoItem icon={<FaUserTie />} label="Referred By" value={referral.referrerStaff?.name || "N/A"} />
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