import { myAxios } from "./helper";

export const signup = (user) => {
  return myAxios.post("/user/", user).then((response) => response.data);
};

export const jointAccSignUp = (user) => {
  return myAxios
    .post("/user/jointAccount", user)
    .then((response) => response.data);
};

// get combined data
export const getCombinedData = (userId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get("/common/combined-data/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const updateUserProfile = (user, userId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .put("/user/update/" + userId, user, { headers: { authorization: token } })
    .then((response) => response.data);
};

//change password
export const changePassword = (user) => {
  let token = "Bearer " + getToken();
  return myAxios
    .put("/user/change-password", user, { headers: { Authorization: token } })
    .then((response) => response.data)
    .catch((error) => {
      throw error; // Rethrow the error to be caught by the caller
    });
};

export const realEstateContent = (realEstate, token) => {
  return myAxios
    .post("/realEstate/", realEstate, { headers: { authorization: token } })
    .then((response) => response);
};

//profile image adding
export const saveProfileImage = (userProfile) => {
  let token = "Bearer " + getToken();

  return myAxios
    .post("/user/save-profile-image", userProfile, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
//Create writing center
export const saveWritingCenter = (writingCenterDetails) => {
  let token = "Bearer " + getToken();

  return myAxios
    .post("/writingCenter/", writingCenterDetails, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
//get writing center
export const getWritingCenter = (userId) => {
  let token = "Bearer " + getToken();

  return myAxios
    .get("/writingCenter/user/" + userId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// get writing center by book id
export const getBook = (writingCenterId) => {
  let token = "Bearer " + getToken();

  return myAxios
    .get(`/writingCenter/id/${writingCenterId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// edit writing center book name
export const editWritingCenter = (writingCenterId, updatedData) => {
  let token = "Bearer " + getToken();
  return myAxios
    .put("/writingCenter/" + writingCenterId, updatedData, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// delete writingcenter book
export const deleteBook = (writingCenterId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .delete(`/writingCenter/${writingCenterId}`, {
      headers: { Authorization: token },
    })
    .then((response) => response.data);
};
// save diary data
export const saveDiary = (diaryDetails) => {
  let token = "Bearer " + getToken();

  return myAxios
    .post("/diary/", diaryDetails, { headers: { authorization: token } })
    .then((response) => response.data);
};
// show diary details
export const getDiary = (userId) => {
  let token = "Bearer " + getToken();

  return myAxios
    .get("/diary/user/" + userId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// get single diary
export const getSingleDiary = (id) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get(`/diary/` + id, { headers: { Authorization: token } })
    .then((response) => response.data);
};

// delete diary
export const deleteDiary = (diaryId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .delete(`/diary/${diaryId}`, { headers: { Authorization: token } })
    .then((response) => response.data);
};

// edit diary by id
export const editDiary = (diaryId, updatedDiary) => {
  let token = "Bearer " + getToken();
  return myAxios
    .put(`/diary/${diaryId}`, updatedDiary, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

// save autobiography data
export const saveAutobiography = (autobiographyDetails) => {
  let token = "Bearer " + getToken();
  return myAxios
    .post("/autobiography/", autobiographyDetails, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

// edit autobiography by id
export const editAutobiography = (autobiographyId, updatedAutobiography) => {
  let token = "Bearer " + getToken();
  return myAxios
    .put(`/autobiography/${autobiographyId}`, updatedAutobiography, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// get single autobiography
export const getSingleAutobiography = (id) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get(`/autobiography/` + id, { headers: { Authorization: token } })
    .then((response) => response.data);
};
// get  autobiography
export const getAutobiography = (userId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get("/autobiography/user/" + userId, { headers: { authorization: token } })
    .then((response) => response.data);
};

// delete autobiography
export const deleteAutobiography = (autobiographyId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .delete(`/autobiography/${autobiographyId}`, {
      headers: { Authorization: token },
    })
    .then((response) => response.data);
};
//networth
export const getNetworth = (userId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get(`/api/networth/${userId}`, { headers: { authorization: token } })
    .then((response) => response.data);
};

// Download document
export const downloadDocument1 = (id) => {
  let token = "Bearer " + getToken();
  return myAxios.get("/common/" + id, {
    responseType: "blob",
    headers: { authorization: token },
  });
};

// show images
export const showImages = (id) => {
  let token = "Bearer " + getToken();
  return myAxios.get("/common/showImages/" + id, {
    responseType: "blob",
    headers: { authorization: token },
  });
};

// Delete sharedProperty
export const deleteSingleProperty = (id) => {
  let token = "Bearer " + getToken();
  return myAxios.delete("/common/sharedProperty/" + id, {
    responseType: "blob",
    headers: { authorization: token },
  });
};

// Download Image
export const downloadImage = (fileName) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get(`/realEstate/download/${fileName}`, {
      headers: { authorization: token },
    })
    .then((response) => response);
};

// code to get all realestate based on userId
export const realEstateContentGet = (token, userId) => {
  return myAxios
    .get("/realEstate/realEstate/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
//Code by purnendu
export const realEstateContentRemove = (realEstateId, token) => {
  return myAxios
    .delete(`/realEstate/${realEstateId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// api to fetch the realestate row based on the realestate id
export const getRealEstateContent = (token, esatate_Id) => {
  return myAxios
    .get("/realEstate/" + esatate_Id, { headers: { authorization: token } })
    .then((response) => response.data);
};
//Api call to update a record in bank table after the edit
export const updateRealEstateContent = (realestate, token, esatate_Id) => {
  return myAxios
    .put("/realEstate/" + esatate_Id, realestate, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

//Get other assests
export const getOtherAssets = (userId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get("/otherAssets/otherAssets/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// delete other assests /]
export const removeOtherAssets = (OtherAssetsId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .delete("/otherAssets/" + OtherAssetsId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// get single  other assest by id
export const getSingleOtherAssets = (OtherAssetsId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .get("/otherAssets/" + OtherAssetsId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// edit other assests
export const editOtherAssets = (OtherAssets, OtherAssetsId) => {
  let token = "Bearer " + getToken();
  return myAxios
    .put("/otherAssets/" + OtherAssetsId, OtherAssets, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

//Add Other assests
export const addOtherAssets = (formData) => {
  let token = "Bearer " + getToken();
  return myAxios
    .post("/otherAssets/", formData, { headers: { authorization: token } })
    .then((response) => response.data);
};

//Get international assests
export const getInternationalAssest = (token, userId) => {
  return myAxios
    .get("/InternationAssests/internationAssests/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
//Add International assests
export const addInternationalAssest = (formData) => {
  let token = "Bearer " + getToken();

  return myAxios
    .post("/InternationAssests/", formData, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

// delete international assest
export const removeInternationalAssest = (InternationAssestsId, token) => {
  return myAxios
    .delete(`/InternationAssests/${InternationAssestsId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
//edit international assest

export const updateInternationalAssest = (
  InternationalAssest,
  InternationAssestsId
) => {
  let token = "Bearer " + getToken();
  return myAxios
    .put("/InternationAssests/" + InternationAssestsId, InternationalAssest, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const getAssestsRow = (token, InternationAssestsId) => {
  return myAxios
    .get("/InternationAssests/" + InternationAssestsId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

// add bank
export const bank = (formData, token) => {
  return myAxios
    .post("/banks/", formData, { headers: { authorization: token } })
    .then((response) => response.data);
};
export const bankGet = (token, userId) => {
  return myAxios
    .get("/banks/banks/" + userId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Code by purnendu
export const bankRemove = (banksId, token) => {
  return myAxios
    .delete(`/banks/${banksId}`, { headers: { authorization: token } })
    .then((response) => response.data);
};
// api to fetch the bank row based on the bank id
export const getBankRow = (token, bankId) => {
  return myAxios
    .get("/banks/" + bankId, { headers: { authorization: token } })
    .then((response) => response.data);
};
//Api call to update a record in bank table after the edit
export const updatebank = (banks, token, bankId) => {
  return myAxios
    .put("/banks/" + bankId, banks, { headers: { authorization: token } })
    .then((response) => response.data);
};

export const getBeneficiary = (token, userId) => {
  return myAxios
    .get("/user/beneficiary/" + userId, { headers: { authorization: token } })
    .then((res) => res.data);
};
export const getTrustee = (token, userId) => {
  return myAxios
    .get("/user/trustee/" + userId, { headers: { authorization: token } })
    .then((res) => res.data);
};

export const investments = (investment, token) => {
  return myAxios
    .post("/investment/", investment, { headers: { authorization: token } })
    .then((response) => response.data);
};
export const investmentsGet = (token, userId) => {
  return myAxios
    .get("/investment/investment/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// Code by purnendu
export const investmentsRemove = (investmentId, token) => {
  return myAxios
    .delete(`/investment/${investmentId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// get request to get the investment for updating purpose
export const getInvestment = (token, investmentId) => {
  return myAxios
    .get("/investment/" + investmentId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Api call to update the investment table
export const updateInvestment = (investment, token, investmentId) => {
  return myAxios
    .put("/investment/" + investmentId, investment, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
export const cryptoassets = (cryptoAssest, token) => {
  return myAxios
    .post("/cryptoAssest/", cryptoAssest, { headers: { authorization: token } })
    .then((response) => response.data);
};
export const cryptoassetsGet = (token, userId) => {
  return myAxios
    .get("/cryptoAssest/cryptoAssest/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// Code by purnendu
export const cryptoassetsRemove = (cryptoAssestId, token) => {
  return myAxios
    .delete(`/cryptoAssest/${cryptoAssestId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// get crypto assets based on the crypro assets Id for editing purpose
export const getCryptoasset = (token, userId) => {
  return myAxios
    .get("/cryptoAssest/" + userId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// API call to update the crypto assets
export const updateCryptoAssets = (cryptoAssest, token, cryptoassetId) => {
  return myAxios
    .put("/cryptoAssest/" + cryptoassetId, cryptoAssest, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const jewelry = (jewelry, token) => {
  return myAxios
    .post("/jewelry/", jewelry, { headers: { authorization: token } })
    .then((response) => response.data);
};
export const jewelryGet = (token, userId) => {
  return myAxios
    .get("/jewelry/jewelry/" + userId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Code by purnendu
export const jewelryRemove = (jewelryId, token) => {
  return myAxios
    .delete(`/jewelry/${jewelryId}`, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Api call to get the jewelryrow from the table for editing purpose
export const getjewelery = (token, jewelryId) => {
  return myAxios
    .get("/jewelry/" + jewelryId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Api call to update the jewelry row after edit
export const updateJewelry = (jewelry, token, jewelryId) => {
  return myAxios
    .put("/jewelry/" + jewelryId, jewelry, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const lifeinsurance = (lifeInsurance, token) => {
  return myAxios
    .post("/lifeInsurance/", lifeInsurance, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const lifeinsuranceGet = (token, userId) => {
  return myAxios
    .get("/lifeInsurance/lifeInsurance/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// Code by purnendu
export const lifeinsuranceRemove = (lifeInsuranceId, token) => {
  return myAxios
    .delete(`/lifeInsurance/${lifeInsuranceId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
//Api call to get the lifeinsurance data based on the row id
export const getLifeInsurance = (token, insuranceId) => {
  return myAxios
    .get("/lifeInsurance/" + insuranceId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Api call to update the lifeinsurance details after editing
export const updateLifeInsurance = (insurance, token, insuranceId) => {
  return myAxios
    .put("/lifeInsurance/" + insuranceId, insurance, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
export const vehicles = (vehicles, token) => {
  return myAxios
    .post("/vehicles/", vehicles, { headers: { authorization: token } })
    .then((response) => response.data);
};
export const vehiclesGet = (token, userId) => {
  return myAxios
    .get("/vehicles/vehicles/" + userId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Code By Purnendu
export const vehicleRemove = (vehiclesId, token) => {
  return myAxios
    .delete(`/vehicles/${vehiclesId}`, { headers: { authorization: token } })
    .then((response) => response.data);
};
// Api to get a vehical based on the id for editing purpose
export const getVehicle = (token, vehicleId) => {
  return myAxios
    .get("/vehicles/" + vehicleId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// API to update the vehicals based on the the id after editing it
export const updateVehicle = (vehical, token, vehicleId) => {
  return myAxios
    .put("/vehicles/" + vehicleId, vehical, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const credentials = (credentials, token) => {
  return myAxios
    .post("/credentials/", credentials, { headers: { authorization: token } })
    .then((response) => response.data);
};
export const credentialsGet = (token, userId) => {
  return myAxios
    .get("/credentials/credentials/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// Code By Purnendu
export const credentialsRemove = (credentialsId, token) => {
  return myAxios
    .delete(`/credentials/${credentialsId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// API call to get the credentials for editing purpose
export const getCredential = (token, credentialId) => {
  return myAxios
    .get("/credentials/" + credentialId, { headers: { authorization: token } })
    .then((response) => response.data);
};
// API to update the credentials based on the the id after editing it
export const updateCredentials = (credential, token, credentialId) => {
  return myAxios
    .put("/credentials/" + credentialId, credential, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const activeincome = (activeincome, token) => {
  return myAxios
    .post("/activeIncome/", activeincome, { headers: { authorization: token } })
    .then((response) => response.data);
};
export const activeincomeGet = (token, userId) => {
  return myAxios
    .get("/activeIncome/activeIncome/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// Code By Purnendu
export const activeincomeRemove = (activeIncomeId, token) => {
  return myAxios
    .delete(`/activeIncome/${activeIncomeId}`, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// API call to get the Active income for editing purpose
export const getActiveIncome = (token, activeIncome_Id) => {
  return myAxios
    .get("/activeIncome/" + activeIncome_Id, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};
// API to update the Active Income based on the the id after editing it
export const updateActiveIncome = (activeincome, token, activeIncome_Id) => {
  return myAxios
    .put("/activeIncome/" + activeIncome_Id, activeincome, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

export const currentUser = (token) => {
  return myAxios
    .get("/current-user/", { headers: { authorization: token } })
    .then((response) => response.data);
};

export const googleAuth = () => {
  return myAxios.get("/auth/google").then((response) => response.data);
};

// export const sendemail = (token, emaildetails) => {
//     return myAxios.post("/user/send-email", emaildetails, { headers: { authorization: token } }).then((response) => response.data);
// }
export const sendemail = (emaildetails) => {
  return myAxios
    .post("/user/send-email", emaildetails)
    .then((response) => response.data);
};

export const sendEmailWithAttachment = (token, formData) => {
  return myAxios
    .post("/user/send-email-attachment", formData, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

// forgot_password
export const forgotPassword = (data) => {
  return myAxios
    .post("/user/forgot-password", data)
    .then((response) => response.data);
};

//code by purnendu
export const getEmailByUsername = (username) => {
  return myAxios
    .post("/user/forgot", username)
    .then((response) => response.data);
};
//code by purnendu
export const sendOtp = (email) => {
  return myAxios
    .post("/user/send-otp", email)
    .then((response) => response.data);
};
//code by purnendu
export const verifyOtp = (user) => {
  return myAxios
    .post("/user/verify-otp", user)
    .then((response) => response.data);
};
export const trusteeApproval = (user) => {
  return myAxios.put("/user/", user).then((response) => response.data);
};
export const generateToken = (logindata) => {
  return myAxios
    .post("/generate-token", logindata)
    .then((response) => response.data);
};

export const loginUser = (token) => {
  localStorage.setItem("token", token);
  // Store.getS
  return token;
};

export const isLoggedIn = () => {
  let tokenStr = localStorage.getItem("token");
  if (tokenStr === undefined || tokenStr === "" || tokenStr === null) {
    return false;
  } else {
    return true;
  }
};

export const doLogout = () => {
  // let navigate = useNavigate();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("netWorth");
  localStorage.removeItem("secondaryUser");
  // navigate("/login");
  // <Navigate to={"/login"}/>
  return true;
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return null;
  }
};

export const getUsersByCommonId = (commonId) => {
  let token = "Bearer " + getToken();
  return myAxios.get(`/user/by-commonId/${commonId}`, {
    headers: { authorization: token },
  });
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));

  let currentUser = getUser();
  if (currentUser.commonId !== currentUser.id) {
    getUsersByCommonId(currentUser.commonId)
      .then((userDetails) => {
        let primaryUser = userDetails.data.find(
          (user) => user.accountType === "primary"
        );
        if (primaryUser) {
          localStorage.setItem("secondaryUser", JSON.stringify(primaryUser));
        }
      })
      .catch((error) => {});
  } else {
    getUsersByCommonId(currentUser.commonId)
      .then((userDetails) => {
        let secondaryUser = userDetails.data.find(
          (user) => user.accountType === "secondary"
        );
        if (secondaryUser) {
          localStorage.setItem("secondaryUser", JSON.stringify(secondaryUser));
        }
      })
      .catch((error) => {});
  }
};

export const setNetWorth = (netWorth) => {
  localStorage.setItem("netWorth", netWorth);
};

export const getNetWorth = () => {
  let networth = localStorage.getItem("netWorth");
  return networth;
};
export const getUser1 = () => {
  let user = localStorage.getItem("user");
  return user;
};

export const getSecondaryUser = () => {
  let secondaryUser = localStorage.getItem("secondaryUser");
  if (secondaryUser != null) {
    return JSON.parse(secondaryUser);
  } else {
    return undefined;
  }
};

export const getUser = () => {
  let userStr = localStorage.getItem("user");

  if (userStr != null) {
    return JSON.parse(userStr);
  } else {
    // this.logout();
    return undefined;
  }
};
// Code By Purnendu
export const getUserModel = (username) => {
  let token = "Bearer " + getToken();
  return myAxios.get(`/user/${username}`, {
    headers: { authorization: token },
  });
};

export const getUserModelById = (userId) => {
  let token = "Bearer " + getToken();
  return myAxios.get(`/user/by-id/${userId}`, {
    headers: { authorization: token },
  });
};

// get files from the backend

export const getFiles = (token, path) => {
  return myAxios
    .get(path, { headers: { authorization: token } })
    .then((res) => res)
    .catch((err) => err);
};
// Code By Purnendu
export const sendProperty = (obj) => {
  let token = "Bearer " + getToken();
  return myAxios.post(`/user/sendproperty`, obj, {
    headers: { authorization: token },
  });
};

// Code By Purnendu
export const getproperty = (user) => {
  let token = "Bearer " + getToken();
  return myAxios.post(`/user/getproperty`, user, {
    headers: { authorization: token },
  });
};

export const getAllSharedPropety = (token, userId) => {
  return myAxios
    .get("/common/sharedPropertyUserId/" + userId, {
      headers: { authorization: token },
    })
    .then((response) => response.data);
};

// Code By purnendu
export const deleteProperty = (id) => {
  let token = "Bearer " + getToken();
  return myAxios.delete(`/user/deleteproperty/${id}`, {
    headers: { authorization: token },
  });
};

// Code By Purnendu
export const initiateProperty = (property) => {
  let token = "Bearer " + getToken();
  return myAxios.put(`/user/initiatebytrustee`, property, {
    headers: { authorization: token },
  });
};

// send benificiary form data
export const sendFormdata = (data, propertyid) => {
  let token = "Bearer " + getToken();
  return myAxios.post(`/user/sendformdata/${propertyid}`, data, {
    headers: { authorization: token },
  });
};

// get benificiary form data
export const getFormdata = (property) => {
  let token = "Bearer " + getToken();
  return myAxios.post(`/user/getbenificiarydetails`, property, {
    headers: { authorization: token },
  });
};

// View Details By Trustee
export const viewDetails = (property) => {
  let token = "Bearer " + getToken();
  return myAxios.put(`/user/viewdetails`, property, {
    headers: { authorization: token },
  });
};

export const viewDetailsfalse = (property) => {
  let token = "Bearer " + getToken();
  return myAxios.put(`/user/viewdetailsfalse`, property, {
    headers: { authorization: token },
  });
};

export const viewDetailsFalseByUser = (property) => {
  let token = "Bearer " + getToken();
  return myAxios.put(`/user/viewDetailsFalseByUser`, property, {
    headers: { authorization: token },
  });
};

export const aproveByTrustee = (property) => {
  let token = "Bearer " + getToken();
  return myAxios.put(`/user/aprovebytrustee`, property, {
    headers: { authorization: token },
  });
};

export const aproveByUser = (property) => {
  let token = "Bearer " + getToken();
  return myAxios.put(`/user/aprovebyuser`, property, {
    headers: { authorization: token },
  });
};

export const pdfGenerate = (property) => {
  let token = "Bearer " + getToken();

  return myAxios.post(`/user/createPdf`, property, {
    responseType: "blob",
    headers: { authorization: token },
  });
};

export const downloadDocument = (service, fileName, fileNumber) => {
  let token = "Bearer " + getToken();
  return myAxios.get(
    `/` + service + `/download/` + fileName + `/${fileNumber}`,
    { responseType: "blob", headers: { authorization: token } }
  );
};
export const downloadTaxDocument = (service, newFile) => {
  let token = "Bearer " + getToken();
  return myAxios.get(`/` + service + `/download/tax/` + newFile, {
    responseType: "blob",
    headers: { authorization: token },
  });
};

// localStorage.setItem("id", "some-value");
// let field;
// if (localStorage.getItem("id")) {
//   filed = localStorage.getItem("id");
// } else {
//   filed = "default-value";
// }
// const filed = localStorage.getItem("id") || "default-value";

// export const getUserRole = () => {
//     let userRole = this.getUser();
//     return userRole.role;
// };

// const res = await axios.get('https://httpbin.org/get', {
//   headers: {
//     authorization: 'my secret token'
//   }
// });
// export const bankDetails = (banks , token ) =>{
//     return myAxios.get("/banks/", banks , {headers:{authorization: token}}).then((response) => response.data);
// };
//  export const credentialDetails = (credentials) => {
//     return myAxios.get("/credentials/",credentials,{headers:{authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBLksuU2luZ2giLCJleHAiOjE2NzU2MjQzODMsImlhdCI6MTY3NTU4ODM4M30.4BN8g5eXs4TtudQEHmk2nQFTFxiAtq0vU97lEKZE15M'}}).then((response) => response.data);

// };
