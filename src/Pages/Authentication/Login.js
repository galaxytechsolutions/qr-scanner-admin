import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, Navigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { loginUser, socialLogin } from "../../store/actions";
import { createSelector } from "reselect";
import { Instance } from "../../Instence/Instence";

const Login = (props) => {
  document.title = "Login | QR INTI ID";
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const loginpage = createSelector(
    (state) => state.login,
    (state) => ({
      error: state.error,
    })
  );

  const { error } = useSelector(loginpage);

  const signIn = (type) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await Instance.post("/auth/admin/login", {
        email: validation.values.email,
        password: validation.values.password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("authUser", JSON.stringify(res.data));
        console.log("Redirecting to Dashboard");
        setRedirect(true);
      } else {
        validation.setErrors({
          email: "Invalid Email or Password",
          password: "Invalid Email or Password",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      validation.setErrors({
        email: "Something went wrong. Try again later.",
      });
    }

    return false;
  };


  useEffect(() => {
    document.body.className = "bg-pattern";
    return function cleanup() {
      document.body.className = "";
    };
  });

  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <React.Fragment>
      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card>
                <CardBody className="p-4">
                  <div>
                    <div className="text-center">
                      {/* <Link to="/">
                        <img
                          src={logodark}
                          alt=""
                          height="24"
                          className="auth-logo logo-dark mx-auto"
                        />
                        <img
                          src={logolight}
                          alt=""
                          height="24"
                          className="auth-logo logo-light mx-auto"
                        />
                      </Link> */}
                      <p className="font-size-18 font-bold mb-1 ">QR INTI ID</p>
                    </div>
                    <h4 className="font-size-18 text-muted  text-center">
                      Welcome Back !
                    </h4>
                    <p className="mb-5 text-center">
                      Sign in to continue to QR INTI ID.
                    </p>
                    <Form className="form-horizontal" onSubmit={handleLogin}>
                      {error ? (
                        <Alert color="danger">
                          <div>{error}</div>
                        </Alert>
                      ) : null}
                      <Row>
                        <Col md={12}>
                          <div className="mb-4">
                            <Label className="form-label">Email</Label>
                            <Input
                              name="email"
                              className="form-control"
                              placeholder="Enter email"
                              type="email"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ""}
                              invalid={
                                validation.touched.email &&
                                  validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                              validation.errors.email ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.email}</div>
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-4">
                            <Label className="form-label">Password</Label>
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type="password"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                  validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                              validation.errors.password ? (
                              <FormFeedback type="invalid">
                                <div> {validation.errors.password} </div>
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="d-grid mt-4">
                            <button
                              className="btn btn-primary waves-effect waves-light"
                              type="submit"
                            >
                              Log In
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
