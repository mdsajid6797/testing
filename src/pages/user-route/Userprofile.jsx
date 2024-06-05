import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCamera,
  faCircleCheck,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../../css/userprofile.css";
import {
  changePassword,
  currentUser,
  getBeneficiary,
  getToken,
  getTrustee,
  getUser,
  saveProfileImage,
  setUser,
} from "../../services/user-service";
import { Tooltip } from "@mui/material";

function Userprofile() {
  const [profilePicture, setProfilePicture] = useState(null);
  const defaultProfilePicture = "./../../.././img/avtar.jpg";
  const fileInputRef = useRef(null);
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setImageSrc("");
    setSelectedImage(event.target.files[0]);
    setProfilePicture(event.target.files[0]);
  };

  const handleSave = (event) => {
    // setProfilePicture(null);
    const formData = new FormData();
    formData.append("filename", selectedImage);

    saveProfileImage(formData)
      .then((resp) => {
        currentUser("Bearer " + getToken())
          .then((res) => {
            setUser(res);
            setProfilePicture(null);
            user = getUser();
            base64ToImage();
            toast.success("Profile image uploaded successfully!!", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          })
          .catch((e) => {});
      })
      .catch((error) => {});
  };

  let user = getUser();
  let role = user.role.toLowerCase();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
  const popupRef = useRef(null);

  const [imageSrc, setImageSrc] = useState("");

  const base64ToImage = () => {
    const base64String = user.image;
    const trimmedBase64 = base64String ? base64String.trim() : "";
    if (trimmedBase64) {
      setImageSrc(`data:image/jpeg;base64,${trimmedBase64}`);
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePassChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const isPasswordValid =
      value.length >= 10 &&
      /[A-Z]/.test(value) &&
      /[!@#$%^&*(),.?":{}|<>0-9]/.test(value);
    setPasswordValid(isPasswordValid);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password must be the same", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 10 characters long and include an uppercase letter, a special character, and a number.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
      return;
    }

    changePassword(passwordData)
      .then(() => {
        toast.success("Password changed successfully!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setPopupOpen(false);
      })
      .catch((error) => {
        toast.error("Password change failed. Please check your inputs.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.error("Error changing password:", error);
      });
  };

  const handleTogglePassword = (field) => {
    if (field === "currentPassword") {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

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
  const [trustee, setTrustee] = useState([]);
  const getTrusteedata = () => {
    let userId = getUser().id;

    let token = "Bearer " + getToken();
    getTrustee(token, userId)
      .then((res) => {
        setTrustee(res);
      })
      .catch((err) => {});
  };

  let trusteeBeneficiarySection = null;
  if (role === "user") {
    trusteeBeneficiarySection = (
      <div className="userprofile_trustee_beneficiary_details">
        <div className="userprofile_trustee_beneficiary_base">
          <ul className="userprofile_trustee_details">
            <h3>trustee details </h3>
            {trustee.map((trusif) => {
              return (
                <div className="userprofile_trustee_name">
                  <li style={{ listStyle: "disc", color: "black" }}>
                    {trusif.firstName + " "}
                    {trusif.lastName}
                  </li>
                </div>
              );
            })}
          </ul>
          <ul className="userprofile_beneficiary_details">
            <h3> Beneficiary details </h3>
            {beneficiary.map((benif) => {
              return (
                <div className="userprofile_beneficiary_name">
                  <li style={{ listStyle: "disc", color: "black" }}>
                    {benif.firstName + " "}
                    {benif.lastName}
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  useEffect(() => {
    getBenificiarydata();
    getTrusteedata();
    base64ToImage();
  }, []);

  return (
    <>
      <div className="userprofile_mainpage">
        <div className="userprofile_basepage">
          <div className="userprofile_content_left">
            <div className="userprofilr_page_details">
              <div className="userprofile_image">
                {imageSrc ? (
                  <div className="default-profile">
                    <img
                      className="userprofile_img"
                      src={imageSrc}
                      alt="Default Profile"
                    />
                    <div className="upload">
                      <label className="upload-button" htmlFor="fileInput">
                        <FontAwesomeIcon icon={faCamera} />
                      </label>
                    </div>
                    <input
                      id="fileInput"
                      ref={fileInputRef}
                      type="file"
                      onChange={handleChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                ) : profilePicture ? (
                  <div className="default-profile">
                    <img
                      className="userprofile_img"
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile"
                    />
                    <div className="upload">
                      <button className="delete-button" onClick={handleSave}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="default-profile">
                    <img
                      className="userprofile_img"
                      src={defaultProfilePicture}
                      alt="Default Profile"
                    />
                    <div className="upload">
                      <label className="upload-button" htmlFor="fileInput">
                        <FontAwesomeIcon icon={faCamera} />
                      </label>
                    </div>

                    <input
                      id="fileInput"
                      ref={fileInputRef}
                      type="file"
                      onChange={handleChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                )}
              </div>
              <div className="userprofile_details">
                <ul className="userprofile_about">
                  <li className="userprofile_name">
                    {user.firstName + " "}
                    {user.lastName}
                  </li>
                  <ul className="userprofile_about_deatils">
                    <li className="userprofile_list">Account Type:</li>
                    {user.jointAccount ? (
                      <li>Joint Account ({user.accountType})</li>
                    ) : (
                      <li>Primary Account</li>
                    )}
                  </ul>
                  <ul className="userprofile_about_deatils">
                    <li className="userprofile_list">Username:</li>
                    <li>{user.username}</li>
                  </ul>
                  <ul className="userprofile_about_deatils">
                    {" "}
                    <li className="userprofile_list">Email:</li>
                    <li> {user.email}</li>
                  </ul>
                  {!(
                    user.accountType === "secondary" ||
                    user.accountType === "normal"
                  ) && (
                    <ul className="userprofile_about_deatils">
                      <li className="userprofile_list">
                        Secondary User Editable:
                      </li>
                      {user.isSecondaryUserEditable === "true" ? (
                        <li>Read & Write</li>
                      ) : (
                        <li>Read Only</li>
                      )}
                    </ul>
                  )}

                  <ul className="userprofile_about_deatils">
                    <li className="userprofile_list">Date of birth:</li>
                    <li> {user.dob}</li>
                  </ul>
                  <li></li>
                </ul>
              </div>
            </div>
            <div className="userprofile_edit">
              <Link to={`/${role}/profile/edit`}>
                <button className="userprofile_edit_btn">
                  edit
                  <FontAwesomeIcon
                    className="userprofile_edit_icon"
                    icon={faPen}
                  />
                </button>
              </Link>
            </div>
          </div>
          <div className="userprofile_content_right">
            <div className="userprofile_page_details">
              <div className="userprofile_container">
                <h3>Basic Information</h3>
                <ul className="userprofile_page_main_list">
                  <li className="userprofile_page_list"> Phone number: </li>
                  <li>{user.phoneNo}</li>
                </ul>
                <ul className="userprofile_page_main_list">
                  <li className="userprofile_page_list"> gender :</li>
                  <li>{user.gender}</li>
                </ul>
                <ul className="userprofile_page_main_list">
                  <li className="userprofile_page_list">Merital Status: </li>
                  <li>{user.meritalStatus}</li>
                </ul>
                <ul className="userprofile_page_main_list">
                  <li className="userprofile_page_list">Job Status:</li>
                  <li>{user.jobStatus}</li>
                </ul>
              </div>
            </div>
            <div className="userprofile_security">
              <h3>Privacy & Security</h3>
              <div className="userprofile_buttons">
                <button
                  className="userprofile_changePassword"
                  onClick={togglePopup}
                >
                  change password
                </button>
                <form onSubmit={handleSubmit}>
                  {isPopupOpen && (
                    <div ref={popupRef} className="change_pass">
                      <ul className="change_pass_main">
                        <li className="change_pass_list">
                          <h4>Old Password :</h4>
                          <div className="password-input-container">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePassChange}
                              required
                            />
                            <button
                              className="toggle-password-button"
                              type="button"
                              onClick={() =>
                                handleTogglePassword("currentPassword")
                              }
                            >
                              <FontAwesomeIcon
                                icon={showCurrentPassword ? faEyeSlash : faEye}
                              />
                            </button>
                          </div>
                        </li>
                        <li className="change_pass_list">
                          <h4>New Password :</h4>
                          <div className="password-input-container">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePassChange}
                              required
                            />
                            <button
                              className="toggle-password-button"
                              type="button"
                              onClick={() =>
                                handleTogglePassword("newPassword")
                              }
                            >
                              <FontAwesomeIcon
                                icon={showNewPassword ? faEyeSlash : faEye}
                              />
                            </button>
                          </div>
                        </li>
                        <li className="change_pass_list">
                          <h4>Confirm Password :</h4>
                          <div className="password-input-container">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePassChange}
                              required
                            />
                            <button
                              className="toggle-password-button"
                              type="button"
                              onClick={() =>
                                handleTogglePassword("confirmPassword")
                              }
                            >
                              <FontAwesomeIcon
                                icon={showConfirmPassword ? faEyeSlash : faEye}
                              />
                            </button>
                          </div>
                        </li>
                        <div className="change_pass_btn">
                          <button
                            className="change_pass_cancel_btn"
                            onClick={togglePopup}
                          >
                            Cancel
                          </button>
                          <Tooltip
                            title="Password must be at least 10 characters long and
                              include an uppercase letter, a special character,
                              and a number."
                          >
                            <button
                              className="change_pass_save_btn"
                              type="submit"
                            >
                              Save
                            </button>
                          </Tooltip>
                        </div>
                      </ul>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="userprofile_content_down">
            <div className="userprofile_customer_care">
              <h3>Customer Care </h3>
              <div className="userprofile_helpcenter_btn">
                <li style={{ listStyle: "disc", color: "black" }}>
                  <button className="userprofile_faq">
                    frequently asked questions
                  </button>
                </li>
                <li style={{ listStyle: "disc", color: "black" }}>
                  <button className="userprofile_helpcenter">
                    help center
                  </button>
                </li>
              </div>
            </div>
            <div className="userprofile_address">
              <h3>Address Information </h3>
              <div className="userprofile_address_list">
                <ul className="userprofile_permanent_address">
                  <li className="userprofile_permanent_address_list">
                    permanent address :
                  </li>
                  <li>{user.permanentAddress}</li>
                </ul>
                <ul className="userprofile_current_address">
                  <li className="userprofile_current_address_list">
                    current address :
                  </li>
                  <li>{user.currentAddress}</li>
                </ul>
              </div>
            </div>
          </div>
          {trusteeBeneficiarySection}

          <div className="userprofile_social_media">
            <div className="usaerprofile_social_media_contect">
              <Link to="#" style={{ color: "red" }}>
                <FontAwesomeIcon
                  className="userprofile_social_icon"
                  icon={faYoutube}
                />
              </Link>
              <Link to="#" style={{ color: "red" }}>
                <FontAwesomeIcon
                  className="userprofile_social_icon"
                  icon={faInstagram}
                />
              </Link>
              <Link to="#" style={{ color: "#0082ff" }}>
                <FontAwesomeIcon
                  className="userprofile_social_icon"
                  icon={faFacebookF}
                />
              </Link>
              <Link to="#" style={{ color: "blue" }}>
                <FontAwesomeIcon
                  className="userprofile_social_icon"
                  icon={faTwitter}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Userprofile;
