import React, { useEffect, useState } from "react";
import { Table, Button, Container, Col, Row } from "reactstrap";
import { FaCheckCircle, FaRegEye, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { RiCheckLine, RiCloseLine } from "react-icons/ri";
import Swal from "sweetalert2";
import CustomPagination from "../AdminComponents/CustomPagination";
import Breadcrumbs from "../components/Common/Breadcrumb";
import { Instance } from "../Instence/Instence";
import { useLocation, useNavigate } from "react-router-dom";
import ConstituencyDropdown from "../components/ContituenciesDropdown";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [role, setRole] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const passedConstituency = location.state?.constituency;
  const categories = [...new Set(applications.map(a => a.schemeId?.category).filter(Boolean))];
  const schemeNames = [...new Set(applications.map(a => a.schemeId?.name).filter(Boolean))];

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-pill text-capitalize fw-semibold";
    const styles = {
      approved: { background: "#E6F4EA", color: "#137333" },
      rejected: { background: "#FDEAEA", color: "#A50E0E" },
      pending: { background: "#FFF4E5", color: "#B06000" },
    };
    return (
      <span className={base} style={styles[status.toLowerCase()] || styles.pending}>
        {status}
      </span>
    );
  };

  useEffect(() => {
    if (role === "SuperAdmin" && passedConstituency) {
      setSelectedConstituency(passedConstituency);
    }
  }, [role, passedConstituency]);


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

  const updateStatus = async (id, newStatus) => {
    try {
      const result = await Swal.fire({
        title: `Are you sure you want to ${newStatus}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${newStatus}`,
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      const res = await Instance.put(`/application/${id}`, { status: newStatus });

      Swal.fire("Success!", `Application ${newStatus}.`, "success");

      // Update local state without refetch
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire("Error", "Unable to update status", "error");
    }
  };


  const filteredApplications = Array.isArray(applications)
    ? applications.filter((app) => {
      if (!app) return false;

      // 🔹 Category Filter
      if (selectedCategory && app.schemeId?.category !== selectedCategory) {
        return false;
      }

      // 🔹 Scheme Filter
      if (selectedScheme && app.schemeId?.name !== selectedScheme) {
        return false;
      }

      // 🔍 Search Filter (flat + nested)
      const search = searchTerm.toLowerCase();
      if (search) {
        const textBlob = JSON.stringify(app).toLowerCase();
        if (!textBlob.includes(search)) {
          return false;
        }
      }

      // 🗓 Date Filter (NEW)
      if (dateFilter) {
        const created = new Date(app.createdAt);
        const now = new Date();
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);

        if (dateFilter === "today" && diffDays >= 1) return false;
        if (dateFilter === "7days" && diffDays > 7) return false;
        if (dateFilter === "30days" && diffDays > 30) return false;
      }

      return true; // ✔ passes all active filters
    })
    : [];



  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary counts for admin
  const totalApplications = applications.length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const pending = applications.filter(a => a.status === 'Pending').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;

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

        {(role === "Admin" || role === "admin") && (
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Applications</h5>
                  <p className="card-text display-4">{totalApplications}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h5 className="card-title">Approved</h5>
                  <p className="card-text display-5 text-success">{approved}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h5 className="card-title">Pending</h5>
                  <p className="card-text display-4 text-warning">{pending}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h5 className="card-title">Rejected</h5>
                  <p className="card-text display-4 text-danger">{rejected}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <Row className="justify-content-between align-items-center mb-3">
            <Col md={6}>
              {role === "SuperAdmin" && (
                <div style={{ maxWidth: 360 }} className="mb-2">
                  <ConstituencyDropdown
                    value={selectedConstituency}
                    onChange={handleConstituencyChange}
                    placeholder="Select Constituency"
                  />
                </div>
              )}
            </Col>

            <Col md={6}>
              <input
                className="form-control border border-primary"
                type="search"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>
          </Row>
        </div>

        <div className="row mb-3">

          {/* Category Filter */}
          <div className="col-md-3">
            <label className="fw-bold">Filter by Category</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Scheme Filter */}
          <div className="col-md-3">
            <label className="fw-bold">Filter by Scheme</label>
            <select
              className="form-control"
              value={selectedScheme}
              onChange={(e) => { setSelectedScheme(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Schemes</option>
              {schemeNames.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Date Filter (Added) */}
          <div className="col-md-3">
            <label className="fw-bold">Filter by Date</label>
            <select
              className="form-control border border-primary rounded-1"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Select Date Filter</option>
              <option value="">All</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setSelectedCategory("");
                setSelectedScheme("");
                setSearchTerm("");
                setDateFilter("");   // reset date filter
              }}
            >
              Clear Filters
            </button>
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
              {role === "SuperAdmin" && !selectedConstituency ? (
                <tr>
                  <td colSpan="15" className="text-muted py-5">
                    <h5 className="text-muted">Choose a constituency to view applications.</h5>
                  </td>
                </tr>
              ) : loading ? (
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
                    <td>{app.status ? getStatusBadge(app.status) : "-"}</td>
                    <td>{app.applicant?.aadhaar || app.applicantDetails?.aadhaarNumber || "-"}</td>
                    <td>{app.applicant?.email || "-"}</td>
                    <td>{app.applicant?.gender || "-"}</td>
                    <td>{app.address?.district || app.addressInfo?.district || "-"}</td>
                    <td>{app.reviewedBy ? (app.reviewedBy.name || app.reviewedBy) : "-"}</td>
                    <td>{app.remarks || "-"}</td>
                    <td>{app.userId?.constituency || "-"}</td>
                    {/* <td>
                      <div className="d-flex justify-content-center gap-3">
                        <FaRegEye size={18} className="cursor-pointer" title="View" onClick={() => navigate(`/applications/${app._id || app.applicationId}`)} />
                        <MdDeleteForever size={18} className="cursor-pointer text-danger" title="Delete" onClick={() => handleDelete(app._id || app.applicationId)} />
                      </div>
                    </td> */}
                    <td>
                      <div className="d-flex justify-content-center gap-3">

                        {/* APPROVE */}
                        <FaCheckCircle
                          size={22}
                          className={`cursor-pointer ${app.status === "Approved" ? "text-muted" : "text-success"}`}
                          title="Approve Application"
                          onClick={() => app.status !== "Approved" && updateStatus(app._id, "Approved")}
                          style={{ opacity: app.status === "Approved" ? 0.4 : 1 }}
                        />

                        {/* REJECT */}
                        <FaTimesCircle
                          size={22}
                          className={`cursor-pointer ${app.status === "Rejected" ? "text-muted" : "text-danger"}`}
                          title="Reject Application"
                          onClick={() => app.status !== "Rejected" && updateStatus(app._id, "Rejected")}
                          style={{ opacity: app.status === "Rejected" ? 0.4 : 1 }}
                        />

                        {/* VIEW */}
                        <FaRegEye
                          size={20}
                          className="cursor-pointer"
                          title="View Application"
                          onClick={() => navigate(`/applications/${app._id}`)}
                        />

                        {/* DELETE */}
                        <FaTrashAlt
                          size={22}
                          className="cursor-pointer text-danger"
                          title="Delete Application"
                          onClick={() => handleDelete(app._id)}
                        />

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
