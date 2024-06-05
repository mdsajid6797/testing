// Code By purnendu
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import TrusteeApproval from "../pages/TrusteeApproval";
import { getEmailByUsername, sendOtp } from "../services/user-service";
import { EmailTemplatePostfix, Emailtemplate } from "./Emailtemplate";
import Otppage from "./Otppage";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [validmail, setValidmail] = useState(false);
  const [usermail, setUsermail] = useState("");
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  const goBack = () => {
    navigate("/");
  };
  const handleChanges = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    getEmailByUsername(username)
      .then((res) => {
        setUserDetails(res);
        if (!res) {
          toast.error("Username is not correct please correct your username");
          return;
        }
        setUsermail(res.email);
        sendOtp({
          to: res.email,
          subject: "Test Api",
          message: Emailtemplate,
          postfixMessage: EmailTemplatePostfix,
        })
          .then((res) => {
            setValidmail(true);
          })
          .catch((err) => {
            return;
          });
      })
      .catch((err) => {
        toast.error("Server Error" + err);

        return;
      });
  };

  const [visibleFPassword, setVisibleFPassword] = useState(false);

  const handleFlagValueReceived = (flagValue) => {
    setValidmail(flagValue);
    setVisibleFPassword(true);
  };

  let forgetPassword = "forgetPassword";

  useEffect(() => {}, [visibleFPassword]);

  return (
    <>
      {validmail ? (
        <Otppage
          userDetails={userDetails}
          usermail={usermail}
          onFlagReceived={handleFlagValueReceived}
          otpType={forgetPassword}
        />
      ) : (
        <>
          <div>
            <div>
              <Container className="restepassword_container">
                <div className="restepassword_maincard">
                  <Card>
                    <CardHeader className="cardheading">
                      <h3 className="heading">Reset your password</h3>
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
                            onChange={(e) => handleChanges(e)}
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
      {visibleFPassword ? <TrusteeApproval /> : null}
    </>
  );
}
