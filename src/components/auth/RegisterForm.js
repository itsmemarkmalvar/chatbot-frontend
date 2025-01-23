"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement register API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/login'); // Redirect to login after successful registration
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={`${styles.authContainer} ${styles.registerContainer}`}>
        <section className={styles.formSection}>
          <div className={styles.logo}>Chatbot AI</div>
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <h2>Create your Account</h2>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                disabled={isLoading}
                minLength={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@company.com"
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => togglePasswordVisibility('password')}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <button 
              type="submit" 
              className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading}
            >
              Create Account
            </button>

            <p className={styles.switchAuth}>
              Already have an account? <Link href="/login" className={styles.link}>Sign in</Link>
            </p>
          </form>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.mainCard}>
            <div className={styles.testimonial}>
              <h3>Join our community.</h3>
              <p>"Talk to our AI chatbot and get the best customer service experience."</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterForm; 