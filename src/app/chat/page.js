'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/chat.module.css';
import { FiSend, FiUser, FiCopy, FiCheck, FiLogOut, FiSettings, FiRefreshCw, FiWifi, FiTool, FiDollarSign } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken, removeToken, isAuthenticated, logout } from '@/utils/auth';
import IspSelector from '@/components/isp/IspSelector';
import { PlanCard, TroubleshootingSteps, StatusMessage, QuickActions } from '@/components/chat/MessageTypes';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { LeftPanel } from '@/components/layout/LeftPanel';
import Notification from '@/components/common/Notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const router = useRouter();
    const [notification, setNotification] = useState({ message: '', type: '' });

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        scrollToBottom();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
        // Add a system message when provider is selected
        const systemMessage = {
            type: 'status',
            status: {
                type: 'success',
                message: `Switched to ${provider.name} support. How can I help you today?`
            },
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, systemMessage]);
    };

    const handleCategorySelect = async (categoryId) => {
        if (!selectedProvider) {
            const warningMessage = {
                type: 'status',
                status: {
                    type: 'warning',
                    message: 'Please select an Internet Service Provider first.'
                },
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, warningMessage]);
            return;
        }

        // Add user category selection message
        const userMessage = {
            message: `Show me ${categoryId} for ${selectedProvider.name}`,
            timestamp: new Date().toISOString(),
            isUser: true
        };
        setMessages(prev => [...prev, userMessage]);

        // Simulate bot processing
        setIsLoading(true);
        setIsTyping(true);

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/chat/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage.message,
                    provider: selectedProvider.name,
                    category: categoryId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();
            
            if (data.success) {
                const botResponse = {
                    timestamp: new Date().toISOString(),
                    isBot: true,
                    type: data.type,
                    message: data.message,
                    content: data.content
                };
                setMessages(prev => [...prev, botResponse]);
            } else {
                throw new Error(data.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                type: 'status',
                status: {
                    type: 'error',
                    message: 'Failed to fetch information. Please try again.'
                },
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;
        if (!selectedProvider) {
            const warningMessage = {
                type: 'status',
                status: {
                    type: 'warning',
                    message: 'Please select an Internet Service Provider first.'
                },
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, warningMessage]);
            return;
        }

        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const newUserMessage = {
            message: inputMessage,
            timestamp: new Date().toISOString(),
            isUser: true
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/chat/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: inputMessage,
                    provider: selectedProvider.name
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();
            
            if (data.success) {
                const botResponse = {
                    timestamp: new Date().toISOString(),
                    isBot: true,
                    type: data.type,
                    message: data.message,
                    content: data.content
                };
                setMessages(prev => [...prev, botResponse]);
            } else {
                throw new Error(data.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                type: 'status',
                status: {
                    type: 'error',
                    message: 'Failed to send message. Please try again.'
                },
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const renderMessage = (message) => {
        if (message.type === 'status') {
            return <StatusMessage status={message.status} />;
        }

        if (message.type === 'plans' && message.content?.plans) {
            return (
                <div className={styles.messageWrapper} data-user={message.isUser}>
                    <div className={styles.botMessage}>
                        <div className={styles.messageContent}>
                            <h3>Available Plans</h3>
                            <div className={styles.plansGrid}>
                                {message.content.plans.map((plan, index) => (
                                    <PlanCard key={index} plan={plan} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (message.type === 'support' && message.content?.steps) {
            return (
                <div className={styles.messageWrapper} data-user={message.isUser}>
                    <div className={styles.botMessage}>
                        <TroubleshootingSteps steps={message.content.steps} />
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.messageWrapper} data-user={message.isUser}>
                <div className={message.isUser ? styles.userMessage : styles.botMessage}>
                    <div className={styles.messageContent}>
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                        {message.actions && <QuickActions actions={message.actions} />}
                    </div>
                </div>
            </div>
        );
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        // Add the selected chat to the messages
        const chatMessages = [
            {
                message: chat.message,
                timestamp: chat.created_at,
                isUser: true
            },
            {
                message: chat.response,
                timestamp: chat.created_at,
                isBot: true,
                type: chat.type,
                content: chat.metadata ? JSON.parse(chat.metadata) : null
            }
        ];
        setMessages(chatMessages);
    };

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    return (
        <div className={styles.mainContainer}>
            <Notification 
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
            <LeftPanel
                selectedProvider={selectedProvider}
                onProviderSelect={handleProviderSelect}
                onCategorySelect={handleCategorySelect}
                onSelectChat={handleChatSelect}
                onNotification={handleNotification}
            />

            {/* Chat Panel */}
            <div className={styles.chatPanel}>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerContent}>
                        <RiRobot2Line className={styles.botIcon} />
                        <div className={styles.headerText}>
                            <h1>ISP Support Assistant</h1>
                            <p className={styles.statusText}>
                                {selectedProvider 
                                    ? `${selectedProvider.name} Support Active`
                                    : 'Select an ISP to begin'}
                            </p>
                        </div>
                        <button 
                            className={styles.logoutButton}
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <FiLogOut />
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div ref={messagesContainerRef} className={styles.messagesContainer}>
                    {messages.length === 0 && (
                        <div className={styles.welcomeContainer}>
                            <h1 className={styles.welcomeTitle}>Welcome to ISP Support Assistant</h1>
                            <p className={styles.welcomeSubtitle}>
                                Your one-stop solution for all your internet service needs. Get instant support, check plans, and resolve issues with our AI-powered assistant.
                            </p>
                            
                            <div className={styles.welcomeFeatures}>
                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <FiWifi />
                                    </div>
                                    <h3 className={styles.featureTitle}>24/7 Support</h3>
                                    <p className={styles.featureDescription}>
                                        Get instant assistance anytime with our AI-powered support system
                                    </p>
                                </div>
                                
                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <FiTool />
                                    </div>
                                    <h3 className={styles.featureTitle}>Quick Solutions</h3>
                                    <p className={styles.featureDescription}>
                                        Troubleshoot common issues and get step-by-step guidance
                                    </p>
                                </div>
                                
                            </div>

                            <button 
                                className={styles.startButton}
                                onClick={() => document.querySelector(`.${styles.input}`).focus()}
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={styles.messageWrapper}
                            >
                                {renderMessage(message)}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <div className={styles.typingIndicator}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className={styles.inputArea}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={selectedProvider 
                            ? `Ask ${selectedProvider.name} Support a question...`
                            : "Select an ISP to start chatting..."
                        }
                        disabled={!selectedProvider || isLoading}
                        className={styles.input}
                    />
                    <button
                        type="submit"
                        disabled={!selectedProvider || isLoading || !inputMessage.trim()}
                        className={styles.sendButton}
                    >
                        <FiSend />
                    </button>
                </form>
            </div>
        </div>
    );
} 