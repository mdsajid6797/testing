import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useIdle from "./useIdleTimer.js";
import "./../css/idleTime.css";
import { doLogout, isLoggedIn } from "../services/user-service.js";
function IdleTimeComponent() {


    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const loggedin = isLoggedIn();

    const handleIdle = () => {
        setShowModal(true); //show modal
        setRemainingTime(30); //set 30 seconds as time remaining
    };

    const { isIdle } = useIdle({ onIdle: handleIdle, idleTime: 10 });


    useEffect(() => {
        let interval;

        if (loggedin) {
            if (isIdle && showModal) {
                interval = setInterval(() => {
                    setRemainingTime(
                        (prevRemainingTime) =>
                            prevRemainingTime > 0 ? prevRemainingTime - 1 : 0 //reduces the second by 1
                    );
                }, 1000);
            }
        } else {
            // User is not logged in, hide modal and stop the idle timer
            setShowModal(false);
            setRemainingTime(0);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isIdle, showModal]);

    useEffect(() => {
        if (remainingTime === 0 && showModal) {
            // alert("Time out!");
            setShowModal(false);
            logout();
        }
    }, [remainingTime, showModal, navigate]); // this is responsoble for logging user out after timer is down to zero and they have not clicked anything
    const logout = () => {
        doLogout();
        navigate('/');
    };
    const handleLogOut = () => {
        setShowModal(false);
        logout();

    };

    const handleStayLoggedIn = () => {
        setShowModal(false);

    };

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    return (
        <>
            {/* handle isIdle for the modal */}
            {isIdle && showModal && (
                <div className="timeout_popup">
                    <div className='timeout_image_base'>
                        <div className="timeout_image_card">
                            <img className="timeout_image" src="/img/TimeOutImg.svg" alt="Timeout-Image" />
                        </div>
                    </div>
                    <h1 className="time_out_heading">Hey, are you still there?</h1>
                    <p className='timeout_paragraph'>You've been idle for 120 seconds. Do you want to logout or stay logged in?</p>
                    <p className='timer_text'>You will time out in: <span style={{ color: "red" }}>{millisToMinutesAndSeconds(remainingTime * 1000)}</span> seconds!</p>
                    <div className='timer_card_btn'>
                        <button className='timer_card_logout_btn' onClick={handleLogOut}>Logout</button>
                        <button className='timer_card_refresh_btn' onClick={handleStayLoggedIn}>Stay</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default IdleTimeComponent;