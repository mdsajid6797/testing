import React from 'react';
import BeneficiryBase from '../../components/beneficiary/BeneficiaryBase';
import TrusteeBase from '../../components/trustee/TrusteeBase';
import UserBase from '../../components/user/UserBase';
import { getUser } from '../../services/user-service';
import { WritingcenterDiaryPopup } from './WritingcenterDiaryPopup';


function Writingcenterdiaryroute() {
    let role = getUser().role;
    if (role === "BENEFICIARY") {
        console.log("role : " + role);
        return (
            <BeneficiryBase>
                <WritingcenterDiaryPopup />
            </BeneficiryBase>
        )
    }
    else if (role === "USER") {
        return (
            <UserBase>
                <WritingcenterDiaryPopup />
            </UserBase>
        )
    }
    else if (role === "TRUSTEE") {
        return (
            <TrusteeBase>
                <WritingcenterDiaryPopup />
            </TrusteeBase>
        )
    }
}
export default Writingcenterdiaryroute;