// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Badge, Image, Button, Spinner } from "react-bootstrap";
// import {
//   FaMapMarkerAlt,
//   FaUsers,
//   FaVoteYea,
//   FaInfoCircle,
//   FaStickyNote,
//   FaUserTie,
//   FaIdBadge,
// } from "react-icons/fa";
// import { BsTelephoneFill } from "react-icons/bs";
// import { MdOutlineLocationOn } from "react-icons/md";
// import { Instance } from "../../Instence/Instence";
// import { useParams } from "react-router-dom";
// import { ImgBaseUrl } from "../../Instence/ImgInstence";
// import PropertyLocation from "./PropertyLocation";


// const HouseDataDetails = () => {
//   const { id } = useParams();
//   const [house, setHouse] = useState(null);
// const [address, setAddress] = useState("");
// const [verifying, setVerifying] = useState(false);

//   useEffect(() => {
//     const fetchHouseData = async () => {
//       try {
//         const res = await Instance.get(`/houseData/${id}`);
//         console.log("Fetched House Details:", res.data);
//         setHouse(res.data.houseData);
//       } catch (err) {
//         console.error("Error fetching house details:", err);
//       }
//     };

//     fetchHouseData();
//   }, [id]);



// useEffect(() => {
//   const fetchAddress = async () => {
//     try {
//       if (house?.paymentDetails?.gps?.lat && house?.paymentDetails?.gps?.lng) {
//         const { lat, lng } = house.paymentDetails.gps;
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//         );
//         const data = await response.json();
//         setAddress(data.display_name || "Address not available");
//       }
//     } catch (error) {
//       console.error("Error fetching address:", error);
//       setAddress("Address not found");
//     }
//   };

//   fetchAddress();
// }, [house]);


// const handleVerifyPayment = async (status) => {
//   try {
//     setVerifying(true);
//     const res = await Instance.put(`/houseData/${house._id}/verify-payment`, {
//       status, // "verified" or "rejected"
//     });

//     // ✅ Update UI instantly
//     setHouse((prev) => ({
//       ...prev,
//       paymentDetails: {
//         ...prev.paymentDetails,
//         verificationStatus: res.data.paymentDetails.verificationStatus,
//       },
//     }));

//     setVerifying(false);
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     setVerifying(false);
//   }
// };


//   if (!house) {
//     return (
//       <Container className="my-5 text-center">
//         <p>Loading house data...</p>
//       </Container>
//     );
//   }

//   const InfoRow = ({ label, value }) => (
//     <p className="mb-2">
//       <span className="fw-semibold text-muted">{label}: </span>
//       <span className="text-dark">{value}</span>
//     </p>
//   );

//   const AssignedStaffWidget = ({ staff }) => {
//     if (!staff) return null;
//     return (
//       <Card className="p-4 shadow-sm rounded-4 border-0">
//         <div className="d-flex align-items-center gap-3 mb-4">
//           <div className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle p-3 shadow-sm">
//             <FaUserTie size={22} />
//           </div>
//           <div>
//             <p className="mb-1 text-muted small">Assigned Staff</p>
//             <h5 className="fw-bold text-dark mb-0">{staff.name}</h5>
//           </div>
//         </div>
//         <div className="ps-1">
//           <div className="mb-4 d-flex align-items-center gap-2">
//             <BsTelephoneFill className="text-primary" size={16} />
//             <span className="fw-semibold text-dark">{staff.phoneNo}</span>
//           </div>
//           <div className="mb-4 d-flex align-items-center gap-2">
//             <MdOutlineLocationOn className="text-danger" size={18} />
//             <span className="fw-semibold text-dark">{staff.assignedRegion}</span>
//           </div>
//           <div className="d-flex align-items-center gap-2">
//             <FaIdBadge className="text-success" size={18} />
//             <span className="fw-semibold text-dark">ID: {staff._id}</span>
//           </div>
//         </div>
//       </Card>
      

      
//     );
//   };

