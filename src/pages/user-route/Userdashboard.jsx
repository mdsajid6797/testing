import React, { useEffect, useState } from "react";
import SideBar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import UserBase from "../../components/user/UserBase";
import BeneficiarySignup from "../BeneficiarySignup";
import "./UserDashboard.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Notification } from "../../components/alerting-visitors/notification";
import GenerateWill from "../my-estate/GenerateWill";
import { getRealEstates } from "../../services/RealEstate-service";
import { getCombinedData, getToken, getUser, getUser1 } from "../../services/user-service";
import { getBank } from "../../services/bank-service";
import { getJewelries } from "../../services/JewelryService";
import { getVehicle } from "../../services/VehicleService";
import { getInvestments } from "../../services/investment-service";
import { getCryptoAssests } from "../../services/CryptoService";
import JointAccount from "../JointAccount";

export default function Userdashboard() {
  const navigate = useNavigate();
  let userId = getUser().commonId;
  let userAccountType = getUser().accountType;

  // get combined data in single list 
  const [combinedData, setCombinedData] = useState(null);
  const getCombinedDataFromServer = () => {
    getCombinedData(userId)
      .then((res) => {
        setCombinedData(res);
      })
      .catch((err) => {});
  };

  const handleClick = (url) => {
    // Handle the click event here
    navigate("/user/my-estate/" + url);
  };

  const [addBeneficiary, setAddBeneficiary] = useState(false);

  const toggleBeneficiary = () => {
    setAddBeneficiary(!addBeneficiary);
  };

  // for joint account popup
  const [addJointPopup, setAddJointPopup] = useState(false);
  const toggleJointAccount = () => {
    setAddJointPopup(!addJointPopup);
  };

  const handleBack = () => {
    setAddBeneficiary(false);
    setAddJointPopup(false);
  };
  AOS.init();
  // page opening  animation
  const [show, setShow] = useState(false);
  

  // let [width , setwidth] = useState('100%');

  const changeWidth = () => {
    const resizable = document.getElementById("resizable");
    const otherElement = document.getElementById("otherElement");
    let isResizing = false;

    resizable.addEventListener("mousedown", (e) => {
      isResizing = true;
      const initialX = e.clientX;
      const initialWidth = parseInt(
        window.getComputedStyle(resizable).width,
        10
      );

      resizable.addEventListener("mousemove", (e) => {
        if (!isResizing) return;
        const width = initialWidth + (e.clientX - initialX);
        resizable.style.width = width + "px";
        otherElement.style.flex = `1 0 ${width}px`;
      });

      resizable.addEventListener("mouseup", () => {
        isResizing = false;
      });
    });
  };

  const generateWill = () => {
    alert("will");
  };

  // popup component
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    setShow(true);
    getCombinedDataFromServer();
  }, []);

  return (
    <>
      {showPopup && (
        <GenerateWill
          combinedData={combinedData}
          closePopup={closePopup}
        />
      )}

      {!showPopup && (
        <div className={`your-component ${show ? "fade-in-element" : ""}`}>
          <UserBase>
            <div className="mt-5 otherElement">
              <SideBar>
                <div
                  className="btn-name"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={toggleBeneficiary}
                    className="dashboard_top_button"
                  >
                    Add Beneficiary
                  </a>
                  <a href="add-trustee" className="dashboard_top_button">
                    Add Trustee
                  </a>
                  <a href="shareproperty" className="dashboard_top_button">
                    Draft
                  </a>
                  {userAccountType !== "secondary" && (
                    <a
                      style={{ cursor: "pointer" }}
                      className="dashboard_top_button"
                      onClick={openPopup}
                    >
                      Inventory Report
                    </a>
                  )}

                  {!(
                    userAccountType === "secondary" ||
                    userAccountType === "primary"
                  ) && (
                    <a
                      style={{ cursor: "pointer" }}
                      className="dashboard_top_button"
                      onClick={toggleJointAccount}
                    >
                      Add Secondary Acc
                    </a>
                  )}
                </div>
                {addBeneficiary && (
                  <div
                    className="beneficiary-popup"
                    data-aos="fade-up"
                    data-aos-offset="200"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                  >
                    <div className="beneficiary-content">
                      {addBeneficiary && (
                        <BeneficiarySignup handleBack={handleBack} />
                      )}
                    </div>
                  </div>
                )}

                {addJointPopup && (
                  <div
                    className="beneficiary-popup"
                    data-aos="fade-up"
                    data-aos-offset="200"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                  >
                    <div className="beneficiary-content">
                      {addJointPopup && (
                        <JointAccount userId={userId} onBack={handleBack} />
                      )}
                    </div>
                  </div>
                )}

                <div style={{ textAlign: "center" }} className="main">
                  <div className="row gy-5">
                    <div className="col-2">
                      <div className="p-3 ">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("real-estate")}
                        >
                          <img
                            src="./../img/realestate.png"
                            style={{ height: "120px", objectFit: "cover" }}
                            className="card-img-top"
                            alt="RealEstateimage"
                          />
                          <div className="card-body ">
                            <div className="custom-text">Real Estate</div>

                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Real Estate
                            </h5>
                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our RealEstate Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3 ">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("banks")}
                        >
                          <img
                            src="./../img/bank.png"
                            style={{ height: "120px", objectFit: "contain" }}
                            className="card-img-top"
                            alt="Banks"
                          />

                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Banks
                            </h5>
                            <div className="custom-text">Banks</div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our Banks Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="p-3 ">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("investments")}
                        >
                          <img
                            src="./../img/investment.png"
                            style={{ height: "120px", objectFit: "contain" }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Investment
                            </h5>
                            <div className="custom-text">Investment</div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our Investment Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3 ">
                        <div
                          className="cardtabs"
                          style={{ objectFit: "cover" }}
                          onClick={() => handleClick("crypto")}
                        >
                          <img
                            src="./../img/crypto.png"
                            style={{ height: "120px", objectFit: "contain" }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Bit Coin Assets
                            </h5>
                            <div className="custom-text">Bit Coin Assets</div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our Crypto Assest Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3 ">
                        <div
                          className="cardtabs julimgcenter"
                          style={{ objectFit: "fill" }}
                          onClick={() => handleClick("jewelry")}
                        >
                          <img
                            src="./../img/jewelry.png"
                            style={{
                              height: "120px",
                              objectFit: "contain",
                              margin: "0px 30px 0px 30px",
                            }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Jewelry
                            </h5>
                            <div className="custom-text">Jewelry</div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our Jewelry Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3 ">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("insurances")}
                        >
                          <img
                            src="./../img/insurance.png"
                            style={{ height: "120px", objectFit: "contain" }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Insurances
                            </h5>
                            <div className="custom-text">Insurances</div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our Insurance Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("vehicles")}
                        >
                          <img
                            src="./../img/vehicle1.png"
                            style={{ height: "120px", objectFit: "contain" }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Vehicle
                            </h5>
                            <div className="custom-text">Vehicle</div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our Vehicle Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("income")}
                        >
                          <img
                            src="./../img/income.png"
                            style={{ height: "120px", objectFit: "contain" }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Passive Income
                            </h5>
                            <div className="custom-text">Passive Income</div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here we can add our Income Information
                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("other-assests")}
                        >
                          <img
                            src="./../img/other_assets.png"
                            style={{ height: "120px", objectFit: "contain" }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              Miscellaneous Assets
                            </h5>
                            <div className="custom-text">
                              Miscellaneous Assets
                            </div>

                            {/* <p className="card-text" style={{ color: "black" }}>
                      Here you can add your other assets Information

                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="p-3">
                        <div
                          className="cardtabs"
                          onClick={() => handleClick("International_assets")}
                        >
                          <img
                            src="./../img/international_assests.svg"
                            style={{ height: "120px", objectFit: "cover" }}
                            className="card-img-top"
                            alt=""
                          />
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ color: "black" }}
                            >
                              International&nbsp; &nbsp;Assets
                            </h5>
                            <div className="custom-text">
                              International Assests
                            </div>

                            {/* <p className="card-text" style={{ color: "black", marginTop: "0px" }}>
                      Here you can add International Assets

                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SideBar>
            </div>

            {/* <Footer/> */}
          </UserBase>
        </div>
      )}
    </>
  );
}
