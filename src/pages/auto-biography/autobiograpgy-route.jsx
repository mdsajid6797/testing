import React from 'react';
import BeneficiryBase from '../../components/beneficiary/BeneficiaryBase';
import SideBar from '../../components/sidebar/Sidebar';
import TrusteeBase from '../../components/trustee/TrusteeBase';
import UserBase from '../../components/user/UserBase';
import { getUser } from '../../services/user-service';

import Autobiography from './autobiography';

function AutobiographyRoute() {
    let role = getUser().role;
    if (role === "BENEFICIARY") {

        return (
            <BeneficiryBase>
                <div className="mt-5">
                </div>
                <SideBar>
                    <Autobiography />
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
                    <Autobiography />
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
                    <Autobiography />
                </SideBar>
            </TrusteeBase>
        )
    }
}
export default AutobiographyRoute;