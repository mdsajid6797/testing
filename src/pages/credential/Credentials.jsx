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
import Footer from "../../components/Footerfile/footer";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import "../../css/myestare.css";
import {
  credentials,
  credentialsGet,
  credentialsRemove,
  downloadDocument,
  getToken,
  getUser,
} from "../../services/user-service";
import Deletebutton from "../my-estate/Deletebutton";
import UpdateButton from "../my-estate/UpdateButton";

function Credentials() {
  const [data, setData] = useState({
    nonFinancialAccount: "",
    exampleFile: "",
    notes: "",
  });

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState(null);
  // const [error, setError] = useState({
  //   errors: {},
  //   isError: false,
  // });

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };

  // Handle image
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const resetData = () => {
    setData({
      nonFinancialAccount: "",
      exampleFile: "",
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
      toast.error("Please fill all required feilds.");
      return;
    }

    let token = "Bearer " + getToken();

    // //create form data to send a file and remaining class data
    const formData = new FormData();
    formData.append("filename", selectedImage);
    formData.append("data", JSON.stringify(data));

    credentials(formData, token)
      .then((resp) => {
        toast.success("Data Added !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetData();
        getData();
      })
      .catch((error) => {});
  };
  //get form
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().id;

    let token = "Bearer " + getToken();
    credentialsGet(token, userId).then((res) => {
      setCategory(res);
    });
  };

  // Code by Purnendu
  const handleRemove = (Id) => {
    let token = "Bearer " + getToken();
    credentialsRemove(Id, token)
      .then((res) => {
        getData();
      })
      .catch((error) => {});
  };

  const handleDownload = (fileName) => {
    let myarry = fileName.split(".");
    const token = getToken(); // Replace with your actual token

    downloadDocument("credentials", fileName)
      .then((response) => {
        const downloadUrl = URL.createObjectURL(response.data);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${myarry[0]}.${myarry[1]}`; // Set the desired file name and extension
        link.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        // Handle the error
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
          <div
            className="propertyform"
            style={{ display: "flex", justifyContent: "left" }}
          >
            <Container style={{ width: "430px" }}>
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
                                style={{ width: "370px" }}
                                type="file"
                                name="file"
                                id="exampleFile"
                                onChange={handleImageChange}
                                // value={data.exampleFile}
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
                          <Button color="success" outline>
                            Add
                          </Button>
                          <Button
                            onClick={resetData}
                            color="warning"
                            outline
                            className="ms-2"
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
            <Container>
              <div className="property-container">
                <table id="table" className="property-table" cellSpacing={1000}>
                  <tr
                    style={{
                      height: "50px",
                    }}
                  >
                    <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                      nonFinancialAccount
                    </th>
                    <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                      Notes
                    </th>
                    <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                      Actions
                    </th>
                    <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                      document
                    </th>
                  </tr>
                  {category.map((info, ind) => {
                    return (
                      <tr
                        key={ind}
                        style={{
                          height: "30px",
                          backgroundColor:
                            ind % 2 === 0 ? "rgb(226 238 243)" : "white",
                          fontWeight: "600",
                        }}
                      >
                        <td
                          style={{ paddingRight: "20px", paddingLeft: "20px" }}
                        >
                          {info.nonFinancialAccount}
                        </td>
                        <td
                          style={{ paddignRight: "20px", paddingLeft: "20px" }}
                        >
                          {info.notes}
                        </td>
                        <td
                          style={{ paddingRight: "20px", paddingLeft: "20px" }}
                        >
                          <Button
                            color="info"
                            onClick={() => {
                              handleDownload(info.name);
                            }}
                          >
                            View
                          </Button>
                        </td>

                        <td className="d-flex py-3 px-2">
                          <UpdateButton
                            URL={"../my-estate/credentials/"}
                            id={info.credentials_Id}
                          />
                          <Deletebutton
                            handleRemove={handleRemove}
                            Id={info.credentials_Id}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </Container>
          </div>
        </div>
      </SideBar>
      {/* <div>
        <Footer />
      </div> */}
    </UserBase>
  );
}

export default Credentials;
