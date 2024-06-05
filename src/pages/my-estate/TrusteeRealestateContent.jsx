import React from "react";
import { Container } from "reactstrap";
import { Notification } from "../../components/alerting-visitors/notification";
import "../../css/myestare.css";

function TrusteeRealEstateContent() {
  //show data in frontend
  // const [category, setCategory] = useState([]);
  // const getData = () => {
  //   let userId = getUser().userid;
  //   console.log("user Id=" + userId);
  //   let token = "Bearer " + getToken();
  //   realEstateContentGet(token, userId)
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
    <div style={{ width: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "" }}>
        <Container>
        <div style={{ marginTop: "30px" }}>
          <Notification />
        </div>
          {/* <table id="table" className="property-table" cellSpacing={10}>
            <tr
              style={{
                height: "50px",
              }}
            >
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                Address
              </th>
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                APT Number
              </th>
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                ZIPCode
              </th>
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                Country
              </th>
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                Mortgage
              </th>
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                document
              </th>
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                Property
              </th>
              <th style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                Income
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
                    {info.streetAddress}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    {info.aptNumber}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    {info.zipCode}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    {info.country}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    $ {info.mortgage}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    {info.exampleFile.split("\\")[2]}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    $ {info.estPropertyVal}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    $ {info.rentalIncome}
                  </td>
                  <td style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                    {info.notes}
                  </td>
                </tr>
              );
            })}
          </table> */}
        </Container>
      </div>
    </div>
  );
}

export default TrusteeRealEstateContent;
