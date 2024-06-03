import {
  TextField,
  Tooltip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import SideBar from "../../../components/sidebar/Sidebar";
import UserBase from "../../../components/user/UserBase";
import {
  getLifeInsurance,
  getToken,
  updateLifeInsurance,
  getUser,
  getBeneficiary
} from "../../../services/user-service";
import { faXmark, faPlus, faDownload, faLocationDot, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../css/formPOPup.css";


import "../../../css/myestate_edit.css";
import { getSingleInsurance, updateInsurance } from "../../../services/InsuranceService";
function EditLifeInsurance() {
  const { id } = useParams();
  const navigate = useNavigate();
  // set Add data
  const [data, setData] = useState({
    insurance: {
      insuranceCaption: "",
      details: "",
      detailsOfpoint: "",
      notes: "",
    },
    sharedDetails: [
      {
        distributedType: "",
        distributedValue: "",
        distributedAmount: "",
        beneficiaryId: "",
      },
    ],
  });

  // use state to set the selected images
  const [selectedImage, setSelectedImage] = useState([]);

  // Handle image
  const handleImageChange = (event) => {
    const selectedFiles = event.target.files;
    const allowedExtensions = ['pdf'];

    if (selectedFiles) {
      const selectedFilesArray = Array.from(selectedFiles);

      // Check each file's extension
      const invalidFiles = selectedFilesArray.filter((file) => {
        const fileNameParts = file.name.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
        return !allowedExtensions.includes(fileExtension);
      });

      if (invalidFiles.length === 0) {
        const formData = new FormData();

        selectedFilesArray.forEach((file, index) => {
          formData.append(`file${index + 1}`, file);
        });
        setSelectedImage(selectedFilesArray);
      } else {
        const invalidExtensions = invalidFiles.map((file) => file.name.split('.').pop()).join(', ');
        toast.error(`Invalid file extensions: ${invalidExtensions}. Please select valid document formats.`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        event.target.value = ''; // Clear the input field
      }
    }
  };

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  // const handleChanges = (event, property) => {
  //   setData({ ...data, [property]: event.target.value });
  // };

  const handleChanges = (e, field) => {
    const newValue = e.target.value;
    setData((prevData) => ({
      ...prevData,
      insurance: {
        ...prevData.insurance,
        [field]: newValue,
      },
    }));
  };

  // const resetData = () => {
  //   setData({
  //     lifeInsurance_Id: lifeInsurance_Id,
  //     details: "",
  //     // supportingDcument: "",
  //     detailsOfpoint: "",
  //     notes: "",
  //     benificiary: "",
  //     insuranceCaption: ""
  //   });
  // };

  // post the form
  const lifeForm = (event) => {
    event.preventDefault();
    let token = "Bearer " + getToken();
    const formData = new FormData();
    if (null != selectedImage) {
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(`files`, selectedImage[i]);
        console.log("this is file indexs", selectedImage[i]);
      }
    }
    formData.append("data", JSON.stringify(data));
    console.log("formData : ", JSON.stringify(data));

    updateInsurance(formData, token)
      .then((resp) => {
        toast.success("Updated Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        navigate("/user/my-estate/insurances");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  // Set the form
  // const lifeForm = (event) => {
  //   event.preventDefault();

  //   if (
  //     data.details === "" ||
  //     data.detailsOfpoint === ""
  //   ) {
  //     console.log("Error log");
  //     toast.error("Please fill all required fields.");
  //     return;
  //   }

  //   let token = "Bearer " + getToken();

  //   console.log("Token : " + token);

  //   //create form data to send a file and remaining class data
  //   const formData = new FormData();
  //   for (let i = 0; i < selectedImage.length; i++) {
  //     formData.append(`filename`, selectedImage[i]);
  //     console.log("this is file indexs", selectedImage[i])
  //   }
  //   formData.append("data", JSON.stringify(data));

  //   updateLifeInsurance(formData, token, lifeInsurance_Id)
  //     .then((resp) => {
  //       console.log(resp);
  //       console.log("Success log");
  //       toast.success("Updated Successfully !!", {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //       navigate("/user/my-estate/insurances");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       console.log("Error log");
  //       // handle error
  //       setError({
  //         errors: error,
  //         isError: true,
  //       });
  //     });
  // };

  const getData = () => {
    let token = "Bearer " + getToken();
    getSingleInsurance(token, id).then((res) => {
      console.log("this is insurance responce ", res);
      setData({
        ...data,
        insurance: res.insurance,
        documents: res.documents,
        sharedDetails: res.sharedDetails,
      });
      // setEstimatedTotalAmount(res.realEstate.estPropertyVal);
    });
  };
  //get data from the insurance table for editing purpose
  // const getData = () => {
  //   let token = "Bearer " + getToken();
  //   getLifeInsurance(token, lifeInsurance_Id)
  //     .then((res) => {
  //       setData({
  //         ...data,
  //         details: res.details,
  //         detailsOfpoint: res.detailsOfpoint,
  //         notes: res.notes,
  //         // supportingDcument: res.supportingDcument,
  //         benificiary: res.benificiary,
  //         insuranceCaption: res.insuranceCaption
  //       });
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       console.log("Data not loaded");
  //     });
  // };

  useEffect(() => {
    getData();
  }, []);

  // beneficiary addition in form 
  const [beneficiary, setBenificiary] = useState([]);
  const getBenificiarydata = () => {
    let userId = getUser().id;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    getBeneficiary(token, userId)
      .then((res) => {
        setBenificiary(res);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getBenificiarydata();
  }, []);
  return (
    <UserBase>
      <div className="mt-5"></div>
      <SideBar>
        <div className="overlay1-edit">
          <div
            className="propertyform"
            style={{ display: "flex", justifyContent: "left" }}
          >
            <Container className="edit_container">
              <Card color="" outline>
                <CardHeader>
                  <h3 className="form1-heading">Edit Life Insurance</h3>
                  <div className="Close" onClick={() => { { navigate("/user/my-estate/insurances") } }}>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={lifeForm}>
                    <div className="mt-3">
                      <Tooltip title="Enter the name your insurance ">
                        <TextField
                          fullWidth
                          required
                          type="text"
                          label="Details"
                          id="details"
                          size="normal"
                          onChange={(e) => handleChanges(e, "details")}
                          value={data.insurance.details}
                        />
                      </Tooltip>
                    </div>

                    <div className="form1-double" style={{ display: "flex", gap: "5px", width: "100%" }}>
                      <div className="mt-3" style={{ width: "100%" }}>
                        <Tooltip title="Enter your Details of Point Contact Name ">
                          <TextField
                            fullWidth
                            required
                            type="text"
                            label="Point of Contact Name"
                            id="detailsOfpoint"
                            size="normal"
                            onChange={(e) => handleChanges(e, "detailsOfpoint")}
                            value={data.insurance.detailsOfpoint}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Add your insurance related file">
                        <label style={{ display: 'block', marginBottom: '5px' }}>Supporting Document<span ></span></label>
                        <input
                          style={{
                            border: "solid 1px lightgray",
                            borderLeft: "none",
                            width: "100%",
                            borderRadius: "5px",
                          }}
                          multiple
                          type="file"
                          name="myfile"
                          id="exampleFile"
                          onChange={handleImageChange}
                          accept=".pdf"
                        />
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <Tooltip title="Enter Caption of Insurances ">
                        <TextField
                          fullWidth
                          required
                          type="text"
                          label="Insurance Caption"
                          id="Insurance Caption"
                          size="normal"
                          onChange={(e) => handleChanges(e, "insuranceCaption")}
                          value={data.insurance.insuranceCaption}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-3">
                      <Tooltip title="Enter notes for your insurance">
                        <TextField
                          fullWidth
                          type="text"
                          label="Notes"
                          id="notes"
                          size="normal"
                          onChange={(e) => handleChanges(e, "notes")}
                          value={data.insurance.notes}
                        />
                      </Tooltip>
                    </div>
                    <Container className="text-center" style={{ display: "flex", justifyContent: "center" }}>
                      <Button outline className="my-estate-add-btn">
                        Update
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
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

export default EditLifeInsurance;
