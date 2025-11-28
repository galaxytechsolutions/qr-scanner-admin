import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "reactstrap";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Common/Breadcrumb";
import CustomPagination from "../AdminComponents/CustomPagination";
import { useNavigate } from "react-router-dom";
import { Instance } from "../Instence/Instence";
import AddAdminModal from "../AdminComponents/AddAdminModal";

const AdminData = () => {
  const [admins, setAdmins] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this admin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Instance.delete(`/admin/${id}`);
          setAdmins((prev) => prev.filter((admin) => admin._id !== id));
          Swal.fire("Deleted!", "The admin has been removed.", "success");
        } catch (error) {
          console.error("Error deleting admin:", error);
          Swal.fire("Error", "Failed to delete the admin.", "error");
        }
      }
    });
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin); 
    setModalOpen(true);     
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await Instance.get("/admin");
        setAdmins(Array.isArray(res.data.Admins) ? res.data.Admins : []);
        console.log("Fetched admins:", res.data?.Admins);
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    };

    fetchAdmins();
  }, []);

  const searchedData = (admins || []).filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Home QR" breadcrumbItem="Admin Data" />

        {/* Search and Add */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-md-4">
            <input
              type="search"
              className="form-control"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            color="primary"
            onClick={() => { setEditingAdmin(null); setModalOpen(true); }}
          >
            + Add Admin
          </Button>
        </div>

        {/* Admin Table */}
        <div className="table-responsive">
          <Table striped bordered hover className="text-center">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Constituency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((admin, index) => (
                  <tr key={admin._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phoneNo}</td>
                    <td>{admin.constituency || "—"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-3">
                        <FaRegEye
                          size={20}
                          title="View"
                          className="cursor-pointer"
                          onClick={() => navigate(`/adminData/${admin._id}`)}
                        />
                        <FaUserEdit
                          size={20}
                          className="cursor-pointer text-info"
                          title="Edit"
                          onClick={() => handleEdit(admin)}
                        />
                        <MdDeleteForever
                          size={22}
                          className="cursor-pointer text-danger"
                          title="Delete"
                          onClick={() => handleDelete(admin._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No admins found.
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
      </Container>
      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={modalOpen}
        toggle={() => {
          setModalOpen(!modalOpen);
          setEditingAdmin(null); // reset after closing
        }}
        onAdminAdded={(adminData) => {
          if (editingAdmin) {
            // Editing: update the existing admin in state
            setAdmins(prev =>
              prev.map((adm) => (adm._id === adminData._id ? adminData : adm))
            );
            setEditingAdmin(null);
          } else {
            // Adding new admin
            setAdmins([...admins, adminData]);
          }
        }}
        adminData={editingAdmin} // pass admin to modal
      />

    </div>
  );
};

export default AdminData;
