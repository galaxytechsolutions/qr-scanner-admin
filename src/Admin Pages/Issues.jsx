// import React, { useEffect, useState } from "react";
// import { Table, Container } from "reactstrap";
// import Swal from "sweetalert2";
// import Breadcrumbs from "../components/Common/Breadcrumb";
// import CustomPagination from "../AdminComponents/CustomPagination";
// import { FaRegEye, FaTrashAlt } from "react-icons/fa";
// import { Instance } from "../Instence/Instence";
// import ConstituencyDropdown from "../components/ContituenciesDropdown";
// import { ImgBaseUrl } from "../Instence/ImgInstence";
// import { useNavigate } from "react-router-dom";

// const Issues = () => {
//   const [issues, setIssues] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [role, setRole] = useState("");
//   const [selectedConstituency, setSelectedConstituency] = useState("");
//   const [admin, setAdmin] = useState(null);
//   const [error, setError] = useState(null);
//   const itemsPerPage = 10;
// const navigate = useNavigate()
//   // Error helper
//   const getErrorMessage = (error) => {
//     if (error?.response?.data) {
//       if (typeof error.response.data === "string") return error.response.data;
//       if (error.response.data.error) return error.response.data.error;
//       return JSON.stringify(error.response.data);
//     }
//     return error?.message || "Something went wrong";
//   };

//   // Fetch issues for selected constituency
//   const fetchIssuesByConstituency = async (constituency) => {
//     if (!constituency) {
//       setIssues([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await Instance.get("/issue/all");
//       const arr = Array.isArray(res.data.issues) ? res.data.issues : [];
//       const filtered = arr.filter(
//         (i) => i.staffConstituency === constituency
//       );
//       setIssues(filtered);
//     } catch (err) {
//       console.error("Error fetching issues:", err);
//       setError("Failed to load issues");
//       Swal.fire("Error", getErrorMessage(err), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all issues for SuperAdmin
//   const fetchAllIssues = async () => {
//     setLoading(true);
//     try {
//       const token = JSON.parse(localStorage.getItem("authUser"))?.token;

//       const res = await Instance.get("/issue/all", {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });

//       const arr = Array.isArray(res.data.issues) ? res.data.issues : [];
//       setIssues(arr);
//     } catch (err) {
//       console.error("Error fetching issues:", err);
//       setError("Failed to load issues");
//       Swal.fire("Error", "Failed to load issue data.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     const auth = JSON.parse(localStorage.getItem("authUser"));
//     const userRole = auth?.user?.role || auth?.role || "";

//     setRole(userRole);
//     setAdmin(auth?.user);

//     if (userRole === "Admin" || userRole === "admin") {
//       const constituency = auth?.user?.constituency;
//       setSelectedConstituency(constituency);
//       fetchIssuesByConstituency(constituency);
//     } else if (userRole === "SuperAdmin") {
//       fetchAllIssues();
//     }
//   }, []);

//   // Delete Issue
//   const handleDeleteIssue = async (id) => {
//     const result = await Swal.fire({
//       title: "Delete this issue?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         await Instance.delete(`/issue/${id}`);
//         setIssues((prev) => prev.filter((i) => i._id !== id));
//         Swal.fire("Deleted!", "Issue removed successfully", "success");
//       } catch (err) {
//         console.error("Delete error:", err);
//         Swal.fire("Error", getErrorMessage(err), "error");
//       }
//     }
//   };

//   // Search filter
//   const searchedData = issues.filter((item) =>
//     Object.values(item).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const totalPages = Math.ceil(searchedData.length / itemsPerPage);
//   const paginatedData = searchedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="page-content">
//       <Container fluid={true}>
//         <Breadcrumbs title="Home QR" breadcrumbItem="Reported Issues" />

//         {/* Admin Info */}
//         {(role === "Admin" || role === "admin") && (
//           <div className="card-title mb-4 font-size-15">
//             <div className="mb-2">
//               <strong>Constituency:</strong>{" "}
//               <span className="text-primary">{selectedConstituency}</span>
//             </div>
//             <div>
//               <strong>Admin:</strong>{" "}
//               <span className="text-primary">{admin?.name}</span>
//             </div>
//           </div>
//         )}