//   return (
//     <Container className="my-5 page-content" style={{ maxWidth: "1100px" }}>
//       <Row className="g-4 mb-4">
//         <Col md={8}>
//           <Card className="p-4 shadow-sm rounded-4">
//             <Row className="align-items-center g-4">
//               <Col md={3} className="text-center">
//                 <Image
//                   src={`${ImgBaseUrl}${house.profilePic}`}
//                   alt="Profile"
//                   fluid
//                   roundedCircle
//                   style={{ width: "120px", height: "120px", objectFit: "cover" }}
//                 />
//               </Col>
//               <Col md={6}>
//                 <h3 className="fw-bold mb-3">{house.headOfFamily}</h3>
//                 <InfoRow label="Phone" value={house.phoneNo} />
//                 <InfoRow
//                   label="WhatsApp Active"
//                   value={
//                     house.whatsappActive ? (
//                       <Badge bg="success" pill>
//                         Active
//                       </Badge>
//                     ) : (
//                       <Badge bg="secondary" pill>
//                         Inactive
//                       </Badge>
//                     )
//                   }
//                 />
//                 <InfoRow label="Role" value={house.role} />
//                 <InfoRow
//                   label="Created At"
//                   value={new Date(house.createdAt).toLocaleString()}
//                 />
//                 <InfoRow
//                   label="Updated At"
//                   value={new Date(house.updatedAt).toLocaleString()}
//                 />
//               </Col>
//               <Col md={3} className="text-center">
//                 <Image
//                   src={house.qrCodeImage}
//                   alt="QR Code"
//                   fluid
//                   rounded
//                   style={{ width: "100px", height: "100px", objectFit: "contain" }}
//                 />

//                 <p className="mt-2 fw-semibold text-muted">{house.qrCode}</p>
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <AssignedStaffWidget staff={house.assignedStaff} />
//         </Col>
//       </Row>

//       <Row className="mb-5">
//         <Col md={8}>
//           <Card className="p-4 mb-4 shadow-sm rounded-4">
//             <h5 className="fw-bold mb-3 text-primary">
//               <FaMapMarkerAlt className="me-2" />
//               Location Details
//             </h5>
//             <Row>
//               <Col md={4}>
//                 <InfoRow label="Location" value={house.location} />
//               </Col>
//               <Col md={4}>
//                 <InfoRow label="Booth" value={house.booth} />
//               </Col>
//               <Col md={4}>
//                 <InfoRow label="Mandal" value={house.mandal} />
//               </Col>
//             </Row>
//           </Card>

//           <Card className="p-4 mb-4 shadow-sm rounded-4">
//             <h5 className="fw-bold mb-3 text-primary">
//               <FaUsers className="me-2" />
//               Family Details
//             </h5>
//             <Row>
//               <Col md={4}>
//                 <InfoRow label="Caste" value={house.caste} />
//               </Col>
//               <Col md={4}>
//                 <InfoRow label="Members" value={house.noOfMembers} />
//               </Col>
//               <Col md={4}>
//                 <InfoRow
//                   label="Age/Gender"
//                   value={(house.ageGenderList || []).join(", ")}
//                 />
//               </Col>
//             </Row>
//           </Card>

//           <Card className="p-4 mb-4 shadow-sm rounded-4">
//             <h5 className="fw-bold mb-3 text-primary">
//               <FaVoteYea className="me-2" />
//               Voting Information
//             </h5>
//             <Row>
//               <Col md={6}>
//                 <InfoRow
//                   label="Preferred Party 2024"
//                   value={house.preferredParty}
//                 />
//               </Col>
//             </Row>
//           </Card>

//           <Card className="p-4 mb-4 shadow-sm rounded-4">
//             <h5 className="fw-bold mb-3 text-primary">
//               <FaInfoCircle className="me-2" />
//               Other Information
//             </h5>
//             <Row>
//               <Col md={6}>
//                 <InfoRow
//                   label="Schemes Received"
//                   value={(house.schemesReceived || []).join(", ")}
//                 />
//               </Col>
//               <Col md={6}>
//                 <InfoRow label="Migration Info" value={house.migrationInfo} />
//               </Col>
//             </Row>
//             <InfoRow label="Complaints / Mood" value={house.complaints} />
//           </Card>

//           <Card className="p-4 mb-4 shadow-sm rounded-4">
//             <h5 className="fw-bold mb-3 text-primary">
//               <FaStickyNote className="me-2" />
//               Volunteer Notes
//             </h5>
//             <p className="text-dark">{house.volunteerNote}</p>
//           </Card>



// {house.paymentDetails && (
//   <Card className="p-4 mb-4 shadow-sm rounded-4">
//     <h5 className="fw-bold mb-3 text-primary">
//       💰 Payment Details
//     </h5>

