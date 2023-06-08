import React from "react";
import PropTypes from "prop-types";
import "../styles/logout.css";

function LogoutModal({ message, onConfirm, onCancel }) {
  return (
    <div className="logout-modal">
      <div className="logout-modal-content">
        <p><b>{message}</b></p>
        <div className="logout-modal-buttons">
          <button className="confirm1-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="canclebutton" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

LogoutModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LogoutModal;
