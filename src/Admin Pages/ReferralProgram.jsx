import React, { useEffect, useState } from "react";
import { Table, Container, Button } from "reactstrap";
import { Dropdown, ListGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Common/Breadcrumb";
import CustomPagination from "../AdminComponents/CustomPagination"; 
import { FaCheckCircle, FaRegEye, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { Instance } from "../Instence/Instence";
import ConstituencyDropdown from "../components/ContituenciesDropdown";
import CityDropdown from "../components/CityDropdown";

const ReferralProgram = () => {
  const [referrals, setReferrals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

console.log("Referrals", referrals);

  const getErrorMessage = (error) => {
    if (error?.response?.data) {
      if (typeof error.response.data === "string") return error.response.data;
      if (error.response.data.error) return error.response.data.error;
      return JSON.stringify(error.response.data);
    }
    return error?.message || "Something went wrong";
  };

  const API_KEY = "RjNobEwxWTR0VFhFWVFzRWpkdWsxMjJDWXEyZmVBaDJmSVpYR1JJTg==";
  const BASE_URL = "https://api.countrystatecity.in/v1";

  // Fetch Telangana cities
  useEffect(() => {
    fetchCities("TG");
  }, []);

  const fetchCities = async (stateCode) => {
    try {
      const res = await Instance.get(
        `${BASE_URL}/countries/IN/states/${stateCode}/cities`,
        { headers: { "X-CSCAPI-KEY": API_KEY } }
      );
      // Store as objects {id, name} for dropdown
      setCitiesList(res.data.map((c) => ({ id: c.id, name: c.name })));
    } catch (err) {
      console.log("City Error:", err);
    }
  };

  useEffect(() => {
    if (role === "SuperAdmin") {
      // Reset constituency if city changes
      setSelectedConstituency("");
    }
  }, [selectedCity, role]);

  // Fetch referrals for a constituency
  const fetchReferralsForConstituency = async (constituency) => {
    if (!constituency) {
      setReferrals([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // assumed endpoint - change if your backend uses a different route
      const res = await Instance.get(`/referral/constituency/${constituency}`);
      const arr = Array.isArray(res.data?.referrals) ? res.data.referrals : (Array.isArray(res.data) ? res.data : []);
      setReferrals(arr);
      console.log("Fetched referrals:", arr);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setError("Failed to load referral data");
      Swal.fire("Error", getErrorMessage(err), "error");
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  // Generic fetch for admin (if you still need fallback list)
  const fetchAllReferrals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Instance.get("/referral/admin");
      const arr = Array.isArray(res.data?.referrals) ? res.data.referrals : (Array.isArray(res.data) ? res.data : []);
      setReferrals(arr);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setError("Failed to load referral data");
      setReferrals([]);
      Swal.fire("Error", "Failed to load referral data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role || "";
    setRole(userRole);
    setAdmin(auth?.user);
    if (userRole === "Admin" || userRole === "admin") {
      const constituency = auth?.user?.constituency || auth?.constituency || "";
      setSelectedConstituency(constituency);
        // fetchAllReferrals();
      fetchReferralsForConstituency(constituency);
    } else if (userRole === "SuperAdmin") {
      setReferrals([]);
    } else {
      // fallback - fetch all (keeps your existing behavior if role is different)
      fetchAllReferrals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConstituencyChange = (value) => {
    setSelectedConstituency(value);
    fetchReferralsForConstituency(value);
  };

  const handleClearFilters = () => {
    setSelectedCity(null);
    setSelectedConstituency("");
    setStatusFilter("all");
    setSearchTerm("");
  };


  const handleDeleteReferral = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this referral?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await Instance.delete(`/referral/admin/${id}`);
        setReferrals((prev) => prev.filter((ref) => ref._id !== id));
        Swal.fire("Deleted!", "Referral has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting referral:", error);
        Swal.fire("Error", "Failed to delete referral.", "error");
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const action = status === "accepted" ? "Accept" : "Reject";
    const result = await Swal.fire({
      title: `Are you sure you want to ${action.toLowerCase()} this referral?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await Instance.put(`/referral/admin/${id}`, { status });
        setReferrals((prev) =>
          prev.map((ref) => (ref._id === id ? { ...ref, status } : ref))
        );
        Swal.fire("Success!", `Referral has been ${status}.`, "success");
      } catch (error) {
        console.error(`Error updating referral status:`, error);
        Swal.fire("Error", `Failed to ${action.toLowerCase()} referral.`, "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-pill text-capitalize fw-semibold";
    const styles = {
      accepted: { background: "#E6F4EA", color: "#137333" },
      rejected: { background: "#FDEAEA", color: "#A50E0E" },
      pending: { background: "#FFF4E5", color: "#B06000" },
    };
    return (
      <span className={base} style={styles[status] || styles.pending}>
        {status}
      </span>
    );
  };

  const searchedData = Array.isArray(referrals)
    ? referrals.filter((item) => {
        if (!item) return false;
        const matchesSearch = Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary counts
  const totalReferrals = referrals.length;
  const approved = referrals.filter(r => r.status === 'accepted').length;
  const pending = referrals.filter(r => r.status === 'pending').length;
  const rejected = referrals.filter(r => r.status === 'rejected').length;

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="Home QR" breadcrumbItem="Referral Program" />

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

      

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <h5 className="card-title">Total Referrals</h5>
                <p className="card-text display-4">{totalReferrals}</p>
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


        {(role !== "SuperAdmin" || selectedConstituency) && (
          <div className="mb-3">
            <label className="form-label">Select Status</label>
            <div className="col-md-3">
              <Dropdown show={statusDropdownOpen}>
                <Dropdown.Toggle
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  variant="light"
                  className="border border-primary rounded-1"
                  style={{ width: "100%" }}
                >
                  {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: "100%" }}>
                  <ListGroup variant="flush">
                    <ListGroup.Item
                      action
                      active={statusFilter === "all"}
                      onClick={() => {
                        setStatusFilter("all");
                        setStatusDropdownOpen(false);
                      }}
                    >
                      All Status
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      active={statusFilter === "pending"}
                      onClick={() => {
                        setStatusFilter("pending");
                        setStatusDropdownOpen(false);
                      }}
                    >
                      Pending
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      active={statusFilter === "accepted"}
                      onClick={() => {
                        setStatusFilter("accepted");
                        setStatusDropdownOpen(false);
                      }}
                    >
                      Accepted
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      active={statusFilter === "rejected"}
                      onClick={() => {
                        setStatusFilter("rejected");
                        setStatusDropdownOpen(false);
                      }}
                    >
                      Rejected
                    </ListGroup.Item>
                  </ListGroup>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        )}


                  {role === "SuperAdmin" && (
         <div className="mb-3">

           <div className="d-flex gap-3 mb-2">
             {/* <div className="col-md-3">
               <label className="form-label">Filter by City</label>
               <CityDropdown
                 value={selectedCity}
                 list={citiesList}
                 onChange={(city) => setSelectedCity(city)}
                 placeholder="Select City"
               />
             </div> */}
             <div className="col-md-3">
               <label className="form-label">Filter by Constituency</label>
               <ConstituencyDropdown
                 value={selectedConstituency}
                 onChange={(value) => handleConstituencyChange(value)}
                 placeholder="Select Constituency"
               />
             </div>
        <div className="d-flex align-items-end">
  <Button
    color="secondary"
    size="sm"
    className="px-4 py-2"
    onClick={handleClearFilters}
  >
    Clear Filters
  </Button>
</div>

           </div>
   
         </div>
       )}


        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-md-6">
            <input
              className="form-control cursor-pointer border border-primary"
              type="search"
              placeholder="Search referrals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead className="text-center">
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>WhatsApp Active</th>
                <th>Status</th>
                <th>ReferredBy</th>
                <th>Constituency</th>
                <th>Actions</th>
              </tr>
            </thead>
        <tbody className="text-center">
  {role === "SuperAdmin" && !selectedConstituency ? (
    <tr>
      <td colSpan="9" className="text-muted py-5">
        Choose a constituency to view constituency-wise referrals.
      </td>
    </tr>
  ) : loading ? (
    <tr>
      <td colSpan="9">Loading...</td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan="9" className="text-danger">
        {error}
      </td>
    </tr>
  ) : paginatedData.length > 0 ? (
    paginatedData.map((referral, index) => (
      <tr key={referral._id}>
        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
        <td>{referral.friendName || "-"}</td>
        <td>{referral.friendPhone || "-"}</td>
        <td>{referral.friendEmail || "-"}</td>
        <td>{referral.whatsappActive ? 'Yes' : 'No'}</td>
        <td>{getStatusBadge(referral.status)}</td>
        <td>{referral.referrerStaff?.name || "-"}</td>
        <td>{referral.constituency || "-"}</td>
        <td>
          <div className="d-flex justify-content-center gap-3">
            {referral.status === "pending" && (
              <>
                <FaCheckCircle
                  size={22}
                  className="cursor-pointer text-success"
                  title="Accept Referral"
                  onClick={() => handleStatusUpdate(referral._id, "accepted")}
                />
                <FaTimesCircle
                  size={22}
                  className="cursor-pointer text-danger"
                  title="Reject Referral"
                  onClick={() => handleStatusUpdate(referral._id, "rejected")}
                />
              </>
            )}
            <FaRegEye
              size={20}
              title="View"
              className="cursor-pointer"
              onClick={() => navigate(`/referrals/${referral._id}`)}
            />
            <FaTrashAlt
              size={18}
              title="Delete"
              className="cursor-pointer text-danger"
              onClick={() => handleDeleteReferral(referral._id)}
            />
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="9">No referrals found.</td>
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

export default ReferralProgram;
