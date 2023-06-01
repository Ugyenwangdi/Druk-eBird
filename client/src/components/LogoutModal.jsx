import React from "react";
import PropTypes from "prop-types";
import "../styles/logout.css";

function LogoutModal({ message, onConfirm, onCancel }) {
  return (
    <div className="logout-modal">
      <div className="logout-modal-content">
        <p>{message}</p>
        <div className="logout-modal-buttons">
          <button className="logout-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="logout-button" onClick={onCancel}>
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
