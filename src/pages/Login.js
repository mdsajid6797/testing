import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
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
import {
  currentUser,
  generateToken,
  loginUser,
  setUser,
} from "../services/user-service";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";
import Otppage from "./Otppage";

const Login = ({ onBack }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginDetail, setLoginDetail] = useState({
    username: "",
    password: "",
  });

  const handleChanges = (event, property) => {
    setLoginDetail({ ...loginDetail, [property]: event.target.value });
  };

  // const handleReset = () => {
  //   setLoginDetail({
  //     username: "",
  //     password: "",
  //   });
  // };

  const [visible, setVisible] = useState(false);
  // const [checkedUserLoggedIn, setCheckedUserLoggedIn] = useState(false);

  const [showOtp] = React.useState(false);
  const [usermail] = React.useState(null);
  // const [OTP, setOTP] = React.useState(false);
  // const toggleOtp = () => {
  //   setShowOtp(!showOtp);
  //   // setShowLogin(false);
  // };

  // const [email, setemail] = useState({
  //   to: "",
  //   subject: "",
  //   message: "",
  // });

  // const [checkUser, setCheckUser] = useState(null);
  // function isUserLoggedIn() {

  //   if (checkUser.username === loginDetail.username) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     currentUser("Bearer " + token)
  //       .then((user) => {
  //         setCheckUser(user);
  //         console.log("currentUser: ", user);
  //       })
  //       .catch((error) => {

  //       });
  //   }
  // }, []);

  const loginFormSubmit = (event) => {
    event.preventDefault();
    setVisible(false);

    // if (checkUser != null) {
    //   if (isUserLoggedIn()) {
    //     setCheckedUserLoggedIn(true);
    //     return;
    //   }
    // }
    // data validate
    if (
      loginDetail.username.trim() === "" ||
      loginDetail.password.trim() === ""
    ) {
      setVisible(true);
      // handleReset();
      return;
    }

    // call server api for sending data
    generateToken(loginDetail)
      .then((jwtTokenData) => {
        loginUser(jwtTokenData.token);
        const token = "Bearer " + jwtTokenData.token;
        currentUser(token).then((user) => {
          setUser(user);
          login();
          // sendOtp({
          //   to:user.email,
          //   subject: "Login OTP",
          //   message: Emailtemplate,
          //   postfixMessage: EmailTemplatePostfix
          // }).then((res)=>{

          //   setUsermail(user.email);

          //   // setOTP(res);
          //   setShowOtp(true);
          // }).catch((err)=>{
          //   toast.error("Mail is not correct");

          //   return;
          // });

          if (user.role === "USER") {
            navigate("/user/dashboard");
          } else if (
            user.role === "TRUSTEE" &&
            user.firstlevelapproval === "true"
          ) {
            navigate("/trustee/dashboard");
          } else if (
            user.role === "BENEFICIARY" &&
            user.firstlevelapproval === "true"
          ) {
            navigate("/beneficiary/dashboard");
          }
          // else {
          //   toast.error("Email has been sent to your email, verify it");
          // }
        });
      })
      .catch((error) => {
        setVisible(true);
      });
    // signup(data).then((resp) => {

    //   resetData();
    // }).catch((error) => {

    // })
  };

  const [showPassword, setShowPassword] = useState(false); // Step 1

  const handleTogglePassword = () => {
    setShowPassword(!showPassword); // Step 2
  };
  return (
    <div className="login-popup">
      {showOtp && (
        <div className="login-popup">
          <div className="login-content">
            {showOtp && <Otppage usermail={usermail} />}
          </div>
        </div>
      )}
      {!showOtp && (
        <div>
          <div className="loginpage">
            <Card className="logincard">
              <Alert className="text-center" color="danger" isOpen={visible}>
                Invalid username or password !!
              </Alert>
              {/* <Alert
                className="text-center"
                color="danger"
                isOpen={checkedUserLoggedIn}
              >
                User already logged in !!
              </Alert> */}
              <CardHeader className="card-header">
                <h3>Login</h3>
              </CardHeader>
              {/* {JSON.stringify(loginDetail)} */}
              <CardBody>
                <Form onSubmit={loginFormSubmit} className="login_submit_form">
                  {/* For username field */}
                  <FormGroup className="login-card-details">
                    <Label for="username">Username</Label>
                    <Input
                      className="inputfiled"
                      type="text"
                      placeholder="Enter your username"
                      id="username"
                      onChange={(e) => handleChanges(e, "username")}
                      // value={loginDetail.username}
                    />
                  </FormGroup>

                  {/* For Password field */}
                  <FormGroup className="login-card-details">
                    <Label for="password">Password</Label>
                    <div className="password-input-container">
                      <Input
                        style={{ paddingRight: "41px" }}
                        className="inputfiled"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        id="password"
                        onChange={(e) => handleChanges(e, "password")}
                        // value={loginDetail.password}
                        // autoComplete="new-password"
                      />
                      <button
                        className="toggle-password-button"
                        type="button"
                        onClick={handleTogglePassword}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </FormGroup>
                  <div style={{ marginBottom: "20px" }} className="forgot-btn">
                    <Link className="forgot-button" to="/forgot">
                      Forgot Password?
                    </Link>
                  </div>

                  <Container className="loginbuttonspace">
                    <Button
                      type="button"
                      className="cler-button"
                      onClick={onBack}
                      outline
                    >
                      Cancel
                    </Button>

                    <Button className="login-button" outline>
                      Login
                    </Button>
                  </Container>
                </Form>
                {/* Google Sign-In Button */}
                {/* <div className="text-center mt-3">
                  <Button color="primary" onClick={handleGoogleSignIn}>
                    Continue with Google
                  </Button>
                </div> */}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;
