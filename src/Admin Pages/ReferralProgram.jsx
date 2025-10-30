import React, { useEffect, useState } from "react";
import { Table, Container } from "reactstrap";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Common/Breadcrumb";
import CustomPagination from "../AdminComponents/CustomPagination"; 
import { FaCheckCircle, FaRegEye, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { Instance } from "../Instence/Instence";

const ReferralProgram = () => {
  const [referrals, setReferrals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await Instance.get("/referral/admin");
        // Ensure we always have an array, even if the API response is unexpected
        const referralsArray = Array.isArray(response.data?.referrals) ? response.data.referrals : [];
        setReferrals(referralsArray);
        console.log("Fetched referrals:", referralsArray);
      } catch (err) {
        console.error("Error fetching referrals:", err);
        setError("Failed to load referral data.");
        Swal.fire("Error", "Failed to load referral data.", "error");
        setReferrals([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();

    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role || "";
    setRole(userRole);

    if (userRole === "Admin" || userRole === "admin") {
      const constituency = auth?.user?.constituency || auth?.constituency;
      setSelectedConstituency(constituency);
    }

  }, []);

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
    ? referrals.filter((item) =>
        // Add a check to ensure item is not null or undefined
        item && Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    : [];

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="QR INTI ID" breadcrumbItem="Referral Program" />
        {(role === "Admin" || role === "admin") && (
          <div className="card-title mb-4 font-size-15">
            Constituency: {selectedConstituency}
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
                <th>RefferedBy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {loading ? (
                <tr>
                  <td colSpan="8">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-danger">
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
                              onClick={() =>
                                handleStatusUpdate(referral._id, "rejected")
                              }
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
                  <td colSpan="8">No referrals found.</td>
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

export default ReferralProgram;