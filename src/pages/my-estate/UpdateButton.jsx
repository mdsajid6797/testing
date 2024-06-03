import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import './../../css/editbtn.css';
function UpdateButton({ URL, id }) {
  return (
    <Link
      to={`${URL}${id}`}
      className="edit-button">
      <FontAwesomeIcon icon={faPenToSquare} />
    </Link>
  );
}

export default UpdateButton;