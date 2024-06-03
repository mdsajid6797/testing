import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import "../css/BeneficiarySignup.css";
import { signup } from "../services/user-service";
// import {getUser} from "../../services/user-service";
import validator from "validator";
import { getToken, getUser, sendemail } from "../services/user-service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// set signup data
const BeneficiarySignup = ({ handleBack }) => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "BENEFICIARY",
    firstlevelapproval: "",
    userid: "",
  });

  const [email, setemail] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });
  const [passwordvalidation, setPasswordvalidation] = useState(false);
  const validate = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 10,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      setPasswordvalidation(true);
    } else {
      setPasswordvalidation(false);
    }
  };

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
    if (property === "password") {
      validate(event.target.value);
    }
  };

  // reseting the form
  const resetData = () => {
    setData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      role: "",
      firstlevelapproval: "",
      userid: "",
    });
  };

  // submit the form
  const submitForm = (event) => {
    event.preventDefault();
    email.to = data.email;
    email.message =
      "Username: " +
      data.username +
      " and use this link for reset your password: http://i-chest.com:1111/reset-password";
    email.subject = "Reset Password";
    if (!passwordvalidation) {
      toast.error(
        "Only alphanumeric with minimum 10 charecter (Eg- Ichest@123)"
      );

      return;
    }
    data.userid = getUser().id;

    if (error.isError) {
      toast.error("Form data is invalid, correct all detais then submit.");
      return;
    }

    const token = "Bearer " + getToken();

    sendemail(token, email)
      .then((resp) => {
        signup(data)
          .then((res) => {
   
            toast.success("Email has been sent", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            resetData();
            handleBack();
          })
          .catch((err) => {
            
          });
      })
      .catch((error) => {
       
        toast.success("Email has not sent", {
          position: toast.POSITION.BOTTOM_CENTER,
        });

      });
  };
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
  return (
    <div className="login-popup ">
      <div className="beneficiary_signup">
        <Card className="logincard1">
          <CardHeader className="card-header1" style={{ borderRadius: "0px" }}>
            <h3 className="heading1">create beneficiary</h3>
          </CardHeader>
          <CardBody>
            <Form onSubmit={submitForm}>
              {/* For first name field */}
              <FormGroup className="login-card-details1">
                <Label className="headingname1" for="firstName">
                  First Name
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  required
                  className="inputfiled1"
                  type="text"
                  placeholder="Enter your first name "
                  id="firstName"
                  onChange={(e) => handleChanges(e, "firstName")}
                  value={data.firstName}
                  invalid={
                    error.errors?.response?.data?.firstName ? true : false
                  }
                />
                <FormFeedback>
                  {error.errors?.response?.data?.firstName}
                </FormFeedback>
              </FormGroup>

              {/* For last name field */}
              <FormGroup className="textfield">
                <Label className="headingname" for="lastName">
                  Last Name
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  required
                  className="inputfiled1"
                  type="text"
                  placeholder="Enter your last name "
                  id="lastName"
                  onChange={(e) => handleChanges(e, "lastName")}
                  value={data.lastName}
                />
              </FormGroup>

              {/* For username name field */}
              <FormGroup className="textfield">
                <Label className="headingname" for="username">
                  Username
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  required
                  className="inputfiled1"
                  type="text"
                  placeholder="Enter your username "
                  id="username"
                  onChange={(e) => handleChanges(e, "username")}
                  value={data.username}
                />
              </FormGroup>

              {/* For SOCIAL SECUIRITY NUMBER field */}
              <FormGroup className="textfield">
                <Label className="headingname" for="social-secuirity-number">
                  Social Secuirity Number
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  // required
                  className="inputfiled1"
                  type="text"
                  placeholder="Enter social secuirity number "
                  id="social-secuirity-number"
                  // onChange={(e) => handleChanges(e, "username")}
                  // value={data.username}
                />
              </FormGroup>

              {/* For date of birth field */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormGroup className="textfield" style={{display: 'flex', flexDirection: 'column'}}>
                  <Label className="headingname" for="dob">
                    Date Of Birth <span style={{ color: "red" }}>*</span>
                  </Label>
                  
                  <DatePicker
                    // required
                    className="inputfiled1"
                    id="dob"
                    // value={this.state.selectedDate}
                    // onChange={this.handleDateChange}
                  />
                </FormGroup>
              </LocalizationProvider>

              {/* For birth place field */}
              <FormGroup className="textfield">
                <Label className="headingname" for="birth-place">
                  Birth Place
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  // required
                  className="inputfiled1"
                  type="text"
                  placeholder="Enter birth place"
                  id="birth-place"
                  // onChange={(e) => handleChanges(e, "username")}
                  // value={data.username}
                />
              </FormGroup>

              {/* For current address field */}
              <FormGroup className="textfield">
                <Label className="headingname" for="current-address">
                  Current Address
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  // required
                  className="inputfiled1"
                  type="text"
                  placeholder="Enter current address"
                  id="current-address"
                  // onChange={(e) => handleChanges(e, "username")}
                  // value={data.username}
                />
              </FormGroup>

              {/* For email field */}
              <FormGroup className="textfield">
                <Label className="headingname" for="email">
                  Email
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  required
                  className="inputfiled1"
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  onChange={(e) => handleChanges(e, "email")}
                  value={data.email}
                />
              </FormGroup>

              {/* For Password field */}
              <FormGroup className="textfield">
                <Label className="headingname" for="password">
                  Password
                </Label>
                <Input
                  className="inputfiled1"
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  onChange={(e) => handleChanges(e, "password")}
                  value={data.password}
                  valid={passwordvalidation}
                  invalid={!passwordvalidation}
                  autoComplete="new-password"
                />
              </FormGroup>

              {/* <FormGroup className="textfield">
                <Label className="headingname" for="role">
                  Role
                </Label>
                <span style={{ color: "red" }}>*</span>
                <Input
                  required
                  className="inputfiled1"
                  type="select"
                  name="role"
                  id="role"
                  onChange={(e) => handleChanges(e, "role")}
                  value={data.role}
                >
                  <option value="" disabled hidden selected>
                    Choose Role
                  </option>
                  <option>BENEFICIARY</option>
                </Input>
              </FormGroup> */}

              <Container className="loginbuttonspace1">
                <Button
                  className="cler-button1"
                  // onClick={handleReset}
                  onClick={handleBack}
                  outline
                  type="reset"
                >
                  Cancel
                </Button>

                <Button className="login-button1" color="success" outline>
                  Add
                </Button>
              </Container>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BeneficiarySignup;
