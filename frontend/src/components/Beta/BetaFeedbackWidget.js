import React, { useState } from 'react';

const BetaFeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: '',
    liked: '',
    difficult: '',
    wouldUse: '',
    suggestions: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send feedback to your backend
    try {
      const response = await fetch('/api/beta-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedback,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });

      if (response.ok) {
        alert('Thank you for your feedback! 🎉');
        setIsOpen(false);
        setFeedback({
          rating: '',
          liked: '',
          difficult: '',
          wouldUse: '',
          suggestions: '',
          email: ''
        });
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const handleChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* Beta Banner */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ff6b35',
        color: 'white',
        padding: '8px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        🚀 BETA VERSION - Help us improve ConnectSpace! 
        <button
          onClick={() => setIsOpen(true)}
          style={{
            marginLeft: '10px',
            backgroundColor: 'white',
            color: '#ff6b35',
            border: 'none',
            padding: '4px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          Give Feedback
        </button>
      </div>

      {/* Feedback Button - Floating */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        💬 Feedback
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#1f2937',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                Beta Feedback 🚀
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <p style={{
              color: '#6b7280',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              Your feedback helps us build a better ConnectSpace! This takes just 2 minutes.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Rating */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  How would you rate your overall experience? (1-10) *
                </label>
                <select
                  value={feedback.rating}
                  onChange={(e) => handleChange('rating', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select a rating</option>
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>
                      {num} {num >= 8 ? '😍' : num >= 6 ? '🙂' : num >= 4 ? '😐' : '😞'}
                    </option>
                  ))}
                </select>
              </div>

              {/* What they liked */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  What did you like most about ConnectSpace?
                </label>
                <textarea
                  value={feedback.liked}
                  onChange={(e) => handleChange('liked', e.target.value)}
                  placeholder="What worked well for you?"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* What was difficult */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  What was confusing or difficult to use?
                </label>
                <textarea
                  value={feedback.difficult}
                  onChange={(e) => handleChange('difficult', e.target.value)}
                  placeholder="Any bugs, confusing parts, or missing features?"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Would they use it */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Would you use ConnectSpace when it launches? *
                </label>
                <select
                  value={feedback.wouldUse}
                  onChange={(e) => handleChange('wouldUse', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select an option</option>
                  <option value="definitely">Definitely! 🎉</option>
                  <option value="probably">Probably 👍</option>
                  <option value="maybe">Maybe 🤔</option>
                  <option value="probably-not">Probably not 👎</option>
                  <option value="definitely-not">Definitely not ❌</option>
                </select>
              </div>

              {/* Additional suggestions */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Any additional suggestions or feature requests?
                </label>
                <textarea
                  value={feedback.suggestions}
                  onChange={(e) => handleChange('suggestions', e.target.value)}
                  placeholder="What features would make this even better?"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Email (optional) */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Email (optional - for follow-up questions)
                </label>
                <input
                  type="email"
                  value={feedback.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Submit buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Submit Feedback 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BetaFeedbackWidget;