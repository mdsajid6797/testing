import "@fortawesome/fontawesome-svg-core/styles.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailIcon from "@mui/icons-material/Mail";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Typography } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useRef, useState } from "react";
import Base from "../components/Base";
import "../css/responsive.css";
import "../css/style.css";
import Login from "./Login";
import Signup from "./Signup";
import WelcomeIchest from "./my-estate/welcomeIchest";
import { currentUser } from "../services/user-service";
import { useNavigate } from "react-router-dom";
import SignUpPopup from "../components/popup/SignUpPopup";
import "./../components/user/whyichest.css";
import AttorneySignUp from "./AttorneySignUp";
import JointAccount from "./JointAccount";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  const handleMapClick = () => {
    window.open("https://goo.gl/maps/pat68TvnEsM7nCsQ9", "_blank");
  };
  const [showLogin, setShowLogin] = React.useState(false);
  const [showSignin, setShowSignin] = React.useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  // for attorney form
  const [attorneySignUpPopup, setAttorneySignUpPopup] = useState(false);
  const handleAttorneySignUpPopup = () => {
    togglePopup();
    setAttorneySignUpPopup(!attorneySignUpPopup);
  };

  // for joint account form
  const [jointAccountSignUpPopup, setJointAccountSignUpPopup] = useState(false);
  const handleJointAccountSignUpPopup = () => {
    togglePopup();
    setJointAccountSignUpPopup(!jointAccountSignUpPopup);
  };

  const handleBack = () => {
    setShowLogin(false);
    setShowSignin(false);
    setAttorneySignUpPopup(false);
    setJointAccountSignUpPopup(false);
  };
  const toggleSignin = () => {
    togglePopup();
    setShowSignin(!showSignin);
  };

  // popup component
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // const navigate = useNavigate();
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     currentUser("Bearer " + token)
  //       .then((user) => {
  //         if (user.role === "USER") {
  //           navigate("/user/dashboard");
  //         } else if (
  //           user.role === "TRUSTEE" &&
  //           user.firstlevelapproval === "true"
  //         ) {

  //           navigate("/trustee/dashboard");
  //         } else {
 
  //           navigate("/beneficiary/dashboard");
  //         }
  //       })
  //       .catch((error) => {
 
  //       });
  //   }
  // }, []);

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

  return (
    <>
      {showPopup && <WelcomeIchest closePopup={closePopup} />}

      {!showPopup && (
        <Base>
          {showLogin && (
            <div
              className="login-popup"
              data-aos="fade-up"
              data-aos-offset="200"
              data-aos-delay="50"
              data-aos-duration="1000"
            >
              <div className="login-content">
                {showLogin && <Login onBack={handleBack} />}
              </div>
            </div>
          )}

          {/* user registeration form  */}
          {showSignin && (
            <div
              className="login-popup"
              data-aos="fade-up"
              data-aos-offset="200"
              data-aos-delay="50"
              data-aos-duration="1000"
            >
              <div className="login-content">
                {showSignin && <Signup onBack={handleBack} />}
              </div>
            </div>
          )}

          {/* joint account registeration form  */}
          {/* {jointAccountSignUpPopup && (
            <div
              className="login-popup"
              data-aos="fade-up"
              data-aos-offset="200"
              data-aos-delay="50"
              data-aos-duration="1000"
            >
              <div className="login-content">
                {jointAccountSignUpPopup && (
                  <JointAccount onBack={handleBack} />
                )}
              </div>
            </div>
          )} */}

          {/* attorney registeration form  */}
          {/* {attorneySignUpPopup && (
            <div
              className="login-popup"
              data-aos="fade-up"
              data-aos-offset="200"
              data-aos-delay="50"
              data-aos-duration="1000"
            >
              <div className="attorney-content">
                {attorneySignUpPopup && <AttorneySignUp onBack={handleBack} />}
              </div>
            </div>
          )} */}

          <div
            className="header_section background"
            id="Home"
            // style={{ backgroundImage: "url(/img/background1.png)" }}
          >
            <div className="xyz">
              <div className="header_left">
                <div className="banner_main">
                  {/* <h1 className="banner_taital">
                    TREASURE CHEST <br />
                    OF LIFE
                  </h1> */}
                  <h1 className="banner_taital">
                    Life is about legacy,<br />
                    <span style={{fontSize: '0.7em'}}>I-chest.com helps to preserve it</span>
                  </h1>
                  <p className="banner_text">
                    I-Chest is an online platform that provides users with a
                    secure and convenient way to store and manage their valuable
                    documents
                  </p>
                  <div className="btn_main">
                    <div className="more_bt">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <button onClick={toggleSignin}>Sign Up</button>
                        {/* <div style={{ marginTop: "2px" }}>
                          {isPopupOpen && (
                            <div ref={popupRef} className="allSignUp">
                              <ul>
                                <a onClick={toggleSignin}>User Sign Up</a>
                                <a onClick={handleJointAccountSignUpPopup}>
                                  Joint User Sign Up
                                </a>
                                <a onClick={handleAttorneySignUpPopup}>
                                  Attorney Sign Up
                                </a>
                              </ul>
                            </div>
                          )}
                        </div> */}
                      </div>
                    </div>
                    <div className="contact_bt">
                      {/* <a href="/login">Login</a> */}
                      <button onClick={toggleLogin}>Login</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="header_right">
                <img src="img/homepage_image.png" className="banner_img" />
              </div>
            </div>
          </div>

          <div className="services_section layout_padding" id="Service">
            <div className="container">
              <div className="row">
                <div className="col-md-8">
                  <h1 className="services_taital">WELCOME TO I-CHEST</h1>
                  <p className="services_text">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters, as opposed to
                    using 'Content here, content here', making it{" "}
                  </p>
                  <div className="moremore_bt">
                    <div>
                      <button className="read_more_btn" onClick={openPopup}>
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div>
                    <img src="img/img-1.png" className="image_1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="what_we_do_section layout_padding" id="About">
            <div className="container">
              <h1 className="what_taital">WHAT WE DO</h1>
              <p className="what_text">
                It is a long established fact that a reader will be distracted
                by the readable content of a{" "}
              </p>
              <div className="what_we_do_section_2">
                <div className="row">
                  <div className="col-lg-3 col-sm-6">
                    <div className="box_main">
                      <div className="icon_1">
                        <img src="img/icon-1.png" />
                      </div>
                      <h3 className="accounting_text">Accounting</h3>
                      <p className="lorem_text">
                        Lorem Ipsum is simply dummy text of the printing and
                      </p>
                      <div className="moremore_bt_1">
                        <a href="#">Read More </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="box_main active">
                      <div className="icon_1">
                        <img src="img/icon-2.png" />
                      </div>
                      <h3 className="accounting_text">Advisor</h3>
                      <p className="lorem_text">
                        Lorem Ipsum is simply dummy text of the printing and
                      </p>
                      <div className="moremore_bt_1">
                        <a href="#">Read More </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="box_main">
                      <div className="icon_1">
                        <img src="img/icon-3.png" />
                      </div>
                      <h3 className="accounting_text">Investment</h3>
                      <p className="lorem_text">
                        Lorem Ipsum is simply dummy text of the printing and
                      </p>
                      <div className="moremore_bt_1">
                        <a href="#">Read More </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="box_main">
                      <div className="icon_1">
                        <img src="img/icon-4.png" />
                      </div>
                      <h3 className="accounting_text">Financial</h3>
                      <p className="lorem_text">
                        Lorem Ipsum is simply dummy text of the printing and
                      </p>
                      <div className="moremore_bt_1">
                        <a href="#">Read More </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* background video 
      <div className="asmr_video">
        <video autoPlay loop muted className="background-video">
          <source src="/img/background_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div> */}
          <div className="project_section layout_padding" id="projects">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="project_main">
                    <h1 className="services_taital">In Our Website</h1>
                    <p className="services_text">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a{" "}
                    </p>
                    <div className="moremore_bt">
                      <a href="#">Read More </a>
                    </div>
                    <div className="image_6">
                      <img src="img/img-6.png" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="images_main">
                    <div className="images_left">
                      <div className="container_1">
                        <img
                          src="img/img-2.jpg"
                          alt="Avatar"
                          className="image"
                          style={{ width: "100%" }}
                        />
                        <div className="middle">
                          {/* <div className="text">
                        <img src="img/search-icon.png" />
                      </div> */}
                          <h2 className="fact_text">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.{" "}
                          </h2>
                        </div>
                      </div>
                      <div className="container_1">
                        <img
                          src="img/img-3.jpg"
                          alt="Avatar"
                          className="image"
                          style={{ width: "100%" }}
                        />
                        <div className="middle">
                          {/* <div className="text">
                        <img src="img/search-icon.png" />
                      </div> */}
                          <h2 className="fact_text">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="images_right">
                      <div className="container_1">
                        <img
                          src="img/img-4.jpg"
                          alt="Avatar"
                          className="image"
                          style={{ width: "100%" }}
                        />
                        <div className="middle">
                          {/* <div className="text">
                        <img src="img/search-icon.png" />
                      </div> */}
                          <h2 className="fact_text">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                          </h2>
                        </div>
                      </div>
                      <div className="container_1">
                        <img
                          src="img/img-5.jpg"
                          alt="Avatar"
                          className="image"
                          style={{ width: "100%" }}
                        />
                        <div className="middle">
                          {/* <div className="text">
                        <img src="img/search-icon.png" />
                      </div> */}
                          <h2 className="fact_text">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="project_section_2 layout_padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="icon_1">
                <img src="img/icon-2.png" />
              </div>
              <h3 className="accounting_text_1">10000+</h3>
              <p className="yers_text">Satisfied Clients</p>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="icon_1">
                <img src="img/icon-3.png" />
              </div>
              <h3 className="accounting_text_1">100+</h3>
              <p className="yers_text">Country Serving</p>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="icon_1">
                <img src="img/icon-4.png" />
              </div>
              <h3 className="accounting_text_1">15+</h3>
              <p className="yers_text">Years Of Expriance </p>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="icon_1">
                <img src="img/icon-1.png" />
              </div>
              <h3 className="accounting_text_1">1500+</h3>
              <p className="yers_text">Services</p>
            </div>
          </div>
        </div>
      </div> */}

          <div className="team_section layout_padding" id="Team">
            <div className="container">
              <h1 className="what_taital">Our Team and experts</h1>
              <p className="what_text_1">
                It is a long established fact that a reader will be distracted
                by the readable content of a{" "}
              </p>
              <div className="team_section_2 layout_padding">
                <div className="row">
                  <div className="col-sm-3">
                    <img src="img/ranjay.jpeg" className="image_7" />
                    <p className="readable_text">Ranjay Singh</p>
                    <p className="readable_text_1">Founder</p>
                    <div className="social_icon">
                      <ul>
                        <li>
                          <a href="#">
                            <img src="img/fb-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/twitter-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/linkedin-icon.png" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <img src="img/avtar.jpg" className="image_7" />
                    <p className="readable_text">Content</p>
                    <p className="readable_text_1">Follow Us</p>
                    <div className="social_icon">
                      <ul>
                        <li>
                          <a href="#">
                            <img src="img/fb-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/twitter-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/linkedin-icon.png" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <img src="img/avtar.jpg" className="image_7" />
                    <p className="readable_text">Content</p>
                    <p className="readable_text_1">Follow Us</p>
                    <div className="social_icon">
                      <ul>
                        <li>
                          <a href="#">
                            <img src="img/fb-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/twitter-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/linkedin-icon.png" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <img src="img/avtar.jpg" className="image_7" />
                    <p className="readable_text">Content</p>
                    <p className="readable_text_1">Follow Us</p>
                    <div className="social_icon">
                      <ul>
                        <li>
                          <a href="#">
                            <img src="img/fb-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/twitter-icon.png" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="img/linkedin-icon.png" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="client_section layout_padding">
        <div className="container">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="0"
                className="active"
              ></li>
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="1"
              ></li>
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="2"
              ></li>
            </ol>
             <div className="carousel-inner">
              <div className="carousel-item active">
                <h1 className="what_taital">what is syas our clients</h1>
                <div className="client_section_2 layout_padding">
                  <ul>
                    <li>
                      <img src="img/round-1.png" className="round_1" />
                    </li>
                    <li>
                      <img src="img/img-11.png" className="image_11" />
                    </li>
                    <li>
                      <img src="img/round-2.png" className="round_2" />
                    </li>
                  </ul>
                  <p className="dummy_text">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <h1 className="what_taital">what is syas our clients</h1>
                <div className="client_section_2 layout_padding">
                  <ul>
                    <li>
                      <img src="img/round-1.png" className="round_1" />
                    </li>
                    <li>
                      <img src="img/img-11.png" className="image_11" />
                    </li>
                    <li>
                      <img src="img/round-2.png" className="round_2" />
                    </li>
                  </ul>
                  <p className="dummy_text">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <h1 className="what_taital">what is syas our clients</h1>
                <div className="client_section_2 layout_padding">
                  <ul>
                    <li>
                      <img src="img/round-1.png" className="round_1" />
                    </li>
                    <li>
                      <img src="img/img-11.png" className="image_11" />
                    </li>
                    <li>
                      <img src="img/round-2.png" className="round_2" />
                    </li>
                  </ul>
                  <p className="dummy_text">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem
                  </p>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div> */}

          <div className="footer_section layout_padding" id="Contact Us">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-sm-6">
                  <h4 className="about_text">Contact Us</h4>

                  <div className="location_text" onClick={handleMapClick}>
                    <LocationOnIcon fontSize="large" />
                    <span className="padding_left_15">Locations</span>
                  </div>
                  <div className="location_text">
                    <PhoneAndroidIcon fontSize="large" />
                    <span className="padding_left_15">+1(224)698-9767</span>
                  </div>
                  <div className="location_text">
                    <a
                      className="mail-btn"
                      href="https://outlook.live.com/mail/0/"
                      target="blank"
                    >
                      <MailIcon fontSize="large" />
                      <span className="padding_left_15">openapi@i-chest.com</span>
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <h4 className="about_text">Address</h4>
                  <p className="dolor_text">
                    3rd floor, survey No. 123/1 ITPL Main Road, AECS Layout
                    Brookefield, Bangalore Karnataka - 560037
                  </p>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <h4 className="about_text">Social Media</h4>
                  <div className="footer_images">
                    <div className="footer_images_left">
                      <div className="image_12">
                        <a href="https://www.linkedin.com/" target="blank">
                          <LinkedInIcon fontSize="large" className="icon" />
                        </a>
                      </div>
                      <div className="image_12">
                        <a href="https://www.youtube.com/" target="blank">
                          <YouTubeIcon fontSize="large" className="icon" />
                        </a>
                      </div>
                    </div>
                    <div className="footer_images_right">
                      <div className="image_12">
                        <a href="https://twitter.com/" target="blank">
                          <TwitterIcon fontSize="large" className="icon" />
                        </a>
                      </div>
                      <div className="image_12">
                        <a href="https://www.facebook.com/" target="blank">
                          <FacebookIcon fontSize="large" className="icon" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <h4 className="about_text">Newsletter</h4>
                  <input
                    type="text"
                    className="mail_text"
                    placeholder="Enter your email"
                    name="Enter your email"
                  />
                  <div className="subscribe_bt">
                    <a href="#">Subscribe</a>
                  </div>

                  {/* <div className="footer_social_icon">
                <ul>
                  <li>
                    <a href="#">
                      <img src="img/fb-icon1.png" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="img/twitter-icon1.png" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="img/linkedin-icon1.png" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="img/youtub-icon1.png" />
                    </a>
                  </li>
                </ul>
              </div> */}
                </div>
              </div>

              <div className="copyright_section">
                <div>
                  <Typography
                    variant="body1"
                    component="span"
                    className="copyright_text"
                  >
                    Copyright &copy; 2023 All Right Reserved By{" "}
                    <a href="http://i-chest.com:1111/">I-Chest</a>
                  </Typography>
                </div>
                <div className="copyright_text"></div>
              </div>
            </div>
          </div>
        </Base>
      )}
    </>
  );
};

export default Home;
