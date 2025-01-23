'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/chat.module.css';
import { FiSend, FiUser, FiCopy, FiCheck, FiLogOut, FiSettings, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import { RiRobot2Line, RiCustomerService2Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken, removeToken, isAuthenticated, logout } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const router = useRouter();
    const [suggestions, setSuggestions] = useState([]);
    const [intent, setIntent] = useState(null);
    const [confidenceScore, setConfidenceScore] = useState(null);
    const [context, setContext] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        loadUsers();
        scrollToBottom();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadUsers = async () => {
        try {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const { data } = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                }
            } else if (response.status === 401) {
                removeToken();
                router.push('/login');
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

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

        // Add user message immediately
        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message: inputMessage,
                    context: context 
                })
            });

            if (response.ok) {
                const data = await response.json();
                setIsTyping(false);
                
                if (data.suggestions) setSuggestions(data.suggestions);
                if (data.intent) setIntent(data.intent);
                if (data.confidence) setConfidenceScore(data.confidence);
                if (data.context) setContext(data.context);

                // Add bot response as a new message
                const botResponse = {
                    message: data.response || data.message,
                    timestamp: new Date().toISOString(),
                    isBot: true,
                    intent: data.intent,
                    confidence: data.confidence
                };

                setMessages(prev => [...prev, botResponse]);
            } else if (response.status === 401) {
                removeToken();
                router.push('/login');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const copyToClipboard = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
        handleSubmit({ preventDefault: () => {} });
    };

    const renderSuggestions = () => {
        if (!suggestions.length) return null;
        
        return (
            <div className={styles.suggestionsContainer}>
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        className={styles.suggestionButton}
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        );
    };

    const renderIntentInfo = (msg) => {
        if (!msg.intent || !msg.confidence) return null;
        
        return (
            <div className={styles.intentInfo}>
                <span className={styles.intentLabel}>
                    Intent: {msg.intent}
                </span>
                <div className={styles.confidenceBar}>
                    <div 
                        className={styles.confidenceFill}
                        style={{ width: `${msg.confidence * 100}%` }}
                    />
                </div>
            </div>
        );
    };

    const renderUsers = () => (
        <div className={styles.usersList}>
            {users.map((user) => (
                <div
                    key={user.id}
                    className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.selectedUser : ''}`}
                    onClick={() => setSelectedUser(user)}
                >
                    <div className={styles.userItemContent}>
                        <div className={styles.userAvatar}>
                            <FiUser className={styles.userAvatarIcon} />
                            {user.online && <div className={styles.onlineIndicator} />}
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>{user.name}</p>
                            <span className={styles.userStatus}>
                                {user.online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.mainContainer}>
            {/* Left Panel - Users List */}
            <div className={styles.usersPanel}>
                <div className={styles.usersHeader}>
                    <h2>Chats</h2>
                    <button className={styles.headerButton} onClick={loadUsers}>
                        <FiRefreshCw />
                    </button>
                </div>
                {renderUsers()}
            </div>

            {/* Right Panel - Active Chat */}
            <div className={styles.chatPanel}>
                <div className={styles.chatHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.logoContainer}>
                            <RiRobot2Line className={styles.botIcon} />
                            <div className={styles.iconRing}></div>
                        </div>
                        <div className={styles.headerText}>
                            <h1>AI Customer Service</h1>
                            <p className={styles.statusText}>Online</p>
                        </div>
                        <div className={styles.headerControls}>
                            <button className={styles.headerButton} onClick={handleLogout}>
                                <FiLogOut />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.messagesContainer}>
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={styles.messageGroup}
                            >
                                <div className={`${styles.messageWrapper} ${msg.isUser ? styles.userMessage : styles.botMessage}`}>
                                    <div className={styles.messageHeader}>
                                        {msg.isUser ? (
                                            <>
                                                <span className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
                                                <FiUser className={styles.userIcon} />
                                            </>
                                        ) : (
                                            <>
                                                <RiRobot2Line className={styles.botIcon} />
                                                <span className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.messageContent}>
                                        {msg.isUser ? (
                                            msg.message
                                        ) : (
                                            <ReactMarkdown>{msg.message}</ReactMarkdown>
                                        )}
                                        {!msg.isUser && (
                                            <button
                                                className={styles.copyButton}
                                                onClick={() => copyToClipboard(msg.message, index)}
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === index ? <FiCheck /> : <FiCopy />}
                                            </button>
                                        )}
                                    </div>
                                    {!msg.isUser && renderIntentInfo(msg)}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <div className={styles.typingIndicator}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                    {renderSuggestions()}
                </div>

                <form onSubmit={handleSubmit} className={styles.inputForm}>
                    <div className={styles.inputWrapper}>
                        <textarea
                            ref={inputRef}
                            className={styles.input}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here... (Press Enter to send)"
                            rows={1}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={styles.sendButton}
                        disabled={isLoading || !inputMessage.trim()}
                    >
                        <FiSend className={styles.sendIcon} />
                        <div className={styles.sendButtonRipple} />
                    </button>
                </form>
            </div>
        </div>
    );
} 