import React, { useEffect, useState } from 'react'
import { Container, Table, Button } from 'reactstrap'
import Breadcrumbs from '../components/Common/Breadcrumb'
import CustomPagination from '../AdminComponents/CustomPagination'
import { FaRegEye, FaEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import Swal from 'sweetalert2'
import AddSchemesModal from '../AdminComponents/AddSchemesModal'
import { Instance } from '../Instence/Instence'

const mockSchemes = [
  // {
  //   _id: "scheme001",
  //   name: "PM Kisan Samman Nidhi",
  //   description: "Financial support of ₹6000 per year to eligible small and marginal farmers.",
  //   eligibilityCriteria: "Small and marginal farmers owning less than 2 hectares of land.",
  //   benefits: "₹6000 annually transferred in 3 installments.",
  //   requiredDocuments: ["Aadhaar Card", "Land Ownership Proof", "Bank Passbook", "Mobile Number"],
  //   category: "Agriculture, Rural & Environment",
  //   startDate: "2019-02-24",
  //   endDate: null,
  //   isActive: true
  // },
  // {
  //   _id: "scheme002",
  //   name: "PM Mudra Loan",
  //   description: "Loans up to ₹10 lakh for business startups and growth.",
  //   eligibilityCriteria: "Indian citizens aged 18+ with business ideas.",
  //   benefits: "Loan support across Shishu, Kishor, Tarun categories.",
  //   requiredDocuments: ["Aadhaar Card", "PAN Card", "Business Plan", "Bank Passbook"],
  //   category: "Business & Entrepreneurship",
  //   startDate: "2016-04-01",
  //   endDate: null,
  //   isActive: true
  // },
  // {
  //   _id: "scheme003",
  //   name: "PM Awas Yojana",
  //   description: "Affordable housing support for economically weaker households.",
  //   eligibilityCriteria: "EWS, LIG, and MIG households without existing permanent housing.",
  //   benefits: "Interest subsidy up to 6.5% on home loans.",
  //   requiredDocuments: ["Aadhaar Card", "Income Certificate", "Address Proof"],
  //   category: "Housing & Shelter / Welfare",
  //   startDate: "2015-06-25",
  //   endDate: null,
  //   isActive: true
  // },
  // {
  //   _id: "scheme004",
  //   name: "Skill India Mission",
  //   description: "Skill training for youth to improve employment opportunities.",
  //   eligibilityCriteria: "Indian citizens aged 15–45.",
  //   benefits: "Free training, certification, job placement assistance.",
  //   requiredDocuments: ["Aadhaar Card", "Education Certificate", "Photograph"],
  //   category: "Skills, Employment & Financial Services",
  //   startDate: "2015-07-15",
  //   endDate: null,
  //   isActive: true
  // },
];

const Schemes = () => {
  const [schemes, setSchemes] = useState(mockSchemes);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        setSchemes(schemes.filter(scheme => scheme._id !== id));
        Swal.fire(
          'Deleted!',
          'The scheme has been deleted.',
          'success'
        )
      }
    })
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setSelectedScheme(null);
    setModalOpen(true);
  };

  const handleEditClick = (scheme) => {
    setIsEdit(true);
    setSelectedScheme(scheme);
    setModalOpen(true);
  };

  const handleSaveScheme = (scheme) => {
    if (isEdit) {
      // Update existing scheme
      setSchemes(schemes.map(s => s._id === scheme._id ? scheme : s));
      Swal.fire('Updated!', 'The scheme has been updated.', 'success');
    } else {
      // Add new scheme
      const newScheme = { ...scheme, _id: `scheme${Date.now()}` }; // mock new ID
      setSchemes([newScheme, ...schemes]);
      Swal.fire('Added!', 'The scheme has been added.', 'success');
    }
  };
  const searchedData = schemes.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await Instance.get("/scheme");
      setSchemes(res.data.schemes);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='page-content'>
      <Container fluid={true}>
        <Breadcrumbs title="QR INTI ID" breadcrumbItem="Schemes" />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-md-6">
            <input
              className="form-control cursor-pointer border border-primary"
              type="search"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button color="primary" onClick={handleAddClick}>+ Add Scheme</Button>
        </div>

        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead className="">
              <tr>
                <th>S.No.</th>
                <th>Scheme Name</th>
                <th>Description</th>
                <th>Eligibility Criteria</th>
                <th>Benefits</th>
                <th>Required Documents</th>
                <th>Category</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedData.map((scheme, index) => (
                <tr key={scheme._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{scheme.name}</td>
                  <td>{scheme.description?.slice(0, 50)}...</td>
                  <td>{scheme.eligibilityCriteria?.slice(0, 50)}...</td>
                  <td>{scheme.benefits?.slice(0, 50)}...</td >
                  <td>{scheme.requiredDocuments.join(", ")}</td>
                  <td>{scheme.category}</td>
                  <td>{new Date(scheme.startDate).toLocaleDateString()}</td>
                  <td>{scheme.endDate ? new Date(scheme.endDate).toLocaleDateString() : "-"}</td>
                  <td>{scheme.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <FaRegEye size={20} className="cursor-pointer" title="View" />
                      <FaEdit size={20} className="cursor-pointer text-info" title="Edit" onClick={() => handleEditClick(scheme)} />
                      <MdDeleteForever size={20} className="cursor-pointer text-danger" title="Delete" onClick={() => handleDelete(scheme._id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        <AddSchemesModal
          modalOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          isEdit={isEdit}
          schemeData={selectedScheme}
          onSave={handleSaveScheme}
        />
      </Container>
    </div>
  )
}

export default Schemes