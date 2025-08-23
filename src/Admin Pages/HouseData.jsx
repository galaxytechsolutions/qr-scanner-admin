import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "reactstrap";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import CustomPagination from "../AdminComponents/CustomPagination";
import AddHouseholdModal from "../AdminComponents/AddHouseholdModal";
import Breadcrumbs from "../components/Common/Breadcrumb";

const dummyHouseData = [
  {
    qrCode: "KOD-HYD123",
    locationCode: "HYD",
    booth: "Booth 12",
    mandal: "Serilingampally",
    headOfFamily: "Ramesh Yadav",
    caste: "BC - Yadav",
    noOfMembers: 5,
    ageGenderList: "45/M, 42/F, 20/M, 18/F, 15/M",
    votedLastTime: "Congress",
    preferredParty: "BRS",
    schemesReceived: "Ration, Aasara, Kalyana Lakshmi",
    migrationInfo: "Son works in Hyderabad IT sector",
    complaints: "Need better road facilities",
    isWhatsappActive: true,
    volunteerNotes: "Family is positive towards BRS candidate"
  },
  {
    qrCode: "KOD-WGL456",
    locationCode: "WGL",
    booth: "Booth 8",
    mandal: "Hanamkonda",
    headOfFamily: "Saroja Bai",
    caste: "SC - Madiga",
    noOfMembers: 4,
    ageGenderList: "50/F, 55/M, 28/M, 24/F",
    votedLastTime: "BRS",
    preferredParty: "Congress",
    schemesReceived: "Rythu Bandhu, Pension",
    migrationInfo: "No migration",
    complaints: "Water scarcity in summer",
    isWhatsappActive: false,
    volunteerNotes: "Family undecided, leaning towards Congress"
  },
  {
    qrCode: "KOD-NZB789",
    locationCode: "NZB",
    booth: "Booth 3",
    mandal: "Nizamabad Rural",
    headOfFamily: "Mahesh Reddy",
    caste: "Reddy",
    noOfMembers: 6,
    ageGenderList: "48/M, 45/F, 22/M, 20/F, 17/M, 14/F",
    votedLastTime: "BJP",
    preferredParty: "BJP",
    schemesReceived: "Rythu Bima, PM Kisan",
    migrationInfo: "Elder son in Dubai",
    complaints: "Lack of hospital facilities nearby",
    isWhatsappActive: true,
    volunteerNotes: "Very strong BJP supporters"
  },
  {
    qrCode: "KOD-KRM234",
    locationCode: "KRM",
    booth: "Booth 15",
    mandal: "Karimnagar Urban",
    headOfFamily: "Lakshmi Narayana",
    caste: "BC - Munnur Kapu",
    noOfMembers: 3,
    ageGenderList: "60/M, 55/F, 30/M",
    votedLastTime: "Congress",
    preferredParty: "Congress",
    schemesReceived: "Pension, Ration",
    migrationInfo: "No migration",
    complaints: "Electricity cuts during summer",
    isWhatsappActive: true,
    volunteerNotes: "Active in village politics"
  }
];

const HouseData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [households, setHouseholds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const [modalOpen, setModalOpen] = useState(false);
  const [newHouse, setNewHouse] = useState({
    qrCode: "",
    locationCode: "",
    booth: "",
    mandal: "",
    headOfFamily: "",
    caste: "",
    noOfMembers: "",
    ageGenderList: "",
    votedLastTime: "",
    preferredParty: "",
    schemesReceived: "",
    migrationInfo: "",
    complaints: "",
    isWhatsappActive: false,
    volunteerNotes: ""
  });

  useEffect(() => {
    setHouseholds(dummyHouseData);
  }, []);

  const handleDelete = (qrCode) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this household data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setHouseholds((prev) => prev.filter((item) => item.qrCode !== qrCode));
        Swal.fire("Deleted!", "Household has been removed.", "success");
      }
    });
  };

   const handleAddHousehold = () => {
    setHouseholds((prev) => [...prev, newHouse]);
    setModalOpen(false);
    setNewHouse({
      qrCode: "",
      locationCode: "",
      booth: "",
      mandal: "",
      headOfFamily: "",
      caste: "",
      noOfMembers: "",
      ageGenderList: "",
      votedLastTime: "",
      preferredParty: "",
      schemesReceived: "",
      migrationInfo: "",
      complaints: "",
      isWhatsappActive: false,
      volunteerNotes: ""
    });
  };

  const searchedData = households.filter((item) =>
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
        <Button color="success" onClick={() => setModalOpen(true)}>
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
              <th>Booth</th>
              <th>Mandal</th>
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
              <th>Volunteer Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((house, index) => (
              <tr key={house.qrCode}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{house.qrCode}</td>
                <td>{house.locationCode}</td>
                <td>{house.booth}</td>
                <td>{house.mandal}</td>
                <td>{house.headOfFamily}</td>
                <td>{house.caste}</td>
                <td>{house.noOfMembers}</td>
                <td>{house.ageGenderList}</td>
                <td>{house.votedLastTime}</td>
                <td>{house.preferredParty}</td>
                <td>{house.schemesReceived}</td>
                <td>{house.migrationInfo}</td>
                <td>{house.complaints}</td>
                <td>{house.isWhatsappActive ? "Yes" : "No"}</td>
                <td>{house.volunteerNotes}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-3">
                    <FaRegEye
                      size={20}
                      title="View"
                      className="cursor-pointer"
                      onClick={() =>
                        Swal.fire(
                          "Household Details",
                          `<pre>${JSON.stringify(house, null, 2)}</pre>`
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
                      onClick={() => handleDelete(house.qrCode)}
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
/>

    </div>
  );
};

export default HouseData;
