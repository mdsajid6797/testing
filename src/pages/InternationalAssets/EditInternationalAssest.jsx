import React, { useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormFeedback,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import {
  downloadDocument,
  downloadTaxDocument,
  getToken,
  getUser,
  realEstateContent,
  realEstateContentGet,
  realEstateContentRemove,
  getBeneficiary,
} from "../../services/user-service";
//import { Accordion, data , AccordionContext } from "reactstrap";
import {
  TextField,
  TextareaAutosize,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "../../css/myestare.css";
// import Deletebutton from "./Deletebutton";
// import UpdateButton from "./UpdateButton";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import {
  faCalculator,
  faDownload,
  faLocationDot,
  faPlus,
  faXmark,
  faTriangleExclamation,
  faHouse,
  faBuildingColumns,
  faHandHoldingDollar,
  faGem,
  faShieldHalved,
  faCarSide,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropertyTaxCalculator from "../../components/TaxCalculatorUs";
import PropertyTaxCalculatorPopup from "../../components/TaxCalculatorUs";
import "./../../css/formPOPup.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  deleteRealEstate,
  getRealEstates,
  realEstates,
} from "../../services/RealEstate-service";
import { Country } from "country-state-city";
import {
  addInternationalAsset,
  getSingleInternationalAsset,
  updateInternationalAsset,
} from "../../services/InternationalAssetService";
import { downloadDocument1, getBank } from "../../services/bank-service";
import { useNavigate, useParams } from "react-router-dom";

export function EditInternationalAssestRealEstate() {
  const { id } = useParams();
  const navigate = useNavigate();
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };

  // set Add data
  const [data, setData] = useState({
    realEstate: {
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

  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "realEstate",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState(null);

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };

  const handleChangesRealEstate = (e, field) => {
    const newValue = e.target.value;

    setData((prevData) => ({
      ...prevData,
      realEstate: {
        ...prevData.realEstate,
        [field]: newValue,
      },
    }));
    // const value = data.realEstate.estPropertyVal;
    // setEstimatedTotalAmount(value);
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

  const [selectedImage1, setSelectedImage1] = useState(null);
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

  const [countryName, setCountryName] = React.useState("");

  const CountryHandleChange = (event) => {
    if (event.target === undefined) {
      setCountryName(event);
      data.country = event;
    } else {
      setCountryName(event.target.value);
      data.country = event.target.value;
    }
  };

  // post the form
  const AddForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInternationalAsset(token, id);

        setData({
          ...data,
          realEstate: res.assetData.realEstate,
          mortgages: res.assetData.mortgages,
          documents: res.assetData.documents,
          sharedDetails: res.assetData.sharedDetails,
        });
        setData1({
          ...data1,
          id: res.internationalAssetData.id,
          assetCaption: res.internationalAssetData.assetCaption,
          countryName: res.internationalAssetData.countryName,
        });
        const copiedSharedDetails = [...res.assetData.sharedDetails];

        setEstimatedTotalAmount(res.assetData.realEstate.estPropertyVal);

        if (copiedSharedDetails.length > 0) {
          setSharedDetails(res.assetData.sharedDetails);

          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
          }
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

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
      setData({ ...data, [field]: inputValue });
    }
  };

  const validateZipCode = (value) => {
    return /^\d{5}$/.test(value); // Validates a 5-digit numeric input
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
          });
      } else if (data.realEstate.zipCode.length > 5) {
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

  const [mortgage, setMortgage] = useState([{ name: "", notes: "" }]);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(1);
  const mortgages = [0, 1, 2, 3, 4];

  const [mordgage, setMordgage] = useState([]);
  // const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  const mordgages = [0, 1, 2, 3, 4];
  const handleAddColumn = () => {
    if (visibleColumnIndex < 4) {
      setMordgage([...mordgage, { label: visibleColumnIndex + 1 }]);
      setVisibleColumnIndex(visibleColumnIndex + 1);
    }
  };
  const handleRemoveColumn = (index) => {
    if (!data[`mortgage${index + 1}`]) {
      const updatedDivs = [...visibleDivs];
      updatedDivs[index] = false;
      setVisibleDivs(updatedDivs);
    }

    // Reset the input value
    setData((prevData) => ({
      ...prevData,
      [`mortgage${index + 1}`]: "",
    }));
  };
  const [visibleDivs, setVisibleDivs] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  let emaill = getUser().email;
  let to_name = getUser().firstName + " " + getUser().lastName;

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

  // field addition

  const addField = [0, 1, 2, 3, 4];
  const [visibleField, setVisibleField] = useState(0);

  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
  };

  let [otherPropertyTypes, setOtherPropertyTypes] = useState(false);

  //$ on click
  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);
  const [isTextFieldClicked2, setIsTextFieldClicked2] = useState(false);
  const [isTextFieldClicked3, setIsTextFieldClicked3] = useState(false);

  // for add field pop
  let [showAdditionField, SetshowAdditionField] = useState(false);

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
  const [distributedType, setDistributedType] = useState("");

  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);

  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    setEstimatedTotalAmount(data.realEstate.estPropertyVal);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
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
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
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
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };
  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={AddForm}>
                    <div style={{ display: "none" }}>
                      <input
                        type="email"
                        // value={emaill}
                        // value="pawandeep1042@gmail.com"
                        // name="userEmail"
                      />
                    </div>

                    <div style={{ display: "none" }}>
                      <input type="text" value={to_name} name="toname" />
                    </div>

                    <div style={{ display: "none" }}>
                      <input
                        type="text"
                        value={data.propertyType}
                        name="propertycaptionname"
                      />
                    </div>

                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-2">
                      <Tooltip title="Enter Heading For Property ">
                        <TextField
                          required
                          type="text"
                          label="Property Heading"
                          id="propertyCaption"
                          // name="propertycaptionname" // just for email purpose
                          size="normal"
                          onChange={(e) =>
                            handleChangesRealEstate(e, "propertyCaption")
                          }
                          value={data.realEstate.propertyCaption}
                        />
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
                            onChange={(e) =>
                              handleChangesRealEstate(e, "propertyType")
                            }
                            value={data.realEstate.propertyType}
                          >
                            <MenuItem value={"Residential"}>
                              Residential
                            </MenuItem>
                            <MenuItem value={"Commercial"}>Commercial</MenuItem>
                            <MenuItem value={"Industrial"}>Industrial</MenuItem>
                            <MenuItem value={"Land"}>Land</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>

                    {/* Conditionally render the input field for custom text if "Other" is selected */}
                    {data.propertyType === "Other" && (
                      <div className="mt-3">
                        <Tooltip title="Enter Your Apartment Number ">
                          <TextField
                            fullWidth
                            type="text"
                            label="Enter Other Property"
                            id="otherprop"
                            size="normal"
                            onChange={(e) =>
                              handleChangesRealEstate(e, "otherPropertyType")
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
                            onChange={(e) =>
                              handleChangesRealEstate(e, "streetAddress")
                            }
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
                            onChange={(e) =>
                              handleChangesRealEstate(e, "aptNumber")
                            }
                            value={data.realEstate.aptNumber}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      className="mt-3 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        marginTop: "-12px",
                      }}
                    >
                      <div style={{ width: "49.5%" }}>
                        <Tooltip title="Enter Your Zip-code ">
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="Zip Code"
                            id="zipCode"
                            size="normal"
                            onChange={(e) =>
                              handleChangesRealEstate(e, "zipCode")
                            }
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
                              <Tooltip title="Automatically populate based on the zip code">
                                <TextField
                                  required
                                  fullWidth
                                  type="text"
                                  label="City/Town"
                                  id="placename"
                                  size="normal"
                                  onChange={(e) => handleChanges(e, "city")}
                                  value={data.city}
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
                            disabled // Disable the field to prevent manual input
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      className="mt-3 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* <div style={{ width: "49.5%" }}>
                              <Tooltip title="Automatically populate based on the zip code">
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

                      {/* <div className="" style={{ width: "49.5%" }}>
                              <Tooltip title="Automatically populate based on the zip code">
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
                          label="State"
                          value={data.realEstate.state}
                          required
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
                            disabled // Disable the field to prevent manual input
                          />
                        </Tooltip>
                      </div>
                      <div style={{ display: "none" }}>
                        {/* Hidden input for submission */}
                        <input
                          type="text"
                          name="country"
                          value={data.realEstate.country}
                          required
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
                            disabled // Disable the field to prevent manual input
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your estimated Property Value">
                          <TextField
                            fullWidth
                            // placeholder="$"
                            required
                            type="number"
                            label="Estimated Property Value"
                            id="estPropertyVal"
                            size="normal"
                            onChange={(e) =>
                              handleChangesRealEstate(e, "estPropertyVal")
                            }
                            value={data.realEstate.estPropertyVal}
                            // onClick={() => setIsTextFieldClicked2(true)}
                            InputProps={{
                              startAdornment: <div>$</div>,
                            }}
                          />
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your Estimated Annual Property Tax">
                          <TextField
                            required
                            placeholder="$"
                            fullWidth
                            type="number"
                            label="Estimated Annual Property Tax"
                            id="propertyTax"
                            size="normal"
                            onChange={(e) =>
                              handleChangesRealEstate(e, "propertyTax")
                            }
                            value={data.realEstate.propertyTax}
                            // onClick={() => setIsTextFieldClicked(true)}
                            InputProps={{
                              startAdornment: <div>$</div>,
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    {/* <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "10px" }}>
                            {mortgages.map((index) => (
                              <div key={index} className="mt-3" style={{
                                display: data[`mortgage${index + 1}`] || '' || index <= visibleColumnIndex ? "flex" : "none",
                                // display: index <= visibleColumnIndex ? "flex" : "none",
                                width: "48.5%",
                              }}>
                                <div style={{ width: "100%", marginRight: "5px", }}>
                                  <Tooltip title={`Add your mortgage ${index + 1}`}>
                                    <TextField
                                      fullWidth
                                      type="number"
                                      label={`mortgage ${index + 1}`}
                                      id={`mortgage${index + 1}`}
                                      size="normal"
                                      onChange={(e) => handleChanges(e, `mortgage${index + 1}`)}
                                      value={data[`mortgage${index + 1}`] || ''}
                                      InputProps={{
                                        startAdornment: <div>$</div>,
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                            ))}
                            <div style={{ marginTop: "7px", display: "flex", alignItems: "center" }}>
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
                                onClick={handleAddColumn}>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </div>
                          </div> */}
                    <div style={{ width: "49.5%" }}>
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
                                value={data.mortgages[index]?.mortgage}
                                // onClick={() => setIsTextFieldClicked3(true)}
                                // InputProps={{
                                //   startAdornment: isTextFieldClicked3 ? <div>$</div> : null,
                                // }}
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
                    </div>

                    {/* <div className="form1-double" style={{ display: "flex", gap: "5px" }}> */}
                    {/* <div className="mt-3" style={{ width: "49.5%" }}>
                              <Tooltip title="File size should be under 400 kB">
                                <label style={{ display: 'block', marginBottom: '5px' }}>Add Tax Document</label>
                                <input
                                  style={{
                                    border: "solid 1px lightgray",
                                    borderLeft: "none",
                                    width: "100%",
                                    borderRadius: "5px",
                                  }}
                                  type="file"
                                  name="taxDocs"
                                  id="taxDocument"
                                  onChange={handleImageChange1}
                                />
                              </Tooltip>
                            </div> */}
                    <div className="mt-3">
                      <Tooltip title="File size should be under 400 kB">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
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
                          multiple
                          type="file"
                          name="myfile"
                          id="exampleFile"
                          onChange={handleImageChange}
                          accept=".pdf"
                        />
                      </Tooltip>
                    </div>
                    {/* </div> */}

                    {/* <div className="mt-3">
                            <Tooltip title="Enter Caption for your tax document">
                              <TextField
                                fullWidth
                                type="text"
                                label="Caption"
                                id="caption"
                                size="normal"
                                onChange={(e) => handleChanges(e, "caption")}
                                value={data.caption}
                              />
                            </Tooltip>
                          </div> */}

                    {/* <Tooltip title="Select Your Beneficiary Username">
                            <FormGroup className="Property-textfield">
                              <Label className="Property-headingname" for="property">
                                Select Your Beneficiary Username
                              </Label>
    
                              <Input
                                className="Property-inputfiled"
                                type="select"
                                name="select"
                                id="property"
                                onChange={(e) => handleChanges(e, "benificiary")}
                                value={data.benificiary}
                              >
                                <option defaultValue aria-readonly>
                                  <p>Select Your Username</p>
                                </option>
                                {beneficiary.map((benif) => (
                                  <option key={benif.username} value={benif.username}>
                                    {benif.username}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                          </Tooltip> */}
                    <div
                      className="bene-select mt-3"
                      onClick={handleShowBeneficiary}
                      style={{ cursor: "pointer" }}
                    >
                      Select Your Beneficiary
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter notes for your real estate">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChangesRealEstate(e, "notes")}
                          value={data.realEstate.notes}
                        />
                      </Tooltip>
                    </div>

                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}

      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}

export function EditInternationalAssestBank() {
  const { id } = useParams();
  const navigate = useNavigate();
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };
  const [data, setData] = useState({
    bank: {
      bankName: "",
      safetyBox: "",
      safetyBoxNumber: "",
      notes: "",
      bankType: "",
      totalAmount: "",
    },
    accounts: [
      {
        accountType: "",
        accountNumber: "",
        balance: "",
      },
    ],
    documents: [
      {
        fileName: "",
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

  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "bank",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const [selectedImage, setSelectedImage] = useState([]);
  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };
  const handleChangesBank = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      bank: {
        ...prevData.bank,
        [field]: newValue,
      },
    }));
    const balances = data.accounts.map((account) => account.balance || 0);
    const newTotalBalance = balances.reduce(
      (acc, curr) => acc + parseFloat(curr),
      0
    );
    setEstimatedTotalAmount(newTotalBalance);
  };
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  const [account, setAccount] = useState([]);
  const [distributedType, setDistributedType] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState([]);
  const [bankFieldClicked, setBankFieldClicked] = useState(false);

  const multipleAccount = [0, 1, 2, 3];
  const handleAddBank = () => {
    if (visibleColumnIndex < 3) {
      setAccount([...account, { label: visibleColumnIndex + 1 }]);
      setVisibleColumnIndex(visibleColumnIndex + 1);
    }
  };

  const [selectedBankTypes, setSelectedBankTypes] = useState(
    Array(multipleAccount.length).fill("")
  );
  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  const handleReset = () => {
    setbeneVisible(false);
    setDistributedType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  // Handle image
  const handleImageChange = (event, maxFilesAllowed) => {
    const selectedFiles = event.target.files;
    const allowedExtensions = ["pdf"];
    if (selectedFiles) {
      const selectedFilesArray = Array.from(selectedFiles);
      if (selectedFilesArray.length > maxFilesAllowed) {
        // Notify the user if they exceed the file limit
        toast.error(`You can only select up to ${maxFilesAllowed} files.`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        event.target.value = ""; // Clear the file input
      } else {
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
          const invalidExtensions = invalidFiles
            .map((file) => file.name.split(".").pop())
            .join(", ");
          toast.error(
            `Invalid file extensions: ${invalidExtensions}. Please select valid document formats.`,
            {
              position: toast.POSITION.BOTTOM_CENTER,
            }
          );
          event.target.value = "";
        }
      }
    }
  };
  const [bankName, setBankName] = React.useState("");
  const bankHandleChange = (event) => {
    if (event.target === undefined) {
      setBankName(event);
      data.bank = event;
    } else {
      setBankName(event.target.value);
      data.bank = event.target.value;
    }
  };
  // post the form
  const BankForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };
  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);
  const [typeaccount, setTypeccount] = useState([]);
  // useEffect(() => {
  //   getData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInternationalAsset(token, id);

        setTypeccount(res);
        setData({
          ...data,
          bank: res.assetData.bank,
          accounts: res.assetData.accounts,
          documents: res.assetData.documents,
          sharedDetails: res.assetData.sharedDetails,
        });

        setData1({
          ...data1,
          id: res.internationalAssetData.id,
          assetCaption: res.internationalAssetData.assetCaption,
          countryName: res.internationalAssetData.countryName,
        });
        //   setChecked(res.bank.safetyBox);
        const copiedSharedDetails = [...res.assetData.sharedDetails];

        setBankName(res.assetData.bank);
        setEstimatedTotalAmount(res.assetData.bank.totalAmount);

        if (copiedSharedDetails.length > 0) {
          setSharedDetails(res.assetData.sharedDetails);

          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
          }
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  const [category, setCategory] = useState([]);
  const getBankName = (bankName) => {
    if (category !== null) {
      return category.some((item) => item.bank.bankName === bankName);
    } else {
      return false;
    }
  };

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
  const [visibleField, setVisibleField] = useState(0);
  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
  };
  const accountType = [
    "Checking Account",
    "Savings Account",
    "Investment Account",
    "C.D Account",
  ];
  const [benevisible, setbeneVisible] = useState(false);
  let [show1, setShow1] = useState(false);
  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
  };
  let [otherPropertyTypes, setOtherPropertyTypes] = useState(false);
  const [isChecked, setChecked] = useState(""); // Convert saftyBox value to boolean
  const handleSwitchChange = () => {
    if (isChecked === "true") {
      setChecked("felse");
      data.bank.safetyBoxNumber = "";
      data.bank.safetyBox = "felse";
    } else {
      setChecked("true");
      data.bank.safetyBox = "true";
    }
  };

  const handleChanges1 = (e, field, { index }) => {
    const { value } = e.target;

    if (field === "accountType") {
      setSelectedBankTypes((prevSelectedBankTypes) => {
        const newSelectedBankTypes = [...prevSelectedBankTypes];
        newSelectedBankTypes[index] = value;
        return newSelectedBankTypes;
      });
    }
    setData((prevData) => {
      const updatedAccounts = [...prevData.accounts];
      if (!updatedAccounts[index]) {
        updatedAccounts[index] = {};
      }
      updatedAccounts[index][field] = value;
      return {
        ...prevData,
        accounts: updatedAccounts,
      };
    });

    let totalBalanceFind = 0;
    data.accounts.forEach((account) => {
      totalBalanceFind += parseFloat(account.balance);
      setEstimatedTotalAmount(totalBalanceFind);
    });
  };

  let [visible, setVisible] = useState(0);
  const [hasEffectRun, setHasEffectRun] = useState(false);
  const bankarray1 = [
    typeaccount.accountNo1,
    typeaccount.accountNo2,
    typeaccount.accountNo3,
    typeaccount.accountNo4,
    typeaccount.accountNo5,
  ];
  const [bankarray, setBankArray] = useState([]);

  let [updatedVisible, setupdatedVisible] = useState([]);
  useEffect(() => {}, [hasEffectRun, bankarray, data]);
  const ben = (newType) => {
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };
  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };
  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };
  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      });
    }
  };
  const handleAddColumn = () => {
    if (visible <= 3) {
      setHasEffectRun(true);
      const updatedVisible = visible + 1;
      setBankArray((prevArray) => [...prevArray, updatedVisible]);
      setVisible(updatedVisible);
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
  };

  const calculateDistributedAmount = (
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
    }
    return "0.00";
  };

  const getAccountType = (bankName) => {};
  const handleBeneficiaryClose = (beneficiary) => {
    const updatedBeneficiaries = selectedBeneficiaries.filter(
      (b) => b !== beneficiary
    );
    setSelectedBeneficiaries(updatedBeneficiaries);
    const updatedDetails = { ...beneficiaryDetails };
    delete updatedDetails[beneficiary];
    setBeneficiaryDetails(updatedDetails);
  };
  const handleSave = () => {
    toast.success("Saved successfully!");
    setbeneVisible(false);
    var i = 0;
    Object.keys(beneficiaryDetails).forEach((key) => {
      const beneficiaryPercentage = parseFloat(
        beneficiaryDetails[key]?.percentage
      );
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
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
      return "Benificiary not found";
    }
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  {" "}
                  <Form onSubmit={BankForm}>
                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>

                    <div
                      className="form1-double"
                      style={{
                        display: "flex",
                        gap: "10px",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="mt-3"
                        style={{ width: "49.5%", flex: "1 1" }}
                      >
                        <FormControl
                          required
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-label">
                            {data.bank.bankType === "other"
                              ? "Bank Type"
                              : "Bank Name"}
                          </InputLabel>

                          <Select
                            labelId="demo-simple-select-label"
                            id="banks"
                            label={
                              data.bank.bankType === "other"
                                ? "Bank Type"
                                : "Bank Name"
                            }
                            onChange={bankHandleChange}
                            value={
                              data.bank.bankType === "other"
                                ? data.bank.bankType
                                : data.bank.bankName
                            }
                            name="bankname"
                            className="custom-select"
                            readOnly
                            disabled
                          >
                            <MenuItem value={"JPMorgan Chase & Co"}>
                              <img
                                src="/logos/J.P._Morgan_Chase_logo_PNG3.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;JPMorgan Chase & Co
                            </MenuItem>
                            <MenuItem value={"Bank of America"}>
                              <img
                                src="/logos/Bank_of_America_logo_PNG4.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Bank of America
                            </MenuItem>
                            <MenuItem value={"Wells Fargo & Co"}>
                              <img
                                src="/logos/Wells_fargo_logo_PNG2.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Wells Fargo & Co
                            </MenuItem>
                            <MenuItem value={"Citigroup Inc"}>
                              <img
                                src="/logos/Citigroup_logo_PNG1.png"
                                style={{
                                  width: "40px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Citigroup Inc
                            </MenuItem>
                            <MenuItem value={"U.S. Bancorp"}>
                              <img
                                src="/logos/US-Bank-Logo-PNG3.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;U.S. Bancorp
                            </MenuItem>
                            <MenuItem value={"PNC bank"}>
                              <img
                                src="/logos/PNC_Bank_logo_PNG1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;PNC bank
                            </MenuItem>
                            <MenuItem value={"TD Bank"}>
                              <img
                                src="/logos/TD_Bank_logo_PNG1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;TD Bank
                            </MenuItem>
                            <MenuItem value={"Capital One"}>
                              <img
                                src="/logos/Capital_One_logo_PNG1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Capital One
                            </MenuItem>
                            <MenuItem value={"Fifth Third Bank"}>
                              <img
                                src="/logos/Harris-Teeter-Logo-PNG_003-1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Fifth Third Bank
                            </MenuItem>
                            <MenuItem value={"Ally Financial Inc"}>
                              <img
                                src="/logos/Ally_Financial_logo_PNG4.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Ally Financial Inc
                            </MenuItem>
                            <MenuItem
                              value={"Huntington Bancshares Incorporated"}
                            >
                              <img
                                src="/logos/huntington.webp"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Huntington Bancshares Incorporated
                            </MenuItem>
                            <MenuItem value={"KeyCorp"}>
                              <img
                                src="/logos/KeyBank_logo_PNG7.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;KeyCorp
                            </MenuItem>
                            <MenuItem
                              value={"other"}
                              onClick={() => {
                                setOtherPropertyTypes(!otherPropertyTypes);
                              }}
                            >
                              Other
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      {/* Conditionally render the input field for custom text if "Other" is selected */}
                    </div>
                    {data.bank.bankType === "other" && (
                      <div className="mt-3">
                        <Tooltip title="Enter Your Other Bank ">
                          <TextField
                            fullWidth
                            type="text"
                            label="Bank Name"
                            id="bankName"
                            size="normal"
                            onChange={(e) => handleChangesBank(e, "bankName")}
                            value={data.bank.bankName}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    )}
                    <div>
                      {multipleAccount.map((index) => (
                        <div
                          className="mt-2"
                          key={index}
                          style={{
                            flexDirection: "column",
                            display:
                              index <= visibleColumnIndex ? "flex" : "none",
                          }}
                        >
                          <div style={{ width: "100%", marginBottom: "8px" }}>
                            <Tooltip
                              title={`Add your bank details for bank ${
                                index + 1
                              }`}
                            >
                              <FormControl
                                fullWidth
                                sx={{ minWidth: 120 }}
                                size="small"
                              >
                                <InputLabel id={`accountType${index + 1}`}>
                                  Account Type {index === 0 && <span>*</span>}
                                </InputLabel>
                                <Select
                                  labelId={`AccountType${index + 1}`}
                                  id={`accountType${index + 1}`}
                                  label="Account Type"
                                  // value={data.accounts.accountType}
                                  // onChange={(e) => handleChanges(e, `accountType${index + 1}`)}
                                  value={
                                    data.accounts[index]?.accountType || ""
                                  }
                                  onChange={(e) =>
                                    handleChanges1(e, "accountType", { index })
                                  }
                                  onClick={() => setBankFieldClicked(true)}
                                  required={index === 0}
                                >
                                  <MenuItem
                                    value="Checking Account"
                                    disabled={
                                      selectedBankTypes.includes(
                                        "Checking Account"
                                      ) ||
                                      data.accounts.some(
                                        (account) =>
                                          account.accountType ===
                                            "Checking Account" &&
                                          account.accountType !==
                                            data.accounts[index]?.accountType
                                      )
                                    }
                                  >
                                    {" "}
                                    Checking Account
                                  </MenuItem>

                                  <MenuItem
                                    value="Savings Account"
                                    disabled={
                                      selectedBankTypes.includes(
                                        "Savings Account"
                                      ) ||
                                      data.accounts.some(
                                        (account) =>
                                          account.accountType ===
                                            "Savings Account" &&
                                          account.accountType !==
                                            data.accounts[index]?.accountType
                                      )
                                    }
                                  >
                                    Savings Account
                                  </MenuItem>
                                  <MenuItem
                                    value="Investment Account"
                                    disabled={
                                      selectedBankTypes.includes(
                                        "Investment Account"
                                      ) ||
                                      data.accounts.some(
                                        (account) =>
                                          account.accountType ===
                                            "Investment Account" &&
                                          account.accountType !==
                                            data.accounts[index]?.accountType
                                      )
                                    }
                                  >
                                    Investment Account
                                  </MenuItem>
                                  <MenuItem
                                    value="C.D Account"
                                    disabled={
                                      selectedBankTypes.includes(
                                        "C.D Account"
                                      ) ||
                                      data.accounts.some(
                                        (account) =>
                                          account.accountType ===
                                            "C.D Account" &&
                                          account.accountType !==
                                            data.accounts[index]?.accountType
                                      )
                                    }
                                  >
                                    C.D Account
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Tooltip>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ width: "49%" }}>
                              <Tooltip
                                title={`Add your bank details for bank ${
                                  index + 1
                                }`}
                              >
                                <TextField
                                  fullWidth
                                  type="number"
                                  label={`BankAccount ${index + 1}`}
                                  id={`BankAccount${index + 1}`}
                                  size="normal"
                                  required={index === 0}
                                  // onChange={(e) => handleChanges(e, `BankAccount${index + 1}`)}
                                  onChange={(e) =>
                                    handleChanges1(e, "accountNumber", {
                                      index,
                                    })
                                  }
                                  // value={data.accounts[0].accountNumber}
                                  // value={data.accounts.accountNumber}
                                  value={
                                    data.accounts[index]?.accountNumber || ""
                                  }
                                />
                              </Tooltip>
                            </div>
                            <div style={{ width: "49%" }}>
                              <Tooltip
                                title={`Add your bank details for bank ${
                                  index + 1
                                }`}
                              >
                                <TextField
                                  fullWidth
                                  type="number"
                                  label={`Account Balance ${index + 1}`}
                                  id={`balance${index + 1}`}
                                  size="normal"
                                  // onChange={(e) => handleChanges(e, `balance${index + 1}`)}
                                  onChange={(e) =>
                                    handleChanges1(e, "balance", { index })
                                  }
                                  // value={data.accounts[0].balance}
                                  // value={data.accounts.balance}
                                  required={index === 0}
                                  value={data.accounts[index]?.balance || ""}
                                  onClick={() => setBankFieldClicked(true)}
                                  InputProps={{
                                    startAdornment: bankFieldClicked ? (
                                      <div>$</div>
                                    ) : null,
                                  }}
                                />
                              </Tooltip>
                            </div>
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
                          onClick={handleAddBank}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                    </div>

                    {/* For apt number field */}

                    <div
                      className="mt-3 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        gap: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: "49.5%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <div
                          className="txt"
                          style={{
                            alignSelf: "center",
                            marginRight: "10px",
                            textAlign: "center",
                            flex: "1 1 100%",
                          }}
                        >
                          Safety Box
                        </div>

                        <div
                          className="switch"
                          style={{
                            flex: "1 1 100%",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={isChecked === "true"}
                                onChange={handleSwitchChange}
                                color="primary"
                                size="normal"
                              />
                            }
                            label={isChecked === "true" ? "Yes" : "No"}
                            labelPlacement="end"
                          />
                        </div>
                      </div>

                      {isChecked === "true" && (
                        <div
                          className="saftybox-caption"
                          style={{
                            height: "33px",
                            borderRadius: "5px",
                            width: "50%",
                          }}
                        >
                          <Tooltip title="Enter your SafetyBox ID">
                            <TextField
                              // placeholder="$"

                              type="text"
                              label="Safety Box ID"
                              id="safetyBoxNumber"
                              size="normal"
                              onChange={(e) =>
                                handleChangesBank(e, "safetyBoxNumber")
                              }
                              value={data.bank.safetyBoxNumber}
                            />
                          </Tooltip>
                        </div>
                      )}

                      {/* </Tooltip> */}
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Add your banks related file">
                        <div className="mt-3">
                          <label
                            style={{ display: "block", marginBottom: "5px" }}
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
                            onChange={(e) => handleImageChange(e, 5)}
                            accept=".pdf"
                            multiple
                          />
                        </div>
                      </Tooltip>
                    </div>
                    {/* beneficiary  */}
                    <div
                      className="bene-select mt-3"
                      onClick={handleShowBeneficiary}
                      style={{ cursor: "pointer" }}
                    >
                      Select Your Beneficiary
                    </div>
                    {/* notes */}
                    <div className="mt-3">
                      <Tooltip title="Enter notes for your bank">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChangesBank(e, "notes")}
                          value={data.bank.notes}
                        />
                      </Tooltip>
                    </div>
                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}

      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}

export function EditInternationalAssetInvestment() {
  const { id } = useParams();
  const navigate = useNavigate();

  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };

  const [data, setData] = useState({
    investment: {
      investment: "",
      nameOfTheInvestment: "",
      investmentCaption: "",
      notes: "",
      totalAmount: "",
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

  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "investment",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const [selectedImage, setSelectedImage] = useState([]);

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  // const handleChanges = (event, property) => {
  //   setData({ ...data, [property]: event.target.value });
  // };
  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      investment: {
        ...prevData.investment,
        [field]: newValue,
      },
    }));
    setEstimatedTotalAmount(data.investment.totalAmount);
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
  // auto matic clear the data
  // const resetData = () => {
  //   setData({
  //     Investment_Id: investmentID,
  //     investment: "",
  //     totalAmount: "",
  //     nameOfTheInvestment: "",
  //     notes: "",
  //     benificiary: "",
  //     investmentCaption:""
  //   });
  // };

  const investmentForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }

    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const [investmentName, setInvestmentName] = React.useState("");

  const investmenthandleChange = (event) => {
    if (event.target === undefined) {
      setInvestmentName(event);
      data.investment = event;
    } else {
      setInvestmentName(event.target.value);
      data.investment = event.target.value;
    }
  };

  //Get data show
  const [category, setCategory] = useState([]);

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInternationalAsset(token, id);

        setData({
          ...data,
          investment: res.assetData.investment,
          documents: res.assetData.documents,
          sharedDetails: res.assetData.sharedDetails,
        });

        setData1({
          ...data1,
          id: res.internationalAssetData.id,
          assetCaption: res.internationalAssetData.assetCaption,
          countryName: res.internationalAssetData.countryName,
        });

        const copiedSharedDetails = [...res.assetData.sharedDetails];

        setEstimatedTotalAmount(res.assetData.investment.totalAmount);

        if (copiedSharedDetails.length > 0) {
          setSharedDetails(res.assetData.sharedDetails);

          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
          }
        }
      } catch (error) {}
    };

    fetchData();
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

  // field addition

  const addField = [0, 1, 2, 3, 4];
  const [visibleField, setVisibleField] = useState(0);

  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
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
  const [distributedType, setDistributedType] = useState("");

  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);

  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
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
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
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
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };
  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={investmentForm}>
                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter name of the investment">
                        <FormControl
                          required
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-label">
                            Investment
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="investment"
                            label="Investment"
                            onChange={(e) => handleChanges(e, "investment")}
                            value={data.investment.investment}
                          >
                            <MenuItem value={"Stocks"}>Stocks</MenuItem>
                            <MenuItem value={"Mutual Funds"}>
                              Mutual Funds
                            </MenuItem>
                            <MenuItem value={"Bonds"}>Bonds</MenuItem>
                            <MenuItem value={"401K"}>401K</MenuItem>
                            <MenuItem value={"Exchange-Traded Funds (ETFs)"}>
                              Exchange-Traded Funds (ETFs)
                            </MenuItem>
                            <MenuItem value={"Certificates of Deposit (CDs)"}>
                              Certificates of Deposit (CDs)
                            </MenuItem>
                            <MenuItem value={"Money Market Funds"}>
                              Money Market Funds
                            </MenuItem>
                            <MenuItem value={"Alternative Investments"}>
                              Alternative Investments
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>

                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter the Name Of Your Exchange ">
                          <TextField
                            required
                            fullWidth
                            type="text"
                            label="Name Of Exchange"
                            id="nameOfTheInvestment"
                            size="normal"
                            onChange={(e) =>
                              handleChanges(e, "nameOfTheInvestment")
                            }
                            value={data.investment.nameOfTheInvestment}
                          />
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your Estimated Amount ">
                          <TextField
                            required
                            fullWidth
                            placeholder="$"
                            type="number"
                            label="Estimated Amount"
                            id="totalAmount"
                            size="normal"
                            onChange={(e) => handleChanges(e, "totalAmount")}
                            value={data.investment.totalAmount}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Caption for Investment ">
                        <TextField
                          required
                          fullWidth
                          type="text"
                          label="Investment Caption"
                          id="captionOfTheInvestment"
                          size="normal"
                          onChange={(e) =>
                            handleChanges(e, "investmentCaption")
                          }
                          value={data.investment.investmentCaption}
                        />
                      </Tooltip>
                    </div>

                    {/* beneficiary  */}
                    {/* <Tooltip title="Select Your Beneficiary Username">
                        <FormGroup className="Property-textfield">
                          <Label className="Property-headingname" for="property">
                            Select Your Beneficiary Username
                          </Label>

                          <Input
                            className="Property-inputfiled"
                            type="select"
                            name="select"
                            id="property"
                            onChange={(e) => handleChanges(e, "benificiary")}
                            value={data.benificiary}
                          >
                            <option defaultValue aria-readonly>
                              <p>Select Your Username</p>
                            </option>
                            {beneficiary.map((benif) => (
                              <option key={benif.username} value={benif.username}>
                                {benif.username}
                              </option>
                            ))}
                          </Input>
                          {/* </Tooltip> */}
                    {/* </FormGroup></Tooltip>  */}

                    <div className="mt-3">
                      <Tooltip title="Add your banks related file">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
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
                          multiple
                          type="file"
                          name="myfile"
                          id="exampleFile"
                          onChange={handleImageChange}
                          accept=".pdf"
                        />
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
                      <Tooltip title="Enter notes for your bank">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.investment.notes}
                        />
                      </Tooltip>
                    </div>

                    {/* adding new field */}
                    {/* <div style={{ marginTop: "7px", display: "flex", alignItems: "center" }}>
                      <Tooltip title="Add New Field ">
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
                      </Tooltip>
                    </div> */}
                    {/* <div style={{ width: "99.5%", display: "flex", flexWrap: "wrap", marginTop: "12px" }}>
                        {addField.map((index) => (
                          <div className="mt-2" key={index} style={{ flexDirection: "row", flexBasis: "50%", display: index < 5 ? "flex" : "none", }}>
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
                            
                          </div>
                        ))}

                      </div> */}
                    {/* adding end field */}

                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {/* <Button
                          onClick={resetData}
                          className="my-estate-clear-btn"
                          type="reset"
                          outline
                        >
                          Clear
                        </Button> */}
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}

      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}

