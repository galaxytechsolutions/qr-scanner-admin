import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../withRouter";
import dummy from "../../../assets/images/dummy.png";
import { ImgBaseUrl } from "../../../Instence/ImgInstence.jsx";

const ProfileMenu = (props) => {
  const [menu, setMenu] = useState(false);
  const [username, setUsername] = useState("Admin");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("authUser");
    if (auth) {
      const obj = JSON.parse(auth);
      setUsername(obj.user?.name || "Admin");
      setProfile(obj.user?.profilePic ? ImgBaseUrl + obj.user.profilePic : null);
    }
  }, [props.success]);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-end">
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block">
        <DropdownToggle className="btn header-item d-flex align-items-center gap-2" tag="button">

          {/* 🔥 If profile pic missing → show yellow circle with initial */}
          {profile ? (
            <img
              className="rounded-circle header-profile-user"
              src={profile}
              alt="Profile"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#FFEB3B",
                color: "#000",
                fontWeight: "bold",
                border: "2px solid #FBC02D",
              }}
              title="Profile incomplete - photo missing"
            >
              {username.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="d-none d-xl-inline-block">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag={Link} to="/userprofile">
            <i className="ri-user-line align-middle me-2" />
            {props.t("Profile")}
          </DropdownItem>

          <DropdownItem tag={Link} to="/auth-lock-screen">
            <i className="ri-lock-unlock-line align-middle me-2" />
            {props.t("Lock screen")}
          </DropdownItem>

          <DropdownItem onClick={handleLogout}>
            <i className="ri-shut-down-line align-middle me-2 text-danger" />
            {props.t("Logout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Container>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = (state) => {
  const { error, success } = state.profile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {})(withTranslation()(ProfileMenu))
);
