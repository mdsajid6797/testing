// import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import TrusteeBanks from "./pages/my-estate/TrusteeBanks";

import { ToastContainer } from "react-toastify";
import {
  Beneficiryroute,
  Trusteeroute,
  Userroute,
} from "./components/Privateroute";
import Beneficirydashboard from "./pages/beneficiry-route/Beneficirydashboard";
import Credentials from "./pages/credential/Credentials";
import Banks from "./pages/my-estate/Banks";
import Crypto from "./pages/my-estate/Crypto";
import Income from "./pages/my-estate/Income";
import Investments from "./pages/my-estate/Investments";
import Jewelry from "./pages/my-estate/Jewelry";
import LifeInsurance from "./pages/my-estate/LifeInsurance";
import Realestate from "./pages/my-estate/RealEstate";
import Vehicles from "./pages/my-estate/Vehicles";
import Trusteedasboard from "./pages/trustee-route/Trusteedashboard";
import Userdashboard from "./pages/user-route/Userdashboard";
//import CreaditCards from "./pages/liabilities/CreaditCards"
import privateaxios from "axios";
import { useEffect, useState } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import TrusteeApproval from "./pages/TrusteeApproval";
import BankLoan from "./pages/liabilities/BankLoan";
import CreditCards from "./pages/liabilities/CreditCards";
import LineOfCredit from "./pages/liabilities/LineOfCredit";
import Mortgage from "./pages/liabilities/Mortgage";
import PersonalLoan from "./pages/liabilities/PersonalLoan";
import TrusteeCredentials from "./pages/my-estate/TrusteeCredentials";
import TrusteeCrypto from "./pages/my-estate/TrusteeCrypto";
import TrusteeIncome from "./pages/my-estate/TrusteeIncome";
import TrusteeInvestments from "./pages/my-estate/TrusteeInvestment";
import TrusteeJewelry from "./pages/my-estate/TrusteeJewelry";
import TrusteeLifeInsurance from "./pages/my-estate/TrusteeLifeInsurance";
import TrusteeVehicles from "./pages/my-estate/TrusteeVehicles";
// import Toastifyforcheck from "./pages/Toastifyforcheck";
import IdleTimeComponent from "./components/IdleTimeComponent";
import Userprofileedit from "./components/editprofile/Userprofileedit";
import { Diarypopup, EditDiaryPopup } from "./components/popup/diarypopup";
import AddTrustee from "./pages/AddTrustee";
import Benificiarydetailsbyuser from "./pages/Benificiarydetailsbyuser";
import Home from "./pages/Home";
import {
  EditInternationalAssest,
  EditInternationalAssestBank,
  EditInternationalAssestRealEstate,
  EditInternationalAssetCrypto,
  EditInternationalAssetIncome,
  EditInternationalAssetInsurance,
  EditInternationalAssetInvestment,
  EditInternationalAssetJewelry,
  EditInternationalAssetOtherAssets,
  EditInternationalAssetVehicle,
} from "./pages/InternationalAssets/EditInternationalAssest";
import { InternationalAssets } from "./pages/InternationalAssets/International_assets";
import Otppage from "./pages/Otppage";
import PageNotFound from "./pages/PageNotFound";
import Shareproperty from "./pages/Shareproperty";
import AutobiographyRoute from "./pages/auto-biography/autobiograpgy-route";
import Beneficiryform from "./pages/beneficiry-route/Beneficiryform";
import EditCredential from "./pages/my-estate/edit-my-estate/EditCredential";
import EditCrypto from "./pages/my-estate/edit-my-estate/EditCrypto";
import EditIncome from "./pages/my-estate/edit-my-estate/EditIncome";
import EditInvestment from "./pages/my-estate/edit-my-estate/EditInvestment";
import EditJewelry from "./pages/my-estate/edit-my-estate/EditJewelry";
import EditLifeInsurance from "./pages/my-estate/edit-my-estate/EditLifeInsurance";
import EditRealestate from "./pages/my-estate/edit-my-estate/EditRealestate";
import EditVehical from "./pages/my-estate/edit-my-estate/EditVehical";
import Editbanks from "./pages/my-estate/edit-my-estate/Editbanks";
import EditOtherAssets from "./pages/my-estate/edit-my-estate/editOtherAssets";
import OtherAssets from "./pages/my-estate/otherAssets";
import Profile from "./pages/profile-route";
import Benificiarydetails from "./pages/trustee-route/Benificiarydetails";
import WhyIchestRoute from "./pages/whyIChest/whyIchestRoute";
import Writingcenterdiaryroute from "./pages/writing-center/WritingCenterDiary-route";
import Writingroute from "./pages/writing-center/writing-route";
import { InternationalAsset1 } from "./pages/InternationalAssets/InternationaAsset1";
import {
  InternationalAssetBank,
  InternationalAssetCrypto,
  InternationalAssetIncome,
  InternationalAssetInsurance,
  InternationalAssetInvestment,
  InternationalAssetJewelry,
  InternationalAssetOtherAssets,
  InternationalAssetRealEstate,
  InternationalAssetVehicles,
} from "./pages/InternationalAssets/InternationalAssetPopup";
import { SharedProperty } from "./pages/SharedProperty";
import AttorneySignUp from "./pages/AttorneySignUp";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   privateaxios.interceptors.request.use(
  //     (config) => {
  //       setLoading(true);
  //       return config;
  //     },
  //     (error) => {
  //       setLoading(false);
  //       return Promise.reject(error);
  //     }
  //   );

  //   privateaxios.interceptors.response.use(
  //     (response) => {
  //       setLoading(false);
  //       return response;
  //     },
  //     (error) => {
  //       setLoading(false);
  //       return Promise.reject(error);
  //     }
  //   );
  // }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <IdleTimeComponent />
        {/* <Loading show={loading} /> */}
        <ToastContainer position="bottom-center" />

        {/* <SideBar> */}

        {/* something */}
        <Routes>
          <Route path="/" element={<Home />} />

          {/* <Route path="/loading" element={<Loading />} /> */}
          <Route path="/attorney-registration" element={<AttorneySignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/otp" element={<Otppage />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/BeneficiarySignup" element={<BeneficiarySignup/>}/> */}
          <Route path="/reset-password" element={<TrusteeApproval />} />

          <Route path="/benificiarydetails" element={<Benificiarydetails />} />
          <Route
            path="/benificiarydetailsbyuser"
            element={<Benificiarydetailsbyuser />}
          />
          {/* <SideBar > */}

          <Route path="/user" element={<PrivateRoute element={Userroute} />}>
            <Route path="dashboard" element={<Userdashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-estate/real-estate" element={<Realestate />} />
            <Route path="my-estate/banks" element={<Banks />} />
            <Route path="my-estate/investments" element={<Investments />} />
            <Route path="credential/credentials" element={<Credentials />} />
            <Route path="my-estate/crypto" element={<Crypto />} />
            <Route path="my-estate/jewelry" element={<Jewelry />} />
            <Route path="my-estate/insurances" element={<LifeInsurance />} />
            <Route path="my-estate/vehicles" element={<Vehicles />} />
            <Route path="my-estate/income" element={<Income />} />
            <Route path="my-estate/other-assests" element={<OtherAssets />} />
            <Route path="liabilities/credit-card" element={<CreditCards />} />
            <Route path="liabilities/loan" element={<BankLoan />} />
            <Route path="liabilities/mortgage" element={<Mortgage />} />
            <Route path="liabilities/lcredit" element={<LineOfCredit />} />
            <Route path="liabilities/ploan" element={<PersonalLoan />} />
            <Route path="writing-center" element={<Writingroute />} />
            <Route
              path="auto-biography/autobiography"
              element={<AutobiographyRoute />}
            />
            {/* For Update property */}
            <Route
              path="my-estate/real-estate/:id"
              element={<EditRealestate />}
            />
            <Route path="my-estate/banks/:id" exact element={<Editbanks />} />
            <Route
              path="my-estate/investment/:id"
              exact
              element={<EditInvestment />}
            />
            <Route path="my-estate/crypto/:id" element={<EditCrypto />} />
            <Route path="my-estate/jewelry/:id" element={<EditJewelry />} />
            <Route
              path="my-estate/insurances/:id"
              element={<EditLifeInsurance />}
            />
            <Route path="my-estate/vehicles/:id" element={<EditVehical />} />
            <Route
              path="my-estate/credentials/:credentials_Id"
              element={<EditCredential />}
            />
            <Route path="my-estate/income/:id" element={<EditIncome />} />
            {/* <Route path="my-estate/International_assets/:assest_id" element={<EditInternationalAssest />} /> */}
            <Route
              path="my-estate/otherAsset/:id"
              element={<EditOtherAssets />}
            />
            {/* <Route path="shareproperty" element={<Shareproperty />} /> */}
            <Route path="shareproperty" element={<SharedProperty />} />
            <Route path="add-trustee" element={<AddTrustee />} />
            <Route path="profile/edit" element={<Userprofileedit />} />
            <Route path="writing-center/:book_id" element={<Diarypopup />} />
            <Route
              path="writing-center/book/:books_id/"
              element={<Writingcenterdiaryroute />}
            />
            <Route
              path="writing-center/book-edit/:page_id/:books_id"
              element={<EditDiaryPopup />}
            />
            {/* <Route path="my-estate/International_assets" element={<InternationalAssets />} /> */}
            {/* Add internationalAsset */}
            <Route
              path="my-estate/International_assets"
              element={<InternationalAsset1 />}
            />
            <Route
              path="my-estate/International_assets/real-estate"
              element={<InternationalAssetRealEstate />}
            />
            <Route
              path="my-estate/International_assets/banks"
              element={<InternationalAssetBank />}
            />
            <Route
              path="my-estate/International_assets/investments"
              element={<InternationalAssetInvestment />}
            />
            <Route
              path="my-estate/International_assets/crypto"
              element={<InternationalAssetCrypto />}
            />
            <Route
              path="my-estate/International_assets/jewelry"
              element={<InternationalAssetJewelry />}
            />
            <Route
              path="my-estate/International_assets/insurances"
              element={<InternationalAssetInsurance />}
            />
            <Route
              path="my-estate/International_assets/vehicles"
              element={<InternationalAssetVehicles />}
            />
            <Route
              path="my-estate/International_assets/income"
              element={<InternationalAssetIncome />}
            />
            <Route
              path="my-estate/International_assets/other-assests"
              element={<InternationalAssetOtherAssets />}
            />
            {/* edit internationalAsset  */}
            <Route
              path="my-estate/International_assets/realEstate/:id"
              element={<EditInternationalAssestRealEstate />}
            />
            <Route
              path="my-estate/International_assets/bank/:id"
              element={<EditInternationalAssestBank />}
            />
            <Route
              path="my-estate/International_assets/investment/:id"
              element={<EditInternationalAssetInvestment />}
            />
            <Route
              path="my-estate/International_assets/otherAsset/:id"
              element={<EditInternationalAssetOtherAssets />}
            />
            <Route
              path="my-estate/International_assets/income/:id"
              element={<EditInternationalAssetIncome />}
            />
            <Route
              path="my-estate/International_assets/vehicle/:id"
              element={<EditInternationalAssetVehicle />}
            />
            <Route
              path="my-estate/International_assets/jewelry/:id"
              element={<EditInternationalAssetJewelry />}
            />
            <Route
              path="my-estate/International_assets/insurance/:id"
              element={<EditInternationalAssetInsurance />}
            />
            <Route
              path="my-estate/International_assets/crypto/:id"
              element={<EditInternationalAssetCrypto />}
            />

            <Route path="why-I-Chest" element={<WhyIchestRoute />} />
          </Route>

          <Route path="/trustee" element={<PrivateRoute element={Trusteeroute} />}>
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={<Trusteedasboard />} />
            <Route path="my-estate/banks" element={<TrusteeBanks />} />
            <Route path="my-estate/real-estate" element={<Realestate />} />
            <Route
              path="my-estate/investments"
              element={<TrusteeInvestments />}
            />
            <Route path="my-estate/crypto" element={<TrusteeCrypto />} />
            <Route path="my-estate/jewelry" element={<TrusteeJewelry />} />
            <Route
              path="my-estate/insurances"
              element={<TrusteeLifeInsurance />}
            />
            <Route path="my-estate/vehicles" element={<TrusteeVehicles />} />
            <Route
              path="my-estate/credentials"
              element={<TrusteeCredentials />}
            />
            <Route path="my-estate/income" element={<TrusteeIncome />} />
            <Route path="profile/edit" element={<Userprofileedit />} />
            <Route path="writing-center" element={<Writingroute />} />
            <Route path="writing-center/:book_id" element={<Diarypopup />} />
            <Route
              path="writing-center/book/:books_id/"
              element={<Writingcenterdiaryroute />}
            />
            <Route
              path="writing-center/book-edit/:page_id/:books_id"
              element={<EditDiaryPopup />}
            />
            <Route
              path="auto-biography/autobiography"
              element={<AutobiographyRoute />}
            />
            <Route path="why-I-Chest" element={<WhyIchestRoute />} />
          </Route>

          <Route path="/beneficiary" element={<Beneficiryroute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={<Beneficirydashboard />} />
            <Route path="my-estate/real-estate" element={<Realestate />} />
            <Route path="beneficiryform" element={<Beneficiryform />} />
            <Route path="profile/edit" element={<Userprofileedit />} />
            <Route path="writing-center" element={<Writingroute />} />
            <Route path="writing-center/:book_id" element={<Diarypopup />} />
            <Route
              path="writing-center/book/:books_id/"
              element={<Writingcenterdiaryroute />}
            />
            <Route
              path="writing-center/book-edit/:page_id/:books_id"
              element={<EditDiaryPopup />}
            />
            <Route
              path="auto-biography/autobiography"
              element={<AutobiographyRoute />}
            />
            <Route path="why-I-Chest" element={<WhyIchestRoute />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
