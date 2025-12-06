import React, { useEffect, useState } from 'react'
import { Container, Table, Button } from 'reactstrap'
import Breadcrumbs from '../components/Common/Breadcrumb'
import CustomPagination from '../AdminComponents/CustomPagination'
import { FaRegEye, FaEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import Swal from 'sweetalert2'
import AddSchemesModal from '../AdminComponents/AddSchemesModal'
import { Instance } from '../Instence/Instence'
import { useNavigate } from 'react-router-dom'


const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
const [role, setRole] = useState(null);
const [selectedCategory, setSelectedCategory] = useState("");
const categories = [...new Set(schemes.map(s => s.category))];

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
  const searchedData = schemes
  .filter((scheme) =>
    selectedCategory ? scheme.category === selectedCategory : true
  )
  .filter((item) =>
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


  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    const userRole = auth?.user?.role || auth?.role;
    setRole(userRole);
  }, []);


  return (
    <div className='page-content'>
      <Container fluid={true}>
        <Breadcrumbs title="Home QR" breadcrumbItem="Schemes" />

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
          {role === "SuperAdmin" && (
          <Button color="primary" onClick={handleAddClick}>+ Add Scheme</Button>
          )}
        </div>

<div className="row mb-3">
  <div className="col-md-4">
    <label className="fw-bold">Filter by Category</label>
    <select
      className="form-control"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.map((cat, index) => (
        <option key={index} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

  {/* Clear Filter Button */}
  <div className="col-md-2 d-flex align-items-end">
    <button
      className="btn btn-secondary w-100"
      onClick={() => setSelectedCategory("")}
    >
      Clear Category
    </button>
  </div>
</div>



        <div className="py-3" style={{ width: "100%", overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead className="">
              <tr>
                <th>S.No.</th>
                <th style={{ width: "200px", whiteSpace:"normal" }}>Scheme Name</th>
                <th style={{ width: "350px" }}>Description</th>
                <th style={{ width: "350px" }}>Eligibility Criteria</th>
                <th style={{ width: "350px" }}>Benefits</th>
                {/* <th>Required Documents</th> */}
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
                  {/* <td>{scheme.requiredDocuments.join(", ")}</td> */}
                  <td>{scheme.category}</td>
                  <td>{new Date(scheme.startDate).toLocaleDateString()}</td>
                  <td>{scheme.endDate ? new Date(scheme.endDate).toLocaleDateString() : "-"}</td>
                  <td>{scheme.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <FaRegEye size={20} className="cursor-pointer" title="View" 
                      onClick={() => navigate(`/scheme/${scheme._id}`)}
                      />
                      {role === "SuperAdmin" && (
                        <>
                         <FaEdit size={20} className="cursor-pointer text-info" title="Edit" onClick={() => handleEditClick(scheme)} />
                      <MdDeleteForever size={20} className="cursor-pointer text-danger" title="Delete" onClick={() => handleDelete(scheme._id)} />
                        </>
                      )}
                     
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