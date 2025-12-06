import React, { useEffect, useState } from "react";
import { Container, Spinner } from "reactstrap";
import { Card, CardBody } from "reactstrap";
import { Instance } from "../Instence/Instence";
import Breadcrumbs from "../components/Common/Breadcrumb";

const AdminEarnings = () => {

  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(null);
const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      setAdminId(obj.user?.id); // <-- use ID from authUser
    }
  }, []);
console.log("Admin Id", adminId);

  useEffect(() => {
      if (!adminId) return;
const fetchEarnings = async () => {
  try {
    setLoading(true);

    const [dailyRes, totalRes] = await Promise.all([
      Instance.get(`/earnings/admin/${adminId}/daily`),
      Instance.get(`/earnings/admin/${adminId}/total`),
    ]);

    const daily = dailyRes.data;

    // Convert single object → array for table usage
    setDailyEarnings([
      {
        date: daily.date,
        amount: daily.adminEarnings,
        extra: daily.extraRegistrations
      }
    ]);

    setTotalEarnings(totalRes.data?.total || 0);
  } catch (err) {
    console.log(err);
    setError("Failed to load earnings.");
  } finally {
    setLoading(false);
  }
};

    fetchEarnings();
  }, [adminId]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner />
        <p>Loading earnings...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-danger text-center mt-4">
        {error}
      </p>
    );

  return (
    <div className="page-content">
      <Container fluid={true}>
         <Breadcrumbs title="Home QR" breadcrumbItem="Admin Earnings" />
      {/* TOTAL EARNINGS CARD */}
      <Card className="shadow-sm mb-4">
        <CardBody>
          <h5>Total Earnings</h5>
          <h2 className="text-success">₹ {totalEarnings}</h2>
        </CardBody>
      </Card>


      {/* DAILY EARNINGS CARD - PREMIUM UI */}
<Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
  <CardBody className="p-4">

    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold mb-0">Today's Earnings</h5>
      <span className="badge bg-primary px-3 py-2" style={{ fontSize: "14px" }}>
        {dailyEarnings[0]?.date}
      </span>
    </div>

    <div className="d-flex justify-content-between align-items-center">

      {/* LEFT SIDE */}
      <div>
        <p className="text-muted mb-1" style={{ fontSize: "15px" }}>Total Earned</p>
        <h2 className="text-success fw-bold mb-3">
          ₹ {dailyEarnings[0]?.amount}
        </h2>

        <p className="text-muted mb-1" style={{ fontSize: "15px" }}>Extra Registrations</p>
        <h4 className="text-primary fw-bold">
          {dailyEarnings[0]?.extra}
        </h4>
      </div>

      {/* RIGHT SIDE - ICON */}
      <div>
        <i
          className="ri-money-rupee-circle-fill"
          style={{
            fontSize: "70px",
            color: "#28a745",
            opacity: 0.85,
          }}
        ></i>
      </div>

    </div>

  </CardBody>
</Card>

      </Container>

    </div>
  );
};

export default AdminEarnings;
