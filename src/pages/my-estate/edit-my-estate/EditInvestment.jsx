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
import {
  faCalculator,
  faDownload,
  faPlus,
  faXmark,
  faLocationDot,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import {
  getInvestment,
  getToken,
  investments,
  updateInvestment,
  getUser,
  getBeneficiary,
} from "../../../services/user-service";
import {
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  TextField,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import "../../../css/myestate_edit.css";
import "../../../css/formPOPup.css";
import {
  getSingleInvestment,
  updateInvestments,
} from "../../../services/investment-service";

function EditInvestment() {
  const { id } = useParams();
  const navigate = useNavigate();

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
        console.log("this is file indexs", selectedImage[i]);
      }
    }
    formData.append("data", JSON.stringify(data));
    console.log("formData : ", JSON.stringify(data));

    updateInvestments(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/investments");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  // Set the form
  // const investmentForm = (event) => {
  //   event.preventDefault();

  //   // if (error.isError) {
  //   //   toast.error("Form data is invalid.");
  //   //   return;
  //   // }

  //   let token = "Bearer " + getToken();

  //   console.log("Token : " + token);
  //   if (
  //     data.investment === "" ||
  //     data.totalAmount === "" ||
  //     data.nameOfTheInvestment === ""
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

  //   updateInvestment(formData, token, investmentID)
  //     .then((resp) => {
  //       console.log(resp);
  //       toast.success("Updated Successfully !!", {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //       navigate("/user/my-estate/investments");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // console.log("Error log");
  //       // // handle error
  //       // setError({
  //       //   errors: error,
  //       //   isError: true
  //       // })
  //     });
  // };

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
  // const getData = () => {
  //   let token = "Bearer " + getToken();
  //   getSingleInvestment(token, id).then((res) => {
  //     console.log("this is realEstate responce ", res);
  //     setData({
  //       ...data,
  //       investment: res.investment,
  //       documents: res.documents,
  //       sharedDetails: res.sharedDetails,
  //     });
  //     setEstimatedTotalAmount(res.investment.totalAmount);
  //   });
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleInvestment(token, id);
        console.log("this is investment responce ", res);
        setData({
          ...data,
          investment: res.investment,
          documents: res.documents,
          sharedDetails: res.sharedDetails,
        });

        const copiedSharedDetails = [...res.sharedDetails];
        console.log("copiedSharedDetails response : ", copiedSharedDetails);
        setEstimatedTotalAmount(res.investment.totalAmount);

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
    <>
      <UserBase>
        <div className="mt-5"></div>
        <SideBar>
          <div className="overlay1-edit">
            <div
              className="propertyform"
              style={{
                display: "flex",
                justifyContent: "left",
                paddingTop: "30px",
              }}
            >
              <Container className="edit_container">
                <Card color="outline">
                  <CardHeader>
                    <h2 className="form1-heading"> Edit Investments</h2>
                    <div
                      className="Close"
                      onClick={() => {
                        {
                          navigate("/user/my-estate/investments");
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={investmentForm}>
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
    </>
  );
}

export default EditInvestment;