//     <Row>
//       <Col md={4}>
//         <InfoRow
//           label="Payment Method"
//           value={house.paymentDetails.paymentMethod}
//         />
//       </Col>
//       <Col md={4}>
//         <InfoRow label="Amount (₹)" value={house.paymentDetails.amount} />
//       </Col>
//       <Col md={4}>
//         <InfoRow
//           label="Verification Status"
//           value={
//             <Badge
//               bg={
//                 house.paymentDetails.verificationStatus === "verified"
//                   ? "success"
//                   : house.paymentDetails.verificationStatus === "rejected"
//                   ? "danger"
//                   : "warning"
//               }
//               pill
//             >
//               {house.paymentDetails.verificationStatus}
//             </Badge>
//           }
//         />
//       </Col>
//     </Row>

//     <Row className="mt-3">
//       {house.paymentDetails.cashReceiptNumber && (
//         <Col md={6}>
//           <InfoRow
//             label="Cash Receipt Number"
//             value={house.paymentDetails.cashReceiptNumber}
//           />
//         </Col>
//       )}
//       <Col md={6}>
//         <InfoRow
//           label="Timestamp"
//           // value={new Date(house.paymentDetails.timestamp).toLocaleString()}
//           value={new Date(house.paymentDetails.timestamp).toLocaleString("en-IN", {
//   day: "2-digit",
//   month: "long",
//   year: "numeric",
//   hour: "2-digit",
//   minute: "2-digit",
//   hour12: true,
// })}

//         />
//       </Col>
//     </Row>

//     <Row className="mt-3">
//   <Col md={6}>
//     <InfoRow
//       label="GPS Coordinates"
//       value={`Lat: ${house.paymentDetails.gps?.lat}, Lng: ${house.paymentDetails.gps?.lng}`}
//     />
//     <InfoRow
//       label="Address"
//       value={address || "Fetching address..."}
//     />
//   </Col>
//       <Col md={6} className="text-center">
//         {house.paymentDetails.paymentProofImage && (
//           <div>
//             <p className="text-muted small mb-2">Payment Proof</p>
//             <Image
//               src={`${ImgBaseUrl}${house.paymentDetails.paymentProofImage}`}
//               alt="Payment Proof"
//               fluid
//               rounded
//               style={{
//                 width: "100%",
//                 maxWidth: "280px",
//                 height: "auto",
//                 objectFit: "cover",
//                 border: "1px solid #eee",
//                 borderRadius: "10px",
//               }}
//             />
//           </div>
//         )}
//       </Col>
//     </Row>

// {house.paymentDetails.verificationStatus === "pending" && (
//   <div className="text-end mt-4">
//     <Button
//       variant="success"
//       className="me-2"
//       disabled={verifying}
//       onClick={() => handleVerifyPayment("verified")}
//     >
//       {verifying ? <Spinner size="sm" animation="border" /> : "Mark as Verified"}
//     </Button>

//     <Button
//       variant="danger"
//       disabled={verifying}
//       onClick={() => handleVerifyPayment("rejected")}
//     >
//       {verifying ? <Spinner size="sm" animation="border" /> : "Reject"}
//     </Button>
//   </div>
// )}

//   </Card>
// )}



//         </Col>
//         <Col md={4}></Col>
//       </Row>

//         <Row className="">
//         <Col md={8}>
//           <PropertyLocation property={house} /> 
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default HouseDataDetails;











import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Image,
  Button,
  Spinner,
} from "react-bootstrap";
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
import { ImgBaseUrl } from "../../Instence/ImgInstence";
import { useParams } from "react-router-dom";
import PropertyLocation from "./PropertyLocation";
import QRCode from "react-qr-code";
import dummy from "../../assets/images/dummy.png";


const HouseDataDetails = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [address, setAddress] = useState("");
  const [verifying, setVerifying] = useState(false);
const [userSchemes, setUserSchemes] = useState([]);

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const res = await Instance.get(`/houseData/${id}`);
        setHouse(res.data.houseData);
      } catch (err) {
        console.error("Error fetching house details:", err);
      }
    };

    fetchHouseData();
  }, [id]);


