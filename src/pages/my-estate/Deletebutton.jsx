import { Tooltip, colors } from '@mui/material';
import React, { useState } from 'react';
import "./../../css/deletebtn.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faTrashCan } from '@fortawesome/free-solid-svg-icons'
//Code By Purnendu
//new ly modified Smruti ranjan
// This is Delete Button for remove any property
export function Deletebutton({ handleRemove, Id, assetValue, idType }) {
  const [modal, setModal] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const toggle = () => {
    setModal(!modal);
    setConfirmation('');
  };
  const handleConfirmationChange = (e) => {
    setConfirmation(e.target.value);
  };

  const isConfirmed = confirmation === 'PERMANENTLY_DELETE';

  const handleDelete = () => {
    if (isConfirmed) {
      toggle();
      handleRemove(Id, idType, assetValue);
      setConfirmation('');
    }
  };

  return (
    <div style={{ marginLeft: "5px", marginRight: "10px" }}>
      <Button onClick={toggle} className='delete-button-comp' >
        <Tooltip title="Click here to delete">
        <FontAwesomeIcon icon={faTrash} />
        </Tooltip>
      </Button>
      <Modal isOpen={modal} toggle={toggle} style={{ paddingTop: "50px" }} >
      <ModalHeader toggle={toggle}>
          <span style={{ color: "red",fontWeight: "500"  }}>
            Warning !!!
          </span>
        </ModalHeader>
        <ModalBody style={{ color: "black" }}>
          {/* Please enter <span className="delete_message">"PERMANENTLY_DELETE"</span> to confirm your deletion: */}
          Please enter <span style={{color: "red"}}>"PERMANENTLY_DELETE"</span> to confirm your deletion:
          <div className='delete_button_warning'>
            <input type="text" value={confirmation} onChange={handleConfirmationChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="confirm_delete_btn" onClick={handleDelete} disabled={!isConfirmed}>
            Delete
          </Button>{' '}
          <Button className="confirm_cancel_btn" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Deletebutton;



export function Del({ handleRemove, Id }) {
  const [modal, setModal] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const toggle = () => {
    setModal(!modal);
    setConfirmation('');
  };

  const handleConfirmationChange = (e) => {
    setConfirmation(e.target.value);
  };

  const isConfirmed = confirmation === 'PERMANENTLY_DELETE';

  const handleDelete = () => {
    if (isConfirmed) {
      toggle();
      handleRemove(Id);
      setConfirmation('');
    }
  };

  return (
    <div>
      <Button onClick={toggle} className='book_card_delete_buttons'>
        <Tooltip title="click here to delete your diary">
          <FontAwesomeIcon icon={faTrashCan} />
        </Tooltip>
      </Button>
      <Modal isOpen={modal} toggle={toggle} style={{ paddingTop: "50px" }} >
        <ModalHeader toggle={toggle}>
          <span style={{ color: "red",fontWeight: "500"  }}>
            Warning !!!
          </span>
        </ModalHeader>
        <ModalBody style={{ color: "black" }}>
          Please enter <span className="delete_message">"PERMANENTLY_DELETE"</span> to confirm your deletion:
          <div className='delete_button_warning'>
            <input type="text" value={confirmation} onChange={handleConfirmationChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="confirm_delete_btn" onClick={handleDelete} disabled={!isConfirmed}>
            Delete
          </Button>{' '}
          <Button className="confirm_cancel_btn" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}