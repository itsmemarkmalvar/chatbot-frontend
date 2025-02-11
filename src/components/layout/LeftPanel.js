import React, { useState } from 'react';
import { FiGrid, FiMessageSquare } from 'react-icons/fi';
import styles from '@/styles/chat.module.css';
import IspSelector from '@/components/isp/IspSelector';
import { ChatHistory } from '@/components/chat/ChatHistory';

export const LeftPanel = ({ selectedProvider, onProviderSelect, onCategorySelect, onSelectChat, onNotification }) => {
    const [activeTab, setActiveTab] = useState('isp'); // 'isp' or 'history'

    return (
        <div className={styles.leftPanel}>
            <div className={styles.tabNav}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'isp' ? styles.active : ''}`}
                    onClick={() => setActiveTab('isp')}
                >
                    <FiGrid />
                    Providers
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'history' ? styles.active : ''}`}
                    onClick={() => setActiveTab('history')}
                    data-tour="chat-history"
                >
                    <FiMessageSquare />
                    History
                </button>
            </div>
            
            <div className={styles.tabContent}>
                {activeTab === 'isp' ? (
                    <IspSelector
                        selectedProvider={selectedProvider?.name}
                        onProviderSelect={onProviderSelect}
                        onCategorySelect={onCategorySelect}
                    />
                ) : (
                    <ChatHistory
                        onSelectChat={onSelectChat}
                        selectedProvider={selectedProvider?.name}
                        onNotification={onNotification}
                    />
                )}
            </div>
        </div>
    );
}; 