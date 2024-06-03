import React from 'react';
import BeneficiryBase from '../../components/beneficiary/BeneficiaryBase';
import SideBar from '../../components/sidebar/Sidebar';
import TrusteeBase from '../../components/trustee/TrusteeBase';
import UserBase from '../../components/user/UserBase';
import { getUser } from '../../services/user-service';
import RealEstateContent from './RealEstateContent';
import TrusteeRealEstateContent from './TrusteeRealestateContent';
import { useEffect } from 'react';
import { useState } from 'react';

function Realestate() {
  // page opening  animation 
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  let role = getUser().role;
  if (role === "BENEFICIARY") {
    return (
      <BeneficiryBase>
        <div className="mt-5">
        </div>
        <SideBar>
          {/* <RealEstateContent/> */}
        </SideBar>
      </BeneficiryBase>
    )
  }
  else if (role === "USER") {
    
    return (
      <div className={`your-component ${show ? "fade-in-element" : ""}`}>
        <UserBase>
          <div className="mt-5">
          </div>
          <SideBar>
            <RealEstateContent />
          </SideBar>
        </UserBase>
      </div>
    )
  }
  else if (role === "TRUSTEE") {
    return (
      <TrusteeBase>
        <div className="mt-5">
        </div>
        <SideBar>
          <TrusteeRealEstateContent />
        </SideBar>
      </TrusteeBase>
    )
  }
}
export default Realestate;