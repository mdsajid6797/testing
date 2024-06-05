import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "reactstrap";
import {
  deleteSingleProperty,
  downloadDocument1,
  getBeneficiary,
  getSecondaryUser,
  getToken,
  getUser,
} from "../../services/user-service";
//import { Accordion, data , AccordionContext } from "reactstrap";
import { Tooltip } from "@mui/material";

import { FormLabel, Input, Option, Select, Textarea } from "@mui/joy";

import {
  faDownload,
  faHouse,
  faMinus,
  faPlus,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "../../css/myestare.css";
import {
  deleteRealEstate,
  getRealEstates,
  realEstates,
} from "../../services/RealEstate-service";
import "./../../css/formPOPup.css";
import Deletebutton from "./Deletebutton";
import UpdateButton from "./UpdateButton";

function RealEstateContent() {
  // set Add data
  const [data, setData] = useState({
    realEstate: {
      owner: "",
      propertyCaption: "",
      propertyType: "",
      otherPropertyType: "",
      aptNumber: "",
      streetAddress: "",
      estPropertyVal: "",
      zipCode: "",
      country: "",
      propertyTax: "",
      city: "",
      state: "",
      notes: "",
    },
    mortgages: [
      {
        mortgage: "",
        mortgageInstitution: "",
        mortgageNumber: "",
      },
    ],
    sharedDetails: [
      {
        distributedType: "",
        distributedValue: "",
        distributedAmount: "",
        beneficiaryId: "",
      },
    ],
  });

  const [ownerName, setOwnerName] = useState([]);
  const handleChange = (event, newValue, stringValue) => {
    if (stringValue === "propertyType") {
      setData((prevData) => ({
        ...prevData,
        realEstate: {
          ...prevData.realEstate,
          propertyType: newValue,
        },
      }));
    }

    if (stringValue === "owner") {
      // Convert ownerName array to a single string
      const comingValue =
        typeof newValue === "string" ? newValue.split(",") : newValue;
      const ownerString = comingValue.join(", ");

      setData((prevData) => ({
        ...prevData,
        realEstate: {
          ...prevData.realEstate,
          owner: ownerString,
        },
      }));

      // Update the ownerName state afterwards
      setOwnerName(newValue);
    }
  };

  // Define an array to store user names
  const ownerNames = [];

  // Get primaryUser data
  const primaryUserDetails = getUser();
  const primaryUserName =
    primaryUserDetails.firstName + " " + primaryUserDetails.lastName;

  // Get secondaryUser data
  const secondaryUserDetails = getSecondaryUser();
  let secondaryUserName = "";

  // Check if secondary user exists
  if (secondaryUserDetails !== undefined) {
    secondaryUserName =
      secondaryUserDetails.firstName + " " + secondaryUserDetails.lastName;

    // Push both user names into the array
    ownerNames.push(primaryUserName, secondaryUserName);
  } else {
    // If secondary user doesn't exist, only push primary user name
    ownerNames.push(primaryUserName);
  }

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState(null);

  // const [error] = useState({
  //   errors: {},
  //   isError: false,
  // });

  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      realEstate: {
        ...prevData.realEstate,
        [field]: newValue,
      },
    }));
    const totalBalance = data.realEstate.estPropertyVal;
    setEstimatedTotalAmount(totalBalance);
  };
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
        setSelectedImage(selectedFilesArray);
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
    setIsTextFieldClicked2(false);
    setIsTextFieldClicked3(false);
    setVisibleColumnIndex(0);

    setData({
      realEstate: {
        owner: "",
        propertyCaption: "",
        propertyType: "",
        otherPropertyType: "",
        aptNumber: "",
        streetAddress: "",
        estPropertyVal: "",
        zipCode: "",
        country: "",
        propertyTax: "",
        city: "",
        state: "",
        notes: "",
      },
      mortgages: [
        {
          mortgage: "",
          mortgageInstitution: "",
          mortgageNumber: "",
        },
      ],
      sharedDetails: [
        {
          distributedType: "",
          distributedValue: "",
          distributedAmount: "",
          beneficiaryId: "",
        },
      ],
    });
    setOwnerName([]);
  };

  // Set the form
  const AddForm = (event) => {
    event.preventDefault();
    toggle();
    let token = "Bearer " + getToken();
    if (
      data.streetAddress === "" ||
      data.zipCode === "" ||
      data.city === "" ||
      data.state === "" ||
      data.country === ""
      // data.rentalIncome === ""
    ) {
      // toast.error("Form data is invalid !! " , { position: toast.POSITION.BOTTOM_CENTER });
      toast.error("Please fill all menu and After Add.");
      return;
    }

    //create form data to send a file and remaining class data
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("data", JSON.stringify(data));
    realEstates(formData, token)
      .then((resp) => {
        AddCard();
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        // window.location.reload();
        //setInputrr ([...inputrr,{streetAddress,mortgage,aptNumber,exampleFile,zipCode,estPropertyVal,country,rentalIncome}])
      })
      .catch((error) => {
        toast.error(
          "File is too large please choose file size under 400 KB",
          error
        );
      });
  };

  // code by purnendu
  const handleRemove = (id, idType) => {
    if (idType === "realEstateId") {
      deleteRealEstate(id)
        .then((res) => {
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });

          AddCard();
          setShow(false);
        })
        .catch((err) => {});
    } else {
      deleteSingleProperty(id)
        .then((res) => {
          setBeneficiaryVisible(!beneficiaryVisible);
          setShow(false);
          AddCard();
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        })
        .catch((error) => {});
    }
  };
  // code for handle download
  const handleDownload = (id, fileName) => {
    let myarry = fileName.split(".");

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

  // const columns = [
  //   {
  //     id: "streetAddress",
  //     label: "Address",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "aptNumber",
  //     label: "Apartment",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "zipCode",
  //     label: "Zip\u00a0Code",
  //     align: "center",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "city",
  //     label: "City/Town",
  //     align: "center",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "state",
  //     label: "State",
  //     align: "center",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "country",
  //     label: "Country",

  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "mortgage",
  //     label: "Total\u00a0Mortgage",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //     format: "openMortgage",
  //   },
  //   {
  //     id: "estPropertyVal",
  //     label: "Property\u00a0Value",

  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "propertyTax",
  //     label: "Property\u00a0Tax",

  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },

  //   {
  //     id: "equity",
  //     label: "Estimated\u00a0Equity",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "caption",
  //     label: "Tax\u00a0Doc\u00a0Caption",
  //     format: "buttons",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  //   {
  //     id: "notes",
  //     label: "Note",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //     format: "shortText",
  //   },
  //   {
  //     id: "document",
  //     label: "Document",
  //     format: "button",
  //     style: {
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //     align: "center",
  //   },
  //   {
  //     id: "action",
  //     label: "Action",
  //     align: "center",
  //     format: "action",
  //     style: {
  //       padding: 0,
  //       minWidth: 100,
  //       fontWeight: "bold",
  //     },
  //   },
  // ];

  const handleChangesZipCode = (e, field) => {
    const inputValue = e.target.value;
    if (/^\d{0,5}$/.test(inputValue)) {
      // Validation to allow only up to 5 digits (or empty string)
      // setData({ ...data, [field]: inputValue });
      setData((prevData) => ({
        ...prevData,
        realEstate: {
          ...prevData.realEstate,
          zipCode: inputValue,
        },
      }));
    }
  };

  useEffect(() => {
    const fetchDataFromAPI = () => {
      if (data.realEstate.zipCode.length === 5) {
        const apiUrl = `http://api.zippopotam.us/us/${data.realEstate.zipCode}`;
        axios
          .get(apiUrl)
          .then((res) => {
            if (res.data && res.data.places && res.data.places.length > 0) {
              const placeName = res.data.places[0]["place name"];
              // setData((prevData) => ({
              //   ...prevData,
              //   city: placeName,
              //   country: res.data.country,
              //   state: res.data.places[0]["state"],
              // }));
              setData((prevData) => ({
                ...prevData,
                realEstate: {
                  ...prevData.realEstate,
                  city: placeName,
                  country: res.data.country,
                  state: res.data.places[0]["state"],
                },
              }));
            } else {
            }
          })
          .catch((error) => {
            // toast.error("Failed to fetch address data from API.");
          });
      } else if (data.realEstate.zipCode.length > 5) {
        // Clear input field if more than 5 digits are entered
        // setData((prevData) => ({
        //   ...prevData.realEstate,
        //   zipCode: '',
        //   country: '',
        //   city: '',
        //   state: '',
        // }));
        setData((prevData) => ({
          ...prevData,
          realEstate: {
            ...prevData.realEstate,
            zipCode: "",
            city: "",
            country: "",
            state: "",
          },
        }));
      } else if (data.realEstate.zipCode.length <= 4) {
        // Reset all fields if zipCode is null
        // setData((prevData) => ({
        //   ...prevData.realEstate,
        //   country: '',
        //   city: '',
        //   state: '',
        // }));
        setData((prevData) => ({
          ...prevData,
          realEstate: {
            ...prevData.realEstate,
            city: "",
            country: "",
            state: "",
          },
        }));
      }
    };

    fetchDataFromAPI();
  }, [data.realEstate.zipCode]);

  // The rest of your code remains unchanged...

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const handleOpenPopup = (note) => {
    setSelectedNote(note);
    setPopupVisible(true);
  };

  // add multiple mordgages
  const [mordgage, setMordgage] = useState([]);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  const mordgages = [0, 1, 2, 3, 4];
  const handleAddColumn = () => {
    if (visibleColumnIndex < 4) {
      setMordgage([...mordgage, { label: visibleColumnIndex + 1 }]);
      setVisibleColumnIndex(visibleColumnIndex + 1);
    }
  };

  const handleRemoveColumn = (indexToRemove) => {
    setMordgage(mordgage.filter((_, index) => index !== indexToRemove));
    setVisibleColumnIndex(visibleColumnIndex - 1);

    setData((prevData) => {
      const updatedMortgages = prevData.mortgages.map((mortgage, index) => {
        if (index === indexToRemove) {
          return { mortgage: "" }; // Reset the mortgage value to an empty string
        }
        return mortgage; // Return the original mortgage object for other indices
      });

      // Filter out mortgages with empty strings
      const filteredMortgages = updatedMortgages.filter(
        (mortgage) => mortgage.mortgage !== ""
      );

      // Return the new state with empty mortgages removed
      return {
        ...prevData,
        mortgages: filteredMortgages,
      };
    });
  };

  // for add field pop
  let [showAdditionField, SetshowAdditionField] = useState(false);

  // end
  // const handleRemoveColumn = (index) => {
  //   if (!data[`mordgage${index + 1}`]) {
  //     const updatedDivs = [...visibleDivs];
  //     updatedDivs[index] = false;
  //     setVisibleDivs(updatedDivs);
  //   }

  //   // Reset the input value
  //   setData((prevData) => ({
  //     ...prevData,
  //     [`mordgage${index + 1}`]: "",
  //   }));
  // };

  //  downalod popup
  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");

  const handleShowDownlaod = (showDetail) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
  };

  // new update
  let [form1, setForm1] = useState(false);

  const toggle = () => {
    resetForm();
    setForm1(!form1);
  };

  // update
  // let cc = {
  //   name:"pawam",
  //   value:"456211",
  //   address:"bangalore"
  // }

  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card

  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show, setShow] = useState(false);
  // card creating
  const AddCard = () => {
    let userId = getUser().commonId;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    getRealEstates(token, userId)
      .then((res) => {
        setCard(res);
      })
      .catch((error) => {
        setCard([]);
        // toast.error("Card not created!!");
      });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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
  useEffect(() => {
    getBenificiarydata();
  }, []);

  // other property
  let [otherPropertyTypes, setOtherPropertyTypes] = useState(false);

  //$ on click
  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);
  const [isTextFieldClicked2, setIsTextFieldClicked2] = useState(false);
  const [isTextFieldClicked3, setIsTextFieldClicked3] = useState(false);

  const validateZipCode = (value) => {
    return /^\d{5}$/.test(value); // Validates a 5-digit numeric input
  };

  //

  const [benevisible, setbeneVisible] = useState(false);
  const [distributionType, setDistributionType] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [beneficiaryVisible, setBeneficiaryVisible] = useState(false);
  let [showAdditionField1, setshowAdditionField1] = useState(false);

  const handleShowBeneficiary = () => {
    setbeneVisible(true);

    setEstimatedTotalAmount(data.realEstate.estPropertyVal);
    // data.sharedDetails = [];
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

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails, // Update the sharedDetails in the state
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleChanges1 = (e, field, { index }) => {
    const { value } = e.target;

    setData((prevData) => {
      const updatedMortgages = [...prevData.mortgages];
      if (!updatedMortgages[index]) {
        updatedMortgages[index] = {};
      }
      updatedMortgages[index][field] = value;

      return {
        ...prevData,
        mortgages: updatedMortgages,
      };
    });
  };

  const handleOpenBeneficiary = (showDetail) => {
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {primaryUserDetails.accountType === "secondary" &&
      secondaryUserDetails.accountType === "primary" &&
      secondaryUserDetails.isSecondaryUserEditable === "false" ? (
        ""
      ) : (
        <div className="addme">
          <div className="addme_inner">
            <button onClick={() => toggle()}>Add New Property</button>
          </div>
        </div>
      )}

      <div className="propCard">
        <div className="propCard-card">
          {card.map((entity) => (
            <div className="propCard-card-body" key={entity.realEstate.id}>
              <h5 className="propCard-card-title">
                {entity.realEstate.propertyCaption}
              </h5>
              <p className="propCard-card-text"> {entity.realEstate.city}</p>
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

      {/* <div className="property_main "> */}

      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="addform_ichest">
            <div className="addform_main">
              <div className="addform_heading">
                <h3 className="addform_heading_h1">
                  Add RealEstate Properties
                </h3>
                <div className="addform_close" onClick={toggle}>
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </div>
              <div className="addform_body">
                <Form onSubmit={AddForm} className="addform_body">
                  <div className="addform_select_body">
                    <div className="addform_body_left">
                      <div>
                        <Tooltip title="Select Owner" className="mt-2">
                          <div>
                            <FormLabel>Select Owner</FormLabel>

                            <Select
                              placeholder="Select Owner"
                              value={ownerName}
                              multiple
                              onChange={(event, newValue) =>
                                handleChange(event, newValue, "owner")
                              }
                              sx={{
                                minWidth: "13rem",
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {ownerNames.map((name) => (
                                <Option key={name} value={name}>
                                  {name}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Enter Heading For Property ">
                          <div className="mt-2">
                            <FormLabel>Property Heading</FormLabel>
                            <Input
                              className="input_mui_joy"
                              placeholder="Enter property heading"
                              value={data.realEstate.propertyCaption}
                              onChange={(e) =>
                                handleChanges(e, "propertyCaption")
                              }
                            />
                          </div>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Select The Type Of Property">
                          <div className="mt-2">
                            <FormLabel>Type Of Property</FormLabel>

                            <Select
                              value={data.realEstate.propertyType}
                              onChange={(event, newValue) =>
                                handleChange(event, newValue, "propertyType")
                              }
                            >
                              <Option value="">
                                Select Your Type Of Property
                              </Option>
                              <Option value="Residential">Residential</Option>
                              <Option value="Commercial">Commercial</Option>
                              <Option value="Industrial">Industrial</Option>
                              <Option value="Land">Land</Option>
                              <Option
                                value="Other"
                                onClick={() => {
                                  setOtherPropertyTypes(!otherPropertyTypes);
                                }}
                              >
                                Other
                              </Option>
                            </Select>
                          </div>
                        </Tooltip>
                      </div>

                      {otherPropertyTypes && (
                        <div className="mt-2">
                          <Tooltip title="Enter Your Other Property Type ">
                            <div>
                              <FormLabel>Other Property</FormLabel>
                              <Input
                                className="input_mui_joy"
                                placeholder="Enter Other Property"
                                id="otherprop"
                                onChange={(e) =>
                                  handleChanges(e, "otherPropertyType")
                                }
                                value={data.realEstate.otherPropertyType}
                              />
                            </div>
                          </Tooltip>
                        </div>
                      )}
                      <div className="address_input">
                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Enter a valid Zip-code ">
                              <div>
                                <FormLabel>Zip Code *</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  type="number"
                                  placeholder="Enter your Zip Code"
                                  id="zipCode"
                                  onChange={(e) =>
                                    handleChangesZipCode(e, "zipCode")
                                  }
                                  value={data.realEstate.zipCode}
                                  inputProps={{
                                    minLength: 5,
                                    maxLength: 5,
                                  }}
                                  error={
                                    !validateZipCode(data.realEstate.zipCode)
                                  }
                                  helperText={
                                    !validateZipCode(data.realEstate.zipCode)
                                      ? "Please enter a valid 5-digit Zip Code"
                                      : ""
                                  }
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Automatically populate based on the zip code">
                              <div style={{ width: "100%" }}>
                                <FormLabel>City/Town *</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  placeholder="City/Town *"
                                  value={data.realEstate.city}
                                  readOnly
                                  disabled
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <div className="address_input">
                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Automatically populate based on the zip code">
                              <div>
                                <FormLabel>State *</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  placeholder="State *"
                                  value={data.realEstate.state}
                                  readOnly
                                  disabled
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Automatically populate based on the zip code">
                              <div>
                                <FormLabel>Country *</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  placeholder="Country *"
                                  value={data.realEstate.country}
                                  readOnly
                                  disabled
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      <div className="address_input">
                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Enter Your Street Address ">
                              <div style={{ width: "100%" }}>
                                <FormLabel>Street Address</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  placeholder="Street Address *"
                                  onChange={(e) =>
                                    handleChanges(e, "streetAddress")
                                  }
                                  value={data.realEstate.streetAddress}
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Enter Your Apartment Number ">
                              <div style={{ width: "100%" }}>
                                <FormLabel>Apartment</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  placeholder="Apartment"
                                  onChange={(e) =>
                                    handleChanges(e, "aptNumber")
                                  }
                                  value={data.realEstate.aptNumber}
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      <div className="address_input">
                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Enter your estimated Property Value">
                              <div style={{ width: "100%" }}>
                                <FormLabel>Property Value</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  placeholder="Estimated Property Value"
                                  onChange={(e) =>
                                    handleChanges(e, "estPropertyVal")
                                  }
                                  value={data.realEstate.estPropertyVal}
                                  onClick={() => setIsTextFieldClicked2(true)}
                                  startDecorator={
                                    isTextFieldClicked2 ? <div>$</div> : null
                                  }
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="mt-2 addform_input_half">
                          <div>
                            <Tooltip title="Enter your Estimated Annual Property Tax">
                              <div style={{ width: "100%" }}>
                                <FormLabel>Annual Property Tax</FormLabel>
                                <Input
                                  className="input_mui_joy"
                                  placeholder="Estimated Annual Property Tax"
                                  onChange={(e) =>
                                    handleChanges(e, "propertyTax")
                                  }
                                  value={data.realEstate.propertyTax}
                                  onClick={() => setIsTextFieldClicked(true)}
                                  startDecorator={
                                    isTextFieldClicked ? <div>$</div> : null
                                  }
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="addform_body_right">
                      <div>
                        {mordgages.map((index) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: "10px",
                              display:
                                index <= visibleColumnIndex ? "block" : "none",
                            }}
                          >
                            <div>
                              <div>
                                <Tooltip
                                  title={`Add your mortgage institution ${
                                    index + 1
                                  }`}
                                >
                                  <div
                                    style={{ width: "100%" }}
                                    className="mt-2"
                                  >
                                    <FormLabel>
                                      {`Mortgage Institution ${index + 1}`} *
                                    </FormLabel>
                                    <Input
                                      className="input_mui_joy"
                                      id={`mortgageInstitution${index + 1}`}
                                      placeholder={`Mortgage Institution ${
                                        index + 1
                                      }`}
                                      onChange={(e) =>
                                        handleChanges1(
                                          e,
                                          "mortgageInstitution",
                                          {
                                            index,
                                          }
                                        )
                                      }
                                      value={
                                        data.mortgages[index]
                                          ? data.mortgages[index]
                                              .mortgageInstitution
                                          : ""
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            </div>

                            <div className="address_input">
                              <div className="mt-2 addform_input_half">
                                <Tooltip
                                  title={`Add your mortgage number ${
                                    index + 1
                                  }`}
                                >
                                  <div>
                                    <FormLabel>
                                      {`Mortgage Number ${index + 1}`} *
                                    </FormLabel>
                                    <Input
                                      className="input_mui_joy"
                                      placeholder="mortgageNumber"
                                      id={`mortgageNumber${index + 1}`}
                                      onChange={(e) =>
                                        handleChanges1(e, "mortgageNumber", {
                                          index,
                                        })
                                      }
                                      value={
                                        data.mortgages[index]
                                          ? data.mortgages[index].mortgageNumber
                                          : ""
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                              <div className="mt-2 addform_input_half">
                                <Tooltip
                                  title={`Add your mortgage ${index + 1}`}
                                >
                                  <div>
                                    <FormLabel>{`Mortgage ${
                                      index + 1
                                    }`}</FormLabel>
                                    <Input
                                      className="input_mui_joy"
                                      type="number"
                                      placeholder="Mortgage"
                                      id={`mortgage${index + 1}`}
                                      onChange={(e) =>
                                        handleChanges1(e, "mortgage", {
                                          index,
                                        })
                                      }
                                      value={
                                        data.mortgages[index]
                                          ? data.mortgages[index].mortgage
                                          : ""
                                      }
                                      onClick={() =>
                                        setIsTextFieldClicked3(true)
                                      }
                                      startDecorator={
                                        isTextFieldClicked3 ? (
                                          <div>$</div>
                                        ) : null
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                            {index !== 0 && (
                              <div style={{ marginTop: "4px" }}>
                                <Button
                                  style={{
                                    height: "30px",
                                    width: "30px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "50%",
                                    backgroundColor: "rgb(255, 74, 74)",
                                    border: "none",
                                  }}
                                  onClick={() => handleRemoveColumn(index)}
                                >
                                  <FontAwesomeIcon icon={faMinus} />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        {visibleColumnIndex < 4 && (
                          <div style={{ marginTop: "2px" }}>
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
                      <div className="address_input">
                        <div className="mt-2 addform_input_half">
                          <div
                            className="bene-select mt-3"
                            onClick={handleShowBeneficiary}
                            style={{ cursor: "pointer" }}
                          >
                            Select Beneficiary
                          </div>
                        </div>
                        <div className="mt-2 addform_input_half">
                          <div style={{ width: "100%" }}>
                            <Tooltip title="Upload your property related file it should be under 400 kb">
                              <div>
                                <FormLabel>Supporting Document</FormLabel>
                                <input
                                  style={{
                                    border: "solid 1px lightgray",
                                    borderLeft: "none",
                                    width: "100%",
                                    borderRadius: "2px",
                                  }}
                                  type="file"
                                  name="myfile"
                                  id="exampleFile"
                                  onChange={handleImageChange}
                                  accept=".pdf"
                                  multiple
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      <div
                        className="mt-2 form1-double"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-between",
                          marginTop: "-12px",
                        }}
                      ></div>

                      <div className="address_input">
                        <div style={{ width: "100%" }} className="mt-2">
                          <Tooltip title="Enter notes for your real estate">
                            <FormLabel>Notes</FormLabel>
                            <Textarea
                              sx={{ height: "182px", minHeight: "52px" }}
                              placeholder="Notes"
                              id="notes"
                              onChange={(e) => handleChanges(e, "notes")}
                              value={data.realEstate.notes}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      className="my-estate-clear-btn"
                      onClick={resetForm}
                      type="reset"
                      outline
                    >
                      Clear
                    </Button>
                    <Button outline type="" className="my-estate-add-btn">
                      Add
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* displaying the pop table for cards */}

      {show && Object.keys(showDetail).length > 0 && (
        <>
          <div className="card__data" style={{ transition: "all 1s ease-out" }}>
            <div className="card__data-container">
              <section className="section1">
                <div>
                  <p className="row1-text">
                    <FontAwesomeIcon
                      icon={faHouse}
                      style={{ color: "#025596", fontSize: "18px" }}
                    />
                    <span style={{}}>
                      {showDetail.realEstate.propertyCaption}
                    </span>
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

                    {primaryUserDetails.accountType === "secondary" &&
                    secondaryUserDetails.accountType === "primary" &&
                    secondaryUserDetails.isSecondaryUserEditable === "false" ? (
                      ""
                    ) : (
                      <div>
                        <Tooltip title="Click Here To Edit">
                          <div>
                            <UpdateButton
                              URL={"../my-estate/real-estate/"}
                              id={showDetail.realEstate.id}
                            />
                          </div>
                        </Tooltip>
                      </div>
                    )}

                    {primaryUserDetails.accountType === "secondary" &&
                    secondaryUserDetails.accountType === "primary" &&
                    secondaryUserDetails.isSecondaryUserEditable === "false" ? (
                      ""
                    ) : (
                      <div>
                        <Deletebutton
                          handleRemove={handleRemove}
                          Id={showDetail.realEstate.id}
                          idType="realEstateId"
                        />
                      </div>
                    )}

                    <div>
                      <span
                        className="card__data-close"
                        onClick={() => {
                          setShow(!show);
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
                    {showDetail.realEstate.owner && (
                      <p>
                        Owner : <code>{showDetail.realEstate.owner}</code>
                      </p>
                    )}

                    {showDetail.realEstate.propertyType === "Other" ? (
                      ""
                    ) : (
                      <p>
                        Type of Property:{" "}
                        <code> {showDetail.realEstate.propertyType}</code>
                      </p>
                    )}

                    {showDetail.realEstate.propertyType === "Other" && true ? (
                      <p>
                        Other Type of Property:{" "}
                        <code> {showDetail.realEstate.otherPropertyType}</code>
                      </p>
                    ) : (
                      ""
                    )}
                    <p>
                      Street Address:{" "}
                      <code>{showDetail.realEstate.streetAddress}</code>
                    </p>

                    {showDetail.realEstate.aptNumber && (
                      <p>
                        Apartment:{" "}
                        <code>{showDetail.realEstate.aptNumber}</code>
                      </p>
                    )}
                    <p>
                      Zip Code: <code>{showDetail.realEstate.zipCode}</code>
                    </p>
                    <p>
                      City / Town: <code>{showDetail.realEstate.city}</code>
                    </p>
                    <p>
                      State: <code>{showDetail.realEstate.state}</code>
                    </p>
                  </div>
                  <div className="col2">
                    <p>
                      Country: <code>{showDetail.realEstate.country}</code>
                    </p>
                    {showDetail.name === null ? (
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
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          {" "}
                          ${showDetail.realEstate.equity}0
                        </span>
                      </code>
                    </p>

                    <p>
                      Estimated Annual Property Tax:
                      <code style={{ color: "red", fontWeight: "bold" }}>
                        {" "}
                        ${showDetail.realEstate.propertyTax}.00
                      </code>
                    </p>

                    {
                      <Tooltip title={`Click To See Details`}>
                        <p
                          onClick={() => {
                            setshowAdditionField1(showDetail);
                          }}
                        >
                          Mortgages Details:&nbsp;
                          <code>
                            <span className="readmore">Click to see</span>
                          </code>
                        </p>
                      </Tooltip>
                    }

                    {showDetail.benificiary && (
                      <p>
                        Beneficiary Name: <code>{showDetail.benificiary}</code>
                      </p>
                    )}
                    {/* <p style={{ display: "flex" }}>Download Supporting Document:&nbsp;
                      <div>
                        <Tooltip title="Click Here To Downlaod The Document  ">
                          <div
                            //  value = {showDetail.user.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleView(showDetail.name);
                            }}>
                            <div className="myestate_download_button dwnbtn">
                              <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                              <span></span>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    </p> */}
                    <p>
                      Estimate Property Value:{" "}
                      <code style={{ color: "green", fontWeight: "bold" }}>
                        ${showDetail.realEstate.estPropertyVal}.00
                      </code>
                    </p>

                    {/* {
                      showDetail.addfield1 || showDetail.addfield2 || showDetail.addfield3 || showDetail.addfield4 || showDetail.addfield5 && true ? (
                        <Tooltip title={`Click To See Details`}>
                          <p onClick={() => { SetshowAdditionField(showDetail); setShow(!show); }}>Additional Fields:
                            <code> {showDetail && showDetail.addfield1 ? showDetail.addfield1.slice(0, 10) : ''}...<span className="readmore">Read More</span></code>
                          </p>
                        </Tooltip>
                      ) : ("")
                    } */}

                    {showDetail.sharedDetails[0] && (
                      <p
                        onClick={() => {
                          handleOpenBeneficiary(showDetail);
                        }}
                      >
                        Beneficiary Details{" "}
                        <code>
                          <span className="readmore">Click Here</span>
                        </code>
                      </p>
                    )}

                    {showDetail.realEstate.notes && (
                      <Tooltip title="Click To see Note">
                        <p
                          onClick={() => {
                            handleOpenPopup(showDetail.realEstate.notes);
                            setShow(!show);
                          }}
                        >
                          Note:{" "}
                          <code>
                            {showDetail && showDetail.notes
                              ? showDetail.notes.slice(0, 10)
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

      {/* <div className="property_table" style={{display:"none"}} >
          <Container className="myestate-container" >
            <Paper sx={{ width: "100%", overflow: "hidden", border: "1px solid #cbcbcb", padding: "0px 10px" }}>
              <TableContainer sx={{ maxHeight: "580px", overflowX: "scroll" }}>
                <Table stickyHeader >
                  <TableHead  >
                    <TableRow >
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
                            tabIndex={-1}
                            key={row.code} >

                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format === "button" ? (
                                    <Button className="myestate_view_btn"
                                      onClick={() => {
                                        handleDownload(row.name);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faDownload} />
                                    </Button>
                                  ) : column.format === "buttons" ? (
                                    <Tooltip title="click here to download the Document ">
                                      <div
                                        style={{ cursor: "pointer", color: value ? "black" : "red" }}
                                        onClick={() => {
                                          handleView(row.name);
                                        }}>
                                        <div className="myestate_download_button">
                                          <FontAwesomeIcon className="myestate_download_icon" icon={faDownload} />
                                          <span>{value}</span>
                                        </div>
                                      </div>
                                    </Tooltip>
                                  ) : column.format === "action" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >

                                    

                              
                                    
                                      <UpdateButton
                                        URL={"../my-estate/real-estate/"}
                                        id={row.esatate_Id}

                                      />
                                      
                                      <Deletebutton
                                        handleRemove={handleRemove}
                                        Id={row.esatate_Id}
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
                                  ) : column.format === "openMortgage" ? (
                                    // Display limited text with popup
                                    <Tooltip title="click here to read more">
                                      <div
                                        style={{
                                          cursor: "pointer",
                                          fontWeight: 450,
                                          color: "red",
                                        }}
                                        onClick={() => handleRowClick(row)}
                                      >
                                        <span style={{ color: "red" }}>$ </span>
                                        {value}
                                      </div>
                                    </Tooltip>
                                  ) : column.id === "estPropertyVal" ? (
                                    value !== "" ? <span style={{ color: "#05d402", fontWeight: 450 }}>$ {value}</span> : <span style={{ color: "red" }}>Incomplete</span>
                                  ) : column.id === "propertyTax" ? (
                                    value !== "" ? <span style={{ color: "red", fontWeight: 450 }}>$ {value}</span> : <span style={{ color: "red" }}>Incomplete</span>
                                  )
                                    : column.id === "equity" ? (
                                      value !== "" ? <span style={{ color: "#05d402", fontWeight: 450 }}>$ {value}</span> : <span style={{ color: "red" }}>Incomplete</span>
                                    ) : (
                                      value || <span style={{ color: "red" }}>Incomplete</span>
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

      {/* {selectedRow && (
        // Display the popup when a row is selected
        <div className="popup">
          <div className="popup-content">
            <div className="note_popup_heading">
              <div>
                <h2>All Mortgages</h2>
              </div>
              <div>
                <button
                  className="note_popup_heading_close_btn"
                  onClick={
                    () => {
                      handleClosePopup();
                      setShow(!show);
                    }
                  }
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>
            <div className="popup-body">
              {selectedRow.mortgage !== 0 && selectedRow.mortgage !== "" ? (
                <p style={{ fontWeight: 550, fontSize: "15px", color: "black" }}>Total Mortgage: ${selectedRow.mortgage}0</p>
              ) : (
                <p></p>
              )}
              {selectedRow.mortgage1 !== 0 && selectedRow.mortgage1 !== "" ? (
                <p style={{ fontWeight: 450, fontSize: "12px", color: "black" }}>Mortgage 1 : ${selectedRow.mortgage1}.00</p>
              ) : (
                <p></p>
              )}
              {selectedRow.mortgage2 !== 0 && selectedRow.mortgage2 !== "" ? (
                <p style={{ fontWeight: 450, fontSize: "12px", color: "black" }}>Mortgage 2 : ${selectedRow.mortgage2}.00</p>
              ) : (
                <p></p>
              )}
              {selectedRow.mortgage3 !== 0 && selectedRow.mortgage3 !== "" ? (
                <p style={{ fontWeight: 450, fontSize: "12px", color: "black" }}>Mortgage 3 : ${selectedRow.mortgage3}.00</p>
              ) : (
                <p></p>
              )}
              {selectedRow.mortgage4 !== 0 && selectedRow.mortgage4 !== "" ? (
                <p style={{ fontWeight: 450, fontSize: "12px", color: "black" }}>Mortgage 4 : ${selectedRow.mortgage4}.00</p>
              ) : (
                <p></p>
              )}
              {selectedRow.mortgage5 !== 0 && selectedRow.mortgage5 !== "" ? (
                <p style={{ fontWeight: 450, fontSize: "12px", color: "black" }}>Mortgage 5 : $ {selectedRow.mortgage5}</p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      )
      } */}

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

      {popupVisible && (
        // Popup div
        <div className="popup">
          <div className="popup-content">
            <div className="note_popup">
              <div className="note_popup_heading">
                <div>
                  <h2>Note</h2>
                </div>
                <div>
                  <button
                    className="note_popup_heading_close_btn"
                    onClick={() => {
                      setPopupVisible(false);
                      setShow(!show);
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
                    setShow(!show);
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
                  style={{ fontWeight: 450, fontSize: "12px", color: "black" }}
                >
                  New Field 1 : {showAdditionField.addfield1}
                </p>
              ) : (
                <p></p>
              )}
              {showAdditionField.addfield2 !== 0 &&
              showAdditionField.addfield2 !== "" ? (
                <p
                  style={{ fontWeight: 450, fontSize: "12px", color: "black" }}
                >
                  New Field 2 : {showAdditionField.addfield2}
                </p>
              ) : (
                <p></p>
              )}
              {showAdditionField.addfield3 !== 0 &&
              showAdditionField.addfield3 !== "" ? (
                <p
                  style={{ fontWeight: 450, fontSize: "12px", color: "black" }}
                >
                  New Field 3 : {showAdditionField.addfield3}
                </p>
              ) : (
                <p></p>
              )}
              {showAdditionField.addfield4 !== 0 &&
              showAdditionField.addfield4 !== "" ? (
                <p
                  style={{ fontWeight: 450, fontSize: "12px", color: "black" }}
                >
                  New Field 4 : {showAdditionField.addfield4}
                </p>
              ) : (
                <p></p>
              )}
              {showAdditionField.addfield5 !== 0 &&
              showAdditionField.addfield5 !== "" ? (
                <p
                  style={{ fontWeight: 450, fontSize: "12px", color: "black" }}
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
                            disabled={selectedBeneficiaries.includes(benif.id)}
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
                      <div key={beneficiary} className="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributionType === "percentage" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Percentage"
                              value={
                                beneficiaryDetails[beneficiary]?.percentage ||
                                ""
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
                          onClick={() => handleBeneficiaryClose(beneficiary)}
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
                            {details.distributedType === "percentage" && "%"}
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
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>
            {/* <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", }} > */}
            {showDetail.mortgages &&
              showDetail.mortgages.map((mortgageList, index) => (
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
                      <span style={{ marginLeft: "10px", fontWeight: "500" }}>
                        ${mortgageList.mortgage}.00
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
                      Mortgage Number:
                      <span style={{ marginLeft: "10px", fontWeight: "500" }}>
                        {mortgageList.mortgageNumber}
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
                      Mortgage Institution:
                      <span style={{ marginLeft: "10px", fontWeight: "500" }}>
                        {mortgageList.mortgageInstitution}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default RealEstateContent;
