import React from "react";
import "./../css/AddTrustee.css";
import UserBase from "../components/user/UserBase";
import { Link } from "react-router-dom";
function AddTrustee() {
  return (
    <div className="add_trustee_list">
      <div className="add_trustee_details">
        <img src="./../img/avtar.jpg" alt="Trustee_profile_pic" />
        <div className="add_trustee_name_email">
          <ul className="add_trustee_name">
            <li className="add_trustee_name_line">Name: </li>
            <li>Dummy name </li>
          </ul>
          <ul className="add_trustee_email">
            <li className="add_trustee_email_line">Email: </li>
            <li>dummyemail@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="add_trustee_btn">
        <Link className="add_trustee_details_btn" to="#">
          Details
        </Link>
        <Link className="add_trustee_Add" to="#">
          Add Trustee
        </Link>
      </div>
    </div>
  );
}
function AddTrusteesLoop() {
  const trustees = Array.from({ length: 10 }, (_, index) => (
    <AddTrustee key={index} />
  ));

  return (
    <UserBase>
      <div className="add_trustee_base">
        <div className="add_trustee_main">
          <>{trustees}</>;
        </div>
      </div>
    </UserBase>
  );
}

export default AddTrusteesLoop;
