import React from "react";
import PropTypes from "prop-types";
import "../styles/delete.css";

function DeleteSpeciesModal({ speciesName, onDelete, onCancel }) {
  return (
    <div className="delete-confirmation-modal">
      <div className="modal-content">
        <h3 className="deleteh3">Confirm Delete</h3>
        <p>
          Are you sure you want to delete <b>{speciesName}</b>?
        </p>
        <div className="modal-buttons1">
          <button className="confirm-delete" onClick={onDelete}>
            Delete
          </button>
          <button className="button-delete" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteSpeciesModal.propTypes = {
  speciesName: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteSpeciesModal;
