import React from "react";
import {
  Card,
  CardHeader,
  Col,
  Container,
  Row
} from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";

function BankLoan() {
  // const [image, setImage] = useState("");
  // function handleImage(e) {

  //   setImage(e.target.files[0]);
  // }
  return (
    <UserBase>
      <div className="mt-5">
        <SideBar>
          <div>
            <div>
              <Container>
                <Row>
                  <Col>
                    <Card >
                      <CardHeader style={{position: "fixed",top: "50%",  left: "50%",  transform: "translate(-50%, -50%)",borderRadius:"10px"}}>
                        <h2>Comming Soon</h2>
                      </CardHeader>
                      {/* <CardBody> */}
                        {/* <Form>
                          <Row>
                            <Col md={4}>
                              <FormGroup>
                                <Label>Select Types Loan:</Label>
                                <Input
                                  type="select"
                                  placeholder=" --Select--"
                                  name="card"
                                  id="card"
                                >
                                  <option>--Select--</option>
                                  <option>Education Loan</option>
                                  <option>Home Loan</option>
                                  <option>Personal Loan</option>
                                  <option>Business Loan</option>
                                  <option>Credit Card Loan</option>
                                  <option>Two-Wheeler Loan</option>
                                  <option>Gold Loan</option>
                                  <option>---------------------</option>
                                </Input>
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
                                <Label>Granter Addhar Number:</Label>
                                <Input
                                  type="text"
                                  id="number"
                                  name="number "
                                  placeholder="Enter Addhar Number--"
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
                          </Row>
                          <Container className="text-center">
                            <Button color="primary">Add</Button>
                          </Container>
                        </Form> */}
                      {/* </CardBody> */}
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
export default BankLoan;
