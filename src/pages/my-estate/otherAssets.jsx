import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
} from "reactstrap";
import {
  faDownload,
  faLocationDot,
  faMinus,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField, TextareaAutosize, Tooltip } from "@mui/material";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import "../../css/myestare.css";
import Deletebutton from "./Deletebutton";
import UpdateButton from "./UpdateButton";

import { toast } from "react-toastify";
import "../../css/formPOPup.css";
import {
  deleteOtherAsset,
  getOtherAsset,
  otherAsset,
} from "../../services/OtherAssetService";
import {
  deleteSingleProperty,
  downloadDocument1,
  getBeneficiary,
  getToken,
  getUser,
} from "../../services/user-service";

function OtherAssets() {
  // set Add data
  const [data, setData] = useState({
    otherAsset: {
      assetCaption: "",
      assetValue: "",
      otherAssets1: "",
      otherAssets2: "",
      otherAssets3: "",
      otherAssets4: "",
      otherAssets5: "",
      notes: "",
    },
    sharedDetails: [
      {
        distributedType: "",
        distributedValue: "",
        distributedAmount: "",
        beneficiaryId: "",
      },
    ],
  });
  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      otherAsset: {
        ...prevData.otherAsset,
        [field]: newValue,
      },
    }));
    // setEstimatedTotalAmount(data.realEstate.estPropertyVal);
    setEstimatedTotalAmount(data.otherAsset.assetValue);
  };

  // Handle image
  const handleImageChange = (event) => {
    const selectedFiles = event.target.files;
    const allowedExtensions = ["pdf"];

    if (selectedFiles) {
      const selectedFilesArray = Array.from(selectedFiles);

      // Check each file's extension
      const invalidFiles = selectedFilesArray.filter((file) => {
        const fileNameParts = file.name.split(".");
        const fileExtension =
          fileNameParts[fileNameParts.length - 1].toLowerCase();
        return !allowedExtensions.includes(fileExtension);
      });

      if (invalidFiles.length === 0) {
        const formData = new FormData();

        selectedFilesArray.forEach((file, index) => {
          formData.append(`file${index + 1}`, file);
        });

        // Set the selected image state with the array of files
        setSelectedImage(selectedFilesArray);

        // Now, you can use the formData object to send files to the API
        // Example:
        // apiCall(formData);
      } else {
        // Handle invalid file extensions
        const invalidExtensions = invalidFiles
          .map((file) => file.name.split(".").pop())
          .join(", ");
        toast.error(
          `Invalid file extensions: ${invalidExtensions}. Please select valid document formats.`,
          {
            position: toast.POSITION.BOTTOM_CENTER,
          }
        );
        event.target.value = ""; // Clear the input field
      }
    }
  };

  const resetForm = () => {
    setIsTextFieldClicked(false);
    setData({
      otherAsset: {
        assetCaption: "",
        assetValue: "",
        otherAssets1: "",
        otherAssets2: "",
        otherAssets3: "",
        otherAssets4: "",
        otherAssets5: "",
        notes: "",
      },
      sharedDetails: [
        {
          distributedType: "",
          distributedValue: "",
          distributedAmount: "",
          beneficiaryId: "",
        },
      ],
    });
  };

  // Set the form
  const OtherAssestForm = (event) => {
    event.preventDefault();
    console.log(data);
    toggle();
    let token = "Bearer " + getToken();

    if (data.otherAssets1 === "") {
      // console.log("Error log");
      toast.error("Please fill all required feilds.");
      return;
    }
    //create form data to send a file and remaining class data
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }
    formData.append("data", JSON.stringify(data));

    otherAsset(formData, token)
      .then((resp) => {
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        AddCard();
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleRemove = (id, idType) => {
    if (idType === "otherAssetId") {
      deleteOtherAsset(id)
        .then((res) => {
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          AddCard();
          setShow1(false);
        })
        .catch((error) => {
          // console.log("Note Deleted " + error);
        });
    } else {
      deleteSingleProperty(id)
        .then((res) => {
          setBeneficiaryVisible(!beneficiaryVisible);
          setShow1(false);
          AddCard();
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        })
        .catch((error) => {
          // console.log("Note Deleted " + error);
        });
    }
  };

  const handleDownload = (id, fileName) => {
    let myarry = fileName.split(".");

    downloadDocument1(id)
      .then((response) => {
        console.log("files in downlaod", response);
        const downloadUrl = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${myarry[0]}.${myarry[1]}`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {});
  };

  const [show, setShow] = useState(true);

  const [otherAssets, setOtherAssets] = useState([{ name: "", notes: "" }]);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  const otherAssetss = [0, 1, 2, 3, 4];
  const handleAddColumn = () => {
    if (visibleColumnIndex < 4) {
      setOtherAssets([
        ...otherAssets,
        { name: "", notes: "", label: visibleColumnIndex + 1 },
      ]);
      setVisibleColumnIndex(visibleColumnIndex + 1);
    }
  };

  const handleRemoveColumn = (indexToRemove) => {
    if (otherAssets.length > 0) {
      // Create a copy of the otherAssets array
      const updatedAssets = [...otherAssets];
      // Remove the last element
      updatedAssets.pop();
      // Update the state with the modified array
      setOtherAssets(updatedAssets);

      // Update visibleColumnIndex if necessary
      if (visibleColumnIndex > 0) {
        setVisibleColumnIndex(visibleColumnIndex - 1);
      }
    }
    setData((prevData) => {
      const updatedOtherAsset = { ...prevData.otherAsset };

      // Reset the value of the field corresponding to the removed column to an empty string
      for (let i = 1; i <= visibleColumnIndex + 1; i++) {
        const fieldKey = `otherAssets${i + 1}`;
        if (indexToRemove === i) {
          updatedOtherAsset[fieldKey] = ""; // Reset the field value to an empty string
        }
      }

      // Return the updated state with the modified otherAsset object
      return {
        ...prevData,
        otherAsset: updatedOtherAsset,
      };
    });
  };

  // const handleRemoveColumn = (index) => {
  //   if (!data[`otherAssets${index + 1}`]) {
  //     const updatedDivs = [...visibleDivs];
  //     updatedDivs[index] = false;
  //     setVisibleDivs(updatedDivs);
  //   }

  //   // Reset the input value
  //   setData((prevData) => ({
  //     ...prevData,
  //     [`otherAssets${index + 1}`]: "",
  //   }));
  // };

  // show notes popup
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const handleOpenPopup = (note) => {
    setSelectedNote(note);
    setPopupVisible(true);
  };

  // for multiple download
  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");

  const handleShowDownlaod = (showDetail) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
  };

  let [form1, setForm1] = useState(false);

  const toggle = () => {
    setForm1(!form1);
    resetForm();
  };

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    getOtherAsset(token, userId)
      .then((res) => {
        setCard(res);
      })
      .catch((error) => {
        setCard([]);
        console.error(error); // Changed to console.error for better visibility of errors
      });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow1(true);
  };

  // beneficiary addition in form
  const [beneficiary, setBenificiary] = useState([]);

  const getBenificiarydata = () => {
    let userId = getUser().id;

    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => {});
  };

  // for add field pop
  let [showAdditionField, SetshowAdditionField] = useState(false);
  // for assests show
  let [showAssets, SetshowAssets] = useState(false);

  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

  //
  // let [show1, setShow1] = useState(false);
  const [benevisible, setbeneVisible] = useState(false);
  const [distributionType, setDistributionType] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [beneficiaryVisible, setBeneficiaryVisible] = useState(false);

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setEstimatedTotalAmount(data.otherAsset.assetValue);
    data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
  };

  const handleDistributionTypeChange = (event) => {
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributionType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;
    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", value: "" },
      });
    }
  };

  const handleBeneficiaryClose = (beneficiary) => {
    const updatedBeneficiaries = selectedBeneficiaries.filter(
      (b) => b !== beneficiary
    );
    setSelectedBeneficiaries(updatedBeneficiaries);
    const updatedDetails = { ...beneficiaryDetails };
    delete updatedDetails[beneficiary];
    setBeneficiaryDetails(updatedDetails);
  };

  const getBenificiaryName = (id) => {
    console.log("getBenificiaryName id : ", id);
    var foundBenificiary = null;
    if (id.beneficiary === undefined) {
      console.log("IF condition");
      foundBenificiary = beneficiary.find((b) => b.id === parseInt(id));
    } else {
      foundBenificiary = beneficiary.find(
        (b) => b.id === parseInt(id.beneficiary)
      );
    }
    console.log("foundBenificiary details : ", foundBenificiary);
    if (foundBenificiary) {
      return `${foundBenificiary.firstName} ${foundBenificiary.lastName}`;
    } else {
      return "Benificiary not found"; // Or handle the case where beneficiary with the given ID isn't found
    }
  };

  const handleFieldChange = (beneficiary, field, value) => {
    if (!estimatedTotalAmount || parseFloat(estimatedTotalAmount) === 0) {
      toast.error(
        "Please provide a valid estimated value before adding percentages!"
      );
      return;
    }
    let updatedDetails = { ...beneficiaryDetails };
    if (/^\d*$/.test(value)) {
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };
    }
    let totalPercentage = 0;
    let totalValue = 0;
    Object.keys(updatedDetails).forEach((key) => {
      const beneficiaryPercentage = parseFloat(updatedDetails[key]?.percentage);
      const beneficiaryValue = parseFloat(updatedDetails[key]?.value);
      if (!isNaN(beneficiaryPercentage) && beneficiaryPercentage >= 0) {
        totalPercentage += beneficiaryPercentage;
      }
      if (!isNaN(beneficiaryValue) && beneficiaryValue >= 0) {
        totalValue += beneficiaryValue;
      }
    });
    if (
      totalPercentage > 100 ||
      totalValue > parseFloat(estimatedTotalAmount)
    ) {
      updatedDetails[beneficiary][field] = "";
      toast.error(
        "Total percentage exceeds 100% or total value exceeds estimated value!"
      );
    } else {
      setBeneficiaryDetails(updatedDetails);
    }
  };

  const calculateDistributedAmount = (
    distributionType,
    balance,
    beneficiaryDetail
  ) => {
    if (distributionType === "percentage") {
      return (
        (parseFloat(balance) * parseFloat(beneficiaryDetail?.percentage || 0)) /
        100
      ).toFixed(2);
    } else if (distributionType === "dollar") {
      return parseFloat(beneficiaryDetail?.value || 0).toFixed(2);
    }
    return "0.00";
  };

  const handleSave = () => {
    toast.success("Saved successfully!");
    setbeneVisible(false);
    var i = 0;
    Object.keys(beneficiaryDetails).forEach((key) => {
      const beneficiaryPercentage = parseFloat(
        beneficiaryDetails[key]?.percentage
      );
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.value);

      if (!isNaN(beneficiaryPercentage) && beneficiaryPercentage >= 0) {
        const distributedAmount = calculateDistributedAmount(
          "percentage",
          estimatedTotalAmount,
          beneficiaryDetails[key]
        );
        handleChanges2(
          "percentage",
          beneficiaryPercentage,
          distributedAmount,
          parseInt(key),
          i
        );
        i += 1;
      }

      if (!isNaN(beneficiaryValue) && beneficiaryValue >= 0) {
        const distributedAmount = calculateDistributedAmount(
          "dollar",
          estimatedTotalAmount,
          beneficiaryDetails[key]
        );
        handleChanges2(
          "dollar",
          beneficiaryValue,
          distributedAmount,
          parseInt(key),
          i
        );
        i += 1;
      }
    });
    // beneficiaryDetails.map(value)
    console.log("beneficiaryDetails data: ", data);
    // const length = data.sharedDetails.length;
    // data.sharedDetails[length] = beneficiaryDetails;
  };

  const handleChanges2 = (t, v, a, b, i) => {
    const updatedSharedDetails = [...data.sharedDetails]; // Create a copy of the sharedDetails array

    // Check if the index i is within the bounds of the array
    // if (i >= 0 && i < updatedSharedDetails.length) {
    // Create a new object to update the specific element at index i
    const updatedElement = {
      ...updatedSharedDetails[i], // Copy existing properties
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };

    updatedSharedDetails[i] = updatedElement; // Update the element at index i
    console.log("updatedSharedDetails[i] : ", updatedSharedDetails[i]);
    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails, // Update the sharedDetails in the state
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleOpenBeneficiary = (showDetail) => {
    setBeneficiaryVisible(true);
  };

  useEffect(() => {
    AddCard();
    getBenificiarydata();
  }, []);

  return (
    <div className={`your-component ${show ? "fade-in-element" : ""}`}>
      <UserBase>
        <div className="mt-5"></div>
        <SideBar>
          <div className="addme">
            <div className="addme_inner">
              <button onClick={() => toggle()}>Add New Assets</button>
            </div>
          </div>

          <div className="propCard">
            <div className="propCard-card">
              {card.map((entity) => (
                <div className="propCard-card-body" key={entity.otherAsset.id}>
                  <h5 className="propCard-card-title">
                    {entity.otherAsset.assetCaption}
                  </h5>
                  {/* <p className="propCard-card-text"> {entity.beneficiary}</p> */}
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
              <div className="property_form">
                <Container>
                  <Card color="outline">
                    <CardHeader>
                      <h2 className="form1-heading">Miscellaneous Assets</h2>
                      <div className="Close" onClick={toggle}>
                        <FontAwesomeIcon icon={faXmark} />
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={OtherAssestForm}>
                        <div className="mt-3">
                          <Tooltip title="Enter Heading for other Assets">
                            {/* use text area here  */}
                            <TextField
                              fullWidth
                              type="text"
                              label="Assets Heading"
                              // placeholder="Enter Assets Heading *"
                              id="assetCaption"
                              size="normal"
                              onChange={(e) => handleChanges(e, "assetCaption")}
                              value={data.otherAsset.assetCaption}
                              // InputProps={{
                              //   style: { backgroundColor: '#0051ff23', border: 'none' },
                              // }}
                            />
                          </Tooltip>
                        </div>

                        <div>
                          {otherAssetss.map((index) => (
                            <div
                              key={index}
                              className="mt-3"
                              style={{
                                flexDirection: "row",
                                display:
                                  index <= visibleColumnIndex ? "flex" : "none",
                              }}
                            >
                              <div style={{ width: "100%" }}>
                                <Tooltip
                                  title={
                                    index === 0
                                      ? "Add your Other Assets"
                                      : "Add More On it "
                                  }
                                >
                                  <TextField
                                    required={index === 0}
                                    fullWidth
                                    type="text"
                                    // label={index === 0 ? "Assets" : "Add More "}
                                    label={`Assets ${index + 1}`}
                                    id={`otherAssets${index + 1}`}
                                    size="normal"
                                    onChange={(e) =>
                                      handleChanges(
                                        e,
                                        `otherAssets${index + 1}`
                                      )
                                    }
                                    value={
                                      data.otherAsset[
                                        `otherAssets${index + 1}`
                                      ] || ""
                                    }
                                  />
                                </Tooltip>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-end",
                                }}
                              >
                                {index !== 0 && ( // Render minus button for indexes other than 0
                                  <Button
                                    style={{
                                      height: "30px",
                                      width: "30px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderRadius: "50%",
                                      backgroundColor: "#ff4a4a",
                                      border: "none",
                                      marginLeft: "5px",
                                    }}
                                    onClick={() => handleRemoveColumn(index)}
                                  >
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          {visibleColumnIndex < 4 && (
                            <div
                              style={{
                                marginTop: "7px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "50%",
                                  backgroundColor: "#4aafff",
                                  border: "none",
                                }}
                                onClick={handleAddColumn}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <Tooltip title="Enter value for other Assets">
                            {/* use text area here  */}
                            <TextField
                              fullWidth
                              type="text"
                              label="Assets Value"
                              id="assetValue"
                              size="normal"
                              required
                              onChange={(e) => handleChanges(e, "assetValue")}
                              value={data.otherAsset.assetValue}
                              onClick={() => setIsTextFieldClicked(true)}
                              InputProps={{
                                startAdornment: isTextFieldClicked ? (
                                  <div>$</div>
                                ) : null,
                              }}
                            />
                          </Tooltip>
                        </div>

                        <div className="mt-3">
                          <Tooltip title="Add your income related file">
                            <div>
                              <label
                                style={{
                                  display: "block",
                                  marginBottom: "5px",
                                }}
                              >
                                Supporting Document<span></span>
                              </label>
                              <input
                                style={{
                                  border: "solid 1px lightgray",
                                  borderLeft: "none",
                                  width: "100%",
                                  borderRadius: "5px",
                                }}
                                type="file"
                                name="myfile"
                                id="exampleFile"
                                onChange={(e) => handleImageChange(e)}
                                multiple
                                accept=".pdf"
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div
                          className="bene-select mt-3"
                          onClick={handleShowBeneficiary}
                          style={{ cursor: "pointer" }}
                        >
                          Select Your Beneficiary
                        </div>

                        <div className="mt-3">
                          <Tooltip title="Enter notes for your income">
                            {/* use text area here  */}
                            <TextareaAutosize
                              style={{
                                width: "100%",
                                maxHeight: 250,
                                height: "100%",
                                border: "solid 1px lightgray",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                color: "black",
                              }}
                              placeholder="Notes"
                              id="notes"
                              onChange={(e) => handleChanges(e, "notes")}
                              value={data.otherAsset.notes}
                            />
                          </Tooltip>
                        </div>

                        {/* adding new field */}
                        {/* <div style={{ marginTop: "7px", display: "flex", alignItems: "center" }}>
                          <Button style={{
                            height: "30px",
                            width: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "50%",
                            backgroundColor: "#4aafff",
                            border: "none"
                          }}
                            onClick={handleAddField}>
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          Add New Field
                        </div>
                        <div style={{ width: "99.5%" }}>
                          {addField.map((index) => (
                            <div className="mt-2" key={index} style={{ flexDirection: "row", display: index < visibleField ? "flex" : "none", }}>
                              <div style={{ width: "97%" }}>
                                <Tooltip title={`Add New Field ${index + 1}`}>
                                  <TextField
                                    fullWidth
                                    type="text"
                                    label={`New Field ${index + 1}`}
                                    id={`addfield${index + 1}`}
                                    size="normal"
                                    onChange={(e) => handleChanges(e, `addfield${index + 1}`)}
                                    value={data[`addfield${index + 1}`] || ''}

                                    className="AddField"
                                  />
                                </Tooltip>
                              </div>
                              <span className="addFieldClose" onClick={() => setVisibleField(visibleField - 1)} style={{ width: "2%", paddingLeft: "5px" }}><FontAwesomeIcon icon={faXmark} /></span>
                            </div>
                          ))}

                        </div> */}

                        <Container className="text-center">
                          <Button
                            onClick={resetForm}
                            color="warning"
                            className="my-estate-add-btn"
                            outline
                          >
                            Clear
                          </Button>
                          <Button
                            color="success"
                            outline
                            className="my-estate-add-btn"
                          >
                            Add
                          </Button>
                        </Container>
                      </Form>
                    </CardBody>
                  </Card>
                </Container>
              </div>
            </div>
          )}

          {show1 && Object.keys(showDetail).length > 0 && (
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
                        <span>{showDetail.otherAsset.otherAssets1}</span>
                      </p>
                      <div className="row1-button">
                        <div>
                          {showDetail.documents &&
                            showDetail.documents.length > 0 && (
                              <Tooltip title="click to see multiple downlaod files">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(showDetail);
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
                                URL={"../my-estate/otherAsset/"}
                                id={showDetail.otherAsset.id}
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetail.otherAsset.id}
                            idType="otherAssetId"
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
                          Assets Value:{" "}
                          <code>${showDetail.otherAsset.assetValue}</code>
                        </p>
                        <p>
                          Assets:{" "}
                          <code>{showDetail.otherAsset.otherAssets1}</code>
                        </p>
                        <Tooltip title={`Click To See Details`}>
                          <p
                            onClick={() => {
                              SetshowAssets(showDetail);
                            }}
                          >
                            Other Assets: &nbsp;
                            <code>
                              {showDetail && showDetail.otherAsset.otherAssets1
                                ? showDetail.otherAsset.otherAssets1.slice(0, 5)
                                : ""}
                              ...<span className="readmore">read more</span>
                            </code>
                          </p>
                        </Tooltip>

                        {showDetail.benificiary && (
                          <p>
                            Beneficiary Name:{" "}
                            <code>{showDetail.benificiary}</code>
                          </p>
                        )}

                        {/* <p style={{ display: "flex" }}>Download The Document:
                          <Tooltip title="Click Here To Downlaod The Document  ">
                            <div
                              //  value = {showDetail.user.id}
                              style={{ cursor: "pointer" }}
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
                      </div>

                      <div className="col2">
                        <p>
                          Assets Caption:{" "}
                          <code>{showDetail.otherAsset.assetCaption}</code>
                        </p>

                        {showDetail.addfield1 && (
                          <Tooltip title={`Click To See Details`}>
                            <p
                              onClick={() => {
                                SetshowAdditionField(showDetail);
                                setShow1(!show1);
                              }}
                            >
                              Additional Fields:
                              <code>
                                {showDetail && showDetail.addfield1
                                  ? showDetail.addfield1.slice(0, 5)
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}

                        {showDetail.sharedDetails[0] && (
                          <p
                            onClick={() => {
                              handleOpenBeneficiary(showDetail);
                              setShow1(false);
                            }}
                          >
                            Beneficiary Details{" "}
                            <code>
                              <span className="readmore">Click Here</span>
                            </code>
                          </p>
                        )}

                        {showDetail.otherAsset.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(showDetail.otherAsset.notes);
                                setShow1(!show1);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {" "}
                                {showDetail && showDetail.otherAsset.notes
                                  ? showDetail.otherAsset.notes.slice(0, 5)
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

          {/* <div className="property_table" style={{ display: "none" }}>
            <Container className="myestate-container">
              <Paper sx={{ width: "100%", overflow: "hidden", border: "1px solid #cbcbcb", padding: "0px 10px" }}>
                <TableContainer sx={{ maxHeight: "580px" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            className="myestate-table-header"
                            key={column.id}
                            align={column.align}
                            style={column.style}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {category
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-2}
                              key={row.code}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format === "button" ? (
                                      <Button
                                        className="myestate_view_btn"
                                        onClick={() => {
                                          handleDownload(row.name);
                                        }}
                                      >
                                        View
                                      </Button>
                                    ) : column.format === "action" ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <UpdateButton
                                          URL={"../my-estate/otherAsset/"}
                                          id={row.otherAssets_Id}
                                        />
                                        <Deletebutton
                                          handleRemove={handleRemove}
                                          Id={row.otherAssets_Id}
                                        />
                                      </div>
                                    ) : column.format === "shortText" ? (
                                      // Display limited text with popup
                                      <Tooltip title="click here to read more ">
                                        <div
                                          style={{ cursor: "pointer", color: value ? "black" : "red" }}
                                          onClick={() => {
                                            if (value) {
                                              handleOpenPopup(value);
                                            }
                                          }}
                                        >
                                          {value ? (value.slice(0, 10) + (value.length > 10 ? "..." : "")) : "Incomplete"}
                                        </div>
                                      </Tooltip>
                                    ) : (
                                      value
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={category.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Container>
          </div> */}

          {/*  download popup */}
          {popupVisibleDownlaod && (
            // Popup div

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
                          setPopupVisibleDownlaod(false);
                          setShow(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div style={{ marginBottom: "20px" }}>
                      <Tooltip title={selectedDownlaod.name}>
                        <div
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            gap: "20px",
                          }}
                          onClick={() => {
                            handleDownload(selectedDownlaod.name, 0);
                          }}
                        >
                          Downlaod - 1
                          <div className="myestate_download_button dwnbtn">
                            <FontAwesomeIcon
                              className="myestate_download_icon"
                              icon={faDownload}
                            />
                            <span>{selectedDownlaod.name}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </div>

                    {selectedDownlaod.name1 && (
                      <div style={{ marginBottom: "20px" }}>
                        <Tooltip title={selectedDownlaod.name1}>
                          <div
                            //  value = {showDetail.user.id}
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              gap: "20px",
                            }}
                            onClick={() => {
                              handleDownload(selectedDownlaod.name1, 1);
                            }}
                          >
                            Downlaod - 2
                            <div className="myestate_download_button dwnbtn">
                              <FontAwesomeIcon
                                className="myestate_download_icon"
                                icon={faDownload}
                              />
                              <span>{selectedDownlaod.name1}</span>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    )}

                    {selectedDownlaod.name2 && (
                      <div style={{ marginBottom: "20px" }}>
                        <Tooltip title={selectedDownlaod.name2}>
                          <div
                            //  value = {showDetail.user.id}
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              gap: "20px",
                            }}
                            onClick={() => {
                              handleDownload(selectedDownlaod.name2, 2);
                            }}
                          >
                            Download - 3
                            <div className="myestate_download_button dwnbtn">
                              <FontAwesomeIcon
                                className="myestate_download_icon"
                                icon={faDownload}
                              />
                              <span>{selectedDownlaod.name2}</span>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    )}

                    {selectedDownlaod.name3 && (
                      <div style={{ marginBottom: "20px" }}>
                        <Tooltip title={selectedDownlaod.name3}>
                          <div
                            //  value = {showDetail.user.id}
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              gap: "20px",
                            }}
                            onClick={() => {
                              handleDownload(selectedDownlaod.name3, 3);
                            }}
                          >
                            Download - 4
                            <div className="myestate_download_button dwnbtn">
                              <FontAwesomeIcon
                                className="myestate_download_icon"
                                icon={faDownload}
                              />
                              <span>{selectedDownlaod.name3}</span>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    )}

                    {selectedDownlaod.name4 && (
                      <div style={{ marginBottom: "20px" }}>
                        <Tooltip title={selectedDownlaod.name4}>
                          <div
                            //  value = {showDetail.user.id}
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              gap: "20px",
                            }}
                            onClick={() => {
                              handleDownload(selectedDownlaod.name4, 4);
                            }}
                          >
                            Downlaod - 5
                            <div className="myestate_download_button dwnbtn">
                              <FontAwesomeIcon
                                className="myestate_download_icon"
                                icon={faDownload}
                              />
                              <span>{selectedDownlaod.name4}</span>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                          setPopupVisible(false);
                          setShow1(!show1);
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

          {showAdditionField && (
            // Display the popup when a row is selected
            <div className="popup">
              <div className="popup-content">
                <div className="note_popup_heading">
                  <div>
                    <h2>All Additional Field</h2>
                  </div>
                  <div>
                    <button
                      className="note_popup_heading_close_btn"
                      onClick={() => {
                        SetshowAdditionField(false);
                        setShow1(!show1);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
                <div className="popup-body">
                  {showAdditionField.addfield1 !== 0 &&
                  showAdditionField.addfield1 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      New Field 1 : {showAdditionField.addfield1}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAdditionField.addfield2 !== 0 &&
                  showAdditionField.addfield2 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      New Field 2 : {showAdditionField.addfield2}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAdditionField.addfield3 !== 0 &&
                  showAdditionField.addfield3 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      New Field 3 : {showAdditionField.addfield3}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAdditionField.addfield4 !== 0 &&
                  showAdditionField.addfield4 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      New Field 4 : {showAdditionField.addfield4}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAdditionField.addfield5 !== 0 &&
                  showAdditionField.addfield5 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      New Field 5 : {showAdditionField.addfield5}
                    </p>
                  ) : (
                    <p></p>
                  )}
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
                  {showAssets.otherAsset.otherAssets1 !== 0 &&
                  showAssets.otherAsset.otherAssets1 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 1 : {showAssets.otherAsset.otherAssets1}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.otherAsset.otherAssets2 !== 0 &&
                  showAssets.otherAsset.otherAssets2 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 2 : {showAssets.otherAsset.otherAssets2}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.otherAsset.otherAssets3 !== 0 &&
                  showAssets.otherAsset.otherAssets3 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 3 : {showAssets.otherAsset.otherAssets3}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.otherAsset.otherAssets4 !== 0 &&
                  showAssets.otherAsset.otherAssets4 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 4 : {showAssets.otherAsset.otherAssets4}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  {showAssets.otherAsset.otherAssets5 !== 0 &&
                  showAssets.otherAsset.otherAssets5 !== "" ? (
                    <p
                      style={{
                        fontWeight: 450,
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      Other Field 5 : {showAssets.otherAsset.otherAssets5}
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
                          setPopupVisibleDownlaod(false);
                          setShow1(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>

                  <div>
                    {selectedDownlaod.documents &&
                      selectedDownlaod.documents.length > 0 &&
                      selectedDownlaod.documents.map((file, index) => (
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
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {benevisible && (
            // beneShow &&
            <div className="popup">
              <div
                className="popup-content popup-content-download"
                style={{
                  minWidth: "350px",
                  width: "100%",
                  maxWidth: "700px",
                }}
              >
                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div className="share_property_heading">
                      <h2>Share Property </h2>
                    </div>
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={handleReset}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                  <div className="share_property_est_value">
                    <p>
                      Estimated Value:{" "}
                      <code style={{ color: "green", fontWeight: "bold" }}>
                        ${estimatedTotalAmount}
                      </code>
                    </p>
                  </div>
                  <div className="BeneficiarySelect">
                    <div className="BeneficiarySelectContainer">
                      <div className="BeneficiarySelectRow">
                        <div className="share_property_Type">
                          <p className="share_property_Type_paragraph">
                            Choose Distribution Type:{" "}
                          </p>
                          <select
                            value={distributionType}
                            onChange={handleDistributionTypeChange}
                            className="share_property_Type_select"
                          >
                            <option value="">Select Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="dollar">Dollar</option>
                          </select>
                        </div>
                        <div className="SelectContainer">
                          <select
                            className="Property-inputfiled"
                            onChange={handleBeneficiarySelection}
                            value=""
                            disabled={!distributionType}
                          >
                            <option value="" disabled hidden>
                              {distributionType
                                ? "Select Your Beneficiary Username"
                                : "Select Type First"}
                            </option>
                            {beneficiary.map((benif) => (
                              <option
                                key={benif.id}
                                value={benif.id}
                                disabled={selectedBeneficiaries.includes(
                                  benif.id
                                )}
                              >
                                {/* {benif.username} */}
                                {`${benif.firstName} ${benif.lastName}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="share_beneficiary_main_card">
                        {selectedBeneficiaries.map((beneficiary) => (
                          <div
                            key={beneficiary}
                            className="share_beneficiary_card"
                          >
                            <div>
                              <p className="share_beneficiary_card_para">
                                Beneficiary:{" "}
                                {getBenificiaryName({ beneficiary })}
                              </p>
                              {distributionType === "percentage" && (
                                <input
                                  type="text"
                                  className="share_ben_percentage"
                                  placeholder="Percentage"
                                  value={
                                    beneficiaryDetails[beneficiary]
                                      ?.percentage || ""
                                  }
                                  onChange={(e) =>
                                    handleFieldChange(
                                      beneficiary,
                                      "percentage",
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                              {distributionType === "dollar" && (
                                <input
                                  type="text"
                                  className="share_ben_percentage"
                                  placeholder="Dollar Value"
                                  value={
                                    beneficiaryDetails[beneficiary]?.value || ""
                                  }
                                  onChange={(e) =>
                                    handleFieldChange(
                                      beneficiary,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                              )}

                              {distributionType && (
                                <p className="share_beneficiary_card_para">
                                  Distributed Value: $
                                  {distributionType === "percentage"
                                    ? calculateDistributedAmount(
                                        "percentage",
                                        estimatedTotalAmount,
                                        beneficiaryDetails[beneficiary]
                                      )
                                    : calculateDistributedAmount(
                                        "dollar",
                                        estimatedTotalAmount,
                                        beneficiaryDetails[beneficiary]
                                      )}
                                </p>
                              )}
                            </div>
                            <div
                              className="share_beneficiary_card_close"
                              onClick={() =>
                                handleBeneficiaryClose(beneficiary)
                              }
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedBeneficiaries.length > 0 && (
                  <button onClick={handleSave}>Save</button>
                )}
              </div>
            </div>
          )}

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
                          setBeneficiaryVisible(false);
                          setShow1(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                  <div>
                    {showDetail.sharedDetails &&
                      showDetail.sharedDetails.map((details, index) => (
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
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SideBar>
      </UserBase>
    </div>
  );
}

export default OtherAssets;