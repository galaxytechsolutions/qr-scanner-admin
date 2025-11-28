import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

import { useSelector, useDispatch } from "react-redux";
import withRouter from "../../components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import avatar from "../../assets/images/users/avatar-1.jpg";

import { editProfile, resetProfileFlag } from "../../store/actions";
import { createSelector } from "reselect";

const UserProfile = () => {
  document.title = "Profile | Home QR";

  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);
  const [profileImage, setProfileImage] = useState(avatar);

  const userprofilepage = createSelector(
    (state) => state.profile,
    (state) => ({
      error: state.error,
      success: state.success,
    })
  );

  const { error, success } = useSelector(userprofilepage);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      setname(obj.username || obj.displayName);
      setemail(obj.email);
      setidx(obj.uid);
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);

  // Username Formik
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: name || "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
      console.log("Username updated:", values);
    },
  });

  // Password Formik
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Enter current password"),
      newPassword: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Enter new password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm new password"),
    }),
    onSubmit: (values) => {
      console.log("Password updated:", values);
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Home QR Admin" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && (
                <Alert color="danger">
                  <div>{error}</div>
                </Alert>
              )}
              {success && (
                <Alert color="success">
                  <div>{success}</div>
                </Alert>
              )}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={profileImage}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{email}</p>
                        {/* <p className="mb-0">Id no: #{idx}</p> */}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Username Update */}
          <h4 className="card-title mb-4 mt-4">Change User Name</h4>
          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="username"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username || ""}
                    invalid={
                      validation.touched.username &&
                      validation.errors.username
                        ? true
                        : false
                    }
                  />
                  {validation.touched.username &&
                    validation.errors.username && (
                      <FormFeedback type="invalid">
                        {validation.errors.username}
                      </FormFeedback>
                    )}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className=" mt-4">
                  <Button type="submit" color="primary">
                    Update User Name
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>

          {/* Profile Picture Upload */}
          <h4 className="card-title mb-4 mt-5">Change Profile Picture</h4>
          <Card>
            <CardBody>
              <Form>
                <div className="form-group">
                  <Label className="form-label">Upload Profile Picture</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div className="mt-3">
                  <Button color="primary">Upload Picture</Button>
                </div>
              </Form>
            </CardBody>
          </Card>

          {/* Password Change */}
          <h4 className="card-title mb-4 mt-5">Change Password</h4>
          <Card>
            <CardBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  passwordFormik.handleSubmit();
                }}
              >
                <div className="form-group mb-3">
                  <Label className="form-label">Current Password</Label>
                  <Input
                    type="password"
                    name="currentPassword"
                    className="form-control"
                    placeholder="Enter Current Password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.currentPassword}
                    invalid={
                      passwordFormik.touched.currentPassword &&
                      passwordFormik.errors.currentPassword
                    }
                  />
                  {passwordFormik.touched.currentPassword &&
                    passwordFormik.errors.currentPassword && (
                      <FormFeedback>
                        {passwordFormik.errors.currentPassword}
                      </FormFeedback>
                    )}
                </div>

                <div className="form-group mb-3">
                  <Label className="form-label">New Password</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter New Password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.newPassword}
                    invalid={
                      passwordFormik.touched.newPassword &&
                      passwordFormik.errors.newPassword
                    }
                  />
                  {passwordFormik.touched.newPassword &&
                    passwordFormik.errors.newPassword && (
                      <FormFeedback>
                        {passwordFormik.errors.newPassword}
                      </FormFeedback>
                    )}
                </div>

                <div className="form-group mb-4">
                  <Label className="form-label">Confirm New Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm New Password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.confirmPassword}
                    invalid={
                      passwordFormik.touched.confirmPassword &&
                      passwordFormik.errors.confirmPassword
                    }
                  />
                  {passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword && (
                      <FormFeedback>
                        {passwordFormik.errors.confirmPassword}
                      </FormFeedback>
                    )}
                </div>

                <div className="">
                  <Button type="submit" color="primary">
                    Update Password
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
