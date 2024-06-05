import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
} from "reactstrap";
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import {
  getBeneficiary,
  getToken,
  getUser,
} from "../../../services/user-service";
//import { useState } from 'react'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../css/formPOPup.css";
import "../../../css/myestate_edit.css";
import {
  getSinglejewelry,
  updateJewelries,
} from "../../../services/JewelryService";

function EditJewelry() {
  const { id } = useParams();
  const navigate = useNavigate();
  // }
  const [data, setData] = useState({
    jewelry: {
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
  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedImage1, setSelectedImage1] = useState([]);

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

  // const handleChanges = (event, property) => {
  //   setData({ ...data, [property]: event.target.value });
  // };

  useEffect(() => {
    if (data.jewelry.jewelryName !== "Other") {
      setData((prevData) => ({
        ...prevData,
        jewelry: {
          ...prevData.jewelry,
          otherJewelryName: "",
        },
      }));
    }
  }, [data.jewelry.jewelryName]);

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
        console.log("this is file indexs", selectedImage[i]);
      }
    }

    for (let i = 0; i < selectedImage1.length; i++) {
      formData.append(`imageFiles`, selectedImage1[i]);
      console.log("this is imageFiles indexs", selectedImage1[i]);
    }

    formData.append("data", JSON.stringify(data));
    console.log("formData : ", JSON.stringify(data));

    updateJewelries(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/jewelry");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  // Set the form
  // const jewelryForm = (event) => {
  //   event.preventDefault();
  //   let token = "Bearer " + getToken();

  //   console.log("Token : " + token);
  //   if (
  //     data.details === "" ||
  //     data.estimatedValue === "" ||
  //     data.weight === "" ||
  //     data.keratValue === ""
  //   ) {
  //     console.log("Error log");
  //     toast.error("Please Fill All required field Then Submit .", {
  //       position: toast.POSITION.BOTTOM_CENTER,
  //     });
  //     return;
  //   }

  //   //create form data to send a file and remaining class data
  //   const formData = new FormData();
  //   for (let i = 0; i < selectedImage.length; i++) {
  //     formData.append(`filename`, selectedImage[i]);
  //     console.log("this is file indexs", selectedImage[i])
  //   }
  //   formData.append("data", JSON.stringify(data));

  //   updateJewelry(formData, token, jewelryId)
  //     .then((resp) => {
  //       console.log(resp);
  //       console.log("Success log");
  //       toast.success("Updated Successfully !!", {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //       navigate("/user/my-estate/jewelry");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);
  // const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let token = "Bearer " + getToken();
  //       const res = await getSinglejewelry(token, id);
  //       console.log("this is jewelry responce ", res);
  //       setData({
  //         ...data,
  //         jewelry: res.jewelry,
  //         documents: res.documents,
  //         sharedDetails: res.sharedDetails,
  //       });
  //       const copiedSharedDetails = [...res.sharedDetails];
  //       console.log("copiedSharedDetails response : ", copiedSharedDetails);
  //       setEstimatedTotalAmount(res.jewelry.estimatedValue);

  //       console.log("check ", sharedDetails[0].distributedType);

  //       console.log("sharedDetails response : ", res.sharedDetails);
  //       console.log("sharedDetails response : ", sharedDetails);
  //       if (copiedSharedDetails.length > 0) {
  //         console.log(res.sharedDetails.length);
  //         setSharedDetails(res.sharedDetails);
  //         console.log("check ", sharedDetails[0].distributedType);
  //         ben(copiedSharedDetails[0].distributedType);
  //         for (var i = 0; i < copiedSharedDetails.length; i++) {
  //           handleBeneficiarySelection1(copiedSharedDetails[i].beneficiaryId);
  //           handleFieldChange1(
  //             copiedSharedDetails[i].beneficiaryId,
  //             copiedSharedDetails[i].distributedType,
  //             copiedSharedDetails[i].distributedValue
  //           );
  //           // console.log("sajid " + sharedDetails[0])
  //         }

  //         console.log(
  //           "sharedDetails beneficiaryDetails : ",
  //           beneficiaryDetails
  //         );
  //         console.log(
  //           "sharedDetails selectedBeneficiaries : ",
  //           selectedBeneficiaries
  //         );
  //         console.log("sharedDetails distributedType : ", distributedType);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [showAfterCloseBene]);

  const getData = () => {
    let token = "Bearer " + getToken();
    getSinglejewelry(token, id).then((res) => {
      console.log("this is jewelry responce ", res);
      setData({
        ...data,
        jewelry: res.jewelry,
        documents: res.documents,
        sharedDetails: res.sharedDetails,
        supportingImages: res.supportingImages,
      });
      const copiedSharedDetails = [...res.sharedDetails];
      console.log("copiedSharedDetails response : ", copiedSharedDetails);
      setEstimatedTotalAmount(res.jewelry.estimatedValue);
      setIsTextFieldClicked(true);

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

        console.log("sharedDetails beneficiaryDetails : ", beneficiaryDetails);
        console.log(
          "sharedDetails selectedBeneficiaries : ",
          selectedBeneficiaries
        );
        console.log("sharedDetails distributedType : ", distributedType);
      }
    });
  };
  // Get data based on the jewelery id
  // const getData = () => {
  //   let token = "Bearer " + getToken();
  //   getjewelery(token, jewelryId)
  //     .then((res) => {
  //       setData({
  //         ...data,
  //         details: res.details,
  //         estimatedValue: res.estimatedValue,
  //         keratValue: res.keratValue,
  //         weight: res.weight,
  //         notes: res.notes,
  //         benificiary: res.benificiary,
  //         jewelryCaption: res.jewelryCaption
  //       });
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       console.log("Data not loaded");

  //     });
  // };
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
  //       .catch((error) => {
  //         // console.log("Error: ", "Failed to fetch the metal price");
  //       });
  //   };

  //   fetchMetalPrice();
  //   getData(); // Moved the getData call inside the same useEffect
  // }, [data.jewelry.jewelryName, data.jewelry.caratValue]);

  // ... (remaining existing functions)

  // useEffect(() => {
  //   const calculateEstimatedValue = () => {
  //     if (data.jewelry.jewelryName && data.jewelry.weight && metalPrice) {
  //       // Assuming the selected metal unit is 24K and using the metal price for 24K gold to calculate the estimated value
  //       const estimatedValue = data.jewelry.weight * metalPrice;

  //       setData((prevData) => ({
  //         ...prevData,
  //         jewelry: {
  //           ...prevData.jewelry,
  //           estimatedValue: estimatedValue.toFixed(3),
  //         },
  //       }));

  //       // setData((prevData) => ({
  //       //   ...prevData,
  //       //   estimatedValue: estimatedValue.toFixed(3),
  //       // }));
  //     } else {
  //       setData((prevData) => ({
  //         ...prevData,
  //         jewelry: {
  //           ...prevData.jewelry,
  //           estimatedValue: "",
  //         },
  //       }));
  //     }
  //   };

  //   calculateEstimatedValue();
  // }, [data.jewelry.jewelryName, data.jewelry.weight, metalPrice]);

  // const getDisplayName = (metadataValue) => {
  //   switch (metadataValue) {
  //     case "XAU":
  //       return "Gold";
  //     case "XAG":
  //       return "Silver";
  //     case "XPT":
  //       return "Platinum";
  //     case "XPD":
  //       return "Palladium";
  //     default:
  //       return metadataValue;
  //   }
  // };
  // const getDisplayKeratValue = (keratValue) => {
  //   switch (keratValue) {
  //     case "":
  //       return "24k";
  //     case "price_gram_22k":
  //       return "22k";
  //     case "price_gram_21k":
  //       return "21k";
  //     case "price_gram_20k":
  //       return "20k";
  //     case "price_gram_18k":
  //       return "18k";
  //     case "price_gram_16k":
  //       return "16k";
  //     case "price_gram_14k":
  //       return "14k";
  //     case "price_gram_10k":
  //       return "10k";
  //     default:
  //       return keratValue;
  //   }
  // };
  useEffect(() => {
    getData();
    getBenificiarydata();
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

  //
  const [benevisible, setbeneVisible] = useState(false);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
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
    // setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };

  const handleReset = () => {
    setbeneVisible(false);

    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    // setShowAfterCloseBene(false);
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

  return (
    <UserBase>
      <div className="mt-5"></div>
      <SideBar>
        <div className="overlay1-edit">
          <div
            className="propertyform"
            style={{ display: "flex", justifyContent: "left" }}
          >
            <Container className="edit_container">
              <Card color="outline">
                <CardHeader>
                  <h3 className="form1-heading">Edit Jewelry</h3>
                  <div
                    className="Close"
                    onClick={() => {
                      navigate("/user/my-estate/jewelry");
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={jewelryForm}>
                    <div className="mt-3" style={{ width: "100%" }}>
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
                      <Tooltip title="Enter Name for Jewelry">
                        <TextField
                          required
                          type="text"
                          label="Jewelry Name"
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
                    <div className="mt-3" style={{ width: "100%" }}>
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
                      <Tooltip title="Add your jewelry related images">
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
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
      </SideBar>
    </UserBase>
  );
}

export default EditJewelry;