useEffect(() => {
  if (!house?._id) return;

  const fetchSchemes = async () => {
    try {
      const res = await Instance.get(`/scheme/user/${house._id}`);
      setUserSchemes(res.data.schemes || []);
    } catch (err) {
      console.error("Error fetching user schemes:", err);
    }
  };

  fetchSchemes();
}, [house]);



  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (house?.paymentDetails?.gps?.lat && house?.paymentDetails?.gps?.lng) {
          const { lat, lng } = house.paymentDetails.gps;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          setAddress(data.display_name || "Address not available");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [house]);

  const handleVerifyPayment = async (status) => {
    try {
      setVerifying(true);
      const res = await Instance.put(
        `/houseData/${house._id}/verify-payment`,
        { status }
      );

      setHouse((prev) => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          verificationStatus: res.data.paymentDetails.verificationStatus,
        },
      }));

      setVerifying(false);
    } catch (error) {
      console.error("Error verifying payment:", error);
      setVerifying(false);
    }
  };

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
console.log("Single House Details", house);
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
      {/* TOP SECTION */}
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="p-4 shadow-sm rounded-4">
            <Row className="align-items-center g-4">
              <Col md={3} className="text-center">
                <Image
                  src={`${ImgBaseUrl}${house.profilePic}`}
                   onError={(e) => {
                      e.target.onerror = null;   
                      e.target.src = dummy;      
                    }}
                  alt="Profile"
                  fluid
                  roundedCircle
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </Col>

              <Col md={6}>
                <h3 className="fw-bold mb-3">{house.headOfFamily}</h3>

                <InfoRow label="Phone" value={house.phoneNo} />
                <InfoRow label="House Type" value={house.houseType} />

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
                {/* <Image
                  src={house.qrCodeImage || house.qrCode}
                  alt="QR Code"
                  fluid
                  rounded
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                /> */}
                <QRCode value={house.qrCode} size={120} />

                <p className="mt-2 fw-semibold text-muted">{house.qrCode}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={4}>
          <AssignedStaffWidget staff={house.assignedStaff} />
        </Col>
      </Row>

      {/* LOCATION DETAILS */}
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
                <InfoRow label="City" value={house.city} />
              </Col>
              <Col md={4}>
                <InfoRow label="State" value={house.state} />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={4}>
                <InfoRow label="Booth" value={house.booth} />
              </Col>
              <Col md={4}>
                <InfoRow label="Mandal" value={house.mandal} />
              </Col>
              <Col md={4}>
                <InfoRow label="Constituency" value={house.constituency} />
              </Col>
            </Row>
          </Card>

          {/* FAMILY DETAILS */}
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
                <InfoRow label="Sub Caste" value={house.subCaste} />
              </Col>
              <Col md={4}>
                <InfoRow label="No. of Members" value={house.noOfMembers} />
              </Col>
            </Row>

            <h6 className="mt-3 fw-bold">Members List:</h6>
            {house.members?.map((m, i) => (
              <p key={i} className="ms-2 mb-1">
                <strong>{i + 1}. {m.name}</strong> ({m.gender}, {m.age} yrs)  
                <br />
                <small className="text-muted">{m.phoneNo}</small>
              </p>
            ))}
          </Card>

          {/* VOTING INFO */}
          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaVoteYea className="me-2" />
              Voting Information
            </h5>

            <Row>
              <Col md={4}>
                <InfoRow label="Members Outside" value={house.membersOutside} />
              </Col>
              <Col md={4}>
                <InfoRow label="Voted Location" value={house.votedLocation} />
              </Col>
              <Col md={4}>
                <InfoRow label="Voters Here" value={house.votedHereNumber} />
              </Col>
            </Row>

            {house.votedMembers?.length > 0 && (
              <>
                <h6 className="fw-bold mt-3">Voters List</h6>
                {house.votedMembers.map((v, i) => (
                  <p key={i} className="ms-2 mb-1">
                    <strong>{i + 1}. {v.voterName}</strong> — {v.voterNumber}
                  </p>
                ))}
              </>
            )}
          </Card>

          {/* GOVT SCHEMES */}
          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaInfoCircle className="me-2" />
              Government Schemes Status
            </h5>

            <Row>
              <Col md={4}><InfoRow label="Ration Card" value={house.rationCardActive} /></Col>
              <Col md={4}><InfoRow label="Health Card" value={house.healthCardActive} /></Col>
              <Col md={4}><InfoRow label="Pension" value={house.familyPension} /></Col>
            </Row>

            <Row className="mt-3">
              <Col md={4}><InfoRow label="Rythu Bandhu" value={house.farmerIncomeSupport} /></Col>
              <Col md={4}><InfoRow label="Rythu Bheema" value={house.farmerInsurance} /></Col>
              <Col md={4}><InfoRow label="LPG Connection" value={house.lpgConnection} /></Col>
            </Row>

            <Row className="mt-3">
              <Col md={4}><InfoRow label="Housing Benefit" value={house.housingBenefit} /></Col>
              <Col md={4}><InfoRow label="Electricity Subsidy" value={house.electricitySubsidy} /></Col>
              <Col md={4}><InfoRow label="Student Scholarship" value={house.studentScholarship} /></Col>
            </Row>
          </Card>

          {/* REMARKS */}
          <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">
              <FaStickyNote className="me-2" />
              Remarks
            </h5>
            <p className="text-dark">{house.remarks || "No remarks"}</p>
          </Card>

          {/* APPLIED SCHEMES */}
          {/* <Card className="p-4 mb-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3 text-primary">Applied Schemes</h5>

            {house.appliedSchemes?.length === 0 ? (
              <p className="text-muted">No schemes applied.</p>
            ) : (
              house.appliedSchemes.map((s, i) => (
                <p key={i} className="mb-1">
                  <strong>{i + 1}.</strong> Scheme ID: {s.schemeId}
                  <br />
                  <small className="text-muted">
                    Applied At: {new Date(s.appliedAt).toLocaleString()}
                  </small>
                </p>
              ))
            )}
          </Card> */}
          {/* USER SCHEME LIST (FROM NEW API) */}
