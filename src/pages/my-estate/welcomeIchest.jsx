import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import "./../../css/welcomeIchest.css";
import { useState } from 'react';
import { useEffect } from 'react';
import { Notification } from '../../components/alerting-visitors/notification';

function WelcomeIchest(props) {
    // page opening  animation 
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
    }, []);
    return (
        <div className={`your-component ${show ? "fade-in-element" : ""}`}>
            <div className="popup2">
                <div style={{ width: "100%", height: "90vh", position: "fixed", display: "flex", justifyContent: "center" }}>
                    <div className="popup-inner">
                        <div className='welcome_ichest_popup'>
                            <div className='welcome_ichest_popup_main'>
                                <div style={{ marginTop: "30px", paddingBottom: "40px" }}>
                                    <div className='welcome_ichest_popup_close_heading'>
                                        <button className="welcome_ichest_popup_close" onClick={props.closePopup}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                    <div className='welcome_ichest_popup_base'>

                                        <div className='welcome_ichest_popup_headline'>
                                            <div className='welcome_ichest_popup_heading'>
                                                <h2>Welcome to I-Chest </h2>
                                            </div>
                                            <div className='popup_ichest_front'>
                                                <div className='popup_ichest_logo'>
                                                    <img src="/img/homepage_image.png" alt="logo" />
                                                </div>
                                                <div className='popup_ichest_about'>
                                                    <p>
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='welcome_ichest_popup_2ndpage' >
                                    <div className='welcome_ichest_popup_2ndparagraph_top'>
                                        <h2>We are a team of Agile Ninjas</h2>
                                    </div>
                                    <div className='welcome_ichest_popup_2ndpage_description'>
                                        <div className='welcome_ichest_popup_2ndpage_image'>
                                            <img src="/img/how_we_work.svg" alt="how_we_work" />
                                        </div>
                                        <div className='welcome_ichest_popup_2ndparagraph'>
                                            <h2>We are a team of Agile Ninjas</h2>
                                            <p >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                        </div>
                                    </div>

                                </div>
                                <div style={{ display: "flex", justifyContent: "center", backgroundColor: "white" }}>
                                    <div className='welcome_ichest_popup_3rdpage_image2'>
                                        <img src="/img/team_member.svg" alt="team_member" />
                                    </div>
                                </div>
                                <div className='welcome_ichest_popup_3rdpage' >
                                    <div className='welcome_ichest_popup_3rdparagraph'>
                                        <h2>Meet our awesome, diverse, and colorful team</h2>
                                    </div>
                                    <div className='welcome_ichest_popup_3rdpage_team_page'>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/ranjay.jpeg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3>Ranjay Singh</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Founder</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='welcome_ichest_popup_3rdpage_team_image'>
                                            <img className='welcome_ichest_popup_3rdpage_team_single_image' src="/img/team_avtar.svg" alt="team_member" />
                                            <div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h3 >Full Name</h3>
                                                </div>
                                                <div className='welcome_ichest_popup_3rdpage_team_page_name'>
                                                    <h5>Designation</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='welcome_ichest_popup_3rdpage_description'>
                                        <p>
                                            Helping our clients meet and define tomarrow with Real passion, Enhancing quality with high performance.
                                            That's what our team is made of!
                                        </p>
                                    </div>

                                </div>
                                <div className='welcome_ichest_popup_4thpage'>
                                    <div className='welcome_ichest_popup_4thheading'>
                                        <h2>We are better than the best!</h2>
                                    </div>
                                    <div className='welcome_ichest_popup_4thpage_image'>
                                        <img src="/img/pair_programming.svg" alt="team_member" />
                                    </div>
                                    <div className='welcome_ichest_popup_4thpage_description'>
                                        <p>
                                            We Go Deeper With Technology, Industry Expertise And Customer Commitment To Make A Difference To Your Strategic IT Initiatives.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeIchest;
