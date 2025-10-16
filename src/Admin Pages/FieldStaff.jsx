import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "reactstrap";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import CustomPagination from "../AdminComponents/CustomPagination";
import FieldStaffModal from "../AdminComponents/FieldStaffModal";
import Breadcrumbs from "../components/Common/Breadcrumb";
import { Instance } from "../Instence/Instence";
import { useNavigate } from "react-router-dom";
import ConstituencyDropdown from "../components/ContituenciesDropdown";

const FieldStaff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staffList, setStaffList] = useState([]); // always array
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [role, setRole] = useState("");
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");


  // Fetch staff on mount
  useEffect(() => {
    const fetchStaff = async (constituency) => {
      if (!constituency) return;
      setLoading(true);
      setError(null);
      try {
        const res = await Instance.get(`/staff/constituency/${constituency}`);
        const staffArray = Array.isArray(res.data.staff) ? res.data.staff : [];
        setStaffList(staffArray);
        console.log("Fetched staff:", staffArray);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError("Failed to load staff data");
        setStaffList([]);
      } finally {
        setLoading(false);
      }
    };


    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role || "";
    setRole(userRole);

    if (userRole === "Admin" || userRole === "admin") {
      const constituency = auth?.user?.constituency || auth?.constituency;
      setSelectedConstituency(constituency);
      fetchStaff(constituency);
    } else if (userRole === "SuperAdmin") {
      setConstituencies(["Adilabad", "Karimnagar", "Hyderabad", "Warangal"]);
    }
  }, []);

  const handleConstituencyChange = (e) => {
    const value = e.target.value;
    setSelectedConstituency(value);
    setLoading(true);
    setError(null);
    Instance.get(`/staff/constituency/${value}`)
      .then((res) => {
        setStaffList(Array.isArray(res.data.staff) ? res.data.staff : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load staff data");
        setStaffList([]);
      })
      .finally(() => setLoading(false));
  };





  // Add staff
  const handleSaveStaff = async (staffData) => {
    try {
      const formData = new FormData();

      // Append all keys
      Object.keys(staffData).forEach((key) => {
        if (staffData[key] !== undefined && staffData[key] !== null) {
          formData.append(key, staffData[key]);
        }
      });

      let res;
      if (editMode && selectedStaff) {
        res = await Instance.put(`staff/${selectedStaff._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updated = res.data.staff || res.data;
        setStaffList((prev) =>
          prev.map((item) => (item._id === selectedStaff._id ? updated : item))
        );
        Swal.fire("Success", "Staff member updated successfully", "success");
      } else {
        res = await Instance.post("staff", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const added = res.data.staff || res.data;
        setStaffList((prev) => [...prev, added]);
        Swal.fire("Success", "Staff member added successfully", "success");
      }

      setModalOpen(false);
      setEditMode(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error("Error saving staff:", error.response?.data || error);
      Swal.fire(
        "Error",
        error.response?.data?.error || "Failed to save staff member",
        "error"
      );
    }
  };

  // Delete staff
  const handleDelete = (staffId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this staff member!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // API call with correct ID
          await Instance.delete(`staff/${staffId}`);

          // Update UI
          setStaffList((prev) => prev.filter((item) => item._id !== staffId));

          Swal.fire("Deleted!", "Staff member has been removed.", "success");
        } catch (error) {
          console.error("Error deleting staff:", error);
          Swal.fire("Error", "Failed to delete staff member", "error");
        }
      }
    });
  };



  const searchedData = Array.isArray(staffList)
    ? staffList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : [];

  // Pagination
  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="QR INTI ID" breadcrumbItem="Field Staff Data" />

        {/* Search + Add */}
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


        {/* Table */}
        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive >
            <thead className="text-center">
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Location</th>
                <th>Constituency</th>
                <th>Assigned Region</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>WhatsApp Active</th>
                <th>Total Houses Covered</th>
                <th>Total Houses Assigned</th>
                <th>Notes</th>
                <th>Admin name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((staff, index) => (
                <tr key={staff.staffId || index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{staff.name || "-"}</td>
                  <td>{staff.locationCode || "-"}</td>
                  <td>{staff.constituency || "-"}</td>
                  <td>{staff.assignedRegion || "-"}</td>
                  <td>{staff.phoneNo || "-"}</td>
                  <td>{staff.email || "-"}</td>
                  <td>{staff.whatsappActive ? "Yes" : "No"}</td>
                  <td>{staff.assignedHouses?.length || 0}</td>
                  <td>{staff.totalHousesCovered || 0}</td>
                  <td>{staff.notes || "-"}</td>
                  <td>{staff.addedBy?.name || "-"}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <FaRegEye
                        size={20}
                        title="View"
                        className="cursor-pointer"
                        onClick={() => navigate(`/field-staff/${staff._id}`)}
                      />

                      <FaUserEdit
                        size={20}
                        className="cursor-pointer text-info"
                        onClick={() => {
                          setSelectedStaff(staff);
                          setEditMode(true);
                          setModalOpen(true);
                        }}
                      />

                      <MdDeleteForever
                        size={20}
                        title="Delete"
                        className="cursor-pointer text-danger"
                        onClick={() => handleDelete(staff._id)}
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

      <FieldStaffModal
        modalOpen={modalOpen}
        setModalOpen={(val) => {
          setModalOpen(val);
          if (!val) {
            setEditMode(false);
            setSelectedStaff(null);
          }
        }}
        handleSave={handleSaveStaff}
        editMode={editMode}
        existingData={selectedStaff}
        constituency={selectedConstituency}
      />


    </div>
  );
};

export default FieldStaff;
