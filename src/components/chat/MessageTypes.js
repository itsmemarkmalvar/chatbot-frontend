import React from 'react';
import styles from '@/styles/messageTypes.module.css';
import { FiCheck, FiX, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export const PlanCard = ({ plan }) => {
    return (
        <div className={styles.planCard}>
            <div className={styles.planHeader}>
                <h3>{plan.name}</h3>
                <span className={styles.planPrice}>₱{plan.price}/mo</span>
            </div>
            <div className={styles.planSpeed}>
                <span className={styles.speedValue}>{plan.speed}</span>
                <span className={styles.speedUnit}>Mbps</span>
            </div>
            <ul className={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                    <li key={index}>
                        <FiCheck className={styles.featureIcon} />
                        {feature}
                    </li>
                ))}
            </ul>
            <button className={styles.planButton}>Learn More</button>
        </div>
    );
};

export const TroubleshootingSteps = ({ steps }) => {
    return (
        <div className={styles.troubleshootingContainer}>
            {steps.map((step, index) => (
                <div key={index} className={styles.troubleshootingStep}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <div className={styles.stepContent}>
                        <h4>{step.title}</h4>
                        <p>{step.description}</p>
                        {step.note && (
                            <div className={styles.stepNote}>
                                <FiAlertCircle />
                                <span>{step.note}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const StatusMessage = ({ status }) => {
    const getStatusIcon = (type) => {
        switch (type) {
            case 'success': return <FiCheck />;
            case 'error': return <FiX />;
            case 'warning': return <FiAlertCircle />;
            default: return null;
        }
    };

    return (
        <div className={`${styles.statusMessage} ${styles[status.type]}`}>
            <span className={styles.statusIcon}>{getStatusIcon(status.type)}</span>
            <span className={styles.statusText}>{status.message}</span>
        </div>
    );
};

export const QuickActions = ({ actions }) => {
    return (
        <div className={styles.quickActions}>
            {actions.map((action, index) => (
                <button 
                    key={index}
                    className={styles.actionButton}
                    onClick={action.onClick}
                >
                    {action.icon}
                    <span>{action.label}</span>
                    <FiArrowRight className={styles.actionArrow} />
                </button>
            ))}
        </div>
    );
}; 