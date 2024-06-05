import { faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import {
  deleteJewelry,
  getJewelries,
  jewelries,
} from "../../services/JewelryService";
import {
  deleteSingleProperty,
  downloadDocument1,
  getBeneficiary,
  getSecondaryUser,
  getToken,
  getUser,
} from "../../services/user-service";
import Deletebutton from "./Deletebutton";
import UpdateButton from "./UpdateButton";

// import Tooltip from '@mui/material/Tooltip';

function Jewelry() {
  const [data, setData] = useState({
    jewelry: {
      owner: "",
      jewelryCaption: "",
      jewelryName: "",
      otherJewelryName: "",
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
      jewelry: {
        ...prevData.jewelry,
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
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedImage1, setSelectedImage1] = useState([]);

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

  const handleImageChange1 = (event) => {
    const selectedFiles = event.target.files;
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

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
          formData.append(`imageFiles${index + 1}`, file);
        });

        // Set the selected image state with the array of files
        setSelectedImage1(selectedFilesArray);
      } else {
        // Handle invalid file extensions
        const invalidExtensions = invalidFiles
          .map((file) => file.name.split(".").pop())
          .join(", ");
        toast.error(
          `Invalid file extensions: ${invalidExtensions}. Please select valid image formats.`,
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
      jewelry: {
        owner: "",
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
  };

  // Set the form
  const jewelryForm = (event) => {
    event.preventDefault();
    toggle();

    let token = "Bearer " + getToken();

    if (
      data.details === "" ||
      data.estimatedValue === "" ||
      data.keratValue === ""
    ) {
      toast.error("Please Fill All required field Then Submit .", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    //create form data to send a file and remaining class data
    const formData = new FormData();

    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
    }

    for (let i = 0; i < selectedImage1.length; i++) {
      formData.append(`imageFiles`, selectedImage1[i]);
    }

    formData.append("data", JSON.stringify(data));

    // return null;
    jewelries(formData, token)
      .then((resp) => {
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetData();

        AddCard();

        // window.location.reload();
      })
      .catch((error) => {});
  };

  // Code by Purnendu
  const handleRemove = (id, idType) => {
    if (idType === "jewelryId") {
      deleteJewelry(id)
        .then((res) => {
          toast.success("Deleted successfully...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          AddCard();
          setShow1(false);
        })
        .catch((error) => {});
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
        .catch((error) => {});
    }
  };

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

  // const [metalPrice, setMetalPrice] = useState(0);

  // useEffect(() => {
  //   // Fetch metal price from the API and store it in the state

  //   const fetchMetalPrice = () => {
  //     if (data.jewelry.jewelryName === "") {
  //       setMetalPrice(0);
  //       if (data.jewelry.caratValue === "") {
  //         setMetalPrice(0);
  //         return;
  //       }
  //       return;
  //     }
  //     // if (data.keratValue === "") {
  //     //   setMetalPrice(0);
  //     //   return;
  //     // }

  //     const headers = {
  //       "x-access-token": "goldapi-sw18arlkmh58d1-io",
  //       "Content-Type": "application/json",
  //     };
  //     const metalAPIEndpoint = `https://www.goldapi.io/api/${data.jewelry.jewelryName}/USD`;
  //     axios
  //       .get(metalAPIEndpoint, { headers: headers })
  //       .then((res) => {
  //         setMetalPrice(res.data[data.jewelry.caratValue]); // Assuming the API response contains the price for 24K gold per gram
  //       })
  //       .catch((error) => {});
  //   };
  // }, []);

  // ... (remaining existing functions)

  // useEffect(
  //   () => {
  //     const calculateEstimatedValue = () => {
  //       if (data.jewelry.jewelryName && data.jewelry.weight && metalPrice) {
  //         // Assuming the selected metal unit is 24K and using the metal price for 24K gold to calculate the estimated value
  //         const estimatedValue = data.jewelry.weight * metalPrice;

  //         setData((prevData) => ({
  //           ...prevData,
  //           jewelry: {
  //             ...prevData.jewelry,
  //             estimatedValue: estimatedValue.toFixed(3),
  //           },
  //         }));

  //         // setData((prevData) => ({
  //         //   ...prevData,
  //         //   estimatedValue: estimatedValue.toFixed(3),
  //         // }));
  //       } else {
  //         setData((prevData) => ({
  //           ...prevData,
  //           jewelry: {
  //             ...prevData.jewelry,
  //             estimatedValue: "",
  //           },
  //         }));
  //       }
  //     };

  //     // calculateEstimatedValue();
  //   },
  //   // [data.jewelry.jewelryName, data.jewelry.weight, metalPrice]
  //   []
  // );

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

  // show notes popup
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisibleImages, setPopupVisibleImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState("");

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

  const handleShowImages = (showDetail) => {
    setPopupVisibleImages(true);
    setSelectedImages(showDetail);
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
    let userId = getUser().commonId;
    let token = "Bearer " + getToken(); // Added 'Bearer'
    getJewelries(token, userId)
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
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setEstimatedTotalAmount(data.jewelry.estimatedValue);
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

  const uniqueJewelryTypes = [
    ...new Set(
      card
        .map((entity) => entity.jewelry.jewelryName)
        .filter((jewelryName) => jewelryName !== "Other")
    ),
  ];
  const uniqueOtherJewelryTypes = [
    ...new Set(
      card
        .map((entity) => entity.jewelry.otherJewelryName)
        .filter(
          (otherJewelryName) =>
            otherJewelryName !== null && otherJewelryName !== ""
        )
    ),
  ];

  const base64ToBlob = (base64Data) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "image/jpeg" }); // Adjust type if needed
  };

  return (
    <div className={`your-component ${show ? "fade-in-element" : ""}`}>
      <UserBase>
        <div className="mt-5"></div>
        <SideBar>
          <div className="addme">
            <div className="addme_inner">
              <button onClick={() => toggle()}>Add New Jewelry</button>
            </div>
          </div>

          {/* <div className="propCard">
            <div class="propCard-card">
              {card.map((entity) => (
                <div className="propCard-card-body" key={entity.id}>
                  <h5 className="propCard-card-title">
                    {entity.jewelry.jewelryCaption}
                  </h5>
                  <p className="propCard-card-text">
                    {" "}
                    {getDisplayName(entity.jewelry.jewelryName)}
                  </p>
                  <div className="propCard-btn">
                    <p className=" viewDetails">
                      <button onClick={() => Showdetails(entity)}>
                        View Details
                      </button>
                    </p>
                  </div>
                 <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
              ))}
            </div>
          </div> */}

          <div
            className="propCard"
            style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}
          >
            {uniqueJewelryTypes.map((jewelryType, index) => (
              <div key={index} className="propCard-card">
                {card.filter(
                  (entity) => entity.jewelry.jewelryName === jewelryType
                ).length > 0 && (
                  <div
                    className="propCard-card-body"
                    style={{ padding: "20px 20px 10px 20px" }}
                  >
                    <h5 className="propCard-card-title">
                      {getDisplayName(jewelryType)}
                    </h5>
                    <div className="propCard-btn">
                      <p className="viewDetails">
                        <button
                          onClick={() =>
                            Showdetails(
                              card.filter(
                                (entity) =>
                                  entity.jewelry.jewelryName === jewelryType
                              )
                            )
                          }
                        >
                          View Details
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {uniqueOtherJewelryTypes.map((jewelryType, index) => (
              <div key={index} className="propCard-card">
                {card.filter(
                  (entity) => entity.jewelry.otherJewelryName === jewelryType
                ).length > 0 && (
                  <div
                    className="propCard-card-body"
                    style={{ padding: "20px 20px 10px 20px" }}
                  >
                    <h5 className="propCard-card-title">{jewelryType}</h5>
                    <div className="propCard-btn">
                      <p className="viewDetails">
                        <button
                          onClick={() =>
                            Showdetails(
                              card.filter(
                                (entity) =>
                                  entity.jewelry.otherJewelryName ===
                                  jewelryType
                              )
                            )
                          }
                        >
                          View Details
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {form1 && (
            <div
              className="overlay1"
              style={{ transition: "500ms", height: "" }}
            >
              <div className="property_form">
                <Container>
                  <Card outline>
                    <CardHeader>
                      <h3 className="form1-heading">Jewelry</h3>
                      <div className="Close" onClick={toggle}>
                        <FontAwesomeIcon icon={faXmark} />
                      </div>
                    </CardHeader>
                    {/* {JSON.stringify(data)} */}
                    <CardBody>
                      <Form onSubmit={jewelryForm}>
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
                                onChange={(e) =>
                                  handleChanges(e, "jewelryName")
                                }
                                value={data.jewelry.jewelryName}
                              >
                                <MenuItem value={"XAU"}>Gold</MenuItem>
                                <MenuItem value={"XAG"}>Silver</MenuItem>
                                <MenuItem value={"XPT"}>Platinum</MenuItem>
                                <MenuItem value={"XPD"}>Palladium</MenuItem>
                                <MenuItem value={"Stone"}>Stone</MenuItem>
                                <MenuItem value={"Other"}>Other</MenuItem>
                              </Select>
                              {data.jewelry.jewelryName === "Other" && (
                                <TextField
                                  label="Other Jewelry Name"
                                  value={data.jewelry.otherJewelryName}
                                  onChange={(e) =>
                                    handleChanges(e, "otherJewelryName")
                                  }
                                  fullWidth
                                  size="normal"
                                  margin="normal"
                                />
                              )}
                            </FormControl>
                          </Tooltip>
                        </div>

                        <div className="mt-3">
                          <Tooltip title="Enter Heading for Jewelry">
                            <TextField
                              required
                              type="text"
                              label="Jewelry name"
                              id="JewelryCaption"
                              size="normal"
                              style={{
                                borderLeft: "none",
                                width: "100%",
                                borderRadius: "5px",
                              }}
                              onChange={(e) =>
                                handleChanges(e, "jewelryCaption")
                              }
                              value={data.jewelry.jewelryCaption}
                            />
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
                                <MenuItem value={"price_gram_24k"}>
                                  24K
                                </MenuItem>
                                <MenuItem value={"price_gram_22k"}>
                                  22K
                                </MenuItem>
                                <MenuItem value={"price_gram_21k"}>
                                  21K
                                </MenuItem>
                                <MenuItem value={"price_gram_20k"}>
                                  20K
                                </MenuItem>
                                <MenuItem value={"price_gram_18k"}>
                                  18K
                                </MenuItem>
                                <MenuItem value={"price_gram_16k"}>
                                  16K
                                </MenuItem>
                                <MenuItem value={"price_gram_14k"}>
                                  14K
                                </MenuItem>
                                <MenuItem value={"price_gram_10k"}>
                                  10K
                                </MenuItem>
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
                                // placeholder="$"
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
                                }}
                                value={data.jewelry.estimatedValue}
                                onClick={() => {
                                  setIsTextFieldClicked(true);
                                }}
                                InputProps={{
                                  // readOnly: true,
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

                        <div className="mt-3">
                          <Tooltip title="Add your jewelry related images">
                            <div>
                              <label
                                style={{
                                  display: "block",
                                  marginBottom: "5px",
                                }}
                              >
                                Jewelry Images<span></span>
                              </label>
                              <input
                                style={{
                                  border: "solid 1px lightgray",
                                  borderLeft: "none",
                                  width: "100%",
                                  borderRadius: "5px",
                                }}
                                type="file"
                                name="images"
                                id="imageFiles"
                                onChange={(e) => handleImageChange1(e)}
                                multiple
                                accept="image/*"
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
                              value={data.jewelry.notes}
                            />
                          </Tooltip>
                        </div>

                        <Container className="text-center">
                          <Button
                            onClick={resetForm}
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

          {show1 && (
            <>
              <div className="popup">
                <div className="popup-content popup-content-download">
                  <div className="note_popup">
                    <div className="note_popup_heading">
                      <div style={{ textAlign: "center", width: "100%" }}>
                        <h2>Jewelry Details</h2>
                      </div>
                      <div>
                        <button
                          className="note_popup_heading_close_btn"
                          onClick={() => {
                            // setJewelryVisible(false);
                            setShow1(false);
                          }}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    </div>
                    <div>
                      {showDetail.map((details, index) => (
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
                            {/* Left side */}
                            <div>
                              <p
                                style={{
                                  fontSize: "17px",
                                  color: "black",
                                  fontWeight: "500",
                                }}
                              >
                                {getDisplayName(details.jewelry.jewelryName) ===
                                "Other" ? (
                                  <>
                                    {details.jewelry.otherJewelryName} -{" "}
                                    {index + 1}
                                  </>
                                ) : (
                                  <>
                                    {getDisplayName(
                                      details.jewelry.jewelryName
                                    )}{" "}
                                    - {index + 1}
                                  </>
                                )}
                              </p>
                            </div>
                            {/* Right side */}
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div className="me-2">
                                {details.documents &&
                                  details.documents.length > 0 && (
                                    <Tooltip title="click to see multiple download files">
                                      <div
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          handleShowDownlaod(details);
                                          setShow1(false);
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
                              {primaryUserDetails.accountType ===
                              "secondary" ? (
                                ""
                              ) : (
                                <div className="me-2">
                                  <Tooltip title="Click Here To Edit">
                                    <div>
                                      <UpdateButton
                                        URL={"../my-estate/jewelry/"}
                                        id={details.jewelry.id}
                                      />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                              {primaryUserDetails.accountType ===
                              "secondary" ? (
                                ""
                              ) : (
                                <Deletebutton
                                  handleRemove={handleRemove}
                                  Id={details.jewelry.id}
                                  idType="jewelryId"
                                />
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexWrap: "wrap", // Allow wrapping to next line if needed
                            }}
                            className="mt-2"
                          >
                            {/* Left section */}
                            <div style={{ flex: "1", minWidth: "250px" }}>
                              {details.jewelry.owner && (
                                <p
                                  style={{ color: "black", fontWeight: "500" }}
                                >
                                  Owner : <span>{details.jewelry.owner}</span>
                                </p>
                              )}
                              <p style={{ color: "black", fontWeight: "500" }}>
                                Jewelry :{" "}
                                <span>
                                  {getDisplayName(
                                    details.jewelry.jewelryName
                                  ) === "Other"
                                    ? details.jewelry.otherJewelryName
                                    : getDisplayName(
                                        details.jewelry.jewelryName
                                      )}
                                </span>
                              </p>

                              <p style={{ color: "black", fontWeight: "500" }}>
                                Jewelry Name:{" "}
                                <span>{details.jewelry.jewelryCaption}</span>
                              </p>

                              <p style={{ color: "black", fontWeight: "500" }}>
                                Carat Value:{" "}
                                <span>
                                  {getDisplayKeratValue(
                                    details.jewelry.caratValue
                                  )}
                                </span>
                              </p>

                              {details.sharedDetails[0] && (
                                <p
                                  style={{ color: "black", fontWeight: "500" }}
                                  onClick={() => {
                                    handleOpenBeneficiary(details);
                                    setShow1(false);
                                  }}
                                >
                                  Beneficiary Details{" "}
                                  <span>
                                    <span className="readmore">Click Here</span>
                                  </span>
                                </p>
                              )}

                              {details.supportingImages &&
                                details.supportingImages.length > 0 && (
                                  <Tooltip title="click to see images">
                                    <p
                                      style={{
                                        color: "black",
                                        fontWeight: "500",
                                      }}
                                      onClick={() => {
                                        handleShowImages(details);
                                        setShow1(false);
                                      }}
                                    >
                                      Jewelry Images{" "}
                                      <span>
                                        <span className="readmore">
                                          Click Here
                                        </span>
                                      </span>
                                    </p>
                                  </Tooltip>
                                )}
                            </div>

                            {/* Right section */}
                            <div style={{ flex: "0.5", minWidth: "250px" }}>
                              <p style={{ color: "black", fontWeight: "500" }}>
                                Appraised Value:{" "}
                                <code
                                  style={{ color: "green", fontWeight: "bold" }}
                                >
                                  ${details.jewelry.estimatedValue}
                                </code>
                              </p>

                              <p style={{ color: "black", fontWeight: "500" }}>
                                Weight(gm):{" "}
                                <span>{details.jewelry.weight}</span>
                              </p>

                              {details.jewelry.notes && (
                                <Tooltip title="Click To see Note">
                                  <p
                                    style={{
                                      color: "black",
                                      fontWeight: "500",
                                    }}
                                    onClick={() => {
                                      handleOpenPopup(details.jewelry.notes);
                                      setShow1(!show1);
                                    }}
                                  >
                                    Note:{" "}
                                    <span>
                                      {" "}
                                      {details && details.jewelry.notes
                                        ? details.jewelry.notes.slice(0, 5)
                                        : ""}
                                      ...
                                      <span className="readmore">
                                        Read More
                                      </span>
                                    </span>
                                  </p>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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

          {popupVisibleImages && (
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <h2>Jewelry Images</h2>
                    </div>
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={() => {
                          setPopupVisibleImages(false);
                          setShow1(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {selectedImages.supportingImages &&
                      selectedImages.supportingImages.length > 0 &&
                      selectedImages.supportingImages.map((image, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "20px",
                            width: "30%",
                            padding: "0 10px",
                          }}
                        >
                          <Tooltip title={image.fileName}>
                            <div style={{ cursor: "pointer" }}>
                              <img
                                key={index}
                                src={URL.createObjectURL(
                                  base64ToBlob(image.file)
                                )}
                                alt={`jewelryImage ${index + 1}`}
                                className="image-item"
                                style={{ width: "100%", height: "auto" }} // Adjust width and height as needed
                              />
                            </div>
                          </Tooltip>
                        </div>
                      ))}
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
                    {selectedBeneficiary.sharedDetails &&
                      selectedBeneficiary.sharedDetails.map(
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

export default Jewelry;
