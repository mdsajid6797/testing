import React from "react";
import BeneficiaryNavbar from "./BeneficiaryNavbar";

const BeneficiryBase=({title="Welcome to our website",children})=>{
    return(

        <div className="container-fluid p-0 m-0">
            <BeneficiaryNavbar />

            {children}
            

        
        </div>

    )
}
export default BeneficiryBase;