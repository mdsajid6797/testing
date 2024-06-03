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
  downloadDocument1,
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
  faMinus,
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
import { useNavigate } from "react-router-dom";
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
import { addInternationalAsset } from "../../services/InternationalAssetService";
import { getBank } from "../../services/bank-service";

export function InternationalAssetRealEstate() {
  const navigate = useNavigate();

  // new update
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
  const resetData = () => {
    setData({
      streetAddress: "",
      mortgage1: "",
      mortgage2: "",
      mortgage3: "",
      mortgage4: "",
      mortgage5: "",
      aptNumber: "",
      exampleFile: "",
      // taxDocument: "",
      zipCode: "",
      city: "",
      state: "",
      estPropertyVal: "",
      country: "",
      propertyTax: "",
      // rentalIncome: "",
      notes: "",

      caption: "",
      addfield1: "",
      addfield2: "",
      addfield3: "",
      addfield4: "",
      addfield5: "",
      benificiary: "",
      propertyCaption: "",
      propertyType: "",
      otherPropertyType: "",
    });
    setCountryName("");
  };
  const [countryName, setCountryName] = React.useState("");

  const CountryHandleChange = (event) => {
    setCountryName(event.target.value);
    data.country = event.target.value;
  };
  // Set the form
  const AddForm = (event) => {
    event.preventDefault();
    toggle();
    let token = "Bearer " + getToken();
    setCardNo(token);

    // console.log("Token : " + token);

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
        console.log("this is file indexs", selectedImage[i]);
      }
    }
    // formData.append("filename", selectedImage);
    // formData.append("newFile", selectedImage1);
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    addInternationalAsset(formData, token)
      .then((resp) => {
        console.log("this is actuall filename - ", resp.filename);
        // console.log("Success log");
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
        console.log(error);
        toast.error(
          "File is too large please choose file size under 400 KB",
          error
        );
      });
  };

  //show data in frontend
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    getRealEstates(token, userId)
      .then((res) => {
        console.log(res);
        setCategory(res);
      })
      .catch((error) => {
        console.log(error);
        console.log("Data not loaded");
        // handle error
        setError({
          errors: error,
          isError: true,
        });
      });
  };

  // code by purnendu
  const handleRemove = (id) => {
    // let token = "Bearer " + getToken();
    deleteRealEstate(id)
      .then((res) => {
        toast.success("Deleted successfully...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        getData();
        AddCard();
        setShow(false);
        // window.location.reload();
        // console.log("Success " + res);
      })
      .catch((err) => {
        // console.log("Error " + err);
      });
  };
  // code for handle download
  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token

    downloadDocument("realEstate", fileName, fileNumber)
      .then((response) => {
        const downloadUrl = URL.createObjectURL(response.data);
        console.log(downloadUrl);
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

  const handleView = (newFile) => {
    let myarry = newFile.split(".");
    const token = getToken(); // Replace with your actual token

    downloadTaxDocument("realEstate", newFile)
      .then((response) => {
        const downloadUrl = URL.createObjectURL(response.data);
        console.log(downloadUrl);

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

  // const handleChangesZipCode = (event, property) => {
  //   setData({ ...data, [property]: event.target.value });
  //   setZipCode(event.target.value);
  //   console.log("zipCode : ", zipCode);
  //   // fetchDataFromAPI();
  // };
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

  // useEffect(() => {
  //   const fetchDataFromAPI = () => {
  //     const apiUrl = `http://api.zippopotam.us/us/${zipCode}`;

  //     console.log("URL : ", apiUrl);

  //     setLoading(true);

  //     axios
  //       .get(apiUrl)
  //       .then((res) => {
  //         setLoading(false);
  //         // console.log("Address res :  ", res.data.places);
  //         if (res.data && res.data.places && res.data.places.length > 0) {
  //           const placeName = res.data.places[0]["place name"];
  //           // data.city =placeName;
  //           setData((prevData) => ({
  //             ...prevData,
  //             city: placeName,
  //             country: res.data.country,
  //             state: res.data.places[0]["state"],
  //           }));
  //           data.state = res.data.places[0]["state"];
  //           console.log("Place Name: ", placeName);
  //         } else {
  //           console.log("No places found in the response.");
  //         }
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         console.log("Error fetching data from API:", error);
  //         // toast.error("Failed to fetch address data from API.");
  //       });
  //   };

  //   if (data.zipCode) {
  //     // setZipCode(data.zipCode);
  //     fetchDataFromAPI();
  //   }
  // }, [data.zipCode]);
  // useEffect(() => {
  //   getData();
  // }, []);

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
              console.log("Place Name: ", placeName);
            } else {
              console.log("No places found in the response.");
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log("Error fetching data from API:", error);
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
  const handleRemoveColumn = (index) => {
    if (!data[`mordgage${index + 1}`]) {
      const updatedDivs = [...visibleDivs];
      updatedDivs[index] = false;
      setVisibleDivs(updatedDivs);
    }

    // Reset the input value
    setData((prevData) => ({
      ...prevData,
      [`mordgage${index + 1}`]: "",
    }));
  };
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
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    getRealEstates(token, userId)
      .then((res) => {
        setCard(res);

        console.log("This is card data:", res);
      })
      .catch((error) => {
        setCard([]);
        // toast.error("Card not created!!");

        console.error(error); // Changed to console.error for better visibility of errors
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
    console.log("this is selected card details - ", obj);
  };

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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
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
                          size="normal"
                          onChange={(e) => handleChanges(e, "propertyCaption")}
                          value={data.realEstate.propertyCaption}
                        />
                      </Tooltip>
                    </div>

                    <div className="mt-2">
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
                    {/* {otherPropertyTypes && (
                      <div className="mt-3">
                        <Tooltip title="Enter Your Apartment Number ">
                          <TextField
                            fullWidth
                            type="text"
                            label="Enter Other Property"
                            id="otherprop"
                            size="normal"
                            // onChange={(e) =>
                            //   handleChanges(e, "otherPropertyType")
                            // }
                            // value={data.realEstate.otherPropertyType}
                          />
                        </Tooltip>
                      </div>
                    )} */}

                    <div
                      className="mt-2 form1-double"
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
                        {/* <FormFeedback>
                          {error.errors?.response?.data?.streetAddress}
                        </FormFeedback> */}
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
                            disabled // Disable the field to prevent manual input
                            readOnly
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
                            disabled // Disable the field to prevent manual input
                            readOnly
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
                        </a> */}

                        {/* {popupCalculatorVisible && (
                          <PropertyTaxCalculatorPopup onClose={closePopup} />
                        )} */}
                      </div>
                    </div>

                    {/* </div> */}

                    <div
                      className="mt-2 form1-double"
                      style={{
                        display: "flex",
                        flexWrap: "wrap", // Allow children to wrap to the next line
                        justifyContent: "space-between",
                      }}
                    >
                      {mordgages.map((index) => (
                        <div
                          key={index}
                          style={{
                            width: "calc(50% - 8px)", // Adjust width for margins
                            marginBottom: "16px", // Add margin between mortgages
                            display:
                              index <= visibleColumnIndex ? "block" : "none",
                          }}
                        >
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
                      ))}
                      <div
                        style={{
                          width: "calc(50% - 8px)", // Adjust width for margins
                          marginBottom: "16px", // Add margin between mortgages
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
                    </div>

                    <Container className="text-center">
                      <Button
                        className="my-estate-clear-btn"
                        // onClick={resetData}
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
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetBank() {
  const navigate = useNavigate();
  // const [bankName, setBankName] = React.useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [category, setCategory] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [beneficiaryVisible, setBeneficiaryVisible] = useState(false);
  const [beneficiaryPopup, setBeneficiaryPopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [SelectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});
  // const [visibleField, setVisibleField] = useState(0);
  // const [selectedAccountType, setSelectedAccountType] = useState('');
  // const [totalAmount, setTotalAmount] = useState(0);
  // const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);
  // const [selectedValue, setSelectedValue] = useState('');
  // const [hasEffectRun, setHasEffectRun] = useState(false);
  // const [selectedAccountTypes, setSelectedAccountTypes] = useState(Array(5).fill(''));
  // const [bankarray, setBankArray] = useState([0]);
  // const accountType = ["Checking Account", "Savings Account", "Investment Account", "C.D Account"]
  // let [accountNoShow, setAccountNoShow] = useState(false)
  // let [visible, setVisible] = useState(0)
  // const [beneShow, setBeneShow] = useState({})
  const [benevisible, setbeneVisible] = useState(false);
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [beneficiary, setBenificiary] = useState([]);
  const [distributionType, setDistributionType] = useState("");
  const [bankFieldClicked, setBankFieldClicked] = useState(false);
  const [account, setAccount] = useState([]);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  let [showAdditionField, SetshowAdditionField] = useState(false);
  let [card, setCard] = useState([]);
  let [showDetail, setShowDetail] = useState([]);
  let [show1, setShow1] = useState(false);
  let [otherPropertyTypes, setOtherPropertyTypes] = useState(false);
  let userId = getUser().id;

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

          // Update your state or perform actions with the selected files
          setSelectedImage(selectedFilesArray);
        } else {
          const invalidExtensions = invalidFiles
            .map((file) => file.name.split(".").pop())
            .join(", ");
          // Notify the user about invalid file extensions
          toast.error(
            `Invalid file extensions: ${invalidExtensions}. Please select valid document formats.`,
            {
              position: toast.POSITION.BOTTOM_CENTER,
            }
          );

          // Clear the file input field
          event.target.value = "";
        }
      }
    }
  };
  const bankHandleChange = (event) => {
    const selectedBank = event.target.value;
    if (selectedBank === "other") {
      setOtherPropertyTypes(true);
      setData({
        ...data,
        bank: {
          ...data.bank,
          bankType: "other",
          bankName: "",
        },
      });
    } else {
      console.log("else ...");
      setOtherPropertyTypes(false);
      setData({
        ...data,
        bank: {
          ...data.bank,
          bankType: "",
          bankName: selectedBank,
        },
      });
    }
  };
  const BankForm = (event) => {
    event.preventDefault();
    console.log("add bank data : ", data);
    toggle();
    let token = "Bearer " + getToken();

    for (let i = 0; i < data.accounts.length; i++) {
      const account = data.accounts[i];
      if (!/^\d{15}$/.test(account.accountNumber)) {
        // Display an error message or handle validation failure
        alert(`Bank account at index ${i} must be 15 digits.`);
        return; // Exit the function without hitting the API
      }
    }

    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    console.log("my form data", formData);
    addInternationalAsset(formData, token)
      .then((resp) => {
        console.log("this is form data", resp.filename);
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
        AddCard();
      })
      .catch((error) => {});
  };
  const getData = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken();
    // getBank(token, userId).then((res) => {
    //   console.log("data:", res);
    //   setCategory(res);
    // });
  };
  const handleRemove = (id) => {
    // let token = "Bearer " + getToken();
    //   deleteBank(id)
    //     .then((res) => {
    //       toast.success("Deleted successfully...", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       getData();
    //       AddCard();
    //       setShow1(false);
    //     })
    //     .catch((error) => {
    //     });
  };
  const handleDownload = (id, fileName) => {
    let myarry = fileName.split(".");
    const token = getToken();
    //   downloadDocument1(id)
    //     .then((response) => {
    //       console.log("files in downlaod", response)
    //       const downloadUrl = URL.createObjectURL(response.data);
    //       const link = document.createElement("a");
    //       link.href = downloadUrl;
    //       link.download = `${myarry[0]}.${myarry[1]}`;
    //       link.click();
    //       URL.revokeObjectURL(downloadUrl);
    //     })
    //     .catch((error) => {
    //     });
  };
  const handleOpenPopup = (note) => {
    setSelectedNote(note);
    setPopupVisible(true);
  };
  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };
  const handleShowDownlaod = (showDetail) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
  };
  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken();
    console.log("user id is :");
    //   getBank(token, userId)
    //     .then((res) => {
    //       setCard(res);
    //       console.log("This is card data:", res);
    //     })
    //     .catch((error) => {
    //       toast.error("Card not created!!");
    //       console.error(error);
    //     });
  };
  const Showdetails = (obj) => {
    setShowDetail(obj);
    setShow1(true);
  };
  const getBenificiarydata = () => {
    let userId = getUser().id;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        console.log("getBenificiarydata : ", res);
        setBenificiary(res);
      })
      .catch((err) => console.log(err));
  };
  const getBankName = (bankName) => {
    return category.some(
      (item) =>
        item.bank.bankName === bankName &&
        item.bank.isInternationalAsset === "true"
    );
  };
  useEffect(() => {
    getBenificiarydata();
    getData();
  }, []);

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

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
    data.bank.safetyBox = !isChecked;
    if (isChecked) {
      data.bank.safetyBoxNumber = null;
    }
  };
  const handleChanges = (e, field) => {
    const newData = { ...data, [field]: e.target.value };
    setData(newData);

    // const index = parseInt(field.match(/\d+/)[0], 10) - 1;
    // const newSelectedBankTypes = [...selectedBankTypes];
    // newSelectedBankTypes[index] = e.target.value;
    // setSelectedBankTypes(newSelectedBankTypes);
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
  };

  const handleChangesAccount = (e, field, index) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      accounts: [
        {
          ...prevData.accounts,
          [field]: newValue,
        },
      ],
    }));
  };

  // const handleChanges1 = (e, field, { index }) => {
  //   const { value } = e.target;

  //   setData(prevData => {
  //     const updatedAccounts = [...prevData.accounts];
  //     if (!updatedAccounts[index]) {
  //       updatedAccounts[index] = {}; // Initialize the account object if it doesn't exist
  //     }
  //     updatedAccounts[index][field] = value;

  //     return {
  //       ...prevData,
  //       accounts: updatedAccounts,
  //     };
  //   });
  //   const index = parseInt(field.match(/\d+/)[0], 10) - 1;
  //   const newSelectedBankTypes = [...selectedBankTypes];
  //   newSelectedBankTypes[index] = e.target.value;
  //   setSelectedBankTypes(newSelectedBankTypes);

  //   const balances = data.accounts.map(account => account.balance || 0);
  //   const newTotalBalance = balances.reduce((acc, curr) => acc + parseFloat(curr), 0);
  //   setEstimatedTotalAmount(newTotalBalance);
  // };

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

    const balances = data.accounts.map((account) => account.balance || 0);
    const newTotalBalance = balances.reduce(
      (acc, curr) => acc + parseFloat(curr),
      0
    );
    setEstimatedTotalAmount(newTotalBalance);
  };

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);

    data.sharedDetails = [];
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
  const handleDistributionTypeChange = (event) => {
    const newType = event.target.value;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributionType(newType);
    setBeneficiaryDetails(resetDetails);
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "";
    const maskedPart = "*".repeat(accountNumber.length - 4);
    const lastFourDigits = accountNumber.slice(-4);
    return `${maskedPart}${lastFourDigits}`;
  };

  // multiple account
  const multipleAccount = [0, 1, 2, 3];
  const handleAddBank = () => {
    if (visibleColumnIndex < 3) {
      setAccount([...account, { label: visibleColumnIndex + 1 }]);
      setVisibleColumnIndex(visibleColumnIndex + 1);
    }
  };

  const handleRemoveBank = (indexToRemove) => {
    if (visibleColumnIndex > 0) {
      // Filter out the account with the index to remove
      const updatedAccounts = account.filter(
        (_, index) => index !== indexToRemove - 1
      );
      setAccount(updatedAccounts);

      // Adjust visibleColumnIndex if the removed index is within the current visible range
      if (indexToRemove - 1 < visibleColumnIndex) {
        setVisibleColumnIndex(visibleColumnIndex - 1);
      }
    }

    setData((prevData) => {
      const updatedAccounts = prevData.accounts.map((account, index) => {
        if (index === indexToRemove) {
          // Create a new object with empty values for the removed index
          return {
            accountType: "",
            accountNumber: "",
            balance: "",
          };
        }
        return account; // Return the original bank object for other indices
      });

      // Filter out accounts with empty strings for accountType, accountNumber, and balance
      const filteredAccounts = updatedAccounts.filter(
        (account) =>
          account.accountType !== "" ||
          account.accountNumber !== "" ||
          account.balance !== ""
      );

      // Update the state with the new array of bank accounts
      const newData = {
        ...prevData,
        accounts: filteredAccounts,
      };

      // Perform further operations directly after updating the state
      // Filter out accounts with empty strings for accountType, accountNumber, and balance
      const furtherFilteredAccounts = newData.accounts.filter(
        (account) =>
          account.accountType !== "" ||
          account.accountNumber !== "" ||
          account.balance !== ""
      );

      // Update the state with the further filtered accounts
      setData({
        ...newData,
        accounts: furtherFilteredAccounts,
      });

      return newData;
    });

    setSelectedBankTypes((prevSelectedBankTypes) => {
      const newSelectedBankTypes = [...prevSelectedBankTypes];
      newSelectedBankTypes.splice(indexToRemove, 1);
      return newSelectedBankTypes;
    });
  };

  const [selectedBankTypes, setSelectedBankTypes] = useState(
    Array(multipleAccount.length).fill("")
  );
  const handleReset = () => {
    setbeneVisible(false);
    setDistributionType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
  };

  const [temp, setTemp] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);
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
  useEffect(() => {
    getData();
    AddCard();
    // getBenificiarydata();
    setShow(true);
  }, [data]);

  const validateBankAccountNum = (index) => {
    for (let i = 0; i < data.accounts.length; i++) {
      if (index === i) {
        const account = data.accounts[i];
        if (!/^\d{15}$/.test(account.accountNumber)) {
          return false; // Return false if the validation fails
        } else {
          return true; // Return true if all account numbers pass the validation
        }
      }
    }
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container>
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Add Bank</h3>
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                {/* {JSON.stringify(data)} */}
                <CardBody>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter name of the bank">
                        <FormControl
                          required
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-label">
                            Bank Name
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="banks"
                            label="Name Bank"
                            onChange={bankHandleChange}
                            value={
                              data.bank.bankType === "other"
                                ? data.bank.bankType
                                : data.bank.bankName
                            }
                          >
                            <MenuItem
                              value={"JPMorgan Chase & Co"}
                              disabled={getBankName("JPMorgan Chase & Co")}
                            >
                              <img
                                src="/logos/J.P._Morgan_Chase_logo_PNG3.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;JPMorgan Chase & Co
                            </MenuItem>
                            <MenuItem
                              value={"Bank of America"}
                              disabled={getBankName("Bank of America")}
                            >
                              <img
                                src="/logos/Bank_of_America_logo_PNG4.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Bank of America
                            </MenuItem>
                            <MenuItem
                              value={"Wells Fargo & Co"}
                              disabled={getBankName("Wells Fargo & Co")}
                            >
                              <img
                                src="/logos/Wells_fargo_logo_PNG2.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Wells Fargo & Co
                            </MenuItem>
                            <MenuItem
                              value={"Citigroup Inc"}
                              disabled={getBankName("Citigroup Inc")}
                            >
                              <img
                                src="/logos/Citigroup_logo_PNG1.png"
                                alt="logo"
                                style={{
                                  width: "40px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Citigroup Inc
                            </MenuItem>
                            <MenuItem
                              value={"U.S. Bancorp"}
                              disabled={getBankName("U.S. Bancorp")}
                            >
                              <img
                                src="/logos/US-Bank-Logo-PNG3.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;U.S. Bancorp
                            </MenuItem>
                            <MenuItem
                              value={"PNC bank"}
                              disabled={getBankName("PNC bank")}
                            >
                              <img
                                src="/logos/PNC_Bank_logo_PNG1.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;PNC bank
                            </MenuItem>
                            <MenuItem
                              value={"TD Bank"}
                              disabled={getBankName("TD Bank")}
                            >
                              <img
                                src="/logos/TD_Bank_logo_PNG1.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;TD Bank
                            </MenuItem>
                            <MenuItem
                              value={"Capital One"}
                              disabled={getBankName("Capital One")}
                            >
                              <img
                                src="/logos/Capital_One_logo_PNG1.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Capital One
                            </MenuItem>
                            <MenuItem
                              value={"Fifth Third Bank"}
                              disabled={getBankName("Fifth Third Bank")}
                            >
                              <img
                                src="/logos/Harris-Teeter-Logo-PNG_003-1.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Fifth Third Bank
                            </MenuItem>
                            <MenuItem
                              value={"Ally Financial Inc"}
                              disabled={getBankName("Ally Financial Inc")}
                            >
                              <img
                                src="/logos/Ally_Financial_logo_PNG4.png"
                                alt="logo"
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
                              disabled={getBankName(
                                "Huntington Bancshares Incorporated"
                              )}
                            >
                              <img
                                src="/logos/huntington.webp"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Huntington Bancshares Incorporated
                            </MenuItem>
                            <MenuItem
                              value={"KeyCorp"}
                              disabled={getBankName("KeyCorp")}
                            >
                              <img
                                src="/logos/KeyBank_logo_PNG7.png"
                                alt="logo"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;KeyCorp
                            </MenuItem>
                            <MenuItem value={"other"}>Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    {/* Conditionally render the input field for custom text if "Other" is selected */}

                    {otherPropertyTypes && (
                      <div className="mt-3">
                        <Tooltip title="Enter Your Other Bank ">
                          <TextField
                            fullWidth
                            type="text"
                            label="Enter Other Bank"
                            id="bankName"
                            size="normal"
                            onChange={(e) => handleChangesBank(e, "bankName")}
                            value={data.bank.bankName}
                            aria-readonly
                          />
                        </Tooltip>
                      </div>
                    )}
                    {/* multiple accounts */}
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
                                  Bank Type {index >= 0 && <span>*</span>}
                                </InputLabel>
                                <Select
                                  labelId={`AccountType${index + 1}`}
                                  id={`accountType${index + 1}`}
                                  label="Account Type"
                                  // value={data.accounts.accountType}
                                  value={
                                    data.accounts[index]?.accountType || ""
                                  }
                                  // onChange={(e) => handleChanges(e, `accountType${index + 1}`)}
                                  onChange={(e) =>
                                    handleChanges1(e, "accountType", {
                                      index,
                                    })
                                  }
                                  onClick={() => setBankFieldClicked(true)}
                                  // required={index === 0}
                                  required={visibleColumnIndex >= index}
                                >
                                  <MenuItem
                                    value="Checking Account"
                                    disabled={selectedBankTypes.includes(
                                      "Checking Account"
                                    )}
                                  >
                                    Checking Account
                                  </MenuItem>
                                  <MenuItem
                                    value="Savings Account"
                                    disabled={selectedBankTypes.includes(
                                      "Savings Account"
                                    )}
                                  >
                                    Savings Account
                                  </MenuItem>
                                  <MenuItem
                                    value="Investment Account"
                                    disabled={selectedBankTypes.includes(
                                      "Investment Account"
                                    )}
                                  >
                                    Investment Account
                                  </MenuItem>
                                  <MenuItem
                                    value="C.D Account"
                                    disabled={selectedBankTypes.includes(
                                      "C.D Account"
                                    )}
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
                                  required={visibleColumnIndex >= index}
                                  // onChange={(e) => handleChanges(e, `BankAccount${index + 1}`)}
                                  onChange={(e) =>
                                    handleChanges1(e, "accountNumber", {
                                      index,
                                    })
                                  }
                                  // value={data.accounts.accountNumber}
                                  value={
                                    data.accounts[index]?.accountNumber || ""
                                  }
                                  inputProps={{
                                    minLength: 15,
                                    maxLength: 15,
                                  }}
                                  error={!validateBankAccountNum(index)}
                                  helperText={
                                    !validateBankAccountNum(index)
                                      ? "Please enter a valid 15-digit Account No"
                                      : ""
                                  }
                                  // value={data.accounts[0].accountNumber}
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
                                  required={visibleColumnIndex >= index}
                                  // onChange={(e) => handleChanges(e, `balance${index + 1}`)}
                                  onChange={(e) =>
                                    handleChanges1(e, "balance", { index })
                                  }
                                  // value={data.accounts[0].balance}
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
                          {index !== 0 && (
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
                              }}
                              onClick={() => handleRemoveBank(index)}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </Button>
                          )}
                        </div>
                      ))}
                      {visibleColumnIndex < 3 && (
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
                      )}
                    </div>
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
                                checked={isChecked}
                                onChange={handleSwitchChange}
                                color="primary"
                                size="normal"
                              />
                            }
                            label={isChecked ? "Yes" : "No"}
                            labelPlacement="end"
                          />
                        </div>
                      </div>

                      {isChecked && (
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
                    </div>
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
                          onChange={(e) => handleChangesBank(e, "notes")}
                          value={data.bank.notes}
                          inputProps={{
                            maxLength: 1000, // Set the maximum character limit to 1000
                          }}
                        />
                      </Tooltip>
                    </div>
                    <Container className="text-center">
                      <Button
                        className="my-estate-clear-btn"
                        type="reset"
                        outline
                      >
                        Clear
                      </Button>
                      <Button outline className="my-estate-add-btn">
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
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetInvestment() {
  const navigate = useNavigate();
  let userId = getUser().id;
  //  form show button
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

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

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
  const resetData = () => {
    setData({
      investment: "",
      totalAmount: "",
      nameOfTheInvestment: "",
      exampleFile: "",
      notes: "",
      addfield1: "",
      addfield2: "",
      addfield3: "",
      addfield4: "",
      addfield5: "",
      benificiary: "",
      investmentCaption: "",
    });
    setSelectedImage(null);
    // setInvestmentName("");
  };

  // Set the form
  const investmentForm = (event) => {
    event.preventDefault();

    toggle();
    // if (error.isError) {
    //   toast.error("Form data is invalid.");
    //   return;
    // }

    let token = "Bearer " + getToken();

    // console.log("Token : " + token);
    if (
      data.investment.investment === "" ||
      data.investment.totalAmount === "" ||
      data.investment.nameOfTheInvestment === ""
    ) {
      // console.log("Error log");
      toast.error("Please Fill All required field Then Submit .", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    //create form data to send a file and remaining class data
    const formData = new FormData();

    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }

    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    addInternationalAsset(formData, token)
      .then((resp) => {
        // console.log(resp);
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
        AddCard();
        // window.location.reload();
      })
      .catch((error) => {
        // console.log(error);
        // console.log("Error log");
        // // handle error
        // setError({
        //   errors: error,
        //   isError: true
        // })
      });
  };

  //Get data show
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    // console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    // getInvestments(token, userId)
    //   .then((res) => {
    //     // console.log(res);
    //     setCategory(res);
    //   })
    //   .catch((error) => {
    //     // Handle error, including error message
    //     console.error("Error:", error);
    //   });
  };
  // Code by Purnendu
  const handleRemove = (id) => {
    // let token = "Bearer " + getToken();
    // deleteInvestment(id)
    //   .then((res) => {
    //     toast.success("Deleted successfully...", {
    //       position: toast.POSITION.BOTTOM_CENTER,
    //     });
    //     // console.log("SuccessFully Deleted " + res);
    //     getData();
    //     AddCard();
    //     setShow1(false);
    //     // window.location.reload();
    //   })
    //   .catch((error) => {
    //     // console.log("Note Deleted " + error);
    //   });
  };

  const handleDownload = (id, fileName) => {
    let myarry = fileName.split(".");
    const token = getToken();
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
  // const handleOpenPopup = (note) => {
  //   setSelectedNote(note);
  //   setPopupVisible(true);
  // };
  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };
  // const handleShowDownlaod = (showDetail) => {
  //   setPopupVisibleDownlaod(true);
  //   setSelectDownload(showDetail);
  // }

  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      id: "investment",
      label: "Investments",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "nameOfTheInvestment",
      label: "Name\u00a0Of\u00a0Exchange",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "totalAmount",
      label: "Estimated\u00a0Amount",

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

  // const [investmentName, setInvestmentName] = React.useState("");

  // const investmenthandleChange = (event) => {
  //   setInvestmentName(event.target.value);
  //   data.investment.investment = event.target.value;
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

  // page opening  animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  // new update

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    // getInvestments(token, userId)
    //   .then((res) => {
    //     setCard(res);

    //     console.log("This is card data:", res);
    //   })
    //   .catch((error) => {
    //     setCard([]);
    //     toast.error("Card not created!!");
    //     console.error(error); // Changed to console.error for better visibility of errors
    //   });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow1(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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

  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

  //
  const [benevisible, setbeneVisible] = useState(false);
  const [distributionType, setDistributionType] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [beneficiaryVisible, setBeneficiaryVisible] = useState(false);
  const [SelectedBeneficiary, setSelectedBeneficiary] = useState("");

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);

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

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container>
              <Card color="outline">
                <CardHeader>
                  <h2 className="form1-heading">Investments</h2>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading for Investment ">
                        <TextField
                          required
                          fullWidth
                          type="text"
                          label="Investment Heading"
                          id="captionOfTheInvestment"
                          size="normal"
                          onChange={(e) =>
                            handleChanges(e, "investmentCaption")
                          }
                          value={data.investment.investmentCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip
                        title="
                          Select Investment Type"
                      >
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
                            // onChange={investmenthandleChange}
                            // value={investmentName}
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

                    <div className="mt-3">
                      <Tooltip title="Enter the name of Exchange ">
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
                    <div className="mt-3">
                      <Tooltip title="Enter your Estimated Amount ">
                        <TextField
                          required
                          fullWidth
                          type="number"
                          label="Estimated Amount"
                          id="totalAmount"
                          size="normal"
                          onChange={(e) => {
                            handleChanges(e, "totalAmount");
                            setIsTextFieldClicked(true);
                          }}
                          value={data.investment.totalAmount}
                          InputProps={{
                            startAdornment: isTextFieldClicked ? (
                              <div>$</div>
                            ) : null,
                          }}
                        />
                      </Tooltip>
                    </div>

                    {/* <div className="mt-2">
                            <FormGroup className="Property-textfield" >
                              <Label className="Property-headingname" for="property">
                            Select Your Beneficiary Username
                          </Label>
                              <Input
                                required
                                className="Property-inputfiled"
                                type="select"
                                name="select"
                                id="property"
                                onChange={(e) => handleChanges(e, "benificiary")}
                                value={data.benificiary}
                              >
                                <option defaultValue aria-readonly >
                                  <p >Select Your Beneficiary Username</p>
                                </option>
                                {beneficiary.map((benif) => {
                                  return (
                                    <option
                                      key={benif.username}
                                      value={benif.username}
                                    >
                                      {benif.username}
                                    </option>
                                  );
                                })}
                              </Input>
                            </FormGroup>
                          </div> */}

                    <div className="mt-3">
                      <Tooltip title="Add your investment related file">
                        <div>
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
                            accept=".pdf"
                            multiple
                            onChange={(e) => handleImageChange(e)}
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
                              <span className="addFieldClose" onClick={()=>setVisibleField(visibleField-1)} style={{ width: "2%",paddingLeft:"5px" }}><FontAwesomeIcon icon={faXmark} /></span>
                        </div>
                      ))}
                      
                    </div> */}

                    <Container className="text-center">
                      <Button
                        onClick={resetData}
                        className="my-estate-clear-btn"
                        type="reset"
                        outline
                      >
                        Clear
                      </Button>
                      <Button outline className="my-estate-add-btn">
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
                      icon={faHandHoldingDollar}
                      style={{ color: "#025596", fontSize: "18px" }}
                    />
                    <span>{showDetail.investment.investment}</span>
                  </p>

                  <div className="row1-button">
                    <div>
                      <Tooltip title="">
                        {showDetail.documents &&
                          showDetail.documents.length > 0 && (
                            <Tooltip title="click to see multiple downlaod files">
                              <p
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
                              </p>
                            </Tooltip>
                          )}
                      </Tooltip>
                    </div>

                    <div>
                      <Tooltip title="Click Here To Edit">
                        <div>
                          {/* <UpdateButton
                            URL={"../my-estate/investment/"}
                            id={showDetail.investment.id}
                          /> */}
                        </div>
                      </Tooltip>
                    </div>

                    <div>
                      {/* <Deletebutton
                        handleRemove={handleRemove}
                        Id={showDetail.investment.id}
                      /> */}
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
                      Investment:{" "}
                      <code>{showDetail.investment.investment}</code>
                    </p>
                    <p>
                      Investment Caption:{" "}
                      <code>{showDetail.investment.investmentCaption}</code>
                    </p>
                    <p>
                      Name of Exchange:{" "}
                      <code>{showDetail.investment.nameOfTheInvestment}</code>
                    </p>
                    <p>
                      Total Amount:{" "}
                      <code style={{ color: "green", fontWeight: "bold" }}>
                        $ {showDetail.investment.totalAmount}
                      </code>
                    </p>

                    {showDetail.sharedDetails[0].beneficiaryId && (
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

                    {/* {showDetail.addfield1 &&
                            (<Tooltip title={`Click To See Details`}>
                              <p onClick={() => { SetshowAdditionField(showDetail); setShow1(!show1) }}>Additional Fields:&nbsp;
                                <code>{showDetail && showDetail.addfield1 ? showDetail.addfield1.slice(0, 5) : ''}...<span className="readmore">Read More</span></code>
                              </p>
                            </Tooltip>)} */}

                    {showDetail.investment.notes && (
                      <Tooltip title="Click To see Note">
                        <p
                          onClick={() => {
                            handleOpenPopup(showDetail.investment.notes);
                            setShow1(!show1);
                          }}
                        >
                          Note:{" "}
                          <code>
                            {" "}
                            {showDetail && showDetail.notes
                              ? showDetail.notes.slice(0, 5)
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

      {benevisible && (
        // beneShow &&
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
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetCrypto() {
  const navigate = useNavigate();
  //  form show button
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
  // const [error, setError] = useState({
  //   errors: {},
  //   isError: false,
  // });

  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      cryptoAssest: {
        ...prevData.cryptoAssest,
        [field]: newValue,
      },
    }));
    setEstimatedTotalAmount(estimatedValue);
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

  const resetData = () => {
    setData({
      coin: "",
      exchange: "",
      wallet: "",
      quntity: "",
      estimatedValue: "",
      exampleFile: "",
      notes: "",
      benificiary: "",
      addfield1: "",
      addfield2: "",
      addfield3: "",
      addfield4: "",
      addfield5: "",
      cryptoCaption: "",
    });
    setSelectedImage(null);
    setCoinName("");
    setExchangeName("");
    setWalletName("");
  };
  const [coinName, setCoinName] = React.useState("");

  const coinHandleChange = (event) => {
    setCoinName(event.target.value);
    data.coin = event.target.value;
  };
  const [exchangeName, setExchangeName] = React.useState("");
  const exchangeHandleChange = (event) => {
    setExchangeName(event.target.value);
    data.exchange = event.target.value;
  };
  const [walletName, setWalletName] = React.useState("");
  const walletHandleChange = (event) => {
    setWalletName(event.target.value);
    data.wallet = event.target.value;
  };
  // Set the form
  const cryptoForm = (event) => {
    event.preventDefault();
    toggle();

    let token = "Bearer " + getToken();
    // console.log("Token : " + token);
    if (
      data.cryptoAssest.coin === "" ||
      data.cryptoAssest.exchange === "" ||
      data.cryptoAssest.wallet === "" ||
      data.cryptoAssest.quantity === ""
    ) {
      // console.log("Error log");
      toast.error("Please Fill All required field Then Submit .", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    //create form data to send a file and remaining class data
    const formData = new FormData();
    // console.log("before remove :", data);
    const { estimatedValue, ...formDataValues } = data;

    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    addInternationalAsset(formData, token)
      .then((resp) => {
        // console.log(resp);
        // console.log("Success log");
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
        AddCard();
      })
      .catch((error) => {
        // console.log(error);
        //console.log("Error log");
        // handle error
        // setError({
        //   errors: error,
        //   isError: true
        // })
      });
  };

  //data show
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    // console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    //   getCryptoAssests(token, userId).then((res) => {
    //     // console.log("my response ",res);
    //     setCategory(res);
    //   }).catch((error) => {
    //     console.log(error);
    //   })
    // console.log(category[0]);
  };

  // Code by Purnendu
  const handleRemove = (Id) => {
    // let token = "Bearer " + getToken();
    //   deleteCryptoAssest(Id)
    //     .then((res) => {
    //       toast.success("Deleted successfully...", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       // console.log("SuccessFully Deleted " + res);
    //       getData();
    //       AddCard();
    //       setShow1(false);
    //       // window.location.reload();
    //     })
    //     .catch((error) => {
    //       // console.log("Not Deleted " + error);
    //     });
  };

  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token
    // console.log("bank method calling");
    //   downloadDocument("cryptoAssest", fileName, fileNumber)
    //     .then((response) => {
    //       console.log("files in downlaod", response);
    //       const downloadUrl = URL.createObjectURL(response.data);
    //       // console.log(downloadUrl);
    //       const link = document.createElement("a");
    //       link.href = downloadUrl;
    //       link.download = `${myarry[0]}.${myarry[1]}`; // Set the desired file name and extension
    //       link.click();
    //       URL.revokeObjectURL(downloadUrl);
    //     })
    //     .catch((error) => {
    //       // Handle the error
    //     });
  };
  const columns = [
    {
      id: "coin",
      label: "Name",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "quntity",
      label: "Quantity",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "estimatedValue",
      label: "Estimated\u00a0Value",
      type: "realtimeValue",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "exchange",
      label: "Exchange",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "wallet",
      label: "Wallet",
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
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
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

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState([]);
  const getCoins = () => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
      )
      .then((res) => {
        setCoins(res.data);
        // console.log("Coins : ", res.data);
      })
      .catch((error) => {
        // console.log("ERROR : ", "You've exceeded the Limit try after some time !!");
      });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getData();
    getCoins();
  }, []);

  const [estimatedValue, setEstimatedValue] = useState(0);
  // const findEstimatedValue = (coinName, quantity) => {
  //   const selectedCrypto = coins.find((coin) => coin.name === coinName);
  //   // console.log("selectedCrypto 1: ", selectedCrypto);
  //   if (selectedCrypto) {
  //     // console.log("selectedCrypto : ", selectedCrypto);
  //     const estimatedValue = quantity * selectedCrypto.current_price;
  //     // console.log("estimatedValue : ", selectedCrypto);
  //     setEstimatedValue(estimatedValue.toString());
  //   }
  // };
  useEffect(() => {
    const calculateEstimatedValue = () => {
      // Check if both selectCrypto and quntity fields have values
      if (data.cryptoAssest.coin && data.cryptoAssest.quantity) {
        // Perform the calculation for the estimated value
        const selectedCrypto = coins.find(
          (coin) => coin.name === data.cryptoAssest.coin
        );
        // console.log("selectedCrypto 1: ", selectedCrypto);
        if (selectedCrypto) {
          // console.log("selectedCrypto : ", selectedCrypto);
          const estimatedValue1 =
            data.cryptoAssest.quantity * selectedCrypto.current_price;
          // console.log("estimatedValue : ", selectedCrypto);
          setEstimatedValue(estimatedValue1.toString());
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
        // console.log("estimatedValue : ", estimatedValue);
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

  const calculateEstimatedValue1 = (coin1, quntity) => {
    // return "123";
    // console.log("coin1 : ", coin1);
    const filteredCoins = coins.filter((coin) => coin.name === coin1);
    // console.log("filteredCoins : ", filteredCoins);
    if (filteredCoins.length > 0) {
      // console.log("filteredCoins : ", filteredCoins);
      // console.log("EstimatedValue : ", parseInt(quntity) * filteredCoins[0].current_price)
      return parseInt(quntity) * filteredCoins[0].current_price;
    }
  };

  // show note popup
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

  // page opening  animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    //   getCryptoAssests(token, userId)
    //     .then((res) => {
    //       setCard(res);

    //       console.log("This is card data:", res);
    //     })
    //     .catch((error) => {
    //       setCard([]);
    //       toast.error("Card not created!!");
    //       console.error(error); // Changed to console.error for better visibility of errors
    //     });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow1(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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

  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

  //
  // let [show1, setShow1] = useState(false);
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
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container>
              <Card color="" outline>
                {/* {JSON.stringify(data)} */}
                <CardHeader>
                  <h3 className="form1-heading">Crypto Assets</h3>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading For Your Coin">
                        <TextField
                          fullWidth
                          type="text"
                          label="Crypto Heading"
                          id="cryptoCaption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "cryptoCaption")}
                          value={data.cryptoAssest.cryptoCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
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
                            {/* <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem> */}
                            {coins.length > 0 ? (
                              coins.map((coin, index) => {
                                return (
                                  <MenuItem key={index} value={coin.name}>
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
                    <div
                      style={{ display: "flex", gap: "5px" }}
                      className="form1-double"
                    >
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
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your estimated Value ">
                          <TextField
                            fullWidth
                            placeholder="$"
                            type="text"
                            label="Estimated Value"
                            id="estimatedValue"
                            size="normal"
                            onChange={(e) => {
                              handleChanges(e, "estimatedValue");
                              setIsTextFieldClicked(true);
                            }}
                            value={estimatedValue}
                            InputProps={{
                              readOnly: true,
                              startAdornment: isTextFieldClicked ? (
                                <div>$</div>
                              ) : null,
                            }}

                            // disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="mt-3">
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
                            <MenuItem value={"Binance.US"}>Binance.US</MenuItem>
                            <MenuItem value={"Kraken"}>Kraken</MenuItem>
                            <MenuItem value={"Gemini"}>Gemini</MenuItem>
                            <MenuItem value={"Bitfinex"}>Bitfinex</MenuItem>
                            <MenuItem value={"Bitstamp"}>Bitstamp</MenuItem>
                            <MenuItem value={"Huobi US"}>Huobi US</MenuItem>
                            <MenuItem value={"Crypto.com"}>Crypto.com</MenuItem>
                            <MenuItem value={"BitFlyer"}>BitFlyer</MenuItem>
                            <MenuItem value={"OKCoin"}>OKCoin</MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>

                    <div className="mt-3">
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
                            <MenuItem value={"Freewallet"}>Freewallet</MenuItem>
                            <MenuItem value={"KeepKey"}>KeepKey</MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Add your crypto related file">
                        <div>
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
                        onClick={resetData}
                        color="warning"
                        className="my-estate-clear-btn"
                        outline
                      >
                        Clear
                      </Button>
                      <Button outline className="my-estate-add-btn">
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

      {benevisible && (
        // beneShow &&
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
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetJewelry() {
  const navigate = useNavigate();
  //  form show button
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };

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
  const [jewelryName, setJewelryName] = useState("");
  const [keratUnit, setKeratUnit] = useState("");

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

  const keratvalueHandleChanges = (event) => {
    setKeratUnit(event.target.value);
    data.keratValue = event.target.value;
  };
  const jewelryHandleChange = (event) => {
    setJewelryName(event.target.value);
    data.details = event.target.value;
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

  const resetData = () => {
    setData({
      details: "",
      estimatedValue: "",
      keratValue: "",
      exampleFile: "",
      notes: "",
      weight: "",
      benificiary: "",
      jewelryCaption: "",
    });
    setSelectedImage(null);
    setJewelryName("");
    setKeratUnit("");
  };

  // Set the form
  const jewelryForm = (event) => {
    event.preventDefault();
    toggle();

    let token = "Bearer " + getToken();

    // console.log("Token : " + token);
    if (
      data.details === "" ||
      data.estimatedValue === "" ||
      data.keratValue === ""
    ) {
      // console.log("Error log");
      toast.error("Please Fill All required field Then Submit .", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    //create form data to send a file and remaining class data
    const formData = new FormData();
    // console.log("before remove :", data);
    // const { estimatedValue, ...formDataValues } = data;
    // const estimatedValueString = data.estimatedValue.toString();
    // console.log("after remove :", estimatedValue);

    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }

    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    addInternationalAsset(formData, token)
      .then((resp) => {
        // console.log(resp);
        // console.log("Success log");
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
        AddCard();

        // window.location.reload();
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  // Get data show

  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    // console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    //   getJewelries(token, userId)
    //     .then((res) => {
    //       // console.log(res);
    //       setCategory(res);
    //     })
    //     .catch((error) => {
    //       // console.log(error);
    //       // console.log("Data not loaded");
    //     });
  };
  // Code by Purnendu
  const handleRemove = (id) => {
    // let token = "Bearer " + getToken();
    //   deleteJewelry(id)
    //     .then((res) => {
    //       toast.success("Deleted successfully...", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       // console.log("SuccessFully Deleted " + res);
    //       getData();
    //       AddCard();
    //       setShow1(false);
    //       // window.location.reload();
    //     })
    //     .catch((error) => {
    //       // console.log("Note Deleted " + error);
    //     });
  };

  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token
    // console.log("bank method calling");
    downloadDocument("jewelry", fileName, fileNumber)
      .then((response) => {
        console.log("files in downlaod", response);
        const downloadUrl = URL.createObjectURL(response.data);
        // console.log(downloadUrl);
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

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      id: "details",
      label: "Name",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "keratValue",
      label: "Karats\u00a0Value",
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "weight",
      label: "Weight\u00a0(gm)",
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "estimatedValue",
      label: "Appraised\u00a0Value",
      type: "realtimeValue",
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
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
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
      // if (data.keratValue === "") {
      //   setMetalPrice(0);
      //   return;
      // }

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
        .catch((error) => {
          // console.log("Error: ", "Failed to fetch the metal price");
        });
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

        // setData((prevData) => ({
        //   ...prevData,
        //   estimatedValue: estimatedValue.toFixed(3),
        // }));
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

  // for multiple download
  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");

  const handleShowDownlaod = (showDetail) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
  };

  // page opening  animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    //   getJewelries(token, userId)
    //     .then((res) => {
    //       setCard(res);

    //       console.log("This is card data:", res);
    //     })
    //     .catch((error) => {
    //       setCard([]);
    //       toast.error("Card not created!!");
    //       console.error(error); // Changed to console.error for better visibility of errors
    //     });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow1(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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
  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

  //
  // let [show1, setShow1] = useState(false);
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
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms", height: "" }}>
          <div className="property_form">
            <Container>
              <Card outline>
                <CardHeader>
                  <h3 className="form1-heading">Jewelry</h3>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading for Jewelry">
                        <TextField
                          required
                          type="text"
                          label="Jewelry Heading"
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
                    <div className="mt-3">
                      <Tooltip title="Enter Jewelry Name">
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

                    <div className="mt-3">
                      <Tooltip title="select Carats Value of jewelry">
                        <FormControl
                          required
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-label">
                            Select Carat Value
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="keratValue"
                            label="select Carat Value"
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
                    <div
                      style={{ display: "flex", gap: "5px" }}
                      className="form1-double"
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter the weight of Jewelry (gram)">
                          <TextField
                            required
                            type="number"
                            label="Weight"
                            id="weight"
                            size="normal"
                            style={{
                              borderLeft: "none",
                              width: "100%",
                              borderRadius: "5px",
                            }}
                            onChange={(e) => handleChanges(e, "weight")}
                            value={data.jewelry.weight}
                          />
                        </Tooltip>
                      </div>
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter Appraised Value of the Jewelry">
                          <TextField
                            placeholder="$"
                            required
                            type="number"
                            label="Appraised Value"
                            id="estimatedValue"
                            size="normal"
                            style={{
                              borderLeft: "none",
                              width: "100%",
                              borderRadius: "5px",
                            }}
                            // style={{ width: "370px" }}
                            onChange={(e) => {
                              handleChanges(e, "estimatedValue");
                              setIsTextFieldClicked(true);
                            }}
                            value={data.jewelry.estimatedValue}
                            InputProps={{
                              readOnly: true,
                              startAdornment: isTextFieldClicked ? (
                                <div>$</div>
                              ) : null,
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Add your jewelry related file">
                        <div>
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
                      <Tooltip title="Enter notes for your jewelry">
                        <TextField
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          style={{
                            borderLeft: "none",
                            width: "100%",
                            borderRadius: "5px",
                          }}
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.jewelry.notes}
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
                        onClick={resetData}
                        className="my-estate-clear-btn"
                        type="reset"
                        outline
                      >
                        Clear
                      </Button>
                      <Button className="my-estate-add-btn" outline>
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

      {benevisible && (
        // beneShow &&
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
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetInsurance() {
  const navigate = useNavigate();
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

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

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
  const resetData = () => {
    setData({
      details: "",
      // supportingDcument: "",
      detailsOfpoint: "",
      exampleFile: "",
      notes: "",
      benificiary: "",
      insuranceCaption: "",
    });
  };

  // Set the form
  const lifeForm = (event) => {
    event.preventDefault();
    toggle();
    if (
      data.details === "" ||
      // data.supportingDcument === "" ||
      data.detailsOfpoint === ""
    ) {
      // console.log("Error log");
      toast.error("Please fill all required fields.");
      return;
    }

    let token = "Bearer " + getToken();

    // console.log("Token : " + token);

    //create form data to send a file and remaining class data
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    addInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      })
      .catch((error) => {
        console.log("this is the error", error);
        // console.log("Error log");
        // handle error

        setError({
          errors: error,
          isError: true,
        });
      });
  };

  //data show
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    // console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    //   getInsurance(token, userId)
    //     .then((res) => {
    //       // console.log(res);
    //       setCategory(res);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       // console.log("Data not loaded");
    //     });
  };

  // Code by Purnendu
  const handleRemove = (id) => {
    // let token = "Bearer " + getToken();
    //   deleteInsurance(id)
    //     .then((res) => {
    //       toast.success("Deleted successfully...", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       // console.log("SuccessFully Deleted " + res);
    //       getData();
    //       AddCard();
    //       setShow1(false);
    //     })
    //     .catch((error) => {
    //       // console.log("Note Deleted " + error);
    //     });
  };

  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token
    // console.log("bank method calling");
    downloadDocument("lifeInsurance", fileName, fileNumber)
      .then((response) => {
        console.log("files in downlaod", response);
        const downloadUrl = URL.createObjectURL(response.data);
        // console.log(downloadUrl);
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

  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      id: "details",
      label: "Insurance\u00a0Name",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "supportingDcument",
      label: "Supporting\u00a0Document",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "detailsOfpoint",
      label: "Point\u00a0Of\u00a0Contact\u00a0Name",

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

  // page opening  animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  //  form show button
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    //   getInsurance(token, userId)
    //     .then((res) => {
    //       setCard(res);

    //       console.log("This is card data:", res);
    //     })
    //     .catch((error) => {
    //       toast.error("Card not created!!");
    //       console.error(error); // Changed to console.error for better visibility of errors
    //     });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow1(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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
  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

  //
  // let [show1, setShow1] = useState(false);
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
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms" }}>
          <div className="property_form">
            <Container>
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Life Insurance</h3>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading of Insurances ">
                        <TextField
                          fullWidth
                          required
                          type="text"
                          label="Insurance Heading"
                          id="Insurance Caption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "insuranceCaption")}
                          value={data.insurance.insuranceCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter The Name Of Your Insurance ">
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

                    <div className="mt-3">
                      <Tooltip title="Enter your Details of Point Contact Name ">
                        <TextField
                          fullWidth
                          required
                          type="text"
                          label="Details of Point Contact Name"
                          id="detailsOfpoint"
                          size="normal"
                          onChange={(e) => handleChanges(e, "detailsOfpoint")}
                          value={data.insurance.detailsOfpoint}
                        />
                      </Tooltip>
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
                          type="file"
                          name="myfile"
                          id="exampleFile"
                          multiple
                          accept=".pdf"
                          onChange={(e) => handleImageChange(e)}
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

                    <Container className="text-center">
                      <Button
                        onClick={resetData}
                        className="my-estate-clear-btn"
                        type="reset"
                        outline
                      >
                        Clear
                      </Button>
                      <Button outline className="my-estate-add-btn">
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
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetVehicles() {
  const navigate = useNavigate();
  //  form show button
  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };

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
  const resetData = () => {
    setData({
      vehicleType: "",
      year: "",
      loan: "",
      make: "",
      miels: "",
      model: "",
      estValue: "",
      notes: "",
      exampleFile: "",
      benificiary: "",
      addfield1: "",
      addfield2: "",
      addfield3: "",
      addfield4: "",
      addfield5: "",
      vehicleCaption: "",
    });
    setVehicleName("");
    setMakeName("");
    setModelName("");
  };
  const [vehicleName, setVehicleName] = React.useState("");
  const [makeName, setMakeName] = React.useState("");
  const [modelName, setModelName] = React.useState("");

  const VehicleHandleChange = (event) => {
    setVehicleName(event.target.value);
    data.vehicleType = event.target.value;
  };
  const MakeHandleChange = (event) => {
    setMakeName(event.target.value);
    data.make = event.target.value;
  };
  const ModelHandleChange = (event) => {
    setModelName(event.target.value);
    data.model = event.target.value;
  };
  // Set the form
  const vehiclesForm = (event) => {
    event.preventDefault();

    toggle();
    // if (error.isError) {
    //   toast.error("Form data is invalid.");
    //   return;
    // }
    if (
      data.vehicle.vehicleType === "" ||
      data.vehicle.year === "" ||
      data.vehicle.loan === "" ||
      data.vehicle.make === "" ||
      data.vehicle.miles === "" ||
      data.vehicle.model === "" ||
      data.vehicle.estValue === ""
    ) {
      // console.log("Data : " + JSON.stringify(data));
      // console.log("Error log");
      toast.error("Please fill all required feilds.");
      return;
    }

    let token = "Bearer " + getToken();

    // console.log("Token : " + token);

    //create form data to send a file and remaining class data
    const formData = new FormData();

    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    addInternationalAsset(formData, token)
      .then((resp) => {
        // console.log(resp);
        // console.log("Success log");
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
        AddCard();
        // window.location.reload();
      })
      .catch((error) => {
        // console.log(error);
        // console.log("Error log");
        // // handle error
        // setError({
        //   errors: error,
        //   isError: true
        // })
      });
  };
  //get form

  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    // console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    //   getVehicle(token, userId)
    //     .then((res) => {
    //       // console.log(res);
    //       setCategory(res);
    //     })
    //     .catch((error) => {
    //       // console.log(error);
    //       // console.log("Data not loaded");
    //     });
  };
  // Code by Purnendu
  const handleRemove = (Id) => {
    // let token = "Bearer " + getToken();
    //   deleteVehicle(Id)
    //     .then((res) => {
    //       toast.success("Deleted successfully...", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       // console.log("SuccessFully Deleted " + res);
    //       getData();
    //       AddCard();
    //       setShow1(false);
    //       // window.location.reload();
    //     })
    //     .catch((error) => {
    //       // console.log("Note Deleted " + error);
    //     });
  };

  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token
    // console.log("bank method calling");
    downloadDocument("vehicles", fileName, fileNumber)
      .then((response) => {
        console.log("files in downlaod", response);
        const downloadUrl = URL.createObjectURL(response.data);
        // console.log(downloadUrl);
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

  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      id: "vehicleType",
      label: "Vehicle\u00a0Type",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "year",
      label: "Year\u00a0Of\u00a0Manufacture",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "make",
      label: "Maker",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "model",
      label: "Model",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "miels",
      label: "Miels",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "loan",
      label: "Loan",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "evalue",
      label: "Estimated\u00a0Value",

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

  // show notes popup
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const handleOpenPopup = (note) => {
    setSelectedNote(note);
    setPopupVisible(true);
  };

  const [popupVisibleDownlaod, setPopupVisibleDownlaod] = useState(false);
  const [selectedDownlaod, setSelectDownload] = useState("");

  const handleShowDownlaod = (showDetail) => {
    setPopupVisibleDownlaod(true);
    setSelectDownload(showDetail);
  };

  // page opening  animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    //   getVehicle(token, userId)
    //     .then((res) => {
    //       setCard(res);

    //       console.log("This is card data:", res);
    //     })
    //     .catch((error) => {
    //       toast.error("Card not created!!");
    //       console.error(error); // Changed to console.error for better visibility of errors
    //     });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow1(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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

  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

  //
  // let [show1, setShow1] = useState(false);
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
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms" }}>
          <div className="property_form">
            <Container style={{ height: "auto", boxSizing: "border-box" }}>
              <Card color="" outline>
                {/* {JSON.stringify(data)} */}

                <CardHeader>
                  <h3 className="form1-heading">Add Vehicles</h3>
                  <div className="Close" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={vehiclesForm}>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading for vehicle">
                        <TextField
                          fullWidth
                          type="text"
                          label="Vehicle Heading"
                          id="vehicleCaption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "vehicleCaption")}
                          value={data.vehicle.vehicleCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
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
                            <MenuItem value={"Sports Car"}>Sports Car</MenuItem>
                            <MenuItem value={"Electric Car"}>
                              Electric Car
                            </MenuItem>
                            <MenuItem value={"Hybrid Car"}>Hybrid Car</MenuItem>
                            <MenuItem value={"Luxury Car"}>Luxury Car</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>

                    <div className="mt-3 date">
                      <FormControl
                        fullWidth
                        sx={{ minWidth: 120 }}
                        size="small"
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          {/* <Tooltip title="Enter the year of Manufacture of your vehicle "> */}
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                            }}
                          >
                            {" "}
                            <span></span>
                          </label>
                          <DatePicker
                            label="Manufactured Date"
                            onChange={(date) => handleDateChanges(date, "year")}
                            value={data.vehicle.year}
                            style={{ borderColor: "black" }}
                            required
                          />
                          {/* </Tooltip> */}
                        </LocalizationProvider>
                      </FormControl>
                    </div>

                    <div
                      className="form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="mt-3" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter the company of your vehicle ">
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

                      <div
                        className="mt-3 form1-double"
                        style={{ width: "49.5%" }}
                      >
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
                    </div>

                    <div
                      className="mt-3 form1-double"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <div className="" style={{ width: "49.5%" }}>
                        <Tooltip title="Enter your vehicle mileage ">
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
                      <div className="" style={{ width: "49.5%" }}>
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
                            InputProps={{
                              startAdornment: isTextFieldClicked ? (
                                <div>$</div>
                              ) : null,
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter your Estimated valuation of vehicle">
                        <TextField
                          placeholder="$"
                          fullWidth
                          type="number"
                          label="Estimated valuation"
                          id="evalue"
                          size="normal"
                          onChange={(e) => {
                            handleChanges(e, "estValue");
                            setIsTextFieldClicked(true);
                          }}
                          value={data.vehicle.estValue}
                          InputProps={{
                            startAdornment: isTextFieldClicked ? (
                              <div>$</div>
                            ) : null,
                          }}
                        />
                      </Tooltip>
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

                    <div className="mt-3">
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
                        onClick={resetData}
                        className="my-estate-clear-btn"
                        type="reset"
                        outline
                      >
                        Clear
                      </Button>
                      <Button outline className="my-estate-add-btn">
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

      {benevisible && (
        // beneShow &&
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
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetIncome() {
  const navigate = useNavigate();
  // new update
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
      payCheck: "",
      businessSource: "",
      // customize: "",
      exampleFile: "",
      notes: "",
      benificiary: "",
      addfield1: "",
      addfield2: "",
      addfield3: "",
      addfield4: "",
      addfield5: "",
      incomeCaption: "",
    });
  };

  // Set the form
  const activeincomeForm = (event) => {
    event.preventDefault();
    toggle();
    if (
      data.payCheck === "" ||
      data.businessSource === "" ||
      data.benificiary === ""
    ) {
      // console.log("Error log");
      toast.error("Please fill all required feilds.");
      return;
    }

    let token = "Bearer " + getToken();

    // console.log("Token : " + token);

    //create form data to send a file and remaining class data
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }

    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));

    addInternationalAsset(formData, token)
      .then((resp) => {
        // console.log(resp);
        // console.log("Success log");
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
        AddCard();
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  //Get data show

  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    // console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    //   getIncome(token, userId).then((res) => {
    //     // console.log(res);
    //     setCategory(res);
    //   }).catch((error) => {
    //     console.log(error);
    //   });
    // console.log(category[0]);
  };

  // Code by Purnendu
  const handleRemove = (Id) => {
    // let token = "Bearer " + getToken();
    //   deleteIncome(Id)
    //     .then((res) => {
    //       toast.success("Deleted successfully...", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       // console.log("SuccessFully Deleted " + res);
    //       getData();
    //       AddCard();
    //       setShow1(false);
    //     })
    //     .catch((error) => {
    //       // console.log("Note Deleted " + error);
    //     });
  };

  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token
    // console.log("bank method calling");
    downloadDocument("activeIncome", fileName, fileNumber)
      .then((response) => {
        console.log("files in downlaod", response);
        const downloadUrl = URL.createObjectURL(response.data);
        // console.log(downloadUrl);
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
  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      id: "payCheck",
      label: "Income",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "businessSource",
      label: "Source",

      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "customize",
      label: "Customize(underWork)",

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
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "action",
      label: "Action",
      align: "center",
      format: "action",
      style: {
        // padding:0,
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

  // page opening  animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken();
    //   getIncome(token, userId)
    //     .then((res) => {
    //       setCard(res);

    //       console.log("This is card data:", res);
    //     })
    //     .catch((error) => {
    //       setCard([]);
    //       // toast.error("Card not created!!");
    //       console.error(error);
    //     });
  };
  const Showdetails = (obj) => {
    setShowDetail(obj);
    setShow1(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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
  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

  //
  // let [show1, setShow1] = useState(false);
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
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
      {form1 && (
        <div className="overlay1" style={{ transition: "500ms" }}>
          <div className="property_form">
            <Container style={{ height: "auto", boxSizing: "border-box" }}>
              <Card color="outline">
                <CardHeader>
                  <h2 className="form1-heading">Passive Income</h2>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading for Income">
                        <TextField
                          fullWidth
                          type="text"
                          label="Income Heading"
                          id="incomecaption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "incomeCaption")}
                          value={data.income.incomeCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter your Income">
                        <TextField
                          required
                          fullWidth
                          type="text"
                          label="Income"
                          id="payCheck"
                          size="normal"
                          onChange={(e) => {
                            handleChanges(e, "incomeAmount");
                            setIsTextFieldClicked(true);
                          }}
                          value={data.income.incomeAmount}
                          InputProps={{
                            startAdornment: isTextFieldClicked ? (
                              <div>$</div>
                            ) : null,
                          }}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Source">
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

                    <div className="mt-3">
                      <Tooltip title="Add your income related file">
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
                          accept=".pdf"
                          onChange={(e) => handleImageChange(e)}
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
                    <Container className="text-center">
                      <Button
                        onClick={resetData}
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

      {benevisible && (
        // beneShow &&
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
              </div>
              <div className="BeneficiarySelect">
                <div className="BeneficiarySelectContainer">
                  <div className="BeneficiarySelectRow">
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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

export function InternationalAssetOtherAssets() {
  const navigate = useNavigate();
  // set Add data
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
    setEstimatedTotalAmount(100);
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
      otherAssets1: "",
      otherAssets2: "",
      otherAssets3: "",
      otherAssets4: "",
      otherAssets5: "",
      exampleFile: "",
      notes: "",
      benificiary: "",
      addfield1: "",
      addfield2: "",
      addfield3: "",
      addfield4: "",
      addfield5: "",
      assetCaption: "",
    });
  };

  let [cardNo, setCardNo] = useState(0);
  // Set the form
  const OtherAssestForm = (event) => {
    event.preventDefault();
    toggle();
    let token = "Bearer " + getToken();
    setCardNo(token);
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
    formData.append("asset", JSON.stringify(data));
    formData.append("data", JSON.stringify(data1));
    addInternationalAsset(formData, token)
      .then((resp) => {
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    //   otherAsset(formData, token)
    //     .then((resp) => {
    //       // console.log(resp);
    //       // console.log("Success log");
    //       toast.success("Data Added !!", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       // resetData();
    //       getData();
    //       AddCard();
    //     })
    //     .catch((error) => {
    //       // console.log(error);
    //     });
  };

  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    // console.log("user Id=" + userId);
    //   getOtherAsset(token, userId).then((res) => {
    //     // console.log(res);
    //     setCategory(res);
    //   }).catch((error) => {
    //     // Handle error, including error message
    //     console.error('Error:', error);
    //   })
    // console.log(category[0]);
  };

  const handleRemove = (id) => {
    // console.log("remove id is :", Id);
    //   deleteOtherAsset(id)
    //     .then((res) => {
    //       toast.success("Deleted successfully...", {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //       });
    //       // console.log("SuccessFully Deleted " + res);
    //       getData();
    //       AddCard();
    //       setShow1(false);
    //     })
    //     .catch((error) => {
    //       // console.log("Note Deleted " + error);
    //     });
  };

  const handleDownload = (fileName, fileNumber) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token
    // console.log("bank method calling");
    downloadDocument("otherAssets", fileName, fileNumber)
      .then((response) => {
        console.log("files in downlaod", response);
        const downloadUrl = URL.createObjectURL(response.data);
        // console.log(downloadUrl);
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
  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      id: "otherAssets1",
      label: "Assets",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "otherAssets2",
      // label: "other\u00a02",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "otherAssets3",
      // label: "other\u00a03",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "otherAssets4",
      // label: "other\u00a04",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "otherAssets5",
      // label: "other\u00a05",
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
      align: "center",
      style: {
        minWidth: 100,
        fontWeight: "bold",
      },
    },
    {
      id: "action",
      label: "Action",
      align: "center",
      format: "action",
      style: {
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
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

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

  let [form1, setForm1] = useState(true);

  const toggle = () => {
    setForm1(!form1);
    navigate("/user/my-estate/International_assets");
  };

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    //   getOtherAsset(token, userId)
    //     .then((res) => {
    //       setCard(res);
    //       console.log("This is card data:", res);
    //     })
    //     .catch((error) => {
    //       setCard([]);
    //       toast.error("Card not created!!");
    //       console.error(error); // Changed to console.error for better visibility of errors
    //     });
  };

  // showing the details of cards like popup
  const Showdetails = (obj) => {
    // const arrayFromObject = Object.keys(obj).map(key => obj[key]);
    setShowDetail(obj);
    setShow1(true);
  };

  useEffect(() => {
    AddCard();
  }, []);

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
  const [SelectedBeneficiary, setSelectedBeneficiary] = useState("");
  let [showAdditionField1, setshowAdditionField1] = useState(false);

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);

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
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <>
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
                            {Country.getAllCountries().map((v, index) => {
                              return (
                                <MenuItem key={index} value={v.name}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter Heading for other Assets">
                        {/* use text area here  */}
                        <TextField
                          fullWidth
                          type="text"
                          label="Assets Heading"
                          id="assetCaption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "assetCaption")}
                          value={data.otherAsset.assetCaption}
                        />
                      </Tooltip>
                    </div>
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
                        <div style={{ width: "100%", marginRight: "5px" }}>
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
                              label={index === 0 ? "Assets" : "Add More "}
                              id={`otherAssets${index + 1}`}
                              size="normal"
                              onChange={(e) =>
                                handleChanges(e, `otherAssets${index + 1}`)
                              }
                              value={
                                data.otherAsset[`otherAssets${index + 1}`] || ""
                              }
                            />
                          </Tooltip>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        ></div>
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

                    <div className="mt-3">
                      <Tooltip title="Add your income related file">
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
                          onChange={(e) => handleImageChange(e)}
                          multiple
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
                      <Tooltip title="Enter notes for your income">
                        {/* use text area here  */}
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
                        onClick={resetData}
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
                    <div class="share_property_Type">
                      <p class="share_property_Type_paragraph">
                        Choose Distribution Type:{" "}
                      </p>
                      <select
                        value={distributionType}
                        onChange={handleDistributionTypeChange}
                        class="share_property_Type_select"
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
                    {selectedBeneficiaries.map(
                      (beneficiary) => (
                        console.log("this is  beneficiary ", beneficiary),
                        (
                          <div key={beneficiary} class="share_beneficiary_card">
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
                        )
                      )
                    )}
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
