import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import "../../css/myestare.css";
import { bankGet, getToken, getUser } from "../../services/user-service";
import { Notification } from "../../components/alerting-visitors/notification";

function TrusteeBanks() {
  //hiding the bank account number other then last 4 digit
  const formatAccountNumber = (number) => {
    return number.replace(/\d(?=\d{4})/g, "*");
  };

  //show data in frontend
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().userid;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    bankGet(token, userId)
      .then((resp) => {
        console.log("Data -- : " + category[0]);
        setCategory(resp);
      })
      .catch((error) => {
        console.log(error);
        console.log("Data not loaded");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <TrusteeBase>
      <div className="mt-5"></div>
      <SideBar>
        <div style={{ marginTop: "30px" }}>
          <Notification />
        </div>

        {/* <div>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Container>
            <div className="property-container" style={{marginTop:"20px"}}>
              <bankDetails />
              <table id="table" className="property-table" cellSpacing={1000}>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Banks
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Account-Number
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    saftyBox
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Total-Amount
                  </th>
                  <th style={{ paddingRight: "20px", paddingLrft: "20px" }}>
                    document
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Notes
                  </th>
                </tr>
                {category.map((info, ind) => {
                  return (
                    <tr
                      key={ind}
                      style={{
                        height: "30px",
                        backgroundColor:
                          ind % 2 === 0 ? "rgb(226 238 243)" : "white",
                        fontWeight: "600",
                      }}
                    >
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.banks}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {formatAccountNumber(info.accountNo)}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.saftyBox}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        $ {info.totalAmount}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.exampleFile.split}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.notes}
                      </td>
                    </tr>
                  );
                })}
              </table>
              </div>
            </Container>
          </div>
        </div> */}
      </SideBar>

    </TrusteeBase>
  );
}

export default TrusteeBanks;
