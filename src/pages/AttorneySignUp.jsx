import { IconButton, InputAdornment, TextField } from "@mui/material";
import "../../src/css/AttorneyForm.css";
import { faEye, faEyeSlash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import { getEmailByUsername, getToken, signup } from "../services/user-service";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function AttorneySignUp() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    temporaryUsername: "",
    phoneNo: "",
    role: "ATTORNEY",
  });

  const resetData = () => {
    setData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phoneNo: "",
    });
  };


  const goBack = () => {
    navigate("/");
  };

  const [error, setError] = useState("");

  // const handlePasswordChange = (e) => {
  //   const newPassword = e.target.value;
  //   setPassword(newPassword);
  //   // Perform validation
  //   if (newPassword.length < 8) {
  //     setError("Password must be at least 8 characters long");
  //   } else {
  //     setError("");
  //   }
  // };

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
      setError("");
    } else {
      setPasswordvalidation(false);
      setError("Only alphanumeric with minimum 10 charecter (Eg- Ichest@123)");
    }
  };

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
    if (property === "password") {
      validate(event.target.value);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (!passwordvalidation) {
      toast.error(
        "Only alphanumeric with minimum 10 charecter (Eg- Ichest@123)"
      );
      return;
    }

    if (error.isError) {
      toast.error("Form data is invalid, correct all detais then submit.");
      return;
    }

    const token = "Bearer " + getToken();

    signup(data)
      .then((res) => {

        toast.success("Registration Successful, Login and fill your details.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        goBack();
      })
      .catch((err) => {
        
      });
  };

  const [validusername, setValidUsername] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  // for username confirmation 
  const handleSubmit = (e) => {
    e.preventDefault();

    getEmailByUsername(username)
      .then((res) => {

        if (!res) {
          toast.error("Username is not correct please correct your username");
          return;
        }
        setValidUsername(true);
        setData((prevData) => ({
          ...prevData,
          temporaryUsername: res.username,
        }));
      })
      .catch((err) => {
        toast.error("Server Error" + err);
   
        return;
      });
  };

  return (
    <>
      {validusername ? (
        <>
          <div className="attorney_container">
            <div className="attorney_registration_form">
              <div className="attorney_registration_form_heading">
                <h1 style={{ textAlign: "center", width: "100%" }}>
                  Attorney Registration Form
                </h1>
                {/* <div className="attorney_cancel_icon">
                <FontAwesomeIcon icon={faTimes} />
              </div> */}
              </div>
              <form className="attorney_form_main" onSubmit={submitForm}>
                <div className="attorney_form">
                  <div className="attorney_form_left">
                    <TextField
                      id="attorney-first-name"
                      label="First Name"
                      value={data.firstName}
                      onChange={(e) => handleChanges(e, "firstName")}
                      fullWidth
                      margin="normal"
                      required
                    />
                    <TextField
                      id="attorney-last-name"
                      label="Last Name"
                      value={data.lastName}
                      onChange={(e) => handleChanges(e, "lastName")}
                      fullWidth
                      margin="normal"
                      required
                    />
                    <TextField
                      id="attorney-email"
                      label="Email"
                      value={data.email}
                      onChange={(e) => handleChanges(e, "email")}
                      fullWidth
                      margin="normal"
                      required
                    />
                    {/* <TextField
                    id="attorney-password"
                    label="Password"
                    value={data.password}
                    onChange={(e) => handleChanges(e, "password")}
                    fullWidth
                    margin="normal"
                    type="password"
                    error={!!error}
                    helperText={error}
                    autoComplete="new-password"
                    required
                  /> */}
                    <TextField
                      id="attorney-username"
                      label="Username"
                      value={data.username}
                      onChange={(e) => handleChanges(e, "username")}
                      fullWidth
                      margin="normal"
                      required
                    />
                    <TextField
                      id="attorney-password"
                      label="Password"
                      value={data.password}
                      onChange={(e) => handleChanges(e, "password")}
                      fullWidth
                      margin="normal"
                      type={showPassword ? "text" : "password"}
                      error={!!error}
                      helperText={error}
                      autoComplete="new-password"
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              aria-label="toggle password visibility"
                              style={{ padding: 0 }}
                            >
                              <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                style={{
                                  fontSize: "16px",
                                  marginRight: "4px",
                                  color: "black",
                                }} // Adjust icon size and color as needed
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      id="contact-number"
                      label="Contact Number*"
                      value={data.phoneNo}
                      onChange={(e) => handleChanges(e, "phoneNo")}
                      fullWidth
                      margin="normal"
                    />
                    <div className="attorney_form_btn_main">
                      <div className="attorney_form_btn">
                        <button type="button" onClick={resetData}>
                          Clear
                        </button>
                      </div>
                      <div className="attorney_form_btn">
                        <button type="submit">Register</button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="attorney_form_right">
                  <TextField
                    id="lay-firm-name"
                    label="Law Firm Name"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="bar-association-license-number"
                    label="Bar Association License Number"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="jurisdiction-of-practice"
                    label="Jurisdiction of Practice"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="practice-area"
                    label="Practice Area"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="year-of-experience"
                    label="Year of Experience"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="education"
                    label="Education"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="professional-affiliations"
                    label="Professional Affiliations"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
  
                  <TextField
                    id="website-url"
                    label="Website URL"
                    // value={data.name}
                    // onChange={(e) => handleChanges(e, "name")}
                    fullWidth
                    margin="normal"
                  />
                  
                </div> */}
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <div>
              <Container className="restepassword_container">
                <div className="restepassword_maincard">
                  <Card>
                    <CardHeader className="cardheading">
                      <h3 className="heading">Enter User Name</h3>
                    </CardHeader>
                    <CardBody className="resetpassword_cardbody">
                      <Form
                        onSubmit={(e) => {
                          handleSubmit(e);
                        }}
                      >
                        {/* For username field */}
                        <FormGroup className="textfield">
                          <Label
                            className="resetpassword_heading"
                            for="username"
                          >
                            Username
                          </Label>
                          <Input
                            style={{ backgroundColor: "inherit" }}
                            className="inputfiled"
                            type="text"
                            placeholder="Enter your username"
                            id="username"
                            value={username}
                            onChange={(e) => handleChange(e)}
                          />
                        </FormGroup>
                        <Container className="loginbuttonspace">
                          <Button
                            className="cler-button"
                            style={{ backgroundColor: "inherit" }}
                            onClick={goBack}
                            type="reset"
                          >
                            Cancel
                          </Button>

                          <Button
                            className="register-button"
                            style={{ backgroundColor: "inherit" }}
                            type="submit"
                          >
                            Submit
                          </Button>
                        </Container>
                      </Form>
                    </CardBody>
                  </Card>
                </div>
              </Container>
            </div>
          </div>
        </>
      )}
    </>
  );
}