export function EditInternationalAssetOtherAssets() {
  const { id } = useParams();
  const navigate = useNavigate();
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };

  const [data, setData] = useState({
    otherAsset: {
      assetCaption: "",
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

  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "otherAsset",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

  // const handleChanges = (event, property) => {
  //     setData({ ...data, [property]: event.target.value });
  // };
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
    // setEstimatedTotalAmount(100);
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

  // auto matic clear the data
  const resetData = () => {
    setData({
      // otherAssets_Id: otherAssets_Id,
      otherAssets1: "",
      otherAssets2: "",
      otherAssets3: "",
      otherAssets4: "",
      otherAssets5: "",
      exampleFile: "",
      notes: "",
      benificiary: "",
      assetCaption: "",
    });
  };
  // Set the form
  const OtherAssestForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();

    if (data.otherAssets1 === "") {
      toast.error("Please fill all required feilds.");
      return;
    }
    //create form data to send a file and remaining class data
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {});
  };
  // const [category, setCategory] = useState([]);
  const getData = () => {};

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInternationalAsset(token, id);

        setData({
          ...data,
          otherAsset: res.assetData.otherAsset,
          documents: res.assetData.documents,
          sharedDetails: res.assetData.sharedDetails,
        });
        setData1({
          ...data1,
          id: res.internationalAssetData.id,
          assetCaption: res.internationalAssetData.assetCaption,
          countryName: res.internationalAssetData.countryName,
        });
        const copiedSharedDetails = [...res.assetData.sharedDetails];

        // setEstimatedTotalAmount(res.realEstate.estPropertyVal);
        setEstimatedTotalAmount("500");

        if (copiedSharedDetails.length > 0) {
          setSharedDetails(res.assetData.sharedDetails);

          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [otherAssets, setOtherAssets] = useState([{ name: "", notes: "" }]);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  const otherAssetss = [0, 1, 2, 3, 4];
  const handleAddColumn = () => {
    if (visibleColumnIndex < 4) {
      setOtherAssets([...otherAssets, { label: visibleColumnIndex + 1 }]);

      setVisibleColumnIndex(visibleColumnIndex + 1);
    }
  };
  const handleRemoveColumn = (index) => {
    if (!data[`otherAssets${index + 1}`]) {
      const updatedDivs = [...visibleDivs];
      updatedDivs[index] = false;
      setVisibleDivs(updatedDivs);
    }

    // Reset the input value
    setData((prevData) => ({
      ...prevData,
      [`otherAssets${index + 1}`]: "",
    }));
  };
  const [visibleDivs, setVisibleDivs] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
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

  // field addition

  const addField = [0, 1, 2, 3, 4];
  const [visibleField, setVisibleField] = useState(0);

  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
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
  const [distributedType, setDistributedType] = useState("");

  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);

  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
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
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
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
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={OtherAssestForm}>
                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div
                      className="form1-double"
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      {otherAssetss.map((index) => (
                        <div
                          key={index}
                          className="mt-3"
                          style={{
                            flexDirection: "row",
                            width: "49.5%",
                            display: data[`otherAssets${index + 1}`]
                              ? "flex"
                              : "none" || index <= visibleColumnIndex
                              ? "flex"
                              : "none",
                          }}
                        >
                          <div style={{ width: "100%", marginRight: "5px" }}>
                            <Tooltip title="Enter your Asset">
                              <TextField
                                required={index === 0}
                                fullWidth
                                type="text"
                                label={`Assets ${index + 1}`}
                                id={`otherAssets${index + 1}`}
                                size="normal"
                                onChange={(e) =>
                                  handleChanges(e, `otherAssets${index + 1}`)
                                }
                                value={
                                  data.otherAsset[`otherAssets${index + 1}`] ||
                                  ""
                                }
                              />
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter Caption for other Assets">
                        {/* use text area here  */}
                        <TextField
                          fullWidth
                          type="text"
                          label="Assets Caption"
                          id="assetCaption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "assetCaption")}
                          value={data.otherAsset.assetCaption}
                        />
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Add your assets related file">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
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
                          onChange={handleImageChange}
                          accept=".pdf"
                          multiple
                        />
                      </Tooltip>
                    </div>

                    {/* beneficiary  */}
                    {/* <Tooltip title="Select Your Beneficiary Username">
                      <FormGroup className="Property-textfield">
                        <Label className="Property-headingname" for="property">
                          Select Your Beneficiary Username
                        </Label>

                        <Input
                          className="Property-inputfiled"
                          type="select"
                          name="select"
                          id="property"
                          onChange={(e) => handleChanges(e, "benificiary")}
                          value={data.benificiary}
                        >
                          <option defaultValue aria-readonly>
                            <p>Select Your Username</p>
                          </option>
                          {beneficiary.map((benif) => (
                            <option key={benif.username} value={benif.username}>
                              {benif.username}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Tooltip> */}

                    <div
                      className="bene-select mt-3"
                      onClick={handleShowBeneficiary}
                      style={{ cursor: "pointer" }}
                    >
                      Select Your Beneficiary
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter notes for your ">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.otherAsset.notes}
                        />
                      </Tooltip>
                    </div>

                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        color="success"
                        outline
                        className="my-estate-add-btn"
                      >
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}
      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}

export function EditInternationalAssetIncome() {
  const { id } = useParams();
  const navigate = useNavigate();
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };
  // set Add data
  const [data, setData] = useState({
    income: {
      incomeCaption: "",
      incomeAmount: "",
      businessSource: "",
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

  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "income",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

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

  // const handleChanges = (event, property) => {
  //   setData({ ...data, [property]: event.target.value });
  // };
  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      income: {
        ...prevData.income,
        [field]: newValue,
      },
    }));
    setEstimatedTotalAmount(data.income.incomeAmount);
  };
  // auto matic clear the data
  // const resetData = () => {
  //   setData({
  //     activeIncome_Id: activeIncome_Id,
  //     payCheck: "",
  //     businessSource: "",
  //     // customize: "",
  //     notes: "",
  //     benificiary: "",
  //     incomeCaption:""
  //   });
  // };

  // post the form
  const activeincomeForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInternationalAsset(token, id);

        setData((prevData) => ({
          ...prevData,
          income: res.assetData.income,
          documents: res.assetData.documents,
          sharedDetails: res.assetData.sharedDetails,
        }));

        setData1({
          ...data1,
          id: res.internationalAssetData.id,
          assetCaption: res.internationalAssetData.assetCaption,
          countryName: res.internationalAssetData.countryName,
        });

        const copiedSharedDetails = [...res.assetData.sharedDetails];

        setEstimatedTotalAmount(res.assetData.income.incomeAmount);

        if (copiedSharedDetails.length > 0) {
          setSharedDetails(res.assetData.sharedDetails);

          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
          }
        }
      } catch (error) {}
    };

    fetchData();
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

  // field addition

  const addField = [0, 1, 2, 3, 4];
  const [visibleField, setVisibleField] = useState(0);

  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
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
  const [distributedType, setDistributedType] = useState("");

  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);

  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
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
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
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
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={activeincomeForm}>
                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter your Income">
                        <TextField
                          required
                          fullWidth
                          placeholder="$"
                          type="text"
                          label="Income"
                          id="payCheck"
                          size="normal"
                          onChange={(e) => handleChanges(e, "incomeAmount")}
                          value={data.income.incomeAmount}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter your source">
                        <TextField
                          required
                          fullWidth
                          type="text"
                          label="Source"
                          id="businessSource"
                          size="normal"
                          onChange={(e) => handleChanges(e, "businessSource")}
                          value={data.income.businessSource}
                        />
                      </Tooltip>
                    </div>
                    {/* <div className="mt-3">
                      <Tooltip title="Enter your customize">
                        <TextField
                          required
                          fullWidth
                          type="text"
                          label="Customize"
                          id="customize"
                          size="normal"
                          onChange={(e) => handleChanges(e, "customize")}
                          value={data.customize}
                        />
                      </Tooltip>
                    </div> */}

                    <div className="mt-3">
                      <Tooltip title="Add your income related file">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Supported Document<span></span>
                        </label>
                        <input
                          style={{
                            border: "solid 1px lightgray",
                            borderLeft: "none",
                            width: "100%",
                            borderRadius: "5px",
                          }}
                          multiple
                          type="file"
                          name="myfile"
                          id="exampleFile"
                          onChange={handleImageChange}
                          accept=".pdf"
                        />
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter Caption for Income">
                        <TextField
                          fullWidth
                          type="text"
                          label="Income Caption"
                          id="incomecaption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "incomeCaption")}
                          value={data.income.incomeCaption}
                        />
                      </Tooltip>
                    </div>

                    {/* beneficiary  */}
                    {/* <Tooltip title="Select Your Beneficiary Username">
                      <FormGroup className="Property-textfield">
                        <Label className="Property-headingname" for="property">
                          Select Your Beneficiary Username
                        </Label>

                        <Input
                          className="Property-inputfiled"
                          type="select"
                          name="select"
                          id="property"
                          onChange={(e) => handleChanges(e, "benificiary")}
                          value={data.benificiary}
                        >
                          <option defaultValue aria-readonly>
                            <p>Select Your Username</p>
                          </option>
                          {beneficiary.map((benif) => (
                            <option key={benif.username} value={benif.username}>
                              {benif.username}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Tooltip> */}

                    <div
                      className="bene-select mt-3"
                      onClick={handleShowBeneficiary}
                      style={{ cursor: "pointer" }}
                    >
                      Select Your Beneficiary
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter notes for your income">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.income.notes}
                        />
                      </Tooltip>
                    </div>

                    {/* adding new field */}
                    {/* <div style={{ marginTop: "7px", display: "flex", alignItems: "center" }}>
                      <Tooltip title="Add New Field ">
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
                      </Tooltip>
                    </div> */}
                    {/* <div style={{ width: "99.5%", display: "flex", flexWrap: "wrap", marginTop: "12px" }}>
                      {addField.map((index) => (
                        <div className="mt-2" key={index} style={{ flexDirection: "row", flexBasis: "50%", display: index < 5 ? "flex" : "none", }}>
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
                        
                        </div>
                      ))}

                    </div> */}
                    {/* adding end field */}

                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {/* <Button
                        onClick={resetData}
                        className="my-estate-clear-btn"
                        type="reset"
                        outline
                      >
                        Clear
                      </Button> */}
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}

      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}

