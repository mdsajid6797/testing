import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { doLogout, getUser, isLoggedIn } from "../services/user-service";

export const Userroute = () => {
    return getUser().role=="USER" ? <Outlet /> : <Navigate to={"/"} />
};

export const Trusteeroute = () => {

    return getUser().role=="TRUSTEE" ? <Outlet /> : <Navigate to={"/"} />
};

export const Beneficiryroute = () => {

    return getUser().role=="BENEFICIARY" ? <Outlet /> : <Navigate to={"/"} />
};