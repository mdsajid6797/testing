import React, { useState } from "react";
import { Container } from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import { getToken, getUser, jewelryGet } from "../../services/user-service";
//import { useState } from 'react'
import { useEffect } from "react";
import "../../css/myestare.css";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import Footer from "../../components/Footerfile/footer";
import { Notification } from "../../components/alerting-visitors/notification";

function TrusteeJewelry() {
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().userid;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    jewelryGet(token, userId)
      .then((res) => {
        setCategory(res);
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
          {/* <div style={{ display: "flex", justifyContent: "left" }}>
            <Container>
              <table id="table" className="property-table" cellSpacing={1000}>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Name
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Document
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    keratValue
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Estimated Value
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
                        {info.details}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.exampleFile.split("\\")[2]}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.keratValue} K
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        $ {info.estimatedValue}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.notes}
                      </td>
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

export default TrusteeJewelry;
