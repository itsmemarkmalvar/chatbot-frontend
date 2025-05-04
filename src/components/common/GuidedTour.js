'use client';

import { useEffect, useCallback, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import styles from '@/styles/guidedTour.module.css';
import { getToken } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Export a function to reset the tour state
export const resetTour = () => {
  localStorage.removeItem('tourCompleted');
};

const GuidedTour = ({ isFirstVisit }) => {
  const driverRef = useRef(null);
  
  // Clean up function to ensure proper cleanup
  const cleanupTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
  }, []);
  
  const handleTourEnd = useCallback(async () => {
    localStorage.setItem('tourCompleted', 'true');
    
    // Notify the backend that the tour is completed
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/user/tour-completed`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Failed to update tour status:', error);
    }
    
    cleanupTour();
  }, [cleanupTour]);

  // Effect to destroy the tour on component unmount
  useEffect(() => {
    return cleanupTour;
  }, [cleanupTour]);

  // Effect to initialize the tour
  useEffect(() => {
    if (!isFirstVisit) return;
    
    // Small delay to ensure DOM elements are ready
    const initTour = setTimeout(() => {
      try {
        if (driverRef.current) return; // Prevent duplicate initialization
        
        driverRef.current = driver({
          showProgress: true,
          animate: true,
          smoothScroll: true,
          allowClose: true,
          overlayClickNext: false,
          stagePadding: 4,
          className: styles.customTour,
          onReset: handleTourEnd,
          onDestroyStarted: handleTourEnd,
          popoverClass: 'driver-popover',
          steps: [
            {
              element: '[data-tour="isp-selector"]',
              popover: {
                title: '<h3>Select Your ISP</h3>',
                description: 'Choose your Internet Service Provider from PLDT, Globe, or Converge to get started.',
                side: "right",
                align: 'start',
                doneBtnText: 'Skip Tour',
                nextBtnText: 'Next →',
                prevBtnText: '← Back'
              }
            },
            {
              element: '[data-tour="quick-access"]',
              popover: {
                title: '<h3>Quick Access Menu</h3>',
                description: 'Quickly access Internet Plans, Technical Support, Billing information, and FAQs.',
                side: "right",
                align: 'start',
                doneBtnText: 'Skip Tour',
                nextBtnText: 'Next →',
                prevBtnText: '← Back'
              }
            },
            {
              element: '[data-tour="chat-input"]',
              popover: {
                title: '<h3>Chat Area</h3>',
                description: 'This is where you can type your questions and get instant support and solutions.',
                side: "left",
                align: 'start',
                doneBtnText: 'Skip Tour',
                nextBtnText: 'Next →',
                prevBtnText: '← Back'
              }
            },
            {
              element: '[data-tour="chat-history"]',
              popover: {
                title: '<h3>Chat History</h3>',
                description: 'Click here to view your previous conversations and easily reference past solutions.',
                side: "right",
                align: 'start',
                doneBtnText: 'Skip Tour',
                nextBtnText: 'Next →',
                prevBtnText: '← Back'
              }
            },
            {
              element: '[data-tour="chat-area"]',
              popover: {
                title: '<h3>Chat Box</h3>',
                description: 'This is where your conversation with our AI assistant will appear. Get instant support and solutions here.',
                side: "bottom",
                align: 'center',
                doneBtnText: 'Get Started!',
                nextBtnText: 'Finish →',
                prevBtnText: '← Back'
              }
            }
          ]
        });

        // Start the tour
        if (driverRef.current) {
          driverRef.current.drive();
        }
      } catch (error) {
        console.error('Error initializing tour:', error);
      }
    }, 1500);

    return () => {
      clearTimeout(initTour);
      cleanupTour();
    };
  }, [isFirstVisit, handleTourEnd, cleanupTour]);

  return null;
};

export default GuidedTour; 