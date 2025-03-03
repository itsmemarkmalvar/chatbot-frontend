import React from 'react';
import styles from '@/styles/modal.module.css';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';

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
                            <div className={styles.memberPhoto}>
                                <Image
                                    src="/images/team/480792841_1029989995821929_65735496293150502_n.jpg"
                                    alt="Mark Joseph Malvar"
                                    width={120}
                                    height={120}
                                    className={styles.memberImage}
                                />
                            </div>
                            <h4>Mark Joseph Malvar</h4>
                            <p>Lead Developer</p>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <Image
                                    src="/images/team/480818836_922395489724226_162257194608539952_n.jpg"
                                    alt="Marvin James Gagarin"
                                    width={120}
                                    height={120}
                                    className={styles.memberImage}
                                />
                            </div>
                            <h4>Marvin James Gagarin</h4>
                            <p>UI/UX Designer</p>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <Image
                                    src="/images/team/476772868_484360917867032_9110491468805360871_n.jpg"
                                    alt="Adrian John Garcia"
                                    width={120}
                                    height={120}
                                    className={styles.memberImage}
                                />
                            </div>
                            <h4>Adrian John Garcia</h4>
                            <p>Backend Developer</p>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <Image
                                    src="/images/team/476887872_1826427474791033_6381998989091246594_n.jpg"
                                    alt="Carl Justine Dela Cruz"
                                    width={120}
                                    height={120}
                                    className={styles.memberImage}
                                />
                            </div>
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