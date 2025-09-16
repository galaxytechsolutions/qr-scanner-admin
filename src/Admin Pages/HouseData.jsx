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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [households, setHouseholds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const [modalOpen, setModalOpen] = useState(false);
  const [newHouse, setNewHouse] = useState({
    _id:"",
    qrCode: "",
    location: "",
    booth: "",
    mandal: "",
    phoneNo:"",
    headOfFamily: "",
    caste: "",
    noOfMembers: "",
    ageGenderList:[],
    votedLastTime: "",
    preferredParty: "",
    schemesReceived: "",
    migrationInfo: "",
    complaints: "",
    isWhatsappActive: false,
    volunteerNotes: ""
  });

  // useEffect(() => {
  //   setHouseholds(dummyHouseData);
  // }, []);

  
useEffect(()=>{

    getData()

    },[])

  const getData = async ()=>{
    try {
       const response = await Instance.get("/houseData")
       if(response.status === 200){
       setHouseholds(response.data.houseData )
       }
    } catch (error) {
    Swal.fire("Error", "Failed to fetch household data", "error");    
    }
  }

const handleDelete = async (_id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this household data!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
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
    const res = await Instance.post("/houseData",newHouse)
    if(res.status === 200){
         
    setModalOpen(false);
    setNewHouse({
      _id:"",
      qrCode: "",
      location: "",
      booth: "",
      mandal: "",
      phoneNo:"",
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
    });
  }

      
    } catch (error) {
      Swal.fire("Error", "Failed to Add household data", "error"); 

      
    }
    
  };

const handleUpdateHousehold = async (household) => {
  try {
    const res = await Instance.put(`/houseData/${household._id}`, household);
    if (res.status === 200) {
      setHouseholds((prev) =>
        prev.map((item) =>
          item._id === household._id ? res.data.household : item
        )
      );
      Swal.fire("Updated!", "Household has been updated.", "success");
      setModalOpen(false);
      setNewHouse({
        _id: "",
        qrCode: "",
        location: "",
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
      });
    }
  } catch (error) {
    Swal.fire("Error", "Failed to update household data", "error");
  }
};


  const searchedData = households?.filter((item) =>
    Object.values(item)?.some((val) =>
      String(val)?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  );

  const totalPages = Math.ceil(searchedData?.length / itemsPerPage);
  const paginatedData = searchedData?.slice(
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
            {paginatedData?.map((households, index) => (
              <tr key={households._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{households.qrCode}</td>
                <td>{households.location}</td>
                <td>{households.booth}</td>
                <td>{households.mandal}</td>
                <td>{households.phoneNo}</td>
                <td>{households.headOfFamily}</td>
                <td>{households.caste}</td>
                <td>{households.noOfMembers}</td>
                <td>{households.ageGenderList}</td>
                <td>{households.votedLastTime}</td>
                <td>{households.preferredParty}</td>
                <td>{households.schemesReceived}</td>
                <td>{households.migrationInfo}</td>
                <td>{households.complaints}</td>
                <td>{households.isWhatsappActive ? "Yes" : "No"}</td>
                <td>{households.volunteerNote}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-3">
                    <FaRegEye
                      size={20}
                      title="View"
                      className="cursor-pointer"
                      onClick={() => navigate(`/household/${households._id}`)}
                    />
                    <FaUserEdit
                      size={20}
                      className="cursor-pointer text-info"
                  
                       onClick={() => {setNewHouse(households); setModalOpen(true); }}
                    />
                    <MdDeleteForever
                      size={20}
                      title="Delete"
                      className="cursor-pointer text-danger"
                      onClick={() => handleDelete(households._id)}
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
