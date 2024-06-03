import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import "../../css/myestare.css";
import {
  downloadDocument1,
  getToken,
  getUser,
  vehicleRemove,
  vehicles,
  vehiclesGet,
  getBeneficiary,
  deleteSingleProperty,
  getSecondaryUser,
} from "../../services/user-service";
import Deletebutton from "./Deletebutton";
import UpdateButton from "./UpdateButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  TextField,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  faXmark,
  faPlus,
  faDownload,
  faLocationDot,
  faEye,
  faCarSide,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../css/formPOPup.css";
import {
  deleteVehicle,
  getVehicle,
  vehicle,
} from "../../services/VehicleService";

function Vehicles() {
  const [data, setData] = useState({
    vehicle: {
      owner: "",
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

  const [ownerName, setOwnerName] = useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Convert ownerName array to a single string
    const comingValue = typeof value === "string" ? value.split(",") : value;
    const ownerString = comingValue.join(", ");

    setData((prevData) => ({
      ...prevData,
      vehicle: {
        ...prevData.vehicle,
        owner: ownerString,
      },
    }));

    // Update the ownerName state afterwards
    setOwnerName(comingValue);
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
  const resetForm = () => {
    setIsTextFieldClicked(false);
    setData({
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
      toast.error("Please fill all required feilds.");
      return;
    }

    let token = "Bearer " + getToken();

    //create form data to send a file and remaining class data
    const formData = new FormData();

    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
    }
    formData.append("data", JSON.stringify(data));

    vehicle(formData, token)
      .then((resp) => {
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();
        getData();
        AddCard();

        // window.location.reload();
      })
      .catch((error) => {});
  };
  //get form

  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;

    let token = "Bearer " + getToken();
    getVehicle(token, userId)
      .then((res) => {
        setCategory(res);
      })
      .catch((error) => {});
  };
  // Code by Purnendu
  const handleRemove = (Id, idType) => {
    if (idType == "vehicleId") {
      deleteVehicle(Id)
        .then((res) => {
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          getData();
          AddCard();
          setShow1(false);
        })
        .catch((error) => {});
    } else {
      deleteSingleProperty(Id)
        .then((res) => {
          setBeneficiaryVisible(!beneficiaryVisible);
          setShow1(false);
          AddCard();
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        })
        .catch((error) => {});
    }
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

  //  form show button
  let [form1, setForm1] = useState(false);

  const toggle = () => {
    resetForm();
    setForm1(!form1);
  };

  // cards
  let [card, setCard] = useState([]); // card = [ {} , {} , {}] - include the form data going to use it for card
  let [showDetail, setShowDetail] = useState([]); // this is to display the card details
  let [show1, setShow1] = useState(false);

  // card creating
  const AddCard = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    getVehicle(token, userId)
      .then((res) => {
        setCard(res);
      })
      .catch((error) => {
        setCard([]);
      });
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
    setEstimatedTotalAmount(data.vehicle.estValue);
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

  const handleOpenBeneficiary = (showDetail) => {
    setSelectedBeneficiary(showDetail);
    setBeneficiaryVisible(true);
  };

  return (
    <div className={`your-component ${show ? "fade-in-element" : ""}`}>
      <UserBase>
        <div className="mt-5"></div>
        <SideBar>
          <div className="addme">
            <div className="addme_inner">
              <button onClick={() => toggle()}>Add New Vehicles</button>
            </div>
          </div>

          <div className="propCard">
            <div className="propCard-card">
              {card.map((entity) => (
                <div className="propCard-card-body" key={entity.vehicle.id}>
                  <h5 className="propCard-card-title">
                    {entity.vehicle.vehicleCaption}
                  </h5>
                  <p className="propCard-card-text"> {entity.vehicle.model}</p>
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
                          <Tooltip title="Select Owner">
                            <FormControl
                              required
                              fullWidth
                              sx={{ minWidth: 120 }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-label">
                                Select Owner
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="ownerName"
                                label="Select Owner"
                                multiple
                                value={ownerName}
                                onChange={handleChange}
                              >
                                {ownerNames.map((name) => (
                                  <MenuItem key={name} value={name}>
                                    {name}
                                  </MenuItem>
                                ))}
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
                              onChange={(e) =>
                                handleChanges(e, "vehicleCaption")
                              }
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
                                onChange={(e) =>
                                  handleChanges(e, "vehicleType")
                                }
                                value={data.vehicle.vehicleType}
                              >
                                <MenuItem value={"Sedan"}>Sedan</MenuItem>
                                <MenuItem value={"Coupe"}>Coupe</MenuItem>
                                <MenuItem value={"Convertible"}>
                                  Convertible
                                </MenuItem>
                                <MenuItem value={"Hatchback"}>
                                  Hatchback
                                </MenuItem>
                                <MenuItem value={"SUV"}>SUV</MenuItem>
                                <MenuItem value={"Crossover"}>
                                  Crossover
                                </MenuItem>
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
                                onChange={(date) =>
                                  handleDateChanges(date, "year")
                                }
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
                                // placeholder="$"
                                fullWidth
                                type="number"
                                label="Loan"
                                id="loan"
                                size="normal"
                                onChange={(e) => handleChanges(e, "loan")}
                                value={data.vehicle.loan}
                                onClick={() => {
                                  setIsTextFieldClicked(true);
                                }}
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
                              // placeholder="$"
                              fullWidth
                              type="number"
                              label="Estimated valuation"
                              id="evalue"
                              size="normal"
                              onChange={(e) => {
                                handleChanges(e, "estValue");
                              }}
                              value={data.vehicle.estValue}
                              onClick={() => {
                                setIsTextFieldClicked(true);
                              }}
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
                              <div>
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
                              </div>
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
                            onClick={resetForm}
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
                          icon={faCarSide}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>{showDetail.vehicle.vehicleType}</span>
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
                                URL={"../my-estate/vehicles/"}
                                id={showDetail.vehicle.id}
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={showDetail.vehicle.id}
                            idType="vehicleId"
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
                        {showDetail.vehicle.owner && (
                          <p>
                            Owner : <code>{showDetail.vehicle.owner}</code>
                          </p>
                        )}
                        <p>
                          Vehicle Type:{" "}
                          <code>{showDetail.vehicle.vehicleType}</code>
                        </p>
                        <p>
                          Year Manufactured:{" "}
                          <code>{showDetail.vehicle.year}</code>
                        </p>
                        <p>
                          Loan:{" "}
                          <code style={{ color: "red", fontWeight: "bold" }}>
                            $ {showDetail.vehicle.loan}
                          </code>
                        </p>
                        <p>
                          Make: <code>{showDetail.vehicle.make}</code>
                        </p>
                        <p>
                          Miles: <code>{showDetail.vehicle.miles}</code>
                        </p>
                      </div>
                      <div className="col2">
                        <p>
                          Model: <code>{showDetail.vehicle.model}</code>
                        </p>
                        <p>
                          Estimated Value :{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            $ {showDetail.vehicle.estValue}
                          </code>
                        </p>

                        {showDetail.benificiary && (
                          <p>
                            Beneficiary Name:{" "}
                            <code>{showDetail.benificiary}</code>
                          </p>
                        )}

                        <p>
                          Vehicle Caption:{" "}
                          <code>{showDetail.vehicle.vehicleCaption}</code>
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

                        {showDetail.addfield1 && (
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

                        {showDetail.vehicle.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(showDetail.vehicle.notes);
                                setShow1(!show1);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {" "}
                                {showDetail && showDetail.vehicle.notes
                                  ? showDetail.vehicle.notes.slice(0, 5)
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
              <Paper
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  border: "1px solid #cbcbcb",
                  padding: "0px 10px",
                }}
              >
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
                              tabIndex={-1}
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
                                          URL={"../my-estate/vehicles/"}
                                          id={row.vehicle_Id}
                                        />
                                        <Deletebutton
                                          handleRemove={handleRemove}
                                          Id={row.vehicle_Id}
                                        />
                                      </div>
                                    ) : column.format === "shortText" ? (
                                      // Display limited text with popup
                                      <Tooltip title="click here to read more ">
                                        <div
                                          style={{
                                            cursor: "pointer",
                                            color: value ? "black" : "red",
                                          }}
                                          onClick={() => {
                                            if (value) {
                                              handleOpenPopup(value);
                                            }
                                          }}
                                        >
                                          {value
                                            ? value.slice(0, 10) +
                                              (value.length > 10 ? "..." : "")
                                            : "Incomplete"}
                                        </div>
                                      </Tooltip>
                                    ) : column.id === "evalue" ? (
                                      value !== "" ? (
                                        `$ ${value}`
                                      ) : (
                                        <span style={{ color: "red" }}>
                                          Incomplete
                                        </span>
                                      )
                                    ) : column.id === "loan" ? (
                                      value !== "" ? (
                                        `$ ${value}`
                                      ) : (
                                        <span style={{ color: "red" }}>
                                          Incomplete
                                        </span>
                                      )
                                    ) : (
                                      value || (
                                        <span style={{ color: "red" }}>
                                          Incomplete
                                        </span>
                                      )
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
        </SideBar>
      </UserBase>
    </div>
  );
}

export default Vehicles;
