//import React, { useEffect } from "react";
import { useEffect, useState } from "react";
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
  FormText,
  Input,
  Label,
  Row,
} from "reactstrap";
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import {
  getCredential,
  getToken,
  updateCredentials,
} from "../../../services/user-service";
import { useNavigate, useParams } from "react-router-dom";
//import axios from "axios";
import "../../../css/myestate_edit.css";
function EditCredential() {
  const { credentials_Id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    credentials_Id: credentials_Id,
    nonFinancialAccount: "",
    notes: "",
  });
  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle image
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  // const [error, setError] = useState({
  //   errors: {},
  //   isError: false,
  // });

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };

  const resetData = () => {
    setData({
      credentials_Id: credentials_Id,
      nonFinancialAccount: "",
      notes: "",
    });
  };

  // Set the form
  const credentialsForm = (event) => {
    event.preventDefault();

    // if (error.isError) {
    //   toast.error("Form data is invalid.");
    //   return;
    // }
    if (data.nonFinancialAccount === "") {
      console.log("Error log");
      toast.error("Please fill all required feilds.");
      return;
    }

    let token = "Bearer " + getToken();

    console.log("Token : " + token);

    // //create form data to send a file and remaining class data
    const formData = new FormData();
    formData.append("filename", selectedImage);
    formData.append("data", JSON.stringify(data));

    updateCredentials(formData, token, credentials_Id)
      .then((resp) => {
        console.log(resp);
        console.log("Success log");
        toast.success("Updated Successfully !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/credentials");
      })
      .catch((error) => {
        console.log(error);
        //
        // handle error credentialsGet
      });
  };
  //get data from table for edit purpose
  const getData = () => {
    let token = "Bearer " + getToken();
    getCredential(token, credentials_Id).then((res) => {
      setData({
        ...data,
        nonFinancialAccount: res.nonFinancialAccount,
        notes: res.notes,
      });
      console.log(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <UserBase>
      <div className="mt-5"></div>
      <SideBar>
        <div>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Container className="edit_container">
              <Row>
                <Col>
                  <Card color="" outline>
                    <CardHeader>
                      <h3>Credentials</h3>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={credentialsForm}>
                        <Row>
                          <Col md={18}>
                            <FormGroup floating>
                              {/* <Label for="firstName">First Name</Label> */}
                              <Input
                                type="select"
                                name="Non Financial account"
                                id="nonFinancialAccount"
                                style={{ width: "370px" }}
                                onChange={(e) =>
                                  handleChanges(e, "nonFinancialAccount")
                                }
                                value={data.nonFinancialAccount}
                                //invalid={error.errors?.response?.data?.nonFinancialAccount ? true : false}
                              >
                                <option></option>
                                <option>Social media</option>
                                <option>Email</option>
                                <option>Streaming Services</option>
                                <option>Online Shopping</option>
                                <option>Loyalty Programs</option>
                                <option>Gaming</option>
                                <option>Education</option>
                                <option>Healthcare</option>
                                <option>Communication</option>
                                <option>Job Search</option>
                              </Input>
                              <Label>Non-Financial Account</Label>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={12}>
                            <FormGroup>
                              {/* <Label for="firstName">First Name</Label> */}
                              <FormText color="muted">Upload Document</FormText>
                              <Input
                                required
                                style={{ width: "370px" }}
                                type="file"
                                name="file"
                                id="exampleFile"
                                onChange={handleImageChange}
                                //invalid={error.errors?.response?.data?.exampleFile ? true : false}
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={12}>
                            {/* For Country code field */}
                            <FormGroup floating>
                              {/* <Label for="firstName">First Name</Label> */}
                              <Input
                                style={{ width: "370px" }}
                                type="text"
                                placeholder="Notes"
                                id="notes"
                                onChange={(e) => handleChanges(e, "notes")}
                                value={data.notes}
                                //invalid={error.errors?.response?.data?.saftyBox ? true : false}
                              />
                              <Label>Notes</Label>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Container className="text-center">
                          <Button className="my-estate-add-btn" outline>
                            Update
                          </Button>
                          <Button
                            onClick={resetData}
                            className="my-estate-clear-btn"
                            outline
                            type="reset"
                          >
                            Clear
                          </Button>
                        </Container>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </SideBar>
    </UserBase>
  );
}

export default EditCredential;
