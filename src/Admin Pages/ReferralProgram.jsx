import React, { useState } from "react";
import { Table, Container } from "reactstrap";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Common/Breadcrumb";
import CustomPagination from "../AdminComponents/CustomPagination";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const mockReferrals = [
  { _id: '1', name: 'John Doe', phoneNo: '123-456-7890', email: 'john.doe@example.com',whatsappActive:true, refferredBy: 'Jane Smith', status: 'pending' },
  { _id: '2', name: 'Jane Smith', phoneNo: '098-765-4321', email: 'jane.smith@example.com',whatsappActive:true, 
    refferredBy: 'John Vir', status: 'accepted' },
  { _id: '3', name: 'Peter Jones', phoneNo: '555-555-5555', email: 'peter.jones@example.com',whatsappActive:false,
    refferredBy: 'Mary Raja', status: 'rejected' },
  { _id: '4', name: 'Mary Johnson', phoneNo: '111-222-3333', email: 'mary.j@example.com',whatsappActive:true, refferredBy: 'Malika',status: 'pending' },
  { _id: '5', name: 'David Williams', phoneNo: '444-555-6666', email: 'david.w@example.com',whatsappActive:true, 
    refferredBy: 'John Paul', status: 'pending' },
  { _id: '6', name: 'Susan Brown', phoneNo: '777-888-9999', email: 'susan.b@example.com',whatsappActive:false, refferredBy: 'William', status: 'accepted' },
];

const ReferralProgram = () => {
  const [referrals, setReferrals] = useState(mockReferrals);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const handleStatusUpdate = async (id, status) => {
    const action = status === "accepted" ? "Accept" : "Reject";
    const result = await Swal.fire({
      title: `Are you sure you want to ${action.toLowerCase()} this referral?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action.toLowerCase()} it!`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setReferrals((prev) =>
        prev.map((ref) => (ref._id === id ? { ...ref, status } : ref))
      );
      Swal.fire("Success!", `Referral has been ${status}.`, "success");
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
      Object.values(item).some((val) =>
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

        <div className="d-flex justify-content-end mb-3">
          <div className="col-md-4">
            <input
              className="form-control"
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
              {paginatedData.length > 0 ? (
                paginatedData.map((referral, index) => (
                  <tr key={referral._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{referral.name}</td>
                    <td>{referral.phoneNo}</td>
                    <td>{referral.email}</td>
                    <td>{referral.whatsappActive ? 'Yes' : 'No'}</td>
                    <td className="text-center">{getStatusBadge(referral.status)}</td>
                    <td>{referral.refferredBy}</td>
                    <td>
                      {referral.status === "pending" && (
                        <div className="d-flex justify-content-center gap-3">
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
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No referrals found.</td>
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