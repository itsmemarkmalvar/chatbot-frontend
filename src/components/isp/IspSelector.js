import React, { useState } from 'react';
import styles from '@/styles/isp.module.css';
import Image from 'next/image';
import { FiWifi, FiTool, FiDollarSign, FiHelpCircle, FiInfo } from 'react-icons/fi';
import AboutModal from '@/components/common/AboutModal';

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

const IspSelector = ({ selectedProvider, onProviderSelect, onCategorySelect }) => {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    const categories = [
        {
            id: 'plans',
            name: 'Internet Plans',
            icon: <FiWifi />,
        },
        {
            id: 'support',
            name: 'Technical Support',
            icon: <FiTool />,
        },
        {
            id: 'billing',
            name: 'Billing',
            icon: <FiDollarSign />,
        },
        {
            id: 'faqs',
            name: 'FAQs',
            icon: <FiHelpCircle />,
        },
        {
            id: 'about',
            name: 'About',
            icon: <FiInfo />,
            onClick: () => setIsAboutModalOpen(true),
        },
    ];

    const handleCategoryClick = (category) => {
        if (category.onClick) {
            category.onClick();
        } else {
            onCategorySelect(category.id);
        }
    };

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
                                onClick={() => handleCategoryClick(category)}
                            >
                                <span className={styles.categoryIcon}>{category.icon}</span>
                                <span className={styles.categoryName}>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AboutModal 
                isOpen={isAboutModalOpen} 
                onClose={() => setIsAboutModalOpen(false)} 
            />
        </div>
    );
};

export default IspSelector; 