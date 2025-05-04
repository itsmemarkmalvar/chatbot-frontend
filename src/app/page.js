'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './landing.module.css';
import { FiArrowRight, FiMessageSquare, FiUsers, FiActivity, FiClock } from 'react-icons/fi';

export default function Landing() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <div className={`${styles.landingContainer} ${isLoaded ? styles.loaded : ''}`}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <FiMessageSquare />
          </span>
          <span className={styles.logoText}>NetGenie</span>
        </div>
        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#providers" className={styles.navLink}>Providers</a>
          <button onClick={navigateToLogin} className={styles.loginButton}>Login</button>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Intelligent Support for Your Internet Service
            </h1>
            <p className={styles.heroSubtitle}>
              Get instant answers to your questions about PLDT, Globe, and Converge services with our AI-powered assistant.
            </p>
            <div className={styles.heroCta}>
              <button onClick={navigateToRegister} className={styles.primaryButton}>
                Get Started
                <FiArrowRight />
              </button>
              <button onClick={navigateToLogin} className={styles.secondaryButton}>
                Login to Your Account
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.chatPreview}>
              <div className={styles.chatHeader}>
                <div className={styles.botIconContainer}>
                  <FiMessageSquare className={styles.botIcon} />
                </div>
                <div className={styles.chatInfo}>
                  <h3>ISP Assistant</h3>
                  <span>Online</span>
                </div>
              </div>
              <div className={styles.chatMessages}>
                <div className={styles.userMessage}>
                  <p>What are your fastest internet plans?</p>
                </div>
                <div className={styles.botMessage}>
                  <p>We offer several high-speed plans! Our Fiber Plan 1699 provides 100 Mbps for ₱1699/month. Would you like to know more about our other plans?</p>
                </div>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <h2 className={styles.sectionTitle}>Key Features</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiMessageSquare />
              </div>
              <h3>Instant Responses</h3>
              <p>Get immediate answers to your questions about plans, technical issues, and service details.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiUsers />
              </div>
              <h3>Provider-Specific Knowledge</h3>
              <p>Specialized information for PLDT, Globe, and Converge services all in one place.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiActivity />
              </div>
              <h3>Smart Recommendations</h3>
              <p>Receive personalized suggestions based on your usage patterns and needs.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiClock />
              </div>
              <h3>24/7 Availability</h3>
              <p>Access support anytime, day or night, without waiting for business hours.</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Create an Account</h3>
              <p>Sign up with your email and create a secure password.</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Select Your Provider</h3>
              <p>Choose your ISP from PLDT, Globe, or Converge.</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Start Chatting</h3>
              <p>Ask questions and get instant, accurate responses.</p>
            </div>
          </div>
        </section>

        <section id="providers" className={styles.providers}>
          <h2 className={styles.sectionTitle}>Supported Providers</h2>
          <div className={styles.providerCards}>
            <div className={styles.providerCard}>
              <h3>PLDT</h3>
              <p>PLDT AINA - Advanced Intelligent Network Assistant</p>
              <button onClick={navigateToRegister} className={styles.providerButton}>
                Try PLDT AINA
              </button>
            </div>
            <div className={styles.providerCard}>
              <h3>Globe</h3>
              <p>GlobeGuide - Your Digital Globe Assistant</p>
              <button onClick={navigateToRegister} className={styles.providerButton}>
                Try GlobeGuide
              </button>
            </div>
            <div className={styles.providerCard}>
              <h3>Converge</h3>
              <p>C-Verse - Your Virtual Converge Assistant</p>
              <button onClick={navigateToRegister} className={styles.providerButton}>
                Try C-Verse
              </button>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>Ready to Try Our Chatbot?</h2>
            <p>Get started today and experience the future of ISP customer support.</p>
            <button onClick={navigateToRegister} className={styles.primaryButton}>
              Create Your Account
              <FiArrowRight />
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <FiMessageSquare />
            <span>NetGenie</span>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Navigation</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#providers">Providers</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Account</h4>
              <a onClick={navigateToLogin} style={{ cursor: 'pointer' }}>Login</a>
              <a onClick={navigateToRegister} style={{ cursor: 'pointer' }}>Register</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© 2025 NetGenie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
