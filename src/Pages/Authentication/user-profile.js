

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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import withRouter from "../../components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import avatar from "../../assets/images/dummy.png";
import { Instance } from "../../Instence/Instence";
import { ImgBaseUrl } from "../../Instence/ImgInstence";


const UserProfile = () => {
  document.title = "Profile | Home QR Admin";

  const [adminId, setAdminId] = useState("");
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    phoneNo: "",
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

  // Load user from localStorage
  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const data = JSON.parse(authUser);
     const user = data.user;

      setAdminId(user?.id);

      setAdminInfo({
        name: user.name || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        role: user.role || "Admin",
        lockScreenPassword: user.lockScreenPassword || "",
      });

      setProfileImage(user.profilePic ? ImgBaseUrl + user.profilePic : avatar);


    }
  }, []);

  const showTempMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  };

  // ======================================================
  // 1️⃣ UPDATE PROFILE INFO USING AXIOS
  // ======================================================
  const infoFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: adminInfo.name,
      email: adminInfo.email,
      phoneNo: adminInfo.phoneNo || "",
      lockScreenPassword: adminInfo.lockScreenPassword || "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Enter your name"),
      email: Yup.string().email("Invalid email").required("Enter email"),
      phoneNo: Yup.string().matches(/^\d{10}$/, "phoneNo must be 10 digits"),
      // lockScreenPassword: Yup.string()
      //   .min(4)
      //   .required("Lock screen password required"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await Instance.put(`/admin/update-profile/${adminId}`, {
          name: values.name,
          email: values.email,
          phoneNo: values.phoneNo,
           lockScreenPassword: values.lockScreenPassword, 
        });

const old = JSON.parse(localStorage.getItem("authUser"));

const updatedUser = {
  ...old,
  user: {
    ...old.user,
    name: values.name,
    email: values.email,
    phoneNo: values.phoneNo,
    lockScreenPassword: values.lockScreenPassword
  }
};

