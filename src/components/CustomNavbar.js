import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { NavLink as ReactLink, useNavigate } from "react-router-dom";
import {
  Collapse,
  // Navbar,
  NavbarToggler,
  NavbarBrand,
  // Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import { doLogout, getUser, isLoggedIn } from "../services/user-service";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, animateScroll as scroll } from "react-scroll";
const CustomNavbar = (args) => {
  let navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(getUser());
  }, [login]);

  const logout = () => {
    doLogout();
    setLogin(false);
    navigate("/");
  };

  return (
    <Navbar className="navbar" expand="md">
      <Navbar.Brand style={{ paddingLeft: "20px" }}>
        <a href="http://localhost:3000/">
          <img className="navbar_logo_image" src="/logo192.png" alt="logoPng" />
        </a>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link
            className="navname nav-link"
            to="Home"
            smooth={true}
            duration={50}
          >
            Home
          </Link>

          <Link
            className="navname nav-link"
            to="Service"
            smooth={true}
            duration={50}
          >
            Service
          </Link>
          <Link
            className="navname nav-link"
            to="About"
            smooth={true}
            duration={50}
          >
            About
          </Link>
          <Link
            className="navname nav-link"
            to="projects"
            smooth={true}
            duration={50}
          >
            Projects
          </Link>
          <Link
            className="navname nav-link"
            to="Team"
            smooth={true}
            duration={50}
          >
            Our Team
          </Link>
          <Link
            className="navname nav-link"
            to="Contact Us"
            smooth={true}
            duration={50}
          >
            Contact Us
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default CustomNavbar;
