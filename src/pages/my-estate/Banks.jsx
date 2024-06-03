import {
  faXmark,
  faPlus,
  faMinus,
  faDownload,
  faLocationDot,
  faBuildingColumns,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Switch,
  FormControlLabel,
  TextareaAutosize,
} from "@mui/material";

// import "../../../public/logos/Ally_Financial_logo_PNG4.png";
import React, { useEffect, useRef, useState } from "react";
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
import "../../css/myestare.css";
import {
  bank,
  bankRemove,
  downloadDocument1,
  getToken,
  getUser,
  getBeneficiary,
  deleteSingleProperty,
  getSecondaryUser,
} from "../../services/user-service";
import Deletebutton from "./Deletebutton";
import UpdateButton from "./UpdateButton";
import "../../css/formPOPup.css";
import { addBank, getBank, deleteBank } from "../../services/bank-service";

function Banks() {
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
  let [form1, setForm1] = useState(false);
  // let userId = getUser().id;

  const [data, setData] = useState({
    bank: {
      owner: "",
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

  // for owner field
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
      bank: {
        ...prevData.bank,
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

  const resetForm = () => {
    getBankName("");
    setBankFieldClicked(false);
    setSelectedBankTypes("");
    setData({
      bank: {
        owner: "",
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

    let token = "Bearer " + getToken();

    for (let i = 0; i < data.accounts.length; i++) {
      const account = data.accounts[i];
      if (!/^\d{15}$/.test(account.accountNumber)) {
        // Display an error message or handle validation failure
        toast.error("Enter valid 15 digit account number", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return; // Exit the function without hitting the API
      }
    }
    toggle();
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(`files`, selectedImage[i]);
    }
    formData.append("data", JSON.stringify(data));
    addBank(formData, token)
      .then((resp) => {
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
    let userId = getUser().commonId;
    let token = "Bearer " + getToken();
    getBank(token, userId)
      .then((res) => {
        setCategory(res);
      })
      .catch((error) => {});
  };
  const handleRemove = (id, idType) => {
    if (idType == "bankId") {
      deleteBank(id)
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
  const toggle = () => {
    resetForm();
    setForm1(!form1);
  };
  // card creating
  const AddCard = () => {
    let userId = getUser().commonId;
    let token = "Bearer " + getToken();

    getBank(token, userId)
      .then((res) => {
        setCard(res);
      })
      .catch((error) => {
        setCard([]);
      });
  };
  const Showdetails = (obj) => {
    setShowDetail(obj);
    setShow1(true);
  };
  const getBenificiarydata = () => {
    let userId = getUser().id;

    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => {});
  };
  const getBankName = (bankName) => {
    return category.some(
      (item) =>
        item.bank.bankName === bankName &&
        item.bank.isInternationalAsset === "false"
    );
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
    // const length = data.sharedDetails.length;
    // data.sharedDetails[length] = beneficiaryDetails;
  };
  useEffect(() => {
    getData();
    AddCard();
    getBenificiarydata();
    setShow(true);
  }, []);

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

  const [newBankVisible, setNewBankVisible] = useState(false);
  const handleOpenNewBank = () => {
    setNewBankVisible(true);
  };

  const [visibleAccountIndices, setVisibleAccountIndices] = useState([]);

  const toggleVisibility = (index) => {
    const currentIndex = visibleAccountIndices.indexOf(index);
    const newVisibleIndices = [...visibleAccountIndices];

    if (currentIndex === -1) {
      newVisibleIndices.push(index);
    } else {
      newVisibleIndices.splice(currentIndex, 1);
    }

    setVisibleAccountIndices(newVisibleIndices);
  };

  const renderAccountNumber = (accountNumber, index) => {
    if (visibleAccountIndices.includes(index)) {
      return accountNumber;
    } else {
      // Mask all but the last four digits
      const maskedDigits = accountNumber.slice(0, -4).replace(/\d/g, "*");
      const lastFourDigits = accountNumber.slice(-4);
      return maskedDigits + lastFourDigits;
    }
  };

  return (
    <div className={`your-component ${show ? "fade-in-element" : ""}`}>
      <UserBase>
        <div className="mt-5"></div>
        <SideBar>
          <div className="addme">
            <div className="addme_inner">
              <button onClick={() => toggle()}>Add New Bank</button>
            </div>
          </div>
          <div className="propCard">
            <div className="propCard-card">
              {card.map((entity) => (
                <div className="propCard-card-body" key={entity.bank.id}>
                  <div className="propCard-card-title">
                    {entity.bank.bankType === "other"
                      ? entity.bank.bankName
                      : bankLogo.map((bank) => {
                          const [bankName, logoUrl] = Object.entries(bank)[0];
                          if (bankName === entity.bank.bankName) {
                            return (
                              <div className="card_bank_main" key={bankName}>
                                <h5 className="card_banks">
                                  {entity.bank.bankName}
                                </h5>
                                <div className="card-image">
                                  <img
                                    src={logoUrl}
                                    alt={`Logo for ${bankName}`}
                                  />
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                  </div>
                  {entity.accounts && (
                    <p className="propCard-card-text">
                      {maskAccountNumber(entity.accounts[0].accountNumber)}
                    </p>
                  )}
                  <div className="propCard-btn">
                    <p className="viewDetails">
                      <button onClick={() => Showdetails(entity)}>
                        View Details
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {form1 && (
            <div
              className="overlay1"
              style={{ transition: "500ms", height: "" }}
            >
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
                                onChange={(e) =>
                                  handleChangesBank(e, "bankName")
                                }
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
                              <div
                                style={{ width: "100%", marginBottom: "8px" }}
                              >
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
                                        data.accounts[index]?.accountNumber ||
                                        ""
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
                                      value={
                                        data.accounts[index]?.balance || ""
                                      }
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
                              onChange={(e) => handleChangesBank(e, "notes")}
                              value={data.bank.notes}
                            />
                          </Tooltip>
                        </div>
                        <Container className="text-center">
                          <Button
                            className="my-estate-clear-btn"
                            type="reset"
                            onClick={resetForm}
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
                          icon={faBuildingColumns}
                          style={{ color: "#025596", fontSize: "18px" }}
                        />
                        <span>{showDetail.bank.bankName}</span>
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

                        {primaryUserDetails.accountType === "secondary" ? (
                          ""
                        ) : (
                          <div>
                            <Tooltip title="Click Here To Edit">
                              <div>
                                <UpdateButton
                                  URL={"../my-estate/banks/"}
                                  id={showDetail.bank.id}
                                />
                              </div>
                            </Tooltip>
                          </div>
                        )}

                        {primaryUserDetails.accountType === "secondary" ? (
                          ""
                        ) : (
                          <div>
                            <Deletebutton
                              handleRemove={handleRemove}
                              Id={showDetail.bank.id}
                              idType="bankId"
                            />
                          </div>
                        )}
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
                        {showDetail.bank.owner && (
                          <p>
                            Owner : <code>{showDetail.bank.owner}</code>
                          </p>
                        )}
                        {showDetail.bank.bankType !== "Other" &&
                        showDetail.bank.bankName ? (
                          <p>
                            Bank Name:
                            <code>
                              {/* <img
                                src={bankLogo[showDetail.bank.bankName]}
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                                alt={`Logo for ${showDetail.bank.bankName}`}
                              /> */}
                              &nbsp;&nbsp;{showDetail.bank.bankName}
                            </code>
                          </p>
                        ) : (
                          <p>
                            Other Banks: <code>{showDetail.bank.bankName}</code>
                          </p>
                        )}
                        {
                          <Tooltip title={`Click To See Details`}>
                            <p
                              onClick={() => {
                                SetshowAdditionField(showDetail);
                                setShow1(false);
                              }}
                            >
                              Additional Accounts Details:&nbsp;
                              <code>
                                <span className="readmore">Click to see</span>
                              </code>
                            </p>
                          </Tooltip>
                        }
                        <p>
                          Estimated Total Bank Assets:{" "}
                          <code style={{ color: "green", fontWeight: "bold" }}>
                            ${showDetail.bank.totalAmount}
                          </code>
                        </p>
                      </div>
                      <div className="col2">
                        {showDetail.bank.safetyBox ? (
                          <p>
                            Safty Box:{" "}
                            <code>
                              {showDetail.bank.safetyBox === "true" ? (
                                "yes"
                              ) : (
                                <span style={{ color: "red" }}>No</span>
                              )}
                            </code>
                          </p>
                        ) : (
                          ""
                        )}
                        {showDetail.bank.safetyBoxNumber ? (
                          <p>
                            SaftyBox ID:{" "}
                            <code>
                              {showDetail.bank.safetyBoxNumber === "" ? (
                                ""
                              ) : (
                                <span>{showDetail.bank.safetyBoxNumber}</span>
                              )}
                            </code>
                          </p>
                        ) : (
                          ""
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
                        {showDetail.bank.notes && (
                          <Tooltip title="Click To see Note">
                            <p
                              onClick={() => {
                                handleOpenPopup(showDetail.bank.notes);
                                setShow1(false);
                              }}
                            >
                              Note:{" "}
                              <code>
                                {showDetail && showDetail.bank.notes
                                  ? showDetail.bank.notes.slice(0, 5)
                                  : ""}
                                ...<span className="readmore">Read More</span>
                              </code>
                            </p>
                          </Tooltip>
                        )}

                        {/* <p
                          onClick={() => {
                            handleOpenNewBank();
                            setShow1(false);
                          }}
                        >
                          New Bank UI:{" "}
                          <code>
                            <span className="readmore">Click Here</span>
                          </code>
                        </p> */}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
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
          {popupVisible && (
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup">
                  <div className="note_popup_heading">
                    <div>
                      <h2>Note</h2>
                    </div>
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={() => {
                          setPopupVisible(false);
                          setShow1(true);
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

          {showAdditionField && (
            // Display the popup when a row is selected
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup_heading">
                  <div style={{ width: "100%" }}>
                    <h2 style={{ textAlign: "center" }}>Accounts Details</h2>
                  </div>
                  <div>
                    <button
                      className="note_popup_heading_close_btn"
                      onClick={() => {
                        SetshowAdditionField(false);
                        setShow1(true);
                        setVisibleAccountIndices([]);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
                {/* <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", }} > */}
                {showDetail.accounts &&
                  showDetail.accounts.map((account, index) => (
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
                      <div>
                        <p
                          style={{
                            fontSize: "17px",
                            color: "black",
                            fontWeight: "500",
                          }}
                        >
                          Account - {index + 1}
                        </p>
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
                          Account Number:
                          <span
                            style={{ marginLeft: "10px", fontWeight: "500" }}
                          >
                            {renderAccountNumber(account.accountNumber, index)}
                          </span>
                          <button
                            onClick={() => toggleVisibility(index)}
                            style={{
                              marginLeft: "10px",
                              border: "none",
                              background: "none",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={
                                visibleAccountIndices.includes(index)
                                  ? faEye
                                  : faEyeSlash
                              }
                            />
                          </button>
                        </p>
                        <p
                          style={{
                            fontSize: "15px",
                            color: "black",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          Account Type:{" "}
                          <span
                            style={{ marginLeft: "10px", fontWeight: "500" }}
                          >
                            {account.accountType}
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
                          Account Balance:
                          <span
                            style={{ marginLeft: "10px", fontWeight: "500" }}
                          >
                            ${account.balance}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                {/* </div> */}
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

          {/* {newBankVisible && (
            <div className="popup">
              <div className="popup-content popup-content-download">
                <div className="note_popup">
                  <div className="note_popup_heading">
                    
                    <div>
                      <button
                        className="note_popup_heading_close_btn"
                        onClick={() => {
                          setNewBankVisible(false);
                          setShow1(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {newBankVisible && (
            <div className="popup">
              <div className="popup-content popup-content-download">
                {/* Close Button */}
                <div className="d-flex justify-content-end">
                  <button
                    className="note_popup_heading_close_btn"
                    onClick={() => {
                      setNewBankVisible(false);
                      setShow1(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                <div className="bank_new_ui">
                  <div className="bank_new_ui_main">
                    <div className="bank_new_ui_main_lt">
                      <div>
                        <div>
                          <img></img>
                        </div>
                        <div>
                          <p>hello this is new card </p>
                          <p>hello this is new card</p>
                          <p>hello this is new card</p>
                        </div>
                      </div>
                    </div>
                    <div className="bank_new_ui_main_rt">
                      <div>
                        <Form onSubmit={BankForm}>
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
                                    disabled={getBankName(
                                      "JPMorgan Chase & Co"
                                    )}
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
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SideBar>
      </UserBase>
    </div>
  );
}

export default Banks;
