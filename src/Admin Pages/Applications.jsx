import React from 'react'
import Breadcrumbs from '../components/Common/Breadcrumb'
import { Button, Container, Table } from 'reactstrap'
import CustomPagination from '../AdminComponents/CustomPagination';
import { FaRegEye, FaEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';

const mockApplications = [
  {
    "applicantDetails": {
      "fullName": "Ramesh Kumar",
      "fatherOrHusbandName": "Venkataiah",
      "dateOfBirth": "1985-06-15T00:00:00.000Z",
      "gender": "Male",
      "casteCategory": "BC",
      "aadhaarNumber": "456712345678",
      "mobileNumber": "9876543210",
      "email": "ramesh.kumar@example.com",
      "maritalStatus": "Married"
    },
    "addressInfo": {
      "houseNumber": "2-14/B",
      "villageOrTown": "Kondapur",
      "mandalOrMunicipality": "Sangareddy",
      "district": "Medak",
      "pinCode": "502001",
      "assemblyConstituency": "Sangareddy",
      "addressType": "Permanent"
    },
    "documents": {
      "bankPassbook": "uploads\\1762173604919.jpg",
      "photograph": "uploads\\1762173604920.jpg",
      "signature": "uploads\\1762173604920.jpg",
      "additionalDocs": []
    },
    "bankDetails": {
      "bankName": "State Bank of India",
      "accountHolderName": "Ramesh Kumar",
      "accountNumber": "123456789012",
      "ifscCode": "SBIN0004321",
      "accountType": "Savings"
    },
    "schemeSpecific": {
      "landDetails": "4 acres in Kondapur",
      "surveyNumber": "45/2A",
      "pattadarPassbookNo": "PB123456789"
    },
    "declaration": {
      "isDeclared": true,
      "submissionDate": "2025-11-03T12:00:00.000Z",
      "submissionPlace": "Sangareddy"
    },
    "_id": "69089eb040e4dc53c882f25e",
    "userId": {
      "_id": "69049e211d7cf76053075c50",
      "phoneNo": "8853677250",
      "constituency": "Secunderabad",
      "headOfFamily": "Rajesh Singanahalli"
    },
    "schemeId": {
      "_id": "69086d927ca81cd7df26deda",
      "name": "Mission Kakatiya",
      "category": "Agriculture, Rural & Environment"
    },
    "schemeName": "Mission Kakatiya",
    "schemeCategory": "Agriculture, Rural & Environment",
    "status": "Submitted",
    "reviewedBy": null,
    "remarks": "",
    "createdAt": "2025-11-03T12:23:12.523Z",
    "updatedAt": "2025-11-03T13:26:53.929Z",
    "__v": 0
  }
];

const Applications = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [applications, setApplications] = React.useState(mockApplications);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleAddClick = () => {

  }

  const searchedData = applications.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    Object.values(item.applicantDetails).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='page-content'>
      <Container fluid={true}>
        <Breadcrumbs title="QR INTI ID" breadcrumbItem="Applications" />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-md-6">
            <input
              className="form-control cursor-pointer border border-primary"
              type="search"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button color="primary" onClick={handleAddClick}>+ Add Application</Button>
        </div>

        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead className="text-center">
              <tr>
                <th>S.No.</th>
                <th>Applicant Name</th>
                <th>Mobile Number</th>
                <th>Scheme Name</th>
                <th>Scheme Category</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Aadhaar Number</th>
                <th>Email</th>
                <th>Gender</th>
                <th>District</th>
                <th>Reviewed By</th>
                <th>Remarks</th>
                <th>Caste Category</th>
                <th>Assembly Constituency</th>
                <th>Father/Husband Name</th>
                <th>Date of Birth</th>
                <th>Marital Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedData.map((app, index) => (
                <tr key={app._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{app.applicantDetails.fullName}</td>
                  <td>{app.applicantDetails.mobileNumber}</td>
                  <td>{app.schemeName}</td>
                  <td>{app.schemeCategory}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${app.status === 'Submitted'
                      ? 'warning'
                      : app.status === 'Approved'
                        ? 'success'
                        : 'danger'}`}>{app.status}</span>
                  </td>
                  <td>{app.applicantDetails.aadhaarNumber}</td>
                  <td>{app.applicantDetails.email}</td>
                  <td>{app.applicantDetails.gender}</td>
                  <td>{app.addressInfo.district}</td>
                  <td>{app.reviewedBy || '-'}</td>
                  <td>{app.remarks || '-'}</td>
                  <td>{app.applicantDetails.casteCategory}</td>
                  <td>{app.addressInfo.assemblyConstituency}</td>
                  <td>{app.applicantDetails.fatherOrHusbandName}</td>
                  <td>{new Date(app.applicantDetails.dateOfBirth).toLocaleDateString()}</td>
                  <td>{app.applicantDetails.maritalStatus}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <FaRegEye size={20} className="cursor-pointer" title="View" onClick={() => navigate(`/applications/${app._id}`)} />
                      <FaEdit size={20} className="cursor-pointer text-info" title="Edit" />
                      <MdDeleteForever size={20} className="cursor-pointer text-danger" title="Delete" />
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
  )
}

export default Applications