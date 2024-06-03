import React from "react";
import { Card, Label, NavLink } from "reactstrap";
import Base from "../../components/Base";
import SideBar from "../../components/sidebar/Sidebar";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import "./TrusteeDashboard.css";
import { NavLink as ReactLink } from "react-router-dom";
import {
  aproveByTrustee,
  getAllSharedPropety,
  getBeneficiary,
  getFormdata,
  getToken,
  getUser,
  getUserModelById,
  getproperty,
  initiateProperty,
  pdfGenerate,
  viewDetailsfalse,
} from "../../services/user-service";
import {
  Button,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
// import ReactPDF from 'react-pdf';
// import { saveAs } from 'file-saver';
// import PDFFile from "./PDFFile";
import axios from "axios";
// import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Benificiarydetailsbytrustee from "../Benificiarydetailsbytrustee";
import Propertydetails from "../Propertydetails";
import Footer from "../../components/Footerfile/footer";
import { TableBody, TableHead, TableRow } from "@mui/material";

export default function Userdashboard() {
  const [properties, setProperties] = useState([]);
  const [benProperties, setBenProperties] = useState([]);
  let user = getUser();
  console.log("hello",user);
  // const [modal, setModal] = useState(false);
  // const toggle = () => setModal(!modal);
  // const [data,setData]=useState({});

  //   const getDataBenificiary=(property)=>{
  //     toggle();
  //     getFormdata(property).then((res)=>{
  //      const result=res.data.filter((obj)=>{
  //          return property.username===obj.user;
  //      })
  //      console.log(result[result.length-1]);
  //      setData(result[result.length-1]);
  //    }).catch((err)=>{
  //      console.log(err);
  //      console.log("error.........");
  //    })
  // }

  const handleInitiate = (property) => {
    initiateProperty(property)
      .then((res) => {
        toast.success("Property Initiate SuccessFully !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // getdata();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const handleDownloadPDF = async () => {
  //   const pdfContent = PDFFile();
  //   const pdfBlob = await ReactPDF.renderToBlob(pdfContent);

  //   saveAs(pdfBlob, 'my-document.pdf');
  // };

  // const handleGenerate=()=>{
  //   const data=pdfGenerate();
  //   const blob = new Blob([data.data], { type: 'application/octet-stream' });
  //     const downloadUrl = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.download = 'BenificiaryProperty.pdf'; // Set the desired file name and extension
  //     link.click();
  //     URL.revokeObjectURL(downloadUrl);
  // }
  const handleGenerate = (property) => {
    const token = getToken(); // Replace with your actual token 
    console.log("property details : " + property);
    pdfGenerate(property)
      .then((response) => {
        console.log("response : " + response);
        const downloadUrl = URL.createObjectURL(response.data);
        console.log(downloadUrl);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${getBenificiaryName(property.beneficiaryId)}_${property.assetName}_${property.id}.pdf`; // Set the desired file name and extension
        link.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        // Handle the error
        console.log("error : " + error);
      });
  };
  const getData = () => {
    getproperty(user)
      .then((res) => {
        console.log(res);
        const result = res.data;
        setBenProperties(result);
      })
      .catch((err) => {
        console.log("Error..." + err);
      });
  };
  // const handleViewdetails=(property)=>{
  //   toggle();
  //   viewDetailsfalse(property).then((res)=>{
  //       console.log("Trustee Can't see...... view details");
  //       toast.success("RollBack Succesfully..... !!", {
  //           position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //   }).catch((err)=>{
  //       console.log("Error..............");
  //       console.log(err);
  //   })
  // }

  // const handleAprove=(property)=>{
  //   toggle();
  //   aproveByTrustee(property).then((res)=>{
  //       console.log(res);
  //       toast.success("Aprove Successfully User can see Benificiarydetails..... !!", {
  //           position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //       getdata();
  //   }).catch((err)=>{
  //       console.log("Error.......");
  //       console.log(err);
  //   })
  // }

  // useEffect(() => {
  //   getproperty(user)
  //     .then((res) => {
  //       console.log(res);
  //       const result = res.data;
  //       setProperties(result);
  //     })
  //     .catch((err) => {
  //       console.log("Error... " + err);
  //     });
  // }, []);

  // 
  const [user1, setUser1] = useState([]);
  const getUserDetail = () => {
    getUserModelById(user.userid)
    .then((res) => {
      setUser1(res);
      // console.log("user detail ",res.data.user);
      // console.log("user detail 1 ",user1);
    })
    .catch((err) => console.log(err)); 
  }

  const [beneficiary, setBenificiary] = useState([]);
  const getBenificiarydata = () => {
    let userId = user.userid;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => console.log(err));
  };

  const getBenificiaryName = (id) => {
    console.log("getBenificiaryName id : ", id);
    var foundBenificiary = null;
    if (id.beneficiary === undefined) {
      console.log("IF condition");
      foundBenificiary = beneficiary.find((b) => b.id === parseInt(id));
    } else {
      foundBenificiary = beneficiary.find(
        (b) => b.id === parseInt(id.beneficiary)
      );
    }
    console.log("foundBenificiary details : ", foundBenificiary);
    if (foundBenificiary) {
      return `${foundBenificiary.firstName} ${foundBenificiary.lastName}`;
    } else {
      return "Benificiary not found"; // Or handle the case where beneficiary with the given ID isn't found
    }
  };

  const getPropertyData = () => {
    let userId = user.userid;
    let token = "Bearer " + getToken();
    getAllSharedPropety(token, userId)
      .then((res) => {
        console.log("data:", res);
        setProperties(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getBenificiarydata();
    getPropertyData();
    getUserDetail();
    getData();
  }, []);

  return (
    <TrusteeBase>
      <div className="mt-5"></div>
      <SideBar>
        <container>
          <div className="homepage" style={{ display: "flex", width: "80vw",height:"auto" }}>
            {/* <Card className="profile" style={{ flex: "2" }}>
              <img
                className="profilepic"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="React"
              ></img>
              <name className="name" style={{color:"black"}}>
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
            <Card style={{overflow:"auto",height:"fitContent",minHeight:"50px",maxHeight:"100vh"}}>
              <CardBody>
                <Table >
                  <TableHead >
                    <TableRow >
                        <th className="tabe_rowsl">S.N</th>
                        <th className="tabe_row">Beneficiary Name</th>
                        {/* <th>View Details</th> */}
                        <th className="tabe_row">Property Name</th>
                        <th className="tabe_row">Property Details</th>
                        <th className="tabe_row">Property From</th>
                        <th className="tabe_row">View Details</th>
                        <th className="tabe_row">Actions</th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {properties.map((property, index) => (
                      <TableRow key={index} style={{textAlign: 'center'}}>
                        <td style={{textAlign: 'start'}} scope="row">{index + 1}</td>
                        <td>{getBenificiaryName(property.beneficiaryId)}</td>
                        

                        <td>
                          {property.assetName === "internationalAsset"
                            ? "Pending"
                            : property.assetName.charAt(0).toUpperCase() +
                              property.assetName.slice(1)}
                        </td>
                        <td>
                          {/* {property.propertyid} */}
                          {/* <Propertydetails property={property.propertyname} Id={property.propertyid} /> */}
                          
                        </td>
                        <td>
                          {user1?.data?.user?.firstName +
                            " " +
                            user1?.data?.user?.lastName}
                        </td>
                        <td>
                          {property.viewTrustee ?
                            <Benificiarydetailsbytrustee property={property} role={'trustee'} />
                            : <Button color="info" disabled>View</Button>
                          }
                        </td>
                        <td style={{display: 'flex'}}>
                          {property.userApprove ?
                            <Button
                              color="success"
                              onClick={() => {
                                handleGenerate(property);
                              }}
                            >
                              Generate
                            </Button> : <Button color="success" disabled>Generate</Button>
                          }

                          {property.initiateBoolean ? (
                            <Button color="warning" style={{ marginLeft: "10px", width: "94px", marginbuttom: "auto" }} disabled>Initiated</Button>
                          ) : (
                            <Button
                              color="warning"
                              onClick={() => {
                                handleInitiate(property);
                              }}
                              style={{ marginLeft: "10px", width: "94px" }}
                            >
                              Initiate
                            </Button>
                          )}
                        </td>
                      </TableRow>
                    ))}
                    
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
    </TrusteeBase>
  );
}
