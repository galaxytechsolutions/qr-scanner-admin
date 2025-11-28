import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Badge } from "reactstrap";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "../components/Common/Breadcrumb";
import { Instance } from "../Instence/Instence";
import {
  FaFileAlt,
  FaTag,
  FaUserCheck,
  FaCalendarAlt,
  FaListUl,
} from "react-icons/fa";

const SchemeDetails = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchScheme = async () => {
    try {
      const res = await Instance.get(`/scheme/${id}`);
      setScheme(res.data.scheme);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheme();
  }, []);

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (!scheme) return <p className="text-center py-5">Scheme not found.</p>;

  return (
    <div className="page-content">
      <Breadcrumbs title="Home QR" breadcrumbItem="Scheme Details" />

      <Card className="shadow">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{scheme.name}</h4>
          <Link to="/schemes" className="btn btn-primary btn-sm">
            Back to Schemes
          </Link>
        </CardHeader>

        <CardBody>
          {/* CATEGORY */}
          <div className="mb-4">
            <h6 className="text-muted">
              <FaTag className="me-2 text-info" />
              Category
            </h6>
            <p className="fw-bold">{scheme.category}</p>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <h6 className="text-muted">
              <FaFileAlt className="me-2 text-primary" />
              Description
            </h6>
            <p>{scheme.description}</p>
          </div>

          {/* ELIGIBILITY */}
          <div className="mb-4">
            <h6 className="text-muted">
              <FaUserCheck className="me-2 text-success" />
              Eligibility Criteria
            </h6>
            <p>{scheme.eligibilityCriteria}</p>
          </div>

          {/* BENEFITS */}
          <div className="mb-4">
            <h6 className="text-muted">
              <FaListUl className="me-2 text-warning" />
              Benefits
            </h6>
            <p>{scheme.benefits}</p>
          </div>

          {/* REQUIRED DOCUMENTS */}
          <div className="mb-4">
            <h6 className="text-muted">
              <FaListUl className="me-2 text-danger" />
              Required Documents
            </h6>
            <ul>
              {scheme.requiredDocuments?.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>

          {/* DATES */}
          <div className="mb-4">
            <h6 className="text-muted">
              <FaCalendarAlt className="me-2 text-info" />
              Start & End Dates
            </h6>

            <p>
              <strong>Start:</strong>{" "}
              {new Date(scheme.startDate).toLocaleDateString()}
            </p>

            <p>
              <strong>End:</strong>{" "}
              {scheme.endDate
                ? new Date(scheme.endDate).toLocaleDateString()
                : "-"}
            </p>
          </div>

          {/* STATUS */}
          <div className="mb-3">
            <h6 className="text-muted">Status</h6>
            {scheme.isActive ? (
              <Badge color="success">Active</Badge>
            ) : (
              <Badge color="danger">Inactive</Badge>
            )}
          </div>

          {/* CREATED / UPDATED */}
          <div className="mt-4 text-muted small">
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(scheme.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(scheme.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SchemeDetails;