//         {/* Super Admin Filter */}
//         {role === "SuperAdmin" && (
//           <div className="mb-3 col-md-6">
//             <ConstituencyDropdown
//               value={selectedConstituency}
//               onChange={(value) => {
//                 setSelectedConstituency(value);
//                 fetchIssuesByConstituency(value);
//               }}
//               placeholder="Select Constituency"
//             />
//           </div>
//         )}

//         {/* Search */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <div className="col-md-6">
//             <input
//               className="form-control border border-primary"
//               type="search"
//               placeholder="Search issues..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
//           <Table striped bordered hover responsive>
//             <thead className="text-center">
//               <tr>
//                 <th>S.No</th>
//                 <th>Issue Type</th>
//                 <th>Remarks</th>
//                 <th>Staff</th>
//                 <th>Constituency</th>
//                 <th>Image</th>
//                 <th>Created</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody className="text-center">
//               {loading ? (
//                 <tr>
//                   <td colSpan="8">Loading...</td>
//                 </tr>
//               ) : paginatedData.length > 0 ? (
//                 paginatedData.map((issue, index) => (
//                   <tr key={issue._id}>
//                     <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                     <td>{issue.issueType}</td>
//                     <td>{issue.remarks || "-"}</td>
//                     <td>{issue.staffId?.name || "-"}</td>
//                     <td>{issue.staffConstituency || "-"}</td>
//                     <td>
//                       {issue.image ? (
//                         <img
//                           src={`${ImgBaseUrl}${issue.image}`}
//                           alt="issue"
//                           style={{
//                             width: 60,
//                             height: 60,
//                             objectFit: "cover",
//                             cursor: "pointer",
//                           }}
                          
//                         />
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                     <td>{new Date(issue.createdAt).toLocaleString()}</td>
//                     <td>
//                       <div className="d-flex justify-content-center gap-3">
//                         <FaRegEye
//                           className="cursor-pointer"
//                           size={20}
//                           title="View Image"
//                              onClick={() => navigate(`/issues/${issue._id}`)}
//                         />
//                         <FaTrashAlt
//                           size={20}
//                           title="Delete"
//                           className="text-danger cursor-pointer"
//                           onClick={() => handleDeleteIssue(issue._id)}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8">No reported issues found</td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>

//         <CustomPagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
//       </Container>
//     </div>
//   );
// };

// export default Issues;


