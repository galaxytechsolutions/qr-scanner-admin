import React, { useEffect, useState } from "react";
import {
    Badge,
    Card,
    Col,
    Container,
    Image,
    Row,
    Spinner,
    Stack,
} from "react-bootstrap";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapPin,
    FaCalendarAlt,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Instance } from "../../Instence/Instence";
import { ImgBaseUrl } from "../../Instence/ImgInstence";

const AdminOverview = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // In a real app, you'd use this ID to fetch data

    useEffect(() => {
        const fetchAdmin = async () => {
            setLoading(true);
            try {
                const res = await Instance.get(`/admin/${id}`);
                setAdmin(res.data.admin);
                console.log("Fetched admin:", res.data?.admin);
            } catch (err) {
                setError("Failed to fetch admin data.");
                console.error("Error fetching admin:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, [id]);

    if (loading) {
        return (
            <div className="page-content text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error || !admin) {
        return (
            <div className="page-content text-center mt-5">
                <h5 className="text-danger">{error || "No admin data found."}</h5>
            </div>
        );
    }

    return (
        <div className="page-content">
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col lg={6} md={10}>
                        <Card className="shadow-sm rounded-3 border-0">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex align-items-center mb-4">
                                    <Image
                                        src={
                                           `${ImgBaseUrl}${admin.profilePic}` ||
                                           "https://via.placeholder.com/100x100.png?text=No+Image"
                                        }
                                        alt={admin.name}
                                        roundedCircle
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />

                                    <div className="ms-3">
                                        <h3 className="fw-bold mb-1">{admin.name}</h3>
                                        <Badge bg="primary-subtle" text="primary" className="px-2 py-1">
                                            {admin.role}
                                        </Badge>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <Stack gap={3}>
                                    <InfoItem icon={<FaEnvelope />} label="Email" value={admin.email} />
                                    <InfoItem icon={<FaPhoneAlt />} label="Phone" value={admin.phoneNo} />
                                    <InfoItem icon={<FaMapPin />} label="Constituency" value={admin.constituency} />
                                    <InfoItem icon={<FaCalendarAlt />} label="Joined On" value={new Date(admin.createdAt).toLocaleDateString()} />
                                </Stack>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="d-flex align-items-center gap-3">
        {icon && <div className="text-muted" style={{ width: "20px" }}>{icon}</div>}
        <div className="d-grid" style={{ gridTemplateColumns: "120px auto", flex: 1 }}>
            <span className="fw-semibold text-muted">{label}</span>
            <span className="text-dark">: {value}</span>
        </div>
    </div>
);

export default AdminOverview;