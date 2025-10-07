import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.agreeToTerms) return 'Please agree to terms and conditions';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType
      };

      const result = await register(registrationData);
      
      if (result.success) {
        onClose(); // Close modal on successful registration
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '2rem',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    maxWidth: '500px',
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

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
    background: 'white'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const checkboxGroupStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem'
  };

  const checkboxLabelStyle = {
    fontSize: '0.875rem',
    color: '#374151',
    lineHeight: '1.4'
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
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Join ConnectSpace and find your perfect property</p>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={rowStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Enter your first name"
              required
              disabled={loading}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Enter your last name"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter your email address"
            required
            disabled={loading}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="phone">Phone Number (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter your phone number"
            disabled={loading}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="userType">Account Type</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            style={selectStyle}
            required
            disabled={loading}
          >
            <option value="tenant">Tenant - Looking for property</option>
            <option value="landlord">Landlord - Renting out property</option>
            <option value="agent">Agent - Real estate professional</option>
          </select>
        </div>

        <div style={rowStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Create a password"
              required
              disabled={loading}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div style={checkboxGroupStyle}>
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          <label style={checkboxLabelStyle} htmlFor="agreeToTerms">
            I agree to the <span style={linkStyle}>Terms of Service</span> and{' '}
            <span style={linkStyle}>Privacy Policy</span>
          </label>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div style={footerStyle}>
        <p>
          Already have an account?{' '}
          <span style={linkStyle} onClick={onSwitchToLogin}>
            Sign in here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;