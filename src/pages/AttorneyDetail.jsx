import React, { useState } from "react";
import { toast } from "react-toastify";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Container,
//   Form,
//   FormFeedback,
//   FormGroup,
//   Input,
//   Label,
// } from "reactstrap";
import "../css/BeneficiarySignup.css";
import { sendEmailWithAttachment } from "../services/user-service";
// import {getUser} from "../../services/user-service";
import { getToken, getUser } from "../services/user-service";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardHeader, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import "./../css/inventoryReport.css";

// set signup data
const AttorneyDetail = ({ handleBack, pdfDataUri }) => {
  const userDetails = getUser();

  const [data, setData] = useState({
    name: "",
    email: "",
  });

  const [emailDetail] = useState({
    to: "",
    subject: "",
    message: "",
  });

  // const [error, setError] = useState({
  //   errors: {},
  //   isError: false,
  // });

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };

  // reseting the form
  // const resetData = () => {
  //   setData({
  //     name: "",
  //     email: "",
  //   });
  // };

  // submit the form
  const submitForm = (event) => {
    event.preventDefault();
    emailDetail.to = data.email;
    emailDetail.message = `
Dear ${data.name},

I hope this email finds you well. please find the inventory report for your review. If you have any questions or require further clarification, please don't hesitate to reach out.

Also, please use this username ${userDetails.username} to create your account.

For creating your account, please click here http://localhost:3000/attorney-registration.

Best regards,
I-Chest
`;

    emailDetail.subject = "INVENTORY REPORT";

    const token = "Bearer " + getToken();

    // Convert data URI to blob
    const byteCharacters = atob(pdfDataUri.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

    // Create form data
    const formData = new FormData();

    formData.append("pdfFile", pdfBlob, "inventory-report.pdf");
    formData.append("emailDetails", JSON.stringify(emailDetail));
    // Add other necessary email details here

    // Send email data to the server
    sendEmailWithAttachment(token, formData)
      .then((resp) => {
        handleBack();
        toast.success(`Email has sent to ${data.name}`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      })
      .catch((error) => {
        toast.error("Email has not sent", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  return (
    <div>
      <div>
        <Card>
          <CardContent>
            <div className="cross_button">
              <button className="cross_button_main" onClick={handleBack}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <CardHeader
              title={
                <Typography
                  variant="h5"
                  style={{ textAlign: "center", marginTop: "-10px" }}
                >
                  Attorney Details
                </Typography>
              }
            />
            <form onSubmit={submitForm}>
              <TextField
                id="attorney-name"
                label="Name"
                value={data.name}
                onChange={(e) => handleChanges(e, "name")}
                fullWidth
                margin="normal"
              />
              <TextField
                id="attorney-email"
                label="Email"
                value={data.email}
                onChange={(e) => handleChanges(e, "email")}
                fullWidth
                margin="normal"
              />
              <div className="submit_button">
                <button type="submit">Send mail</button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttorneyDetail;
