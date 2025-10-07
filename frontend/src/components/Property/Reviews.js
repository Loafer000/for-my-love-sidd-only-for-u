import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  rating: yup.number().required('Rating is required').min(1, 'Rating is required').max(5),
  comment: yup.string().required('Comment is required').min(10, 'Comment must be at least 10 characters')
});

const Reviews = ({ reviews = [] }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });

  const watchedRating = watch('rating');

  const onSubmit = async (data) => {
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Review submitted successfully!');
      reset();
      setShowAddReview(false);
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const renderStars = (rating, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setValue('rating', star) : undefined}
            className={`${size} ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            } ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            disabled={!interactive}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center mt-2">
              {renderStars(Math.round(averageRating))}
              <span className="ml-2 text-sm text-gray-600">
                {averageRating} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAddReview(!showAddReview)}
          className="btn btn-primary"
        >
          Write Review
        </button>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg animate-slide-up">
          <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(watchedRating, true, 'w-8 h-8')}
                <span className="text-sm text-gray-600 ml-2">
                  {watchedRating > 0 ? `${watchedRating} star${watchedRating !== 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
              <input type="hidden" {...register('rating')} />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                {...register('comment')}
                rows={4}
                placeholder="Share your experience with this property..."
                className="input"
              />
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Review'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddReview(false);
                  reset();
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={review.avatar || '/default-avatar.svg'}
                    alt={review.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h5 className="font-medium text-gray-900">{review.author}</h5>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating, false, 'w-4 h-4')}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💬</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h4>
            <p className="text-gray-600 mb-4">
              Be the first to share your experience with this property
            </p>
            <button
              onClick={() => setShowAddReview(true)}
              className="btn btn-primary"
            >
              Write First Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;