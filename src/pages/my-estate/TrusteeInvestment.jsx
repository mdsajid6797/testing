import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import SideBar from "../../components/sidebar/Sidebar";
import UserBase from "../../components/user/UserBase";
import { getToken, getUser, investmentsGet } from "../../services/user-service";
import "../../css/myestare.css";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import Footer from "../../components/Footerfile/footer";
import { Notification } from "../../components/alerting-visitors/notification";

function TrusteeInvestment() {
  //Get data show
  const [category, setCategory] = useState([]);
  const getData = () => {
    let userId = getUser().userid;
    console.log("user Id=" + userId);
    let token = "Bearer " + getToken();
    investmentsGet(token, userId)
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
          {/* <div style={{ display: "flex", justifyContent: "left" }}>
            <Container>
              <table id="table" className="property-table" cellSpacing={1000}>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Investment
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Total Amount
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Document
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Name Of The Investment
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
                        {info.investment}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        $ {info.totalAmount}{" "}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.exampleFile.split("\\")[2]}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {info.nameOfTheInvestment}
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

export default TrusteeInvestment;
