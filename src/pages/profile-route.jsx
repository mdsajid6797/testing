import React from "react";
import Userprofile from "./user-route/Userprofile";
import UserBase from "../components/user/UserBase";
import TrusteeBase from "../components/trustee/TrusteeBase";
import { getUser } from "../services/user-service";
import BeneficiryBase from "../components/beneficiary/BeneficiaryBase";

function Profile() {
  let role = getUser().role;
  if (role === "USER") {
    return (
      <UserBase>
        <Userprofile/>
      </UserBase>
    );
  } else if (role === "BENEFICIARY") {
    return (
      <BeneficiryBase>
        <Userprofile/>
      </BeneficiryBase>
    );
  } else if (role === "TRUSTEE") {
    return (
      <TrusteeBase>
        <Userprofile/>
      </TrusteeBase>
    );
  }
}
export default Profile;
