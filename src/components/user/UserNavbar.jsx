import React, { useEffect, useRef, useState } from "react";
import { Nav, NavItem, Navbar, NavbarBrand } from "react-bootstrap";
import { NavLink, NavLink as ReactLink, useNavigate } from "react-router-dom";
// import { Link } from "react-scroll";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  cryptoassetsGet,
  doLogout,
  getNetWorth,
  getNetworth,
  getToken,
  getUser,
  setNetWorth,
} from "../../services/user-service";
import "./UserNavbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Typed from "typed.js";
import Networthpopup from "../popup/networth-popup";

const useNetWorth = () => {
  const [networth, setNetworth] = useState("");
  const [category, setCategory] = useState([]);
  const [coins, setCoins] = useState([]);
  const [netEstimatedValue, setNetEstimatedValue] = useState(0);

  const fetchNetworth = () => {
    const id = getUser().commonId;

    getNetworth(id)
      .then((data) => {
        setNetworth(data.TotalNetWorth);
        setNetWorth(data.TotalNetWorth);
        const networth = data.TotalNetWorth;
      })
      .catch((error) => {});
  };

  // const getData = () => {
  //   let userId = getUser().commonId;

  //   let token = "Bearer " + getToken();
  //   cryptoassetsGet(token, userId).then((res) => {
  //     setCategory(res);
  //     console.log("cryptoassetsGet: ", res);
  //   }).catch((error)=> {});
  // };

  const calculateEstimatedValue1 = (coin1, quntity) => {
    const filteredCoins = coins.filter((coin) => coin.name === coin1);
    if (filteredCoins.length > 0) {
      return parseInt(quntity) * filteredCoins[0].current_price;
    } else {
      return 0;
    }
  };

  const calculateNetEstimatedValue = () => {
    let totalValue = 0;
    for (const row of category) {
      totalValue += calculateEstimatedValue1(row.coin, row.quntity);
    }
    return totalValue;
  };

  useEffect(() => {
    fetchNetworth();
    // getData();

    // Fetch the coins data
    // axios
    //   .get(
    //     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
    //   )
    //   .then((res) => {
    //     setCoins(res.data);

    //   })
    //   .catch((error) => {

    //   });
  }, []);

  useEffect(() => {
    const totalValue = calculateNetEstimatedValue();
    setNetEstimatedValue(totalValue);
  }, [category, coins]);

  return { networth, netEstimatedValue };
};

const UserNavbar = () => {
  const { networth, netEstimatedValue } = useNetWorth();
  const user = getUser(); // Get the user object
  const navigate = useNavigate(); // Use useNavigate directly if preferred

  const logout = () => {
    doLogout();
    // Redirect to the login page after logout
    navigate("/");
    // window.history.pushState(null, '', '/');
  };
  if (netEstimatedValue !== 0) {
    const totalNetWorth = networth + netEstimatedValue;
    setNetWorth(totalNetWorth);
  }

  const formattedTotalNetWorth = Number.parseFloat(getNetWorth()).toFixed(2);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
  const popupRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPopupOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [imageSrc, setImageSrc] = useState("");
  const base64ToImage = () => {
    const base64String = user.image;
    const trimmedBase64 = base64String ? base64String.trim() : "";
    if (trimmedBase64) {
      setImageSrc(`data:image/jpeg;base64,${trimmedBase64}`);
    }
  };
  useEffect(() => {
    base64ToImage();
  }, []);
  const el = useRef(null);

  useEffect(() => {
    const formattedNetworthValue = addCommasToNumber(formattedTotalNetWorth);

    const typed = new Typed(el.current, {
      strings: [formattedNetworthValue],
      typeSpeed: 100,
      loop: true,
      backSpeed: 70,
      startDelay: 100,
      backDelay: 1500,
      showCursor: false,
      // cursorChar: '/-',
    });

    return () => {
      typed.destroy();
    };
  }, [formattedTotalNetWorth]);

  function addCommasToNumber(number) {
    let numberStr = number.toString();
    numberStr = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return numberStr;
  }
  let formattedNetworthValue = addCommasToNumber(formattedTotalNetWorth);

  const [isPopupNetworthOpen, setIsNetworthPopupOpen] = useState(false);

  const toggleNetworthPopup = () => {
    setIsNetworthPopupOpen(!isPopupNetworthOpen);
  };

  return (
    <div>
      <Navbar className="navbar " expand="lg">
        <Navbar.Brand className="navbar-logo">
          <NavLink tag={ReactLink} to="/user/dashboard">
            <img
              className="navbar_logo_image"
              src="/logo192.png"
              alt="logoPng"
            />
          </NavLink>
        </Navbar.Brand>
        <NavLink className="networth1" onClick={toggleNetworthPopup}>
          {" "}
          Approx Net Worth : $ {formattedNetworthValue}
        </NavLink>
        {isPopupNetworthOpen && (
          <Networthpopup
            onClose={toggleNetworthPopup}
            networthValue={formattedNetworthValue}
            totalCrypto={netEstimatedValue}
          />
        )}

        <Navbar.Toggle
          className="navbar-toggler"
          aria-controls="basic-navbar-nav"
          style={{ marginRight: "20px" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link
              className="navname"
              smooth="true"
              duration={50}
              tag={ReactLink}
              to="/user/dashboard"
            >
              Dashboard
            </Link>

            <Link
              className="navname"
              smooth="true"
              duration={50}
              tag={ReactLink}
              to="/user/why-I-Chest"
            >
              Why I-Chest
            </Link>

            <Link
              className="navname"
              smooth="true"
              duration={50}
              tag={ReactLink}
              to="#"
              onClick={() => alert("comming soon")}
            >
              Explore
            </Link>
            <Link
              className="navname"
              smooth="true"
              duration={50}
              tag={ReactLink}
              to="#"
              onClick={() => alert("comming soon")}
            >
              Trustee
            </Link>

            <Link
              className="navname"
              smooth="true"
              duration={50}
              tag={ReactLink}
              to="#"
              onClick={() => alert("comming soon")}
            >
              Beneficiaries
            </Link>
          </Nav>
          <Nav navbar>
            <NavItem>
              <NavLink
                className="networth"
                onClick={toggleNetworthPopup}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="networth" style={{ width: "270px" }}>
                  {" "}
                  Approx Net Worth : $ <span ref={el}></span>
                </div>
              </NavLink>
              {isPopupNetworthOpen && (
                <Networthpopup
                  onClose={toggleNetworthPopup}
                  networthValue={formattedNetworthValue}
                  totalCrypto={netEstimatedValue}
                />
              )}
            </NavItem>
            <NavItem>
              <NavLink onClick={togglePopup} className="nav-user-name">
                <img
                  src={imageSrc || "./../../.././img/avtar.jpg"}
                  alt="avtar_image"
                />
                <div className="navbar_username">
                  {user.firstName + " "}
                  {user.lastName}
                </div>

                <FontAwesomeIcon
                  style={{ marginLeft: "10px" }}
                  icon={faCaretDown}
                />
              </NavLink>
            </NavItem>
            {isPopupOpen && (
              <div ref={popupRef} className="popup1">
                <ul>
                  <Link to="/user/profile">Profile</Link>
                  <Link to="/user/dashboard">Dashboard</Link>
                  <a onClick={logout}>Logout</a>
                </ul>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
export default UserNavbar;
