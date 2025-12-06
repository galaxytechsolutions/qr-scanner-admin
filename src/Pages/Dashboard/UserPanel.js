import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import RadialChart1 from "./userpanelChart1";
import RadialChart2 from "./userpanelChart2";
import RadialChart3 from "./userpanelChart3";
import {
  FaUserTie,
  FaTools,
  FaPenFancy,
  FaMusic,
  FaVideo,
  FaMapMarkerAlt,
  FaRegBuilding,
  FaRupeeSign,
  FaMoneyBillWave,
  FaFileAlt,
} from "react-icons/fa";
import { MdAttachMoney, MdRealEstateAgent } from "react-icons/md";
import { Instance } from "../../Instence/Instence";
import ConstituencyDropdown from "../../components/ContituenciesDropdown";
import { Link } from "react-router-dom";

const UserPanel = () => {
  const [role, setRole] = useState("");
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [totalHouses, setTotalHouses] = useState(0);
  const [totalFieldStaff, setTotalFieldStaff] = useState(0);
const [todayEarnings, setTodayEarnings] = useState(0);
const [totalEarnings, setTotalEarnings] = useState(0);
const [admin, setAdmin]= useState(null);
// **********************************************************************************************
const [totalAdmins, setTotalAdmins] = useState(0);
const [totalReferrals, setTotalReferrals] = useState(0);
const [totalApplications, setTotalApplications] = useState(0);
const [totalSchemes, setTotalSchemes] = useState(0);


const fetchAdmins = async () => {
  try {
    const response = await Instance.get(`/admin`);
    console.log("Admins", response)
    setTotalAdmins(response.data?.Admins?.length);
  } catch (error) {
    console.error("Error fetching admins:", error);
    setTotalAdmins(0);
  }
};

const fetchReferrals = async (constituency = "") => {
  try {
    const url = constituency
      ? `/referral/constituency/${constituency}`
      : "/referral/admin";

    const { data } = await Instance.get(url);
    const referrals = data.referrals || [];
    setTotalReferrals(referrals.length);
  } catch (error) {
    console.error("Error fetching referrals:", error);
    setTotalReferrals(0);
  }
};

const fetchApplications = async (constituency = "") => {
  try {
    const url = constituency
      ? `/application/constituency/${constituency}`
      : "/application/admin";

    const { data } = await Instance.get(url);
    const apps = data.applications || [];
    setTotalApplications(apps.length);
  } catch (error) {
    console.error("Error fetching applications:", error);
    setTotalApplications(0);
  }
};

const fetchSchemes = async () => {
  try {
    const { data } = await Instance.get("/scheme");
    setTotalSchemes(data.schemes?.length || 0);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    setTotalSchemes(0);
  }
};


// ************************************************************************************************

  // ✅ Fetch functions
  const fetchHouseData = async (constituency = "") => {
    try {
      const url = constituency
        ? `/houseData/constituency/${constituency}`
        : "/houseData";
      const { data } = await Instance.get(url);
      const houses = data.houseData || data.houses || [];
      setTotalHouses(houses.length);
      console.log("Fetched houses:", houses.length);
    } catch (error) {
      console.error("Error fetching house data:", error);
      setTotalHouses(0);
    }
  };

  const fetchStaffData = async (constituency = "") => {
    try {
      const url = constituency
        ? `/staff/constituency/${constituency}`
        : "/staff";
      const { data } = await Instance.get(url);
      const staff = data.staff || [];
      setTotalFieldStaff(staff.length);
      console.log("Fetched staff:", staff.length);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setTotalFieldStaff(0);
    }
  };

// admin earnings
const fetchAdminTotalEarnings = async (adminId) => {
  try {
    const { data } = await Instance.get(`/earnings/admin/${adminId}/total`);

    setTotalEarnings(data?.totalAdminEarnings || 0);

    console.log("Admin Total Earnings:", data);
  } catch (error) {
    console.error("Error fetching admin earnings:", error);
    setTodayEarnings(0);
    setTotalEarnings(0);
  }
};

const fetchAdminTodayEarnings = async (adminId) => {
  try {
    const { data } = await Instance.get(`/earnings/admin/${adminId}/daily`);

    setTodayEarnings(data?.adminEarnings || 0);
  

    console.log("Admin Today Earnings:", data);
  } catch (error) {
    console.error("Error fetching admin earnings:", error);
    setTodayEarnings(0);
    setTotalEarnings(0);
  }
};


  // Initial data load based on role
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role;
    const adminConstituency = auth?.user?.constituency;
const adminId = auth?.user?.id;
console.log("Admin Id", adminId)
    setRole(userRole);
    setAdmin(auth?.user);
     fetchSchemes(); // always
    if (userRole === "SuperAdmin") {
      setConstituencies(["Adilabad", "Karimnagar", "Hyderabad", "Warangal"]);
      fetchHouseData("");
      fetchStaffData("");
      //  fetchAdmins("");
    fetchReferrals("");
    fetchApplications("");
    } else if (userRole === "Admin" && adminConstituency) {
      setSelectedConstituency(adminConstituency);
      fetchHouseData(adminConstituency);
      fetchStaffData(adminConstituency);
       fetchReferrals(adminConstituency);
    fetchApplications(adminConstituency);
      fetchAdminTotalEarnings(adminId);
      fetchAdminTodayEarnings(adminId)
    }
  }, []);

  // ✅ Update on dropdown change for SuperAdmin
  useEffect(() => {
    if (role === "SuperAdmin") {
      fetchHouseData(selectedConstituency);
      fetchStaffData(selectedConstituency);
       fetchAdmins();
    fetchReferrals(selectedConstituency);
    fetchApplications(selectedConstituency);
    }
  }, [role, selectedConstituency]);

  return (
    <React.Fragment>
      <Row>
      {/* Dropdown + Highlighted Message Below */}
{role === "SuperAdmin" && (
  <Row className="mb-5">
    <Col md={5} lg={4}>
      <ConstituencyDropdown
        value={selectedConstituency}
        onChange={(value) => setSelectedConstituency(value)}
        constituencies={constituencies}
        placeholder="Select Constituency"
      />

      {/* Simple highlighted message – only when nothing selected */}
      {!selectedConstituency && (
        <div className="mt-3 text-center">
          <span className=" text-gray px-4 py-2  fw-semibold ">
           select a constituency to view the constituency-wise information
          </span>
        </div>
      )}
    </Col>
  </Row>
)}
      </Row>

    {(role === "Admin" || role === "admin") && (
            <div className="card-title mb-4 font-size-15">
              <div className="mb-2">
                <strong>Constituency:</strong> <span className="text-primary">{selectedConstituency}</span>
              </div>
              <div className="mb-2">
                <strong>Admin:</strong> <span className="text-primary">{admin?.name}</span>
              </div>
              <div>
                <strong>Last Sync Time:</strong> <span className="text-primary">{new Date().toLocaleString()}</span>
              </div>
            </div>
            )}

{/* Dashboard Cards */}
<Row>

  {/* Total Houses */}
  <Col xl={3} sm={6}>
    <Card>
      <CardBody tag={Link} to="/house-data" className="text-decoration-none text-dark">
        <div className="d-flex text-muted align-items-center">
          <FaRegBuilding className="icon text-secondary me-3" size={30} />
          <div className="flex-grow-1 overflow-hidden">
            <p className="mb-1">Total Houses</p>
            <h5 className="mb-3">{totalHouses}</h5>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>

  {/* Total Field Staff */}
  <Col xl={3} sm={6}>
    <Card>
      <CardBody tag={Link} to="/fieldStaff" className="text-decoration-none text-dark">
        <div className="d-flex text-muted align-items-center">
          <FaUserTie className="icon text-primary me-3" size={30} />
          <div className="flex-grow-1 overflow-hidden">
            <p className="mb-1">Total Field Staff</p>
            <h5 className="mb-3">{totalFieldStaff}</h5>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>

  {/* -------- ADMIN ONLY CARDS -------- */}
  {(role === "Admin" || role === "admin") && (
    <>
      {/* Today Earnings */}
      <Col xl={3} sm={6}>
        <Card>
          <CardBody  className="text-decoration-none text-dark">
            <div className="d-flex text-muted align-items-center">
              <FaRupeeSign className="icon text-warning me-3" size={30} />
              <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Today Earnings</p>
                <h5 className="mb-3">₹{todayEarnings}</h5>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Total Earnings */}
      <Col xl={3} sm={6}>
        <Card>
          <CardBody className="text-decoration-none text-dark">
            <div className="d-flex text-muted align-items-center">
              <FaMoneyBillWave className="icon text-info me-3" size={30} />
              <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Total Earnings</p>
                <h5 className="mb-3">₹{totalEarnings}</h5>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )}

  {/* -------- SUPER ADMIN ONLY CARDS -------- */}
  {role === "SuperAdmin" && (
    <>
      {/* Total Admins */}
      <Col xl={3} sm={6}>
        <Card>
          <CardBody tag={Link} to="/adminData" className="text-decoration-none text-dark">
            <div className="d-flex text-muted align-items-center">
              <FaUserTie className="icon text-warning me-3" size={30} />
              <div className="flex-grow-1">
                <p className="mb-1">Total Admins</p>
                <h5 className="mb-3">{totalAdmins}</h5>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )}
      {/* Total Referrals */}
      <Col xl={3} sm={6}>
        <Card>
          <CardBody tag={Link} to="/referrals" className="text-decoration-none text-dark">
            <div className="d-flex text-muted align-items-center">
              <FaPenFancy className="icon text-info me-3" size={30} />
              <div className="flex-grow-1">
                <p className="mb-1">Total Referrals</p>
                <h5 className="mb-3">{totalReferrals} </h5>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Total Applications */}
      <Col xl={3} sm={6}>
        <Card>
          <CardBody tag={Link} to="/applications" className="text-decoration-none text-dark">
            <div className="d-flex text-muted align-items-center">
              <FaFileAlt className="icon text-dark me-3" size={30} />
              <div className="flex-grow-1">
                <p className="mb-1">Total Applications</p>
                <h5 className="mb-3">{totalApplications}</h5>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Total Schemes */}
      <Col xl={3} sm={6}>
        <Card>
          <CardBody tag={Link} to="/schemes" className="text-decoration-none text-dark">
            <div className="d-flex text-muted align-items-center">
              <FaTools className="icon text-danger me-3" size={30} />
              <div className="flex-grow-1">
                <p className="mb-1">Total Schemes</p>
                <h5 className="mb-3">{totalSchemes}</h5>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    


</Row>

    </React.Fragment>
  );
};

export default UserPanel;
