'use client';

import { useEffect, useCallback, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import styles from '@/styles/guidedTour.module.css';

const GuidedTour = ({ isFirstVisit }) => {
  const driverRef = useRef(null);
  
  const handleTourEnd = useCallback(() => {
    localStorage.setItem('tourCompleted', 'true');
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM elements are ready
    const initTour = setTimeout(() => {
      if (isFirstVisit && !driverRef.current) {
        try {
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
                  title: '<h3>Chat Area</h3>',
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
      }
    }, 1000); // Increased delay to 1000ms to ensure DOM is ready

    // Cleanup function
    return () => {
      clearTimeout(initTour);
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    };
  }, [isFirstVisit, handleTourEnd]);

  return null;
};

export default GuidedTour; 