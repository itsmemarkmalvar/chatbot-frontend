'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/chat.module.css';
import { FiSend, FiUser, FiCopy, FiCheck, FiLogOut, FiSettings, FiRefreshCw, FiWifi, FiTool, FiHelpCircle } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken, removeToken, isAuthenticated, logout } from '@/utils/auth';
import IspSelector from '@/components/isp/IspSelector';
import { PlanCard, TroubleshootingSteps, StatusMessage, FaqList } from '@/components/chat/MessageTypes';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { LeftPanel } from '@/components/layout/LeftPanel';
import Notification from '@/components/common/Notification';
import { getIspAiName, getIspAiFullName } from '@/utils/ispConfig';
import GuidedTour, { resetTour } from '@/components/common/GuidedTour';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const router = useRouter();
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [isNewUser, setIsNewUser] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch user info on component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = getToken();
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/user/info`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setUserInfo(data);
                        setIsNewUser(data.is_new_user);
                        
                        // Check localStorage for tourCompleted flag
                        const tourCompleted = localStorage.getItem('tourCompleted');
                        
                        // Show tour if user is new OR tour was never completed (tourCompleted is null)
                        const shouldShowTour = data.is_new_user || !tourCompleted;
                        
                        setIsFirstVisit(shouldShowTour);
                        
                        // Delay setting isLoaded to ensure DOM is ready first
                        setTimeout(() => {
                            setIsLoaded(true);
                        }, 500);
                    } else {
                        console.error('Failed to fetch user info:', data.error);
                        setNotification({
                            message: 'Failed to load user information',
                            type: 'error'
                        });
                        setIsLoaded(true);
                    }
                } else if (response.status === 401) {
                    // Unauthorized - token expired or invalid
                    removeToken();
                    router.push('/login');
                } else {
                    throw new Error('Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                setNotification({
                    message: 'Error loading user information',
                    type: 'error'
                });
                setIsLoaded(true);
            }
        };

        fetchUserInfo();
    }, [router]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const scrollHeight = container.scrollHeight;
            const height = container.clientHeight;
            const maxScroll = scrollHeight - height;
            
            // Smooth scroll to bottom
            container.scrollTo({
                top: maxScroll,
                behavior: 'smooth'
            });
        }
    };

    // Scroll to bottom on initial load and when messages change
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        
        setTimeout(scrollToBottom, 100);
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        // Scroll when new messages are added
        setTimeout(scrollToBottom, 100);
    }, [messages]);

    // Scroll when typing indicator appears
    useEffect(() => {
        if (isTyping) {
            setTimeout(scrollToBottom, 100);
        }
    }, [isTyping]);

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
        const aiName = getIspAiName(provider.name);
        const aiFullName = getIspAiFullName(provider.name);
        
        // Create a more personalized welcome message
        const welcomeMessage = userInfo?.name
            ? `Hi ${userInfo.name}! I'm ${aiName} (${aiFullName}), your dedicated ${provider.name} support assistant. How can I help you today?`
            : `Welcome! I'm ${aiName} (${aiFullName}), your dedicated ${provider.name} support assistant. How can I help you today?`;

        // Add a system message when provider is selected
        const systemMessage = {
            type: 'status',
            status: {
                type: 'success',
                message: welcomeMessage
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

        setIsLoading(true);
        setIsTyping(true);

        try {
            const token = getToken();
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${API_BASE_URL}/chat/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage.message,
                    provider: selectedProvider.name,
                    category: categoryId,
                    userName: userInfo?.name
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch response: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            const botResponse = {
                timestamp: new Date().toISOString(),
                isBot: true,
                type: data.type,
                message: data.message,
                content: data.content
            };
            
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error in handleCategorySelect:', error);
            const errorMessage = {
                type: 'status',
                status: {
                    type: 'error',
                    message: error.message || 'Failed to fetch information. Please try again.'
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
                    provider: selectedProvider.name,
                    userName: userInfo?.name // Send user name to backend
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

        if (message.type === 'faq_list' && message.content?.categories) {
            return (
                <div className={styles.messageWrapper}>
                    <div className={styles.botMessage}>
                        <div className={styles.messageContent}>
                            <div className={styles.messageHeader}>
                                <RiRobot2Line className={styles.botIcon} />
                                <span className={styles.timestamp}>
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <p className={styles.messageText}>{message.message}</p>
                            <FaqList 
                                faqData={message.content} 
                                onQuestionClick={(question) => {
                                    setInputMessage(question);
                                    handleSubmit({ preventDefault: () => {} });
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (message.type === 'plans' && message.content?.plans) {
            return (
                <div className={styles.messageWrapper}>
                    <div className={styles.botMessage}>
                        <div className={styles.messageContent}>
                            <div className={styles.messageHeader}>
                                <RiRobot2Line className={styles.botIcon} />
                                <span className={styles.timestamp}>
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <p className={styles.planIntro}>{message.message}</p>
                            <div className={styles.plansGrid}>
                                {message.content.plans.map((plan, index) => (
                                    <PlanCard 
                                        key={`${plan.name}-${index}`} 
                                        plan={{
                                            ...plan,
                                            type: plan.type || 'residential'
                                        }} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (message.type === 'support' && message.content?.steps) {
            return (
                <div className={styles.messageWrapper}>
                    <div className={styles.botMessage}>
                        <div className={styles.messageHeader}>
                            <RiRobot2Line className={styles.botIcon} />
                            <span className={styles.timestamp}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <TroubleshootingSteps steps={message.content.steps} />
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.messageWrapper} data-user={message.isUser}>
                <div className={message.isUser ? styles.userMessage : styles.botMessage}>
                    <div className={styles.messageHeader}>
                        {message.isUser ? (
                            <FiUser className={styles.userIcon} />
                        ) : (
                            <RiRobot2Line className={styles.botIcon} />
                        )}
                        <span className={styles.timestamp}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <div className={styles.messageContent}>
                        <ReactMarkdown>{message.message}</ReactMarkdown>
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

    // GuidedTour component with memoization to prevent unnecessary rerenders
    const renderGuidedTour = useCallback(() => {
        if (!isLoaded) return null;
        return <GuidedTour isFirstVisit={isFirstVisit} />;
    }, [isLoaded, isFirstVisit]);

    return (
        <div className={styles.mainContainer}>
            {renderGuidedTour()}
            <Notification 
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
            <div className="ispSelector">
                <LeftPanel
                    selectedProvider={selectedProvider}
                    onProviderSelect={handleProviderSelect}
                    onCategorySelect={handleCategorySelect}
                    onSelectChat={handleChatSelect}
                    onNotification={handleNotification}
                />
            </div>

            <div className={styles.chatPanel}>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerContent}>
                        <RiRobot2Line className={styles.botIcon} />
                        <div className={styles.headerText}>
                            <h1>{selectedProvider ? getIspAiName(selectedProvider.name) : 'ISP Support Assistant'}</h1>
                            <p className={styles.statusText}>
                                {selectedProvider 
                                    ? `${selectedProvider.name} Support Active`
                                    : 'Select an ISP to begin'}
                            </p>
                            {selectedProvider && (
                                <p className={styles.aiSubtitle}>
                                    {getIspAiFullName(selectedProvider.name)}
                                </p>
                            )}
                        </div>
                        <button 
                            className={styles.helpButton}
                            onClick={() => {
                                // Get the token to check if user is authenticated
                                const token = getToken();
                                if (!token) return;
                                
                                // Reset the tour in a safer way by first unmounting it
                                setIsFirstVisit(false);
                                // Use a short timeout to ensure component unmounts first
                                setTimeout(() => {
                                    resetTour();
                                    setIsFirstVisit(true);
                                    setNotification({
                                        message: 'Guided tour restarted',
                                        type: 'success'
                                    });
                                }, 100);
                            }}
                            title="Help"
                        >
                            <FiHelpCircle />
                        </button>
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
                <div ref={messagesContainerRef} className={`${styles.messagesContainer} messageTypes`} data-tour="chat-area">
                    {isLoaded && messages.length === 0 && (
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
                <form onSubmit={handleSubmit} className={`${styles.inputArea} chatInput`} data-tour="chat-input">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={selectedProvider 
                            ? `Ask ${selectedProvider.name} Support a question...`
                            : "Select an ISP to start chatting..."}
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

            <div className={`${styles.rightPanel} chatHistory`}>
                <ChatHistory
                    chats={messages}
                    onSelectChat={handleChatSelect}
                    selectedChat={selectedChat}
                />
            </div>
        </div>
    );
} 