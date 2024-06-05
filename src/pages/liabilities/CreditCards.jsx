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
function CreditCards() {
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
                            <Col md={6}>
                              <FormGroup>
                                <Label>Select Cards:</Label>
                                <Input
                                  type="select"
                                  placeholder=" --Select--"
                                  name="card"
                                  id="card"
                                  style={{ width: "370px" }}
                                >
                                  <option>--Select--</option>
                                  <option>Rewards credit cards</option>
                                  <option>Cash back credit cards</option>
                                  <option>Travel credit cards</option>
                                  <option>Business credit card</option>
                                  <option>Student credit cards</option>
                                  <option>Secured credit cards</option>
                                  <option>Store credit cards</option>
                                  <option>---------------------</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label>CVV Number:</Label>
                                <Input
                                  type="text"
                                  name="cvv"
                                  id="cvv"
                                  placeholder=" Enter CVV--"
                                  style={{ width: "370px" }}
                                ></Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <FormGroup>
                                <Label>Card Number:</Label>
                                <Input
                                  type="text"
                                  id="number"
                                  name="number "
                                  placeholder="Enter Number--"
                                  style={{ width: "370px" }}
                                ></Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <FormGroup>
                                <Label>Card Holder Name:</Label>
                                <Input
                                  type="text"
                                  id="number"
                                  name="number "
                                  placeholder="Enter Name--"
                                  style={{ width: "370px" }}
                                ></Input>
                              </FormGroup>
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
export default CreditCards;
