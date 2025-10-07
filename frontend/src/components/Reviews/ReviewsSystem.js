import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ReviewsSystem.css';

const ReviewsSystem = ({ propertyId, landlordId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    category: 'overall'
  });
  const [showAddReview, setShowAddReview] = useState(false);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  // Sample reviews data
  useEffect(() => {
    setReviews([
      {
        id: 1,
        user: 'John Doe',
        rating: 5,
        title: 'Excellent Property!',
        comment: 'Great location, responsive landlord, and well-maintained facilities.',
        category: 'overall',
        date: '2024-10-01',
        helpful: 12,
        verified: true
      },
      {
        id: 2,
        user: 'Sarah Smith',
        rating: 4,
        title: 'Good value for money',
        comment: 'Nice apartment, could use some updates in the kitchen.',
        category: 'value',
        date: '2024-09-28',
        helpful: 8,
        verified: true
      }
    ]);
  }, [propertyId]);

  const submitReview = async () => {
    if (!newReview.title.trim() || !newReview.comment.trim()) return;

    const reviewData = {
      id: Date.now(),
      user: user.name,
      userId: user.id,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      category: newReview.category,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: true
    };

    setReviews(prev => [reviewData, ...prev]);
    setNewReview({ rating: 5, title: '', comment: '', category: 'overall' });
    setShowAddReview(false);

    // TODO: Send to backend
    try {
      // await submitReviewToServer(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const filteredReviews = reviews.filter(review => 
    filter === 'all' || review.category === filter
  );

  return (
    <div className="reviews-system">
      <div className="reviews-header">
        <h3>Property Reviews ({reviews.length})</h3>
        <button 
          className="add-review-btn"
          onClick={() => setShowAddReview(!showAddReview)}
        >
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="average-rating">
          <div className="rating-number">{getAverageRating()}</div>
          {renderStars(Math.round(getAverageRating()))}
          <div className="total-reviews">{reviews.length} reviews</div>
        </div>
        
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = getRatingDistribution()[rating];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="rating-bar">
                <span>{rating}★</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="count">({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="add-review-form">
          <h4>Write Your Review</h4>
          
          <div className="form-group">
            <label>Rating</label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={newReview.category}
              onChange={(e) => setNewReview(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="overall">Overall Experience</option>
              <option value="location">Location</option>
              <option value="value">Value for Money</option>
              <option value="maintenance">Maintenance</option>
              <option value="communication">Communication</option>
            </select>
          </div>

          <div className="form-group">
            <label>Review Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
            />
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your detailed experience..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={() => setShowAddReview(false)}>
              Cancel
            </button>
            <button className="submit-btn" onClick={submitReview}>
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="review-filters">
        {['all', 'overall', 'location', 'value', 'maintenance', 'communication'].map(category => (
          <button
            key={category}
            className={`filter-tab ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {category !== 'all' && ` (${reviews.filter(r => r.category === category).length})`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">📝</div>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-details">
                    <div className="reviewer-name">
                      {review.user}
                      {review.verified && <span className="verified-badge">✓</span>}
                    </div>
                    <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              <div className="review-content">
                <h5 className="review-title">{review.title}</h5>
                <p className="review-comment">{review.comment}</p>
              </div>
              
              <div className="review-footer">
                <div className="review-category">
                  Category: {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
                </div>
                <button className="helpful-btn">
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSystem;