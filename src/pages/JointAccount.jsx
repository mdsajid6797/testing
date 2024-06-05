import { faEye, faEyeSlash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Textarea,
} from "@mui/joy";
import { useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import "../../src/css/AttorneyForm.css";
import { signup } from "../services/user-service";

export default function JointAccount({ userId, onBack }) {
  const [data, setData] = useState({
    commonId: userId,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    currentAddress: "",
    phoneNo: "",
    role: "USER",
    jointAccount: true,
    accountType: "secondary",
  });

  const reset = () => {
    setData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      currentAddress: "",
      phoneNo: "",
    });
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

    signup(data)
      .then((res) => {
        toast.success("Registration Successful", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        onBack();
      })
      .catch((err) => {});
  };

  return (
    <>
      <div className="attorney_container">
        <div className="joint_registration_form">
          <div className="joint_registration_form_heading">
            <h1 style={{ textAlign: "center", width: "100%" }}>
              Secondary Account Registration Form
            </h1>
            <div className="attorney_cancel_icon">
              <FontAwesomeIcon icon={faTimes} onClick={onBack} />
            </div>
          </div>
          <form className="attorney_form_main" onSubmit={submitForm}>
            <div className="joint_account_form">
              <div className="joint_form_left">
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    sx={{ width: "21.7em" }}
                    placeholder="Enter first name"
                    value={data.firstName}
                    onChange={(e) => handleChanges(e, "firstName")}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    sx={{ width: "21.7em" }}
                    placeholder="Enter last name"
                    value={data.firstName}
                    onChange={(e) => handleChanges(e, "lastName")}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    sx={{ width: "21.7em" }}
                    placeholder="Enter username"
                    value={data.username}
                    onChange={(e) => handleChanges(e, "username")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    sx={{ width: "21.7em" }}
                    placeholder="Enter phone number"
                    value={data.phoneNo}
                    onChange={(e) => handleChanges(e, "phoneNo")}
                  />
                </FormControl>
              </div>

              <div className="joint_form_right">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    sx={{ width: "21.7em" }}
                    placeholder="Enter email address"
                    value={data.email}
                    onChange={(e) => handleChanges(e, "email")}
                  />
                </FormControl>

                {/* <TextField
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
                /> */}

                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    sx={{ width: "21.7em" }}
                    id="attorney-password"
                    value={data.password}
                    onChange={(e) => handleChanges(e, "password")}
                    type={showPassword ? "text" : "password"}
                    error={!!error}
                    placeholder="Enter your password"
                    endDecorator={
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
                    }
                    required
                    fullWidth
                    autoComplete="new-password"
                  />
                  {error && <FormHelperText error>{error}</FormHelperText>}
                </FormControl>
                <FormControl>
                  <FormLabel>Current Address</FormLabel>
                  <Textarea
                    sx={{ width: "21.7em", height: "6.78em" }}
                    placeholder="Enter current address"
                    value={data.currentAddress}
                    onChange={(e) => handleChanges(e, "currentAddress")}
                  />
                </FormControl>
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
            <div className="joint_form_btn_main">
              <div className="joint_form_btn">
                <button onClick={reset} type="button">
                  Clear
                </button>
              </div>
              <div className="joint_form_btn">
                <button type="submit">Register</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
