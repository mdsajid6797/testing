import UserBase from "../components/user/UserBase";
import React, { useEffect, useState } from "react";
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
import Deletebutton from "./my-estate/Deletebutton";
import {
  getAllSharedPropety,
  getBeneficiary,
  getToken,
  getUser,
} from "../services/user-service";
import Benificiarydetailsbytrustee from "./Benificiarydetailsbytrustee";

export function SharedProperty() {
  const [properties, setProperties] = useState([]);

  const getPropertyData = () => {
    let userId = getUser().id;
    let token = "Bearer " + getToken();
    getAllSharedPropety(token, userId)
      .then((res) => {
        setProperties(res);
      })
      .catch((error) => {});
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

  const getBenificiaryName = (id) => {
    var foundBenificiary = null;
    if (id.beneficiary === undefined) {
      foundBenificiary = beneficiary.find((b) => b.id === parseInt(id));
    } else {
      foundBenificiary = beneficiary.find(
        (b) => b.id === parseInt(id.beneficiary)
      );
    }

    if (foundBenificiary) {
      return `${foundBenificiary.firstName} ${foundBenificiary.lastName}`;
    } else {
      return "Benificiary not found"; // Or handle the case where beneficiary with the given ID isn't found
    }
  };

  useEffect(() => {
    getBenificiarydata();
    getPropertyData();
  }, []);

  return (
    <>
      <UserBase>
        <div className="Property-page2">
          {/* {JSON.stringify(data)} */}

          <div className="Property-sharedpage">
            <Card className="Property-regcard">
              <CardHeader className="Property-share-cardheading1">
                <h3 className="Property-share-heading">Properties You Share</h3>
              </CardHeader>
              <CardBody
                className="Property-table-body"
                style={{ width: "100%" }}
              >
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
                      <th>Beneficiary Name</th>
                      <th>Property Name </th>
                      {/* <th>Property Details</th> */}
                      <th>Distributed Amount</th>
                      <th>Distributed Type</th>
                      <th>Distributed Value</th>
                      {/* <th>Status</th> */}
                      <th>View Details</th>
                      {/* <th>Approved By User</th> */}
                      {/* <th>Status</th> */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{getBenificiaryName(property.beneficiaryId)}</td>
                        {/* <td>{property.assetName.charAt(0).toUpperCase() + property.assetName.slice(1)}</td> */}
                        <td>
                          {property.assetName === "internationalAsset"
                            ? "Pending"
                            : property.assetName.charAt(0).toUpperCase() +
                              property.assetName.slice(1)}
                        </td>

                        <td>{property.distributedAmount}</td>
                        <td>{property.distributedType}</td>
                        <td>{property.distributedValue}</td>
                        {/* <td>{property.userApprove ? property.userApprove.toString() : "false"}</td> */}
                        <td>
                          {property.viewUser ? (
                            <Benificiarydetailsbytrustee
                              property={property}
                              role={"user"}
                            />
                          ) : (
                            <Button color="info" disabled>
                              View
                            </Button>
                          )}
                          {/* getdata={getdata} */}
                        </td>
                        <td>
                          <Deletebutton
                            style={{
                              backgroundColor: "#ff7e7e",
                              color: "#5e0000",
                              border: "1px solid lightgray",
                              width: "105px",
                            }}
                            // handleRemove={handleRemove}
                            // Id={property.id}
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
      </UserBase>
    </>
  );
}
