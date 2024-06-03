import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import React, { useState, useRef, useEffect } from "react";
import "../../css/userprofile.css";
import { currentUser, getToken, getUser, setUser, updateUserProfile } from "../../services/user-service";
import {
  faCircleCheck,
  faPlus,
  faTrashCan,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { Form } from "reactstrap";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function Userprofileedit() {
  const user = getUser();
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: getUser().id,
    jobStatus: "",
    gender: "",
    meritalStatus: "",
    dob: "",
    phoneNo: "",
    currentAddress: "",
    permanentAddress: "",
    isSecondaryUserEditable: ""
  });


  useEffect(() => {
    let user = getUser();
    setData(user);
  }, []);


  const [selectedProvider, setSelectedProvider] = useState("");

  const handleProviderChange = (event) => {
    setSelectedProvider(event.target.value);
  };

  const [profilePicture, setProfilePicture] = useState(null);
  const defaultProfilePicture = "./../../.././img/avtar.jpg";
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newProfilePicture = event.target.files[0];
    setProfilePicture(newProfilePicture);
  };

  const handleDelete = () => {
    setProfilePicture(null);
  };

  const handleChanges = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };

  // post the data 
  const UserProfileEdit = (event) => {
    event.preventDefault();
    updateUserProfile(data, data.id)
      .then((resp) => {
        currentUser("Bearer " + getToken()).then((user) => {
          setUser(user);

          let role = user.role.toLowerCase();

          navigate("/" + role + "/profile");
        })
          .catch((error) => {
          });
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };
  const [imageSrc, setImageSrc] = useState("");
  const base64ToImage = () => {
    const base64String = user.image;
    const trimmedBase64 = base64String ? base64String.trim() : '';
    if (trimmedBase64) {
      setImageSrc(`data:image/jpeg;base64,${trimmedBase64}`);
    }
  };
  useEffect(() => {
    base64ToImage();
  }, []);

  return (
    <>
      <div className="userprofile_mainpage">
        <div className="userprofile_basepage">
          {/* {JSON.stringify(data)} */}
          <Form onSubmit={UserProfileEdit}>
            <div className="userprofile_content_left">
              <div className="userprofilr_page_details">
                <div className="userprofile_image">
                  <img
                    className="userprofile_img"
                    src={imageSrc || "./../../.././img/avtar.jpg"}
                    alt="Profile_image" />

                </div>
                <div className="userprofile_details">
                  <ul className="userprofile_about">
                    <li className="userprofile_name">
                      {user.firstName + " "}
                      {user.lastName}
                    </li>
                    <ul className="userprofile_about_deatils">
                      <li className="userprofile_list">Username:</li>
                      <li>{user.username}</li>
                    </ul>
                    <ul className="userprofile_about_deatils">
                      {" "}
                      <li className="userprofile_list">Email:</li>
                      <li> {user.email}</li>
                    </ul>
                    <li></li>
                  </ul>
                </div>
              </div>
              <div className="userprofile_edit">
                <button className="userprofile_edit_btn">
                  Save
                  <FontAwesomeIcon className="userprofile_edit_icon" icon={faCircleCheck} />
                </button>
              </div>
            </div>

            <div className="userprofile_content_right">
              <div className="userprofile_page_details">
                <div className="userprofile_container">
                  <h3>Basic Information</h3>
                  <ul className="userprofile_page_main_list">
                    <li className="userprofile_page_list"> Secondary User Editable :</li>
                    <select
                      id="secondary-user-editable"
                      value={data.isSecondaryUserEditable}
                      style={{ width: '180px', height: "30px" }}
                      onChange={(e) =>
                        handleChanges(e, "isSecondaryUserEditable")
                      }
                    >
                      <option hidden value="">
                        choose here{" "}
                      </option>
                      <option value="true">Read & Write</option>
                      <option value="false">Read Only</option>
                    </select>
                  </ul>
                  <ul className="userprofile_page_main_list">
                    <li className="userprofile_page_list">Date of birth:</li>
                    <input
                      type="date"
                      style={{ width: '180px', height: "30px" }}
                      onChange={(e) => handleChanges(e, "dob")}
                      value={data.dob} />
                  </ul>
                  <ul className="userprofile_page_main_list">
                    <li className="userprofile_page_list"> Phone number: </li>
                    <input
                      type="number"
                      style={{ width: '180px' }}
                      onChange={(e) => handleChanges(e, "phoneNo")}
                      value={data.phoneNo} />
                  </ul>
                  <ul className="userprofile_page_main_list">
                    <li className="userprofile_page_list"> gender :</li>
                    <select
                      id="gender"
                      value={data.gender}
                      style={{ width: '180px', height: "30px" }}
                      onChange={(e) =>
                        handleChanges(e, "gender")
                      }
                    >
                      <option hidden value="">
                        choose here{" "}
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </ul>
                  <ul className="userprofile_page_main_list">
                    <li className="userprofile_page_list">Merital Status: </li>
                    <select
                      id="meritalStatus"
                      value={data.meritalStatus}
                      style={{ width: '180px', height: "30px" }}
                      onChange={(e) =>
                        handleChanges(e, "meritalStatus")
                      }
                    >
                      <option hidden value="">
                        choose here{" "}
                      </option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widow">Widow</option>
                    </select>
                  </ul>
                  <ul className="userprofile_page_main_list">
                    <li className="userprofile_page_list">Job Status:</li>
                    <select
                      id="jobStatus"
                      value={data.jobStatus}
                      style={{ width: '180px', height: "30px" }}
                      onChange={(e) =>
                        handleChanges(e, "jobStatus")
                      }
                    >
                      <option hidden value="">
                        choose here{" "}
                      </option>
                      <option value="Employeed">Employeed</option>
                      <option value="Not Employeed">Not Employeed</option>
                    </select>
                  </ul>
                </div>
              </div>
              <div className="userprofile_address">
                <h3>Address Information </h3>
                <div className="userprofile_address_list">
                  <ul className="userprofile_permanent_address">
                    <li className="userprofile_permanent_address_list">
                      permanent address :

                      <textarea
                        style={{width:"100%"}}
                        rows={4}
                        cols={50}
                        id="permanentAddress"
                        onChange={(e) => handleChanges(e, "permanentAddress")}
                        value={data.permanentAddress}
                      />
                    </li>
                  </ul>
                  <ul className="userprofile_current_address">
                    <li className="userprofile_current_address_list">
                      current address :
                      <textarea
                       style={{width:"100%"}}
                        rows={4}
                        cols={50}
                        id="currentAddress"
                        onChange={(e) => handleChanges(e, "currentAddress")}
                        value={data.currentAddress}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="userprofile_social_media">
              <div className="usaerprofile_social_media_contect">
                <a href="#">
                  <FontAwesomeIcon
                    className="userprofile_social_icon"
                    icon={faPlus}
                  />
                </a>
                <a href="#" style={{ color: "red" }}>
                  <FontAwesomeIcon
                    className="userprofile_social_icon"
                    icon={faYoutube}
                  />
                </a>
                <a href="#" style={{ color: "red" }}>
                  <FontAwesomeIcon
                    className="userprofile_social_icon"
                    icon={faInstagram}
                  />
                </a>
                <a href="#" style={{ color: "#0082ff" }}>
                  <FontAwesomeIcon
                    className="userprofile_social_icon"
                    icon={faFacebook}
                  />
                </a>
                <a href="#" style={{ color: "blue" }}>
                  <FontAwesomeIcon
                    className="userprofile_social_icon"
                    icon={faTwitter}
                  />
                </a>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
export default Userprofileedit;
