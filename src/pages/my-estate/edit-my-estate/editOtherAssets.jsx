import { useEffect, useState } from "react";
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
  editOtherAssets,
  getOtherAssets,
  getSingleOtherAssets,
  getUser,
  getToken,
  getBeneficiary,
} from "../../../services/user-service";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import "../../../css/myestate_edit.css";
import "../../../css/formPOPup.css";
import {
  faXmark,
  faPlus,
  faMinus,
  faDownload,
  faLocationDot,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getSingleOtherAsset,
  getSingleOtherAssetMy,
  updateOtherAsset,
} from "../../../services/OtherAssetService";
function EditOtherAssets() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    otherAsset: {
      assetCaption: "",
      assetValue: "",
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
      console.log("Error log");
      toast.error("Please fill all required feilds.");
      return;
    }
    //create form data to send a file and remaining class data
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
      console.log("this is file indexs", selectedImage[i]);
    }
    formData.append("data", JSON.stringify(data));

    updateOtherAsset(formData, token)
      .then((resp) => {
        console.log(resp);
        console.log("Success log");
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/other-assests");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const [category, setCategory] = useState([]);
  const getData = () => {
    let token = "Bearer " + getToken();
    getSingleOtherAsset(token, id).then((res) => {
      console.log("this is realEstate responce ", res);
      setData({
        ...data,
        otherAsset: res.otherAsset,
        documents: res.documents,
        sharedDetails: res.sharedDetails,
      });
      //   setEstimatedTotalAmount(res.realEstate.estPropertyVal);
    });
  };
  useEffect(() => {
    // getData();
  }, []);

  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
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
  //       setEstimatedTotalAmount(res.realEstate.estPropertyVal);

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

  let [findOthAssetLength, setFindOthAssetLength] = useState(0);
  let dublicateOtherAsset = {};
          
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleOtherAsset(token, id);
        console.log("this is otherAsset responce ", res);
        setData({
          ...data,
          otherAsset: res.otherAsset,
          documents: res.documents,
          sharedDetails: res.sharedDetails,
        });

        dublicateOtherAsset = { ...res.otherAsset };
        let findOtherAssetLength = 0;
        for (let i = 1; i <= 5; i++) {
          const propertyName = `otherAssets${i}`;
          const hasData = dublicateOtherAsset[propertyName].trim() !== "";
          if(hasData == true) {
            findOtherAssetLength = findOtherAssetLength+1;
          }
        }
        setVisibleColumnIndex(findOtherAssetLength-1)
        setFindOthAssetLength(findOtherAssetLength)

        const copiedSharedDetails = [...res.sharedDetails];
        console.log("copiedSharedDetails response : ", copiedSharedDetails);
        setEstimatedTotalAmount(res.otherAsset.assetValue);

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
  

  const [otherAssets, setOtherAssets] = useState([{ name: "", notes: "" }]);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  const otherAssetss = [0, 1, 2, 3, 4];
  const handleAddColumn = () => {
    console.log("visible index is for edit : ", visibleColumnIndex);
    if (visibleColumnIndex < 4) {
      setOtherAssets([...otherAssets, { label: visibleColumnIndex + 1 }]);
      console.log("add button clicked");
      setVisibleColumnIndex(visibleColumnIndex + 1);
    }
    // console.log("add button clicked");
  };
  const handleRemoveColumn = (indexToRemove) => {
    if (otherAssets.length > 0) {
      // Create a copy of the otherAssets array
      const updatedAssets = [...otherAssets];
      // Remove the last element
      updatedAssets.pop();
      // Update the state with the modified array
      setOtherAssets(updatedAssets);

      // Update visibleColumnIndex if necessary
      if (visibleColumnIndex > 0) {
        setVisibleColumnIndex(visibleColumnIndex - 1);
      }
    }
    setData((prevData) => {
      const updatedOtherAsset = { ...prevData.otherAsset };

      // Reset the value of the field corresponding to the removed column to an empty string
      for (let i = 1; i <= visibleColumnIndex + 1; i++) {
        const fieldKey = `otherAssets${i + 1}`;
        if (indexToRemove === i) {
          updatedOtherAsset[fieldKey] = ""; // Reset the field value to an empty string
        }
      }

      // Return the updated state with the modified otherAsset object
      return {
        ...prevData,
        otherAsset: updatedOtherAsset,
      };
    });
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
              paddingTop: "30px",
            }}
          >
            <Container style={{ width: "425px" }}>
              <Card color="outline">
                <CardHeader>
                  <h2 className="form1-heading">Edit Assets</h2>
                  <div
                    className="Close"
                    onClick={() => {
                      {
                        navigate("/user/my-estate/other-assests");
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={OtherAssestForm}>
                    {/* <div
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
                    </div> */}

                    <div>
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
                          <div style={{ width: "100%" }}>
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
                                // label={index === 0 ? "Assets" : "Add More "}
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                            }}
                          >
                            {index >= findOthAssetLength && ( // Render minus button for indexes other than 0
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
                                  marginLeft: "5px",
                                }}
                                onClick={() => handleRemoveColumn(index)}
                              >
                                <FontAwesomeIcon icon={faMinus} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {visibleColumnIndex < 4 && (
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
                      )}
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
                      <Tooltip title="Enter value for other Assets">
                        {/* use text area here  */}
                        <TextField
                          fullWidth
                          type="text"
                          label="Assets Value"
                          id="assetValue"
                          size="normal"
                          required
                          onChange={(e) => handleChanges(e, "assetValue")}
                          value={data.otherAsset.assetValue}
                          InputProps={{
                            startAdornment: <div>$</div>,
                          }}
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
                          className="share_property_Type_select"
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
export default EditOtherAssets;
