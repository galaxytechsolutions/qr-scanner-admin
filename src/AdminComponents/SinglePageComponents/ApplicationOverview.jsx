import React, { useState } from 'react';
import {
    Card, CardBody, Col, Row, Badge, Button, Modal, ModalHeader, ModalBody,
    Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import { ImgBaseUrl } from '../../Instence/ImgInstence';
import { useParams } from 'react-router-dom';
import classnames from 'classnames';
import { FaUser, FaUniversity, FaFileAlt, FaHistory, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';

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
            "bankPassbook": require("../../assets/images/bg.jpg"),
            "photograph": "https://www.randomuser.me/api/portraits/men/9.jpg",
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

const DetailItem = ({ label, value }) => (
    <Col md={4} className="mb-3">
        <div className="text-muted small mb-1">{label}</div>
        <div className="fw-bold fs-6">{value || '-'}</div>
    </Col>
);

const DocumentItem = ({ label, path, onImageClick }) => (
    <Col md={3} sm={6} className="mb-4 text-center">
        <h6 className="mb-2 text-muted">{label}</h6>
        {path ? (
            <div onClick={() => onImageClick(path)} style={{ cursor: 'pointer' }} className="d-block position-relative">
                <img src={typeof path === 'string' && path.startsWith('uploads') ? `${ImgBaseUrl}${path}` : path} alt={label} className="img-thumbnail" style={{ height: '150px', width: '100%', objectFit: 'cover', transition: 'transform 0.2s ease-in-out' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
            </div>
        ) : (
            <div className="img-thumbnail d-flex flex-column align-items-center justify-content-center bg-light text-muted" style={{ height: '150px' }}>
                <FaFileAlt size={30} className="mb-2" />
                <span>Not Uploaded</span>
            </div>
        )}
    </Col>
);


const ApplicationOverview = ({ application: propApplication }) => {
    const [activeTab, setActiveTab] = useState('1');
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();

    // In a real app, you would fetch the application by id or find it in a list
    // For now, we'll use the mock data. If a prop is passed, use it, otherwise use mock.
    const application = propApplication || mockApplications.find(app => app._id === id) || mockApplications[0];

    if (!application) {
        return <div>Application not found.</div>;
    }

    const {
        applicantDetails,
        addressInfo,
        documents,
        bankDetails,
        schemeSpecific,
        declaration,
        schemeName,
        schemeCategory,
        status,
        reviewedBy,
        remarks,
        createdAt,
        userId
    } = application;

    const getStatusBadge = (status) => {
        const styles = {
            Submitted: { bg: 'warning', text: 'dark' },
            Approved: { bg: 'success', text: 'white' },
            Rejected: { bg: 'danger', text: 'white' },
        };
        const style = styles[status] || { bg: 'secondary', text: 'white' };
        return <Badge color={style.bg} className={`text-${style.text} py-2 px-3`}>{status}</Badge>;
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleImageClick = (path) => {
        setModalImage(path);
        toggleModal();
    };

    return (
        <div className="page-content mx-lg-5">
            {/* Header Card */}
            <Card className="mb-4 shadow-sm">
                <CardBody>
                    <Row className="align-items-center">
                        <Col md={2} className="text-center">
                            <img src={`${documents.photograph}`} alt="Applicant" className="rounded-circle" width="120" height="120" style={{ objectFit: 'cover' }} />
                        </Col>
                        <Col md={6}>
                            <h3 className="mb-1">{applicantDetails.fullName}</h3>
                            <p className="text-muted mb-2">{schemeName} - {schemeCategory}</p>
                            <p className="mb-0"><strong>Aadhaar:</strong> {applicantDetails.aadhaarNumber}</p>
                            <p className="mb-0"><strong>Mobile:</strong> {applicantDetails.mobileNumber}</p>
                        </Col>
                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                            <div className="mb-3">{getStatusBadge(status)}</div>
                            <div className="d-flex gap-2 justify-content-md-end">
                                <Button color="success"><FaCheck className="me-1" /> Approve</Button>
                                <Button color="danger"><FaTimes className="me-1" /> Reject</Button>
                                <Button color="info" outline><FaEdit className="me-1" /> Edit</Button>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {/* Tabbed Details */}
            <Card>
                <Nav tabs className="card-header-tabs">
                    <NavItem>
                        <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '1' })} onClick={() => { setActiveTab('1'); }}>
                            <FaUser className="me-2" />Personal Details
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '2' })} onClick={() => { setActiveTab('2'); }}>
                            <FaUniversity className="me-2" />Scheme & Bank Info
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '3' })} onClick={() => { setActiveTab('3'); }}>
                            <FaFileAlt className="me-2" />Documents
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '4' })} onClick={() => { setActiveTab('4'); }}>
                            <FaHistory className="me-2" />Application Log
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <CardBody className="p-4">
                            <h5 className="mb-4">Applicant Information</h5>
                            <Row>
                                <DetailItem label="Father/Husband Name" value={applicantDetails.fatherOrHusbandName} />
                                <DetailItem label="Date of Birth" value={new Date(applicantDetails.dateOfBirth).toLocaleDateString()} />
                                <DetailItem label="Gender" value={applicantDetails.gender} />
                                <DetailItem label="Caste Category" value={applicantDetails.casteCategory} />
                                <DetailItem label="Email" value={applicantDetails.email} />
                                <DetailItem label="Marital Status" value={applicantDetails.maritalStatus} />
                            </Row>
                            <hr className="my-4" />
                            <h5 className="mb-4">Address Information</h5>
                            <Row>
                                <DetailItem label="House Number" value={addressInfo.houseNumber} />
                                <DetailItem label="Village/Town" value={addressInfo.villageOrTown} />
                                <DetailItem label="Mandal/Municipality" value={addressInfo.mandalOrMunicipality} />
                                <DetailItem label="District" value={addressInfo.district} />
                                <DetailItem label="PIN Code" value={addressInfo.pinCode} />
                                <DetailItem label="Assembly Constituency" value={addressInfo.assemblyConstituency} />
                            </Row>
                        </CardBody>
                    </TabPane>

                    <TabPane tabId="2">
                        <CardBody className="p-4">
                            <h5 className="mb-4">Scheme Specific Details</h5>
                            <Row>
                                <DetailItem label="Land Details" value={schemeSpecific.landDetails} />
                                <DetailItem label="Survey Number" value={schemeSpecific.surveyNumber} />
                                <DetailItem label="Pattadar Passbook No." value={schemeSpecific.pattadarPassbookNo} />
                            </Row>
                            <hr className="my-4" />
                            <h5 className="mb-4">Bank Details</h5>
                            <Row>
                                <DetailItem label="Bank Name" value={bankDetails.bankName} />
                                <DetailItem label="Account Holder Name" value={bankDetails.accountHolderName} />
                                <DetailItem label="Account Number" value={bankDetails.accountNumber} />
                                <DetailItem label="IFSC Code" value={bankDetails.ifscCode} />
                                <DetailItem label="Account Type" value={bankDetails.accountType} />
                            </Row>
                        </CardBody>
                    </TabPane>

                    <TabPane tabId="3">
                        <CardBody className="p-4">
                            <h5 className="mb-4">Uploaded Documents</h5>
                            <Row className="justify-content-start align-items-start">
                                <DocumentItem label="Photograph" path={documents.photograph} onImageClick={handleImageClick} />
                                <DocumentItem label="Bank Passbook" path={documents.bankPassbook} onImageClick={handleImageClick} />
                                <DocumentItem label="Signature" path={documents.signature} onImageClick={handleImageClick} />
                                {documents.additionalDocs.map((doc, index) => (
                                    <DocumentItem key={index} label={`Additional Doc ${index + 1}`} path={doc} onImageClick={handleImageClick} />
                                ))}
                            </Row>
                        </CardBody>
                        {/* <Modal isOpen={isModalOpen} toggle={toggleModal} centered size="lg">
                            <ModalHeader toggle={toggleModal}>Document Preview</ModalHeader>
                            <ModalBody className="text-center">
                                <img
                                    src={typeof modalImage === 'string' && modalImage.startsWith('uploads') ? `${ImgBaseUrl}${modalImage}` : modalImage}
                                    alt="Document Preview"
                                    className="img-fluid"
                                    style={{ maxHeight: '80vh' }}
                                />
                            </ModalBody>
                        </Modal> */}
                    </TabPane>

                    <TabPane tabId="4">
                        <CardBody className="p-4">
                            <h5 className="mb-4">Application Log & Declaration</h5>
                            <Row>
                                <DetailItem label="Applied On" value={new Date(createdAt).toLocaleString()} />
                                <DetailItem label="Reviewed By" value={reviewedBy} />
                                <DetailItem label="Remarks" value={remarks} />
                            </Row>
                            <hr className="my-4" />
                            <h5 className="mb-4">Declaration</h5>
                            <Row>
                                <DetailItem label="Declared" value={declaration.isDeclared ? 'Yes' : 'No'} />
                                <DetailItem label="Submission Date" value={new Date(declaration.submissionDate).toLocaleDateString()} />
                                <DetailItem label="Submission Place" value={declaration.submissionPlace} />
                            </Row>
                        </CardBody>
                    </TabPane>
                </TabContent>
            </Card>
        </div>
    );
};

export default ApplicationOverview