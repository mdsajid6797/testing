import React, { useEffect, useState } from 'react';
import { Card } from "reactstrap";
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
import SideBar from "../../components/sidebar/Sidebar";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import { useLocation } from "react-router-dom";
import { aproveByTrustee, getFormdata, viewDetailsfalse } from '../../services/user-service';
import { toast } from "react-toastify";

export default function Benificiarydetails() {
  const location=useLocation();
  const property=location.state?.property;

  const [data,setData]=useState({});
  
  const getData=()=>{
       getFormdata(property).then((res)=>{
        const result=res.data.filter((obj)=>{
            return property.username===obj.user;
        })

        setData(result[result.length-1]);
      }).catch((err)=>{

      })
  }

  const handleViewdetails=()=>{
    viewDetailsfalse(property).then((res)=>{

        toast.success("RollBack Succesfully..... !!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    }).catch((err)=>{

    })
  }

  const handleAprove=()=>{
    aproveByTrustee(property).then((res)=>{

        toast.success("Aprove Successfully User can see Benificiarydetails..... !!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    }).catch((err)=>{

    })
  }

useEffect(() => {
   getData();

}, []);
  return (
    <TrusteeBase>
    <Card className="profile" style={{ flex: "5", marginLeft: "3vh" ,width:"60vw",marginTop:"10vh" }}>
    <CardBody>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Beneficiary Name</th>
            <th>Beneficiary Email</th>
            <th>Beneficiary DOB</th>
            <th>Beneficiary PAN Card Number</th>
            <th>Beneficiary Pan Card Details</th>
            <th>Actions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>0</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.dob}</td>
                <td>{data.panCardNumber}</td>
                <td>{data.exampleFile}</td>
                <td>{!property.aproveBoolean&&<Button color="success" onClick={handleViewdetails}>Rollback</Button>}</td>
                <td>{!property.aproveBoolean&&<Button color="success" onClick={handleAprove}>Aprove</Button>}</td>
            </tr>

        </tbody>
      </Table>
    </CardBody>
  </Card>
  </TrusteeBase>
  )
}
