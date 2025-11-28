// import React from 'react'
// import Breadcrumbs from '../components/Common/Breadcrumb'
// import { Button, Container, Table } from 'reactstrap'
// import CustomPagination from '../AdminComponents/CustomPagination';
// import { FaRegEye, FaEdit } from 'react-icons/fa'
// import { MdDeleteForever } from 'react-icons/md'
// import { useNavigate } from 'react-router-dom';

// const mockApplications = [
//   {
//     "applicantDetails": {
//       "fullName": "Ramesh Kumar",
//       "fatherOrHusbandName": "Venkataiah",
//       "dateOfBirth": "1985-06-15T00:00:00.000Z",
//       "gender": "Male",
//       "casteCategory": "BC",
//       "aadhaarNumber": "456712345678",
//       "mobileNumber": "9876543210",
//       "email": "ramesh.kumar@example.com",
//       "maritalStatus": "Married"
//     },
//     "addressInfo": {
//       "houseNumber": "2-14/B",
//       "villageOrTown": "Kondapur",
//       "mandalOrMunicipality": "Sangareddy",
//       "district": "Medak",
//       "pinCode": "502001",
//       "assemblyConstituency": "Sangareddy",
//       "addressType": "Permanent"
//     },
//     "documents": {
//       "bankPassbook": "uploads\\1762173604919.jpg",
//       "photograph": "uploads\\1762173604920.jpg",
//       "signature": "uploads\\1762173604920.jpg",
//       "additionalDocs": []
//     },
//     "bankDetails": {
//       "bankName": "State Bank of India",
//       "accountHolderName": "Ramesh Kumar",
//       "accountNumber": "123456789012",
//       "ifscCode": "SBIN0004321",
//       "accountType": "Savings"
//     },
//     "schemeSpecific": {
//       "landDetails": "4 acres in Kondapur",
//       "surveyNumber": "45/2A",
//       "pattadarPassbookNo": "PB123456789"
//     },
//     "declaration": {
//       "isDeclared": true,
//       "submissionDate": "2025-11-03T12:00:00.000Z",
//       "submissionPlace": "Sangareddy"
//     },
//     "_id": "69089eb040e4dc53c882f25e",
//     "userId": {
//       "_id": "69049e211d7cf76053075c50",
//       "phoneNo": "8853677250",
//       "constituency": "Secunderabad",
//       "headOfFamily": "Rajesh Singanahalli"
//     },
//     "schemeId": {
//       "_id": "69086d927ca81cd7df26deda",
//       "name": "Mission Kakatiya",
//       "category": "Agriculture, Rural & Environment"
//     },
//     "schemeName": "Mission Kakatiya",
//     "schemeCategory": "Agriculture, Rural & Environment",
//     "status": "Submitted",
//     "reviewedBy": null,
//     "remarks": "",
//     "createdAt": "2025-11-03T12:23:12.523Z",
//     "updatedAt": "2025-11-03T13:26:53.929Z",
//     "__v": 0
//   }
// ];

// const Applications = () => {
//   const [searchTerm, setSearchTerm] = React.useState('');
//   const [applications, setApplications] = React.useState(mockApplications);
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const itemsPerPage = 10;
//   const navigate = useNavigate();

//   const handleAddClick = () => {

//   }

//   const searchedData = applications.filter((item) =>
//     Object.values(item).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     ) ||
//     Object.values(item.applicantDetails).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const totalPages = Math.ceil(searchedData.length / itemsPerPage);
//   const paginatedData = searchedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className='page-content'>
//       <Container fluid={true}>
//         <Breadcrumbs title="Home QR" breadcrumbItem="Applications" />
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <div className="col-md-6">
//             <input
//               className="form-control cursor-pointer border border-primary"
//               type="search"
//               placeholder="Search applications..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Button color="primary" onClick={handleAddClick}>+ Add Application</Button>
//         </div>

