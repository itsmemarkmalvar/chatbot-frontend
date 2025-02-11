import React from 'react';
import styles from '@/styles/messageTypes.module.css';
import { FiCheck, FiX, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export const PlanCard = ({ plan }) => {
    const renderSpeed = () => {
        if (plan.speed_day && plan.speed_night) {
            return (
                <div className={styles.planSpeedTimeOfDay}>
                    <div>
                        <span className={styles.speedValue}>{plan.speed_day}</span>
                        <span className={styles.speedUnit}>Mbps Day</span>
                    </div>
                    <div>
                        <span className={styles.speedValue}>{plan.speed_night}</span>
                        <span className={styles.speedUnit}>Mbps Night</span>
                    </div>
                </div>
            );
        }
        
        if (plan.speed_peak && plan.speed_offpeak) {
            return (
                <div className={styles.planSpeedTimeOfDay}>
                    <div>
                        <span className={styles.speedValue}>{plan.speed_peak}</span>
                        <span className={styles.speedUnit}>Mbps Peak</span>
                    </div>
                    <div>
                        <span className={styles.speedValue}>{plan.speed_offpeak}</span>
                        <span className={styles.speedUnit}>Mbps Off-peak</span>
                    </div>
                </div>
            );
        }
        
        if (plan.speed) {
            return (
                <div className={styles.planSpeed}>
                    <span className={styles.speedValue}>{plan.speed}</span>
                    <span className={styles.speedUnit}>Mbps</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`${styles.planCard} ${styles[plan.type || 'residential']}`}>
            <div className={styles.planHeader}>
                <div className={styles.planInfo}>
                    <h3 className={styles.planName}>{plan.name}</h3>
                    {plan.type && (
                        <span className={styles.planType}>
                            {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                        </span>
                    )}
                </div>
                <div className={styles.planPrice}>
                    ₱{typeof plan.price === 'number' ? plan.price.toLocaleString() : plan.price}/mo
                </div>
            </div>
            {renderSpeed()}
            <ul className={styles.planFeatures}>
                {plan.features && plan.features.map((feature, index) => (
                    <li key={index}>
                        <FiCheck className={styles.featureIcon} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button className={styles.planButton}>
                Learn More
                <FiArrowRight className={styles.buttonIcon} />
            </button>
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

export const QuickActions = ({ actions = [] }) => {
    if (!actions || actions.length === 0) return null;

    return (
        <div className={styles.quickActions}>
            {actions.map((action, index) => (
                <button 
                    key={index}
                    className={styles.actionButton}
                    onClick={action.onClick}
                    disabled={action.disabled}
                >
                    {action.icon}
                    <span>{action.label}</span>
                    <FiArrowRight className={styles.actionArrow} />
                </button>
            ))}
        </div>
    );
}; 