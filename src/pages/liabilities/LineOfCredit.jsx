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

function LineOfCredit() {
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
                            <Col md={12}>
                              <FormGroup row tag="fieldset">
                                <legend
                                  className="col-form-label col-sm-2"
                                  style={{ width: "370px" }}
                                >
                                  1.on the Basic of Collateral:
                                </legend>
                                <Col sm={10}>
                                  <FormGroup check>
                                    <Input name="radio2" type="radio" />{" "}
                                    <Label check>Secured Line of Credit:</Label>
                                  </FormGroup>
                                  <FormGroup check>
                                    <Input name="radio2" type="radio" />{" "}
                                    <Label check>
                                      Unsecured Line of Credit:
                                    </Label>
                                  </FormGroup>
                                </Col>
                              </FormGroup>
                              <FormGroup row tag="fieldset">
                                <legend
                                  className="col-form-label col-sm-2"
                                  style={{ width: "370px" }}
                                >
                                  2.on the Basis of Other Characteristics:
                                </legend>
                                <Col sm={10}>
                                  <FormGroup check>
                                    <Input name="radio5" type="radio" />{" "}
                                    <Label check>
                                      Personal Line of Credit:
                                    </Label>
                                  </FormGroup>
                                  <FormGroup check>
                                    <Input name="radio5" type="radio" />{" "}
                                    <Label check>Demand Line of Credit:</Label>
                                  </FormGroup>
                                  <FormGroup check>
                                    <Input name="radio5" type="radio" />{" "}
                                    <Label check>
                                      Business Line of Credit:
                                    </Label>
                                  </FormGroup>
                                  <FormGroup check>
                                    <Input name="radio5" type="radio" />{" "}
                                    <Label check>Student Line of Credit:</Label>
                                  </FormGroup>
                                  <FormGroup check>
                                    <Input name="radio5" type="radio" />{" "}
                                    <Label check>
                                      Home Equity Line of Credit(HELOC):
                                    </Label>
                                  </FormGroup>
                                </Col>
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
export default LineOfCredit;
