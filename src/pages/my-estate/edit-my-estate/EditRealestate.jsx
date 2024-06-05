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
  getBeneficiary,
  getToken,
  getUser,
} from "../../../services/user-service";
//import { Accordion, data , AccordionContext } from "reactstrap";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import "../../../css/formPOPup.css";
import "../../../css/myestate_edit.css";
import {
  getSingleRealEstate,
  updateRealEstates,
} from "../../../services/RealEstate-service";

function EditRealestate() {
  const { id } = useParams();

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
  const navigate = useNavigate();

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState(null);

  const [error] = useState({
    errors: {},
    isError: false,
  });

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

  // const resetData = () => {
  //   setData({
  //     esatate_Id: esatate_Id,
  //     streetAddress: "",
  //     mortgage1: "",
  //     mortgage2: "",
  //     mortgage3: "",
  //     mortgage4: "",
  //     mortgage5: "",
  //     aptNumber: "",
  //     exampleFile: "",
  //     taxDocument: "",
  //     zipCode: "",
  //     city: "",
  //     state: "",
  //     estPropertyVal: "",
  //     country: "",
  //     propertyTax: "",
  //     // rentalIncome: "",
  //     notes: "",
  //     caption: "",
  //     addfield1: "",
  //     addfield2: "",
  //     addfield3: "",
  //     addfield4: "",
  //     addfield5: "",
  //     benificiary: "",
  //     propertyCaption: "",
  //     propertyType: "",
  //     otherPropertyType: ""
  //   });
  // };

  // post the form
  const AddForm = (event) => {
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

    updateRealEstates(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/real-estate");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  // const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let token = "Bearer " + getToken();
  //       const res = await getSingleRealEstate(token, id);
  //       console.log("this is realEstate responce ", res);
  //       setData({
  //         ...data,
  //         sharedDetails: res.sharedDetails,
  //       });
  //       const copiedSharedDetails = [...res.sharedDetails];
  //       console.log("copiedSharedDetails response : ", copiedSharedDetails);
  //       // setEstimatedTotalAmount(res.realEstate.estPropertyVal);

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
  // }, []);

  let findMortgagesLength = null;
  let [findMortLength, setFindMortLength] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleRealEstate(token, id);
        console.log("this is realEstate responce ", res);
        setData({
          ...data,
          realEstate: res.realEstate,
          mortgages: res.mortgages,
          documents: res.documents,
          sharedDetails: res.sharedDetails,
        });
        findMortgagesLength = [...res.mortgages];
        setFindMortLength(findMortgagesLength.length);
        setVisibleColumnIndex(findMortgagesLength.length - 1);
        setIsTextFieldClicked3(true);
        const copiedSharedDetails = [...res.sharedDetails];
        console.log("copiedSharedDetails response : ", copiedSharedDetails);
        setEstimatedTotalAmount(res.realEstate.estPropertyVal);

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
    getBenificiarydata();
  }, []);

  const validateZipCode = (value) => {
    return /^\d{5}$/.test(value); // Validates a 5-digit numeric input
  };

  useEffect(() => {
    const fetchDataFromAPI = () => {
      if (data.realEstate.zipCode.length === 5) {
        const apiUrl = `http://api.zippopotam.us/us/${data.realEstate.zipCode}`;
        axios
          .get(apiUrl)
          .then((res) => {
            // setLoading(false);
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
            // setLoading(false);
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
      // setLoading(true);
    };

    fetchDataFromAPI();
  }, [data.realEstate.zipCode]);

  let to_name = getUser().firstName + " " + getUser().lastName;
  console.log("type of nam  is ::::::", typeof to_name);
  console.log(to_name);
  // beneficiary addition in form
  const [beneficiary, setBenificiary] = useState([]);
  const getBenificiarydata = () => {
    let userId = getUser().id;
    // console.log("this is obbbbbbbbbbb", getUser())
    // console.log("user email is - ", emaill)
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => console.log(err));
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

  //$ on click

  const [isTextFieldClicked3, setIsTextFieldClicked3] = useState(false);

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
    setEstimatedTotalAmount(data.realEstate.estPropertyVal);
  };

  const handleReset = () => {
    setbeneVisible(false);
    // setDistributionType("");
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
      <div className="mt-5">
        <SideBar>
          <div className="overlay1-edit">
            <div
              className="propertyform"
              style={{ display: "flex", justifyContent: "left" }}
            >
              <Container className="edit_container">
                <Card color="" outline>
                  <CardHeader>
                    <h3 className="form1-heading">Edit Properties</h3>
                    <div
                      className="Close"
                      onClick={() => {
                        navigate("/user/my-estate/real-estate");
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </div>
                    {/* {JSON.stringify(data)} */}
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
                              <MenuItem value={"Commercial"}>
                                Commercial
                              </MenuItem>
                              <MenuItem value={"Industrial"}>
                                Industrial
                              </MenuItem>
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
                      </div> */}

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
                                      ? data.mortgages[index]
                                          .mortgageInstitution
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
                                  title={`Add your mortgage number ${
                                    index + 1
                                  }`}
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
                                <Tooltip
                                  title={`Add your mortgage ${index + 1}`}
                                >
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
                            {index >= findMortLength && (
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
                            onChange={(e) =>
                              handleChangesRealEstate(e, "notes")
                            }
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
      </div>
    </UserBase>
  );
}

export default EditRealestate;
