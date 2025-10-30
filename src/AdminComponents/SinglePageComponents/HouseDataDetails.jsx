import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Image } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaVoteYea,
  FaInfoCircle,
  FaStickyNote,
  FaUserTie,
  FaIdBadge,
} from "react-icons/fa";
import { BsTelephoneFill } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
import { Instance } from "../../Instence/Instence";
import { useParams } from "react-router-dom";
import { ImgBaseUrl } from "../../Instence/ImgInstence";
import PropertyLocation from "./PropertyLocation";

// const house = {
//   _id: "68c90c918b261e85734a4cfe",
//   role: "user",
//   phoneNo: "8000073256",
//   qrCode: "KOD-HYD-0001",
//   qrCodeImage:
//     "https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&size=150x150",
//   location: "Ntg",
//   booth: "Ntg5",
//   mandal: "Hai",
//   headOfFamily: "Ramu",
//   caste: "Hai",
//   noOfMembers: 1,
//   ageGenderList: ["35-M"],
//   preferredParty: "Congress",
//   schemesReceived: ["Talk"],
//   migrationInfo: "Dal",
//   complaints: "Hai",
//   whatsappActive: true,
//   volunteerNote: "Green",
//   assignedStaff: {
//     _id: "68c133f20308e7be42907524",
//     name: "King",
//     assignedRegion: "hyd east",
//     phoneNo: "8367340734",
//   },
//   profilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
//   createdAt: "2025-09-16T07:06:57.494Z",
//   updatedAt: "2025-09-16T07:06:57.494Z",
// };

const HouseDataDetails = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const res = await Instance.get(`/houseData/${id}`);
        console.log("Fetched House Details:", res.data);
        setHouse(res.data.houseData);
      } catch (err) {
        console.error("Error fetching house details:", err);
      }
    };

    fetchHouseData();
  }, [id]);

  if (!house) {
    return (
      <Container className="my-5 text-center">
        <p>Loading house data...</p>
      </Container>
    );
  }

  const InfoRow = ({ label, value }) => (
    <p className="mb-2">
      <span className="fw-semibold text-muted">{label}: </span>
      <span className="text-dark">{value}</span>
    </p>
  );

  const AssignedStaffWidget = ({ staff }) => {
    if (!staff) return null;
    return (
      <Card className="p-4 shadow-sm rounded-4 border-0">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle p-3 shadow-sm">
            <FaUserTie size={22} />
          </div>
          <div>
            <p className="mb-1 text-muted small">Assigned Staff</p>
            <h5 className="fw-bold text-dark mb-0">{staff.name}</h5>
          </div>
        </div>
        <div className="ps-1">
          <div className="mb-4 d-flex align-items-center gap-2">
            <BsTelephoneFill className="text-primary" size={16} />
            <span className="fw-semibold text-dark">{staff.phoneNo}</span>
          </div>
          <div className="mb-4 d-flex align-items-center gap-2">
            <MdOutlineLocationOn className="text-danger" size={18} />
            <span className="fw-semibold text-dark">{staff.assignedRegion}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <FaIdBadge className="text-success" size={18} />
            <span className="fw-semibold text-dark">ID: {staff._id}</span>
          </div>
        </div>
      </Card>
      

      
    );
  };

  return (
    <Container className="my-5 page-content" style={{ maxWidth: "1100px" }}>
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="p-4 shadow-sm rounded-4">
            <Row className="align-items-center g-4">
              <Col md={3} className="text-center">
                <Image
                  src={`${ImgBaseUrl}${house.profilePic}`}
                  alt="Profile"
                  fluid
                  roundedCircle
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              </Col>
              <Col md={6}>
                <h3 className="fw-bold mb-3">{house.headOfFamily}</h3>
                <InfoRow label="Phone" value={house.phoneNo} />
                <InfoRow
                  label="WhatsApp Active"
                  value={
                    house.whatsappActive ? (
                      <Badge bg="success" pill>
                        Active
                      </Badge>
                    ) : (
                      <Badge bg="secondary" pill>
                        Inactive
                      </Badge>
                    )
                  }
                />
                <InfoRow label="Role" value={house.role} />
                <InfoRow
                  label="Created At"
                  value={new Date(house.createdAt).toLocaleString()}
                />
                <InfoRow
                  label="Updated At"
                  value={new Date(house.updatedAt).toLocaleString()}
                />
              </Col>
              <Col md={3} className="text-center">
                <Image
                  src={house.qrCodeImage}
                  alt="QR Code"
                  fluid
                  rounded
                  style={{ width: "100px", height: "100px", objectFit: "contain" }}
                />

                <p className="mt-2 fw-semibold text-muted">{house.qrCode}</p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={4}>
          <AssignedStaffWidget staff={house.assignedStaff} />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={8}>
          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaMapMarkerAlt className="me-2" />
              Location Details
            </h5>
            <Row>
              <Col md={4}>
                <InfoRow label="Location" value={house.location} />
              </Col>
              <Col md={4}>
                <InfoRow label="Booth" value={house.booth} />
              </Col>
              <Col md={4}>
                <InfoRow label="Mandal" value={house.mandal} />
              </Col>
            </Row>
          </Card>

          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaUsers className="me-2" />
              Family Details
            </h5>
            <Row>
              <Col md={4}>
                <InfoRow label="Caste" value={house.caste} />
              </Col>
              <Col md={4}>
                <InfoRow label="Members" value={house.noOfMembers} />
              </Col>
              <Col md={4}>
                <InfoRow
                  label="Age/Gender"
                  value={(house.ageGenderList || []).join(", ")}
                />
              </Col>
            </Row>
          </Card>

          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaVoteYea className="me-2" />
              Voting Information
            </h5>
            <Row>
              <Col md={6}>
                <InfoRow
                  label="Preferred Party 2024"
                  value={house.preferredParty}
                />
              </Col>
            </Row>
          </Card>

          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaInfoCircle className="me-2" />
              Other Information
            </h5>
            <Row>
              <Col md={6}>
                <InfoRow
                  label="Schemes Received"
                  value={(house.schemesReceived || []).join(", ")}
                />
              </Col>
              <Col md={6}>
                <InfoRow label="Migration Info" value={house.migrationInfo} />
              </Col>
            </Row>
            <InfoRow label="Complaints / Mood" value={house.complaints} />
          </Card>

          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaStickyNote className="me-2" />
              Volunteer Notes
            </h5>
            <p className="text-dark">{house.volunteerNote}</p>
          </Card>
        </Col>
        <Col md={4}></Col>
      </Row>

        <Row className="">
        <Col md={8}>
          <PropertyLocation property={house} /> 
        </Col>
      </Row>
    </Container>
  );
};

export default HouseDataDetails;
