import {
    TextField,
    Tooltip
} from "@mui/material";
import {
    FormGroup,
    Input,
    Label
} from "reactstrap";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "../../css/formPOPup.css";
import "../../css/myestare.css";
import { getBeneficiary, getToken, getUser } from "../../services/user-service";
import "./beneficiaryDevision.css";

const BeneficiaryByPercentage = ({ showBeneficiary,closeBeneficiary,total1 }) => {

    
    let [benePropVisible,setBenePropVisible] = useState(showBeneficiary);
    

    // total estimate value cal 
    let [total,setTotal] = useState(total1)



    // beneficiary addition in form 
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
    useEffect(() => {
        getBenificiarydata();
    }, []);

    // adding bene..
    let [bene, setBene] = useState("");
    const values = (e) => {
        setBene(e.target.value)
    }

    // going back to option one in bene slect
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);
        // setSelectedValue('');
    };

    // adding values to usestate for table sending purpose
    let [name, setName] = useState("");
    let [method, setMethod] = useState("");
    let [amount, setAmount] = useState(0);

    const addvalues = (e) => {
        setName(e.target.value);
    }

    // on percentage selected create new column 
    let [createDiv, setCreateDiv] = useState(false)
    // on dollar selected create new column 
    let [createDiv1, setCreateDiv1] = useState(false)


    const addmethod = (e) => {
        setMethod(e.target.value);

        if (e.target.value === 'percentage') {
            setCalAmount(0)
            setCreateDiv(true)
            setCreateDiv1(false)

        }
        else if (e.target.value === 'dollar') {
            setCalAmount(0)
            setCreateDiv1(true)
            setCreateDiv(false)
        }
        else {
            setCalAmount(0)
            setCreateDiv1(false)
            setCreateDiv(false)
        }
    }
    const addamount = (e) => {
        setAmount(e.target.value);
    }

    // calculate percentage and setting  calculate amount  
    let [calAmount,setCalAmount] = useState(0)

    const calPercentage = (e)=>{
        if(e.target.value <=100){

            setCalAmount((e.target.value * total)/100);
        }else{
            e.target.value=100;
            setCalAmount((e.target.value * total)/100);
        }
    }

    // calculate amount and setting  calculate amount  
    let [manuallAmount,setManuallAmount] = useState(0)

    const  calAmountmannully = (e)=>{
        if(e.target.value <= total){
            setCalAmount(e.target.value)
        }
        else{
            e.target.value=total;
            setCalAmount(e.target.value)
        }
    }


//     const formData= (event)=>{

//         event.preventDefault();
//         let token = "Bearer " + getToken();
//         const formData = new FormData();
//         addInternationalAssest(formData)
//       .then((resp) => {



