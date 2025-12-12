import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "reactstrap";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import CustomPagination from "../AdminComponents/CustomPagination";
import AddHouseholdModal from "../AdminComponents/AddHouseholdModal";
import Breadcrumbs from "../components/Common/Breadcrumb";
import { Instance } from "../Instence/Instence";
import { useNavigate } from "react-router-dom";
import ConstituencyDropdown from "../components/ContituenciesDropdown";
import CityDropdown from "../components/CityDropdown";

const emptyHouse = {
  _id: "",
  qrCode: "",
  state: "",
  city: "",
  mandal: "",
  location: "",
  booth: "",
  constituency: "",
  phoneNo: "",
  headOfFamily: "",
  houseNo: "",
  noOfMembers: "",
  members: [],
  membersOutside: 0,
  votedLocation: "",
  votedHereNumber: 0,
  votedMembers: [],
  rationCardActive: "DontKnow",
  healthCardActive: "DontKnow",
  familyPension: "DontKnow",
  farmerIncomeSupport: "NotApplicable",
  farmerInsurance: "NotApplicable",
  lpgConnection: "DontKnow",
  housingBenefit: "DontKnow",
  electricitySubsidy: "DontKnow",
  studentScholarship: "NotApplicable",
  houseType: "",
  caste: "",
  subCaste: "",
  remarks: "",
  profilePic: "",
  paymentDetails: null
};

const stateOptions = {
  TG: "Telangana",
  AP: "Andhra Pradesh"
};

