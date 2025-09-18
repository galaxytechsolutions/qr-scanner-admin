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

const emptyHouse = {
  _id: "",
  qrCode: "",
  location: "",
  state:"",
  city:"",
  booth: "",
  mandal: "",
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
  isWhatsappActive: false,
  volunteerNote: ""
};

const HouseData = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [households, setHouseholds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [newHouse, setNewHouse] = useState(emptyHouse);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await Instance.get("/houseData");
      if (response.status === 200) setHouseholds(response.data.houseData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch household data", "error");
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
          setHouseholds((prev) => prev.filter((item) => item._id !== _id));
          Swal.fire("Deleted!", "Household has been removed.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete household data", "error");
        }
      }
    });
  };

  const handleAddHousehold = async () => {
    try {
      const res = await Instance.post("/houseData", newHouse);
      if (res.status === 200 || res.status === 201) {
        Swal.fire("Added!", "Household has been Added.", "success");
        setModalOpen(false);
        setNewHouse(emptyHouse);
        getData();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to Add household data", "error");
    }
  };

  const handleUpdateHousehold = async (household) => {
    try {
      const res = await Instance.put(`/houseData/${household._id}`, household);
      if (res.status === 200) {
        Swal.fire("Updated!", "Household has been updated.", "success");
        setModalOpen(false);
        setNewHouse(emptyHouse);
        getData();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update household data", "error");
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
            <input
              className="form-control cursor-pointer border border-primary"
              type="search"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            color="success"
            onClick={() => {
              setNewHouse(emptyHouse); // reset for add
              setModalOpen(true);
            }}
          >
            + Add Household
          </Button>
        </div>

        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>QR Code</th>
                <th>Location</th>
                <th>State</th>
                <th>City</th>
                <th>Booth</th>
                <th>Mandal</th>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((household, index) => (
                <tr key={household._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{household.qrCode}</td>
                  <td>{household.location}</td>
                  <td>{household.state}</td>
                   <td>{household.city}</td>
                  <td>{household.booth}</td>
                  <td>{household.mandal}</td>
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
                  <td>{household.isWhatsappActive ? "Yes" : "No"}</td>
                  <td>{household.volunteerNote}</td>
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
                          setNewHouse({ ...household, isWhatsappActive: Boolean(household.isWhatsappActive) });
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
      </Container>

      <AddHouseholdModal
        modalOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        newHouse={newHouse}
        setNewHouse={setNewHouse}
        handleAddHousehold={handleAddHousehold}
        handleUpdateHousehold={handleUpdateHousehold}
      />
    </div>
  );
};

export default HouseData;
