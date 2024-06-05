import React from "react";
import { Notification } from "../../components/alerting-visitors/notification";
import SideBar from "../../components/sidebar/Sidebar";
import TrusteeBase from "../../components/trustee/TrusteeBase";
import "../../css/myestare.css";

function TrusteeVehicles() {
  //get form
  // const [category, setCategory] = useState([]);
  // const getData = () => {
  //   let userId = getUser().userid;
  //   console.log("user Id=" + userId);
  //   let token = "Bearer " + getToken();
  //   vehiclesGet(token, userId)
  //     .then((res) => {
  //       setCategory(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       console.log("Data not loaded");
  //     });
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <TrusteeBase>
      <div className="mt-5"></div>
      <SideBar>
        <div style={{ width: "1000px" }}>
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
                  <th style={{ paddingRight: "30px", paddingLeft: "20px" }}>
                    Vehicles Types
                  </th>
                  <th style={{ paddingRight: "70px", paddingLeft: "20px" }}>
                    year
                  </th>
                  <th style={{ paddingRight: "40px", paddingLeft: "20px" }}>
                    loan
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    make
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    miels
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    model
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    estValue
                  </th>
                  <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    Document
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
                        {" "}
                        {info.vehicleType}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {" "}
                        {info.year}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        $ {info.loan}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {" "}
                        {info.make}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {" "}
                        {info.miels}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {" "}
                        {info.model}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        $ {info.evalue}
                      </td>
                      <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                        {" "}
                        {info.exampleFile.split("\\")[2]}
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

export default TrusteeVehicles;
