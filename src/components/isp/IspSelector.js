import React from 'react';
import styles from '@/styles/isp.module.css';
import Image from 'next/image';
import { FiTool, FiDollarSign, FiHelpCircle } from 'react-icons/fi';

const providers = [
    {
        name: 'PLDT',
        logo: '/images/isp/PLDT.png',
        color: '#0033A0'
    },
    {
        name: 'Globe',
        logo: '/images/isp/Globe.png',
        color: '#0064DE'
    },
    {
        name: 'Converge',
        logo: '/images/isp/Converge.png',
        color: '#EE1C25'
    }
];

const categories = [
    { icon: <FiTool />, name: 'Technical Support', id: 'support' },
    { icon: <FiDollarSign />, name: 'Billing', id: 'billing' },
    { icon: <FiHelpCircle />, name: 'FAQs', id: 'faqs' }
];

const IspSelector = ({ selectedProvider, onProviderSelect, onCategorySelect }) => {
    return (
        <div className={styles.ispSelector} data-tour="isp-selector">
            <h2>Select Internet Service Provider</h2>
            <div className={styles.ispSelectorContainer}>
                <div className={styles.providersGrid}>
                    {providers.map((provider) => (
                        <button
                            key={provider.name}
                            className={`${styles.providerButton} ${selectedProvider === provider.name ? styles.active : ''}`}
                            onClick={() => onProviderSelect(provider)}
                            style={{ '--provider-color': provider.color }}
                        >
                            <div className={styles.providerLogo}>
                                <Image
                                    src={provider.logo}
                                    alt={provider.name}
                                    width={48}
                                    height={48}
                                    priority
                                />
                            </div>
                            <span className={styles.providerName}>{provider.name}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.categorySection} data-tour="quick-access">
                    <h3>Quick Access</h3>
                    <div className={styles.categoryGrid}>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={styles.categoryButton}
                                onClick={() => onCategorySelect(category.id)}
                            >
                                <span className={styles.categoryIcon}>{category.icon}</span>
                                <span className={styles.categoryName}>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IspSelector; 