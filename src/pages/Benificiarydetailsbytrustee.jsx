import React from "react";
import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  aproveByTrustee,
  aproveByUser,
  getFormdata,
  viewDetailsFalseByUser,
  viewDetailsfalse,
} from "../services/user-service";
import { toast } from "react-toastify";
export default function Benificiarydetailsbytrustee({ getdata, property, role }) {
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);

  const getDataBenificiary = (property) => {
   
    toggle();
    getFormdata(property)
      .then((res) => {
        //  const result=res.data.filter((obj)=>{
        //      return property.username===obj.user;
        //  })

        //  setData(result[result.length-1]);
        setData(res.data);
       
      })
      .catch((err) => {

      });
  };
  const handleViewdetails = (property) => {
    toggle();
    if(role === 'trustee') {
      viewDetailsfalse(property)
      .then((res) => {
        
        toast.success("RollBack Succesfully..... !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        getdata();
      })
      .catch((err) => {

      });
    } else {
      viewDetailsFalseByUser(property)
      .then((res)=> {

        toast.success("RollBack Succesfully..... !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      })
      .catch((err)=> {

      })
    }
    
  };

  const handleAprove = (property) => {

    toggle();
    if(role === 'trustee') {
      aproveByTrustee(property)
      .then((res) => {

        toast.success(
          "Aprove Successfully User can see Benificiarydetails..... !!",
          {
            position: toast.POSITION.BOTTOM_CENTER,
          }
        );
        getdata();
      })
      .catch((err) => {

      });
    } else {
      aproveByUser(property)
      .then((res) => {

        toast.success(
          "Aprove Successfully Trustee can generate will !!",
          {
            position: toast.POSITION.BOTTOM_CENTER,
          }
        );
      })
      .catch((err)=> {

      })
    }
  };

  return (
    <div>
      <Button
        color="info"
        onClick={() => {
          getDataBenificiary(property);
        }}
      >
        View
      </Button>
      <Modal isOpen={modal} toggle={toggle} style={{ marginTop: "67px" }}>
        <ModalHeader toggle={toggle}>Benificiary Details</ModalHeader>
        <ModalBody>
          <p>Benificiary Name : {data[0]?.name}</p>
          <p>Benificiary Email : {data[0]?.email}</p>
          <p>Benificiary DOB : {data[0]?.dob}</p>
          <p>Benificiary PAN Number : {data[0]?.panCardNumber}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => {
              handleViewdetails(property);
            }}
          >
            Rollback
          </Button>
          {property.aproveBoolean ? (
            <Button color="primary" disabled>
              Aproved
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                handleAprove(property);
              }}
            >
              Aprove
            </Button>
          )}{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
