import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import './../../../public/img/'
// country npm package
import {
  faDownload,
  faGlobe,
  faLocationDot,
  faTimesCircle,
  faXmark,
  faHouse,
  faTriangleExclamation,
  faBuildingColumns,
  faHandHoldingDollar,
  faMoneyCheckDollar,
  faCarSide,
  faGem,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Country } from "country-state-city";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
} from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import "../../css/formPOPup.css";
import "../../css/myestare.css";
import "../user-route/UserDashboard.css";
import {
  addInternationalAssest,
  deleteSingleProperty,
  downloadDocument1,
  getBeneficiary,
  getInternationalAssest,
  getToken,
  getUser,
  removeInternationalAssest,
} from "../../services/user-service";
import Deletebutton from "../my-estate/Deletebutton";
import UpdateButton from "../my-estate/UpdateButton";
import {
  deleteInternationalAsset,
  getInternationalAsset,
} from "../../services/InternationalAssetService";

export function InternationalAsset1() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  let [form1, setForm1] = useState(false);
  const toggle = () => {
    setForm1(!form1);
  };
  const InternationalAssestForm = (event) => {
    event.preventDefault();
  };

  const handleClick = (url) => {
    // Handle the click event here

    navigate("/user/my-estate/International_assets/" + url);
  };

  let [showAdditionField1, setshowAdditionField1] = useState(false);
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [show1, setShow1] = useState(false);

  let [showDetailOtherAsset, setShowDetailOtherAsset] = useState([]); // this is to display the card details
  let [showDetailRealEstate, setShowDetailRealEstate] = useState([]); // this is to display the card details
  let [showDetailBank, setShowDetailBank] = useState([]); // this is to display the card details
  let [showDetailInvestment, setShowDetailInvestment] = useState([]); // this is to display the card details
  let [showDetailIncome, setShowDetailIncome] = useState([]);
  let [showDetailVehicle, setShowDetailVehicle] = useState([]); // this is to display the card details
  let [showDetailJewelry, setShowDetailJewelry] = useState([]); // this is to display the card details
  let [showDetailCrypto, setShowDetailCrypto] = useState([]); // this is to display the card details
  let [showDetailInsurance, setShowDetailInsurance] = useState([]); // this is to display the card details

  let [showRealEstate, setShowRealEstate] = useState(false);
  let [showBank, setShowBank] = useState(false);
  let [showInvestment, setShowInvestment] = useState(false);
  let [showIncome, setShowIncome] = useState(false);
  let [showVehicle, setShowVehicle] = useState(false);
  let [showJewelry, setShowJewelry] = useState(false);
  let [showCrypto, setShowCrypto] = useState(false);
  let [showInsurance, setShowInsurance] = useState(false);

  let assetName = "";
  // showing the details of cards like popup
  const Showdetails = (obj) => {
    assetName = obj.internationalAssetData.assetType;
    switch (assetName) {
      case "otherAsset":
        setShowDetailOtherAsset(obj);
        setShow1(true);
        break;
      case "realEstate":
        setShowDetailRealEstate(obj);
        setShowRealEstate(true);
        break;
      case "bank":
        setShowDetailBank(obj);
        setShowBank(true);
        break;
      case "investment":
        setShowDetailInvestment(obj);
        setShowInvestment(true);
        break;
      case "income":
        setShowDetailIncome(obj);
        setShowIncome(true);
        break;
      case "vehicle":
        setShowDetailVehicle(obj);
        setShowVehicle(true);
        break;
      case "jewelry":
        setShowDetailJewelry(obj);
        setShowJewelry(true);
        break;
      case "crypto":
        setShowDetailCrypto(obj);
        setShowCrypto(true);
        break;
      case "insurance":
        setShowDetailInsurance(obj);
        setShowInsurance(true);
        break;
      default:
    }
  };

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    getInternationalAsset(token, userId)
      .then((res) => {
        setCard(res);
      })
      .catch((error) => {
        setCard([]);
      });
  };

  const handleRemove = (id, idType, assetValue) => {
    if (idType == "sharedDetailId") {
      deleteSingleProperty(id)
        .then((res) => {
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          AddCard();
          switch (assetTypeValue) {
            case "otherAsset":
              setBeneficiaryVisible(false);
              setShow1(false);
              break;
            case "realEstate":
              setBeneficiaryVisible(false);
              setShowRealEstate(false);
              break;
            case "bank":
              setBeneficiaryVisible(false);
              setShowBank(false);
              break;
            case "investment":
              setBeneficiaryVisible(false);
              setShowInvestment(false);
              break;
            case "income":
              setShowIncome(false);
              setBeneficiaryVisible(false);
              break;
            case "vehicle":
              setBeneficiaryVisible(false);
              setShowVehicle(false);
              break;
            case "jewelry":
              setBeneficiaryVisible(false);
              setShowJewelry(false);
              break;
            case "crypto":
              setBeneficiaryVisible(false);
              setShowCrypto(false);
              break;
            case "insurance":
              setBeneficiaryVisible(false);
              setShowInsurance(false);
              break;
            default:
          }
        })
        .catch((error) => {});
    } else {
      deleteInternationalAsset(id)
        .then((res) => {
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          AddCard();
          switch (assetValue) {
            case "otherAsset":
              setShow1(!show1);
              break;
            case "realEstate":
              setShowRealEstate(!showRealEstate);
              break;
            case "bank":
              setShowBank(!showBank);
              break;
            case "investment":
              setShowInvestment(!showInvestment);
              break;
            case "income":
              setShowIncome(!showIncome);
              break;
            case "vehicle":
              setShowVehicle(!showVehicle);
              break;
            case "jewelry":
              setShowJewelry(!showJewelry);
              break;
            case "crypto":
              setShowCrypto(!showCrypto);
              break;
            case "insurance":
              setShowInsurance(!showInsurance);
              break;
            default:
          }
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    AddCard();
  }, []);

  const getBenificiarydata = () => {
    let userId = getUser().id;

    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getBenificiarydata();
  }, []);

  // beneficiary addition in form
  const [beneficiary, setBenificiary] = useState([]);

  const getBenificiaryName = (id) => {
    var foundBenificiary = null;
    if (id.beneficiary === undefined) {
      foundBenificiary = beneficiary.find((b) => b.id === parseInt(id));
    } else {
      foundBenificiary = beneficiary.find(
        (b) => b.id === parseInt(id.beneficiary)
      );
    }

    if (foundBenificiary) {
      return `${foundBenificiary.firstName} ${foundBenificiary.lastName}`;
    } else {
      return "Benificiary not found"; // Or handle the case where beneficiary with the given ID isn't found
    }
  };

  // show notes popup
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const handleOpenPopup = (note, value) => {
    setSelectedNote(note);
    setPopupVisible(true);
    setAssetTypeValue(value);
  };

  // show beneficiary popup
  const [beneficiaryVisible, setBeneficiaryVisible] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  let [assetTypeValue, setAssetTypeValue] = useState("");
  const handleOpenBeneficiary = (showDetail, value) => {
    setSelectedBeneficiary(showDetail);
    setAssetTypeValue(value);
    setBeneficiaryVisible(true);
  };

  // for assests show
  let [showAssets, SetshowAssets] = useState(false);

  // for multiple download
  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");

  const handleShowDownlaod = (showDetail, value) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
    setAssetTypeValue(value);
  };

  const handleDownload = (id, fileName) => {
    let myarry = fileName.split(".");
    let token = "Bearer " + getToken();
    downloadDocument1(id)
      .then((response) => {
        const downloadUrl = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${myarry[0]}.${myarry[1]}`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {});
  };
  let [showAdditionField, SetshowAdditionField] = useState(false);

  const bankLogo = [
    { "JPMorgan Chase & Co": "/logos/J.P._Morgan_Chase_logo_PNG3.png" },
    { "Bank of America": "/logos/Bank_of_America_logo_PNG4.png" },
    { "Wells Fargo & Co": "/logos/Wells_fargo_logo_PNG2.png" },
    { "Citigroup Inc": "/logos/Citigroup_logo_PNG1.png" },
    { "U.S. Bancorp": "/logos/US-Bank-Logo-PNG3.png" },
    { "PNC bank": "/logos/PNC_Bank_logo_PNG1.png" },
    { "TD Bank": "/logos/TD_Bank_logo_PNG1.png" },
    { "Capital One": "/logos/Capital_One_logo_PNG1.png" },
    { "Fifth Third Bank": "/logos/Harris-Teeter-Logo-PNG_003-1.png" },
    { "Ally Financial Inc": "/logos/Ally_Financial_logo_PNG4.png" },
    { "Huntington Bancshares Incorporated": "/logos/huntington.webp" },
    { KeyCorp: "/logos/KeyBank_logo_PNG7.png" },
  ];

  const getDisplayName = (metadataValue) => {
    switch (metadataValue) {
      case "XAU":
        return "Gold";
      case "XAG":
        return "Silver";
      case "XPT":
        return "Platinum";
      case "XPD":
        return "Palladium";
      default:
        return metadataValue;
    }
  };

  const getDisplayKeratValue = (keratValue) => {
    switch (keratValue) {
      case "price_gram_24k":
        return "24k";
      case "price_gram_22k":
        return "22k";
      case "price_gram_21k":
        return "21k";
      case "price_gram_20k":
        return "20k";
      case "price_gram_18k":
        return "18";
      case "price_gram_16k":
        return "16";
      case "price_gram_14k":
        return "14k";
      case "price_gram_10k":
        return "10k";
      default:
        return keratValue;
    }
  };

  return (
    <div className={`your-component ${show ? "fade-in-element" : ""}`}>
      <UserBase>
        <div className="mt-5"></div>
        <SideBar>
          <div className="addme">
            <div className="addme_inner">
              <button onClick={() => toggle()} style={{ width: "auto" }}>
                Add New International Assets
              </button>
            </div>
          </div>

          <div className="propCard">
            <div className="propCard-card">
              {card.map((entity) => (
                <div
                  className="propCard-card-body"
                  key={entity.internationalAssetData.id}
                >
                  <h5 className="propCard-card-title">
                    {entity.internationalAssetData.assetType}
                  </h5>
                  <p className="propCard-card-text">
                    {" "}
                    {entity.internationalAssetData.countryName}
                  </p>
                  <div className="propCard-btn">
                    <p className=" viewDetails">
                      <button onClick={() => Showdetails(entity)}>
                        View Details
                      </button>
                    </p>
                  </div>
                  {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                </div>
              ))}
            </div>
          </div>
          {form1 && (
            <div className="overlay1" style={{ transition: "500ms" }}>
              {/* //   <div className="property_form"> */}
              <Container
                style={{
                  height: "auto",
                  boxSizing: "border-box",
                }}
              >
                <Card color="" outline>
                  <CardBody>
                    <div className="Close" onClick={toggle}>
                      <FontAwesomeIcon icon={faXmark} />
                    </div>
                    <div>
                      <div style={{ textAlign: "center" }} className="main">
                        <div className="row gy-6">
                          <div className="col-2">
                            <div className="p-3 ">
                              <div
                                className="cardtabs"
                                style={{ height: "170px", width: "10em" }}
                                onClick={() => handleClick("real-estate")}
                              >
                                <img
                                  src="/img/realestate.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "cover",
                                  }}
                                  className="card-img-top"
                                  alt="RealEstateimage"
                                />
                                <div className="card-body ">
                                  <div className="custom-text">Real Estate</div>

                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Real Estate
                                  </h5> */}
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
                                style={{ height: "170px", width: "10em" }}
                                onClick={() => handleClick("banks")}
                              >
                                <img
                                  src="/img/bank.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                  className="card-img-top"
                                  alt="Banks"
                                />

                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Banks
                                  </h5> */}
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
                                style={{ height: "170px", width: "10em" }}
                                onClick={() => handleClick("investments")}
                              >
                                <img
                                  src="/img/investment.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                  className="card-img-top"
                                  alt=""
                                />
                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Investment
                                  </h5> */}
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
                                style={{
                                  objectFit: "cover",
                                  height: "170px",
                                  width: "10em",
                                }}
                                onClick={() => handleClick("crypto")}
                              >
                                <img
                                  src="/img/crypto.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                  className="card-img-top"
                                  alt=""
                                />
                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Crypto Assets
                                  </h5> */}
                                  <div className="custom-text">
                                    Crypto Assets
                                  </div>

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
                                style={{
                                  objectFit: "fill",
                                  height: "170px",
                                  width: "10em",
                                }}
                                onClick={() => handleClick("jewelry")}
                              >
                                <img
                                  src="/img/jewelry.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                    margin: "0px 30px 0px 30px",
                                  }}
                                  className="card-img-top"
                                  alt=""
                                />
                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Jewelry
                                  </h5> */}
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
                                style={{ height: "170px", width: "10em" }}
                                onClick={() => handleClick("insurances")}
                              >
                                <img
                                  src="/img/insurance.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                  className="card-img-top"
                                  alt=""
                                />
                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Insurances
                                  </h5> */}
                                  <div className="custom-text">Insurances</div>

                                  {/* <p className="card-text" style={{ color: "black" }}>
                          Here we can add our Insurance Information
                        </p> */}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-2" style={{ width: "25%" }}>
                            <div className="p-3">
                              <div
                                className="cardtabs"
                                style={{ height: "170px", width: "10em" }}
                                onClick={() => handleClick("vehicles")}
                              >
                                <img
                                  src="/img/vehicle1.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                  className="card-img-top"
                                  alt=""
                                />
                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Vehicle
                                  </h5> */}
                                  <div className="custom-text">Vehicle</div>

                                  {/* <p className="card-text" style={{ color: "black" }}>
                          Here we can add our Vehicle Information
                        </p> */}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-2" style={{ width: "25%" }}>
                            <div className="p-3">
                              <div
                                className="cardtabs"
                                style={{ height: "170px", width: "10em" }}
                                onClick={() => handleClick("income")}
                              >
                                <img
                                  src="/img/income.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                  className="card-img-top"
                                  alt=""
                                />
                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Passive Income
                                  </h5> */}
                                  <div className="custom-text">
                                    Passive Income
                                  </div>

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
                                style={{ height: "170px", width: "10em" }}
                                onClick={() => handleClick("other-assests")}
                              >
                                <img
                                  src="/img/other_assets.png"
                                  style={{
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                  className="card-img-top"
                                  alt=""
                                />
                                <div className="card-body">
                                  {/* <h5
                                    className="card-title"
                                    style={{ color: "black" }}
                                  >
                                    Miscellaneous Assets
                                  </h5> */}
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
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Container>
              {/* </div> */}
            </div>
          )}

          {/* for otherAsset popup  */}
          {show1 && Object.keys(showDetailOtherAsset).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          style={{ color: "#4aafff", fontSize: "18px" }}
                        />
                        <span>
                          {
                            showDetailOtherAsset.assetData.otherAsset
                              .otherAssets1
                          }
                        </span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetailOtherAsset.assetData.documents &&
                            showDetailOtherAsset.assetData.documents.length >
                              0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailOtherAsset,
                                      "otherAsset"
                                    );
                                    setShow(false);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/otherAsset/"
                                }
                                id={
                                  showDetailOtherAsset.internationalAssetData.id
                                }
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailOtherAsset.internationalAssetData.id}
                            assetValue="otherAsset"
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShow1(!show1);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>
                          Assets:{" "}
                          <code>
                            {
                              showDetailOtherAsset.assetData.otherAsset
                                .otherAssets1
                            }
                          </code>
                        </p>
                        <Tooltip title={`Click To See Details`}>
                          <p
                            onClick={() => {
                              SetshowAssets(showDetailOtherAsset);
                            }}
                          >
                            Other Assets: &nbsp;
                            <code>
                              {showDetailOtherAsset &&
                              showDetailOtherAsset.assetData.otherAsset
                                .otherAssets1
                                ? showDetailOtherAsset.assetData.otherAsset.otherAssets1.slice(
                                    0,
                                    5
                                  )
                                : ""}
                              ...<span className="readmore">read more</span>
                            </code>
                          </p>
                        </Tooltip>
                      </div>

                      <div className="col2">
                        <p>
                          Assets Caption:{" "}
                          <code>
                            {
                              showDetailOtherAsset.assetData.otherAsset
                                .assetCaption
                            }
                          </code>
                        </p>

                        {showDetailOtherAsset.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(
                                showDetailOtherAsset,
                                "otherAsset"
                              );
                              setShow1(false);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {showDetailOtherAsset.assetData.otherAsset.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailOtherAsset.assetData.otherAsset
                                    .notes,
                                  "otherAsset"
                                );
                                setShow1(!show1);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {" "}
                                {showDetailOtherAsset &&
                                showDetailOtherAsset.assetData.otherAsset.notes
                                  ? showDetailOtherAsset.assetData.otherAsset.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for realEstate popup  */}
          {showRealEstate && Object.keys(showDetailRealEstate).length > 0 && (
            <>
              <div
                className="card__data"
                style={{ transition: "all 1s ease-out" }}
              >
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <div className="row1-text">
                        <FontAwesomeIcon
                          icon={faHouse}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span style={{}}>
                          {
                            showDetailRealEstate.assetData.realEstate
                              .propertyCaption
                          }
                        </span>
                      </div>
                      <div className="row1-button">
                        <div>
                          {showDetailRealEstate.assetData.documents &&
                            showDetailRealEstate.assetData.documents.length >
                              0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailRealEstate,
                                      "realEstate"
                                    );
                                    // setShow(false);
                                    setShowRealEstate(!showRealEstate);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/realEstate/"
                                }
                                id={
                                  showDetailRealEstate.internationalAssetData.id
                                }
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailRealEstate.internationalAssetData.id}
                            assetValue={"realEstate"}
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowRealEstate(!showRealEstate);
                              // setShow1(!show1);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        {showDetailRealEstate.assetData.realEstate
                          .propertyType === "Other" ? (
                          ""
                        ) : (
                          <p>
                            Type of Property:{" "}
                            <code>
                              {" "}
                              {
                                showDetailRealEstate.assetData.realEstate
                                  .propertyType
                              }
                            </code>
                          </p>
                        )}

                        {showDetailRealEstate.assetData.realEstate
                          .propertyType === "Other" && true ? (
                          <p>
                            Other Type of Property:{" "}
                            <code>
                              {" "}
                              {
                                showDetailRealEstate.assetData.realEstate
                                  .otherPropertyType
                              }
                            </code>
                          </p>
                        ) : (
                          ""
                        )}
                        <p>
                          Street Address:{" "}
                          <code>
                            {
                              showDetailRealEstate.assetData.realEstate
                                .streetAddress
                            }
                          </code>
                        </p>

                        {showDetailRealEstate.assetData.realEstate
                          .aptNumber && (
                          <p>
                            Apartment:{" "}
                            <code>
                              {
                                showDetailRealEstate.assetData.realEstate
                                  .aptNumber
                              }
                            </code>
                          </p>
                        )}
                        <p>
                          Zip Code:{" "}
                          <code>
                            {showDetailRealEstate.assetData.realEstate.zipCode}
                          </code>
                        </p>
                        <p>
                          City / Town:{" "}
                          <code>
                            {showDetailRealEstate.assetData.realEstate.city}
                          </code>
                        </p>
                        <p>
                          State:{" "}
                          <code>
                            {showDetailRealEstate.assetData.realEstate.state}
                          </code>
                        </p>
                        <p>
                          Country:{" "}
                          <code>
                            {showDetailRealEstate.assetData.realEstate.country}
                          </code>
                        </p>
                      </div>
                      <div className="col2">
                        {showDetailRealEstate.assetData.name === null ? (
                          <p>
                            Supporting Document:{" "}
                            <Tooltip
                              title="No document addded"
                              style={{ color: "red" }}
                            >
                              <FontAwesomeIcon
                                icon={faTriangleExclamation}
                                style={{ color: "orange" }}
                              />
                            </Tooltip>
                          </p>
                        ) : (
                          ""
                        )}

                        <p>
                          Estimated Equity:{" "}
                          <code>
                            {" "}
                            <span
                              style={{ color: "green", fontWeight: "bold" }}
                            >
                              {" "}
                              $
                              {showDetailRealEstate.assetData.realEstate.equity}
                              0
                            </span>
                          </code>
                        </p>

                        <p>
                          Estimated Annual Property Tax:
                          <code style={{ color: "red", fontWeight: "bold" }}>
                            {" "}
                            $
                            {
                              showDetailRealEstate.assetData.realEstate
                                .propertyTax
                            }
                            .00
                          </code>
                        </p>

                        {
                          <Tooltip title={`Click To See Details`}>
                            <p
                              onClick={() => {
                                setshowAdditionField1(showDetailRealEstate);
                                setShowRealEstate(!showRealEstate);
                              }}
                            >
                              Mortgages Details:&nbsp;
                              <code>
                                <span className="readmore">Click to see</span>
                              </code>
                            </p>
                          </Tooltip>
                        }

                        <p>
                          Estimate Property Value:{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            $
                            {
                              showDetailRealEstate.assetData.realEstate
                                .estPropertyVal
                            }
                            .00
                          </code>
                        </p>

                        {/* {showDetail.mortgage1 ||
                    showDetail.mortgage2 ||
                    showDetail.mortgage3 ||
                    showDetail.mortgage4 ||
                    (showDetail.mortgage5 && true) ? (
                      <Tooltip title={`Click To See Details`}>
                        <p
                          onClick={() => {
                            setSelectedRow(showDetail);
                            setShow(!show);
                          }}
                        >
                          Total Mortgage:
                          <code>
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {" "}
                              ${showDetail.mortgage}0
                            </span>
                          </code>
                        </p>
                      </Tooltip>
                    ) : (
                      ""
                    )} */}

                        {/* {
                      showDetail.addfield1 || showDetail.addfield2 || showDetail.addfield3 || showDetail.addfield4 || showDetail.addfield5 && true ? (
                        <Tooltip title={`Click To See Details`}>
                          <p onClick={() => { SetshowAdditionField(showDetail); setShow(!show); }}>Additional Fields:
                            <code> {showDetail && showDetail.addfield1 ? showDetail.addfield1.slice(0, 10) : ''}...<span className="readmore">Read More</span></code>
                          </p>
                        </Tooltip>
                      ) : ("")
                    } */}

                        {showDetailRealEstate.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(
                                showDetailRealEstate,
                                "realEstate"
                              );
                              setShowRealEstate(!showRealEstate);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {showDetailRealEstate.assetData.realEstate.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailRealEstate.assetData.realEstate
                                    .notes,
                                  "realEstate"
                                );
                                setShowRealEstate(!showRealEstate);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {showDetailRealEstate &&
                                showDetailRealEstate.assetData.realEstate.notes
                                  ? showDetailRealEstate.assetData.realEstate.notes.slice(
                                      0,
                                      10
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for bank popup  */}
          {showBank && Object.keys(showDetailBank).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faBuildingColumns}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>{showDetailBank.assetData.bank.bankName}</span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetailBank.assetData.documents &&
                            showDetailBank.assetData.documents.length > 0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(showDetailBank, "bank");
                                    setShowBank(!showBank);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>
                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={"../my-estate/International_assets/bank/"}
                                id={showDetailBank.internationalAssetData.id}
                              />
                            </div>
                          </Tooltip>
                        </div>
                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailBank.internationalAssetData.id}
                            assetValue={"bank"}
                          />
                        </div>
                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowBank(!showBank);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        {showDetailBank.assetData.bank.bankType !== "Other" &&
                        showDetailBank.assetData.bank.bankName in bankLogo ? (
                          <p>
                            Bank Name:
                            <code>
                              <img
                                src={
                                  bankLogo[
                                    showDetailBank.assetData.bank.bankName
                                  ]
                                }
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                                alt={`Logo for ${showDetailBank.assetData.bank.bankName}`}
                              />
                              &nbsp;&nbsp;
                              {showDetailBank.assetData.bank.bankName}
                            </code>
                          </p>
                        ) : (
                          <p>
                            Other Banks:{" "}
                            <code>
                              {showDetailBank.assetData.bank.bankName}
                            </code>
                          </p>
                        )}
                        {
                          <Tooltip title={`Click To See Details`}>
                            <p
                              onClick={() => {
                                SetshowAdditionField(showDetailBank);
                                setShow1(false);
                              }}
                            >
                              Additional Accounts Details:&nbsp;
                              <code>
                                <span className="readmore">Click to see</span>
                              </code>
                            </p>
                          </Tooltip>
                        }
                        <p>
                          Estimated Total Bank Assets:{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            ${showDetailBank.assetData.bank.totalAmount}
                          </code>
                        </p>
                        {showDetailBank.assetData.bank.safetyBox ? (
                          <p>
                            Safty Box:{" "}
                            <code>
                              {showDetailBank.assetData.bank.safetyBox ===
                              "true" ? (
                                "yes"
                              ) : (
                                <span style={{ color: "red" }}>No</span>
                              )}
                            </code>
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col2">
                        {showDetailBank.assetData.bank.safetyBoxNumber ? (
                          <p>
                            SaftyBox ID:{" "}
                            <code>
                              {showDetailBank.assetData.bank.safetyBoxNumber ===
                              "" ? (
                                ""
                              ) : (
                                <span>
                                  {
                                    showDetailBank.assetData.bank
                                      .safetyBoxNumber
                                  }
                                </span>
                              )}
                            </code>
                          </p>
                        ) : (
                          ""
                        )}
                        {showDetailBank.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(showDetailBank, "bank");
                              setShowBank(!showBank);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}
                        {showDetailBank.assetData.bank.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailBank.assetData.bank.notes,
                                  "bank"
                                );
                                setShowBank(!showBank);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {showDetailBank.assetData &&
                                showDetailBank.assetData.bank.notes
                                  ? showDetailBank.assetData.bank.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for investment popup  */}
          {showInvestment && Object.keys(showDetailInvestment).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faHandHoldingDollar}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>
                          {showDetailInvestment.assetData.investment.investment}
                        </span>
                      </p>

                      <div className="row1-button">
                        <div>
                          {showDetailInvestment.assetData.documents &&
                            showDetailInvestment.assetData.documents.length >
                              0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailInvestment,
                                      "investment"
                                    );
                                    setShowInvestment(!showInvestment);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/investment/"
                                }
                                id={
                                  showDetailInvestment.internationalAssetData.id
                                }
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailInvestment.internationalAssetData.id}
                            assetValue={"investment"}
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowInvestment(!showInvestment);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>
                          Investment:{" "}
                          <code>
                            {
                              showDetailInvestment.assetData.investment
                                .investment
                            }
                          </code>
                        </p>
                        <p>
                          Investment Caption:{" "}
                          <code>
                            {
                              showDetailInvestment.assetData.investment
                                .investmentCaption
                            }
                          </code>
                        </p>
                        <p>
                          Name of Exchange:{" "}
                          <code>
                            {
                              showDetailInvestment.assetData.investment
                                .nameOfTheInvestment
                            }
                          </code>
                        </p>
                        <p>
                          Total Amount:{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            ${" "}
                            {
                              showDetailInvestment.assetData.investment
                                .totalAmount
                            }
                          </code>
                        </p>

                        {showDetailInvestment.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(
                                showDetailInvestment,
                                "investment"
                              );
                              setShowInvestment(!showInvestment);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {/* {showDetail.addfield1 &&
                          (<Tooltip title={`Click To See Details`}>
                            <p onClick={() => { SetshowAdditionField(showDetail); setShow1(!show1) }}>Additional Fields:&nbsp;
                              <code>{showDetail && showDetail.addfield1 ? showDetail.addfield1.slice(0, 5) : ''}...<span className="readmore">Read More</span></code>
                            </p>
                          </Tooltip>)} */}

                        {showDetailInvestment.assetData.investment.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailInvestment.assetData.investment
                                    .notes,
                                  "investment"
                                );
                                setShowInvestment(!showInvestment);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {" "}
                                {showDetailInvestment &&
                                showDetailInvestment.assetData.investment.notes
                                  ? showDetailInvestment.assetData.investment.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for crypto popup  */}
          {showCrypto && Object.keys(showDetailCrypto).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faBitcoin}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>
                          {showDetailCrypto.assetData.cryptoAssest.coin}
                        </span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetailCrypto.assetData.documents &&
                            showDetailCrypto.assetData.documents.length > 0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailCrypto,
                                      "crypto"
                                    );
                                    setShowCrypto(!showCrypto);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/crypto/"
                                }
                                id={showDetailCrypto.internationalAssetData.id}
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailCrypto.internationalAssetData.id}
                            assetValue={"crypto"}
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowCrypto(!showCrypto);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>
                          Coin Name:{" "}
                          <code>
                            {showDetailCrypto.assetData.cryptoAssest.coin}
                          </code>
                        </p>
                        <p>
                          Exchange:{" "}
                          <code>
                            {showDetailCrypto.assetData.cryptoAssest.exchange}
                          </code>
                        </p>
                        <p>
                          Wallet:{" "}
                          <code>
                            {showDetailCrypto.assetData.cryptoAssest.wallet}
                          </code>
                        </p>
                        <p>
                          Quantity:{" "}
                          <code>
                            {showDetailCrypto.assetData.cryptoAssest.quantity}
                          </code>
                        </p>
                        <p>
                          Estimated Value:{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            {showDetailCrypto.assetData.cryptoAssest
                              .estValue ? (
                              showDetailCrypto.assetData.cryptoAssest.estValue
                            ) : (
                              <span style={{ color: "red" }}>
                                Server Down Try Again Later
                              </span>
                            )}
                          </code>
                        </p>
                      </div>
                      <div className="col2">
                        <p>
                          Crypto Caption:{" "}
                          <code>
                            {
                              showDetailCrypto.assetData.cryptoAssest
                                .cryptoCaption
                            }
                          </code>
                        </p>

                        {showDetailCrypto.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(showDetailCrypto, "crypto");
                              setShowCrypto(!showCrypto);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {/* {showDetail.addfield1 && (
                      <Tooltip title={`Click To See Details`}>
                        <p
                          onClick={() => {
                            SetshowAdditionField(showDetail);
                            setShow1(!show1);
                          }}
                        >
                          Additional Fields:&nbsp;
                          <code>
                            {showDetail && showDetail.addfield1
                              ? showDetail.addfield1.slice(0, 5)
                              : ""}
                            ...<span className="readmore">Read More</span>
                          </code>
                        </p>
                      </Tooltip>
                    )} */}

                        {showDetailCrypto.assetData.cryptoAssest.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailCrypto.assetData.cryptoAssest.notes,
                                  "crypto"
                                );
                                setShowCrypto(!showCrypto);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {showDetailCrypto &&
                                showDetailCrypto.assetData.cryptoAssest.notes
                                  ? showDetailCrypto.assetData.cryptoAssest.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for jewelry popup  */}
          {showJewelry && Object.keys(showDetailJewelry).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faGem}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>
                          {getDisplayName(
                            showDetailJewelry.assetData.jewelry.jewelryName
                          )}
                        </span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetailJewelry.assetData.documents &&
                            showDetailJewelry.assetData.documents.length >
                              0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailJewelry,
                                      "jewelry"
                                    );
                                    setShowJewelry(!showJewelry);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/jewelry/"
                                }
                                id={showDetailJewelry.internationalAssetData.id}
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailJewelry.internationalAssetData.id}
                            assetValue={"jewelry"}
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowJewelry(!showJewelry);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>
                          Details:{" "}
                          <code>
                            {getDisplayName(
                              showDetailJewelry.assetData.jewelry.jewelryName
                            )}
                          </code>
                        </p>
                        <p>
                          Appraised Value:{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            $
                            {showDetailJewelry.assetData.jewelry.estimatedValue}
                          </code>
                        </p>
                        <p>
                          Carat Value:{" "}
                          <code>
                            {getDisplayKeratValue(
                              showDetailJewelry.assetData.jewelry.caratValue
                            )}
                          </code>
                        </p>
                        <p>
                          Weight(gm):{" "}
                          <code>
                            {showDetailJewelry.assetData.jewelry.weight}
                          </code>
                        </p>
                        {/* <p>Safty Box: <code>{showDetail.saftyBox}</code></p> */}
                      </div>

                      <div className="col2">
                        <p>
                          Jewelry Caption:{" "}
                          <code>
                            {showDetailJewelry.assetData.jewelry.jewelryCaption}
                          </code>
                        </p>

                        {/* {showDetail.addfield1 && (
                      <Tooltip title={`Click To See Details`}>
                        <p
                          onClick={() => {
                            SetshowAdditionField(showDetail);
                            setShow1(!show1);
                          }}
                        >
                          Additional Fields:&nbsp;
                          <code>
                            {showDetail && showDetail.addfield1
                              ? showDetail.addfield1.slice(0, 5)
                              : ""}
                            ...<span className="readmore">Read More</span>
                          </code>
                        </p>
                      </Tooltip>
                    )} */}

                        {showDetailJewelry.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(
                                showDetailJewelry,
                                "jewelry"
                              );
                              setShowJewelry(!showJewelry);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {showDetailJewelry.assetData.jewelry.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailJewelry.assetData.jewelry.notes,
                                  "jewelry"
                                );
                                setShowJewelry(!showJewelry);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {" "}
                                {showDetailJewelry &&
                                showDetailJewelry.assetData.jewelry.notes
                                  ? showDetailJewelry.assetData.jewelry.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for insurance popup  */}
          {showInsurance && Object.keys(showDetailInsurance).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faShieldHalved}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>
                          {showDetailInsurance.assetData.insurance.details}
                        </span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetailInsurance.assetData.documents &&
                            showDetailInsurance.assetData.documents.length >
                              0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailInsurance,
                                      "insurance"
                                    );
                                    setShowInsurance(!showInsurance);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/insurance/"
                                }
                                id={
                                  showDetailInsurance.internationalAssetData.id
                                }
                              />
                            </div>
                          </Tooltip>
                        </div>
                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailInsurance.internationalAssetData.id}
                            assetValue={"insurance"}
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowInsurance(!showInsurance);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>
                          Insurance Name:{" "}
                          <code>
                            {showDetailInsurance.assetData.insurance.details}
                          </code>
                        </p>
                        <p>
                          Point Of Contact Name:{" "}
                          <code>
                            {
                              showDetailInsurance.assetData.insurance
                                .detailsOfpoint
                            }
                          </code>
                        </p>
                      </div>
                      <div className="col2">
                        <p>
                          Insurance Caption:{" "}
                          <code>
                            {
                              showDetailInsurance.assetData.insurance
                                .insuranceCaption
                            }
                          </code>
                        </p>

                        {/* {showDetail.addfield1 && (
                      <Tooltip title={`Click To See Details`}>
                        <p
                          onClick={() => {
                            SetshowAdditionField(showDetail);
                            setShow1(!show1);
                          }}
                        >
                          Additional Fields:&nbsp;
                          <code>
                            {showDetail && showDetail.addfield1
                              ? showDetail.addfield1.slice(0, 5)
                              : ""}
                            ...<span className="readmore">Read More</span>
                          </code>
                        </p>
                      </Tooltip>
                    )} */}

                        {showDetailInsurance.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(
                                showDetailInsurance,
                                "insurance"
                              );
                              setShowInsurance(!showInsurance);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {showDetailInsurance.assetData.insurance.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailInsurance.assetData.insurance.notes,
                                  "insurance"
                                );
                                setShowInsurance(!showInsurance);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {" "}
                                {showDetailInsurance &&
                                showDetailInsurance.assetData.insurance.notes
                                  ? showDetailInsurance.assetData.insurance.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for vehicle popup  */}
          {showVehicle && Object.keys(showDetailVehicle).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faCarSide}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>
                          {showDetailVehicle.assetData.vehicle.vehicleType}
                        </span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetailVehicle.assetData.documents &&
                            showDetailVehicle.assetData.documents.length >
                              0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailVehicle,
                                      "vehicle"
                                    );
                                    setShowVehicle(!showVehicle);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/vehicle/"
                                }
                                id={showDetailVehicle.internationalAssetData.id}
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailVehicle.internationalAssetData.id}
                            assetValue={"vehicle"}
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowVehicle(!showVehicle);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>
                          Vehicle Type:{" "}
                          <code>
                            {showDetailVehicle.assetData.vehicle.vehicleType}
                          </code>
                        </p>
                        <p>
                          Year Manufactured:{" "}
                          <code>
                            {showDetailVehicle.assetData.vehicle.year}
                          </code>
                        </p>
                        <p>
                          Loan:{" "}
                          <code style={{ color: "red", fontWeight: "bold" }}>
                            $ {showDetailVehicle.assetData.vehicle.loan}
                          </code>
                        </p>
                        <p>
                          Make:{" "}
                          <code>
                            {showDetailVehicle.assetData.vehicle.make}
                          </code>
                        </p>
                        <p>
                          Miles:{" "}
                          <code>
                            {showDetailVehicle.assetData.vehicle.miles}
                          </code>
                        </p>
                        <p>
                          Model:{" "}
                          <code>
                            {showDetailVehicle.assetData.vehicle.model}
                          </code>
                        </p>
                      </div>
                      <div className="col2">
                        <p>
                          Estimated Value :{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            $ {showDetailVehicle.assetData.vehicle.estValue}
                          </code>
                        </p>

                        <p>
                          Vehicle Caption:{" "}
                          <code>
                            {showDetailVehicle.assetData.vehicle.vehicleCaption}
                          </code>
                        </p>

                        {/* <p style={{display:"flex"}}>Download The Document:         
                <Tooltip title="Click Here To Downlaod The Document  ">
                <div
                //  value = {showDetail.user.id}
                  style={{ cursor: "pointer"}}
                  onClick={() => {
                    handleDownload(showDetail.name);
                  }}>
                  <div className="myestate_download_button dwnbtn">
                    <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                    <span></span>
                  </div>
                </div>
                </Tooltip>
              </p> */}
                        {/* <Tooltip title={`Click To See Details`}>
                <p onClick={()=>{setSelectedRow(showDetail)}}>Total Mortgage: 
                <code>{showDetail.mortgage}</code>
                </p>
             </Tooltip> */}

                        {/* {showDetail.addfield1 && (
                      <Tooltip title={`Click To See Details`}>
                        <p
                          onClick={() => {
                            SetshowAdditionField(showDetail);
                            setShow1(!show1);
                          }}
                        >
                          Additional Fields:&nbsp;
                          <code>
                            {showDetail && showDetail.addfield1
                              ? showDetail.addfield1.slice(0, 5)
                              : ""}
                            ...<span className="readmore">Read More</span>
                          </code>
                        </p>
                      </Tooltip>
                    )} */}

                        {showDetailVehicle.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(
                                showDetailVehicle,
                                "vehicle"
                              );
                              setShowVehicle(!showVehicle);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {showDetailVehicle.assetData.vehicle.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailVehicle.assetData.vehicle.notes,
                                  "vehicle"
                                );
                                setShowVehicle(!showVehicle);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {" "}
                                {showDetailVehicle &&
                                showDetailVehicle.assetData.vehicle.notes
                                  ? showDetailVehicle.assetData.vehicle.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* for income popup  */}
          {showIncome && Object.keys(showDetailIncome).length > 0 && (
            <>
              <div className="card__data">
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                        <FontAwesomeIcon
                          icon={faMoneyCheckDollar}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>
                          {showDetailIncome.assetData.income.incomeAmount}
                        </span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetailIncome.assetData.documents &&
                            showDetailIncome.assetData.documents.length > 0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(
                                      showDetailIncome,
                                      "income"
                                    );
                                    setShowIncome(!showIncome);
                                  }}
                                >
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon
                                      className="myestate_download_icon"
                                      icon={faDownload}
                                    />
                                    <span></span>
                                  </div>
                                </div>
                              </Tooltip>
                            )}
                        </div>

                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={
                                  "../my-estate/International_assets/income/"
                                }
                                id={showDetailIncome.internationalAssetData.id}
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetailIncome.internationalAssetData.id}
                            assetValue={"income"}
                          />
                        </div>

                        <div>
                          <span
                            className="card__data-close"
                            onClick={() => {
                              setShowIncome(!showIncome);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>
                          Income:{" "}
                          <code>
                            {showDetailIncome.assetData.income.incomeAmount}
                          </code>
                        </p>
                        <p>
                          Source:{" "}
                          <code>
                            {showDetailIncome.assetData.income.businessSource}
                          </code>
                        </p>
                        <p>
                          Income Caption{" "}
                          <code>
                            {showDetailIncome.assetData.income.incomeCaption}
                          </code>
                        </p>
                      </div>
                      <div className="col2">
                        {showDetailIncome.assetData.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(showDetailIncome, "income");
                              setShowIncome(!showIncome);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {showDetailIncome.assetData.income.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(
                                  showDetailIncome.assetData.income.notes,
                                  "income"
                                );
                                setShowIncome(!showIncome);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {showDetailIncome &&
                                showDetailIncome.assetData.income.notes
                                  ? showDetailIncome.assetData.income.notes.slice(
                                      0,
                                      5
                                    )
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* notes popup  */}
          {popupVisible && (
            // Popup div
            <div className="popup">
              <div className="popup-content">
                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div>
                      <h2>Notes</h2>
                    </div>
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={() => {
                          if (assetTypeValue == "realEstate") {
                            setPopupVisible(false);
                            setShowRealEstate(!showRealEstate);
                          } else if (assetTypeValue == "otherAsset") {
                            setPopupVisible(false);
                            setShow1(true);
                          } else if (assetTypeValue == "bank") {
                            setPopupVisible(false);
                            setShowBank(!showBank);
                          } else if (assetTypeValue == "investment") {
                            setPopupVisible(false);
                            setShowInvestment(!showInvestment);
                          } else if (assetTypeValue == "income") {
                            setPopupVisible(false);
                            setShowIncome(!showIncome);
                          } else if (assetTypeValue == "vehicle") {
                            setPopupVisible(false);
                            setShowVehicle(!showVehicle);
                          } else if (assetTypeValue == "jewelry") {
                            setPopupVisible(false);
                            setShowJewelry(!showJewelry);
                          } else if (assetTypeValue == "crypto") {
                            setPopupVisible(false);
                            setShowCrypto(!showCrypto);
                          } else if (assetTypeValue == "insurance") {
                            setPopupVisible(false);
                            setShowInsurance(!showInsurance);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p>{selectedNote}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* beneficiary popup  */}
          {beneficiaryVisible && (
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <h2>share property</h2>
                    </div>
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={() => {
                          if (assetTypeValue == "realEstate") {
                            setBeneficiaryVisible(false);
                            setShowRealEstate(!showRealEstate);
                          } else if (assetTypeValue == "otherAsset") {
                            setBeneficiaryVisible(false);
                            setShow1(true);
                          } else if (assetTypeValue == "bank") {
                            setBeneficiaryVisible(false);
                            setShowBank(!showBank);
                          } else if (assetTypeValue == "investment") {
                            setBeneficiaryVisible(false);
                            setShowInvestment(!showInvestment);
                          } else if (assetTypeValue == "income") {
                            setBeneficiaryVisible(false);
                            setShowIncome(!showIncome);
                          } else if (assetTypeValue == "vehicle") {
                            setBeneficiaryVisible(false);
                            setShowVehicle(!showVehicle);
                          } else if (assetTypeValue == "jewelry") {
                            setBeneficiaryVisible(false);
                            setShowJewelry(!showJewelry);
                          } else if (assetTypeValue == "crypto") {
                            setBeneficiaryVisible(false);
                            setShowCrypto(!showCrypto);
                          } else if (assetTypeValue == "insurance") {
                            setBeneficiaryVisible(false);
                            setShowInsurance(!showInsurance);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                  <div>
                    {selectedBeneficiary.assetData.sharedDetails &&
                      selectedBeneficiary.assetData.sharedDetails.map(
                        (details, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "5px",
                              padding: "10px",
                              border: "solid 1px lightgray",
                              borderRadius: "5px",
                              minWidth: "230px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "17px",
                                  color: "black",
                                  fontWeight: "500",
                                }}
                              >
                                Share - {index + 1}
                              </p>
                              <Deletebutton
                                handleRemove={handleRemove}
                                Id={details.id}
                                idType="sharedDetailId"
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "20px",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "15px",
                                  color: "black",
                                  fontWeight: "400",
                                  marginLeft: "20px",
                                }}
                              >
                                Beneficiary Name:
                                <span style={{ marginLeft: "10px" }}>
                                  {getBenificiaryName(details.beneficiaryId)}
                                </span>
                              </p>
                              <p
                                style={{
                                  fontSize: "15px",
                                  color: "black",
                                  fontWeight: "400",
                                  marginLeft: "20px",
                                }}
                              >
                                Distributed Type:
                                <span style={{ marginLeft: "10px" }}>
                                  {details.distributedType}
                                </span>
                              </p>
                              <p
                                style={{
                                  fontSize: "15px",
                                  color: "black",
                                  fontWeight: "400",
                                  marginLeft: "20px",
                                }}
                              >
                                Distributed Value:{" "}
                                <span style={{ marginLeft: "10px" }}>
                                  {details &&
                                    details.distributedType === "dollar" &&
                                    "$"}
                                  {details.distributedValue}
                                  {details.distributedType === "percentage" &&
                                    "%"}
                                </span>
                              </p>
                              <p
                                style={{
                                  fontSize: "15px",
                                  color: "black",
                                  fontWeight: "400",
                                  marginLeft: "20px",
                                }}
                              >
                                Distributed Amount:
                                <span style={{ marginLeft: "10px" }}>
                                  ${details.distributedAmount}
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showAssets && (
            // Display the popup when a row is selected
            <div className="popup">
              <div className="popup-content">
                <div className="note_popup_heading">
                  <div>
                    <h2>All Additional Assets</h2>
                  </div>
                  <div>
                    <button
                      className="note_popup_heading_close_btn"
                      onClick={() => {
                        SetshowAssets(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
                <div className="popup-body">
                  {showAssets.assetData.otherAsset.otherAssets1 !== 0 &&
                  showAssets.assetData.otherAsset.otherAssets1 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 1 :{" "}
                      {showAssets.assetData.otherAsset.otherAssets1}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.assetData.otherAsset.otherAssets2 !== 0 &&
                  showAssets.assetData.otherAsset.otherAssets2 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 2 :{" "}
                      {showAssets.assetData.otherAsset.otherAssets2}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.assetData.otherAsset.otherAssets3 !== 0 &&
                  showAssets.assetData.otherAsset.otherAssets3 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 3 :{" "}
                      {showAssets.assetData.otherAsset.otherAssets3}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.assetData.otherAsset.otherAssets4 !== 0 &&
                  showAssets.assetData.otherAsset.otherAssets4 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 4 :{" "}
                      {showAssets.assetData.otherAsset.otherAssets4}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.assetData.otherAsset.otherAssets5 !== 0 &&
                  showAssets.assetData.otherAsset.otherAssets5 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 5 :{" "}
                      {showAssets.assetData.otherAsset.otherAssets5}
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/*  download popup */}
          {popupVisibleDownlaod && (
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <h2>Download Files</h2>
                    </div>
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={() => {
                          if (assetTypeValue == "realEstate") {
                            setPopupVisibleDownlaod(false);
                            setShowRealEstate(!showRealEstate);
                          } else if (assetTypeValue == "otherAsset") {
                            setPopupVisibleDownlaod(false);
                            setShow1(true);
                          } else if (assetTypeValue == "bank") {
                            setPopupVisibleDownlaod(false);
                            setShowBank(!showBank);
                          } else if (assetTypeValue == "investment") {
                            setPopupVisibleDownlaod(false);
                            setShowInvestment(!showInvestment);
                          } else if (assetTypeValue == "income") {
                            setPopupVisibleDownlaod(false);
                            setShowIncome(!showIncome);
                          } else if (assetTypeValue == "vehicle") {
                            setPopupVisibleDownlaod(false);
                            setShowVehicle(!showVehicle);
                          } else if (assetTypeValue == "jewelry") {
                            setPopupVisibleDownlaod(false);
                            setShowJewelry(!showJewelry);
                          } else if (assetTypeValue == "crypto") {
                            setPopupVisibleDownlaod(false);
                            setShowCrypto(!showCrypto);
                          } else if (assetTypeValue == "insurance") {
                            setPopupVisibleDownlaod(false);
                            setShowInsurance(!showInsurance);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>

                  <div>
                    {selectedDownlaod.assetData.documents &&
                      selectedDownlaod.assetData.documents.length > 0 &&
                      selectedDownlaod.assetData.documents.map(
                        (file, index) => (
                          <div key={index} style={{ marginBottom: "20px" }}>
                            <Tooltip title={file.fileName}>
                              <div
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  gap: "20px",
                                }}
                                onClick={() => {
                                  handleDownload(file.id, file.fileName);
                                }}
                              >
                                Download - {index + 1}
                                <div className="myestate_download_button dwnbtn">
                                  <FontAwesomeIcon
                                    className="myestate_download_icon"
                                    icon={faDownload}
                                  />
                                  <span>{file.fileName}</span>
                                </div>
                              </div>
                            </Tooltip>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* mortgages popup  */}
          {showAdditionField1 && (
            // Display the popup when a row is selected
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup_heading">
                  <div style={{ width: "100%" }}>
                    <h2 style={{ textAlign: "center" }}>Mortgages Details</h2>
                  </div>
                  <div>
                    <button
                      className="note_popup_heading_close_btn"
                      onClick={() => {
                        setshowAdditionField1(false);
                        setShow1(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
                {/* <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", }} > */}
                {showDetailRealEstate.assetData &&
                  showDetailRealEstate.assetData.mortgages.map(
                    (mortgageList, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "5px",
                          padding: "10px",
                          border: "solid 1px lightgray",
                          borderRadius: "5px",
                          minWidth: "230px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "17px",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Mortgage - {index + 1}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "20px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "15px",
                              color: "black",
                              fontWeight: "400",
                              marginLeft: "20px",
                            }}
                          >
                            Mortgage:
                            <span
                              style={{ marginLeft: "10px", fontWeight: "500" }}
                            >
                              {mortgageList.mortgage}
                            </span>
                          </p>
                        </div>
                      </div>
                    )
                  )}
                {/* </div> */}
              </div>
            </div>
          )}

          {showAdditionField && (
            // Display the popup when a row is selected
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup_heading">
                  <div style={{ width: "100%" }}>
                    <h2 style={{ textAlign: "center" }}>Accounts Details</h2>
                  </div>
                  <div>
                    <button
                      className="note_popup_heading_close_btn"
                      onClick={() => {
                        SetshowAdditionField(false);
                        setShow1(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
                {/* <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", }} > */}
                {showDetailBank.assetData.accounts &&
                  showDetailBank.assetData.accounts.map((account, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "5px",
                        padding: "10px",
                        border: "solid 1px lightgray",
                        borderRadius: "5px",
                        minWidth: "230px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "17px",
                            color: "black",
                            fontWeight: "500",
                          }}
                        >
                          Account - {index + 1}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "20px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            color: "black",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          Account Number:
                          <span
                            style={{ marginLeft: "10px", fontWeight: "500" }}
                          >
                            {account.accountNumber}
                          </span>
                        </p>
                        <p
                          style={{
                            fontSize: "15px",
                            color: "black",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          Account Type:{" "}
                          <span
                            style={{ marginLeft: "10px", fontWeight: "500" }}
                          >
                            {account.accountType}
                          </span>
                        </p>
                        <p
                          style={{
                            fontSize: "15px",
                            color: "black",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          Account Balance:
                          <span
                            style={{ marginLeft: "10px", fontWeight: "500" }}
                          >
                            ${account.balance}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                {/* </div> */}
              </div>
            </div>
          )}
        </SideBar>
      </UserBase>
    </div>
  );
}
