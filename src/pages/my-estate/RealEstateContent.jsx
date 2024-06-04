import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormFeedback,
} from "reactstrap";
import {
  deleteSingleProperty,
  downloadDocument1,
  downloadTaxDocument,
  getBeneficiary,
  getSecondaryUser,
  getToken,
  getUser,
} from "../../services/user-service";
//import { Accordion, data , AccordionContext } from "reactstrap";
import {
  InputLabel,
  MenuItem,
  TextField,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";

import { FormControl, FormLabel, Input, Select, Option } from "@mui/joy";

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
  const handleChange = (event, newValue) => {

    // Convert ownerName array to a single string
    const comingValue = typeof newValue === "string" ? newValue.split(",") : newValue;
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
  let bothUserName = "";

  // Check if secondary user exists
  if (secondaryUserDetails !== undefined) {
    secondaryUserName =
      secondaryUserDetails.firstName + " " + secondaryUserDetails.lastName;
    // Combine both user names into one variable
    bothUserName = secondaryUserName + " & " + primaryUserName;

    // Push both user names into the array
    ownerNames.push(primaryUserName, secondaryUserName);
  } else {
    // If secondary user doesn't exist, only push primary user name
    ownerNames.push(primaryUserName);
  }

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

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
  const handleImageChange1 = (event) => {
    const selectedFile = event.target.files[0];
    const allowedExtensions = ["pdf"];

    if (selectedFile) {
      const fileNameParts = selectedFile.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (allowedExtensions.includes(fileExtension)) {
        setSelectedImage1(selectedFile);
      } else {
        toast.error("Please Select pdf Format Document Only", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        event.target.value = "";
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

  const [countryName, setCountryName] = React.useState("");

  const CountryHandleChange = (event) => {
    setCountryName(event.target.value);
    data.country = event.target.value;
  };
  // Set the form
  const AddForm = (event) => {
    event.preventDefault();
    console.log("data: ", JSON.stringify(data));
    return;
    toggle();
    let token = "Bearer " + getToken();
    setCardNo(token);

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

    realEstates(formData, token)
      .then((resp) => {
        AddCard();
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
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

  //show data in frontend
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().commonId;

    let token = "Bearer " + getToken();
    getRealEstates(token, userId)
      .then((res) => {
        setCategory(res);
      })
      .catch((error) => {
        // handle error
        setError({
          errors: error,
          isError: true,
        });
      });
  };

  // code by purnendu
  const handleRemove = (id, idType) => {
    if (idType == "realEstateId") {
      deleteRealEstate(id)
        .then((res) => {
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          getData();
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

  const handleView = (newFile) => {
    let myarry = newFile.split(".");
    const token = getToken(); // Replace with your actual token

    downloadTaxDocument("realEstate", newFile)
      .then((response) => {
        const downloadUrl = URL.createObjectURL(response.data);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${myarry[0]}.${myarry[1]}`; // Set the desired file name and extension
        link.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        // Handle the error
      });
  };

  const columns = [
    {
      id: "streetAddress",
      label: "Address",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "aptNumber",
      label: "Apartment",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "zipCode",
      label: "Zip\u00a0Code",
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "city",
      label: "City/Town",
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "state",
      label: "State",
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "country",
      label: "Country",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "mortgage",
      label: "Total\u00a0Mortgage",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
      format: "openMortgage",
    },
    {
      id: "estPropertyVal",
      label: "Property\u00a0Value",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "propertyTax",
      label: "Property\u00a0Tax",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },

    {
      id: "equity",
      label: "Estimated\u00a0Equity",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "caption",
      label: "Tax\u00a0Doc\u00a0Caption",
      format: "buttons",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "notes",
      label: "Note",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
      format: "shortText",
    },
    {
      id: "document",
      label: "Document",
      format: "button",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
      align: "center",
    },
    {
      id: "action",
      label: "Action",
      align: "center",
      format: "action",
      style: {
        padding: 0,
        minWidth: 100,
        fontWeight: "bold",
      },
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [zipCode, setZipCode] = useState("");
  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  var c = [];

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
  const [cityName, setCityName] = React.useState("");

  const cityHandleChange = (event) => {
    if (event.target === undefined) {
      setCityName(event);
      data.city = event;
    } else {
      setCityName(event.target.value);
      data.city = event.target.value;
    }
  };

  useEffect(() => {
    const fetchDataFromAPI = () => {
      if (data.realEstate.zipCode.length === 5) {
        const apiUrl = `http://api.zippopotam.us/us/${data.realEstate.zipCode}`;
        axios
          .get(apiUrl)
          .then((res) => {
            setLoading(false);
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
            setLoading(false);

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
      } else if (zipCode.length <= 4) {
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
      setLoading(true);
    };

    fetchDataFromAPI();
  }, [data.realEstate.zipCode]);

  useEffect(() => {
    getData();
  }, []);

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

  // field addition

  const addField = [0, 1, 2, 3, 4];
  const [visibleField, setVisibleField] = useState(0);

  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
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

  const [visibleDivs, setVisibleDivs] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  //  downalod popup
  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");

  const handleShowDownlaod = (showDetail) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
  };

  // show mortgage popup
  const [mortgagePopupVisible, setMortgagePopupVisible] = useState(false);
  const [selectedMortgage, setSelectedMortgage] = useState("");
  const handleOpenMortgagePopup = (mortgage) => {
    setSelectedMortgage(mortgage);
    setMortgagePopupVisible(true);
  };
  const [selectedRow, setSelectedRow] = useState(null);

  // ... (other code)

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
  };

  const handleClosePopup = () => {
    setSelectedRow(null);
  };
  // property tax calculator
  const [popupCalculatorVisible, setPopupCalculatorVisible] = useState(false);

  const openPopup = () => {
    setPopupCalculatorVisible(true);
  };

  const closePopup = () => {
    setPopupCalculatorVisible(false);
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
  let [cardNo, setCardNo] = useState(0);
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

  // mortgage popup on click
  const showMortgage = (obj) => {
    handleRowClick(obj);
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
  let [show1, setShow1] = useState(false);
  const [benevisible, setbeneVisible] = useState(false);
  const [distributionType, setDistributionType] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [beneficiaryVisible, setBeneficiaryVisible] = useState(false);
  const [SelectedBeneficiary, setSelectedBeneficiary] = useState("");
  let [showAdditionField1, setshowAdditionField1] = useState(false);

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
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
    setSelectedBeneficiary(showDetail);
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
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Add Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={AddForm}>
                    <div className="mt-2">
                      <Tooltip title="Select Owner">
                        <FormControl>
                          <FormLabel>Select Owner</FormLabel>

                          <Select
                            value={ownerName}
                            multiple
                            onChange={handleChange}
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
                          
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading For Property ">
                        <FormControl>
                          <FormLabel>Property Heading</FormLabel>
                          <Input
                            className="input_mui_joy"
                            placeholder="Enter property heading"
                            value={data.realEstate.propertyCaption}
                            onChange={(e) =>
                              handleChanges(e, "propertyCaption")
                            }
                          />
                        </FormControl>
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Select The Type Of Property">
                        <FormControl
                          // required
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-label">
                            Type Of Property
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="propertyType"
                            label="Type Of Property"
                            onChange={(e) => handleChanges(e, "propertyType")}
                            value={data.realEstate.propertyType}
                          >
                            <MenuItem value={"Residential"}>
                              Residential
                            </MenuItem>
                            <MenuItem value={"Commercial"}>Commercial</MenuItem>
                            <MenuItem value={"Industrial"}>Industrial</MenuItem>
                            <MenuItem value={"Land"}>Land</MenuItem>
                            <MenuItem
                              value={"Other"}
                              onClick={() => {
                                setOtherPropertyTypes(!otherPropertyTypes);
                              }}
                            >
                              Other
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>

                    {/* Conditionally render the input field for custom text if "Other" is selected */}
                    {otherPropertyTypes && (
                      <div className="mt-3">
                        <Tooltip title="Enter Your Apartment Number ">
                          <TextField
                            fullWidth
                            type="text"
                            label="Enter Other Property"
                            id="otherprop"
                            size="normal"
                            onChange={(e) =>
                              handleChanges(e, "otherPropertyType")
                            }
                            value={data.realEstate.otherPropertyType}
                          />
                        </Tooltip>
                      </div>
                    )}

                    <div
                      className="mt-3 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "49.5%" }}>
                        <Tooltip title="Enter Your Street Address ">
                          <TextField
                            required
                            fullWidth
                            type="text"
                            label="Street Address"
                            id="streetAddress"
                            size="normal"
                            onChange={(e) => handleChanges(e, "streetAddress")}
                            value={data.realEstate.streetAddress}
                          />
                        </Tooltip>
                        <FormFeedback>
                          {error.errors?.response?.data?.streetAddress}
                        </FormFeedback>
                      </div>

                      <div style={{ width: "49.5%" }}>
                        <Tooltip title="Enter Your Apartment Number ">
                          <TextField
                            fullWidth
                            type="text"
                            label="Apartment"
                            id="aptNumber"
                            size="normal"
                            onChange={(e) => handleChanges(e, "aptNumber")}
                            value={data.realEstate.aptNumber}
                          />
                        </Tooltip>
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
                    >
                      <div style={{ width: "49.5%" }}>
                        <Tooltip title="Enter a valid Zip-code ">
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="Zip Code"
                            id="zipCode"
                            size="normal"
                            onChange={(e) => handleChangesZipCode(e, "zipCode")}
                            value={data.realEstate.zipCode}
                            inputProps={{
                              minLength: 5,
                              maxLength: 5,
                            }}
                            error={!validateZipCode(data.realEstate.zipCode)}
                            helperText={
                              !validateZipCode(data.realEstate.zipCode)
                                ? "Please enter a valid 5-digit Zip Code"
                                : ""
                            }
                          />
                        </Tooltip>
                      </div>

                      {/* <div style={{ width: "49.5%" }}>
                        <Tooltip title="Enter Your City/Town Name ">
                          <TextField
                            fullWidth
                            type="text"
                            label="City/Town"
                            id="placename"
                            size="normal"
                            onChange={(e) => handleChanges(e, "city")}
                            value={data.city}
                            required
                          />
                        </Tooltip>
                      </div> */}

                      <div style={{ display: "none" }}>
                        {/* Hidden input for submission */}
                        <input
                          type="text"
                          label="City/Town"
                          value={data.realEstate.city}
                          required
                          readOnly
                        />
                      </div>

                      <div className="" style={{ width: "49.5%" }}>
                        {/* Display-only TextField with Tooltip */}
                        <Tooltip title="Automatically populate based on the zip code">
                          <TextField
                            fullWidth
                            type="text"
                            label="City/Town *"
                            id="placename"
                            size="normal"
                            value={data.realEstate.city}
                            readOnly
                            disabled // Disable the field to prevent manual input
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      className="mt-2 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* <div style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your state name ">
                          <TextField
                            required
                            fullWidth
                            type="text"
                            label="State"
                            id="state"
                            size="normal"
                            onChange={(e) => handleChanges(e, "state")}
                            value={data.state}

                          />
                        </Tooltip>
                      </div> */}
                      <div style={{ display: "none" }}>
                        {/* Hidden input for submission */}
                        <input
                          type="text"
                          label="State"
                          value={data.realEstate.state}
                          required
                          readOnly
                        />
                      </div>

                      <div className="" style={{ width: "49.5%" }}>
                        {/* Display-only TextField with Tooltip */}
                        <Tooltip title="Automatically populate based on the zip code">
                          <TextField
                            fullWidth
                            type="text"
                            label="State *"
                            id="state"
                            size="normal"
                            value={data.realEstate.state}
                            readOnly
                            disabled // Disable the field to prevent manual input
                          />
                        </Tooltip>
                      </div>

                      {/* <div className="" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your country name ">
                          <TextField
                            required
                            fullWidth
                            type="text"
                            label="Country"
                            id="country"
                            size="normal"
                            onChange={(e) => handleChanges(e, "country")}
                            value={data.country}
                            
                          />
                        </Tooltip>
                      </div> */}
                      <div style={{ display: "none" }}>
                        {/* Hidden input for submission */}
                        <input
                          type="text"
                          name="country"
                          value={data.realEstate.country}
                          required
                          readOnly
                        />
                      </div>

                      <div className="" style={{ width: "49.5%" }}>
                        {/* Display-only TextField with Tooltip */}
                        <Tooltip title="Automatically populate based on the zip code">
                          <TextField
                            fullWidth
                            type="text"
                            label="Country *"
                            id="country"
                            size="normal"
                            value={data.realEstate.country}
                            readOnly
                            disabled // Disable the field to prevent manual input
                          />
                        </Tooltip>
                      </div>
                    </div>
                    {/* <div className="mt-2 form1-double" style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: "-12px" }}> */}

                    <div
                      className="mt-2 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "49.5%", alignSelf: "flex-end" }}>
                        <Tooltip title="Enter your estimated Property Value">
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="Estimated Property Value"
                            id="estPropertyVal"
                            size="normal"
                            onChange={(e) => handleChanges(e, "estPropertyVal")}
                            value={data.realEstate.estPropertyVal}
                            onClick={() => setIsTextFieldClicked2(true)}
                            InputProps={{
                              startAdornment: isTextFieldClicked2 ? (
                                <div>$</div>
                              ) : null,
                            }}
                          />
                        </Tooltip>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "49.5%",
                        }}
                      >
                        <Tooltip title="Enter your Estimated Annual Property Tax">
                          <TextField
                            required
                            fullWidth
                            // placeholder="$"
                            type="number"
                            label="Estimated Annual Property Tax"
                            id="propertyTax"
                            size="normal"
                            onChange={(e) => handleChanges(e, "propertyTax")}
                            value={data.realEstate.propertyTax}
                            onClick={() => setIsTextFieldClicked(true)}
                            InputProps={{
                              startAdornment: isTextFieldClicked ? (
                                <div>$</div>
                              ) : null,
                            }}
                          />
                        </Tooltip>
                        {/* <a onClick={openPopup}>
                          <Tooltip title="Click to open property tax calculator">
                            <FontAwesomeIcon
                              style={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "25px",
                                marginLeft: "10px",
                                height: "30px",
                              }}
                              icon={faCalculator}
                            />
                          </Tooltip>
                        </a>

                        {popupCalculatorVisible && (
                          <PropertyTaxCalculatorPopup onClose={closePopup} />
                        )} */}
                      </div>
                    </div>

                    {/* mortgages  */}

                    <div className="mt-2">
                      {mordgages.map((index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "10px",
                            display:
                              index <= visibleColumnIndex ? "block" : "none",
                          }}
                        >
                          <div style={{ width: "100%" }}>
                            <Tooltip
                              title={`Add your mortgage institution ${
                                index + 1
                              }`}
                            >
                              <TextField
                                fullWidth
                                type="text"
                                label={`Mortgage Institution ${index + 1}`}
                                id={`mortgageInstitution${index + 1}`}
                                size="normal"
                                onChange={(e) =>
                                  handleChanges1(e, "mortgageInstitution", {
                                    index,
                                  })
                                }
                                value={
                                  data.mortgages[index]
                                    ? data.mortgages[index].mortgageInstitution
                                    : ""
                                }
                              />
                            </Tooltip>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: "8px",
                            }}
                          >
                            <div style={{ width: "49.5%" }}>
                              <Tooltip
                                title={`Add your mortgage number ${index + 1}`}
                              >
                                <TextField
                                  fullWidth
                                  type="text"
                                  label={`Mortgage Number ${index + 1}`}
                                  id={`mortgageNumber${index + 1}`}
                                  size="normal"
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
                              </Tooltip>
                            </div>
                            <div style={{ width: "49.5%" }}>
                              <Tooltip title={`Add your mortgage ${index + 1}`}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label={`Mortgage ${index + 1}`}
                                  id={`mortgage${index + 1}`}
                                  size="normal"
                                  onChange={(e) =>
                                    handleChanges1(e, "mortgage", { index })
                                  }
                                  value={
                                    data.mortgages[index]
                                      ? data.mortgages[index].mortgage
                                      : ""
                                  }
                                  onClick={() => setIsTextFieldClicked3(true)}
                                  InputProps={{
                                    startAdornment: isTextFieldClicked3 ? (
                                      <div>$</div>
                                    ) : null,
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </div>
                          {index !== 0 && (
                            <div style={{ width: "100%", marginTop: "4px" }}>
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
                        <div style={{ width: "100%", marginTop: "2px" }}>
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

                    {/* </div> */}

                    <div
                      className="mt-2 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        marginTop: "-12px",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <Tooltip title="Upload your property related file it should be under 400 kb">
                          <div>
                            <label
                              style={{ display: "block", marginBottom: "5px" }}
                            >
                              Supporting Document{" "}
                              <span style={{ color: "red" }}></span>
                            </label>
                            <input
                              style={{
                                border: "solid 1px lightgray",
                                borderLeft: "none",
                                width: "100%",
                                borderRadius: "5px",
                              }}
                              // required
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

                    {/* <div className="mt-3">
                      <Tooltip title="Select The Type Of Property">
                        <FormControl
                          // required
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-label">
                            Select Your Single Beneficiary
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="username"
                            label="Select Your Single Beneficiary"
                            // onChange={(e) => handleUsernameChange(e)}
                            // value={selectedUsername}
                          >
                            {beneficiary.map((benif) => (
                              <MenuItem
                                key={benif.username}
                                value={benif.username}
                              >
                                {`${benif.firstName} ${benif.lastName}`}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div> */}

                    <div
                      className="bene-select mt-3"
                      onClick={handleShowBeneficiary}
                      style={{ cursor: "pointer" }}
                    >
                      Select Your Beneficiary
                    </div>

                    <div
                      className="mt-0 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        marginTop: "-12px",
                      }}
                    >
                      <div style={{ width: "100%" }} className="mt-2">
                        <Tooltip title="Enter notes for your real estate">
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
                            value={data.realEstate.notes}
                          />
                        </Tooltip>
                      </div>
                      {/* <div style={{ width: "49.5%" }}>
                        {mordgages.map((index) => (
                          <div
                            className="mt-2"
                            key={index}
                            style={{
                              flexDirection: "row",
                              display:
                                index <= visibleColumnIndex ? "flex" : "none",
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <Tooltip title={`Add your mortgage ${index + 1}`}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label={`mortgage ${index + 1}`}
                                  id={`mortgage${index + 1}`}
                                  size="normal"
                                  onChange={(e) =>
                                    handleChanges1(e, "mortgage", { index })
                                  }
                                  value={data.mortgages.mortgage}
                                  onClick={() => setIsTextFieldClicked3(true)}
                                  InputProps={{
                                    startAdornment: isTextFieldClicked3 ? (
                                      <div>$</div>
                                    ) : null,
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </div>
                        ))}
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
                      </div> */}
                    </div>

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
                    {/* Enter Your Benificiary Username */}

                    <Container className="text-center">
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
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
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
                            setShow1(false);
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

                    {showDetail.mortgage1 ||
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
                    )}

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
                          setShow1(false);
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
                    setShow1(true);
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
