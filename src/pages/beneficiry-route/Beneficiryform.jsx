import React, { useState, useContext } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  FormText,
} from "reactstrap";
import BeneficiaryNavbar from "../../components/beneficiary/BeneficiaryNavbar";
import { toast } from "react-toastify";
import {
  sendFormdata,
  getUser,
  viewDetails,
} from "../../services/user-service";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./../../css/Beneficiryform.css";
import SideBar from "../../components/sidebar/Sidebar";
import BeneficiryBase from "../../components/beneficiary/BeneficiaryBase";

export default function Beneficiryform(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state?.property;

  // set data
  const [data, setData] = useState({
    name: "",
    email: "",
    dob: "",
    panCardNumber: "",
    exampleFile: "",
  });

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };

  const resetData = () => {
    setData({
      name: "",
      email: "",
      dob: "",
      panCardNumber: "",
      exampleFile: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      data.name === "" ||
      data.email === "" ||
      data.dob === "" ||
      data.panCardNumber === "" ||
      data.exampleFile === ""
    ) {
      toast.error("Please fill required field Then Submit .", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    // resetData();

    sendFormdata(data, property.id)
      .then((res) => {
        toast.success("Form Submited Succesfully...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });

        viewDetails(property)
          .then((res) => {
            navigate("/beneficiary/dashboard");
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  };

  return (
    <>
      <BeneficiryBase>
        <div className="mt-5">
          <SideBar>
            <div className="beneficiary_form">
              <Form
                onSubmit={handleSubmit}
                className="beneficiary_form_submit_card"
              >
                <div className="beneficiary_form_heading">
                  <span>beneficiary details submit form</span>
                </div>
                <FormGroup className="beneficairy_form_input_area">
                  <Label for="name">Enter Your name </Label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="enter your name"
                    id="name"
                    onChange={(e) => handleChanges(e, "name")}
                    value={data.name}
                  />
                </FormGroup>
                <FormGroup className="beneficairy_form_input_area">
                  <Label for="exampleEmail">enter your Email</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    placeholder="Enter Your Email address"
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChanges(e, "email")}
                  />
                </FormGroup>
                <FormGroup className="beneficairy_form_input_area">
                  <Label for="exampleDate">Enter Your DOB</Label>
                  <Input
                    id="exampleDate"
                    name="date"
                    placeholder="Enter Your DOB"
                    type="date"
                    onChange={(e) => handleChanges(e, "dob")}
                    value={data.dob}
                  />
                </FormGroup>
                <FormGroup className="beneficairy_form_input_area">
                  <Label for="exampleEmail">Enter Your Pan Card Number</Label>
                  <Input
                    id="exampleEmail"
                    name="pandcard"
                    placeholder="Enter Your Pan Card Number"
                    type="text"
                    onChange={(e) => handleChanges(e, "panCardNumber")}
                    value={data.panCardNumber}
                  />
                </FormGroup>
                <FormGroup className="beneficairy_form_input_area">
                  <Label for="exampleFile">Upload Your PAN Card</Label>
                  <Input
                    id="exampleFile"
                    name="file"
                    type="file"
                    onChange={(e) => handleChanges(e, "exampleFile")}
                    value={data.exampleFile}
                  />
                </FormGroup>
                <div className="beneficiary_form_btn">
                  <Button
                    className="beneficiary_form_clear_btn"
                    type="reset"
                    style={{ marginRight: "4px" }}
                  >
                    Clear
                  </Button>
                  <Button
                    className="beneficiary_form_submit_btn"
                    color="primary"
                    type="submit"
                    style={{ marginLeft: "4px" }}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </SideBar>
        </div>
      </BeneficiryBase>
    </>
  );
}
