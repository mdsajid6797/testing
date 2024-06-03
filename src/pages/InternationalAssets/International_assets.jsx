import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// country npm package
import { faDownload, faGlobe, faLocationDot, faTimesCircle, faXmark, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Country } from 'country-state-city';
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
import { addInternationalAssest, downloadDocument, getBeneficiary, getInternationalAssest, getToken, getUser, removeInternationalAssest } from "../../services/user-service";
import Deletebutton from "../my-estate/Deletebutton";
import UpdateButton from "../my-estate/UpdateButton";

export function InternationalAssets() {

  //Set data  
  const [data, setData] = useState({
    internationalAsset: {
      assetCaption: "",
      assetType: "",
      countryName: "",
      assetValue: "",
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
  const [selectedImage, setSelectedImage] = useState([]);
  const formatAccountNumber = (number) => {
    if (number != null) {
      return number.replace(/\d(?=\d{4})/g, "*");
    }
  };
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      internationalAsset: {
        ...prevData.internationalAsset,
        [field]: newValue,
      },
    }));
    setEstimatedTotalAmount(data.internationalAsset.assetValue);
  };
  // Handle image
  const handleImageChange = (event) => {
    const selectedFiles = event.target.files;
    const allowedExtensions = ['pdf'];
    if (selectedFiles) {
      const selectedFilesArray = Array.from(selectedFiles);
      // Check each file's extension
      const invalidFiles = selectedFilesArray.filter((file) => {
        const fileNameParts = file.name.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
        return !allowedExtensions.includes(fileExtension);
      });

      if (invalidFiles.length === 0) {
        const formData = new FormData();
        selectedFilesArray.forEach((file, index) => {
          formData.append(`file${index + 1}`, file);
        });
        setSelectedImage(selectedFilesArray);
      } else {
        const invalidExtensions = invalidFiles.map((file) => file.name.split('.').pop()).join(', ');
        toast.error(`Invalid file extensions: ${invalidExtensions}. Please select valid document formats.`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        event.target.value = '';
      }
    }
  };
  const [internationalAssestName, setInternationalAssestName] = React.useState("");
  const InternationaAssestHandleChange = (event) => {
    setInternationalAssestName(event.target.value);
    data.countruy = event.target.value;
  };
  const resetData = () => {
    setData({
      countruy: "",
      assest_name: "",
      assest_value: "",
      assest_note: "",
      assest_file: "",
      benificiary: "",
      addfield1: "",
      addfield2: "",
      addfield3: "",
      addfield4: "",
      addfield5: "",
      assetCaption: ""
    });
    setSelectedImage(null);
    setInternationalAssestName("");
  };
  const InternationalAssestForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    toggle()
    const formData = new FormData();

    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`filename`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i])
    }
    formData.append("data", JSON.stringify(data));
    addInternationalAssest(formData)
      .then((resp) => {
        console.log("this is form data", resp);

        console.log("Success log");
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetData();
        getData();
        AddCard();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  console.log(data);
  //get form
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    getInternationalAssest(token, userId).then((res) => {
      console.log("assest data : ", res);
      setCategory(res);
    });
  };

  const handleRemove = (Id) => {
    let token = "Bearer " + getToken();
    removeInternationalAssest(Id, token)
      .then((res) => {
        toast.success("Deleted successfully...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.log("SuccessFully Deleted " + res);
        getData();
        AddCard();
        setShow1(false);
      })
      .catch((error) => {
        console.log("Note Deleted " + error);
      });
  };

  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken();
    downloadDocument("InternationAssests", fileName, fileNumber)
      .then((response) => {
        console.log("files in downlaod", response)
        const downloadUrl = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${myarry[0]}.${myarry[1]}`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        // Handle the error
      });
  };
  // for multiple download 
  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");
  const handleShowDownlaod = (showDetail) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
  }
  useEffect(() => {
    getData();
  }, []);

  // show notes popup 
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const handleOpenPopup = (note) => {
    setSelectedNote(note);
    setPopupVisible(true);
  };

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  let [form1, setForm1] = useState(false)
  const toggle = () => {
    setForm1(!form1)
  }
  // cards 
  let [card, setCard] = useState([])
  let [showDetail, setShowDetail] = useState([]);
  let [show1, setShow1] = useState(false)

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    getInternationalAssest(token, userId)
      .then((res) => {
        setCard(res);
        console.log("This is card data:", res);
      })
      .catch((error) => {
        toast.error("Card not created!!");
        console.error(error); // Changed to console.error for better visibility of errors
      });
  }
  // showing the details of cards like popup
  const Showdetails = (obj) => {
    setShowDetail(obj)
    setShow1(true)
  }
  useEffect(() => {
    AddCard()
  }, [])
  // beneficiary addition in form 
  const [beneficiary, setBenificiary] = useState([]);
  const getBenificiarydata = () => {
    let userId = getUser().id;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getBenificiarydata();
  }, []);





  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
  };
  const [beneShow, setBeneShow] = useState({})
  const [benevisible, setbeneVisible] = useState(false)
  let [loopForShowingBene1, setLoopForShowingBene1] = useState([])
  const handleOpenPopupforbeni = (showDetail) => {
    setBeneShow(showDetail);
    setbeneVisible(true);
  }
  const [selectedValue, setSelectedValue] = useState('');
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    // setSelectedValue('');
  };
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});

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

  const handleFieldChange = (beneficiary, field, value) => {
    // Check if the estimated value is null or 0
    if (!data.assest_value || parseFloat(data.assest_value) === 0) {
      toast.error("Please provide a valid estimated value before adding percentages!");
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
    // Calculate the total percentage and total value
    let totalPercentage = 0;
    let totalValue = 0;
    Object.keys(updatedDetails).forEach((key) => {
      const beneficiaryPercentage = parseFloat(updatedDetails[key]?.percentage);
      const beneficiaryValue = parseFloat(updatedDetails[key]?.value);

      // Check for valid numbers and add them up
      if (!isNaN(beneficiaryPercentage) && beneficiaryPercentage >= 0) {
        totalPercentage += beneficiaryPercentage;
      }
      if (!isNaN(beneficiaryValue) && beneficiaryValue >= 0) {
        totalValue += beneficiaryValue;
      }
    });

    // If the total percentage exceeds 100 or the total value exceeds the estimated value, handle accordingly
    if (totalPercentage > 100 || totalValue > parseFloat(data.assest_value)) {
      // Reset the current beneficiary's field to prevent exceeding limits
      updatedDetails[beneficiary][field] = "";
      toast.error("Total percentage exceeds 100% or total value exceeds estimated value!");
    } else {
      // Update state with the new beneficiary details
      setBeneficiaryDetails(updatedDetails);
    }
  };
  const [distributionType, setDistributionType] = useState(""); // State to store distribution type
  // Function to handle the change in distribution type
  const handleDistributionTypeChange = (event) => {
    const newType = event.target.value;

    // Reset distributed values for all beneficiaries
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });

    setDistributionType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  return (
    <div className={`your-component ${show ? "fade-in-element" : ""}`}>
      <UserBase>
        <div className="mt-5"></div>
        <SideBar>

          <div className="addme">
            <div className="addme_inner">
              <button onClick={() => toggle()} style={{ width: "auto" }}>Add New International Assets</button>
            </div>
          </div>
          <div className="propCard">
            <div class="propCard-card">
              {
                card.map((entity) => (
                  <div className="propCard-card-body" key={entity.id}>
                    <h5 className="propCard-card-title">{entity.assetCaption}</h5>
                    <p className="propCard-card-text"> {entity.countruy}</p>
                    <p className="propCard-card-text viewDetails"><button onClick={() => Showdetails(entity)}>View Details</button></p>
                  </div>
                ))
              }
            </div>
          </div>

          {form1 && (
            <div className="overlay1" style={{ transition: "500ms" }}>
              <div className="property_form">
                <Container style={{ height: "auto", boxSizing: "border-box" }}>
                  <Card color="" outline>
                    <CardHeader>
                      <h3 className="form1-heading">Add International Assets</h3>
                      <div className="Close" onClick={toggle}>
                        <FontAwesomeIcon icon={faXmark} />
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={InternationalAssestForm}>
                        <div className="mt-3">
                          <Tooltip title="Write Caption for your assets">
                            <TextField
                              fullWidth
                              type="text"
                              label="Assets Caption"
                              id="assest_caption"
                              size="normal"
                              onChange={(e) => handleChanges(e, "assetCaption")}
                              value={data.internationalAsset.assetCaption}
                            />
                          </Tooltip>
                        </div>
                        <div className="mt-3">
                          <Tooltip title="Enter the Country of your assets">
                            <FormControl
                              fullWidth
                              sx={{ minWidth: 120 }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-label">
                                Country Name
                              </InputLabel>
                              <Select
                                required
                                labelId="demo-simple-select-label"
                                label="Country Name"
                                id="countruy"
                                onChange={(e) => handleChanges(e, "countryName")}
                              value={data.internationalAsset.countryName}
                              >
                                {
                                  Country.getAllCountries().map((v) => {
                                    return (
                                      <MenuItem value={v.name}>
                                        {v.name}
                                      </MenuItem>
                                    );
                                  })
                                }
                              </Select>
                            </FormControl>
                          </Tooltip>
                        </div>
                        <div className="mt-3">
                          <Tooltip title="Enter the name of your assets">
                            <TextField
                              required
                              fullWidth
                              type="text"
                              label="Type Of Assets"
                              id="assest_name"
                              size="normal"
                              onChange={(e) => handleChanges(e, "assetType")}
                              value={data.internationalAsset.assetType}

                            />
                          </Tooltip>
                        </div>
                        <div className="mt-3">
                          <Tooltip title="Enter the estimated value of your assets ">
                            <TextField
                              fullWidth
                              type="number"
                              placeholder="$"
                              label="Estimated Value"
                              size="normal"
                              id=" assest_value"
                              onChange={(e) => handleChanges(e, "assest_value")}
                              value={data.assest_value}
                              required
                            />
                          </Tooltip>
                        </div>
                        <div className="bene-select mt-3" onClick={handleShowBeneficiary} style={{ cursor: "pointer" }}>
                          Select Your Beneficiary
                        </div>
                        <div className="mt-3">
                          <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "1px" }}>Supporting Document </p>
                          <Tooltip title="Add your International Assets related file">
                            <input
                              multiple
                              style={{
                                border: "solid 1px lightgray",
                                borderLeft: "none",
                                width: "100%",
                                borderRadius: "5px",
                              }}
                              type="file"
                              name="myfile"
                              id="assest_file"
                              onChange={(e) => handleImageChange(e)}
                              accept=".pdf"
                            />
                          </Tooltip>
                        </div>

                        <div className="mt-3">
                          <Tooltip title="Write notes for your assets ">
                            <TextField
                              fullWidth
                              type="text"
                              label="Notes"
                              id="assest_note"
                              size="normal"
                              onChange={(e) => handleChanges(e, "assest_note")}
                              value={data.assest_note}
                            />
                          </Tooltip>
                        </div>
                        <Container className="text-center">
                          <Button
                            className="my-estate-clear-btn"
                            type="reset"
                            onClick={resetData}
                            outline
                          >
                            Clear
                          </Button>
                          <Button outline type="submit" className="my-estate-add-btn">
                            Add
                          </Button>
                        </Container>
                      </Form>
                    </CardBody>
                  </Card>
                </Container>
              </div>
            </div>)}


          {show1 && Object.keys(showDetail).length > 0 && (

            <>
              <div className="card__data" >
                <div className="card__data-container">
                  <section className="section1">
                    <div>
                      <p className="row1-text">
                      <FontAwesomeIcon icon={faGlobe} style={{ color: "#025596", fontSize: "18px" }}/>
                        <span>{showDetail.assest_name}</span>
                      </p>
                      <div className="row1-button" >
                        <div>
                          {
                            showDetail.name && (
                              <Tooltip title="click to see multiple downlaod files">
                                <p
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleShowDownlaod(showDetail)
                                    setShow(false)
                                  }}>
                                  <div className="myestate_download_button dwnbtn">
                                    <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                                    <span></span>
                                  </div>
                                </p>
                              </Tooltip>
                            )
                          }

                        </div>
                        <div>
                          <Tooltip title="Click Here To Edit">
                            <div>
                              <UpdateButton
                                URL={"../my-estate/International_assets/"}
                                id={showDetail.assest_id}
                              />
                            </div>
                          </Tooltip>
                        </div>
                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetail.assest_id}
                          />
                        </div>
                        <div>
                          <span className="card__data-close" onClick={() => { setShow1(!show1) }}>
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section2">
                    <div>
                      <div className="col1">
                        <p>Type Of Assets: <code>{showDetail.assest_name}</code></p>
                        <p>Country: <code>{showDetail.countruy}</code></p>
                        <p>Estimated Value: <code style={{ color: "green", fontWeight: "bold" }}>$ {showDetail.assest_value}</code></p>
                        {showDetail.benificiary && (<p>Beneficiary Name: <code>{showDetail.benificiary}</code></p>
                        )}
                      </div>
                      <div className="col2">
                        {showDetail.benificiary0 && (
                          <Tooltip title="Click to see Benificiary Details">
                            <p onClick={() => { setShow1(!show1); handleOpenPopupforbeni(showDetail) }}>
                              Benificiary Details:&nbsp;
                              <code style={{ color: "skyblue" }}>Click To see</code>
                            </p>
                          </Tooltip>
                        )}
                        <p>Assets Caption: <code>{showDetail.assetCaption}</code></p>
                        {showDetail.assest_note && (
                          <Tooltip title="Click To see Note">
                            <p onClick={() => { handleOpenPopup(showDetail.assest_note); setShow1(!show1) }}>Note:
                              <code>{showDetail && showDetail.assest_note ? showDetail.assest_note.slice(0, 5) : '...'}...<span className="readmore">Read More</span></code>
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
          {popupVisible && (
            // Popup div
            <div className="popup">
              <div className="popup-content">
                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div>
                      <h2>Notes</h2>
                    </div>
                    <div >
                      <button className="note_popup_heading_close_btn" onClick={() => { setPopupVisible(false); setShow1(!show1) }}>
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

          {/*  download popup */}
          {popupVisibleDownlaod && (
            <div className="popup">
              <div className="popup-content popup-content-download">

                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <h2>Download Files</h2>
                    </div>
                    <div >
                      <button className="note_popup_heading_close_btn" onClick={() => { setPopupVisibleDownlaod(false); setShow(true); }}>
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: "20px" }} >
                      <Tooltip title={selectedDownlaod.name}>
                        <div

                          style={{ cursor: "pointer", display: "flex", gap: "20px" }}
                          onClick={() => {
                            handleDownload(selectedDownlaod.name, 0);
                          }}>Downlaod - 1
                          <div className="myestate_download_button dwnbtn">
                            <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                            <span>{selectedDownlaod.name}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </div>

                    {selectedDownlaod.name1 && <div style={{ marginBottom: "20px" }}>
                      <Tooltip title={selectedDownlaod.name1}>
                        <div
                          //  value = {showDetail.user.id}
                          style={{ cursor: "pointer", display: "flex", gap: "20px" }}
                          onClick={() => {
                            handleDownload(selectedDownlaod.name1, 1);
                          }}>Downlaod - 2
                          <div className="myestate_download_button dwnbtn">
                            <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                            <span>{selectedDownlaod.name1}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </div>}
                    {selectedDownlaod.name2 && <div style={{ marginBottom: "20px" }}>
                      <Tooltip title={selectedDownlaod.name2}>
                        <div
                          //  value = {showDetail.user.id}
                          style={{ cursor: "pointer", display: "flex", gap: "20px" }}
                          onClick={() => {
                            handleDownload(selectedDownlaod.name2, 2);
                          }}>Download - 3
                          <div className="myestate_download_button dwnbtn">
                            <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                            <span>{selectedDownlaod.name2}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </div>}


                    {selectedDownlaod.name3 && <div style={{ marginBottom: "20px" }}>
                      <Tooltip title={selectedDownlaod.name3}>
                        <div
                          //  value = {showDetail.user.id}
                          style={{ cursor: "pointer", display: "flex", gap: "20px" }}
                          onClick={() => {
                            handleDownload(selectedDownlaod.name3, 3);
                          }}>Download - 4
                          <div className="myestate_download_button dwnbtn">
                            <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                            <span>{selectedDownlaod.name3}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </div>}
                    {selectedDownlaod.name4 && <div style={{ marginBottom: "20px" }}>
                      <Tooltip title={selectedDownlaod.name4}>
                        <div
                          //  value = {showDetail.user.id}
                          style={{ cursor: "pointer", display: "flex", gap: "20px" }}
                          onClick={() => {
                            handleDownload(selectedDownlaod.name4, 4);
                          }}>Downlaod - 5
                          <div className="myestate_download_button dwnbtn">
                            <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                            <span>{selectedDownlaod.name4}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* show beneficiary card  */}

          {benevisible && beneShow && (
            <div className="popup" >
              <div className="popup-content" style={{
                minWidth: "350px",
                width: "100%",
                maxWidth: "700px"
              }}>
                <div className="note_popup" >
                  <div className="note_popup_heading">
                    <div className="share_property_heading">
                      <h2>Share Property </h2>
                    </div>
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={() => {
                          setbeneVisible(false);
                          setShow1(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                  <div className="share_property_est_value">
                    <p>Estimated Value: <code style={{ color: "green", fontWeight: "bold" }}>${data.assest_value}</code></p>
                  </div>
                  <div className="BeneficiarySelect">
                    <div className="BeneficiarySelectContainer">
                      <div className="BeneficiarySelectRow">
                        <div class="share_property_Type">
                          <p class="share_property_Type_paragraph">Choose Distribution Type: </p>
                          <select value={distributionType} onChange={handleDistributionTypeChange} class="share_property_Type_select">
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
                              {distributionType ? "Select Your Beneficiary Username" : "Select Type First"}
                            </option>
                            {beneficiary.map((benif) => (
                              <option
                                key={benif.username}
                                value={benif.username}
                                disabled={selectedBeneficiaries.includes(benif.username)}
                              >
                                {benif.username}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="share_beneficiary_main_card">
                        {selectedBeneficiaries.map((beneficiary) => (
                          <div key={beneficiary} class="share_beneficiary_card">
                            <div>
                              <p className="share_beneficiary_card_para">Beneficiary: {beneficiary}</p>
                              {distributionType === "percentage" && (
                                <input
                                  type="text"
                                  className="share_ben_percentage"
                                  placeholder="Percentage"
                                  value={beneficiaryDetails[beneficiary]?.percentage || ""}
                                  onChange={(e) =>
                                    handleFieldChange(beneficiary, "percentage", e.target.value)
                                  }
                                />
                              )}
                              {distributionType === "dollar" && (
                                <input
                                  type="text"
                                  className="share_ben_percentage"
                                  placeholder="Dollar Value"
                                  value={beneficiaryDetails[beneficiary]?.value || ""}
                                  onChange={(e) =>
                                    handleFieldChange(beneficiary, "value", e.target.value)
                                  }
                                />
                              )}
                              {distributionType && (
                                <p className="share_beneficiary_card_para">
                                  Distributed Value: $
                                  {distributionType === "percentage"
                                    ? (parseFloat(data.assest_value) * parseFloat(beneficiaryDetails[beneficiary]?.percentage || 0) / 100).toFixed(2)
                                    : parseFloat(beneficiaryDetails[beneficiary]?.value || 0).toFixed(2)}
                                </p>
                              )}
                            </div>
                            <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                              <FontAwesomeIcon icon={faXmark} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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