export function EditInternationalAssetVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };
  //set data
  const [data, setData] = useState({
    vehicle: {
      vehicleCaption: "",
      vehicleType: "",
      year: "",
      loan: "",
      make: "",
      estValue: "",
      model: "",
      miles: "",
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

  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "vehicle",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);
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
  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      vehicle: {
        ...prevData.vehicle,
        [field]: newValue,
      },
    }));
    setEstimatedTotalAmount(data.vehicle.estValue);
  };
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // const resetData = () => {
  //   setData({
  //     vehicle_Id: vehicle_Id,
  //     vehicleType: "",
  //     year: "",
  //     loan: "",
  //     make: "",
  //     miels: "",
  //     model: "",
  //     estValue: "",
  //     notes: "",
  //     benificiary: "",
  //     vehicleCaption: ""
  //   });
  // };

  // post the form
  const vehiclesForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  // get single data
  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInternationalAsset(token, id);

        setData({
          ...data,
          vehicle: res.assetData.vehicle,
          documents: res.assetData.documents,
          sharedDetails: res.assetData.sharedDetails,
        });

        setData1({
          ...data1,
          id: res.internationalAssetData.id,
          assetCaption: res.internationalAssetData.assetCaption,
          countryName: res.internationalAssetData.countryName,
        });

        const copiedSharedDetails = [...res.assetData.sharedDetails];

        setEstimatedTotalAmount(res.assetData.vehicle.estValue);

        if (copiedSharedDetails.length > 0) {
          setSharedDetails(res.assetData.sharedDetails);

          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
          }
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  const getData = () => {
    let token = "Bearer " + getToken();
  };

  //get form
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [vehicleName, setVehicleName] = React.useState("");
  const [makeName, setMakeName] = React.useState("");
  const [modelName, setModelName] = React.useState("");

  const VehicleHandleChange = (event) => {
    if (event.target === undefined) {
      setVehicleName(event);
      data.vehicleType = event;
    } else {
      setVehicleName(event.target.value);
      data.vehicleType = event.target.value;
    }
  };
  const MakeHandleChange = (event) => {
    if (event.target === undefined) {
      setMakeName(event);
      data.make = event;
    } else {
      setMakeName(event.target.value);
      data.make = event.target.value;
    }
  };
  const ModelHandleChange = (event) => {
    if (event.target === undefined) {
      setModelName(event);
      data.model = event;
    } else {
      setModelName(event.target.value);
      data.model = event.target.value;
    }
  };

  const handleDateChanges = (date, property) => {
    const adjustedDate = dayjs(date).format("YYYY-MM-DD");

    // setData({ ...data, [property]: adjustedDate });

    setData((prevData) => ({
      ...prevData,
      vehicle: {
        ...prevData.vehicle,
        year: adjustedDate,
      },
    }));
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

  // field addition

  const addField = [0, 1, 2, 3, 4];
  const [visibleField, setVisibleField] = useState(0);

  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
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
  const [distributedType, setDistributedType] = useState("");

  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);

  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
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
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
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
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={vehiclesForm}>
                    <div className="mt-2" style={{ width: "100%" }}>
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2" style={{ width: "100%" }}>
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div
                      className="form1-double"
                      style={{
                        display: "flex",
                        gap: "5px",
                        width: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      {/* <div className="mt-3 date">
                        <FormControl
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Tooltip title="Enter the year manufactured of your vehicle ">
                              <label
                                style={{
                                  display: "block",
                                  marginBottom: "5px",
                                }}
                              >
                                Year Manufactured<span>*</span>
                              </label>
                              <DatePicker
                                label="Date"
                                // onChange={(date) =>
                                //   handleDateChanges(date, "year")
                                // }
                                // value={data.vehicle.year}
                                value=""
                              />
                            </Tooltip>
                          </LocalizationProvider>
                        </FormControl>
                      </div> */}

                      <div className="mt-3" style={{ width: "100%" }}>
                        <Tooltip title="Enter Caption of vehicle">
                          <TextField
                            fullWidth
                            type="text"
                            label="Vehicle Caption"
                            id="vehicleCaption"
                            size="normal"
                            onChange={(e) => handleChanges(e, "vehicleCaption")}
                            value={data.vehicle.vehicleCaption}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter the type of your vehicle ">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Vehicle Type
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="vehicleType"
                              label="Vehicle Type"
                              onChange={(e) => handleChanges(e, "vehicleType")}
                              value={data.vehicle.vehicleType}
                            >
                              <MenuItem value={"Sedan"}>Sedan</MenuItem>
                              <MenuItem value={"Coupe"}>Coupe</MenuItem>
                              <MenuItem value={"Convertible"}>
                                Convertible
                              </MenuItem>
                              <MenuItem value={"Hatchback"}>Hatchback</MenuItem>
                              <MenuItem value={"SUV"}>SUV</MenuItem>
                              <MenuItem value={"Crossover"}>Crossover</MenuItem>
                              <MenuItem value={"Pickup Truck"}>
                                Pickup Truck
                              </MenuItem>
                              <MenuItem value={"Sports Car"}>
                                Sports Car
                              </MenuItem>
                              <MenuItem value={"Electric Car"}>
                                Electric Car
                              </MenuItem>
                              <MenuItem value={"Hybrid Car"}>
                                Hybrid Car
                              </MenuItem>
                              <MenuItem value={"Luxury Car"}>
                                Luxury Car
                              </MenuItem>
                              <MenuItem value={"Other"}>Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter the name of your vehicle ">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Make
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="make"
                              label="Make"
                              onChange={(e) => handleChanges(e, "make")}
                              value={data.vehicle.make}
                            >
                              <MenuItem value={"BMW"}>BMW</MenuItem>
                              <MenuItem value={"Mercedes-Benz"}>
                                Mercedes-Benz
                              </MenuItem>
                              <MenuItem value={"Audi"}>Audi</MenuItem>
                              <MenuItem value={"Toyota"}>Toyota</MenuItem>
                              <MenuItem value={"Honda"}>Honda</MenuItem>
                              <MenuItem value={"Ford"}>Ford</MenuItem>

                              <MenuItem value={"Other"}>Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter the model of your vehicle ">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Model
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="model"
                              label="model"
                              onChange={(e) => handleChanges(e, "model")}
                              value={data.vehicle.model}
                            >
                              <MenuItem value={"Camry"}>Camry</MenuItem>
                              <MenuItem value={"C-Class"}>C-Class</MenuItem>
                              <MenuItem value={"E-Class"}>E-Class</MenuItem>
                              <MenuItem value={"R8"}>R8</MenuItem>
                              <MenuItem value={"F-150"}>F-150</MenuItem>
                              <MenuItem value={"Mustang"}>Mustang</MenuItem>

                              <MenuItem value={"Other"}>Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your vehicle milage ">
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="Miles"
                            id="miels"
                            size="normal"
                            onChange={(e) => handleChanges(e, "miles")}
                            value={data.vehicle.miles}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your Loan against your vehicle">
                          <TextField
                            required
                            placeholder="$"
                            fullWidth
                            type="number"
                            label="Loan"
                            id="loan"
                            size="normal"
                            onChange={(e) => handleChanges(e, "loan")}
                            value={data.vehicle.loan}
                          />
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your Estimated valuation of vehicle">
                          <TextField
                            fullWidth
                            placeholder="$"
                            type="number"
                            label="Estimated valuation"
                            id="evalue"
                            size="normal"
                            onChange={(e) => {
                              handleChanges(e, "estValue");
                            }}
                            value={data.vehicle.estValue}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    {/* <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Add your Vehical related file">
                          <label
                            style={{
                              display: "block",
                              marginBottom: "0",
                              marginTop: "-5px",
                            }}
                          >
                            Supporting Documents<span></span>
                          </label>
                          <input
                            style={{
                              border: "solid 1px lightgray",
                              borderLeft: "none",
                              width: "100%",
                              borderRadius: "5px",
                            }}
                            className="cryptoInput"
                            multiple
                            type="file"
                            name="myfile"
                            id="exampleFile"
                            onChange={handleImageChange}
                            accept=".pdf"
                          />
                        </Tooltip>
                      </div>

                      {/* beneficiary  */}
                    {/* <Tooltip title="Select Your Beneficiary Username">
                        <FormGroup className="Property-textfield">
                          <Label
                            className="Property-headingname"
                            for="property"
                          >
                            Select Your Beneficiary Username
                          </Label>
                          <Input
                            className="Property-inputfiled"
                            type="select"
                            name="select"
                            id="property"
                            onChange={(e) => handleChanges(e, "benificiary")}
                            value={data.benificiary}
                          >
                            <option defaultValue aria-readonly>
                              <p>Select Your Username</p>
                            </option>
                            {beneficiary.map((benif) => (
                              <option
                                key={benif.username}
                                value={benif.username}
                              >
                                {benif.username}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Tooltip> */}
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
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                            }}
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
                        </Tooltip>
                      </div>

                      {/* <div style={{ width: "49.5%", alignSelf: "flex-end" }}>
                        <Tooltip title="Enter your estimated Property Value">
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="Estimated Property Value"
                            id="estPropertyVal"
                            size="normal"
                            onChange={(e) => handleChanges(e, "estPropertyVal")}
                            value={data.estPropertyVal}
                            onClick={() => setIsTextFieldClicked2(true)}
                            InputProps={{
                              startAdornment: isTextFieldClicked2 ? <div>$</div> : null,
                            }}
                          />
                        </Tooltip>
                      </div> */}
                    </div>
                    <div
                      className="bene-select mt-3"
                      onClick={handleShowBeneficiary}
                      style={{ cursor: "pointer" }}
                    >
                      Select Your Beneficiary
                    </div>

                    <div className="mt-2">
                      <Tooltip title="Enter notes for your bank">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.vehicle.notes}
                        />
                      </Tooltip>
                    </div>
                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}
      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}

