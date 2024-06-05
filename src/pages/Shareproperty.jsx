import React, { useEffect, useState } from "react";
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
  Table,
} from "reactstrap";
import UserBase from "../components/user/UserBase";
import "../css/ShareProperty.css";
import { getCryptoAssests } from "../services/CryptoService";
import { getIncome } from "../services/IncomeService";
import { getJewelries } from "../services/JewelryService";
import { getRealEstates } from "../services/RealEstate-service";
import { getVehicle } from "../services/VehicleService";
import { getBank } from "../services/bank-service";
import { getInvestments } from "../services/investment-service";
import {
  credentialsGet,
  deleteProperty,
  getBeneficiary,
  getToken,
  getUser,
  getUserModel,
  getproperty,
  sendProperty,
} from "../services/user-service";
import Benificiarydetailsbyuserm from "./Benificiarydetailsbyuserm";
import Propertydetails from "./Propertydetails";
import Deletebutton from "./my-estate/Deletebutton";

export default function Shareproperty() {
  const [selectproperty, setSelectproperty] = useState("");
  const [username, setUsername] = useState("");
  const [usermail, setUsermail] = useState("");
  const [name, setName] = useState("");

  username &&
    getUserModel(username)
      .then((res) => {
        setName(res.data.user.firstName + "  " + res.data.user.lastName);
        setUsermail(res.data.user.email);
      })
      .catch((error) => {});
  const [catagory, setCatagory] = useState([]);
  const handelProperty = (event) => {
    let property = event.target.value;
    setSelectproperty(property);

    let userId = getUser().id;

    let token = "Bearer " + getToken();

    switch (property) {
      case "realEstate":
        getRealEstates(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});

        break;
      case "banks":
        getBank(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});

        break;
      case "investment":
        getInvestments(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});
        break;
      case "crypto":
        getCryptoAssests(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});
        break;
      case "jewelry":
        getJewelries(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});
        break;
      // case "insurance":
      //   lifeinsuranceGet(token, userId)
      //     .then((res) => {

      //       setCatagory(res);
      //     })
      //     .catch((err) => {});
      //   break;
      case "vehicle":
        getVehicle(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});
        break;
      case "credentials":
        credentialsGet(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});
        break;
      case "income":
        getIncome(token, userId)
          .then((res) => {
            setCatagory(res);
          })
          .catch((err) => {});
        break;
      default:
    }
  };

  const [beneficiary, setBenificiary] = useState([]);
  const getBenificiarydata = () => {
    let userId = getUser().id;

    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => {});
  };

  const [id, setSelectId] = useState();
  const [properties, setProperties] = useState([]);

  username &&
    getUserModel(username)
      .then((res) => {
        setName(res.data.user.firstName + "  " + res.data.user.lastName);
        setUsermail(res.data.user.email);
      })
      .catch((error) => {});

  const handleSendProperty = (e) => {
    e.preventDefault();

    if (username === "" || selectproperty === "" || id === null) {
      toast.warning("Please fill all the details!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    sendProperty({
      usernameString: username,
      propertyString: selectproperty,
      idLong: id,
    })
      .then((res) => {
        if (res.data === "") {
          toast.warning("Already this property assigned !!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          return;
        }

        toast.success("Property Send SuccessFully !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        getPropertyData();
      })
      .catch((err) => {});
  };

  const getPropertyData = () => {
    let user = getUser();
    const user1 = {
      userid: user.userid,
      id: user.id,
    };

    getproperty(user1)
      .then((res) => {
        setProperties(res.data);
      })
      .catch((err) => {});
  };

  const handleRemove = (id) => {
    deleteProperty(id)
      .then(() => {
        getPropertyData();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getBenificiarydata();
    getPropertyData();
  }, []);

  return (
    <>
      <UserBase className="property-main-page">
        <div className="share-property-page">
          <div className="Property-page1">
            {/* {JSON.stringify(data)} */}

            <div className="Property-sharepage">
              <Card className="Property-regcard">
                <CardHeader className="Property-cardheading">
                  <h3 className="Property-heading">Share Your Property</h3>
                </CardHeader>
                <CardBody className="Property-cardbody">
                  <Form onSubmit={handleSendProperty}>
                    {/* Select Property */}
                    <FormGroup className="Property-textfield">
                      <Label className="Property-headingname" for="property">
                        Select Your Property
                      </Label>
                      <Input
                        type="select"
                        name="select"
                        id="property"
                        className="Property-inputfiled"
                        onChange={(e) => {
                          handelProperty(e);
                        }}
                      >
                        <option defaultValue>Select Your Property</option>
                        <option value="realEstate">Real Estate</option>
                        <option value="banks">Banks</option>
                        <option value="investment">Investment</option>
                        <option value="crypto">Crypto Assest</option>
                        <option value="jewelry">Jewelry</option>
                        {/* <option value="insurance">Insurance</option> */}
                        <option value="vehicle">Vehicle</option>
                        <option value="credentials">Credentials</option>
                        <option value="income">Income</option>
                      </Input>
                    </FormGroup>

                    <FormGroup className="Property-textfield">
                      <Label className="Property-headingname" for="property">
                        Select{" "}
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#01318a",
                            textTransform: "uppercase",
                          }}
                        >
                          {selectproperty}
                        </span>{" "}
                        assest which you want to share
                      </Label>
                      <Input
                        type="select"
                        name="selectid"
                        id="property"
                        className="Property-inputfiled"
                        onChange={(e) => {
                          setSelectId(e.target.value);
                        }}
                      >
                        <option hidden>
                          -- Select Your {selectproperty} Property Details --
                        </option>
                        {selectproperty === "realEstate"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.realEstate.id}>
                                  {cat.realEstate.country}
                                </option>
                              );
                            })
                          : null}
                        {selectproperty === "banks"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.bank.id}>
                                  {cat.bank.bankName}
                                </option>
                              );
                            })
                          : null}
                        {selectproperty === "investment"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.investment.id}>
                                  {cat.investment.investment}
                                </option>
                              );
                            })
                          : null}
                        {selectproperty === "crypto"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.cryptoAssest.id}>
                                  {cat.cryptoAssest.coin}
                                </option>
                              );
                            })
                          : null}
                        {selectproperty === "jewelry"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.jewelry.id}>
                                  {cat.jewelry.jewelryName}
                                </option>
                              );
                            })
                          : null}
                        {/* {selectproperty === "insurance"
                          ? catagory.map((cat) => {
                            return (
                              <option value={cat.lifeInsurance_Id}>
                                {cat.details}
                              </option>
                            );
                          })
                          : null} */}
                        {selectproperty === "vehicle"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.vehicle.id}>
                                  {cat.vehicle.model}
                                </option>
                              );
                            })
                          : null}
                        {selectproperty === "credentials"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.credentials_Id}>
                                  {cat.nonFinancialAccount}
                                </option>
                              );
                            })
                          : null}
                        {selectproperty === "income"
                          ? catagory.map((cat) => {
                              return (
                                <option value={cat.income.id}>
                                  {cat.income.businessSource}
                                </option>
                              );
                            })
                          : null}
                      </Input>
                    </FormGroup>
                    {/* Enter Your Benificiary Username */}
                    <FormGroup className="Property-textfield">
                      <Label className="Property-headingname" for="property">
                        Select Your Benificiary Username
                      </Label>
                      <Input
                        className="Property-inputfiled"
                        type="select"
                        name="select"
                        id="property"
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                      >
                        {/* <option defaultValue aria-readonly>
                          Select Your Username
                        </option> */}
                        {beneficiary.map((benif) => {
                          return (
                            <option key={benif.username} value={benif.username}>
                              {benif.username}
                            </option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                    {/* Select Your Beneficiary Name */}
                    <FormGroup className="Property-textfield">
                      <Label className="Property-headingname" for="name">
                        Beneficiary Name
                      </Label>
                      <Input
                        className="Property-inputfiled"
                        type="text"
                        placeholder="Enter your Benificiary Name "
                        id="name"
                        value={name}
                        readOnly
                      />
                    </FormGroup>

                    {/* Input Your Benificiary Email */}
                    <FormGroup className="Property-textfield">
                      <Label className="Property-headingname" for="email">
                        Beneficiary Email
                      </Label>
                      <Input
                        className="Property-inputfiled"
                        type="email"
                        placeholder="Enter your Benificiary Email "
                        id="email"
                        value={usermail}
                        readOnly
                      />
                    </FormGroup>

                    <Container className="Property-loginbuttons">
                      <Button className="Property-clearbutton1" type="reset">
                        Clear
                      </Button>

                      <Button
                        className="Property-sendbutton1"
                        style={{ marginLeft: "20px" }}
                      >
                        SEND
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </div>
          {/* shaired property shows here */}
          <div className="Property-page2">
            {/* {JSON.stringify(data)} */}

            <div className="Property-sharedpage">
              <Card className="Property-regcard">
                <CardHeader className="Property-share-cardheading1">
                  <h3 className="Property-share-heading">
                    Properties You Share
                  </h3>
                </CardHeader>
                <CardBody className="Property-table-body">
                  <Table>
                    <thead
                      style={{
                        backgroundColor: "#ffffff",
                        position: "sticky",
                        marginTop: "-20px",
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      <tr>
                        <th>Sl.No</th>
                        <th>Beneficiary Username</th>
                        <th>Property Name </th>
                        <th>Property Details</th>
                        <th>Status</th>
                        <th>View Details</th>
                        <th>Actions</th>
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{property.username}</td>
                          <td>{property.propertyname}</td>
                          <td>
                            {/* {property.propertyid} */}
                            <Propertydetails
                              property={property.propertyname}
                              Id={property.propertyid}
                            />
                          </td>

                          <td>
                            {property.aprovebyUser ? (
                              <Button
                                style={{
                                  backgroundColor: "#ffffff",
                                  color: "#000000",
                                  border: " 2px solid #4aafff",
                                  width: "110px",
                                }}
                                disabled
                              >
                                Approved
                              </Button>
                            ) : (
                              <Button
                                style={{
                                  backgroundColor: "#ffffff",
                                  color: "#7d7d7d",
                                  border: " 2px solid #4aafff",
                                  width: "110px",
                                }}
                                disabled
                              >
                                Pending
                              </Button>
                            )}
                          </td>
                          <td>
                            {property.aproveBoolean ? (
                              <Benificiarydetailsbyuserm
                                getPropertyData={getPropertyData}
                                property={property}
                              />
                            ) : (
                              <Button
                                style={{
                                  backgroundColor: "#ffffff",
                                  color: "black",
                                  border: " 2px solid #4aafff",
                                  width: "110px",
                                }}
                                disabled
                              >
                                View
                              </Button>
                            )}
                          </td>
                          <td>
                            <Deletebutton
                              style={{
                                backgroundColor: "#ff7e7e",
                                color: "#5e0000",
                                border: "1px solid lightgray",
                                width: "105px",
                              }}
                              handleRemove={handleRemove}
                              Id={property.id}
                            >
                              Reject
                            </Deletebutton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
        {/* <Footer/> */}
      </UserBase>
    </>
  );
}