//         <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
//           <Table striped bordered hover responsive>
//             <thead className="text-center">
//               <tr>
//                 <th>S.No.</th>
//                 <th>Applicant Name</th>
//                 <th>Mobile Number</th>
//                 <th>Scheme Name</th>
//                 <th>Scheme Category</th>
//                 <th>Applied On</th>
//                 <th>Status</th>
//                 <th>Aadhaar Number</th>
//                 <th>Email</th>
//                 <th>Gender</th>
//                 <th>District</th>
//                 <th>Reviewed By</th>
//                 <th>Remarks</th>
//                 <th>Caste Category</th>
//                 <th>Assembly Constituency</th>
//                 <th>Father/Husband Name</th>
//                 <th>Date of Birth</th>
//                 <th>Marital Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {paginatedData.map((app, index) => (
//                 <tr key={app._id}>
//                   <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                   <td>{app.applicantDetails.fullName}</td>
//                   <td>{app.applicantDetails.mobileNumber}</td>
//                   <td>{app.schemeName}</td>
//                   <td>{app.schemeCategory}</td>
//                   <td>{new Date(app.createdAt).toLocaleDateString()}</td>
//                   <td>
//                     <span className={`badge bg-${app.status === 'Submitted'
//                       ? 'warning'
//                       : app.status === 'Approved'
//                         ? 'success'
//                         : 'danger'}`}>{app.status}</span>
//                   </td>
//                   <td>{app.applicantDetails.aadhaarNumber}</td>
//                   <td>{app.applicantDetails.email}</td>
//                   <td>{app.applicantDetails.gender}</td>
//                   <td>{app.addressInfo.district}</td>
//                   <td>{app.reviewedBy || '-'}</td>
//                   <td>{app.remarks || '-'}</td>
//                   <td>{app.applicantDetails.casteCategory}</td>
//                   <td>{app.addressInfo.assemblyConstituency}</td>
//                   <td>{app.applicantDetails.fatherOrHusbandName}</td>
//                   <td>{new Date(app.applicantDetails.dateOfBirth).toLocaleDateString()}</td>
//                   <td>{app.applicantDetails.maritalStatus}</td>
//                   <td>
//                     <div className="d-flex justify-content-center gap-3">
//                       <FaRegEye size={20} className="cursor-pointer" title="View" onClick={() => navigate(`/applications/${app._id}`)} />
//                       <FaEdit size={20} className="cursor-pointer text-info" title="Edit" />
//                       <MdDeleteForever size={20} className="cursor-pointer text-danger" title="Delete" />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//         <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
//       </Container>

//     </div>
//   )
// }

// export default Applications


