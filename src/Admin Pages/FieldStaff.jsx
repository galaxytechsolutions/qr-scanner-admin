import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "reactstrap";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import CustomPagination from "../AdminComponents/CustomPagination";
import FieldStaffModal from "../AdminComponents/FieldStaffModal";
import Breadcrumbs from "../components/Common/Breadcrumb";
import { Instance } from "../Instence/Instence";

const FieldStaff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staffList, setStaffList] = useState([]); // always array
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);


  // Fetch staff on mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const res = await Instance.get("staff");
        console.log("API Response:", res.data.staff);

        const staffArray = Array.isArray(res.data.staff) ? res.data.staff : [];
        setStaffList(staffArray);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError("Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Add staff
  const handleSaveStaff = async (staffData) => {
    try {
      if (editMode && selectedStaff) {
        const res = await Instance.put(`staff/${selectedStaff._id}`, staffData);
        const updated = res.data.staff || res.data;
        setStaffList((prev) =>
          prev.map((item) => (item._id === selectedStaff._id ? updated : item))
        );
        Swal.fire("Success", "Staff member updated successfully", "success");
      } else {
        const res = await Instance.post("staff", staffData);
        const added = res.data.staff || res.data;
        setStaffList((prev) => [...prev, added]);
        Swal.fire("Success", "Staff member added successfully", "success");
      }
      setModalOpen(false);
      setEditMode(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error("Error saving staff:", error.response?.data || error);
      Swal.fire("Error", error.response?.data?.error || "Failed to save staff member", "error");
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
            <input
              className="form-control cursor-pointer border border-primary"
              type="search"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button color="primary" onClick={() => setModalOpen(true)}>
            + Add Staff
          </Button>
        </div>

        {/* Loader / Error */}
        {loading && <p>Loading staff data...</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* Table */}
        {!loading && !error && (
          <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
            <Table striped bordered hover responsive >
              <thead className="text-center">
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Location Code</th>
                  <th>Assigned Region</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>WhatsApp Active</th>
                  <th>Total Houses Assigned</th>
                  <th>Total Houses Covered</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((staff, index) => (
                  <tr key={staff.staffId || index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{staff.name}</td>
                    <td>{staff.locationCode}</td>
                    <td>{staff.assignedRegion}</td>
                    <td>{staff.phoneNo}</td>
                    <td>{staff.email}</td>
                    <td>{staff.whatsappActive ? "Yes" : "No"}</td>
                    <td>{staff.assignedHouses?.length || 0}</td>
                    <td>{staff.totalHousesCovered}</td>
                    <td>{staff.notes}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <FaRegEye
                          size={20}
                          title="View"
                          className="cursor-pointer"
                          onClick={() =>
                            Swal.fire(
                              "Staff Details",
                              `<pre>${JSON.stringify(staff, null, 2)}</pre>`
                            )
                          }
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
        )}

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
      />


    </div>
  );
};

export default FieldStaff;