export function EditInternationalAssetJewelry() {
  const { id } = useParams();
  const navigate = useNavigate();
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };
  // }
  const [data, setData] = useState({
    jewelry: {
      jewelryCaption: "",
      jewelryName: "",
      estimatedValue: "",
      caratValue: "",
      weight: "",
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
  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "jewelry",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };
  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

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
        setSelectedImage(selectedFilesArray);
      } else {
        const invalidExtensions = invalidFiles
          .map((file) => file.name.split(".").pop())
          .join(", ");
        toast.error(
          `Invalid file extensions: ${invalidExtensions}. Please select valid document formats.`,
          {
            position: toast.POSITION.BOTTOM_CENTER,
          }
        );
        event.target.value = "";
      }
    }
  };

  // const handleChanges = (event, property) => {
  //   setData({ ...data, [property]: event.target.value });
  // };

  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      jewelry: {
        ...prevData.jewelry,
        [field]: newValue,
      },
    }));
    setEstimatedTotalAmount(data.jewelry.estimatedValue);
  };

  // const resetData = () => {
  //   setData({
  //     jewelry_Id: jewelryId,
  //     details: "",
  //     estimatedValue: "",
  //     weight: "",
  //     keratValue: "",
  //     notes: "",
  //     benificiary: "",
  //     jewelryCaption: "",
  //   });
  // };

  // post the form
  const jewelryForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);

  const getData = () => {
    let token = "Bearer " + getToken();
    getSingleInternationalAsset(token, id).then((res) => {
      setData({
        ...data,
        jewelry: res.assetData.jewelry,
        documents: res.assetData.documents,
        sharedDetails: res.assetData.sharedDetails,
      });

      setData1({
        ...data1,
        id: res.internationalAssetData.id,
        assetCaption: res.internationalAssetData.assetCaption,
        countryName: res.internationalAssetData.countryName,
      });
      const copiedSharedDetails = [...res.assetData.sharedDetails];

      setEstimatedTotalAmount(res.assetData.jewelry.estimatedValue);

      if (copiedSharedDetails.length > 0) {
        setSharedDetails(res.assetData.sharedDetails);

        ben(copiedSharedDetails[0].distributedType);
        for (var i = 0; i < copiedSharedDetails.length; i++) {
          handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
          handleFieldChange1(
            copiedSharedDetails[i].beneficiaryId,
            copiedSharedDetails[i].distributedType,
            copiedSharedDetails[i].distributedValue
          );
        }
      }
    });
  };

  const [metalPrice, setMetalPrice] = useState(0);

  useEffect(() => {
    // Fetch metal price from the API and store it in the state

    const fetchMetalPrice = () => {
      if (data.jewelry.jewelryName === "") {
        setMetalPrice(0);
        if (data.jewelry.caratValue === "") {
          setMetalPrice(0);
          return;
        }
        return;
      }

      const headers = {
        "x-access-token": "goldapi-sw18arlkmh58d1-io",
        "Content-Type": "application/json",
      };
      const metalAPIEndpoint = `https://www.goldapi.io/api/${data.jewelry.jewelryName}/USD`;
      axios
        .get(metalAPIEndpoint, { headers: headers })
        .then((res) => {
          setMetalPrice(res.data[data.jewelry.caratValue]); // Assuming the API response contains the price for 24K gold per gram
        })
        .catch((error) => {});
    };

    fetchMetalPrice();
    getData(); // Moved the getData call inside the same useEffect
  }, [data.jewelry.jewelryName, data.jewelry.caratValue]);

  // ... (remaining existing functions)

  useEffect(() => {
    const calculateEstimatedValue = () => {
      if (data.jewelry.jewelryName && data.jewelry.weight && metalPrice) {
        // Assuming the selected metal unit is 24K and using the metal price for 24K gold to calculate the estimated value
        const estimatedValue = data.jewelry.weight * metalPrice;

        setData((prevData) => ({
          ...prevData,
          jewelry: {
            ...prevData.jewelry,
            estimatedValue: estimatedValue.toFixed(3),
          },
        }));
      } else {
        setData((prevData) => ({
          ...prevData,
          jewelry: {
            ...prevData.jewelry,
            estimatedValue: "",
          },
        }));
      }
    };

    calculateEstimatedValue();
  }, [data.jewelry.jewelryName, data.jewelry.weight, metalPrice]);

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
      case "":
        return "24k";
      case "price_gram_22k":
        return "22k";
      case "price_gram_21k":
        return "21k";
      case "price_gram_20k":
        return "20k";
      case "price_gram_18k":
        return "18k";
      case "price_gram_16k":
        return "16k";
      case "price_gram_14k":
        return "14k";
      case "price_gram_10k":
        return "10k";
      default:
        return keratValue;
    }
  };
  useEffect(() => {
    getData();
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
  const [distributedType, setDistributedType] = useState("");

  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);

  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
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
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
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
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={jewelryForm}>
                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter name of the jewelry">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Jewelry
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="details"
                              label="Jewelry Name"
                              onChange={(e) => handleChanges(e, "jewelryName")}
                              value={data.jewelry.jewelryName}
                            >
                              <MenuItem value={"XAU"}>Gold</MenuItem>
                              <MenuItem value={"XAG"}>Silver</MenuItem>
                              <MenuItem value={"XPT"}>Platinum</MenuItem>
                              <MenuItem value={"XPD"}>Palladium</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>

                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Select carat value of the jewelry">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Carat Value
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="keratValue"
                              label="select carat Value"
                              onChange={(e) => handleChanges(e, "caratValue")}
                              value={data.jewelry.caratValue}
                            >
                              <MenuItem value={"price_gram_24k"}>24K</MenuItem>
                              <MenuItem value={"price_gram_22k"}>22K</MenuItem>
                              <MenuItem value={"price_gram_21k"}>21K</MenuItem>
                              <MenuItem value={"price_gram_20k"}>20K</MenuItem>
                              <MenuItem value={"price_gram_18k"}>18K</MenuItem>
                              <MenuItem value={"price_gram_16k"}>16K</MenuItem>
                              <MenuItem value={"price_gram_14k"}>14K</MenuItem>
                              <MenuItem value={"price_gram_10k"}>10K</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter the weight of your jewelry in gram to find the estimated value">
                          <TextField
                            required
                            type="number"
                            label="Weight"
                            id="weight"
                            size="normal"
                            style={{ width: "370px" }}
                            onChange={(e) => handleChanges(e, "weight")}
                            value={data.jewelry.weight}
                          />
                        </Tooltip>
                      </div>

                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="your Appraised value of the jewelry">
                          <TextField
                            required
                            placeholder="$"
                            type="number"
                            label="Appraised Value"
                            id="estimatedValue"
                            size="normal"
                            style={{ width: "370px" }}
                            onChange={(e) => handleChanges(e, "estimatedValue")}
                            value={data.jewelry.estimatedValue}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter Caption for Jewelry">
                        <TextField
                          required
                          type="text"
                          label="Jewelry Caption"
                          id="JewelryCaption"
                          size="normal"
                          style={{
                            borderLeft: "none",
                            width: "100%",
                            borderRadius: "5px",
                          }}
                          onChange={(e) => handleChanges(e, "jewelryCaption")}
                          value={data.jewelry.jewelryCaption}
                        />
                      </Tooltip>
                    </div>

                    {/* beneficiary  */}
                    {/* <Tooltip title="Select Your Beneficiary Username">
                      <FormGroup className="Property-textfield">
                        <Label className="Property-headingname" for="property">
                          Select Your Beneficiary Username
                        </Label>

                        <Input
                          className="Property-inputfiled"
                          type="select"
                          name="select"
                          id="property"
                          onChange={(e) => handleChanges(e, "benificiary")}
                          value={data.benificiary}
                        >
                          <option defaultValue aria-readonly>
                            <p>Select Your Username</p>
                          </option>
                          {beneficiary.map((benif) => (
                            <option key={benif.username} value={benif.username}>
                              {benif.username}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Tooltip> */}

                    <div className="mt-3">
                      <Tooltip title="Add your jewelry related file">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Supported Document<span></span>
                        </label>
                        <input
                          style={{
                            border: "solid 1px lightgray",
                            borderLeft: "none",
                            width: "100%",
                            borderRadius: "5px",
                          }}
                          multiple
                          type="file"
                          name="myfile"
                          id="exampleFile"
                          onChange={handleImageChange}
                          accept=".pdf"
                        />
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
                      <Tooltip title="Enter notes for your jewelry">
                        <TextField
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          style={{ width: "370px" }}
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.jewelry.notes}
                        />
                      </Tooltip>
                    </div>
                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}

      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}

