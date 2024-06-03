import React, { useState } from "react";
import OtpInput from "react-otp-input";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
} from "reactstrap";
// Code By Purnendu
import { useNavigate } from "react-router-dom";
import "../css/otppage.css";
import { getUser, sendOtp, verifyOtp } from "../services/user-service";
import { EmailTemplatePostfix, Emailtemplate } from "./Emailtemplate";
import { toast } from "react-toastify";
export default function Otppage({ userDetails, usermail, onFlagReceived, otpType }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [visible, setVisible] = useState(false);
  const [alertMeg, setAlertMeg] = useState();

  const [email, setemail] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const handleVerify = (e) => {
    e.preventDefault();

    verifyOtp({ usermail, otp })
      .then((res) => {
    
        // navigate("/reset-password")
        if (res === true && otpType == "register") {
          // const user = getUser();
   
          // if (user.role === "USER") {

          //   navigate("/user/dashboard");
          // } else if (
          //   user.role === "TRUSTEE" &&
          //   user.firstlevelapproval === "true"
          // ) {

          //   navigate("/trustee/dashboard");
          // } else {

          //   navigate("/beneficiary/dashboard");
          // }
          toast.success("User register successfully");
          onFlagReceived(false);
          navigate("/")
        } else if(res === true && otpType == "forgetPassword") {
          // toast.success("User register successfully");
          onFlagReceived(true);
  
          // navigate("/")
        } else {
          setVisible(true);
          // toast.error("Please enter correct OTP");
          setAlertMeg("Please Enter the correct OTP");
        }
      })
      .catch((err) => {
        setVisible(true);
        setAlertMeg("Please Enter the correct OTP");

      });
  };

  const resendOtp = () => {

    sendOtp({
      to: userDetails.email,
      subject: "Login OTP",
      message: Emailtemplate,
      postfixMessage: EmailTemplatePostfix
    })
      .then((res) => {

        setOtp("");
        setVisible(true);
        setAlertMeg("OTP Sent");

      })
      .catch((err) => {

        return;
      });
  };
  return (
    <>
      <Container>
        <div className="otppage-mane">
          <Card className="otppage-card">
            <Alert
              className={
                alertMeg === "OTP Sent" ? "text-center-success" : "text-center"
              }
              color={alertMeg === "OTP Sent" ? "primary" : "danger"}
              isOpen={visible}
            >
              {alertMeg}
            </Alert>
            <CardHeader className="otppage-header">
              <h3>Enter OTP</h3>
            </CardHeader>
            <CardBody className="otppage-cardbody">
              <Form onSubmit={handleVerify}>
                <div className="otppage-otpdesign">
                  <OtpInput
                    inputStyle={{
                      justifyContent: "center",
                      height: "40px",
                      width: "40px",
                      borderRadius: "7px",
                      border: "3px transparent",
                    }}
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span></span>}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
                <div className="otppage-button">
                  <Button className="otppage-resend-otp" onClick={resendOtp}>Resend Otp</Button>
                  <Button className="otppage-varify" type="submit">
                    Verify
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      </Container>
    </>
  );
}
