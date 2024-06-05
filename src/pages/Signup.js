import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
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
  Label,
} from "reactstrap";
import validator from "validator";
import { sendOtp, signup } from "../services/user-service";
import { EmailTemplatePostfix, Emailtemplate } from "./Emailtemplate";
import Otppage from "./Otppage";
import "./SignupPage.css";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// set signup data
const Signup = ({ onBack }) => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    currentAddress: "",
    dob: "",
    phoneNo: "",
    role: "USER",
    jointAccount: false,
    accountType: "normal",
  });

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const [passwordvalidation, setPasswordvalidation] = useState(false);

  const handleChanges = (event, property) => {
    let value = event.target.value;
    if (property === "password") {
      validate(value);
    }
    setData({ ...data, [property]: value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // reseting the form
  // const resetData = () => {
  //   setData({
  //     firstName: "",
  //     lastName: "",
  //     username: "",
  //     email: "",
  //     password: "",
  //     currentAddress: "",
  //     dob: "",
  //     phoneNo: "",
  //     role: "",
  //   });
  // };

  const [validmail, setValidmail] = useState(false);
  const [usermail, setUsermail] = useState("");
  // const navigate = useNavigate();

  // submit the form
  const submitForm = (event) => {
    event.preventDefault();

    if (error.isError) {
      toast.error("Form data is invalid, correct all detais then submit.");
      return;
    }
    if (!passwordvalidation) {
      toast.error(
        "Only alphanumeric inputs are accepted in the password field and Minimum 10 characters"
      );
      return;
    }

    // data validate

    // call server api for sending data
    signup(data)
      .then((resp) => {
        setUsermail(resp.email);
        sendOtp({
          to: resp.email,
          subject: "Test Api",
          message: Emailtemplate,
          postfixMessage: EmailTemplatePostfix,
        })
          .then((res) => {
            setValidmail(true);
            toast.success("otp has been sent in your email");
          })
          .catch((err) => {
            toast.error("Mail is not correct");

            return;
          });
      })
      .catch((error) => {
        // handle error
        setError({
          errors: error,
          isError: true,
        });
      });
    // toast.success("User is registerd succesfully !!");
  };

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

  const handleFlagValueReceived = (flagValue) => {
    setValidmail(flagValue);
  };

  let signIn = "register";

  return (
    <>
      {validmail ? (
        <Otppage
          usermail={usermail}
          onFlagReceived={handleFlagValueReceived}
          otpType={signIn}
        />
      ) : (
        <>
          <div className="login-popup page">
            <div className="signup">
              <Card className="regcard">
                <CardHeader
                  className="cardheading"
                  style={{ borderRadius: "0px" }}
                >
                  <h3 className="heading">Register</h3>
                </CardHeader>
                <CardBody className="cardbody">
                  <Form onSubmit={submitForm} className="form_body">
                    <FormGroup className="textfield">
                      <Label className="headingname" for="firstName">
                        First Name
                      </Label>
                      <span style={{ color: "red" }}>*</span>
                      <Input
                        className="inputfiled"
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
                        className="inputfiled"
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
                        className="inputfiled"
                        type="text"
                        placeholder="Enter your username "
                        id="username"
                        onChange={(e) => handleChanges(e, "username")}
                        value={data.username}
                      />
                    </FormGroup>

                    {/* For date of birth field */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FormGroup
                        className="textfield"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <Label className="headingname">
                          Date Of Birth <span style={{ color: "red" }}>*</span>
                        </Label>

                        <DatePicker
                          className="inputfiled1"
                          id="dob"
                          // value={this.state.selectedDate}
                          // onChange={this.handleDateChange}
                        />
                      </FormGroup>
                    </LocalizationProvider>

                    <FormGroup className="textfield">
                      <Label className="headingname" for="birthPlace">
                        Birth Place
                      </Label>
                      <span style={{ color: "red" }}>*</span>
                      <Input
                        className="inputfiled"
                        type="text"
                        placeholder="Enter your birth place "
                        id="birthPlace"
                        onChange={(e) => handleChanges(e, "currentAddress")}
                        value={data.currentAddress}
                      />
                    </FormGroup>

                    <FormGroup className="textfield">
                      <Label className="headingname" for="phoneNo">
                        Phone Number
                      </Label>
                      <span style={{ color: "red" }}>*</span>
                      <Input
                        className="inputfiled"
                        type="text"
                        placeholder="Enter your phone number "
                        id="phoneNo"
                        onChange={(e) => handleChanges(e, "phoneNo")}
                        value={data.phoneNo}
                      />
                    </FormGroup>

                    {/* For email field */}
                    <FormGroup className="textfield">
                      <Label className="headingname" for="email">
                        Email
                      </Label>
                      <span style={{ color: "red" }}>*</span>
                      <Input
                        className="inputfiled"
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        onChange={(e) => handleChanges(e, "email")}
                        value={data.email}
                      />
                    </FormGroup>

                    {/* For Password field */}
                    {/* <FormGroup className="textfield">
                      <Label className="headingname" for="password">
                        Password
                      </Label>

                      <Input
                        className="inputfiled"
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        onChange={(e) => handleChanges(e, "password")}
                        value={data.password}
                        valid={passwordvalidation}
                        invalid={!passwordvalidation}
                        autoComplete="new-password"
                      />
                    </FormGroup> */}

                    <FormGroup className="textfield">
                      <Label className="headingname" for="password">
                        Password
                      </Label>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: "100%",
                        }}
                      >
                        <Input
                          className="inputfiled"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          id="password"
                          onChange={(e) => handleChanges(e, "password")}
                          value={data.password}
                          autoComplete="new-password"
                          style={{ paddingRight: "40px" }}
                        />
                        <Button
                          onClick={togglePasswordVisibility}
                          color="secondary"
                          style={{
                            position: "absolute",
                            top: "52%",
                            right: "5px",
                            transform: "translateY(-50%)",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            style={{ fontSize: "1.2em", color: "black" }}
                          />
                        </Button>
                      </div>
                    </FormGroup>

                    {/* <FormGroup className="textfield">
                      <Label className="headingname" for="role">
                        Role
                      </Label>
                      <span style={{ color: "red" }}>*</span>
                      <Input
                        className="inputfiled"
                        type="select"
                        name="role"
                        id="role"
                        onChange={(e) => handleChanges(e, "role")}
                        value={data.role}
                      >
                        <option value="" disabled hidden selected>
                          Choose Role
                        </option>
                        <option>USER</option>
                      </Input>
                    </FormGroup> */}

                    {/* For About field */}
                    {/* <FormGroup>
                      <Label for="about">About</Label>
                      <Input
                        type="textarea"
                        placeholder="Enter here"
                        id="about"
                        style={{ height: "75px" }}
                        onChange={(e) => handleChanges(e, "about")}
                        value={data.about}
                      />
                    </FormGroup> */}

                    <Container className="loginbuttonspace">
                      <Button
                        className="cler-button"
                        onClick={onBack}
                        color="warning"
                        outline
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button className="login-button" color="success" outline>
                        Register
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Signup;
