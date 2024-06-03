import React from 'react';
import BeneficiryBase from '../../components/beneficiary/BeneficiaryBase';
import SideBar from '../../components/sidebar/Sidebar';
import TrusteeBase from '../../components/trustee/TrusteeBase';
import UserBase from '../../components/user/UserBase';
import { getUser } from '../../services/user-service';
import Writingcenter from './Writing-center';


function Writingroute() {
    let role = getUser().role;
    if (role === "BENEFICIARY") {
        console.log("role : " + role);
        return (
            <BeneficiryBase>
                <div className="mt-5">
                </div>
                <SideBar>
                    <Writingcenter />
                </SideBar>
            </BeneficiryBase>
        )
    }
    else if (role === "USER") {
        return (
            <UserBase>
                <div className="mt-5">
                </div>
                <SideBar>
                    <Writingcenter/>
                </SideBar>
            </UserBase>
        )
    }
    else if (role === "TRUSTEE") {
        return (
            <TrusteeBase>
                <div className="mt-5">
                </div>
                <SideBar>
                    <Writingcenter />
                </SideBar>
            </TrusteeBase>
        )
    }
}
export default Writingroute;