export function EditInternationalAssetInsurance() {
  const { id } = useParams();
  const navigate = useNavigate();

  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };
  // set Add data
  const [data, setData] = useState({
    insurance: {
      insuranceCaption: "",
      details: "",
      detailsOfpoint: "",
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
  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "insurance",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };
  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

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
        setSelectedImage(selectedFilesArray);
      } else {
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

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  // const handleChanges = (event, property) => {
  //   setData({ ...data, [property]: event.target.value });
  // };

  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      insurance: {
        ...prevData.insurance,
        [field]: newValue,
      },
    }));
  };

  // const resetData = () => {
  //   setData({
  //     lifeInsurance_Id: lifeInsurance_Id,
  //     details: "",
  //     // supportingDcument: "",
  //     detailsOfpoint: "",
  //     notes: "",
  //     benificiary: "",
  //     insuranceCaption: ""
  //   });
  // };

  // post the form
  const lifeForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const getData = () => {
    let token = "Bearer " + getToken();
    getSingleInternationalAsset(token, id).then((res) => {
      setData({
        ...data,
        insurance: res.assetData.insurance,
        documents: res.assetData.documents,
        sharedDetails: res.assetData.sharedDetails,
      });

      setData1({
        ...data1,
        id: res.internationalAssetData.id,
        assetCaption: res.internationalAssetData.assetCaption,
        countryName: res.internationalAssetData.countryName,
      });
      // setEstimatedTotalAmount(res.realEstate.estPropertyVal);
    });
  };

  useEffect(() => {
    getData();
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
  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={lifeForm}>
                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter the name your insurance ">
                        <TextField
                          fullWidth
                          required
                          type="text"
                          label="Details"
                          id="details"
                          size="normal"
                          onChange={(e) => handleChanges(e, "details")}
                          value={data.insurance.details}
                        />
                      </Tooltip>
                    </div>

                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "100%" }}>
                        <Tooltip title="Enter your Details of Point Contact Name ">
                          <TextField
                            fullWidth
                            required
                            type="text"
                            label="Point of Contact Name"
                            id="detailsOfpoint"
                            size="normal"
                            onChange={(e) => handleChanges(e, "detailsOfpoint")}
                            value={data.insurance.detailsOfpoint}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Add your insurance related file">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
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
                          multiple
                          type="file"
                          name="myfile"
                          id="exampleFile"
                          onChange={handleImageChange}
                          accept=".pdf"
                        />
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter Caption of Insurances ">
                        <TextField
                          fullWidth
                          required
                          type="text"
                          label="Insurance Caption"
                          id="Insurance Caption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "insuranceCaption")}
                          value={data.insurance.insuranceCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter notes for your insurance">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.insurance.notes}
                        />
                      </Tooltip>
                    </div>
                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}
    </>
  );
}

