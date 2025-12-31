import React, { useEffect, useState } from "react";
import { Container, Spinner, Row, Col, Table, Input } from "reactstrap";
import { Card, CardBody } from "reactstrap";
import { Instance } from "../Instence/Instence";
import Breadcrumbs from "../components/Common/Breadcrumb";

const AdminEarnings = () => {
  const [dailyEarnings, setDailyEarnings] = useState([{ date: new Date().toISOString().split("T")[0], amount: 0, extra: 0 }]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [staffRecords, setStaffRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // TODAY default

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      setAdminId(obj.user?.id);
    }
  }, []);

  useEffect(() => {
    if (!adminId) return;

    const fetchEarnings = async () => {
      try {
        setLoading(true);
        setError("");

        const dailyRes = await Instance.get(`/earnings/admin/${adminId}/daily`);
        const totalRes = await Instance.get(`/earnings/admin/${adminId}/total`);

        const daily = dailyRes.data;
        setDailyEarnings([
          {
            date: daily.date,
            amount: daily.adminEarnings,
            extra: daily.extraRegistrations
          }
        ]);

        setTotalEarnings(totalRes.data?.total || 0);

        // Now fetch breakdown by selected date
        const breakdownRes = await Instance.post(`/earnings/admin-date-earnings/${adminId}`, { date });
        setStaffRecords(breakdownRes.data?.staffData || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load earnings.");
        setStaffRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [adminId, date]);

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

        {/* Admin Header */}
        <Card className="shadow-sm mb-4">
          <CardBody>
            <h5>Total Earnings</h5>
            <h2 className="text-success">₹ {totalEarnings}</h2>
          </CardBody>
        </Card>

        {/* Today's Earnings Card */}
        <Card className="shadow-lg border-0 mb-4" style={{ borderRadius: "14px" }}>
          <CardBody className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Today's Earnings</h5>
              <span className="badge bg-primary px-3 py-2">
                {dailyEarnings[0]?.date}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Earned</p>
                <h2 className="text-success fw-bold">₹ {dailyEarnings[0]?.amount}</h2>
                <p className="text-muted mb-1 mt-3">Extra Registrations</p>
                <h4 className="text-primary fw-bold">{dailyEarnings[0]?.extra}</h4>
              </div>

              <i className="ri-money-rupee-circle-fill" style={{ fontSize: "70px", opacity: 0.85 }}></i>
            </div>
          </CardBody>
        </Card>



        {/* Earnings Breakdown */}
        <div className="mt-2 mb-3 text-center">
          <h4 className="fw-bold text-primary">Earnings Breakdown</h4>
          <p className="text-muted">Showing earnings received from staff on selected date</p>
        </div>
        {/* Select Date Input */}
        <Row className="mb-4 ">
          <Col md={3}>
            <label className="fw-bold mb-1">Select Date</label>
            <Input
              type="date"
              className="border border-primary"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Col>
        </Row>
        {/* Table at Bottom */}
        <Table striped bordered hover responsive>
          <thead className="text-center">
            <tr>
              <th>S.No</th>
              <th>Staff Name</th>
              <th>Phone No</th>
              <th>Location</th>
              <th>Extra Registrations</th>
              <th>Admin Earnings</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {staffRecords.length > 0 ? (
              staffRecords.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.staffName}</td>
                  <td>{s.phoneNo}</td>
                  <td>{s.location}</td>
                  <td className="fw-semibold text-warning">{s.extraRegistrations}</td>
                  <td className="text-success fw-bold">₹ {s.adminEarningsFromThisStaff}</td>
                  <td>{date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-danger fw-bold py-4">
                  No earnings on this date
                </td>
              </tr>
            )}
          </tbody>
        </Table>

      </Container>
    </div>
  );
};

export default AdminEarnings;