const HouseData = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [households, setHouseholds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [newHouse, setNewHouse] = useState(emptyHouse);
  const [role, setRole] = useState("");
  const [citiesList, setCitiesList] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [admin, setAdmin] = useState(null);

  const API_KEY = "RjNobEwxWTR0VFhFWVFzRWpkdWsxMjJDWXEyZmVBaDJmSVpYR1JJTg==";
  const BASE_URL = "https://api.countrystatecity.in/v1";

  // Fetch Telangana cities
  useEffect(() => {
    fetchCities("TG");
  }, []);

  const fetchCities = async (stateCode) => {
    try {
      const res = await Instance.get(
        `${BASE_URL}/countries/IN/states/${stateCode}/cities`,
        { headers: { "X-CSCAPI-KEY": API_KEY } }
      );
      // Store as objects {id, name} for dropdown
      setCitiesList(res.data.map((c) => ({ id: c.id, name: c.name })));
    } catch (err) {
      console.log("City Error:", err);
    }
  };

  useEffect(() => {
    if (role === "SuperAdmin") {
      // Reset constituency if city changes
      setSelectedConstituency("");
    }
  }, [selectedCity, role]);

  const getErrorMessage = (error) => {
    if (error.response) {
      if (error.response.data) {
        if (typeof error.response.data === "string") return error.response.data;
        if (error.response.data.error) return error.response.data.error;
        return JSON.stringify(error.response.data);
      }
      return error.response.statusText;
    }
    return error.message || "Something went wrong";
  };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const role = auth?.user?.role || auth?.role || "";
    setRole(role);
    setAdmin(auth?.user);
    if (role.toLowerCase() === "admin") {
      const constituency = auth?.user?.constituency || auth?.constituency;
      setSelectedConstituency(constituency);
      getData(constituency);
    } else if (role === "SuperAdmin") {
      setConstituencies(["Adilabad", "Karimnagar", "Hyderabad", "Warangal"]);
    }
  }, []);

  useEffect(() => {
    if (selectedConstituency) getData(selectedConstituency);
  }, [selectedConstituency]);

  const getData = async (constituency) => {
    if (!constituency) return;
    try {
      const response = await Instance.get(`/houseData/constituency/${constituency}`);
      const housesArray = Array.isArray(response.data)
        ? response.data
        : response.data.houses || [];
      setHouseholds(housesArray);
    } catch (error) {
      Swal.fire("Error", getErrorMessage(error), "error");
      setHouseholds([]);
    }
  };

  const handleConstituencyChange = (value) => {
    setSelectedConstituency(value);
    getData(value);
  };

  const handleClearFilters = () => {
    if (role.toLowerCase() === "admin") {
      setSelectedCity(null);
    } else {
      setSelectedCity(null);
      setSearchTerm("");
    }
  };

  const handleDelete = async (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this household data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Instance.delete(`/houseData/${_id}`);
          setHouseholds(prev => prev.filter(item => item._id !== _id));
          Swal.fire("Deleted!", "Household has been removed.", "success");
        } catch (error) {
          Swal.fire("Error", getErrorMessage(error), "error");
        }
      }
    });
  };


 const handleAddHousehold = async () => {
    try {

 const formatTo91 = (raw) => {
      if (!raw && raw !== 0) return "";
      let s = String(raw).replace(/\D/g, ""); // keep digits only
      // if starts with country code and longer than 10, drop leftmost until 10 remain
      if (s.length > 10) {
        // if it already contains 91 as prefix and length === 12, keep last 10
        if (s.startsWith("91") && s.length >= 12) {
          s = s.slice(-10);
        } else if (s.length > 10) {
          s = s.slice(-10);
        }
      }
      // if length is exactly 10, prefix 91
      if (s.length === 10) return "91" + s;
      // if it's already 12 and startsWith 91, keep as-is (defensive)
      if (s.length === 12 && s.startsWith("91")) return s;
      // otherwise return original digits prefixed if possible (best-effort)
      return s ? "91" + s.slice(-10) : "";
    };



      const formData = new FormData();

formData.append(
  "data",
  JSON.stringify({
    qrCode: newHouse.qrCode,
    location: newHouse.location,
    booth: newHouse.booth,
    mandal: newHouse.mandal,
    state: newHouse.state,
    city: newHouse.city,
    constituency: newHouse.constituency,
    // phoneNo: newHouse.phoneNo,
    phoneNo: formatTo91(newHouse.phoneNo),
    headOfFamily: newHouse.headOfFamily,
    houseNo: newHouse.houseNo,
    noOfMembers: newHouse.noOfMembers,
    members: newHouse.members,
    membersOutside: newHouse.membersOutside,
    votedLocation: newHouse.votedLocation,
    votedHereNumber: newHouse.votedHereNumber,
    votedMembers: newHouse.votedMembers,
    rationCardActive: newHouse.rationCardActive,
    healthCardActive: newHouse.healthCardActive,
    familyPension: newHouse.familyPension,
    farmerIncomeSupport: newHouse.farmerIncomeSupport,
    farmerInsurance: newHouse.farmerInsurance,
    lpgConnection: newHouse.lpgConnection,
    housingBenefit: newHouse.housingBenefit,
    electricitySubsidy: newHouse.electricitySubsidy,
    studentScholarship: newHouse.studentScholarship,
    houseType: newHouse.houseType,
    caste: newHouse.caste,
    subCaste: newHouse.subCaste,
    remarks: newHouse.remarks,
  })
);



      // Append profilePic if selected
      if (newHouse.profilePicFile) {
        formData.append("profilePic", newHouse.profilePicFile);
      }
      console.log(formData,"formData")
      const res = await Instance.post("/houseData", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire("Added!", "Household has been Added.", "success");
        setModalOpen(false);
        setNewHouse(emptyHouse);
        getData(selectedConstituency);
      }
    } catch (error) {
      console.error("Add household error:", error.response?.data || error.message);
      Swal.fire("Error", getErrorMessage(error), "error");
    }
  };


  const handleUpdateHousehold = async (household) => {
    try {
      const formData = new FormData();

       // EXACT SAME STRUCTURE AS ADD
    formData.append(
      "data",
      JSON.stringify({
        qrCode: household.qrCode,
        location: household.location,
        booth: household.booth,
        mandal: household.mandal,
        state: household.state,
        city: household.city,
        constituency: household.constituency,
        phoneNo: household.phoneNo,
        headOfFamily: household.headOfFamily,
        houseNo: household.houseNo,
        noOfMembers: household.noOfMembers,
        
        // Arrays
        members: household.members || [],
        membersOutside: household.membersOutside,
        votedLocation: household.votedLocation,
        votedHereNumber: household.votedHereNumber,
        votedMembers: household.votedMembers || [],

        // Scheme fields
        rationCardActive: household.rationCardActive,
        healthCardActive: household.healthCardActive,
        familyPension: household.familyPension,
        farmerIncomeSupport: household.farmerIncomeSupport,
        farmerInsurance: household.farmerInsurance,
        lpgConnection: household.lpgConnection,
        housingBenefit: household.housingBenefit,
        electricitySubsidy: household.electricitySubsidy,
        studentScholarship: household.studentScholarship,

        houseType: household.houseType,
        caste: household.caste,
        subCaste: household.subCaste,
        remarks: household.remarks,
      })
    );

      // Append profilePic if selected
      if (household.profilePicFile) {
        formData.append("profilePic", household.profilePicFile);
      }

      const res = await Instance.put(`/houseData/${household._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        Swal.fire("Updated!", "Household has been updated.", "success");
        setModalOpen(false);
        setNewHouse(emptyHouse);
        getData(selectedConstituency);
      }
    } catch (error) {
      console.error("Update household error:", error.response?.data || error.message);
      Swal.fire("Error", getErrorMessage(error), "error");
    }
  };




  const handleDownloadExcel = () => {
    const headers = [
      'S.No.',
      'QR Code',
      'State',
      'City',
      'Constituency',
      'Mandal',
      'Location',
      'Booth',
      'Phone No',
      'Head of Family',
      'House No',
      'Caste',
      'No. of Members',
      'Members',
      'Voted Location',
      'House Type',
      'Ration Card',
      'Remarks',
      'Agent Name',
      'Admin Name'
    ];

    const dataToExport = filteredData.map((household, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      household.qrCode,
      stateOptions[household.state],
      household.city,
      household.constituency,
      household.mandal,
      household.location,
      household.booth,
      household.phoneNo,
      household.headOfFamily,
      household.houseNo,
      household.caste,
      household.noOfMembers,
      household.members ? household.members.map(m => m.name).join(", ") : "",
      household.votedLocation,
      household.houseType,
      household.rationCardActive,
      household.remarks,
      household.assignedStaff?.name,
      household.adminId?.name,
    ]);

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => row.map(field => `"${field || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'households.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter households based on selected city and constituency
  const filteredData = (households || []).filter((h) => {
    const cityMatch = selectedCity
      ? h.city?.toLowerCase() === selectedCity.name.toLowerCase()
      : true;
  // ----- SEARCH FILTER -----
  const term = searchTerm.toLowerCase().trim();

  const searchMatch =
    term === "" ||
    h.qrCode?.toLowerCase().includes(term) ||
    h.houseNo?.toLowerCase().includes(term) ||
    h.phoneNo?.toString().includes(term) ||
    h.headOfFamily?.toLowerCase().includes(term);

    return cityMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);


  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="Home QR" breadcrumbItem="Household Data" />
        {role.toLowerCase() === "admin" && (
          <div className="card-title mb-4 font-size-15">
            <div className="mb-2">
              <strong>Constituency:</strong> <span className="text-primary">{selectedConstituency}</span>
            </div>
            <div>
              <strong>Admin:</strong> <span className="text-primary">{admin?.name}</span>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-md-10 border-1px-gray">
            {role === "SuperAdmin" && (
              <div className="mb-3">
                <div className="row mb-2 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label">Filter by City</label>
                    <CityDropdown
                      value={selectedCity}
                      list={citiesList}
                      onChange={(city) => setSelectedCity(city)}
                      placeholder="Select City"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Filter by Constituency</label>
                    <ConstituencyDropdown
                      value={selectedConstituency}
                      onChange={handleConstituencyChange}
                      placeholder="Select Constituency"
                    />
                  </div>
                  <div className="col-md-4 d-flex justify-content-end">
                    <Button color="secondary" onClick={handleClearFilters}>
                      Clear City
                    </Button>
                  </div>
                </div>
            
              </div>

              
            )}

            {role.toLowerCase() === "admin" && (
         <div className="mb-3">
  <div className="d-flex align-items-end gap-3">

    {/* City Dropdown - smaller width */}
    <div style={{ width: "250px" }}>
      <label className="form-label">Filter by City</label>
      <CityDropdown
        value={selectedCity}
        list={citiesList}
        onChange={(city) => setSelectedCity(city)}
        placeholder="Select City"
      />
    </div>

    {/* Clear Button right after dropdown */}
    <div>
      <Button
        color="secondary"
        size="sm"
        className="px-4"
        style={{ height: "38px" }}   // same height as dropdown
        onClick={handleClearFilters}
      >
        Clear City
      </Button>
    </div>

  </div>
</div>

            )}

            {(role !== "SuperAdmin" || selectedConstituency) && role.toLowerCase() !== "admin" && (
              <input
                className="form-control cursor-pointer border border-primary"
                type="search"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}

            {role.toLowerCase() === "admin" && (
              <input
                className="form-control cursor-pointer border border-primary"
                type="search"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>

          <div className="d-flex gap-2">
            {role.toLowerCase() === "admin" && (
              <Button color="success" onClick={handleDownloadExcel}>
                Download Excel
              </Button>
            )}
            <Button color="primary" onClick={() => setModalOpen(true)}>
              + Add House
            </Button>
          </div>
        </div>

        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead >
              <tr>
                <th>S.No.</th>
                <th>QR Code</th>
                <th>State</th>
                <th>City</th>
                <th>Constituency</th>
                <th>Mandal</th>
                <th>Location</th>
                <th>Booth</th>
                <th>Phone No</th>
                <th>Head of Family</th>
                <th>House No</th>
                <th>Caste</th>
                <th>No. of Members</th>
                <th>Members</th>
                <th>Voted Location</th>
                <th>House Type</th>
                <th>Ration Card</th>
                <th>Remarks</th>
                <th>Agent Name</th>
                <th>Admin Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((household, index) => (
                <tr key={household._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{household.qrCode}</td>
                  <td>{stateOptions[household.state]}</td>
                  <td>{household.city}</td>
                  <td>{household.constituency}</td>
                  <td>{household.mandal}</td>
                  <td>{household.location}</td>
                  <td>{household.booth}</td>
                  <td>{household.phoneNo}</td>
                  <td>{household.headOfFamily}</td>
                  <td>{household.houseNo}</td>
                  <td>{household.caste}</td>
                  <td>{household.noOfMembers}</td>
                  <td>{household.members ? household.members.map(m => m.name).join(", ") : ""}</td>
                  <td>{household.votedLocation}</td>
                  <td>{household.houseType}</td>
                  <td>{household.rationCardActive}</td>
                  <td>{household.remarks}</td>
                  <td>{household.assignedStaff?.name}</td>
                  <td>{household.adminId?.name}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <FaRegEye
                        size={20}
                        title="View"
                        className="cursor-pointer"
                        onClick={() => navigate(`/household/${household._id}`)}
                      />
                      <FaUserEdit
                        size={20}
                        className="cursor-pointer text-info"
                        onClick={() => {
                          setNewHouse({
                            ...household,
                            members: household.members || [],
                            votedMembers: household.votedMembers || [],
                          });
                          setModalOpen(true);
                        }}
                      />
                      <MdDeleteForever
                        size={20}
                        title="Delete"
                        className="cursor-pointer text-danger"
                        onClick={() => handleDelete(household._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="27" className="text-center py-5">
                    <h5 className="text-muted"> {selectedConstituency
            ? "No household found."
            : "Choose a constituency to view constituency-wise Household data."}</h5>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <AddHouseholdModal
          modalOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          newHouse={newHouse}
          setNewHouse={setNewHouse}
          handleAddHousehold={handleAddHousehold}
          handleUpdateHousehold={handleUpdateHousehold}
        />
      </Container>
    </div>
  );
};

export default HouseData;

