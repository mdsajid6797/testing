import React from 'react';
import "../../css/autobiography_popup.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
function PopupComponent({ entry, onClose }) {
    return (
        <div className="popup">
            <div className="popup-content" >
                <div className='popup_heading'>
                    <h2>{entry.heading}</h2>
                    <button className="popup_btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className='popup_date_main'>
                    <p className='popup_created_date'> Created On: {entry.createdDate}</p>
                    <p className='popup_edited_date' >Edited On : {entry.updatedDate}</p>
                    
                </div>

                <div
                    dangerouslySetInnerHTML={{ __html: entry.note }}
                ></div>

            </div>
        </div>
    );
}

export default PopupComponent;
