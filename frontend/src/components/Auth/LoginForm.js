import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        onClose(); // Close modal on successful login
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '2rem',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    maxWidth: '400px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: '#64748b',
    fontSize: '0.875rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: 'white',
    '::placeholder': {
      color: '#9ca3af'
    }
  };

  const checkboxGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    background: loading ? '#9ca3af' : '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s'
  };

  const errorStyle = {
    color: '#dc2626',
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: '0.5rem',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px'
  };

  const linkStyle = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.875rem',
    cursor: 'pointer'
  };

  const footerStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    color: '#64748b'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Welcome Back</h2>
        <p style={subtitleStyle}>Sign in to your ConnectSpace account</p>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <div style={checkboxGroupStyle}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={loading}
          />
          <label style={labelStyle} htmlFor="rememberMe">Remember me</label>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={footerStyle}>
        <p>
          Don't have an account?{' '}
          <span style={linkStyle} onClick={onSwitchToRegister}>
            Sign up here
          </span>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <span style={linkStyle}>
            Forgot your password?
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;