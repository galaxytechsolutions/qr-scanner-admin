import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import {
  FaUserTie,
  FaTools,
  FaPenFancy,
  FaRegBuilding,
  FaRupeeSign,
  FaMoneyBillWave,
  FaFileAlt,
} from "react-icons/fa";
import { Instance } from "../../Instence/Instence";
import ConstituencyDropdown from "../../components/ContituenciesDropdown";
import { Link, useNavigate } from "react-router-dom";

const UserPanel = () => {
  const navigate = useNavigate();

  // All required states
  const [role, setRole] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [totalHouses, setTotalHouses] = useState(0);
  const [totalFieldStaff, setTotalFieldStaff] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [ratio, setRatio] = useState(null)
  // Dashboard API fetch
  const fetchDashboardSummary = async (adminId, constituencyFilter) => {
    try {
      const payload =
        admin?.role === "SuperAdmin"
          ? { id: adminId, constituency: constituencyFilter }
          : { id: adminId };

      const { data } = await Instance.post("/admin/dashboard-summary", payload);

      if (data.success) {
        setRole(data.role);
        setSelectedConstituency(data.constituency);

        setTotalHouses(data.summary.houses || 0);
        setTotalFieldStaff(data.summary.fieldStaff || 0);
        setTotalAdmins(data.summary.admins || 0);
        setTotalReferrals(data.summary.referrals || 0);
        setTotalApplications(data.summary.applications || 0);
        setTotalSchemes(data.summary.schemes || 0);
        setTotalIssues(data.summary.issues || 0);
        setRatio(data.summary.staffToHouseRatio || 0)
        if (data.earnings) {
          setTodayEarnings(data.earnings.today || 0);
          setTotalEarnings(data.earnings.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  };

  // Initial load
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const user = auth?.user;
    if (!user) return;

    setAdmin(user);
    setRole(user.role);
    setSelectedConstituency(user.constituency);

    // Admin only → send ID, SuperAdmin → send ID + constituency
    if (user.role === "SuperAdmin") {
      fetchDashboardSummary(user.id, "all");
    } else {
      fetchDashboardSummary(user.id, user.constituency);
    }
  }, []);

  // On dropdown change for SuperAdmin
  useEffect(() => {
    if (role === "SuperAdmin" && admin?.id) {
      const conFilter = selectedConstituency || "all";
      fetchDashboardSummary(admin.id, conFilter);
    }
  }, [selectedConstituency]);

  return (
    <React.Fragment>
      <Row>
        {role === "SuperAdmin" && (
          <Row className="mb-4">
            <Col md={5} lg={4}>
              <ConstituencyDropdown
                value={selectedConstituency}
                onChange={setSelectedConstituency}
                placeholder="Select Constituency"
              />

              {!selectedConstituency && (
                <div className="mt-3 text-center fw-semibold text-muted">
                  Select a constituency to view summary
                </div>
              )}
            </Col>
          </Row>
        )}
      </Row>

      {/* Header section */}
      {role === "Admin" && (
        <div className="card-title mb-4 font-size-15">
          <div className="mb-2">
            <strong>Constituency:</strong>{" "}
            <span className="text-primary">{admin?.constituency}</span>
          </div>
          <div className="mb-2">
            <strong>Admin:</strong>{" "}
            <span className="text-primary">{admin?.name}</span>
          </div>
          <div>
            <strong>Last Sync Time:</strong>{" "}
            <span className="text-primary">{new Date().toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Dashboard Cards */}
      <Row>
        {/* Houses */}
        <Col xl={3} sm={6}>
          <Card className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/house-data", { state: { constituency: selectedConstituency } })}>
            <CardBody className="d-flex align-items-center text-dark text-decoration-none">
              <FaRegBuilding className="me-3" size={28} />
              <div>
                <p className="mb-1 text-muted">Total Houses</p>
                <h5>{totalHouses}</h5>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Field Staff */}
        <Col xl={3} sm={6}>
          <Card className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/fieldStaff", { state: { constituency: selectedConstituency } })}>
            <CardBody className="d-flex align-items-center text-dark text-decoration-none">
              <FaUserTie className="me-3" size={28} />
              <div>
                <p className="mb-1 text-muted">Total Field Staff</p>
                <h5>{totalFieldStaff}</h5>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Referrals */}
        <Col xl={3} sm={6}>
          <Card className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/referrals", { state: { constituency: selectedConstituency } })}>
            <CardBody className="d-flex align-items-center text-dark text-decoration-none">
              <FaPenFancy className="me-3" size={26} />
              <div>
                <p className="mb-1 text-muted">Total Referrals</p>
                <h5>{totalReferrals}</h5>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Applications */}
        <Col xl={3} sm={6}>
          <Card className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/applications", { state: { constituency: selectedConstituency } })}>
            <CardBody className="d-flex align-items-center text-dark text-decoration-none">
              <FaFileAlt className="me-3" size={26} />
              <div>
                <p className="mb-1 text-muted">Total Applications</p>
                <h5>{totalApplications}</h5>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Schemes */}
        <Col xl={3} sm={6}>
          <Card className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/schemes")}>
            <CardBody className="d-flex align-items-center text-dark text-decoration-none">
              <FaTools className="me-3 text-danger" size={26} />
              <div>
                <p className="mb-1 text-muted">Total Schemes</p>
                <h5>{totalSchemes}</h5>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Issues */}
        <Col xl={3} sm={6}>
          <Card className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/issues", { state: { constituency: selectedConstituency } })}>
            <CardBody className="d-flex align-items-center text-dark text-decoration-none">
              <FaFileAlt className="me-3" size={26} />
              <div>
                <p className="mb-1 text-muted">Total Issues</p>
                <h5>{totalIssues}</h5>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Earnings Cards for Admin */}
        {role === "Admin" && (
          <>
            <Col xl={3} sm={6}>
              <Card className="cursor-pointer" style={{ cursor: "pointer" }}>
                <CardBody className="d-flex align-items-center text-dark">
                  <FaRupeeSign className="me-3 text-warning" size={26} />
                  <div>
                    <p className="mb-1 text-muted">Today Earnings</p>
                    <h5>₹{todayEarnings}</h5>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={3} sm={6}>
              <Card className="cursor-pointer" style={{ cursor: "pointer" }}>
                <CardBody className="d-flex align-items-center text-dark">
                  <FaMoneyBillWave className="me-3 text-success" size={26} />
                  <div>
                    <p className="mb-1 text-muted">Total Earnings</p>
                    <h5>₹{totalEarnings}</h5>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </>
        )}

        {/* Admins Card for SuperAdmin */}
        {role === "SuperAdmin" && (
          <>
            <Col xl={3} sm={6}>
              <Card>
                <CardBody tag={Link} to="/adminData" className="d-flex align-items-center text-dark text-decoration-none">
                  <FaUserTie className="me-3 text-primary" size={26} />
                  <div>
                    <p className="mb-1 text-muted">Total Admins</p>
                    <h5>{totalAdmins}</h5>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={3} sm={6}>
              <Card>
                <CardBody className="d-flex align-items-center text-dark">
                  <FaFileAlt className="me-3 text-info" size={26} />
                  <div>
                    <p className="mb-1 text-muted">Staff-Houses Ratio</p>
                    <h5>{ratio}</h5>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </>
        )}
        <Col xl={3} sm={6}>
          <Card className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/issues", { state: { constituency: selectedConstituency } })}>
            <CardBody className="d-flex align-items-center text-dark">
              <FaFileAlt className="me-3 text-info" size={26} />
              <div>
                <p className="mb-1 text-muted">Reports</p>
                <h5>{totalIssues}</h5>
              </div>
            </CardBody>
          </Card>
        </Col>


      </Row>
    </React.Fragment>
  );
};

export default UserPanel;
