import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  NavLink,
  Navigate,
  NavLink as ReactLink,
  useNavigate,
} from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem } from "react-bootstrap";
import { doLogout, getUser, isLoggedIn } from "../../services/user-service";
import "./TrusteeNavbar.css";
import { Link, animateScroll as scroll } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const TrusteeNavbar = (args) => {
  let navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  // const [login, setLogin] = useState(false);
  //   const [user, setUser] = useState(undefined);

  //   useEffect(() => {
  //     setLogin(isLoggedIn());
  //     setUser(getUser());
  //   }, [login]);

  const user = getUser();

  const logout = () => {
    doLogout();
    // setLogin(false);
    navigate("/");
  };
  const [isPopupOpen, setPopupOpen] = useState(false);
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
  const [imageSrc, setImageSrc] = useState("");
  const base64ToImage = () => {
    const base64String = user.image;
    const trimmedBase64 = base64String ? base64String.trim() : '';
    if (trimmedBase64) {
      setImageSrc(`data:image/jpeg;base64,${trimmedBase64}`);
    }
  };
  useEffect(() => {
    base64ToImage();
  }, []);
  return (
    <div>
      <Navbar className="navbar" expand="lg">
        <NavbarBrand style={{ paddingLeft: "20px" }}>
          <NavLink tag={ReactLink} to="/trustee/dashboard">
            <img className="navbar_logo_image" src="/logo192.png" alt="logoPng" />
          </NavLink>
        </NavbarBrand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ marginRight: "20px" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link>
              <Nav.Link>
                <NavLink
                  className="navname"
                  tag={ReactLink}
                  to="/trustee/dashboard"
                >
                  Dashboard
                </NavLink>
              </Nav.Link>
            </Link>

            <Link>
              <Nav.Link>
                <NavLink
                  className="navname" 
                  tag={ReactLink}
                  to="/trustee/why-I-Chest"
                >
                  Why I-Chest
                </NavLink>
              </Nav.Link>
            </Link>
            <Link to="About" smooth={true} duration={50}>
              <Nav.Link>
                <NavLink
                  className="navname"
                  onClick={() => alert('comming soon')} tag={ReactLink} to="#"
                >
                  Explore
                </NavLink>
              </Nav.Link>
            </Link>
            <Link to="projects" smooth={true} duration={50}>
              <Nav.Link>
                <NavLink
                  className="navname"
                  onClick={() => alert('comming soon')} tag={ReactLink} to="#"
                >
                  User
                </NavLink>
              </Nav.Link>
            </Link>
            <Link to="Contact Us" smooth={true} duration={50}>
              <Nav.Link>
                <NavLink
                  className="navname"
                  onClick={() => alert('comming soon')} tag={ReactLink} to="#"
                >
                  Beneficiary
                </NavLink>
              </Nav.Link>
            </Link>
          </Nav>
          <Nav navbar>
            <NavItem>
              <NavLink onClick={togglePopup} className="nav-user-name">
                <img
                  src={imageSrc || "./../../.././img/avtar.jpg"}
                  alt="avtar_image"
                />
                {user.firstName + " "}
                {user.lastName}
                <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faCaretDown} />
              </NavLink>
            </NavItem>
            {isPopupOpen && (
              <div className="popup1">
                <ul>
                  <a href="/trustee/profile">Profile</a>
                  <a href="/trustee/dashboard">Dashboard</a>
                  <a onClick={logout} >
                    Logout
                  </a>
                </ul>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>

  );
};
export default TrusteeNavbar;
