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
} from "react-icons/fa";
import { MdRealEstateAgent } from "react-icons/md";
import { Instance } from "../../Instence/Instence";
import ConstituencyDropdown from "../../components/ContituenciesDropdown";

const UserPanel = () => {
  const [role, setRole] = useState("");
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [totalHouses, setTotalHouses] = useState(0);
  const [totalFieldStaff, setTotalFieldStaff] = useState(0);

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

  // ✅ Initial data load based on role
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role;
    const adminConstituency = auth?.user?.constituency;

    setRole(userRole);

    if (userRole === "SuperAdmin") {
      setConstituencies(["Adilabad", "Karimnagar", "Hyderabad", "Warangal"]);
      fetchHouseData("");
      fetchStaffData("");
    } else if (userRole === "Admin" && adminConstituency) {
      setSelectedConstituency(adminConstituency);
      fetchHouseData(adminConstituency);
      fetchStaffData(adminConstituency);
    }
  }, []);

  // ✅ Update on dropdown change for SuperAdmin
  useEffect(() => {
    if (role === "SuperAdmin") {
      fetchHouseData(selectedConstituency);
      fetchStaffData(selectedConstituency);
    }
  }, [role, selectedConstituency]);

  return (
    <React.Fragment>
      {/* Constituency Dropdown */}
      <Row>
        {role === "SuperAdmin" && (
          <Col md={3} className="mb-3">
            <ConstituencyDropdown
              value={selectedConstituency}
              onChange={(value) => setSelectedConstituency(value)}
              constituencies={constituencies}
              placeholder="Select Constituency"
            />
          </Col>
        )}
      </Row>

      {/* Dashboard Cards */}
      <Row>
        {/* Total Houses */}
        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted align-items-center">
                <FaRegBuilding className="icon text-success me-3" size={30} />
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
            <CardBody>
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
      </Row>


      {/* (Optional) Future sections retained for reference */}

      {/* Franchise Count */}
      {/* 
        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted align-items-center">
                <MdRealEstateAgent className="icon text-warning me-3" size={30} />
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Franchise</p>
                  <h5 className="mb-3">{11}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        */}

      {/* Locations Count */}
      {/* 
        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted align-items-center">
                <FaMapMarkerAlt className="icon text-danger me-3" size={30} />
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Locations</p>
                  <h5 className="mb-3">{9}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        */}
      <Row>
        {/* <React.Fragment>
    //     <Col xl={3} sm={6}>
    //       <Card>
    //         <CardBody>
    //           <div className="d-flex text-muted">
    //             <div className="flex-shrink-0 me-3 align-self-center">
    //               <div id="radialchart-1" className="apex-charts" dir="ltr">
    //                 <RadialChart1 />
    //               </div>
    //             </div>

    //             <div className="flex-grow-1 overflow-hidden">
    //               <p className="mb-1">Users</p>
    //               <h5 className="mb-3">2.2k</h5>
    //               <p className="text-truncate mb-0">
    //                 <span className="text-success me-2">
    //                   {" "}
    //                   0.02%{" "}
    //                   <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
    //                 </span>{" "}
    //                 From previous
    //               </p>
    //             </div>
    //           </div>
    //         </CardBody>
    //       </Card>
    //     </Col>

    //     <Col xl={3} sm={6}>
    //       <Card>
    //         <CardBody>
    //           <div className="d-flex">
    //             <div className="flex-shrink-0 me-3 align-self-center">
    //               <RadialChart2
                    //                 id="radialchart-2"
                    //                 className="apex-charts"
                    //                 dir="ltr"
                    //               />
                    //             </div>

                    //             <div className="flex-grow-1 overflow-hidden">
                    //               <p className="mb-1">Views per minute</p>
                    //               <h5 className="mb-3">50</h5>
                    //               <p className="text-truncate mb-0">
                    //                 <span className="text-success me-2">
                    //                   {" "}
                    //                   1.7%{" "}
                    //                   <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
                    //                 </span>{" "}
                    //                 From previous
                    //               </p>
                    //             </div>
                    //           </div>
                    //         </CardBody>
                    //       </Card>
                    //     </Col>

                    //     <Col xl={3} sm={6}>
                    //       <Card>
                    //         <CardBody>
                    //           <div className="d-flex text-muted">
                    //             <div className="flex-shrink-0 me-3 align-self-center">
                    //               <RadialChart3
                    //                 id="radialchart-3"
                    //                 className="apex-charts"
                    //                 dir="ltr"
                    //               />
                    //             </div>

                    //             <div className="flex-grow-1 overflow-hidden">
                    //               <p className="mb-1">Bounce Rate</p>
                    //               <h5 className="mb-3">24.03 %</h5>
                    //               <p className="text-truncate mb-0">
                    //                 <span className="text-danger me-2">
                    //                   {" "}
                    //                   0.01%{" "}
                    //                   <i className="ri-arrow-right-down-line align-bottom ms-1"></i>
                    //                 </span>{" "}
                    //                 From previous
                    //               </p>
                    //             </div>
                    //           </div>
                    //         </CardBody>
                    //       </Card>
                    //     </Col>

                    //     <Col xl={3} sm={6}>
                    //       <Card>
                    //         <CardBody>
                    //           <div className="d-flex text-muted">
                    //             <div className="flex-shrink-0 me-3 align-self-center">
                    //               <div className="avatar-sm">
                    //                 <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                    //                   <i className="ri-group-line"></i>
                    //                 </div>
                    //               </div>
                    //             </div>
                    //             <div className="flex-grow-1 overflow-hidden">
                    //               <p className="mb-1">New Visitors</p>
                    //               <h5 className="mb-3">435</h5>
                    //               <p className="text-truncate mb-0">
                    //                 <span className="text-success me-2">
                    //                   {" "}
                    //                   0.01%{" "}
                    //                   <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
                    //                 </span>{" "}
                    //                 From previous
                    //               </p>
                    //             </div>
                    //           </div>
                    //         </CardBody>
                    //       </Card>
                    //     </Col>
                    //   </Row>
                    // </React.Fragment>



                    {/* Franchise Count */}
        {/* <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted align-items-center">
                <MdRealEstateAgent className="icon text-warning me-3" size={30} />
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Franchise</p>
                  <h5 className="mb-3">{11}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col> */}

        {/* Locations Count */}
        {/* <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted align-items-center">
                <FaMapMarkerAlt className="icon text-danger me-3" size={30} />
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Locations</p>
                  <h5 className="mb-3">{9}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col> */}
      </Row>
    </React.Fragment>
  );
};

export default UserPanel;