//         toast.success("Data Added !!", {
//           position: toast.POSITION.BOTTOM_CENTER,
//         });
//         resetData();
//         getData();
//         AddCard();
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };
    // }

    // bene_percentage: 0,
    //   bene_amount: 0,
    //   bene_per_cal_amount: 0,
    //   bene_leftover_amount:0,
    //   method: 0,

    return (
        <>
            {benePropVisible &&(

                <div className="bene-container">
                    <h2 style={{ textAlign: "center", padding: "10px" }}>Beneficiary Selection</h2>

                    <div className="bene-close-Btn">
                        <Tooltip title="double click to close">
                            <button onClick={() => { setBenePropVisible(closeBeneficiary) }} >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="bene-element">
                        <FormGroup className="Property-textfield">
                            <Label className="Property-headingname" for="property">
                                Select Your Beneficiary Username
                            </Label>
                            
                            <Input
                                required
                                className="Property-inputfiled"
                                type="select"
                                name="select"
                                id="property"
                                onChange={(e) => { handleChange(e); values(e) }}
                                value={selectedValue}
                            >
                                <option defaultValue aria-readonly>
                                    <p>Select Your Beneficiary Username</p>
                                </option>
                                {beneficiary.map((benif) => (
                                    <option key={benif.username} value={benif.username}>
                                        {benif.username}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </div>

                    <div className="bene-data-division">

                        <div className="enterPercentage">
                            <Tooltip title="Selected Beneficiary">
                                <TextField
                                    fullWidth
                                    label="Selected Beneficiary"
                                    required
                                    type="text"
                                    id="enterPercentage"
                                    size="normal"
                                    checked onChange={(e) => addmethod(e)}
                                    // onChange={(e) => handleChanges(e, "estPropertyVal")}
                                    value={bene}
                                    disabled
                                />
                            </Tooltip>
                        </div>



                        <div>

                            <Tooltip title="select the Devision method">
                                <select style={{ width: "100%",height:"35px" }
                                } onChange={(e) => addmethod(e)} required>
                                    <option value="">Select Method *</option>
                                    <option value={"percentage"}>%</option>
                                    <option value={"dollar"}>$</option>
                                </select>
                            </Tooltip>
                        </div>
                        {createDiv && (
                            <>
                                <div className="enterPercentage">
                                    <Tooltip title="Enter Percentage">
                                        <TextField
                                            fullWidth
                                            required
                                            type="number"
                                            label="Percentage"
                                            id="enterPercentage"
                                            size="normal"
                                            onChange={(e) => calPercentage(e)}
                                            // value={data.estPropertyVal}
                                            // onClick={() => setIsTextFieldClicked2(true)}
                                            InputProps={{
                                                endAdornment: <div>%</div>,
                                            }}
                                        />
                                    </Tooltip>
                                </div>

                                <div className="percentageCalculated">
                                    <Tooltip title="Calculated Percentage Amount">
                                        <TextField
                                            fullWidth
                                            required
                                            type="number"
                                            label="Calculated Amount"
                                            id="calper"
                                            size="normal"
                                            value={calAmount}
                                        // onClick={() => setIsTextFieldClicked2(true)}

                                        />
                                    </Tooltip>
                                </div>
                            </>
                        )}


                        {createDiv1 && (
                            <>
                                <div className="estimated-amount">
                                    <Tooltip title="Enter Amount">
                                        <TextField
                                            fullWidth
                                            required
                                            type="number"
                                            label="Amount"
                                            id="amount"
                                            size="normal"
                                            // onChange={(e) => handleChanges(e, "estPropertyVal")}
                                            // onChange={(e) => addamount(e)}
                                            onChange={(e) => calAmountmannully(e)}


                                        // onClick={() => setIsTextFieldClicked2(true)}

                                        />
                                    </Tooltip>
                                    {/* <input type="number" onChange={(e) => addamount(e)} /> */}
                                </div>
                            </>
                        )}

                        <div className="amount-pending">
                            <Tooltip title="Total Estimated value">
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Total Estimated value"
                                    id="TotalEstimatedValue"
                                    size="normal"
                                    // onChange={(e) => handleChanges(e, "estPropertyVal")}
                                    onChange={(e) => addamount(e)}
                                    value={total-calAmount}
                                    

                                // onClick={() => setIsTextFieldClicked2(true)}

                                />
                            </Tooltip>
                            
                        </div>


                    </div>

                    <div className="Savees">
                        <button type="submit">Save</button>
                    
                    
                        <button type="reset" >Clear</button>
                    </div>

                    {/* <div className="bene-table-showData">
                        <div className="property_table">
                            <Container className="myestate-container">
                                <Paper sx={{ width: "100%", overflow: "hidden", border: "1px solid #cbcbcb", padding: "0px 10px" }}>
                                    <TableContainer sx={{ maxHeight: "580px", overflowX: "scroll" }}>
                                        <Table stickyHeader >
                                            <TableHead>

                                            <TableRow >
                                                  

                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination />
                                </Paper>
                            </Container>
                        </div>
                    </div> */}
                </div>
            )}
        </>
    )

}
export default BeneficiaryByPercentage;


