import { faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import {
  getBeneficiary,
  getToken,
  getUser,
  getUser1,
} from "../../services/user-service";
import { jsPDF } from "jspdf";
import "./../../css/welcomeIchest.css";
import "./../../css/inventoryReport.css";
import AttorneyDetail from "../AttorneyDetail";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import { v4 as uuidv4 } from "uuid";

function GenerateWill({ combinedData, closePopup }) {
  const uuid = uuidv4();
  const [beneficiary, setBeneficiary] = useState([]);
  const [show, setShow] = useState(false);

  const [pdfDataUri, setPdfDataUri] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);

  const userDetails = getUser();

  const getBeneficiarydata = () => {
    const userId = getUser().id;
    const token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBeneficiary(res);
      })
      .catch((err) => {});
  };

  const getBeneficiaryName = (id) => {
    const foundBeneficiary = beneficiary.find((b) => b.id === parseInt(id));
    return foundBeneficiary
      ? `${foundBeneficiary.firstName} ${foundBeneficiary.lastName}`
      : "Beneficiary not found";
  };

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

  const realEstateData = combinedData[0]?.realEstateData;
  const bankData = combinedData[1]?.bankData;
  const jewelryData = combinedData[2]?.jewelryData;
  const vehicleData = combinedData[3]?.vehicleData;
  const investmentData = combinedData[4]?.investmentData;
  const cryptoAssetData = combinedData[5]?.cryptoAssetData;

  // const generatePdf = () => {
  //   const pdf = new jsPDF();
  //   const content = document.getElementById("pdf-content");

  //   pdf.html(content, {
  //     callback: (pdf) => {
  //       pdf.save("inventory-report.pdf");
  //     },
  //     margin: [5, 5, 5, 5],
  //     x: 0,
  //     y: 0,
  //     width: 200,
  //     windowWidth: 975,
  //   });
  // };

  const getInitialState = () => {
    const initialState = {};
    if (bankData && bankData?.length !== 0) initialState.bank = false;
    if (realEstateData && realEstateData?.length !== 0)
      initialState.realEstate = false;
    if (jewelryData && jewelryData?.length !== 0) initialState.jewelry = false;
    if (vehicleData && vehicleData?.length !== 0) initialState.vehicle = false;
    if (investmentData && investmentData?.length !== 0)
      initialState.investment = false;
    if (cryptoAssetData && cryptoAssetData?.length !== 0)
      initialState.crypto = false;
    return initialState;
  };

  const [checkedState, setCheckedState] = useState(getInitialState);
  const [error, setError] = useState("");

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedState((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
    setError("");
  };

  // main code to store pdf
  const generatePdf = () => {
    const allChecked = Object.values(checkedState).every(Boolean);

    if (
      allChecked === true &&
      (savedDrawSignature !== null ||
        savedTypeSignature !== null ||
        savedUploadSignature !== null)
    ) {
      toggleAttorney();
      const pdf = new jsPDF();
      const content = document.getElementById("pdf-content");

      pdf.html(content, {
        callback: (pdf) => {
          const dataUri = pdf.output("datauristring");
          const blob = pdf.output("blob");
          setPdfDataUri(dataUri);
          // setPdfBlob(blob);
        },
        margin: [5, 5, 5, 5],
        x: 0,
        y: 0,
        width: 200,
        windowWidth: 975,
      });
    } else {
      setError(
        "Please check all the declaration and submit electronic signature"
      );
    }
  };

  // const convertDataUriToPdf = () => {
  //   // Convert data URI to blob
  //   const byteCharacters = atob(pdfDataUri.split(",")[1]);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

  //   // Open the PDF in a new tab
  //   const objectUrl = URL.createObjectURL(pdfBlob);
  //   window.open(objectUrl);
  // };

  const [date, setDate] = useState("");

  const getAndSetDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    setDate(`${year}/${month}/${day}`);
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  const [attorneyPopup, setAttorneyPopup] = useState(false);

  const toggleAttorney = () => {
    setAttorneyPopup(!attorneyPopup);
  };

  const handleBack = () => {
    setAttorneyPopup(false);
  };

  const [mode, setMode] = useState("");
  const [typedSignature, setTypedSignature] = useState("");
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [savedDrawSignature, setSavedDrawSignature] = useState(null);
  const [savedTypeSignature, setSavedTypeSignature] = useState(null);
  const [savedUploadSignature, setSavedUploadSignature] = useState(null);
  const sigCanvas = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedSignature(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setCurrentTime(new Date());
    setMode("");
    setTypedSignature("");
    setUploadedSignature(null);
    setSavedDrawSignature(null);
    setSavedTypeSignature(null);
    setSavedUploadSignature(null);
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const save = () => {
    if (mode === "draw" && sigCanvas.current) {
      setSavedDrawSignature(
        sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
      );
      setError("");
    } else if (mode === "type") {
      setSavedTypeSignature(typedSignature);
      setError("");
    } else if (mode === "upload") {
      setSavedUploadSignature(uploadedSignature);
      setError("");
    }
  };

  useEffect(() => {
    setShow(true);
    getBeneficiarydata();
    getAndSetDate();
  }, []);

  return (
    <>
      <div className={`your-component ${show ? "fade-in-element" : ""}`}>
        <div className="popup2">
          <div className="popup-inner">
            <div className="welcome_ichest_popup">
              <div className="welcome_ichest_popup_main">
                <div style={{ marginTop: "30px", paddingBottom: "40px" }}>
                  <div className="welcome_ichest_popup_close_heading">
                    <button
                      className="welcome_ichest_popup_close"
                      onClick={closePopup}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <div
                    id="pdf-content"
                    style={{
                      fontFamily: "Arial, sans-serif",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <h1
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "24px",
                        marginBottom: "10px",
                      }}
                    >
                      Inventory Report
                    </h1>

                    {/* for realEstate  */}
                    {realEstateData && realEstateData?.length !== 0 && (
                      <div
                        style={{
                          margin: "10px 0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          Real Estates
                        </h2>
                        {realEstateData.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              // border: "0.5px solid gray",
                              borderRadius: "5px",
                              padding: "0 50px 0 50px",
                              marginTop: "10px",
                              width: "100%",
                              textTransform: "capitalize",
                            }}
                          >
                            <h3 style={{ fontWeight: "bold" }}>
                              {" "}
                              {index + 1}) Real Estate
                            </h3>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ flex: "1", marginRight: "20px" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Owner Name:
                                  </span>{" "}
                                  {item.realEstate.owner}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Property Name:
                                  </span>{" "}
                                  {item.realEstate.propertyCaption}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Country:
                                  </span>{" "}
                                  {item.realEstate.country}
                                </p>
                              </div>
                              <div style={{ flex: "1" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Street:
                                  </span>{" "}
                                  {item.realEstate.streetAddress}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    City/Zip:
                                  </span>{" "}
                                  {item.realEstate.city}/
                                  {item.realEstate.zipCode}
                                </p>

                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    State:
                                  </span>{" "}
                                  {item.realEstate.state}
                                </p>
                              </div>
                              <div style={{ flex: "1" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Estimated Value:
                                  </span>{" "}
                                  ${item.realEstate.estPropertyVal}.00
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Equity:
                                  </span>
                                  ${item.realEstate.equity}0
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Annual Property Tax:
                                  </span>{" "}
                                  ${item.realEstate.propertyTax}.00
                                </p>
                              </div>
                            </div>

                            <div style={{ marginTop: "20px" }}>
                              <h3
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  padding: "0 0 5px 0",
                                }}
                              >
                                Mortgages Details
                              </h3>
                              {item.mortgages &&
                                item.mortgages.map((detail, index) => (
                                  <div key={index}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div
                                        style={{
                                          flex: "1",
                                          marginRight: "20px",
                                        }}
                                      >
                                        <p style={{ marginBottom: "5px" }}>
                                          <span style={{ fontWeight: "bold" }}>
                                            Mortgage Institution:{" "}
                                          </span>
                                          {detail.mortgageInstitution}
                                        </p>
                                      </div>
                                      <div style={{ flex: "1" }}>
                                        <p style={{ marginBottom: "5px" }}>
                                          <span style={{ fontWeight: "bold" }}>
                                            Mortgage Number:{" "}
                                          </span>{" "}
                                          {detail.mortgageNumber}
                                        </p>
                                      </div>
                                      <div style={{ flex: "1" }}>
                                        <p style={{ marginBottom: "5px" }}>
                                          <span style={{ fontWeight: "bold" }}>
                                            Mortgage:{" "}
                                          </span>
                                          ${detail.mortgage}.00
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {item.sharedDetails &&
                              item?.sharedDetails?.length !== 0 && (
                                <div style={{ marginTop: "20px" }}>
                                  <h3
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      padding: "0 0 5px 0",
                                    }}
                                  >
                                    Beneficiary Details
                                  </h3>
                                  {item.sharedDetails.map((detail, index) => (
                                    <div key={index}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div
                                          style={{
                                            flex: "1",
                                            marginRight: "20px",
                                          }}
                                        >
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Beneficiary Name:{" "}
                                            </span>
                                            {getBeneficiaryName(
                                              detail.beneficiaryId
                                            )}
                                          </p>
                                        </div>
                                        <div style={{ flex: "1" }}>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Value:{" "}
                                            </span>{" "}
                                            {detail.distributedType === "dollar"
                                              ? `$${detail.distributedValue}.00`
                                              : `${detail.distributedValue}%`}
                                          </p>
                                        </div>
                                        <div style={{ flex: "1" }}>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Amount:{" "}
                                            </span>
                                            ${detail.distributedAmount}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                            <div style={{ marginTop: "20px" }}></div>

                            {index !== realEstateData?.length - 1 && (
                              <hr style={{ margin: "16px 0 8px 0" }} />
                            )}
                          </div>
                        ))}

                        <div
                          style={{
                            padding: "8px 50px",
                            width: "100%",
                            flex: "start",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              padding: 0,
                              marginRight: "8px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                            name="realEstate"
                            checked={checkedState.realEstate}
                            onChange={handleCheckboxChange}
                          />
                          <p
                            className="declare"
                            style={{
                              color: "black",
                              fontSize: "14px",
                              backgroundColor: "#e9e9cf",
                              marginLeft: "20px",
                              padding: "0 3px",
                            }}
                          >
                            I{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            >
                              {userDetails.firstName} {userDetails.lastName}
                            </span>{" "}
                            here by declare that the information furnished above
                            is true, complete and correct to the best of my
                            knowledge and belief.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* for banks */}
                    {bankData && bankData?.length !== 0 && (
                      <div
                        style={{
                          margin: "10px 0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          Banks
                        </h2>

                        {bankData.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              // border: "0.5px solid gray",
                              borderRadius: "5px",
                              padding: "0 50px 0 50px",
                              marginTop: "10px",
                              width: "100%",
                              textTransform: "capitalize",
                            }}
                          >
                            <h3 style={{ fontWeight: "bold" }}>
                              {" "}
                              {index + 1}) {item.bank.bankName}
                            </h3>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ flex: "1", marginRight: "20px" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Owner Name:
                                  </span>{" "}
                                  {item.bank.owner}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Bank Name:
                                  </span>{" "}
                                  {item.bank.bankName}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Estimated Total Bank Assests:
                                  </span>{" "}
                                  ${item.bank.totalAmount}0
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Safety Box:
                                  </span>{" "}
                                  {item.bank.safetyBox === "true" ? (
                                    "yes"
                                  ) : (
                                    <span>No</span>
                                  )}
                                </p>

                                {item.bank.safetyBox === "true" && (
                                  <p style={{ marginBottom: "5px" }}>
                                    <span style={{ fontWeight: "bold" }}>
                                      SafetyBox Id:
                                    </span>{" "}
                                    {item.bank.safetyBoxNumber === "" ? (
                                      ""
                                    ) : (
                                      <span>{item.bank.safetyBoxNumber}</span>
                                    )}
                                  </p>
                                )}
                              </div>
                              <div style={{ flex: "1" }}>
                                <h3
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    padding: "0 0 5px 0",
                                  }}
                                >
                                  Additional Accounts Details
                                </h3>
                                {item.accounts.map((detail, index) => (
                                  <div key={index}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <div style={{ marginRight: "20px" }}>
                                        <p style={{ marginBottom: "5px" }}>
                                          <span style={{ fontWeight: "bold" }}>
                                            Account Number:{" "}
                                          </span>
                                          {detail.accountNumber}
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ marginBottom: "5px" }}>
                                          <span style={{ fontWeight: "bold" }}>
                                            Account Type:{" "}
                                          </span>{" "}
                                          {detail.accountType}
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ marginBottom: "5px" }}>
                                          <span style={{ fontWeight: "bold" }}>
                                            Account Balance:{" "}
                                          </span>
                                          ${detail.balance}.00
                                        </p>
                                      </div>
                                    </div>
                                    {index !== item.accounts.length - 1 && (
                                      <hr
                                        style={{ margin: "8px 16px 8px 0" }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>

                              {item.sharedDetails &&
                                item?.sharedDetails?.length != 0 && (
                                  <div style={{ flex: "1" }}>
                                    <h3
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        padding: "0 0 5px 0",
                                      }}
                                    >
                                      Beneficiary Details
                                    </h3>
                                    {item.sharedDetails.map((detail, index) => (
                                      <div key={index}>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <div style={{ marginRight: "20px" }}>
                                            <p style={{ marginBottom: "5px" }}>
                                              <span
                                                style={{ fontWeight: "bold" }}
                                              >
                                                Beneficiary Name:{" "}
                                              </span>
                                              {getBeneficiaryName(
                                                detail.beneficiaryId
                                              )}
                                            </p>
                                          </div>
                                          <div>
                                            <p style={{ marginBottom: "5px" }}>
                                              <span
                                                style={{ fontWeight: "bold" }}
                                              >
                                                Distributed Value:{" "}
                                              </span>{" "}
                                              {detail.distributedType ===
                                              "dollar"
                                                ? `$${detail.distributedValue}.00`
                                                : `${detail.distributedValue}%`}
                                            </p>
                                          </div>
                                          <div>
                                            <p style={{ marginBottom: "5px" }}>
                                              <span
                                                style={{ fontWeight: "bold" }}
                                              >
                                                Distributed Amount:{" "}
                                              </span>
                                              ${detail.distributedAmount}
                                            </p>
                                          </div>
                                        </div>
                                        {index !==
                                          item.sharedDetails.length - 1 && (
                                          <hr style={{ margin: "8px 0" }} />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>

                            <div style={{ marginTop: "20px" }}></div>

                            {index !== bankData.length - 1 && (
                              <hr style={{ margin: "16px 0 8px 0" }} />
                            )}
                          </div>
                        ))}

                        <div
                          style={{
                            padding: "8px 50px",
                            width: "100%",
                            flex: "start",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              padding: 0,
                              marginRight: "8px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                            name="bank"
                            checked={checkedState.bank}
                            onChange={handleCheckboxChange}
                          />
                          <p
                            className="declare"
                            style={{
                              color: "black",
                              fontSize: "14px",
                              backgroundColor: "#e9e9cf",
                              marginLeft: "20px",
                              padding: "0 3px",
                            }}
                          >
                            I{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            >
                              {userDetails.firstName} {userDetails.lastName}
                            </span>{" "}
                            here by declare that the information furnished above
                            is true, complete and correct to the best of my
                            knowledge and belief.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* for jewelries  */}
                    {jewelryData && jewelryData?.length !== 0 && (
                      <div
                        style={{
                          margin: "10px 0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          Jewelries
                        </h2>
                        {jewelryData?.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              // border: "0.5px solid gray",
                              borderRadius: "5px",
                              padding: "0 50px 0 50px",
                              marginTop: "10px",
                              width: "100%",
                              textTransform: "capitalize",
                            }}
                          >
                            <h3 style={{ fontWeight: "bold" }}>
                              {" "}
                              {index + 1}) Jewelry
                            </h3>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ flex: "1", marginRight: "20px" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Owner Name:
                                  </span>{" "}
                                  {item.jewelry.owner}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Jewelry:
                                  </span>{" "}
                                  {getDisplayName(item.jewelry.jewelryName) ===
                                  "Other"
                                    ? item.jewelry.otherJewelryName
                                    : getDisplayName(item.jewelry.jewelryName)}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Jewelry Name
                                  </span>{" "}
                                  {item.jewelry.jewelryCaption}
                                </p>
                              </div>
                              <div style={{ flex: "1" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Carat Value:
                                  </span>{" "}
                                  {getDisplayKeratValue(
                                    item.jewelry.caratValue
                                  )}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Weight(gm):
                                  </span>{" "}
                                  ${item.jewelry.weight}
                                </p>

                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Appraised Value:
                                  </span>{" "}
                                  ${item.jewelry.estimatedValue}.00
                                </p>
                              </div>
                              <div style={{ flex: "1" }}>
                                <h3
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    padding: "0 0 5px 0",
                                  }}
                                >
                                  Beneficiary Details
                                </h3>
                                {item?.sharedDetails &&
                                  item.sharedDetails.map((detail, index) => (
                                    <div key={index}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div style={{ marginRight: "20px" }}>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Beneficiary Name:{" "}
                                            </span>
                                            {getBeneficiaryName(
                                              detail.beneficiaryId
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Value:{" "}
                                            </span>{" "}
                                            {detail.distributedType === "dollar"
                                              ? `$${detail.distributedValue}.00`
                                              : `${detail.distributedValue}%`}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Amount:{" "}
                                            </span>
                                            ${detail.distributedAmount}
                                          </p>
                                        </div>
                                        {index !==
                                          item.sharedDetails.length - 1 && (
                                          <hr style={{ margin: "8px 0" }} />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div style={{ marginTop: "20px" }}></div>

                            {index !== jewelryData?.length - 1 && (
                              <hr style={{ margin: "16px 0 8px 0" }} />
                            )}
                          </div>
                        ))}

                        <div
                          style={{
                            padding: "8px 50px",
                            width: "100%",
                            flex: "start",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              padding: 0,
                              marginRight: "8px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                            name="jewelry"
                            checked={checkedState.jewelry}
                            onChange={handleCheckboxChange}
                          />
                          <p
                            className="declare"
                            style={{
                              color: "black",
                              fontSize: "14px",
                              backgroundColor: "#e9e9cf",
                              marginLeft: "20px",
                              padding: "0 3px",
                            }}
                          >
                            I{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            >
                              {userDetails.firstName} {userDetails.lastName}
                            </span>{" "}
                            here by declare that the information furnished above
                            is true, complete and correct to the best of my
                            knowledge and belief.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* for vehicles  */}
                    {vehicleData && vehicleData?.length !== 0 && (
                      <div
                        style={{
                          margin: "10px 0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          Vehicles
                        </h2>
                        {vehicleData.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              // border: "0.5px solid gray",
                              borderRadius: "5px",
                              padding: "0 50px 0 50px",
                              marginTop: "10px",
                              width: "100%",
                              textTransform: "capitalize",
                            }}
                          >
                            <h3 style={{ fontWeight: "bold" }}>
                              {" "}
                              {index + 1}) Vehicle
                            </h3>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ flex: "1", marginRight: "20px" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Owner Name:
                                  </span>{" "}
                                  {item.vehicle.owner}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Vehicle Type:
                                  </span>{" "}
                                  {item.vehicle.vehicleType}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Vehicle Caption:
                                  </span>{" "}
                                  {item.vehicle.vehicleCaption}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Model:
                                  </span>{" "}
                                  {item.vehicle.model}
                                </p>
                              </div>
                              <div style={{ flex: "1" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Year Manufactured:
                                  </span>{" "}
                                  {item.vehicle.year}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Make:
                                  </span>{" "}
                                  {item.vehicle.make}
                                </p>

                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Miles:
                                  </span>{" "}
                                  {item.vehicle.miles}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Loan:
                                  </span>{" "}
                                  ${item.vehicle.loan}.00
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Estimated Value:
                                  </span>{" "}
                                  ${item.vehicle.estValue}.00
                                </p>
                              </div>
                              <div style={{ flex: "1" }}>
                                <h3
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    padding: "0 0 5px 0",
                                  }}
                                >
                                  Beneficiary Details
                                </h3>
                                {item?.sharedDetails &&
                                  item.sharedDetails.map((detail, index) => (
                                    <div key={index}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div style={{ marginRight: "20px" }}>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Beneficiary Name:{" "}
                                            </span>
                                            {getBeneficiaryName(
                                              detail.beneficiaryId
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Value:{" "}
                                            </span>{" "}
                                            {detail.distributedType === "dollar"
                                              ? `$${detail.distributedValue}.00`
                                              : `${detail.distributedValue}%`}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Amount:{" "}
                                            </span>
                                            ${detail.distributedAmount}
                                          </p>
                                        </div>
                                        {index !==
                                          item.sharedDetails.length - 1 && (
                                          <hr style={{ margin: "8px 0" }} />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div style={{ marginTop: "20px" }}></div>

                            {index !== vehicleData?.length - 1 && (
                              <hr style={{ margin: "16px 0 8px 0" }} />
                            )}
                          </div>
                        ))}
                        <div
                          style={{
                            padding: "8px 50px",
                            width: "100%",
                            flex: "start",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              padding: 0,
                              marginRight: "8px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                            name="vehicle"
                            checked={checkedState.vehicle}
                            onChange={handleCheckboxChange}
                          />
                          <p
                            className="declare"
                            style={{
                              color: "black",
                              fontSize: "14px",
                              backgroundColor: "#e9e9cf",
                              marginLeft: "20px",
                              padding: "0 3px",
                            }}
                          >
                            I{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            >
                              {userDetails.firstName} {userDetails.lastName}
                            </span>{" "}
                            here by declare that the information furnished above
                            is true, complete and correct to the best of my
                            knowledge and belief.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* for investment  */}
                    {investmentData && investmentData?.length !== 0 && (
                      <div
                        style={{
                          margin: "10px 0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          Investments
                        </h2>
                        {investmentData.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              // border: "0.5px solid gray",
                              borderRadius: "5px",
                              padding: "0 50px 0 50px",
                              marginTop: "10px",
                              width: "100%",
                              textTransform: "capitalize",
                            }}
                          >
                            <h3 style={{ fontWeight: "bold" }}>
                              {" "}
                              {index + 1}) Investment
                            </h3>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ flex: "1", marginRight: "20px" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Owner Name:
                                  </span>{" "}
                                  {item.investment.owner}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Investment:
                                  </span>{" "}
                                  {item.investment.investment}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Investment Caption:
                                  </span>{" "}
                                  {item.investment.investmentCaption}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Name of the investment:
                                  </span>{" "}
                                  {item.investment.nameOfTheInvestment}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Total Amount:
                                  </span>{" "}
                                  ${item.investment.totalAmount}
                                </p>
                              </div>

                              <div style={{ flex: "1" }}>
                                <h3
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    padding: "0 0 5px 0",
                                  }}
                                >
                                  Beneficiary Details
                                </h3>
                                {item?.sharedDetails &&
                                  item.sharedDetails.map((detail, index) => (
                                    <div key={index}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div style={{ marginRight: "20px" }}>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Beneficiary Name:{" "}
                                            </span>
                                            {getBeneficiaryName(
                                              detail.beneficiaryId
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Value:{" "}
                                            </span>{" "}
                                            {detail.distributedType === "dollar"
                                              ? `$${detail.distributedValue}.00`
                                              : `${detail.distributedValue}%`}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Amount:{" "}
                                            </span>
                                            ${detail.distributedAmount}
                                          </p>
                                        </div>
                                        {index !==
                                          item.sharedDetails.length - 1 && (
                                          <hr style={{ margin: "8px 0" }} />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div style={{ marginTop: "20px" }}></div>

                            {index !== investmentData?.length - 1 && (
                              <hr style={{ margin: "16px 0 8px 0" }} />
                            )}
                          </div>
                        ))}
                        <div
                          style={{
                            padding: "8px 50px",
                            width: "100%",
                            flex: "start",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              padding: 0,
                              marginRight: "8px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                            name="investment"
                            checked={checkedState.investment}
                            onChange={handleCheckboxChange}
                          />
                          <p
                            className="declare"
                            style={{
                              color: "black",
                              fontSize: "14px",
                              backgroundColor: "#e9e9cf",
                              marginLeft: "20px",
                              padding: "0 3px",
                            }}
                          >
                            I{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            >
                              {userDetails.firstName} {userDetails.lastName}
                            </span>{" "}
                            here by declare that the information furnished above
                            is true, complete and correct to the best of my
                            knowledge and belief.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* for investment  */}
                    {cryptoAssetData && cryptoAssetData?.length !== 0 && (
                      <div
                        style={{
                          margin: "10px 0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          Bit Coins
                        </h2>
                        {cryptoAssetData.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              // border: "0.5px solid gray",
                              borderRadius: "5px",
                              padding: "0 50px 0 50px",
                              marginTop: "10px",
                              width: "100%",
                              textTransform: "capitalize",
                            }}
                          >
                            <h3 style={{ fontWeight: "bold" }}>
                              {" "}
                              {index + 1}) Bit Coin
                            </h3>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ flex: "1", marginRight: "20px" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Owner Name:
                                  </span>{" "}
                                  {item.cryptoAssest.owner}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Coin Name:
                                  </span>{" "}
                                  {item.cryptoAssest.coin}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Exchange:
                                  </span>{" "}
                                  {item.cryptoAssest.exchange}
                                </p>
                              </div>

                              <div style={{ flex: "1" }}>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Wallet:
                                  </span>{" "}
                                  {item.cryptoAssest.wallet}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Quantity:
                                  </span>{" "}
                                  {item.cryptoAssest.quantity}
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Estimated Value:
                                  </span>{" "}
                                  ${item.cryptoAssest.estValue}.00
                                </p>
                                <p style={{ marginBottom: "5px" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Bit Coin Caption:
                                  </span>{" "}
                                  {item.cryptoAssest.cryptoCaption}
                                </p>
                              </div>

                              <div style={{ flex: "1" }}>
                                <h3
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    padding: "0 0 5px 0",
                                  }}
                                >
                                  Beneficiary Details
                                </h3>
                                {item?.sharedDetails &&
                                  item.sharedDetails.map((detail, index) => (
                                    <div key={index}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div style={{ marginRight: "20px" }}>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Beneficiary Name:{" "}
                                            </span>
                                            {getBeneficiaryName(
                                              detail.beneficiaryId
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Value:{" "}
                                            </span>{" "}
                                            {detail.distributedType === "dollar"
                                              ? `$${detail.distributedValue}.00`
                                              : `${detail.distributedValue}%`}
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ marginBottom: "5px" }}>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Distributed Amount:{" "}
                                            </span>
                                            ${detail.distributedAmount}
                                          </p>
                                        </div>
                                        {index !==
                                          item.sharedDetails.length - 1 && (
                                          <hr style={{ margin: "8px 0" }} />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div style={{ marginTop: "20px" }}></div>

                            {index !== cryptoAssetData?.length - 1 && (
                              <hr style={{ margin: "16px 0 8px 0" }} />
                            )}
                          </div>
                        ))}
                        <div
                          style={{
                            padding: "8px 50px",
                            width: "100%",
                            flex: "start",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              padding: 0,
                              marginRight: "8px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                            name="crypto"
                            checked={checkedState.crypto}
                            onChange={handleCheckboxChange}
                          />
                          <p
                            className="declare"
                            style={{
                              color: "black",
                              fontSize: "14px",
                              backgroundColor: "#e9e9cf",
                              marginLeft: "20px",
                              padding: "0 3px",
                            }}
                          >
                            I{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            >
                              {userDetails.firstName} {userDetails.lastName}
                            </span>{" "}
                            here by declare that the information furnished above
                            is true, complete and correct to the best of my
                            knowledge and belief.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* declaration  */}
                    <div
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        padding: "4px 50px",
                      }}
                    >
                      {/* <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <h4 style={{ padding: 0, marginRight: "10px" }}>
                          Declaration:
                        </h4>
                        <input
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                          }}
                          type="text"
                          name=""
                          id=""
                        />
                      </div> */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <h4 style={{ padding: 0, marginRight: "10px" }}>
                            Date:
                          </h4>
                          <h4 style={{ padding: 0 }}>{date}</h4>
                        </div>
                        {/* <div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <h4 style={{ padding: 0, marginRight: "10px" }}>
                              Signature:
                            </h4>
                            {filePreview === null && (
                              <label
                                htmlFor="fileInput"
                                style={{
                                  display: "inline-block",
                                  padding: "3px 8px",
                                  cursor: "pointer",
                                  backgroundColor: "#007bff",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontSize: "14px",
                                  transition: "background-color 0.3s ease",
                                }}
                              >
                                Choose a file
                              </label>
                            )}
                            <input
                              type="file"
                              id="fileInput"
                              name="file"
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#555",
                              }}
                            >
                              {filePreview && (
                                <div
                                  className="image-preview-container"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={() =>
                                    (document.getElementById(
                                      "removeButton"
                                    ).style.display = "block")
                                  }
                                  onMouseLeave={() =>
                                    (document.getElementById(
                                      "removeButton"
                                    ).style.display = "none")
                                  }
                                >
                                  <img
                                    src={filePreview}
                                    alt="Preview"
                                    style={{
                                      width: "120px",
                                      height: "40px",
                                    }}
                                  />
                                  <div
                                    id="removeButton"
                                    className="cross_button"
                                    style={{
                                      display: "none",
                                      width: "24px",
                                      alignItems: "center",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    <button
                                      className="cross_button_main"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage();
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div> */}

                        {/* <div>
                          <h1>Sign Below</h1>
                          <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{
                              width: 500,
                              height: 200,
                              className: "sigCanvas",
                            }}
                          />
                          <button onClick={clear}>Clear</button>
                          <button onClick={save}>Save</button>
                        </div> */}

                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            <h4 style={{ padding: "0", marginRight: "10px" }}>
                              Signature:
                            </h4>
                          </div>
                          <div>
                            {!(
                              savedDrawSignature ||
                              savedUploadSignature ||
                              savedTypeSignature
                            ) && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "8px",
                                  gap: "5px",
                                }}
                              >
                                <button
                                  style={{
                                    padding: "2px 10px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={() => setMode("draw")}
                                >
                                  Draw
                                </button>
                                <button
                                  style={{
                                    padding: "2px 10px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={() => setMode("type")}
                                >
                                  Type
                                </button>
                                <button
                                  style={{
                                    padding: "2px 10px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={() => setMode("upload")}
                                >
                                  Upload
                                </button>
                              </div>
                            )}

                            {mode === "draw" && !savedDrawSignature && (
                              <SignatureCanvas
                                ref={sigCanvas}
                                penColor="black"
                                canvasProps={{
                                  width: 500,
                                  height: 200,
                                  className: "sigCanvas",
                                }}
                              />
                            )}

                            {mode === "type" && !savedTypeSignature && (
                              <input
                                type="text"
                                value={typedSignature}
                                onChange={(e) =>
                                  setTypedSignature(e.target.value)
                                }
                                placeholder="Type your signature"
                              />
                            )}

                            {mode === "upload" && !savedUploadSignature && (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                            )}

                            {(savedDrawSignature ||
                              savedUploadSignature ||
                              savedTypeSignature) && (
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#555",
                                }}
                              >
                                {savedDrawSignature && (
                                  <div
                                    className="image-preview-container"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                    onMouseEnter={() =>
                                      (document.getElementById(
                                        "removeButton"
                                      ).style.display = "block")
                                    }
                                    onMouseLeave={() =>
                                      (document.getElementById(
                                        "removeButton"
                                      ).style.display = "none")
                                    }
                                  >
                                    <img
                                      src={savedDrawSignature}
                                      alt="Preview"
                                      style={{
                                        width: "120px",
                                        height: "40px",
                                      }}
                                    />
                                    <div
                                      id="removeButton"
                                      className="cross_button"
                                      style={{
                                        display: "none",
                                        width: "24px",
                                        alignItems: "center",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <button
                                        className="cross_button_main"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          clear();
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faTimes} />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {savedTypeSignature && (
                                  <div
                                    className="image-preview-container"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                    onMouseEnter={() =>
                                      (document.getElementById(
                                        "removeButton"
                                      ).style.display = "block")
                                    }
                                    onMouseLeave={() =>
                                      (document.getElementById(
                                        "removeButton"
                                      ).style.display = "none")
                                    }
                                  >
                                    <h4 style={{ padding: 0 }}>
                                      {savedTypeSignature}
                                    </h4>
                                    <div
                                      id="removeButton"
                                      className="cross_button"
                                      style={{
                                        display: "none",
                                        width: "24px",
                                        alignItems: "center",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <button
                                        className="cross_button_main"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          clear();
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faTimes} />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {savedUploadSignature && (
                                  <div
                                    className="image-preview-container"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                    onMouseEnter={() =>
                                      (document.getElementById(
                                        "removeButton"
                                      ).style.display = "block")
                                    }
                                    onMouseLeave={() =>
                                      (document.getElementById(
                                        "removeButton"
                                      ).style.display = "none")
                                    }
                                  >
                                    <img
                                      src={savedUploadSignature}
                                      alt="Preview"
                                      style={{
                                        width: "120px",
                                        height: "40px",
                                      }}
                                    />

                                    <div
                                      id="removeButton"
                                      className="cross_button"
                                      style={{
                                        display: "none",
                                        width: "24px",
                                        alignItems: "center",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <button
                                        className="cross_button_main"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          clear();
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faTimes} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                <p style={{ fontSize: "10px", color: "black" }}>
                                  {uuid}
                                </p>
                                <p
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    lineHeight: "1",
                                  }}
                                >
                                  {currentTime.toLocaleTimeString()}
                                </p>
                              </div>
                            )}

                            {!(
                              savedDrawSignature ||
                              savedUploadSignature ||
                              savedTypeSignature
                            ) && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginTop: "8px",
                                }}
                              >
                                <button
                                  style={{
                                    padding: "2px 10px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={clear}
                                >
                                  Clear
                                </button>
                                <button
                                  style={{
                                    padding: "2px 10px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={save}
                                >
                                  Save
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* {pdfDataUri && (style={{padding: "2px 10px", borderRadius: "4px"}}
                    <div>
                      <h2>Generated PDF Data URI:</h2>
                      <textarea
                        value={pdfDataUri}
                        readOnly
                        style={{ width: "100%", height: "200px" }}
                      />
                      <button onClick={convertDataUriToPdf}>View PDF</button>
                    </div>
                  )} */}
                  </div>
                  {error && (
                    <Typography sx={{ textAlign: "center" }} color="error">
                      {error}
                    </Typography>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      className="agree_continue_btn"
                      onClick={generatePdf}
                    >
                      Agree & Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {attorneyPopup && (
        <div
          className="beneficiary-popup"
          data-aos="fade-up"
          data-aos-offset="200"
          data-aos-delay="50"
          data-aos-duration="1000"
        >
          <div className="beneficiary-content">
            {attorneyPopup && (
              <AttorneyDetail handleBack={handleBack} pdfDataUri={pdfDataUri} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default GenerateWill;
