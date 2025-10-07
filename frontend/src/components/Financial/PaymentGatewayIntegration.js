import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PaymentGatewayIntegration = ({ amount, bookingId, propertyId, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    // Initialize payment methods
    setPaymentMethods([
      { id: 'razorpay', name: 'Razorpay', icon: '💳', enabled: true },
      { id: 'upi', name: 'UPI Payment', icon: '📱', enabled: true },
      { id: 'netbanking', name: 'Net Banking', icon: '🏦', enabled: true },
      { id: 'wallet', name: 'Digital Wallet', icon: '👛', enabled: true }
    ]);
  }, []);

  // Initialize Razorpay payment
  const initiateRazorpayPayment = async () => {
    try {
      setLoading(true);

      // Create order on backend
      const orderResponse = await api.post('/payments/create-order', {
        amount: amount,
        bookingId: bookingId,
        propertyId: propertyId,
        currency: 'INR'
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { order } = orderResponse.data.data;

      // Razorpay configuration
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_key', // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: 'ConnectSpace',
        description: `Property Booking Payment - ${bookingId}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId
            });

            if (verifyResponse.data.success) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: amount
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name', // Get from user context
          email: 'customer@email.com', // Get from user context
          contact: '9876543210' // Get from user context
        },
        notes: {
          bookingId: bookingId,
          propertyId: propertyId
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: function() {
            onFailure('Payment cancelled by user');
            setLoading(false);
          }
        }
      };

      // Create Razorpay instance and open payment modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      onFailure(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  // Handle UPI payment
  const handleUPIPayment = async () => {
    try {
      setLoading(true);
      
      // For demo, we'll use Razorpay's UPI method
      // In production, you might use different UPI providers
      await initiateRazorpayPayment();
      
    } catch (error) {
      onFailure(error.message || 'UPI payment failed');
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

  const amountStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#059669',
    marginBottom: '1rem'
  };

  const methodsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const methodCardStyle = (enabled) => ({
    padding: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: enabled ? 'pointer' : 'not-allowed',
    textAlign: 'center',
    background: enabled ? 'white' : '#f8fafc',
    opacity: enabled ? 1 : 0.6,
    transition: 'all 0.2s',
    ':hover': enabled ? {
      borderColor: '#3b82f6',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
    } : {}
  });

  const methodIconStyle = {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  };

  const methodNameStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  };

  const securityInfoStyle = {
    padding: '1rem',
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#0369a1',
    textAlign: 'center'
  };

  const handlePaymentMethod = (methodId) => {
    if (loading) return;

    switch (methodId) {
      case 'razorpay':
        initiateRazorpayPayment();
        break;
      case 'upi':
        handleUPIPayment();
        break;
      case 'netbanking':
        initiateRazorpayPayment(); // Razorpay handles net banking
        break;
      case 'wallet':
        initiateRazorpayPayment(); // Razorpay handles wallets
        break;
      default:
        onFailure('Payment method not supported');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Complete Payment</h2>
        <div style={amountStyle}>₹{amount?.toLocaleString()}</div>
      </div>

      <div style={methodsGridStyle}>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            style={methodCardStyle(method.enabled && !loading)}
            onClick={() => handlePaymentMethod(method.id)}
          >
            <div style={methodIconStyle}>{method.icon}</div>
            <div style={methodNameStyle}>{method.name}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ color: '#64748b' }}>Processing payment...</div>
        </div>
      )}

      <div style={securityInfoStyle}>
        🔒 Your payment is secured with 256-bit SSL encryption
      </div>
    </div>
  );
};

export default PaymentGatewayIntegration;