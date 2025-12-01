import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../withRouter";
import dummy from "../../../assets/images/dummy.png"
// users
import user1 from "../../../assets/images/users/avatar-1.jpg";
import {ImgBaseUrl} from "../../../Instence/ImgInstence.jsx";


const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
const navigate = useNavigate();
  const [username, setusername] = useState("Admin");
const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        console.log("token details", obj)
        setusername(obj.user.name);
        // setProfile(obj.profileImage)
           setProfile(obj.user?.profilePic ? ImgBaseUrl + obj.user?.profilePic : dummy);
    }
  }, [props.success]);

console.log("Profile", profile)
const handleLogout = () => {
  localStorage.removeItem("authUser");
  navigate("/login");
}



  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={profile || dummy}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-2">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag={Link} to="/userprofile">
            {" "} 
            <i className="ri-user-line align-middle me-2" />
            {props.t("Profile")}{" "}
          </DropdownItem>
          {/* <DropdownItem tag="a" href="#">
            <i className="ri-wallet-2-line align-middle me-2" />
            {props.t("My Wallet")}
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <span className="badge bg-success float-end mt-1">11</span>
            <i className="ri-settings-2-line align-middle me-2" />
            {props.t("Settings")}
          </DropdownItem> */}
          <DropdownItem tag={Link} to="/auth-lock-screen">
            <i className="ri-lock-unlock-line align-middle me-2" />
            {props.t("Lock screen")}
          </DropdownItem>
          {/* <div className="dropdown-divider" /> */}
          <DropdownItem onClick={handleLogout} className="dropdown-item">
            <i className="ri-shut-down-line align-middle me-2 text-danger" />
            <span>{props.t("Logout")}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
