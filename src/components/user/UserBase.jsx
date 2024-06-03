import React from "react";
import UserNavbar from "./UserNavbar";

const UserBase=({title="Welcome to our website",children})=>{
    return(

        <div className="container-fluid p-0 m-0">
            <UserNavbar />

            {children}

        
        </div>

    )
}
export default UserBase;