localStorage.setItem("authUser", JSON.stringify(updatedUser));


        setAdminInfo((prev) => ({ ...prev, ...values }));

        showTempMessage(setSuccessMsg, "Profile updated successfully!");

        if (values.lockScreenPassword !== adminInfo.lockScreenPassword) {
          setShowReLoginModal(true);
        }
      } catch (err) {
        showTempMessage(
          setErrorMsg,
          err?.response?.data?.error || "Update failed"
        );
      }
    },
  });

  // ======================================================
  // 2️⃣ CHANGE PASSWORD USING AXIOS
  // ======================================================
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Enter current password"),
      newPassword: Yup.string().min(6).required("Enter new password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm your password"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await Instance.put(
          `/admin/change-password/${adminId}`,
          {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }
        );

        showTempMessage(setSuccessMsg, "Password changed successfully!");
        resetForm();
        setShowReLoginModal(true);
      } catch (err) {
        showTempMessage(
          setErrorMsg,
          err?.response?.data?.error || "Password change failed"
        );
      }
    },
  });

  // ======================================================
  // 3️⃣ UPDATE PROFILE PIC (Multer) USING AXIOS
  // ======================================================
  const handleImageUpload = async () => {
    if (!imageFile) {
      return showTempMessage(setErrorMsg, "Please select an image");
    }

    const formData = new FormData();
    formData.append("profilePic", imageFile);

    try {
      const res = await Instance.put(
        `/admin/change-profile/${adminId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
console.log("Image Res", res)
      const imageUrl = `${ImgBaseUrl}${res.data?.profilePic}`;
console.log("Image Url", imageUrl)
      // Update UI & localStorage
const old = JSON.parse(localStorage.getItem("authUser"));

const updatedUser = {
  ...old,
  user: {
    ...old.user,
    profilePic: res.data.profilePic,
  }
};

localStorage.setItem("authUser", JSON.stringify(updatedUser));


      setProfileImage(ImgBaseUrl + res.data.profilePic);


      showTempMessage(setSuccessMsg, "Profile picture updated!");
    } catch (err) {
      showTempMessage(
        setErrorMsg,
        err?.response?.data?.error || "Image upload failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Home QR Admin" breadcrumbItem="Profile" />

        {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
        {successMsg && <Alert color="success">{successMsg}</Alert>}

        {/* Profile card */}
        <Card className="mb-4">
          <CardBody className="d-flex align-items-center">
            <img
              src={profileImage || avatar}
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



        <Card className="mb-4">
  <CardBody>
    <h5 className="mb-3">Update Profile Info</h5>

    <Form onSubmit={infoFormik.handleSubmit}>
      {/* Name */}
      <div className="mb-3">
        <Label>Name</Label>
        <Input
          name="name"
          value={infoFormik.values.name}
          onChange={infoFormik.handleChange}
          invalid={infoFormik.touched.name && infoFormik.errors.name}
        />
        <FormFeedback>{infoFormik.errors.name}</FormFeedback>
      </div>

      {/* Email */}
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

      {/* phoneNo */}
      <div className="mb-3">
        <Label>Phone Number</Label>
        <Input
          name="phoneNo"
          value={infoFormik.values.phoneNo}
          onChange={infoFormik.handleChange}
          invalid={infoFormik.touched.phoneNo && infoFormik.errors.phoneNo}
        />
        <FormFeedback>{infoFormik.errors.phoneNo}</FormFeedback>
      </div>

      {/* 🔥 Lock Screen Password (NEW FIELD) */}
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

          {/* Eye Icon */}
          <span
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                lock: !prev.lock,
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
            {showPassword.lock ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <FormFeedback>{infoFormik.errors.lockScreenPassword}</FormFeedback>
      </div>

      {/* SUBMIT */}
      <Button color="primary" block type="submit">
        Update Info
      </Button>
    </Form>
  </CardBody>
</Card>


<Card className="mb-4">
  <CardBody>
    <h5 className="mb-3">Change Password</h5>

    <Form onSubmit={passwordFormik.handleSubmit}>
      {/* CURRENT PASSWORD */}
      <div className="mb-3 position-relative">
        <Label>Current Password</Label>
        <div className="position-relative">
          <Input
            type={showPassword.current ? "text" : "password"}
            name="currentPassword"
            value={passwordFormik.values.currentPassword}
            onChange={passwordFormik.handleChange}
            invalid={
              passwordFormik.touched.currentPassword &&
              passwordFormik.errors.currentPassword
            }
          />

          {/* Eye Icon */}
          <span
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                current: !prev.current,
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
            {showPassword.current ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <FormFeedback>{passwordFormik.errors.currentPassword}</FormFeedback>
      </div>

      {/* NEW PASSWORD */}
      <div className="mb-3 position-relative">
        <Label>New Password</Label>
        <div className="position-relative">
          <Input
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={passwordFormik.values.newPassword}
            onChange={passwordFormik.handleChange}
            invalid={
              passwordFormik.touched.newPassword &&
              passwordFormik.errors.newPassword
            }
          />

          <span
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                new: !prev.new,
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
            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <FormFeedback>{passwordFormik.errors.newPassword}</FormFeedback>
      </div>

      {/* CONFIRM NEW PASSWORD */}
      <div className="mb-3 position-relative">
        <Label>Confirm New Password</Label>
        <div className="position-relative">
          <Input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={passwordFormik.values.confirmPassword}
            onChange={passwordFormik.handleChange}
            invalid={
              passwordFormik.touched.confirmPassword &&
              passwordFormik.errors.confirmPassword
            }
          />

          <span
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                confirm: !prev.confirm,
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
            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <FormFeedback>{passwordFormik.errors.confirmPassword}</FormFeedback>
      </div>

      <Button color="warning" block type="submit">
        Change Password
      </Button>
    </Form>
  </CardBody>
</Card>



        {/* Profile Picture */}
        <Card>
          <CardBody>
            <h5 className="mb-3">Update Profile Picture</h5>

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
                  setImageFile(e.target.files[0]);

                  // Preview
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setProfileImage(reader.result);
                    reader.readAsDataURL(e.target.files[0]);
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

      {/* Re-login Modal */}
      <Modal isOpen={showReLoginModal} centered>
        <ModalHeader>Re-login Required</ModalHeader>
        <ModalBody>
          Your password has been updated. Please log in again.
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
