import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { aproveByUser, getFormdata, viewDetailsfalse } from "../services/user-service";
import { toast } from "react-toastify";

export default function Benificiarydetailsbyuserm({ getPropertyData, property }) {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({});
  const toggle = () => setModal(!modal);

  // Get Benificiary Data
  const getData = (property) => {
    toggle();
    getFormdata(property)
      .then((res) => {
        const result = res.data.filter((obj) => {
          return property.username === obj.user;
        });
   
        setData(result[result.length - 1]);
      })
      .catch((err) => {
        
      });
  };

  // handle view detials true false
  const handleViewdetails = (property) => {
    toggle();
    viewDetailsfalse(property)
      .then((res) => {
        
        toast.success("RollBack Succesfully..... !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        getPropertyData();
      })
      .catch((err) => {
     
      });
  };

  // hanndle aprove
  const handleAprove = (property) => {
    toggle();
    aproveByUser(property)
      .then(() => {
        toast.success("Aprove Succesfully !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        getPropertyData();
      })
      .catch((err) => {
     
        toast.error("Aprove not Succesfully !!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  return (
    <div>
      <Button style={{  backgroundColor: "#ffffff", color: "black", border: " 2px solid #4aafff", width: "110px"  }}
        onClick={() => {
          getData(property);
        }}
      >
        View
      </Button>
        <Modal style={{marginTop:"65px"}} isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Benificiary Details</ModalHeader>
          <ModalBody style={{color:"black"}}>
            <p>Benificiary Name : {data.name}</p>
            <p>Benificiary Email : {data.email}</p>
            <p>Benificiary DOB : {data.dob}</p>
            <p>Benificiary PAN Number : {data.panCardNumber}</p>
          </ModalBody>
          <ModalFooter >
            {property.aprovebyUser ? (
              <Button  disabled style={{  backgroundColor: "#ffffff",color:"black" , border: " 2px solid #4aafff", width: "110px"}}>
                Aproved
              </Button>
            ) : (
              <>
                <Button
                 style={{  backgroundColor: "#ffffff", color: "#000000", border: " 2px solid #4aafff", width: "110px"}}
                  onClick={() => {
                    handleViewdetails(property);
                  }}
                >
                  Rollback
                </Button>
                <Button
                 style={{  backgroundColor: "#ffffff", color: "#000000", border: " 2px solid #4aafff", width: "110px"}}
                  onClick={() => {
                    handleAprove(property);
                  }}
                >
                  Approve
                </Button>
              </>
            )}{" "}
            <Button onClick={toggle} style={{  backgroundColor: "#ffffff", color: "#000000", border: " 2px solid #4aafff", width: "110px"  }}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
    </div>
  );
}
