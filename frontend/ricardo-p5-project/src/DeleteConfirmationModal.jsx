import React from 'react';
import Modal from 'react-modal';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, animal }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="delete-confirmation-modal"
      overlayClassName="delete-confirmation-overlay"
    >
      <div className="delete-confirmation-content">
        <p>Are you sure you want to delete {animal.name}'s information?</p>
        <div className="button-container">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="cancel-button" onClick={onClose}>No</button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
