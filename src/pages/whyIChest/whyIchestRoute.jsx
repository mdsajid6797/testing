import React from "react";
import { getUser } from "../../services/user-service";
import UserBase from "../../components/user/UserBase";
import BeneficiryBase from "../../components/beneficiary/BeneficiaryBase";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import WhyIchest from "../../pages/whyIChest/whyIChest";
function WhyIchestRoute() {
  let role = getUser().role;
  if (role === "USER") {
    return (
      <UserBase>
        <WhyIchest/>
      </UserBase>
    );
  } else if (role === "BENEFICIARY") {
    return (
      <BeneficiryBase>
        <WhyIchest/>
      </BeneficiryBase>
    );
  } else if (role === "TRUSTEE") {
    return (
      <TrusteeBase>
        <WhyIchest/>
      </TrusteeBase>
    );
  }
}
export default WhyIchestRoute;
