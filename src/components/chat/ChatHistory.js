import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiCalendar, FiTrash2, FiChevronLeft, FiChevronRight, FiMessageSquare, FiClock, FiX } from 'react-icons/fi';
import styles from '@/styles/chat.module.css';
import { getToken } from '@/utils/auth';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const ChatHistory = ({ onSelectChat, selectedProvider, onNotification }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, chatId: null });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0
    });
    
    // Add mounted ref to track component lifecycle
    const isMounted = useRef(true);

    // Cleanup effect
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchHistory = async (page = 1) => {
        try {
            setLoading(true);
            const token = getToken();
            // Ensure page is a valid number
            const currentPage = Math.max(1, parseInt(page) || 1);
            
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('per_page', pagination.perPage.toString());
            
            if (selectedProvider) {
                params.append('provider', selectedProvider);
            }
            if (search) {
                params.append('search', search);
            }

            const response = await fetch(`${API_BASE_URL}/chat/history?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chat history');
            }

            const data = await response.json();
            if (data.success) {
                setHistory(data.data.chats);
                setPagination(prev => ({
                    ...prev,
                    currentPage: data.data.pagination.current_page,
                    lastPage: data.data.pagination.last_page,
                    total: data.data.pagination.total
                }));
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
            onNotification('Failed to fetch chat history', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteChats = async (chatId) => {
        if (!isMounted.current) return;
        
        try {
            setDeleteLoading(chatId);
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/chat/history`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chat_ids: [chatId] })
            });

            if (!response.ok) {
                throw new Error('Failed to delete chat');
            }

            const data = await response.json();
            if (data.success && isMounted.current) {
                // Close modal first
                setDeleteModal({ isOpen: false, chatId: null });
                
                // Update local state safely
                setHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
                
                // Handle pagination after state update
                const remainingChats = history.filter(chat => chat.id !== chatId);
                if (remainingChats.length === 0 && pagination.currentPage > 1) {
                    fetchHistory(pagination.currentPage - 1);
                } else if (remainingChats.length === 0) {
                    fetchHistory(1);
                }
                
                // Show success notification
                onNotification('Chat deleted successfully', 'success');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            if (isMounted.current) {
                onNotification('Failed to delete chat', 'error');
                setDeleteModal({ isOpen: false, chatId: null });
            }
        } finally {
            if (isMounted.current) {
                setDeleteLoading(null);
            }
        }
    };

    // Fetch history when provider changes
    useEffect(() => {
        if (selectedProvider) {
            fetchHistory(1);
        }
    }, [selectedProvider]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== undefined) {
                fetchHistory(1);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    };

    return (
        <>
            <DeleteConfirmationModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, chatId: null })}
                onConfirm={() => {
                    const chatIdToDelete = deleteModal.chatId;
                    if (chatIdToDelete) {
                        handleDeleteChats(chatIdToDelete);
                    }
                }}
                isLoading={deleteLoading === deleteModal.chatId}
            />
            <div className={styles.historyPanel}>
                <div className={styles.historyHeader}>
                    <h2>
                        <FiMessageSquare />
                        Chat History
                    </h2>
                    <form onSubmit={(e) => e.preventDefault()} className={styles.historySearch}>
                        <div className={styles.searchWrapper}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search conversations..."
                                className={styles.searchInput}
                            />
                        </div>
                    </form>
                </div>

                <div className={styles.historyList}>
                    {loading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.loadingSpinner} />
                            <p>Loading conversations...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiMessageSquare />
                            <h3>No conversations yet</h3>
                            <p>Your chat history will appear here once you start a conversation.</p>
                        </div>
                    ) : (
                        history.map((chat) => (
                            <div
                                key={chat.id}
                                className={styles.historyItem}
                                onClick={() => onSelectChat(chat)}
                            >
                                <div className={styles.historyItemContent}>
                                    <p className={styles.historyPreview}>{chat.message}</p>
                                    <span className={styles.historyTimestamp}>
                                        <FiClock />
                                        {new Date(chat.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <button
                                    className={`${styles.deleteButton} ${deleteLoading === chat.id ? styles.loading : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setDeleteModal({ isOpen: true, chatId: chat.id });
                                    }}
                                    disabled={deleteLoading === chat.id}
                                    data-tooltip="Delete conversation"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {history.length > 0 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => fetchHistory(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className={`${styles.paginationButton} ${styles.tooltip}`}
                            data-tooltip="Previous page"
                        >
                            <FiChevronLeft />
                        </button>
                        <span className={styles.paginationInfo}>
                            Page {pagination.currentPage} of {pagination.lastPage}
                        </span>
                        <button
                            onClick={() => fetchHistory(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className={`${styles.paginationButton} ${styles.tooltip}`}
                            data-tooltip="Next page"
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}; 