import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import { credentialsGet, getToken, getUser } from "../../services/user-service";
//import axios from "axios";
import "../../css/myestare.css";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import Footer from "../../components/Footerfile/footer";
import { Notification } from "../../components/alerting-visitors/notification";

function TrusteeCredentials() {
  //get form
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().userid;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    credentialsGet(token, userId)
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
        <div>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Container>
              <table id="table" className="property-table" cellSpacing={1000}>
                <tr style={{ height: "50px" }}>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    nonFinancialAccount
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
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
                        {info.nonFinancialAccount}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.exampleFile.split}
                      </td>
                      <td style={{ paddignRight: "20px", paddingLeft: "20px" }}>
                        {info.notes}
                      </td>
                    </tr>
                  );
                })}
              </table>
            </Container>
          </div>
        </div>
      </SideBar>
    </TrusteeBase>
  );
}

export default TrusteeCredentials;
