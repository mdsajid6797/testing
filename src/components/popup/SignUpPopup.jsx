import React, { useState } from "react";
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

const SignUpPopup = () => {
  return (
    <>
      <div className="login-popup page">
        <div className="signup">
          <Card className="regcard">
            <CardHeader className="cardheading" style={{ borderRadius: "0px" }}>
              <h3 className="heading">Register</h3>
            </CardHeader>
            <CardBody className="cardbody">
              <Form className="form_body"></Form>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SignUpPopup;
