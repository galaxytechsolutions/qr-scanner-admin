import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Instance } from "../Instence/Instence";
import { ImgBaseUrl } from "../Instence/ImgInstence";
import { Card, CardBody, Row, Col, Container } from "reactstrap";
import Breadcrumbs from "../components/Common/Breadcrumb";
const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await Instance.get(`/issue/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssue(res.data.issue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!issue) return <div className="text-center mt-5">Issue not found</div>;

  return (
    <div className="page-content">
      <Container fluid={true}>
            <Breadcrumbs title="Home QR" breadcrumbItem="Reported Issues" />
      <div className="container mt-4">
        <h3 className="mb-3 fw-bold text-primary">Issue Details</h3>

        <Card className="shadow-sm border-0 rounded-3">
          <CardBody>

            {/* Issue Header detaild*/}
            
            <Row className="border-bottom pb-3 mb-3">
              <Col md={8}>
                <h5 className="fw-bold mb-1">{issue.issueType}</h5>
                <p className="text-muted mb-1">
                  <strong>Constituency:</strong> {issue.staffConstituency}
                </p>
                <p className="text-muted mb-0">
                  <strong>Reported At:</strong>{" "}
                  {new Date(issue.createdAt).toLocaleString()}
                </p>
              </Col>

              {/* <Col md={4} className="text-md-end text-center">
                {issue.image && (
                  <img
                    src={`${ImgBaseUrl}${issue.image}`}
                    alt="Issue"
                    className="rounded shadow-sm"
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(`${ImgBaseUrl}${issue.image}`, "_blank")
                    }
                  />
                )}
              </Col> */}
            </Row>

            {/* Full Width Image */}
{issue.image && (
  <Row className="mb-4">
    <Col md={12} className="text-center">
      <img
        src={`${ImgBaseUrl}${issue.image}`}
        alt="Issue"
        className="rounded shadow"
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "auto",
          objectFit: "contain",
          cursor: "pointer",
        }}
        // onClick={() => window.open(`${ImgBaseUrl}${issue.image}`, "_blank")}
      />
      {/* <p className="text-muted mt-2">Click to open in full size</p> */}
    </Col>
  </Row>
)}


            {/* Remarks */}
            <div className="mb-4">
              <h6 className="fw-bold">Remarks:</h6>
              <p className="text-dark px-2 py-2 bg-light rounded">
                {issue.remarks || "No remarks provided."}
              </p>
            </div>

            {/* Staff Info */}
            <div>
              <h5 className="fw-bold mb-3">Staff Details</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Name:</strong></p>
                  <p className="text-muted">{issue.staffId?.name}</p>
                </Col>

                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Phone:</strong></p>
                  <p className="text-muted">{issue.staffId?.phoneNo}</p>
                </Col>

                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Location Code:</strong></p>
                  <p className="text-muted">{issue.staffId?.locationCode}</p>
                </Col>

                <Col md={6}>
                  <p className="mb-1"><strong>Staff Constituency:</strong></p>
                  <p className="text-muted">{issue.staffId?.constituency}</p>
                </Col>
              </Row>
            </div>

          </CardBody>
        </Card>
      </div>
      </Container>
    </div>
  );
};

export default IssueDetails;
