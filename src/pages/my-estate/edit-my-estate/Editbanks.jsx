import emailjs from "emailjs-com";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import {
  faXmark,
  faPlus,
  faMinus,
  faDownload,
  faLocationDot,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import {
  getBankRow,
  getToken,
  updatebank,
  getUser,
  getBeneficiary,
  getSecondaryUser,
} from "../../../services/user-service";
import "../../../css/myestate_edit.css";
import { getSingleBank, updateBank } from "../../../services/bank-service";

function Editbanks() {
  // get id from the url
  const { id } = useParams();
  const navigate = useNavigate();
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
    documents: [
      {
        fileName: "",
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

  const [selectedImage, setSelectedImage] = useState([]);
  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
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
    const balances = data.accounts.map((account) => account.balance || 0);
    const newTotalBalance = balances.reduce(
      (acc, curr) => acc + parseFloat(curr),
      0
    );
    setEstimatedTotalAmount(newTotalBalance);
  };
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [visibleColumnIndex, setVisibleColumnIndex] = useState(0);
  const [account, setAccount] = useState([]);
  const [distributedType, setDistributedType] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState([]);
  const [bankFieldClicked, setBankFieldClicked] = useState(false);

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
  const [showAfterCloseBene, setShowAfterCloseBene] = useState(true);
  const handleReset = () => {
    setbeneVisible(false);
    setDistributedType("");
    setSelectedBeneficiaries([]);
    setBeneficiaryDetails({});
    setShowAfterCloseBene(false);
  };

  // Handle image
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
    }
  };
  const [bankName, setBankName] = React.useState("");
  const bankHandleChange = (event) => {
    if (event.target === undefined) {
      console.log("event wallet : ", event);
      setBankName(event);
      data.bank = event;
      console.log("data.banks : ", bankName);
    } else {
      console.log("event target : ", event.target);
      setBankName(event.target.value);
      data.bank = event.target.value;
    }
  };
  // post the form
  const BankForm = (event) => {
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
    updateBank(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/banks");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };
  const [sharedDetails, setSharedDetails] = useState([
    {
      distributedType: "",
      distributedValue: "",
      distributedAmount: "",
      beneficiaryId: "",
    },
  ]);
  const [typeaccount, setTypeccount] = useState([]);
  const getData = () => {
    let token = "Bearer " + getToken();
    getSingleBank(token, id).then((res) => {
      console.log("this is  bank responce ", res);
      setTypeccount(res);
      setData({
        ...data,
        bank: res.bank,
        accounts: res.accounts,
        documents: res.documents,
        sharedDetails: res.sharedDetails,
      });
      setChecked(res.bank.safetyBox);
      console.log("this is bank type : ", res.bank.safetyBox);
      setBankName(res.banks);
      setEstimatedTotalAmount(res.bank.totalAmount);

      console.log("sharedDetails response : ", res.sharedDetails);
      console.log("sharedDetails response : ", sharedDetails);
      if (res.sharedDetails.length > 0) {
        setSharedDetails(res.sharedDetails);
        ben(res.sharedDetails[0].distributedType);
        for (var i = 0; i < res.sharedDetails.length; i++) {
          handleBeneficiarySelection1(res.sharedDetails[i].beneficiaryId);
          // const handleFieldChange = (beneficiary, field, value) => {}
          handleFieldChange1(
            res.sharedDetails[i].beneficiaryId,
            res.sharedDetails[i].distributedType,
            res.sharedDetails[i].distributedValue
          );

          // handleFieldChange1(res.sharedDetails[i].beneficiaryId, res.sharedDetails[i].distributedType, res.sharedDetails[i].distributedValue);
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
  // useEffect(() => {
  //   getData();
  // }, []);

  let findAccountLength = null;
  let [findAccLength, setFindAccLength] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "Bearer " + getToken();
        const res = await getSingleBank(token, id);
        console.log("this is  bank response ", res);
        setTypeccount(res);
        setData({
          ...data,
          bank: res.bank,
          accounts: res.accounts,
          documents: res.documents,
          sharedDetails: res.sharedDetails,
        });
        const ownerNameArray = res.bank.owner.split(", ");
        setOwnerName(ownerNameArray);
        setChecked(res.bank.safetyBox);
        findAccountLength = [...res.accounts];
        setFindAccLength(findAccountLength.length);
        setVisibleColumnIndex(findAccountLength.length - 1);
        const copiedSharedDetails = [...res.sharedDetails];
        console.log("copiedSharedDetails response : ", copiedSharedDetails);
        console.log("this is bank type : ", res.bank.safetyBox);
        setBankName(res.banks);
        setBankFieldClicked(true);
        setEstimatedTotalAmount(res.bank.totalAmount);

        const checkSelectedBankTypes = [...res.accounts];
        setSelectedBankTypes((prevSelectedBankTypes) => {
          const newSelectedBankTypes = [...prevSelectedBankTypes];
          // Check each account type and update the selected bank types accordingly
          checkSelectedBankTypes.forEach((account, index) => {
            if (account.accountType === "Checking Account") {
              newSelectedBankTypes[index] = "Checking Account";
            } else if (account.accountType === "Savings Account") {
              newSelectedBankTypes[index] = "Savings Account";
            } else if (account.accountType === "Investment Account") {
              newSelectedBankTypes[index] = "Investment Account";
            } else if (account.accountType === "C.D Account") {
              newSelectedBankTypes[index] = "C.D Account";
            }
          });

          return newSelectedBankTypes;
        });

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

  const [category, setCategory] = useState([]);
  const getBankName = (bankName) => {
    if (category !== null) {
      return category.some((item) => item.bank.bankName === bankName);
    } else {
      return false;
    }
  };

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
  const [visibleField, setVisibleField] = useState(0);
  const handleAddField = () => {
    if (visibleField <= 4) {
      setVisibleField(visibleField + 1);
    }
  };
  const accountType = [
    "Checking Account",
    "Savings Account",
    "Investment Account",
    "C.D Account",
  ];
  const [benevisible, setbeneVisible] = useState(false);
  let [show1, setShow1] = useState(false);
  const handleShowBeneficiary = () => {
    setbeneVisible(true);
    setShow1(false);
    setShowAfterCloseBene(true);
    // data.sharedDetails = [];
  };
  let [otherPropertyTypes, setOtherPropertyTypes] = useState(false);
  const [isChecked, setChecked] = useState(""); // Convert saftyBox value to boolean
  const handleSwitchChange = () => {
    console.log("data : ", data);
    console.log("isChecked : ", isChecked);
    if (isChecked === "true") {
      setChecked("felse");
      data.bank.safetyBoxNumber = "";
      data.bank.safetyBox = "felse";
    } else {
      setChecked("true");
      data.bank.safetyBox = "true";
    }
  };
  // useEffect(() => {
  // }, [data.saftyBox]);
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

    let totalBalanceFind = 0;
    data.accounts.forEach((account) => {
      totalBalanceFind += parseFloat(account.balance);
      setEstimatedTotalAmount(totalBalanceFind);
    });
  };

  // useEffect(() => {
  //   const balances = data.accounts.map(account => account.balance || 0);
  //   console.log("current balance :", balances);
  //   const newTotalBalance = balances.reduce((acc, curr) => acc + parseFloat(curr), 0);
  //   setEstimatedTotalAmount(newTotalBalance);
  //   console.log("this is my balance :", newTotalBalance);
  // }, [data]);
  let [visible, setVisible] = useState(0);
  const [hasEffectRun, setHasEffectRun] = useState(false);
  const bankarray1 = [
    typeaccount.accountNo1,
    typeaccount.accountNo2,
    typeaccount.accountNo3,
    typeaccount.accountNo4,
    typeaccount.accountNo5,
  ];
  const [bankarray, setBankArray] = useState([]);

  let [updatedVisible, setupdatedVisible] = useState([]);
  useEffect(() => {
    // setData();
    // if (!hasEffectRun) {
    //   setBankArray(
    //     bankarray1
    //       .filter((v, index) => data[`accountNo${index + 1}`] !== '')
    //       .map((v, index) => index + 1)
    //   );
    //   setVisible(bankarray.length);
    // }
  }, [hasEffectRun, bankarray, data]);
  const ben = (newType) => {
    // const newType = sharedDetails[0].distributedType;
    const resetDetails = {};
    Object.keys(beneficiaryDetails).forEach((beneficiary) => {
      resetDetails[beneficiary] = { percentage: "", value: "" };
    });
    setDistributedType(newType);
    setBeneficiaryDetails(resetDetails);
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
  const handleAddColumn = () => {
    console.log("this is visible under click", visible);
    if (visible <= 3) {
      setHasEffectRun(true);
      const updatedVisible = visible + 1;
      setBankArray((prevArray) => [...prevArray, updatedVisible]);
      setVisible(updatedVisible);
      console.log("Updated bankarray:", bankarray);
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

  const getAccountType = (bankName) => {};
  const handleBeneficiaryClose = (beneficiary) => {
    const updatedBeneficiaries = selectedBeneficiaries.filter(
      (b) => b !== beneficiary
    );
    setSelectedBeneficiaries(updatedBeneficiaries);
    const updatedDetails = { ...beneficiaryDetails };
    delete updatedDetails[beneficiary];
    setBeneficiaryDetails(updatedDetails);
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
    <UserBase>
      <div className="mt-5"></div>
      <SideBar>
        <div className="overlay1-edit">
          <div
            className="propertyform"
            style={{ display: "flex", justifyContent: "left" }}
          >
            <Container className="edit_container">
              <Card color="" outline>
                <CardHeader>
                  {/* {JSON.stringify(data)} */}
                  <h3 className="form1-heading">Edit Bank</h3>
                  <div
                    className="Close"
                    onClick={() => {
                      {
                        navigate("/user/my-estate/banks");
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
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
                    <div
                      className="form1-double"
                      style={{
                        display: "flex",
                        gap: "10px",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="mt-3"
                        style={{ width: "49.5%", flex: "1 1" }}
                      >
                        <FormControl
                          required
                          fullWidth
                          sx={{ minWidth: 120 }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-label">
                            {data.bank.bankType === "other"
                              ? "Bank Type"
                              : "Bank Name"}
                          </InputLabel>

                          <Select
                            labelId="demo-simple-select-label"
                            id="banks"
                            label={
                              data.bank.bankType === "other"
                                ? "Bank Type"
                                : "Bank Name"
                            }
                            onChange={bankHandleChange}
                            value={
                              data.bank.bankType === "other"
                                ? data.bank.bankType
                                : data.bank.bankName
                            }
                            name="bankname"
                            className="custom-select"
                            readOnly
                            disabled
                          >
                            <MenuItem value={"JPMorgan Chase & Co"}>
                              <img
                                src="/logos/J.P._Morgan_Chase_logo_PNG3.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;JPMorgan Chase & Co
                            </MenuItem>
                            <MenuItem value={"Bank of America"}>
                              <img
                                src="/logos/Bank_of_America_logo_PNG4.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Bank of America
                            </MenuItem>
                            <MenuItem value={"Wells Fargo & Co"}>
                              <img
                                src="/logos/Wells_fargo_logo_PNG2.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Wells Fargo & Co
                            </MenuItem>
                            <MenuItem value={"Citigroup Inc"}>
                              <img
                                src="/logos/Citigroup_logo_PNG1.png"
                                style={{
                                  width: "40px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Citigroup Inc
                            </MenuItem>
                            <MenuItem value={"U.S. Bancorp"}>
                              <img
                                src="/logos/US-Bank-Logo-PNG3.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;U.S. Bancorp
                            </MenuItem>
                            <MenuItem value={"PNC bank"}>
                              <img
                                src="/logos/PNC_Bank_logo_PNG1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;PNC bank
                            </MenuItem>
                            <MenuItem value={"TD Bank"}>
                              <img
                                src="/logos/TD_Bank_logo_PNG1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;TD Bank
                            </MenuItem>
                            <MenuItem value={"Capital One"}>
                              <img
                                src="/logos/Capital_One_logo_PNG1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;Capital One
                            </MenuItem>
                            <MenuItem value={"Fifth Third Bank"}>
                              <img
                                src="/logos/Harris-Teeter-Logo-PNG_003-1.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Fifth Third Bank
                            </MenuItem>
                            <MenuItem value={"Ally Financial Inc"}>
                              <img
                                src="/logos/Ally_Financial_logo_PNG4.png"
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
                            >
                              <img
                                src="/logos/huntington.webp"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;Huntington Bancshares Incorporated
                            </MenuItem>
                            <MenuItem value={"KeyCorp"}>
                              <img
                                src="/logos/KeyBank_logo_PNG7.png"
                                style={{
                                  width: "45px",
                                  aspectRatio: "16/9",
                                  objectFit: "contain",
                                }}
                              />
                              &nbsp;&nbsp;KeyCorp
                            </MenuItem>
                            <MenuItem
                              value={"other"}
                              onClick={() => {
                                setOtherPropertyTypes(!otherPropertyTypes);
                              }}
                            >
                              Other
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      {/* Conditionally render the input field for custom text if "Other" is selected */}
                    </div>
                    {data.bank.bankType === "other" && (
                      <div className="mt-3">
                        <Tooltip title="Enter Your Other Bank ">
                          <TextField
                            fullWidth
                            type="text"
                            label="Bank Name"
                            id="bankName"
                            size="normal"
                            onChange={(e) => handleChangesBank(e, "bankName")}
                            value={data.bank.bankName}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    )}
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
                          {index >= findAccLength && (
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

                    {/* For apt number field */}

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
                                checked={isChecked === "true"}
                                onChange={handleSwitchChange}
                                color="primary"
                                size="normal"
                              />
                            }
                            label={isChecked === "true" ? "Yes" : "No"}
                            labelPlacement="end"
                          />
                        </div>
                      </div>

                      {isChecked === "true" && (
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
                              // placeholder="$"

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

                      {/* </Tooltip> */}
                    </div>

                    <div className="mt-3">
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
                    </div>
                    {/* beneficiary  */}
                    <div
                      className="bene-select mt-3"
                      onClick={handleShowBeneficiary}
                      style={{ cursor: "pointer" }}
                    >
                      Select Your Beneficiary
                    </div>
                    {/* notes */}
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

export default Editbanks;
