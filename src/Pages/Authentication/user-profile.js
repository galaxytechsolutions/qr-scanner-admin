import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Alert,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode"; // if you use JWT, otherwise remove
import { FaEye, FaEyeSlash } from "react-icons/fa";
import withRouter from "../../components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import avatar from "../../assets/images/users/avatar-1.jpg";

const UserProfile = () => {
  document.title = "Profile | Home QR Admin";

  const [adminId, setAdminId] = useState("");
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Admin",
    lockScreenPassword: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [profileImage, setProfileImage] = useState(avatar);
  const [imageFile, setImageFile] = useState(null);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    lock: false,
  });

  const [showReLoginModal, setShowReLoginModal] = useState(false);

  // Load user from localStorage (your current auth method)
  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      setAdminId(user.uid || user.id || "1");
      setAdminInfo({
        name: user.username || user.displayName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "Admin",
        lockScreenPassword: user.lockScreenPassword || "",
      });
      setProfileImage(user.profileImage || avatar);
    }
  }, []);

  const showTempMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  };

  // Profile Info Formik (Name, Email, Phone, Lock Screen Password)
  const infoFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: adminInfo.name,
      email: adminInfo.email,
      phone: adminInfo.phone || "",
      lockScreenPassword: adminInfo.lockScreenPassword || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter your name"),
      email: Yup.string().email("Invalid email").required("Please enter email"),
      phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits"),
      lockScreenPassword: Yup.string()
        .min(4, "Minimum 4 characters")
        .required("Please enter Lock Screen Password"),
    }),
    onSubmit: (values) => {
      // Update localStorage or dispatch Redux action
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("authUser")),
        username: values.name,
        email: values.email,
        phone: values.phone,
        lockScreenPassword: values.lockScreenPassword,
      };
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      setAdminInfo((prev) => ({ ...prev, ...values }));
      showTempMessage(setSuccessMsg, "Profile info updated successfully!");

      if (values.lockScreenPassword !== adminInfo.lockScreenPassword) {
        setShowReLoginModal(true);
      }
    },
  });

  // Password Change Formik
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Enter current password"),
      newPassword: Yup.string()
        .min(6, "At least 6 characters")
        .required("Enter new password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm your new password"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Change password:", values);
      showTempMessage(setSuccessMsg, "Password changed successfully!");
      resetForm();
      setShowReLoginModal(true);
    },
  });

  // Image Upload Handler
  const handleImageUpload = () => {
    if (!imageFile) {
      showTempMessage(setErrorMsg, "Please select an image");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfileImage(base64);

      const updatedUser = {
        ...JSON.parse(localStorage.getItem("authUser")),
        profileImage: base64,
      };
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      showTempMessage(setSuccessMsg, "Profile picture updated successfully!");
    };
    reader.readAsDataURL(imageFile);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!adminId) {
    return (
      <Container fluid className="page-content">
        <Breadcrumb title="Home QR Admin" breadcrumbItem="Profile" />
        <Alert color="info">Loading profile...</Alert>
      </Container>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Home QR Admin" breadcrumbItem="Profile" />

        {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
        {successMsg && <Alert color="success">{successMsg}</Alert>}

        {/* Profile Overview */}
        <Card className="mb-4">
          <CardBody className="d-flex align-items-center">
            <img
              src={profileImage}
              alt="profile"
              className="avatar-md rounded-circle img-thumbnail me-3"
            />
            <div>
              <h5>{adminInfo.name}</h5>
              <p className="mb-1">{adminInfo.email}</p>
              <p className="mb-0 text-muted">Role: {adminInfo.role}</p>
            </div>
          </CardBody>
        </Card>

        {/* Update Profile Info */}
        <Card className="mb-4">
          <CardBody>
            <h5 className="mb-3">Update Profile Info</h5>
            <Form onSubmit={infoFormik.handleSubmit}>
              <div className="mb-3">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={infoFormik.values.name}
                  onChange={infoFormik.handleChange}
                  onBlur={infoFormik.handleBlur}
                  invalid={infoFormik.touched.name && infoFormik.errors.name}
                />
                <FormFeedback>{infoFormik.errors.name}</FormFeedback>
              </div>

              <div className="mb-3">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={infoFormik.values.email}
                  onChange={infoFormik.handleChange}
                  invalid={infoFormik.touched.email && infoFormik.errors.email}
                />
                <FormFeedback>{infoFormik.errors.email}</FormFeedback>
              </div>

              <div className="mb-3">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={infoFormik.values.phone}
                  onChange={infoFormik.handleChange}
                  invalid={infoFormik.touched.phone && infoFormik.errors.phone}
                />
                <FormFeedback>{infoFormik.errors.phone}</FormFeedback>
              </div>

              {/* Lock Screen Password */}
              <div className="mb-3 position-relative">
                <Label>Lock Screen Password</Label>
                <div className="position-relative">
                  <Input
                    type={showPassword.lock ? "text" : "password"}
                    name="lockScreenPassword"
                    value={infoFormik.values.lockScreenPassword}
                    onChange={infoFormik.handleChange}
                    invalid={
                      infoFormik.touched.lockScreenPassword &&
                      infoFormik.errors.lockScreenPassword
                    }
                  />
                  <span
                    onClick={() => setShowPassword((p) => ({ ...p, lock: !p.lock }))}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword.lock ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <FormFeedback>{infoFormik.errors.lockScreenPassword}</FormFeedback>
                </div>
              </div>

              <Button color="primary" type="submit" block>
                Update Info
              </Button>
            </Form>
          </CardBody>
        </Card>

        {/* Change Password */}
        <h4 className="mt-4 mb-3">Change Password</h4>
        <Card>
          <CardBody>
            <Form onSubmit={passwordFormik.handleSubmit}>
              {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                <div className="mb-3 position-relative" key={field}>
                  <Label>
                    {field === "currentPassword"
                      ? "Current Password"
                      : field === "newPassword"
                      ? "New Password"
                      : "Confirm New Password"}
                  </Label>
                  <div className="position-relative">
                    <Input
                      type={
                        showPassword[field.replace("Password", "").toLowerCase()]
                          ? "text"
                          : "password"
                      }
                      name={field}
                      value={passwordFormik.values[field]}
                      onChange={passwordFormik.handleChange}
                      invalid={
                        passwordFormik.touched[field] && passwordFormik.errors[field]
                      }
                    />
                    <span
                      onClick={() =>
                        setShowPassword((p) => ({
                          ...p,
                          [field.replace("Password", "").toLowerCase()]:
                            !p[field.replace("Password", "").toLowerCase()],
                        }))
                      }
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword[field.replace("Password", "").toLowerCase()] ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </span>
                    <FormFeedback>{passwordFormik.errors[field]}</FormFeedback>
                  </div>
                </div>
              ))}

              <Button color="warning" type="submit" block>
                Change Password
              </Button>
            </Form>
          </CardBody>
        </Card>

        {/* Update Profile Picture */}
        <h4 className="mt-4 mb-3">Update Profile Picture</h4>
        <Card>
          <CardBody>
            <div className="text-center mb-3">
              <img
                src={profileImage}
                alt="profile-preview"
                className="avatar-lg rounded-circle img-thumbnail mb-3"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setProfileImage(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <Button color="info" block onClick={handleImageUpload}>
              Upload Picture
            </Button>
          </CardBody>
        </Card>
      </Container>

      {/* Re-Login Modal */}
      <Modal isOpen={showReLoginModal} centered>
        <ModalHeader>Re-login Required</ModalHeader>
        <ModalBody>
          <p>
            Your password or lock screen password has been updated. For security reasons,
            please log in again.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleLogout}>
            OK
          </Button>
          <Button color="secondary" onClick={() => setShowReLoginModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default withRouter(UserProfile);