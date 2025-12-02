import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReactSwitch from "react-switch";
import { Instance } from "../../Instence/Instence";
const ReferralForm = () => {
  document.title = "Referral Form | Home QR";
  const { referralId } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    document.body.className = "bg-pattern";
    return () => {
      document.body.className = "";
    };
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      phoneNo: "",
      whatsappActive: false,
      profilePic: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter your name"),
      email: Yup.string().email("Invalid email").required("Please enter your email"),
      phoneNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Please enter your phone number"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        // formData.append("phoneNo", values.phoneNo);
        formData.append("phoneNo", "91" + values.phoneNo);

        
        formData.append("whatsappActive", String(values.whatsappActive));
        if (values.profilePic) {
          formData.append("file", values.profilePic);
        }
        await Instance.post(`/referral/submit/${referralId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Swal.fire({
          title: "Success!",
          text: "Thank you for your submission. We will be in touch shortly.",
          icon: "success",
          confirmButtonText: "OK",
        })
        // .then(() => navigate("/login"));
      } catch (err) {
        console.error(err);

        if (err.response?.status === 410) {
          Swal.fire({
            icon: "warning",
            title: "Link Expired",
            text: "This referral link is no longer valid.",
          }).then(() => navigate("/referral-expired"));
        } else {
          Swal.fire("Error", err.response?.data?.error || "Something went wrong.", "error");
        }
      }
    },
  });

  // Handle profile image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    validation.setFieldValue("profilePic", file);
  };



  return (
    <React.Fragment>
      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card>
                <CardBody className="p-4">
                  <div className="text-center mb-3">
                    <p className="font-size-18 fw-bold mb-1">Home QR</p>
                    <h4 className="font-size-18 text-muted">
                      Join Our Referral Program
                    </h4>
                    <p className="text-center">
                      Referred by code: <strong>{referralId}</strong>
                    </p>
                  </div>

                  <Form onSubmit={validation.handleSubmit} encType="multipart/form-data">
                    {/* Full Name */}
                    <div className="mb-3">
                      <Label className="form-label">Full Name</Label>
                      <Input
                        name="name"
                        placeholder="Enter your name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name}
                        invalid={!!(validation.touched.name && validation.errors.name)}
                      />
                      {validation.touched.name && validation.errors.name && (
                        <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                      )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <Label className="form-label">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email}
                        invalid={!!(validation.touched.email && validation.errors.email)}
                      />
                      {validation.touched.email && validation.errors.email && (
                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                      <Label className="form-label">Phone Number</Label>
                      <Input
                        name="phoneNo"
                        placeholder="Enter your 10-digit phone number"
                        max={10}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.phoneNo}
                        invalid={!!(validation.touched.phoneNo && validation.errors.phoneNo)}
                      />
                      {validation.touched.phoneNo && validation.errors.phoneNo && (
                        <FormFeedback type="invalid">{validation.errors.phoneNo}</FormFeedback>
                      )}
                    </div>

                    {/* WhatsApp Active */}
                    <FormGroup className="d-flex align-items-center mb-4">
                      <Label className="me-3 mb-0">WhatsApp Active</Label>
                      <ReactSwitch
                        checked={!!validation.values.whatsappActive}
                        onChange={(checked) =>
                          validation.setFieldValue("whatsappActive", checked)
                        }
                        onColor="#0d6efd"
                        offColor="#ccc"
                        handleDiameter={12}
                        height={20}
                        width={40}
                        uncheckedIcon={false}
                        checkedIcon={false}
                      />
                      <span className="ms-2 fw-bold justify-content-between">
                        {validation.values.whatsappActive ? "Yes" : "No"}
                      </span>
                    </FormGroup>

                    {/* Profile Picture Upload */}
                    <div className="mb-3">
                      <Label className="form-label">Profile Picture</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control"
                      />
                    </div>

                    <div className="d-grid mt-4">
                      <button className="btn btn-primary waves-effect waves-light" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ReferralForm;