export function EditInternationalAssetCrypto() {
  const { id } = useParams();
  const navigate = useNavigate();
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };
  const [data, setData] = useState({
    cryptoAssest: {
      cryptoCaption: "",
      coin: "",
      quantity: "",
      exchange: "",
      wallet: "",
      notes: "",
      estValue: "",
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

  const [data1, setData1] = useState({
    id: "",
    assetCaption: "",
    assetType: "crypto",
    countryName: "",
  });

  const handleChangesData = (e, field) => {
    const newValue = e.target.value;
    setData1((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);
  const [coins, setCoins] = useState([]);

  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      cryptoAssest: {
        ...prevData.cryptoAssest,
        [field]: newValue,
      },
    }));
    setEstimatedTotalAmount(data.cryptoAssest.estValue);
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

  // const resetData = () => {
  //   setData({
  //     coin: "",
  //     exchange: "",
  //     wallet: "",
  //     quntity: "",
  //     estimatedValue: "",
  //     exampleFile: "",
  //     notes: "",
  //     benificiary: "",
  //     addfield1: "",
  //     addfield2: "",
  //     addfield3: "",
  //     addfield4: "",
  //     addfield5: "",
  //     cryptoCaption: "",
  //   });
  //   setSelectedImage(null);
  //   setCoinName("");
  //   setExchangeName("");
  //   setWalletName("");
  // };
  const [coinName, setCoinName] = React.useState("");

  const coinHandleChange = (event) => {
    if (event.target === undefined) {
      setCoinName(event);
      data.coin = event;
    } else {
      setCoinName(event.target.value);
      data.coin = event.target.value;
    }
  };
  const [exchangeName, setExchangeName] = React.useState("");
  const exchangeHandleChange = (event) => {
    if (event.target === undefined) {
      setExchangeName(event);
      data.exchange = event;
    } else {
      setExchangeName(event.target.value);
      data.exchange = event.target.value;
    }
  };
  const [walletName, setWalletName] = React.useState("");

  const walletHandleChange = (event) => {
    if (event.target === undefined) {
      setWalletName(event);
      data.wallet = event;
    } else {
      setWalletName(event.target.value);
      data.wallet = event.target.value;
    }
  };

  const cryptoForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    if (
      data.cryptoAssest.coin === "" ||
      data.cryptoAssest.exchange === "" ||
      data.cryptoAssest.wallet === "" ||
      data.cryptoAssest.quantity === ""
    ) {
      toast.error("Please Fill All required field Then Submit .", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
      }
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    updateInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        toggle();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInternationalAsset(token, id);

        setData({
          ...data,
          cryptoAssest: res.assetData.cryptoAssest,
          documents: res.assetData.documents,
          sharedDetails: res.assetData.sharedDetails,
        });
        setData1({
          ...data1,
          id: res.internationalAssetData.id,
          assetCaption: res.internationalAssetData.assetCaption,
          countryName: res.internationalAssetData.countryName,
        });
        const copiedSharedDetails = [...res.assetData.sharedDetails];

        setEstimatedTotalAmount(data.assetData.cryptoAssest.estValue);

        if (copiedSharedDetails.length > 0) {
          setSharedDetails(res.assetData.sharedDetails);

          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
          }
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  const [search, setSearch] = useState([]);
  const getCoins = (value) => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
      )
      .then((res) => {
        setCoins(res.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const calculateEstimatedValue = () => {
      // Check if both selectCrypto and quntity fields have values
      if (data.cryptoAssest.coin && data.cryptoAssest.quantity) {
        // Perform the calculation for the estimated value
        const selectedCrypto = coins.find(
          (coin) => coin.name === data.cryptoAssest.coin
        );

        if (selectedCrypto) {
          const estimatedValue1 =
            data.cryptoAssest.quantity * selectedCrypto.current_price;

          setData((prevData) => ({
            ...prevData,
            cryptoAssest: {
              ...prevData.cryptoAssest,
              estValue: estimatedValue1.toString(),
            },
          }));
        }
      } else {
        const estimatedValue = "";

        setData((prevData) => ({
          ...prevData,
          cryptoAssest: {
            ...prevData.cryptoAssest,
            estValue: estimatedValue,
          },
        }));
      }
    };

    calculateEstimatedValue();
  }, [data.cryptoAssest.coin, data.cryptoAssest.quantity]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getCoins("hello");
    // getData();
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

  // field addition

  const addField = [0, 1, 2, 3, 4];
  const [visibleField, setVisibleField] = useState(0);

  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
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
  const [distributedType, setDistributedType] = useState("");

  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);

  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  const handleDistributionTypeChange = (event) => {
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });

    setSharedDetails(sharedDetails1);
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", dollar: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const handleBeneficiarySelection1 = (selectedBeneficiary) => {
    if (selectedBeneficiary === null) {
      return null;
    }
    setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
      // Check if the selectedBeneficiary is already included
      if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
        // If not included, update the selected beneficiaries
        const newSelectedBeneficiaries = [
          ...prevSelectedBeneficiaries,
          selectedBeneficiary,
        ];

        return newSelectedBeneficiaries;
      }

      // If already included, return the previous state without any changes
      return prevSelectedBeneficiaries;
    });

    setBeneficiaryDetails((prevBeneficiaryDetails) => {
      const newBeneficiaryDetails = {
        ...prevBeneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
      };

      return newBeneficiaryDetails;
    });
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;

    if (!selectedBeneficiaries.includes(selectedBeneficiary)) {
      setSelectedBeneficiaries([...selectedBeneficiaries, selectedBeneficiary]);
      setBeneficiaryDetails({
        ...beneficiaryDetails,
        [selectedBeneficiary]: { percentage: "", dollar: "" },
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
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    setBeneficiaryDetails((prevDetails) => {
      // Create a copy of the state
      let updatedDetails = { ...prevDetails };

      // Update the copy
      updatedDetails = {
        ...updatedDetails,
        [beneficiary]: {
          ...updatedDetails[beneficiary],
          [field]: value,
        },
      };

      // Return the updated state
      return updatedDetails;
    });
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
      const beneficiaryValue = parseFloat(updatedDetails[key]?.dollar);
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
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;

      return calculatedAmount.toFixed(2);
    } else if (distributedType === "dollar") {
      const detailValue = parseFloat(beneficiaryDetail.dollar);
      return detailValue.toFixed(2);
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
      const beneficiaryValue = parseFloat(beneficiaryDetails[key]?.dollar);
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
    const updatedSharedDetails = [...data.sharedDetails];
    const updatedElement = {
      ...updatedSharedDetails[i],
      distributedType: t,
      distributedValue: v,
      distributedAmount: a,
      beneficiaryId: b,
    };
    updatedSharedDetails[i] = updatedElement;

    setData((prevState) => ({
      ...prevState,
      sharedDetails: updatedSharedDetails,
    }));
    data.sharedDetails[i] = updatedSharedDetails[i];
  };

  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container className="form1">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Properties</h3>
                  {/* {JSON.stringify(data)} */}
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={cryptoForm}>
                    <div className="mt-2">
                      <Tooltip title="Write Caption for your assets">
                        <TextField
                          required
                          type="text"
                          label="Assets Caption"
                          id="assest_caption"
                          size="normal"
                          onChange={(e) => handleChangesData(e, "assetCaption")}
                          value={data1.assetCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-2">
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
                            onChange={(e) =>
                              handleChangesData(e, "countryName")
                            }
                            value={data1.countryName}
                          >
                            {Country.getAllCountries().map((v) => {
                              return (
                                <MenuItem value={v.name}>{v.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter name of the Coin">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Coin Name
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="coin"
                              label="Coin Name"
                              onChange={(e) => handleChanges(e, "coin")}
                              value={data.cryptoAssest.coin}
                            >
                              {coins.length > 0 ? (
                                coins.map((coin) => {
                                  return (
                                    <MenuItem value={coin.name}>
                                      {coin.name}
                                    </MenuItem>
                                  );
                                })
                              ) : (
                                <MenuItem>
                                  You've exceeded the Rate Limit
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your coin quantity ">
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="Quantity"
                            id="quntity"
                            size="normal"
                            onChange={(e) => handleChanges(e, "quantity")}
                            value={data.cryptoAssest.quantity}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter name of the exchange ">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Exchange
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="exchange"
                              label="Exchange"
                              onChange={(e) => handleChanges(e, "exchange")}
                              value={data.cryptoAssest.exchange}
                            >
                              <MenuItem value={"Coinbase"}>Coinbase</MenuItem>
                              <MenuItem value={"Binance.US"}>
                                Binance.US
                              </MenuItem>
                              <MenuItem value={"Kraken"}>Kraken</MenuItem>
                              <MenuItem value={"Gemini"}>Gemini</MenuItem>
                              <MenuItem value={"Bitfinex"}>Bitfinex</MenuItem>
                              <MenuItem value={"Bitstamp"}>Bitstamp</MenuItem>
                              <MenuItem value={"Huobi US"}>Huobi US</MenuItem>
                              <MenuItem value={"Crypto.com"}>
                                Crypto.com
                              </MenuItem>
                              <MenuItem value={"BitFlyer"}>BitFlyer</MenuItem>
                              <MenuItem value={"OKCoin"}>OKCoin</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter name of the wallet">
                          <FormControl
                            required
                            fullWidth
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-label">
                              Wallet
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="wallet"
                              label="wallet"
                              onChange={(e) => handleChanges(e, "wallet")}
                              value={data.cryptoAssest.wallet}
                            >
                              <MenuItem value={"Ledger Nano S"}>
                                Ledger Nano S
                              </MenuItem>
                              <MenuItem value={"Trezor Model T"}>
                                Trezor Model T
                              </MenuItem>
                              <MenuItem value={"Exodus"}>Exodus</MenuItem>
                              <MenuItem value={"Atomic Wallet"}>
                                Atomic Wallet
                              </MenuItem>
                              <MenuItem value={"Trust Wallet"}>
                                Trust Wallet
                              </MenuItem>
                              <MenuItem value={"MyEtherWallet"}>
                                MyEtherWallet
                              </MenuItem>
                              <MenuItem value={"Coinomi"}>Coinomi</MenuItem>
                              <MenuItem value={"MetaMask"}>MetaMask</MenuItem>
                              <MenuItem value={"Freewallet"}>
                                Freewallet
                              </MenuItem>
                              <MenuItem value={"KeepKey"}>KeepKey</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Caption For Your Coin">
                        <TextField
                          fullWidth
                          type="text"
                          label="Crypto Caption"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "cryptoCaption")}
                          value={data.cryptoAssest.cryptoCaption}
                        />
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Add your crypto related file">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
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
                          multiple
                          onChange={(e) => handleImageChange(e)}
                          accept=".pdf"
                        />
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
                      <Tooltip title="Enter notes for your coin">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.cryptoAssest.notes}
                        />
                      </Tooltip>
                    </div>

                    {/* adding new field */}
                    {/* <div style={{ marginTop: "7px", display: "flex", alignItems: "center" }}>
                      <Tooltip title="Add New Field ">
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
                      </Tooltip>
                    </div> */}
                    {/* <div
                      style={{
                        width: "99.5%",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {addField.map((index) => (
                        <div
                          className="mt-2"
                          key={index}
                          style={{
                            flexDirection: "row",
                            flexBasis: "50%",
                            display: index < 5 ? "flex" : "none",
                          }}
                        >
                          <div style={{ width: "97%" }}>
                            <Tooltip title={`Add New Field ${index + 1}`}>
                              <TextField
                                fullWidth
                                type="text"
                                label={`New Field ${index + 1}`}
                                id={`addfield${index + 1}`}
                                size="normal"
                                onChange={(e) =>
                                  handleChanges(e, `addfield${index + 1}`)
                                }
                                value={data[`addfield${index + 1}`] || ""}
                                className="AddField"
                              />
                            </Tooltip>
                          </div>
                          <span className="addFieldClose" onClick={()=>setVisibleField(visibleField-1)} style={{ width: "2%",paddingLeft:"5px" }}><FontAwesomeIcon icon={faXmark} /></span>
                        </div>
                      ))}
                    </div> */}
                    {/* adding end field */}

                    <Container
                      className="text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {/* <Button
                        onClick={resetData}
                        className="my-estate-clear-btn"
                        type="reset"
                        outline
                      >
                        Clear
                      </Button> */}
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      )}

      {benevisible && (
        <div className="popup">
          <div
            className="popup-content"
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
                {/* {JSON.stringify(sharedDetails)}  */}
                {/* <p>----------------------------------------------------</p>
                    {JSON.stringify(data.documents)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.accounts)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data.bank)}
                    <p>----------------------------------------------------</p>
                    {JSON.stringify(data)} */}
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div className="share_property_Type">
                      <p className="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <p className="ms-2 text-black fw-normal">
                        {/* {sharedDetails[0].distributedType} */}
                      </p>
                      <select
                        value={sharedDetails[0].distributedType}
                        onChange={(e) => handleDistributionTypeChange(e)}
                        class="share_property_Type_select"
                        disabled={
                          sharedDetails[0].distributedType !== "" ? true : false
                        }
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
                        disabled={!distributedType}
                      >
                        <option value="" disabled hidden>
                          {distributedType
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
                  {/* <div className="share_beneficiary_main_card">
                        {sharedDetails[0].distributedType !== null && (
                          <>
                            {sharedDetails[0].distributedType === 'dollar' ? (
                              <div>
                                <div className="share_beneficiary_card_close" onClick={() => handleBeneficiaryClose(beneficiary)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </div> 
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Dollar" />
                              </div>
                            ) : null}

                            {sharedDetails[0].distributedType === 'percentage' ? (
                              <div>
                                <p>Beneficiary: </p>
                                <TextField type="number" label="Percentage" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </div> */}
                  <div className="share_beneficiary_main_card">
                    {selectedBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary} class="share_beneficiary_card">
                        <div>
                          <p className="share_beneficiary_card_para">
                            Beneficiary: {getBenificiaryName({ beneficiary })}
                          </p>
                          {distributedType === "percentage" && (
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
                          {distributedType === "dollar" && (
                            <input
                              type="text"
                              className="share_ben_percentage"
                              placeholder="Dollar Value"
                              value={
                                beneficiaryDetails[beneficiary]?.dollar || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  beneficiary,
                                  "dollar",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {distributedType && (
                            <p className="share_beneficiary_card_para">
                              {/* <p></p> */}
                              Distributed Value: $
                              {distributedType === "percentage"
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
                        {/* <div
                            className="share_beneficiary_card_close"
                            onClick={() => handleBeneficiaryClose(beneficiary)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div> */}
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
    </>
  );
}
