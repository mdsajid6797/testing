import React from "react";
import TrusteeNavbar from "./TrusteeNavbar";

const TrusteeBase=({title="Welcome to our website",children})=>{
    return(

        <div className="container-fluid p-0 m-0">
            <TrusteeNavbar />

            {children}

        
        </div>

    )
}
export default TrusteeBase;