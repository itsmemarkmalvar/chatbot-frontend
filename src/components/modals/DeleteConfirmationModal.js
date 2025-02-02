import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from '@/styles/modal.module.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Delete Conversation</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <p>Are you sure you want to delete this conversation?</p>
                </div>
                <div className={styles.modalActions}>
                    <button 
                        className={styles.cancelButton} 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        className={`${styles.deleteButton} ${isLoading ? styles.loading : ''}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal; 