// Applications.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "reactstrap";
import { FaRegEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import CustomPagination from "../AdminComponents/CustomPagination";
import Breadcrumbs from "../components/Common/Breadcrumb";
import { Instance } from "../Instence/Instence";
import { useNavigate } from "react-router-dom";
import ConstituencyDropdown from "../components/ContituenciesDropdown";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [role, setRole] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role || "";
    setRole(userRole);
    setAdmin(auth?.user);
    if (userRole === "Admin" || userRole === "admin") {
      const constituency = auth?.user?.constituency || auth?.constituency || "";
      setSelectedConstituency(constituency);
    } 
  }, []);

  // Fetch applications (optionally by constituency)
  const fetchApplications = async (constituency) => {
    // console.log("Constituency =", constituency)
    try {
      setLoading(true);
      setError(null);
      const res = await Instance.get(`/application/constituency/${constituency}`);
      const apps = Array.isArray(res.data?.applications)
        ? res.data.applications
        : Array.isArray(res.data)
        ? res.data
        : res.data?.applications || [];
      setApplications(apps);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!selectedConstituency) return; 
  fetchApplications(selectedConstituency);
}, [selectedConstituency]);


  const handleConstituencyChange = (value) => {
    setSelectedConstituency(value);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await Instance.delete(`/application/${id}`);
        setApplications((prev) => prev.filter((a) => a._id !== id));
        Swal.fire("Deleted!", "Application removed.", "success");
      } catch (err) {
        console.error("Delete application error:", err);
        Swal.fire("Error", "Failed to delete application", "error");
      }
    }
  };

  const searchedData = Array.isArray(applications)
    ? applications.filter((app) => {
        if (!app) return false;

        const flatValues = [];

        // include top-level fields
        Object.keys(app).forEach((k) => {
          const v = app[k];
          if (v == null) return;
          if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
            flatValues.push(String(v).toLowerCase());
          }
        });

        // applicant nested
        if (app.applicant) {
          Object.values(app.applicant).forEach((val) => {
            if (val != null) flatValues.push(String(val).toLowerCase());
          });
        }

        // address nested
        if (app.address) {
          Object.values(app.address).forEach((val) => {
            if (val != null) flatValues.push(String(val).toLowerCase());
          });
        }

        // schemeId may contain name/category
        if (app.schemeId) {
          if (typeof app.schemeId === "string") flatValues.push(app.schemeId.toLowerCase());
          else Object.values(app.schemeId).forEach((val) => { if (val != null) flatValues.push(String(val).toLowerCase()); });
        }

        return flatValues.some((v) => v.includes(searchTerm.toLowerCase()));
      })
    : [];

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="Home QR" breadcrumbItem="Applications" />

                {(role === "Admin" || role === "admin") && (
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
          <div className="col-md-6">
            {role === "SuperAdmin" && (
              <div className="mb-2" style={{ maxWidth: 360 }}>
                <ConstituencyDropdown
                  value={selectedConstituency}
                  onChange={handleConstituencyChange}
                  placeholder="Select Constituency"
                />
              </div>
            )}
            <input
              className="form-control cursor-pointer border border-primary"
              type="search"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div>
            {/* Add button skipped as requested */}
            {/* <Button color="primary">+ Add Application</Button> */}
          </div>
        </div>

        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead className="text-center">
              <tr>
                <th>S.No.</th>
                <th>Applicant Name</th>
                <th>Mobile</th>
                <th>Scheme</th>
                <th>Category</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Aadhaar</th>
                <th>Email</th>
                <th>Gender</th>
                <th>District</th>
                <th>Reviewed By</th>
                <th>Remarks</th>
                <th>Constituency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {loading ? (
                <tr>
                  <td colSpan="15">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="15" className="text-danger">{error}</td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((app, idx) => (
                  <tr key={app._id || app.applicationId || idx}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>{app.applicant?.fullName || app.applicantDetails?.fullName || "-"}</td>
                    <td>{app.applicant?.mobile || app.applicant?.mobileNumber || app.userId?.phoneNo || "-"}</td>
                    <td>{app.schemeId?.name || app.schemeName || "-"}</td>
                    <td>{app.schemeId?.category || app.schemeCategory || "-"}</td>
                    <td>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <span className={`badge ${
                        app.status === "Approved" ? "bg-success" :
                        app.status === "Pending" ? "bg-warning" :
                        app.status === "Rejected" ? "bg-danger" : "bg-secondary"
                      }`}>
                        {app.status || "-"}
                      </span>
                    </td>
                    <td>{app.applicant?.aadhaar || app.applicantDetails?.aadhaarNumber || "-"}</td>
                    <td>{app.applicant?.email || "-"}</td>
                    <td>{app.applicant?.gender || "-"}</td>
                    <td>{app.address?.district || app.addressInfo?.district || "-"}</td>
                    <td>{app.reviewedBy ? (app.reviewedBy.name || app.reviewedBy) : "-"}</td>
                    <td>{app.remarks || "-"}</td>
                    <td>{app.userId?.constituency || "-"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-3">
                        <FaRegEye size={18} className="cursor-pointer" title="View" onClick={() => navigate(`/applications/${app._id || app.applicationId}`)} />
                        <MdDeleteForever size={18} className="cursor-pointer text-danger" title="Delete" onClick={() => handleDelete(app._id || app.applicationId)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15">No applications found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Container>
    </div>
  );
};

export default Applications;
