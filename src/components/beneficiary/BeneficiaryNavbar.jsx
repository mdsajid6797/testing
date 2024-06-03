import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Nav, NavItem, Navbar, NavbarBrand } from "react-bootstrap";
import {
  NavLink,
  NavLink as ReactLink,
  useNavigate
} from "react-router-dom";
import { Link } from "react-scroll";
import { doLogout, getUser } from "../../services/user-service";
import "./../user/UserNavbar.css";

const BeneficiaryNavbar = (args) => {
  let navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  // const [login, setLogin] = useState(false);

  let user = getUser();

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
          <NavLink tag={ReactLink} to="/beneficiary/dashboard">
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
                  // onClick={() => alert("comming soon")}
                  to="/beneficiary/dashboard"
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
                  to="/beneficiary/why-I-Chest"
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
                  Trustee
                </NavLink>
              </Nav.Link>
            </Link>
            <Link to="Contact Us" smooth={true} duration={50}>
              <Nav.Link>
                <NavLink
                  className="navname"
                  onClick={() => alert('comming soon')} tag={ReactLink} to="#"
                >
                  User
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
                  <a href="/beneficiary/profile">Profile</a>
                  <a href="/beneficiary/dashboard">Dashboard</a>
                  <a onClick={logout}>
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
export default BeneficiaryNavbar;
