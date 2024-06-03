import React from "react";
import UserBase from "../../components/user/UserBase";
import SideBar from "../../components/sidebar/Sidebar";
import {
  Card,
  CardHeader,
  Col,
  Container,
  Form,
  Row,
  Input,
  FormGroup,
  Label,
  CardBody,
  Button,
} from "reactstrap";
import { useState } from "react";

function PersonalLoan() {
  const [image, setImage] = useState("");
  function handleImage(e) {

    setImage(e.target.files[0]);
  }
  return (
    <UserBase>
      <div className="mt-5">
        <SideBar>
          <div>
            <div>
              <Container>
                <Row>
                  <Col>
                    <Card>
                    <CardHeader style={{position: "fixed",top: "50%",  left: "50%",  transform: "translate(-50%, -50%)",borderRadius:"10px"}}>
                        <h2>Comming Soon</h2>
                      </CardHeader>
                      {/* <CardBody>
                        <Form>
                          <Row>
                            <Col mt={4}>
                              <FormGroup>
                                <Label>Enter Name:</Label>
                                <Input
                                  type="text"
                                  id="number"
                                  name="number "
                                  placeholder="Enter Name--"
                                ></Input>
                              </FormGroup>
                            </Col>
                            <Col mt={4}>
                              <FormGroup>
                                <Label>Select Any Proof:</Label>
                                <Input
                                  type="select"
                                  placeholder=" --Select--"
                                  name="card"
                                  id="card"
                                >
                                  <option>--Select--</option>
                                  <option>Addhar Card</option>
                                  <option>Pan Card</option>
                                  <option>Driving Licence</option>
                                  <option>Voter Id Crad</option>
                                  <option>Passport Number</option>
                                  <option>---------------------</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col mt={4}>
                              <FormGroup>
                                <Label>Proof Number:</Label>
                                <Input
                                  type="text"
                                  name="Number"
                                  id="number"
                                  placeholder="Enter Proof Number:"
                                ></Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col mt={4}>
                              <FormGroup>
                                <Label>Enter Address:</Label>
                                <Input
                                  type="text"
                                  id="address"
                                  name="address "
                                  placeholder="Enter Address--"
                                ></Input>
                              </FormGroup>
                            </Col>
                            <Col mt={4}>
                              <Label>Upload Photo:</Label>
                              <Input
                                type="file"
                                name="upload photo"
                                onChange={handleImage}
                              />
                              <Button color="success" outline>
                                Upload
                              </Button>
                            </Col>
                            <Col mt={4}>
                              <Label>Upload Signature:</Label>
                              <Input
                                type="file"
                                name="upload photo"
                                onChange={handleImage}
                              />
                              <Button color="success" outline>
                                Upload
                              </Button>
                            </Col>
                          </Row>
                          <Row>
                            <Col mt={4}>
                              <FormGroup>
                                <Label>Granter Name:</Label>
                                <Input
                                  type="text"
                                  id="number"
                                  name="number "
                                  placeholder="Enter Name--"
                                ></Input>
                              </FormGroup>
                            </Col>
                            <Col mt={4}>
                              <FormGroup>
                                <Label>Granter Proof:</Label>
                                <Input
                                  type="select"
                                  placeholder=" --Select--"
                                  name="card"
                                  id="card"
                                >
                                  <option>--Select--</option>
                                  <option>Addhar Card</option>
                                  <option>Pan Card</option>
                                  <option>Driving Licence</option>
                                  <option>Voter Id Crad</option>
                                  <option>Passport Number</option>
                                  <option>---------------------</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col mt={4}>
                              <Label>Upload Proof Photo:</Label>
                              <Input
                                type="file"
                                name="upload photo"
                                onChange={handleImage}
                              />
                              <Button color="success" outline>
                                Upload
                              </Button>
                            </Col>
                          </Row>
                          <Container className="text-center">
                            <Button color="primary">Add</Button>
                          </Container>
                        </Form>
                      </CardBody> */}
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </SideBar>
      </div>
    </UserBase>
  );
}
export default PersonalLoan;