import React, { useEffect, useState } from "react";
import { Table, Container } from "reactstrap";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Common/Breadcrumb";
import CustomPagination from "../AdminComponents/CustomPagination";
import { FaRegEye, FaTrashAlt } from "react-icons/fa";
import { Instance } from "../Instence/Instence";
import ConstituencyDropdown from "../components/ContituenciesDropdown";
import { ImgBaseUrl } from "../Instence/ImgInstence";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
// Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    if (error?.response?.data) {
      if (typeof error.response.data === "string") return error.response.data;
      if (error.response.data.error) return error.response.data.error;
      return JSON.stringify(error.response.data);
    }
    return error?.message || "Something went wrong";
  };

  // Fetch ALL Staff (for staff filter)
  const fetchStaff = async () => {
    try {
      const res = await Instance.get("/staff");
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.error("Failed to load staff", err);
    }
  };

  // Fetch issues for selected constituency
  const fetchIssuesByConstituency = async (constituency) => {
    if (!constituency) {
      setIssues([]);
      return;
    }
    setLoading(true);
    try {
      const res = await Instance.get("/issue/all");
      const arr = Array.isArray(res.data.issues) ? res.data.issues : [];
      const filtered = arr.filter((i) => i.staffConstituency === constituency);
      setIssues(filtered);
    } catch (err) {
      console.error("Error fetching issues:", err);
      Swal.fire("Error", getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  // SuperAdmin fetch
  const fetchAllIssues = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;

      const res = await Instance.get("/issue/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIssues(Array.isArray(res.data.issues) ? res.data.issues : []);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error", "Failed to load issue data.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role || "";

    setRole(userRole);
    setAdmin(auth?.user);

    fetchStaff();

    if (userRole === "Admin" || userRole === "admin") {
      const constituency = auth?.user?.constituency;
      setSelectedConstituency(constituency);
      fetchIssuesByConstituency(constituency);
    } else if (userRole === "SuperAdmin") {
      fetchAllIssues();
    }
  }, []);

  // Delete Issue
  const handleDeleteIssue = async (id) => {
    const result = await Swal.fire({
      title: "Delete this issue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await Instance.delete(`/issue/${id}`);
        setIssues((prev) => prev.filter((i) => i._id !== id));
        Swal.fire("Deleted!", "Issue removed successfully", "success");
      } catch (err) {
        Swal.fire("Error", getErrorMessage(err), "error");
      }
    }
  };

  // Apply Filters
  const filteredIssues = issues
    .filter((i) => (selectedStaff ? i.staffId?._id === selectedStaff : true))
    // .filter((i) => (selectedCategory ? i.issueType === selectedCategory : true))
    .filter((i) => {
      if (!startDate || !endDate) return true;
      const created = new Date(i.createdAt);
      return created >= startDate && created <= endDate;
    })
    .filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedData = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Home QR" breadcrumbItem="Reported Issues" />

        {/* Admin Info */}
        {(role === "Admin" || role === "admin") && (
          <div className="card-title mb-4 font-size-15">
            <div className="mb-2">
              <strong>Constituency: </strong>
              <span className="text-primary">{selectedConstituency}</span>
            </div>
            <div>
              <strong>Admin: </strong>
              <span className="text-primary">{admin?.name}</span>
            </div>
          </div>
        )}

        {/* SuperAdmin Constituency Filter */}
        {role === "SuperAdmin" && (
          <div className="mb-3 col-md-6">
            <ConstituencyDropdown
              value={selectedConstituency}
              onChange={(value) => {
                setSelectedConstituency(value);
                fetchIssuesByConstituency(value);
              }}
              placeholder="Select Constituency"
            />
          </div>
        )}

        {/* Search */}
        <div className="mb-3 col-md-6">
          <input
            className="form-control border border-primary"
            type="search"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTERS ROW */}
        <div className="row mb-4">

          {/* Staff Filter */}
          <div className="col-md-3">
            <label className="fw-bold">Filter by Staff</label>
            <select
              className="form-control"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">All Staff</option>
              {staffList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          {/* <div className="col-md-3">
            <label className="fw-bold">Filter by Category</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="House Not Found">House Not Found</option>
              <option value="QR Not Visible">QR Not Visible</option>
              <option value="Wrong Mapping">Wrong Mapping</option>
              <option value="Other">Other</option>
            </select>
          </div> */}

          {/* Date Range Picker */}

        <div className="col-md-4">
          <label className="fw-bold">Date Range</label>

          <div className="date-range-container">
            <div className="date-range-wrapper">

              {/* Calendar Icon */}
              <i className="bi bi-calendar-range date-range-icon"></i>

              {/* Date Picker */}
              <div className="date-range-input w-100">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable={true}
                  placeholderText="Select Date Range"
                />
              </div>

            </div>
          </div>
        </div>


          {/* Clear Filters */}
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setSelectedStaff("");
                // setSelectedCategory("");
                setDateRange([null, null]);
                setSearchTerm("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead className="text-center">
              <tr>
                <th>S.No</th>
                <th>Issue Type</th>
                <th>Remarks</th>
                <th>Staff</th>
                <th>Constituency</th>
                <th>Image</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {loading ? (
                <tr>
                  <td colSpan="8">Loading...</td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((issue, index) => (
                  <tr key={issue._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{issue.issueType}</td>
                    <td>{issue.remarks || "-"}</td>
                    <td>{issue.staffId?.name || "-"}</td>
                    <td>{issue.staffConstituency || "-"}</td>

                    <td>
                      {issue.image ? (
                        <img
                          src={`${ImgBaseUrl}${issue.image}`}
                          alt="issue"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{new Date(issue.createdAt).toLocaleString()}</td>

                    <td>
                      <div className="d-flex justify-content-center gap-3">
                        <FaRegEye
                          className="cursor-pointer"
                          size={20}
                          title="View Image"
                          onClick={() => navigate(`/issues/${issue._id}`)}
                        />

                        <FaTrashAlt
                          size={20}
                          title="Delete"
                          className="text-danger cursor-pointer"
                          onClick={() => handleDeleteIssue(issue._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No issues found</td>
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
    </div>
  );
};

export default Issues;
