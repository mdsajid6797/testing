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
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import {
  getToken,
  getVehicle,
  updateVehicle,
  getUser,
  getBeneficiary,
} from "../../../services/user-service";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  TextField,
  InputLabel,
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../css/formPOPup.css";
import "../../../css/myestate_edit.css";
import {
  getSingleVehicle,
  updateVehicles,
} from "../../../services/VehicleService";
function EditVehical() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        console.log("this is file indexs", selectedImage[i]);
      }
    }
    formData.append("data", JSON.stringify(data));
    console.log("formData : ", JSON.stringify(data));

    updateVehicles(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/vehicles");
      })
      .catch((error) => {
        console.log(error);
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
        const res = await getSingleVehicle(token, id);
        console.log("this is vehicle responce ", res);
        setData({
          ...data,
          vehicle: res.vehicle,
          documents: res.documents,
          sharedDetails: res.sharedDetails,
        });
        const copiedSharedDetails = [...res.sharedDetails];
        console.log("copiedSharedDetails response : ", copiedSharedDetails);
        setEstimatedTotalAmount(res.vehicle.estValue);

        console.log("check ", sharedDetails[0].distributedType);

        console.log("sharedDetails response : ", res.sharedDetails);
        console.log("sharedDetails response : ", sharedDetails);
        if (copiedSharedDetails.length > 0) {
          console.log(res.sharedDetails.length);
          setSharedDetails(res.sharedDetails);
          console.log("check ", sharedDetails[0].distributedType);
          ben(copiedSharedDetails[0].distributedType);
          for (var i = 0; i < copiedSharedDetails.length; i++) {
            handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
            handleFieldChange1(
              copiedSharedDetails[i].beneficiaryId,
              copiedSharedDetails[i].distributedType,
              copiedSharedDetails[i].distributedValue
            );
            // console.log("sajid " + sharedDetails[0])
          }

          console.log(
            "sharedDetails beneficiaryDetails : ",
            beneficiaryDetails
          );
          console.log(
            "sharedDetails selectedBeneficiaries : ",
            selectedBeneficiaries
          );
          console.log("sharedDetails distributedType : ", distributedType);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getData = () => {
    let token = "Bearer " + getToken();
    getSingleVehicle(token, id).then((res) => {
      console.log("this is realEstate responce ", res);
      setData({
        ...data,
        vehicle: res.vehicle,
        documents: res.documents,
        sharedDetails: res.sharedDetails,
      });
      setEstimatedTotalAmount(res.vehicle.estValue);
    });
  };
  // Set the form
  // const vehiclesForm = (event) => {
  //   event.preventDefault();

  //   toggle();
  //   // if (error.isError) {
  //   //   toast.error("Form data is invalid.");
  //   //   return;
  //   // }
  //   if (
  //     data.vehicle.vehicleType === "" ||
  //     data.vehicle.year === "" ||
  //     data.vehicle.loan === "" ||
  //     data.vehicle.make === "" ||
  //     data.vehicle.miles === "" ||
  //     data.vehicle.model === "" ||
  //     data.vehicle.estValue === ""
  //   ) {
  //     // console.log("Data : " + JSON.stringify(data));
  //     // console.log("Error log");
  //     toast.error("Please fill all required feilds.");
  //     return;
  //   }

  //   let token = "Bearer " + getToken();

  //   // console.log("Token : " + token);

  //   //create form data to send a file and remaining class data
  //   const formData = new FormData();

  //   for (let i = 0; i < selectedImage.length; i++) {
  //     formData.append(`files`, selectedImage[i]);
  //     console.log("this is file indexs", selectedImage[i]);
  //   }
  //   formData.append("data", JSON.stringify(data));

  //   updateVehicle(formData, token)
  //     .then((resp) => {
  //       // console.log(resp);
  //       // console.log("Success log");
  //       toast.success("Data Added !!", {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //       // resetData();
  //       getData();
  //       AddCard();

  //       // window.location.reload();
  //     })
  //     .catch((error) => {
  //       // console.log(error);
  //       // console.log("Error log");
  //       // // handle error
  //       // setError({
  //       //   errors: error,
  //       //   isError: true
  //       // })
  //     });
  // };
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
  // const handleDateChanges = (date, property) => {
  //   const adjustedDate = dayjs(date).format("YYYY-MM-DD");
  //   console.log("date : ", adjustedDate);
  //   setData({ ...data, [property]: adjustedDate });
  //   console.log("date handleDateChanges : ", data);
  //   setIsYearSelected(true);
  // };

  // const getData = () => {
  //   let token = "Bearer " + getToken();
  //   getVehicle(token, vehicle_Id)
  //     .then((res) => {
  //       setData({
  //         ...data,
  //         vehicleType: res.vehicleType,
  //         year: res.year,
  //         loan: res.loan,
  //         make: res.make,
  //         miels: res.miels,
  //         model: res.model,
  //         estValue: res.estValue,
  //         notes: res.notes,
  //         benificiary: res.benificiary,
  //         vehicleCaption: res.vehicleCaption
  //       });
  //       setVehicleName(res.vehicleType);
  //       setMakeName(res.make);
  //       setModelName(res.model);

  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       console.log("Data not loaded");
  //     });
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

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
    console.log("handleDistributionTypeChange working : ", event.target.value);
    console.log("handleDistributionTypeChange sharedDetails", sharedDetails);
    var distributedType = event.target.value;
    const sharedDetails1 = sharedDetails.map((detail) => {
      // Change the distributedType value as needed
      detail.distributedType = distributedType;
      return detail;
    });
    console.log("handleDistributionType changed sharedDetails", sharedDetails);
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
    console.log("handleBeneficiarySelection working : ", selectedBeneficiary);
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
        console.log(
          "Updated selected beneficiaries:",
          newSelectedBeneficiaries
        );
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
      console.log("Updated beneficiary details:", newBeneficiaryDetails);
      return newBeneficiaryDetails;
    });

    // setSelectedBeneficiaries((prevSelectedBeneficiaries) => {
    //   if (!prevSelectedBeneficiaries.includes(selectedBeneficiary)) {
    //     console.log("handleBeneficiarySelection 1 : ", selectedBeneficiary);
    //     setBeneficiaryDetails({
    //       ...beneficiaryDetails,
    //       [selectedBeneficiary]: { percentage: "", dollar: "" },
    //     });
    //     return [...prevSelectedBeneficiaries, selectedBeneficiary];
    //   }
    //   return prevSelectedBeneficiaries;
    // });

    console.log("handleBeneficiarySelection 2 : ", selectedBeneficiaries);
    console.log("check beneficiaryDetails 2 : ", beneficiaryDetails);
  };

  const handleBeneficiarySelection = (event) => {
    const selectedBeneficiary = event.target.value;
    console.log("handleBeneficiarySelection working : ", selectedBeneficiary);
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
    // console.log('getBenificiaryName id : ', id);
    var foundBenificiary = null;
    if (id.beneficiary === undefined) {
      // console.log('IF condition');
      foundBenificiary = beneficiary.find((b) => b.id === parseInt(id));
    } else {
      foundBenificiary = beneficiary.find(
        (b) => b.id === parseInt(id.beneficiary)
      );
    }
    // console.log('foundBenificiary details : ', foundBenificiary);
    if (foundBenificiary) {
      return `${foundBenificiary.firstName} ${foundBenificiary.lastName}`;
    } else {
      return "Benificiary not found";
    }
  };

  const handleFieldChange1 = (beneficiary, field, value) => {
    console.log("handleFieldChange1   : ", beneficiaryDetails);

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
      console.log("handleFieldChange1  2 : ", updatedDetails);

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
      // setSharedDetails(updatedDetails);
      // sharedDetails[index].distributedValue = updatedDetails.value;
      console.log("updatedDetails : ", updatedDetails);
    }
  };

  const calculateDistributedAmount = (
    distributedType,
    balance,
    beneficiaryDetail
  ) => {
    console.log("calculateDistributedAmount : ", beneficiaryDetail);
    console.log("calculateDistributedAmount balance : ", balance);
    // Assuming beneficiaryDetail is an object with a property 'value'
    if (distributedType === "percentage") {
      const calculatedAmount =
        (parseFloat(balance) * parseFloat(beneficiaryDetail.percentage)) / 100;
      console.log("calculateDistributedAmount return: ", calculatedAmount);
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
    console.log("beneficiaryDetails data: ", data);
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
    console.log("updatedSharedDetails[i] : ", updatedSharedDetails[i]);
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
    <UserBase>
      <div className="mt-5"></div>
      <SideBar>
        <div className="overlay1-edit">
          <div
            className="propertyform"
            style={{
              display: "flex",
              justifyContent: "left",
              paddingTop: "20px",
            }}
          >
            <Container className="edit_container">
              <Card color="" outline>
                {/* {JSON.stringify(data)} */}

                <CardHeader>
                  <h3 className="form1-heading">Edit Vehicles</h3>
                  <div
                    className="Close"
                    onClick={() => {
                      {
                        navigate("/user/my-estate/vehicles");
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={vehiclesForm}>
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
                              sharedDetails[0].distributedType !== ""
                                ? true
                                : false
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
                                Beneficiary:{" "}
                                {getBenificiaryName({ beneficiary })}
                              </p>
                              {distributedType === "percentage" && (
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
                              {distributedType === "dollar" && (
                                <input
                                  type="text"
                                  className="share_ben_percentage"
                                  placeholder="Dollar Value"
                                  value={
                                    beneficiaryDetails[beneficiary]?.dollar ||
                                    ""
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
      </SideBar>
      {/* <div>
        <Footer />
      </div> */}
    </UserBase>
  );
}

export default EditVehical;
