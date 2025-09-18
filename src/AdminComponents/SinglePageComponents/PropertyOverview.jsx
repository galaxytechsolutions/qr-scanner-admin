import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Image, Spinner } from "react-bootstrap";
import { FaEnvelope, FaPhoneAlt, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { Instance } from "../../Instence/Instence";
import { useParams } from "react-router-dom";
import { ImgBaseUrl } from "../../Instence/ImgInstence";

const PropertyOverview = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const res = await Instance.get(`/staff/${id}`);
        console.log("Fetched Staff Details:", res.data);

        const staffData = {
          ...res.data.staff,
          assignedHouses: res.data.assignedHouses
        };

        setStaff(staffData);
      } catch (err) {
        console.error("Error fetching staff details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStaffDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center mt-5">
        <h5 className="text-danger">No staff data found</h5>
      </div>
    );
  }

  return (
    <Container className="my-5 page-content" style={{ maxWidth: "1100px" }}>
      <Row className="g-4">
        {/* Left Section */}
        <Col md={8}>
          {/* Profile & Details */}
          <Card className="p-4 shadow-sm rounded-4 mb-4">
            <Row className="align-items-center g-4">
              <Col md={3} className="text-center">
                <Image
                  src={`${ImgBaseUrl}${staff.profilePic}`}
                  alt="Staff"
                  fluid
                  roundedCircle
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              </Col>

              <Col md={9}>
                <h3 className="fw-bold mb-3">{staff.name}</h3>

                <div className="d-flex flex-column gap-2">
                  <div className="d-grid" style={{ gridTemplateColumns: "160px auto" }}>
                    <span className="fw-semibold text-muted">Role</span>
                    <span className="text-dark">: {staff.role}</span>
                  </div>

                  <div className="d-grid" style={{ gridTemplateColumns: "160px auto" }}>
                    <span className="fw-semibold text-muted">Location Code</span>
                    <span className="text-dark">
                      : <Badge bg="danger" pill>{staff.locationCode}</Badge>
                    </span>
                  </div>

                  <div className="d-grid" style={{ gridTemplateColumns: "160px auto" }}>
                    <span className="fw-semibold text-muted">WhatsApp Active</span>
                    <span className="text-dark">
                      : {staff.whatsappActive ? (
                        <Badge bg="success" pill>Active</Badge>
                      ) : (
                        <Badge bg="secondary" pill>Inactive</Badge>
                      )}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Performance */}
          <Card className="p-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaTasks className="me-2" />
              Performance
            </h5>

            <div className="d-flex flex-column gap-2">
              <div className="d-flex">
                <span className="fw-semibold text-muted" style={{ width: "200px" }}>
                  Total Houses Assigned
                </span>
                <span className="text-dark">: {staff.assignedHouses.length}</span>
              </div>

              <div className="d-flex">
                <span className="fw-semibold text-muted" style={{ width: "200px" }}>
                  Total Houses Covered
                </span>
                <span className="text-dark">: {staff.totalHousesCovered}</span>
              </div>

              <div className="d-flex">
                <span className="fw-semibold text-muted" style={{ width: "200px" }}>
                  Notes
                </span>
                <span className="text-dark">: {staff.notes}</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Section */}
        <Col md={4}>
          {/* Quick Contact */}
          <Card className="p-4 shadow-sm rounded-4 mb-4 border-0">
            <h5 className="fw-bold text-primary mb-4">Contact Information</h5>

            <div className="d-flex flex-column gap-3">
              <div className="d-grid" style={{ gridTemplateColumns: "30px 70px auto" }}>
                <FaPhoneAlt className="text-primary mt-1" size={16} />
                <span className="fw-semibold text-muted">Phone</span>
                <span className="fw-semibold text-dark">: {staff.phoneNo}</span>
              </div>

              <div className="d-grid" style={{ gridTemplateColumns: "30px 70px auto" }}>
                <FaEnvelope className="text-info mt-1" size={16} />
                <span className="fw-semibold text-muted">Email</span>
                <span className="fw-semibold text-dark">: {staff.email}</span>
              </div>

              <div className="d-grid" style={{ gridTemplateColumns: "30px 120px auto" }}>
                <MdOutlineLocationOn className="text-danger mt-1" size={18} />
                <span className="fw-semibold text-muted">Assigned Region</span>
                <span className="fw-semibold text-dark">: {staff.assignedRegion}</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaCalendarAlt className="me-2" />
              Timeline
            </h5>

            <div className="d-flex flex-column gap-2">
              <div className="d-flex">
                <span className="fw-semibold text-muted" style={{ width: "150px" }}>
                  Created At
                </span>
                <span className="text-dark">
                  : {new Date(staff.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="d-flex">
                <span className="fw-semibold text-muted" style={{ width: "150px" }}>
                  Updated At
                </span>
                <span className="text-dark">
                  : {new Date(staff.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyOverview;
