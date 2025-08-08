import React, { useState, useEffect } from "react";
import { Table, Button } from "reactstrap";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import CustomPagination from "../AdminComponents/CustomPagination";
import FieldStaffModal from "../AdminComponents/FieldStaffModal";

const dummyStaffData = [
  {
    staffId: "FS001",
    name: "Ravi Kumar",
    locationCode: "HYD-NML-001",
    assignedRegion: "Hyderabad - Nampally",
    contact: "9876543210",
    whatsappActive: true,
    totalHousesCovered: 120,
    notes: "Very active in community engagement."
  },
  {
    staffId: "FS002",
    name: "Srilatha Reddy",
    locationCode: "HYD-CHN-002",
    assignedRegion: "Hyderabad - Charminar",
    contact: "9876501234",
    whatsappActive: true,
    totalHousesCovered: 95,
    notes: "Special focus on women's welfare schemes."
  },
  {
    staffId: "FS003",
    name: "Venkatesh Goud",
    locationCode: "WGL-HNK-003",
    assignedRegion: "Warangal - Hanamkonda",
    contact: "9876123456",
    whatsappActive: false,
    totalHousesCovered: 105,
    notes: "Needs more training on data collection app."
  },
  {
    staffId: "FS004",
    name: "Fatima Begum",
    locationCode: "KNR-KRM-004",
    assignedRegion: "Karimnagar - Kothapalli",
    contact: "9876345120",
    whatsappActive: true,
    totalHousesCovered: 87,
    notes: "Well connected in local community."
  },
  {
    staffId: "FS005",
    name: "Mahesh Babu",
    locationCode: "NLG-MIR-005",
    assignedRegion: "Nalgonda - Miryalaguda",
    contact: "9876987451",
    whatsappActive: false,
    totalHousesCovered: 110,
    notes: "Focuses on agricultural welfare schemes."
  }
];

const FieldStaff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

 const [modalOpen, setModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    staffId: "",
    name: "",
    locationCode: "",
    assignedRegion: "",
    contact: "",
    whatsappActive: false,
    totalHousesCovered: "",
    notes: ""
  });

  useEffect(() => {
    setStaffList(dummyStaffData);
  }, []);

    const handleAddStaff = () => {
    if (!newStaff.staffId || !newStaff.name) {
      Swal.fire("Error", "Please fill at least Staff ID and Name", "error");
      return;
    }
    setStaffList((prev) => [...prev, newStaff]);
    setModalOpen(false);
    setNewStaff({
      staffId: "",
      name: "",
      locationCode: "",
      assignedRegion: "",
      contact: "",
      whatsappActive: false,
      totalHousesCovered: "",
      notes: ""
    });
    Swal.fire("Success", "Staff member added successfully", "success");
  };


  const handleDelete = (staffId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this staff member!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setStaffList((prev) => prev.filter((item) => item.staffId !== staffId));
        Swal.fire("Deleted!", "Staff member has been removed.", "success");
      }
    });
  };

  const searchedData = staffList.filter((item) =>
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
         <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Field Staff Data</h2>
        <Button color="primary" onClick={() => setModalOpen(true)}>+ Add Staff</Button>
      </div>
      <div className="d-flex justify-content-end">
        <div className="col-md-6 border-1px-gray">
          <input
            className="form-control cursor-pointer border border-primary"
            type="search"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="py-5" style={{ width: "100%", overflowX: "auto" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Location Code</th>
              <th>Assigned Region</th>
              <th>Contact</th>
              <th>WhatsApp Active</th>
              <th>Total Houses Covered</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((staff, index) => (
              <tr key={staff.staffId}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{staff.staffId}</td>
                <td>{staff.name}</td>
                <td>{staff.locationCode}</td>
                <td>{staff.assignedRegion}</td>
                <td>{staff.contact}</td>
                <td>{staff.whatsappActive ? "Yes" : "No"}</td>
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
                      onClick={() =>
                        Swal.fire("Edit", "Edit feature coming soon!")
                      }
                    />
                    <MdDeleteForever
                      size={20}
                      title="Delete"
                      className="cursor-pointer text-danger"
                      onClick={() => handleDelete(staff.staffId)}
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

     <FieldStaffModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        newFieldStaff={newStaff}
        setNewFieldStaff={setNewStaff}
        handleSave={handleAddStaff}
      />

    </div>
  );
};

export default FieldStaff;
