import React, { useEffect, useState } from "react";
import "../../css/why-I-chest.css"
import UserBase from "../../components/user/UserBase";

function WhyIchest() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
    }, []);
    return (
        <>
            <div className={`your-component ${show ? "fade-in-element" : ""}`}>
                <div className="whyichest_base">
                    <div className="whyichest_main">
                        <div className="whyichest_heading">
                            <h1>Why I-Chest</h1>
                            <img className="whyichest_heading_logo" src="/img/why.jpg" alt="" />
                        </div>
                        <div className="whyichest_paragraph">
                            <p>
                                Do you have a contingency plan in case of unforeseen circumstances? A live transition
                                document ensuring a seamless handover. Are your important documents under the oversight of
                                trusted executors? Have you discussed your plans for inheritance, legacy, and beneficiaries with
                                your close family and friends? Do you have a confidant, like a lawyer, who is aware of and can
                                oversee your plans? Do you possess a private space for your most personal matters that you
                                wish to keep confidential until you're ready to share?

                            </p>
                        </div>
                        <br />
                        <div className="whyichest_second_para">
                            <div className="whyichest_image">
                                <img className="whyichest_image_img" src="/img/Data-Storage-Security.jpg" alt="secure_data_image " />
                            </div>
                            <div className="whyichest_content">
                                <p>Imagine a digital sanctuary—a secure haven where your invaluable assets and vital
                                    information find refuge. Picture an online repository designed not just for storage but
                                    for the precise transmission of your legacy to trusted hands. This platform stands as a
                                    bastion of security, a fortress safeguarding your wealth, documents, and plans.</p>
                                <br />
                                <p>
                                    This repository, a modern marvel, is more than a vault—it's a bridge. A bridge between
                                    your lifetime of hard work and the seamless transition to your chosen heirs and
                                    stewards. It's meticulously crafted to cater to your needs, offering a conduit through
                                    which your legacy flows—protected, organized, and ready to be passed on at your
                                    behest. This is where the role of trustees and attorneys becomes pivotal. Within this
                                    digital realm, these trusted individuals are granted access—gatekeepers who oversee
                                    the passage of your assets, ensuring your wishes are meticulously carried out. They
                                    stand at the threshold of this repository, ready to execute your desires with precision
                                    and care. This platform isn't just about security; it's about empowerment. It empowers
                                    you to control the flow of your legacy, allowing you to designate and manage
                                    beneficiaries, dictate your inheritance, and ensure your intentions are crystal clear. It's
                                    your vision, your plans, preserved within this digital stronghold until the time is right.
                                </p>
                            </div>
                        </div>
                        <br />
                        <div className="whyichest_last_para">
                            <p>
                                In essence, this repository transcends the digital realm; it's a guardian of your life's work,
                                a conduit for your aspirations, and a testament to your foresight. It stands tall as a
                                testament to your prudence, ensuring that your legacy endures, untarnished and
                                resolute, for generations to come.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} export default WhyIchest;
