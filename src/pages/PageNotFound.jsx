import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./../css/PageNotFound.css";
import { doLogout } from "../services/user-service";
const PageNotFound = () => {
  useEffect(() => {
    doLogout();
  });
  return (
    <div className="page_not_found">
      <div className="page_not_found_main">
        <div className="page_not_found_gif">
          {/* <img src="img/page_not_found.gif" alt="404" /> */}
        </div>
        <div className="page_not_found_content">
          <h3>OOPS!</h3>
          <h4
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              marginBottom: "10px",
            }}
          >
            This page doesn't exist...
          </h4>
          <h4>
            {" "}
            Please check that the URL you entered is correct, or click the
            button below to return to the homepage.
          </h4>
          <Link className="page_not_found_back_home" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
