import {
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form
} from "reactstrap";
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import "../../../css/formPOPup.css";
import "../../../css/myestare.css";
import "../../../css/myestate_edit.css";
import { getSingleCryptoAssest, updateCryptoAssests } from "../../../services/CryptoService";
import {
  getBeneficiary,
  getToken,
  getUser
} from "../../../services/user-service";

function EditCrypto() {
  const { id } = useParams();
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
  const navigate = useNavigate();

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

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
  const [isTextFieldClicked, setIsTextFieldClicked] = useState(false);

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


  const cryptoForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    if (
      data.cryptoAssest.coin === "" ||
      data.cryptoAssest.exchange === "" ||
      data.cryptoAssest.wallet === "" ||
      data.cryptoAssest.quantity === ""
    ) {
      console.log("Error log");
      toast.error("Please Fill All required field Then Submit .", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
        console.log("this is file indexs", selectedImage[i]);
      }
    }
    formData.append("data", JSON.stringify(data));
    console.log("formData : ", JSON.stringify(data));

    updateCryptoAssests(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/crypto");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  // const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleCryptoAssest(token, id);
        console.log("this is crypto responce ", res);
        setData({
          ...data,
          cryptoAssest: res.cryptoAssest,
          documents: res.documents,
          sharedDetails: res.sharedDetails,
        });

        setEstimatedTotalAmount(res.cryptoAssest.estValue);
        setIsTextFieldClicked(true);
        const copiedSharedDetails = [...res.sharedDetails];
        console.log("copiedSharedDetails response : ", copiedSharedDetails);

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

  // const getCoins = (value) => {
  //   console.log("Value-=----------- :  ", value);
  //   axios
  //     .get(
  //       "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
  //     )
  //     .then((res) => {
  //       setCoins(res.data);
  //       console.log("Coins : ", res.data);
  //       console.log("Coins getCoins: ", coins);
  //     })
  //     .catch((error) => {
  //       console.log(
  //         "ERROR : ",
  //         "You've exceeded the Limit try after some time !!"
  //       );
  //     });
  // };

  // useEffect(() => {
  //   const calculateEstimatedValue = () => {
  //     // Check if both selectCrypto and quntity fields have values
  //     if (data.cryptoAssest.coin && data.cryptoAssest.quantity) {
  //       // Perform the calculation for the estimated value
  //       const selectedCrypto = coins.find(
  //         (coin) => coin.name === data.cryptoAssest.coin
  //       );
  //       // console.log("selectedCrypto 1: ", selectedCrypto);
  //       if (selectedCrypto) {
  //         // console.log("selectedCrypto : ", selectedCrypto);
  //         const estimatedValue1 =
  //           data.cryptoAssest.quantity * selectedCrypto.current_price;
  //         // console.log("estimatedValue : ", selectedCrypto);
  //         // setEstimatedValue(estimatedValue1.toString());
  //         setData((prevData) => ({
  //           ...prevData,
  //           cryptoAssest: {
  //             ...prevData.cryptoAssest,
  //             estValue: estimatedValue1.toString(),
  //           },
  //         }));
  //       }
  //     } else {
  //       const estimatedValue = "";
  //       // console.log("estimatedValue : ", estimatedValue);
  //       setData((prevData) => ({
  //         ...prevData,
  //         cryptoAssest: {
  //           ...prevData.cryptoAssest,
  //           estValue: estimatedValue,
  //         },
  //       }));
  //     }
  //   };

  //   calculateEstimatedValue();
  // }, 
  // // [data.cryptoAssest.coin, data.cryptoAssest.quantity]
  // []);


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
          {/* <h2>Add Properties</h2> */}
          <div
            className="propertyform"
            style={{ display: "flex", justifyContent: "left" }}
          >
            <Container className="edit_container">
              <Card color="" outline>
                {/* {JSON.stringify(data)} */}
                <CardHeader>
                  <h3 className="form1-heading">Edit Bit Coin Assets</h3>
                  <div
                    className="Close"
                    onClick={() => {
                      
                        navigate("/user/my-estate/crypto");
                      
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={cryptoForm}>
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
                    <div className="mt-3" style={{ width: "100%" }}>
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
                            <MenuItem value={"Bitcoin"}>Bitcoin</MenuItem>
                            {/* <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem> */}
                            {/* {coins.length > 0 ? (
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
                                )} */}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </div>
                    <div
                      className="form1-double"
                      style={{ display: "flex", gap: "5px", width: "100%" }}
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
                            // placeholder="$"
                            type="text"
                            label="Estimated Value"
                            id="estimatedValue"
                            size="normal"
                            onChange={(e) => {
                              handleChanges(e, "estValue");
                            }}
                            value={data.cryptoAssest.estValue}
                            // value={estimatedValue}
                            onClick={() => {
                              setIsTextFieldClicked(true);
                            }}
                            InputProps={{
                              // readOnly: true,
                              startAdornment: isTextFieldClicked ? (
                                <div>$</div>
                              ) : null,
                            }}

                            // disabled
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
      {/* <div>
        <Footer />
      </div> */}
    </UserBase>
  );
}

export default EditCrypto;
