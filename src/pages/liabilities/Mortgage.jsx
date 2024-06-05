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

function Mortgage() {
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
                    <Card>
                    <CardHeader style={{position: "fixed",top: "50%",  left: "50%",  transform: "translate(-50%, -50%)",borderRadius:"10px"}}>
                        <h2>Comming Soon</h2>
                      </CardHeader>
                      {/* <CardBody>
                        <Form>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label>Mortgage Parameter:</Label>
                                <Input
                                  type="select"
                                  placeholder=" --Select--"
                                  name="mortgage"
                                  id="mortgage"
                                  style={{ width: "370px" }}
                                >
                                  <option>--Select--</option>
                                  <option>Property Type & Market Value</option>
                                  <option>Income</option>
                                  <option>---------------------</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <FormGroup>
                                <Label>Types of Property:</Label>
                                <Input
                                  type="select"
                                  placeholder=" --Select--"
                                  name="property"
                                  id="property"
                                  style={{ width: "370px" }}
                                >
                                  <option>--Select--</option>
                                  <option>1. Residential</option>
                                  <option>2. Commercial</option>
                                  <option>3. Industrial</option>
                                  <option>4. Open Plot</option>
                                  <option>---------------------</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col mt={6}>
                              <FormGroup>
                                <Label>
                                  Income LTV (Loan the value Ratio):
                                </Label>
                                <Input
                                  type="select"
                                  placeholder=" --Select--"
                                  name="property"
                                  id="property"
                                  style={{ width: "370px" }}
                                >
                                  <option>--Select--</option>
                                  <option>1. Residential (65%)</option>
                                  <option>2. Commercial (55%)</option>
                                  <option>3. Industrial (50%)</option>
                                  <option>4. Open Plot (40%)</option>
                                  <option>---------------------</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col mt={6}>
                              <Label>Upload Document:</Label>
                              <Input
                                type="file"
                                name="upload document"
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
export default Mortgage;
