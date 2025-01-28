"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';
import { setToken, setUser } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
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
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        router.push('/chat');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages.join(' '));
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
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
                className={error ? styles.inputError : ''}
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
                className={error ? styles.inputError : ''}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={error ? styles.inputError : ''}
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
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password_confirmation">Confirm Password</label>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={error ? styles.inputError : ''}
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
            </div>

            <button 
              type="submit" 
              className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.password_confirmation}
            >
              <span className={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </span>
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