import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import {
  cryptoassetsGet,
  getToken,
  getUser,
} from "../../services/user-service";
import "../../css/myestare.css";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import Footer from "../../components/Footerfile/footer";
import { Notification } from "../../components/alerting-visitors/notification";

function Crypto() {
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().userid;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    cryptoassetsGet(token, userId)
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
        <div>
        <div style={{ marginTop: "30px" }}>
          <Notification />
        </div>
          {/* <h2>Add Properties</h2> */}
          {/* <div style={{ display: "flex", justifyContent: "left" }}>
            <Container>
              <table id="table" className="property-table" cellSpacing={1000}>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Coin
                  </th>
                  <th style={{ paddingRight: "20px" }}>Exchange</th>
                  <th style={{ paddingRight: "20px" }}>Wallet</th>
                  <th style={{ paddingRight: "20px" }}>Quntity</th>
                  <th style={{ paddingRight: "20px" }}>Estimated Value</th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Document
                  </th>
                  <th style={{ paddingRight: "20px" }}>Notes</th>
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
                        {info.coin}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.exchange}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.wallet}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.quntity}
                      </td>
                      <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        ${info.estimatedValue}
                      </th>
                      <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.exampleFile.split}
                      </th>
                      <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.notes}
                      </th>
                    </tr>
                  );
                })}
              </table>
            </Container>
          </div> */}
        </div>
      </SideBar>
      {/* <div>
        <Footer />
      </div> */}
    </TrusteeBase>
  );
}

export default Crypto;
