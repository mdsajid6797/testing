import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import Footer from "../../components/Footerfile/footer";
import BeneficiryBase from "../../components/beneficiary/BeneficiaryBase";
import SideBar from "../../components/sidebar/Sidebar";
import { getBeneficiary, getToken, getUser, getproperty } from "../../services/user-service";
import Propertydetails from "../Propertydetails";
import { TableBody, TableHead, TableRow } from "@mui/material";
import "./../../pages/trustee-route/TrusteeDashboard.css"
const Beneficirydashboard = ({ xyz }) => {
  const [properties, setProperties] = useState([]);
  
  let user = getUser();
 
  const user1 = {
    userId: user.userId,
    id: user.id,
  }
  useEffect(() => {
    const user1 = {
      userid: user.userid,
      id: user.id,
    }
    getproperty(user1)
      .then((res) => {
      
        // let username = user.username;
        // const result = res.data.filter((obj) => {
        //   return username == getBenificiaryName(parseInt(obj.username));
        // });
        // setFilterProperty(res.data);
        setProperties(res.data)
      })
      .catch((err) => {
        
      });
  }, []);

  

  const [beneficiary, setBenificiary] = useState([]);
  const getBenificiarydata = () => {
    let userId = user.userid;

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
     
      return `${foundBenificiary.username}`;
    } else {
      return "Benificiary not found"; // Or handle the case where beneficiary with the given ID isn't found
    }
  };

  useEffect(() => {
    getBenificiarydata();
  }, []);

  return (
    <BeneficiryBase>
      <div className="mt-5"></div>
      <SideBar>
        <container>
          <div
            className="homepage"
            style={{ display: "flex", width: "84vw", height: "auto" }}
          >
            {/* <Card className="profile" style={{ backgroundColor: "#ebebeb" ,width:"400px"}}>
              <img
                className="profilepic"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="React"
                style={{borderRadius:"50%"}}
              ></img>
              <name className="name" style={{ color: "black" }}>
                {user.firstName + " "}
                {user.lastName}
              </name>
              <username className="profilealign">
                User Name : {user.username}
              </username>
              <email className="profilealign">Email ID : {user.email}</email>
              <userid className="profilealign">User ID:{user.id}</userid>
              <role className="profilealign">Role : {user.role} </role>
            </Card> */}
            <Card
              style={{
                height: "fitContent",
                minHeight: "50px",
                maxHeight: "100vh",
              }}
            >
              <CardHeader style={{ backgroundColor: "#dcd2d2" }}>
                <h3 className="heading">Get Property From User...</h3>
              </CardHeader>
              <CardBody style={{ width: "100%", overflow: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <th className="tabe_rowsl">S.N</th>
                      <th className="tabe_row">Property Name</th>
                      <th className="tabe_row">Property Details</th>
                      <th className="tabe_row">Property From</th>
                      <th className="tabe_row">Actions</th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {properties
                      .filter(
                        (property) =>
                          getBenificiaryName(parseInt(property.username)) ===
                          user.username
                      )
                      .map((property, index) => (
                        <TableRow key={index} style={{textAlign: 'center'}}>
                          <th style={{textAlign: 'start'}} scope="row">{index + 1}</th>
                          <td>{property.propertyname}</td>
                          <td>
                            <Propertydetails
                              property={property.propertyname}
                              Id={property.propertyid}
                            />
                          </td>
                          <td>
                            {property.user.firstName +
                              " " +
                              property.user.lastName}
                          </td>
                          <td>
                            {property.initiateBoolean &&
                            !property.viewBoolean ? (
                              <Button color="info">
                                <Link
                                  to="/beneficiary/beneficiryform"
                                  style={{ textDecoration: "none" }}
                                  state={{ property: property }}
                                >
                                  Apply
                                </Link>
                              </Button>
                            ) : (
                              <Button color="info" disabled>
                                Apply
                              </Button>
                            )}
                          </td>
                        </TableRow>
                      ))}

                    {/* <tr>
                      <th scope="row">1</th>
                      <td>Real Estate</td>
                      <td>Otto</td>
                      <td><Button
                      href="/beneficiry/beneficiryform"
                      >Apply</Button></td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Banks</td>
                      <td>Thornton</td>
                      <td><Button
                       href="/beneficiry/beneficiryform"
                      >Apply</Button></td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Vehicle</td>
                      <td>the Bird</td>
                      <td><Button
                       href="/beneficiry/beneficiryform"
                      >Apply</Button></td>
                    </tr> */}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </container>
      </SideBar>
      {/* <div>
        <Footer />
      </div> */}
    </BeneficiryBase>
  );
};

export default Beneficirydashboard;
