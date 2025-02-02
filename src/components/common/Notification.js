import React from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import styles from '@/styles/notification.module.css';

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const Icon = type === 'success' ? FiCheckCircle : FiAlertCircle;

    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <div className={`${styles.notification} ${styles[type]}`}>
            <Icon className={styles.icon} />
            <span>{message}</span>
        </div>
    );
};

export default Notification; 