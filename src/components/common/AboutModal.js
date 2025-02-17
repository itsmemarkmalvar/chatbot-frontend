import React from 'react';
import styles from '@/styles/modal.module.css';
import { FiX } from 'react-icons/fi';

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>About ISP Support Assistant</h2>
                    <button 
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <FiX />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <h3>About the App</h3>
                    <p>
                        ISP Support Assistant is an AI-powered chatbot designed to provide instant support
                        for customers of major Internet Service Providers in the Philippines. Our platform
                        offers comprehensive assistance for PLDT, Globe, and Converge services.
                    </p>

                    <h3>Features</h3>
                    <ul>
                        <li>24/7 Instant Support</li>
                        <li>Plan Comparisons and Recommendations</li>
                        <li>Technical Troubleshooting</li>
                        <li>Billing Assistance</li>
                        <li>FAQ Access</li>
                    </ul>

                    <h3>Development Team</h3>
                    <div className={styles.teamSection}>
                        <div className={styles.teamMember}>
                            <h4>Mark Joseph Malvar</h4>
                            <p>Lead Developer</p>
                        </div>
                        <div className={styles.teamMember}>
                            <h4>Marvin James Gagarin</h4>
                            <p>UI/UX Designer</p>
                        </div>
                        <div className={styles.teamMember}>
                            <h4>Adrian John Garcia</h4>
                            <p>Backend Developer</p>
                        </div>
                        <div className={styles.teamMember}>
                            <h4>Carl Justine Dela Cruz</h4>
                            <p>Project Architect</p>
                        </div>
                    </div>

                    <h3>Technologies Used</h3>
                    <ul>
                        <li>Frontend: Next.js, React</li>
                        <li>Backend: Laravel, PHP</li>
                        <li>AI: Google Gemini</li>
                        <li>Database: MySQL</li>
                    </ul>

                    <h3>Version</h3>
                    <p>Current Version: 1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default AboutModal; 