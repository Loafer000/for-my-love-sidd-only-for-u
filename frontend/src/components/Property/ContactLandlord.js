import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  message: yup.string().required('Message is required')
});

const ContactLandlord = ({ landlord }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent to landlord!');
      reset();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleScheduleViewing = () => {
    toast.success('Viewing request sent! The landlord will contact you soon.');
  };

  const handleCallNow = () => {
    if (landlord?.phone) {
      window.open(`tel:${landlord.phone}`);
    } else {
      toast.error('Phone number not available');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="space-y-3">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary w-full"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Landlord
        </button>
        
        <button
          onClick={handleScheduleViewing}
          className="btn btn-secondary w-full"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule Viewing
        </button>
        
        {landlord?.phone && (
          <button
            onClick={handleCallNow}
            className="btn bg-green-600 text-white hover:bg-green-700 w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </button>
        )}
      </div>

      {/* Contact Form */}
      {isFormOpen && (
        <div className="border-t pt-4 animate-slide-up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('name')}
                type="text"
                placeholder="Your Name"
                className="input"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Your Email"
                className="input"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('phone')}
                type="tel"
                placeholder="Your Phone (Optional)"
                className="input"
              />
            </div>

            <div>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="Hi, I'm interested in this property. When can I schedule a viewing?"
                className="input"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Landlord Info */}
      <div className="border-t pt-4 text-center">
        <div className="text-sm text-gray-600 mb-2">
          Response time: Usually within 2 hours
        </div>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          {landlord?.verified && (
            <span className="flex items-center">
              <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
          {landlord?.rating && (
            <span>
              ⭐ {landlord.rating.toFixed(1)} rating
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactLandlord;