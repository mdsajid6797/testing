import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import validator from "validator";
import { forgotPassword, getToken, trusteeApproval } from "../services/user-service";
import "./../css/resetpassword.css";

// set signup data
const TrusteeApproval = () => {
  const [passwordvalidation, setPasswordvalidation] = useState(false);
  const [confirmpasswordvalidation, setConfirmpasswordvalidation] =
    useState(false);

  const navigate = useNavigate();

  const [tempData, setTempData] = useState({
    username: "",
    password: "",
    cpassword: "",
  });

  const data = {
    username: "",
    password: "",
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
  const confirmvalidate = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 10,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      setConfirmpasswordvalidation(true);
    } else {
      setConfirmpasswordvalidation(false);
    }
  };

  const handleChanges = (event, property) => {
    setTempData({ ...tempData, [property]: event.target.value });
    if (property === "password") {
      validate(event.target.value);
    }
    if (property === "cpassword") {
      confirmvalidate(event.target.value);
    }
  };

  // reseting the form
  const resetData = () => {
    setTempData({
      username: "",
      password: "",
      cpassword: "",
    });
  };

  // submit the form
  const submitForm = (event) => {
    event.preventDefault();

    if (tempData.username === "") {
      toast.error("Please enter valid username", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    if (
      tempData.password !== tempData.cpassword ||
      tempData.password === "" ||
      tempData.cpassword === ""
    ) {
      toast.error("Password and Confirm Password must be same.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    if (!passwordvalidation) {
      toast.error(
        "Only alphanumeric inputs are accepted in the password field and Minimum 10 characters",
        { position: toast.POSITION.BOTTOM_CENTER }
      );
      return;
    }

    data.username = tempData.username;
    data.password = tempData.password;

    forgotPassword(data)
      .then((resp) => {
 
        toast.success("Password reset successfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/");
      })
      .catch((error) => {
        
      });
  };

  return (
    <>
      <div>
        <Container className="restepassword_container">
          <div className="restepassword_maincard">
            <Card >
              <CardHeader className="cardheading">
                <h3 className="heading">Reset your password</h3>
              </CardHeader>
              <CardBody className="resetpassword_cardbody">
                <Form onSubmit={submitForm}>
                  <FormGroup className="textfield">
                    <Label className="resetpassword_heading" for="username">
                      Username
                    </Label>
                    <Input
                      className="resetpassword_inputfiled"
                      type="text"
                      placeholder="Enter your username "
                      id="username"
                      onChange={(e) => handleChanges(e, "username")}
                      value={tempData.username}
                    />
                  </FormGroup>

                  {/* For New Password field */}
                  <FormGroup className="textfield">
                    <Label className="resetpassword_heading" for="password">
                      New Password
                    </Label>
                    <Input
                      className="resetpassword_inputfiled"
                      type="password"
                      placeholder="Enter your password"
                      id="password"
                      onChange={(e) => handleChanges(e, "password")}
                      value={tempData.password}
                      valid={passwordvalidation}
                      invalid={!passwordvalidation}
                      autoComplete="new-password"
                    />
                  </FormGroup>

                  {/* For Confirm Password field */}
                  <FormGroup className="textfield">
                    <Label className="resetpassword_heading" for="password">
                      Confirm Password
                    </Label>
                    <Input
                      className="resetpassword_inputfiled"
                      type="password"
                      placeholder="Enter your password"
                      id="cpassword"
                      onChange={(e) => handleChanges(e, "cpassword")}
                      value={tempData.cpassword}
                      valid={confirmpasswordvalidation}
                      invalid={!confirmpasswordvalidation}
                    />
                  </FormGroup>

                  <Container className="loginbuttons">
                    <Button
                      className="cler-button"
                      onClick={resetData}
                      color="warning"
                      outline
                      type="reset"
                    >
                      Clear
                    </Button>

                    <Button className="register-button" color="success" outline>
                      Submit
                    </Button>
                  </Container>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
};

export default TrusteeApproval;
