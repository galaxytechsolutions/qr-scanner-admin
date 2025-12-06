import React, { useEffect, useState } from 'react';
import {
    Card, CardBody, Col, Row, Badge, Button, Modal, ModalHeader, ModalBody,
    Nav, NavItem, NavLink, TabContent, TabPane, Container
} from 'reactstrap';
import { ImgBaseUrl } from '../../Instence/ImgInstence';
import { useParams } from 'react-router-dom';
import classnames from 'classnames';
import { FaUser, FaUniversity, FaFileAlt, FaHistory, FaCheck, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Instance } from '../../Instence/Instence';
import Breadcrumbs from '../../components/Common/Breadcrumb';

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
            <div onClick={() => onImageClick(path)} style={{ cursor: 'pointer' }}>
                <img
                    src={path}
                    alt={label}
                    className="img-thumbnail"
                    style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                />
            </div>
        ) : (
            <div className="img-thumbnail d-flex flex-column align-items-center justify-content-center bg-light text-muted"
                 style={{ height: '150px' }}>
                <FaFileAlt size={30} className="mb-2" />
                <span>Not Uploaded</span>
            </div>
        )}
    </Col>
);

const ApplicationOverview = () => {

    const [activeTab, setActiveTab] = useState('1');
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await Instance.get(`/application/${id}`);
                console.log("APPLICATION ==> ", res.data.application);
                setApplication(res.data.application);
            } catch (error) {
                console.error("Error fetching application:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);


    if (loading) return <div className="p-5 text-center">Loading application...</div>;
    if (!application) return <div className="p-5 text-center">Application not found.</div>;

    // Extract nested fields properly
    const {
        applicant,
        address,
        documents,
        bank,
        schemeDetails,
        declaration,
        status,
        reviewedBy,
        remarks,
        createdAt,
        userId,
        schemeId
    } = application;


    const getStatusBadge = (status) => {
        const styles = {
            Pending: { bg: 'warning', text: 'dark' },
            "Under Review": { bg: 'info', text: 'white' },
            Approved: { bg: 'success', text: 'white' },
            Rejected: { bg: 'danger', text: 'white' },
        };
        const style = styles[status] || { bg: 'secondary', text: 'white' };

        return <Badge color={style.bg} className={`text-${style.text} py-2 px-3`}>{status}</Badge>;
    };


    const updateStatus = async (newStatus) => {
        try {
            const result = await Swal.fire({
                title: `Are you sure you want to mark this as ${newStatus}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: `Yes, ${newStatus}`,
            });

            if (!result.isConfirmed) return;

            await Instance.put(`/application/${application._id}`, {
                status: newStatus,
            });

            Swal.fire("Success", `Status updated to ${newStatus}`, "success");
            setApplication({ ...application, status: newStatus });

        } catch (error) {
            console.error("Update Error:", error);
            Swal.fire("Error", "Unable to update status", "error");
        }
    };

    const handleImageClick = (path) => {
        setModalImage(path);
        setIsModalOpen(true);
    };

    return (
        <div className="page-content">
            <Container fluid={true}>
                <Breadcrumbs title="Applications" breadcrumbItem="Application Details" />

                {/* HEADER */}
                <Card className="mb-4 shadow-sm">
                    <CardBody>
                        <Row className="align-items-center">
                            <Col md={2} className="text-center">
                                <img
                                    src={documents.photo}
                                    alt="Applicant"
                                    className="rounded-circle"
                                    width="120"
                                    height="120"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Col>

                            <Col md={6}>
                                <h3 className="mb-1">{applicant.fullName}</h3>
                                <p className="text-muted mb-2">
                                    {schemeId?.name} – {schemeId?.category}
                                </p>

                                <p className="mb-0"><strong>Aadhaar:</strong> {applicant.aadhaar}</p>
                                <p className="mb-0"><strong>Mobile:</strong> {applicant.mobile}</p>
                            </Col>

                            {/* ACTIONS */}
                            <Col md={4} className="text-md-end mt-3 mt-md-0">
                                <div className="mb-3">{getStatusBadge(status)}</div>

                                <div className="d-flex gap-2 justify-content-md-end">
                                    <Button
                                        color="success"
                                        disabled={status === "Approved"}
                                        onClick={() => updateStatus("Approved")}
                                    >
                                        <FaCheck className="me-1" /> Approve
                                    </Button>

                                    <Button
                                        color="danger"
                                        disabled={status === "Rejected"}
                                        onClick={() => updateStatus("Rejected")}
                                    >
                                        <FaTimes className="me-1" /> Reject
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>


                {/* ===================== TABS ===================== */}

                <Card>
                    <Nav tabs className="card-header-tabs px-4 d-flex gap-4">

                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => setActiveTab('1')}
                                style={{ cursor: 'pointer' }}
                            >
                                <FaUser className="me-2" /> Personal Details
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => setActiveTab('2')}
                                style={{ cursor: 'pointer' }}
                            >
                                <FaUniversity className="me-2" /> Scheme Related Info
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '3' })}
                                onClick={() => setActiveTab('3')}
                                style={{ cursor: 'pointer' }}
                            >
                                <FaFileAlt className="me-2" /> Documents
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '4' })}
                                onClick={() => setActiveTab('4')}
                                style={{ cursor: 'pointer' }}
                            >
                                <FaHistory className="me-2" /> Application Log
                            </NavLink>
                        </NavItem>

                    </Nav>


                    {/* TAB CONTENT START */}
                    <TabContent activeTab={activeTab}>


                        {/* TAB 1 – PERSONAL DETAILS */}
                        <TabPane tabId="1">
                            <CardBody className="p-4">
                                <h5 className="mb-4">Applicant Information</h5>

                                <Row>
                                    <DetailItem label="Father Name" value={applicant.fatherName} />
                                    <DetailItem label="Date of Birth" value={applicant.dob} />
                                    <DetailItem label="Gender" value={applicant.gender} />
                                    <DetailItem label="Caste" value={applicant.caste} />
                                    <DetailItem label="Email" value={applicant.email} />
                                    <DetailItem label="Marital Status" value={applicant.maritalStatus} />
                                </Row>

                                <hr className="my-4" />

                                <h5 className="mb-4">Address Information</h5>

                                <Row>
                                    <DetailItem label="House" value={address.house} />
                                    <DetailItem label="Village" value={address.village} />
                                    <DetailItem label="Mandal" value={address.mandal} />
                                    <DetailItem label="State" value={address.district === "TG" ? "Telangana" : address.district} />
                                    <DetailItem label="PIN" value={address.pin} />
                                    <DetailItem label="Assembly Constituency" value={address.assembly} />
                                </Row>
                            </CardBody>
                        </TabPane>


                        {/* TAB 2 – BANK + SCHEME */}
                        <TabPane tabId="2">
                            <CardBody className="p-4">

                                <h5 className="mb-4">Scheme Details</h5>
                                <Row>
                                    <DetailItem label="Land Details" value={schemeDetails.landDetails} />
                                    <DetailItem label="Survey Number" value={schemeDetails.surveyNo} />
                                    <DetailItem label="Business Type" value={schemeDetails.businessType} />
                                    <DetailItem label="Health ID" value={schemeDetails.healthId} />
                                    <DetailItem label="Housing Stage" value={schemeDetails.housingStage} />
                                    <DetailItem label="Employment Skill" value={schemeDetails.employmentSkill} />
                                </Row>

                                {/* <hr className="my-4"/>

                                <h5 className="mb-4">Bank Details</h5>
                                <Row>
                                    <DetailItem label="Bank Name" value={bank.bankName} />
                                    <DetailItem label="Acc. Holder" value={bank.accountHolder} />
                                    <DetailItem label="Account Number" value={bank.accountNumber} />
                                    <DetailItem label="IFSC" value={bank.ifsc} />
                                    <DetailItem label="Account Type" value={bank.accountType} />
                                </Row> */}

                            </CardBody>
                        </TabPane>


                        {/* TAB 3 – DOCUMENTS */}
                        <TabPane tabId="3">
                            <CardBody className="p-4">

                                <h5 className="mb-4">Uploaded Documents</h5>

                                <Row>
                                    <DocumentItem label="Photo" path={documents.photo} onImageClick={handleImageClick}/>
                                    <DocumentItem label="Aadhaar" path={documents.aadhaar} onImageClick={handleImageClick}/>
                                    <DocumentItem label="Ration" path={documents.ration} onImageClick={handleImageClick}/>
                                    <DocumentItem label="Caste" path={documents.caste} onImageClick={handleImageClick}/>
                                    <DocumentItem label="Income" path={documents.income} onImageClick={handleImageClick}/>
                                    <DocumentItem label="Bank" path={documents.bank} onImageClick={handleImageClick}/>

                                    {documents.extraFiles?.map((file, idx) => (
                                        <DocumentItem key={idx} label={`Extra File ${idx+1}`} path={file} />
                                    ))}
                                </Row>

                            </CardBody>

                            {/* MODAL */}
                            <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} centered size="lg">
                                <ModalHeader toggle={() => setIsModalOpen(false)}>Document Preview</ModalHeader>
                                <ModalBody className="text-center">
                                    <img src={modalImage} alt="Document Preview" className="img-fluid" />
                                </ModalBody>
                            </Modal>

                        </TabPane>


                        {/* TAB 4 – LOG */}
                        <TabPane tabId="4">
                            <CardBody className="p-4">
                                <h5 className="mb-4">Application Log</h5>

                                <Row>
                                    <DetailItem label="Applied On" value={new Date(createdAt).toLocaleString()} />
                                    <DetailItem label="Status" value={status} />
                                    <DetailItem label="Remarks" value={remarks || "—"} />
                                    <DetailItem label="Reviewed By" value={reviewedBy?.name || "—"} />
                                </Row>

                                <hr className="my-4"/>

                                <h5 className="mb-4">Declaration</h5>
                                <Row>
                                    <DetailItem label="Declared" value={declaration.declaration ? "Yes" : "No"} />
                                    <DetailItem label="Submission Place" value={declaration.submissionPlace} />
                                </Row>

                            </CardBody>
                        </TabPane>


                    </TabContent>
                </Card>
            </Container>
        </div>
    );
};

export default ApplicationOverview;
