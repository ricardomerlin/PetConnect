import React from 'react';
import Modal from 'react-modal';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div>
        <p>Are you sure you want to delete this animal?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
