import React from "react";
import {
  Card,
  Button,
  CardBody,
  CardHeader,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { aproveByUser, getFormdata, viewDetailsfalse } from "../services/user-service";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Benificiarydetailsbyuser() {
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state?.property;



  const [data, setData] = useState({});


  const getData = () => {
    getFormdata(property).then((res) => {
      const result = res.data.filter((obj) => {
        return property.username === obj.user;
      })
     
      setData(result[result.length - 1]);
    }).catch((err) => {
    
    })
  }

  const handleViewdetails = () => {
    viewDetailsfalse(property).then((res) => {
   
      toast.success("RollBack Succesfully..... !!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      navigate("/shareproperty");
    }).catch((err) => {

    })
  }

  const handleAprove = () => {
    aproveByUser(property).then(() => {
      toast.success("Aprove Succesfully !!", { position: toast.POSITION.BOTTOM_CENTER, });
      navigate("/shareproperty");
    }).catch((err) => {

      toast.error("Aprove not Succesfully !!", { position: toast.POSITION.BOTTOM_CENTER, });
    })

  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card className="profile" style={{ width: "40vw", height: "75vh" }}>
        <CardHeader className="cardheading" style={{ textAlign: "center" }}>
          <h2 className="heading">Benificiary Details</h2>
        </CardHeader>
        <CardBody>
          <div style={{ marginLeft: "3vw" }}>
            <div style={{ margin: "1rem" }}>
              <h5>Benificiary Name </h5>
              <span>{data.name}</span>
            </div>
            <div style={{ margin: "1rem" }}>
              <h5>Beneficiary Email  </h5>
              <span>{data.email}</span>
            </div>
            <div style={{ margin: "1rem" }}>
              <h5>Beneficiary DOB  </h5>
              <span>{data.dob}</span>
            </div>
            <div style={{ margin: "1rem" }}>
              <h5>Beneficiary PAN Card Number </h5>
              <span>{data.panCardNumber}</span>
            </div>
          </div>
          <div style={{ marginLeft: "13vw", marginTop: "5vh" }}>
            {property.aprovebyUser ? <Button color="info" style={{ marginLeft: "18px" }} disabled>Aproved</Button> : <><Button color="warning" style={{ marginRight: "2px" }} onClick={handleViewdetails}>Rollback</Button>
              <Button color="success" onClick={handleAprove}>Approve</Button></>}

          </div>
        </CardBody>
      </Card>
    </div>
  );
}
