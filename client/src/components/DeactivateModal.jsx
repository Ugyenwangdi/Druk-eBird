import React from "react";
import PropTypes from "prop-types";
import "../styles/deactivate.css";

function DeactivateModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal-content">
        <p style={{ fontSize: "1rem" }}>
          <b>{message}</b>
        </p>
        <div className="confirmation-modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="deactivate-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

DeactivateModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeactivateModal;
