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

const emptyHouse = {
  _id: "",
  qrCode: "",
  state: "",
  city: "",
  mandal: "",
  location: "",
  booth: "",
  phoneNo: "",
  headOfFamily: "",
  caste: "",
  noOfMembers: "",
  ageGenderList: [],
  votedLastTime: "",
  preferredParty: "",
  schemesReceived: "",
  migrationInfo: "",
  complaints: "",
  isWhatsappActive: "",
  volunteerNote: ""
};

const stateOptions = {
  "TG": "Telangana",
  "AP": "Andhra Pradesh"
}

const HouseData = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [households, setHouseholds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [newHouse, setNewHouse] = useState(emptyHouse);
  const [role, setRole] = useState("");
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");


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
    if (selectedConstituency) getData(selectedConstituency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConstituency]);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const role = auth?.user?.role || auth?.role; // adjust based on stored object
    setRole(role);

    if (role === "Admin") {
      const constituency = auth?.user?.constituency;
      setSelectedConstituency(constituency);
      getData(constituency);
    } else if (role === "SuperAdmin") {
      setConstituencies(["Adilabad", "Karimnagar", "Hyderabad", "Warangal"]);
    }
  }, []);


  const getData = async (constituency) => {
    if (!constituency) return;

    try {
      const response = await Instance.get(`/houseData/constituency/${constituency}`);
      // Ensure we store an array
      const housesArray = Array.isArray(response.data)
        ? response.data
        : response.data.houses || [];
      setHouseholds(housesArray);
      console.log("Fetched households:", housesArray);
    } catch (error) {
      Swal.fire("Error", getErrorMessage(error), "error");
      setHouseholds([]);
    }
  };


  const handleConstituencyChange = (e) => {
    const value = e.target.value;
    setSelectedConstituency(value);
    getData(value);
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
          setHouseholds((prev) => prev.filter((item) => item._id !== _id));
          Swal.fire("Deleted!", "Household has been removed.", "success");
        } catch (error) {
          Swal.fire("Error", getErrorMessage(error), "error");
        }
      }
    });
  };

  const handleAddHousehold = async () => {
    try {
      const formData = new FormData();

      // Append all fields
      formData.append("qrCode", newHouse.qrCode);
      formData.append("location", newHouse.location);
      formData.append("booth", newHouse.booth);
      formData.append("mandal", newHouse.mandal);
      formData.append("state", newHouse.state);
      formData.append("city", newHouse.city);
      formData.append("phoneNo", newHouse.phoneNo);
      formData.append("headOfFamily", newHouse.headOfFamily);
      formData.append("caste", newHouse.caste);
      formData.append("noOfMembers", newHouse.noOfMembers);
      formData.append("ageGenderList", Array.isArray(newHouse.ageGenderList) ? newHouse.ageGenderList.join(",") : newHouse.ageGenderList);
      formData.append("votedLastTime", newHouse.votedLastTime);
      formData.append("preferredParty", newHouse.preferredParty);
      formData.append("schemesReceived", newHouse.schemesReceived);
      formData.append("migrationInfo", newHouse.migrationInfo);
      formData.append("complaints", newHouse.complaints);
      formData.append("whatsappActive", newHouse.isWhatsappActive);
      formData.append("volunteerNote", newHouse.volunteerNote);

      // Append profilePic if selected
      if (newHouse.profilePicFile) {
        formData.append("profilePic", newHouse.profilePicFile);
      }

      const res = await Instance.post("/houseData", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire("Added!", "Household has been Added.", "success");
        setModalOpen(false);
        setNewHouse(emptyHouse);
        getData();
      }
    } catch (error) {
      console.error("Add household error:", error.response?.data || error.message);
      Swal.fire("Error", getErrorMessage(error), "error");
    }
  };


  const handleUpdateHousehold = async (household) => {
    try {
      const formData = new FormData();

      // Append all fields
      formData.append("qrCode", household.qrCode || "");
      formData.append("location", household.location || "");
      formData.append("booth", household.booth || "");
      formData.append("mandal", household.mandal || "");
      formData.append("state", household.state || "");
      formData.append("city", household.city || "");
      formData.append("phoneNo", household.phoneNo || "");
      formData.append("headOfFamily", household.headOfFamily || "");
      formData.append("caste", household.caste || "");
      formData.append("noOfMembers", household.noOfMembers || "");
      formData.append(
        "ageGenderList",
        Array.isArray(household.ageGenderList)
          ? household.ageGenderList.join(",")
          : household.ageGenderList
      );
      formData.append("votedLastTime", household.votedLastTime || "");
      formData.append("preferredParty", household.preferredParty || "");
      formData.append("schemesReceived", household.schemesReceived || "");
      formData.append("migrationInfo", household.migrationInfo || "");
      formData.append("complaints", household.complaints || "");
      formData.append("whatsappActive", household.isWhatsappActive);
      formData.append("volunteerNote", household.volunteerNote || "");

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
        getData();
      }
    } catch (error) {
      console.error("Update household error:", error.response?.data || error.message);
      Swal.fire("Error", getErrorMessage(error), "error");
    }
  };


  const searchedData = (households || []).filter((h) => {
    if (!h) return false;
    return Object.values(h).some((val) => {
      if (val == null) return false;
      if (Array.isArray(val)) return val.join(", ").toLowerCase().includes(searchTerm.toLowerCase());
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="QR INTI ID" breadcrumbItem="Household Data" />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-md-6 border-1px-gray">
            {role === "SuperAdmin" && (
              <div className="col-md-4 mt-2 mb-2">
                <ConstituencyDropdown
                  value={selectedConstituency}
                  onChange={(value) => {
                    setSelectedConstituency(value);
                    handleConstituencyChange({ target: { value } }); // reuse your existing logic
                  }}
                  placeholder="Select Constituency"
                />
              </div>
            )}

            {(role !== "SuperAdmin" || selectedConstituency) && (
              <input
                className="form-control cursor-pointer border border-primary"
                type="search"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )
            }
          </div>

          <Button color="primary" onClick={() => setModalOpen(true)}>
            + Add Staff
          </Button>
        </div>

        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead>
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
                <th>Caste</th>
                <th>No. of Members</th>
                <th>Age/Gender List</th>
                <th>Voted Last Time</th>
                <th>Preferred Party</th>
                <th>Schemes Received</th>
                <th>Migration Info</th>
                <th>Complaints</th>
                <th>WhatsApp Active</th>
                <th>Volunteer Note</th>
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
                  <td>{household.mandal}</td>
                  <td>{household.constituency}</td>
                  <td>{household.location}</td>
                  <td>{household.booth}</td>
                  <td>{household.phoneNo}</td>
                  <td>{household.headOfFamily}</td>
                  <td>{household.caste}</td>
                  <td>{household.noOfMembers}</td>
                  <td>{household.ageGenderList}</td>
                  <td>{household.votedLastTime}</td>
                  <td>{household.preferredParty}</td>
                  <td>{household.schemesReceived}</td>
                  <td>{household.migrationInfo}</td>
                  <td>{household.complaints}</td>
                  <td>{household.whatsappActive ? "Yes" : "No"}</td>
                  <td>{household.volunteerNote}</td>
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
                            isWhatsappActive: Boolean(household.whatsappActive),
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
            </tbody>
          </Table>
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Container >

      <AddHouseholdModal
        modalOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        newHouse={newHouse}
        setNewHouse={setNewHouse}
        handleAddHousehold={handleAddHousehold}
        handleUpdateHousehold={handleUpdateHousehold}
      />
    </div >
  );
};

export default HouseData;