<Card className="p-4 mb-4 shadow-sm rounded-4">
  <h5 className="fw-bold mb-3 text-primary">User Applied Schemes</h5>

  {userSchemes.length === 0 ? (
    <p className="text-muted">No schemes applied.</p>
  ) : (
    userSchemes.map((scheme, index) => (
      <div key={index} className="mb-3 p-2 border rounded">
        <p className="mb-1">
          <strong>{index + 1}. {scheme.name}</strong>
        </p>
        <p className="mb-0 text-muted">
          <strong>Category:</strong> {scheme.category}
        </p>
      </div>
    ))
  )}
</Card>


          {/* PAYMENT DETAILS */}
          {house.paymentDetails && (
            <Card className="p-4 mb-4 shadow-sm rounded-4">
              <h5 className="fw-bold mb-3 text-primary">💰 Payment Details</h5>

              <Row>
                <Col md={4}>
                  <InfoRow label="Payment Method" value={house.paymentDetails.paymentMethod} />
                </Col>
                <Col md={4}>
                  <InfoRow label="Amount (₹)" value={house.paymentDetails.amount} />
                </Col>
                <Col md={4}>
                  <InfoRow
                    label="Verification Status"
                    value={
                      <Badge
                        bg={
                          house.paymentDetails.verificationStatus === "verified"
                            ? "success"
                            : house.paymentDetails.verificationStatus === "rejected"
                            ? "danger"
                            : "warning"
                        }
                        pill
                      >
                        {house.paymentDetails.verificationStatus}
                      </Badge>
                    }
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                {house.paymentDetails.cashReceiptNumber && (
                  <Col md={6}>
                    <InfoRow
                      label="Cash Receipt Number"
                      value={house.paymentDetails.cashReceiptNumber}
                    />
                  </Col>
                )}

                <Col md={6}>
                  <InfoRow
                    label="Timestamp"
                    value={new Date(house.paymentDetails.timestamp).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={6}>
                  <InfoRow
                    label="GPS Coordinates"
                    value={`Lat: ${house.paymentDetails.gps?.lat}, Lng: ${house.paymentDetails.gps?.lng}`}
                  />
                  <InfoRow label="Address" value={address || "Fetching address..."} />
                </Col>

                <Col md={6} className="text-center">
                  {house.paymentDetails.paymentProofImage && (
                    <>
                      <p className="text-muted small mb-2">Payment Proof</p>
                      <Image
                        src={`${ImgBaseUrl}${house.paymentDetails.paymentProofImage}`}
                        alt="Payment Proof"
                        fluid
                        rounded
                        style={{
                          width: "100%",
                          maxWidth: "280px",
                          height: "auto",
                          objectFit: "cover",
                          border: "1px solid #eee",
                          borderRadius: "10px",
                        }}
                      />
                    </>
                  )}
                </Col>
              </Row>

              {house.paymentDetails.verificationStatus === "pending" && (
                <div className="text-end mt-4">
                  <Button
                    variant="success"
                    className="me-2"
                    disabled={verifying}
                    onClick={() => handleVerifyPayment("verified")}
                  >
                    {verifying ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Mark as Verified"
                    )}
                  </Button>

                  <Button
                    variant="danger"
                    disabled={verifying}
                    onClick={() => handleVerifyPayment("rejected")}
                  >
                    {verifying ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </Col>

        <Col md={4}></Col>
      </Row>

      {/* PROPERTY LOCATION MAP */}
      <Row className="">
        <Col md={8}>
          <PropertyLocation property={house} />
        </Col>
      </Row>
    </Container>
  );
};

export default HouseDataDetails;
