import React, { useState } from "react";
import { Container, Table, Button } from "reactstrap";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Common/Breadcrumb";
import CustomPagination from "../AdminComponents/CustomPagination";

const mockAdmins = [
  {
    _id: "admin-001",
    name: "Rohit Sharma",
    email: "rohit@gmail.com",
    phoneNo: "9000000001",
    constituency: "Serilingampally",
  },
  {
    _id: "admin-002",
    name: "Virat Kohli",
    email: "virat@example.com",
    phoneNo: "9000000002",
    constituency: "Kukatpally",
  },
  {
    _id: "admin-003",
    name: "Suresh Varma",
    email: "suresh.varma@example.com",
    phoneNo: "9000000003",
    constituency: "Adilabad",
  },
  {
    _id: "admin-004",
    name: "Anjali Devi",
    email: "anjali.d@example.com",
    phoneNo: "9000000004",
    constituency: "Warangal",
  },
];

const AdminData = () => {
  const [admins, setAdmins] = useState(mockAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setAdmins((prev) => prev.filter((admin) => admin._id !== id));
        Swal.fire("Deleted!", "The admin has been deleted.", "success");
      }
    });
  };

  const searchedData = admins.filter((item) =>
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
      <Container fluid={true}>
        <Breadcrumbs title="QR INTI ID" breadcrumbItem="Admin Data" />
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
          <Button color="primary" onClick={() => { /* Logic to add admin */ }}>+ Add Admin</Button>
        </div>

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
              {paginatedData.map((admin, index) => (
                <tr key={admin._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.phoneNo}</td>
                  <td>{admin.constituency}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <FaRegEye size={20} className="cursor-pointer text-primary" title="View" />
                      <FaUserEdit size={20} className="cursor-pointer text-info" title="Edit" />
                      <MdDeleteForever size={22} className="cursor-pointer text-danger" title="Delete" onClick={() => handleDelete(admin._id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Container>
    </div>
  );
};

export default AdminData;