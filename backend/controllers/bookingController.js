const { Booking, Property } = require('../models');
const { sendEmail } = require('../utils/email');

// Create new booking/inquiry
const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      bookingType = 'inquiry', // 'inquiry', 'booking', 'visit'
      name,
      email,
      phone,
      message,
      moveInDate,
      leaseDuration,
      visitDate,
      visitTime,
      specialRequests
    } = req.body;

    // Verify property exists and is available
    const property = await Property.findById(propertyId).populate('owner');
    if (!property || property.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for booking'
      });
    }

    // Create booking data
    const bookingData = {
      property: propertyId,
      tenant: req.user ? req.user._id : null,
      landlord: property.owner._id,
      type: bookingType,
      status: 'pending',

      // Contact Information
      contact: {
        name,
        email,
        phone,
        message: message || specialRequests
      },

      // Dates
      ...(moveInDate && {
        dates: {
          moveIn: new Date(moveInDate),
          moveOut: leaseDuration
            ? new Date(new Date(moveInDate).setMonth(new Date(moveInDate).getMonth() + parseInt(leaseDuration, 10)))
            : null
        }
      }),

      ...(visitDate && visitTime && {
        visitSchedule: {
          date: new Date(visitDate),
          time: visitTime,
          type: 'physical',
          status: 'scheduled'
        }
      }),

      // Rental Details
      ...(leaseDuration && {
        rental: {
          monthlyRent: property.rental.monthlyRent,
          securityDeposit: property.rental.securityDeposit,
          leaseDuration: parseInt(leaseDuration, 10),
          totalAmount: property.rental.monthlyRent * parseInt(leaseDuration, 10)
        }
      })
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate for response
    await booking.populate([
      { path: 'property', select: 'title location rental images' },
      { path: 'landlord', select: 'firstName lastName email phone' },
      { path: 'tenant', select: 'firstName lastName email phone' }
    ]);

    // Send notification emails
    try {
      // Email to landlord
      await sendEmail({
        to: property.owner.email,
        subject: `New ${bookingType} for your property: ${property.title}`,
        template: 'booking-notification-landlord',
        data: {
          landlordName: property.owner.firstName,
          propertyTitle: property.title,
          tenantName: name,
          tenantEmail: email,
          tenantPhone: phone,
          bookingType,
          message: message || specialRequests,
          moveInDate,
          visitDate: visitDate && visitTime ? `${visitDate} at ${visitTime}` : null
        }
      });

      // Email to tenant (confirmation)
      await sendEmail({
        to: email,
        subject: `Your ${bookingType} request has been submitted`,
        template: 'booking-confirmation-tenant',
        data: {
          tenantName: name,
          propertyTitle: property.title,
          landlordName: property.owner.firstName,
          bookingType,
          message: message || specialRequests
        }
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: `${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} request submitted successfully`,
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit booking request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { status, type } = req.query;
    const userId = req.user._id;

    const filters = {
      $or: [
        { tenant: userId },
        { landlord: userId }
      ]
    };

    if (status) filters.status = status;
    if (type) filters.type = type;

    const bookings = await Booking.find(filters)
      .populate('property', 'title location rental images')
      .populate('landlord', 'firstName lastName email phone profilePicture')
      .populate('tenant', 'firstName lastName email phone profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: { bookings }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get single booking
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id)
      .populate('property', 'title location rental images')
      .populate('landlord', 'firstName lastName email phone profilePicture')
      .populate('tenant', 'firstName lastName email phone profilePicture');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    if (!booking.tenant?.equals(userId) && !booking.landlord.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      message: 'Booking retrieved successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update booking status (landlord action)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(id)
      .populate('property')
      .populate('tenant', 'firstName lastName email')
      .populate('landlord', 'firstName lastName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only landlord can update status
    if (!booking.landlord.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only property owner can update booking status'
      });
    }

    // Valid status transitions
    const validStatuses = ['pending', 'approved', 'rejected', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status'
      });
    }

    // Update booking
    booking.status = status;
    if (message) {
      booking.communication.push({
        from: userId,
        to: booking.tenant._id,
        message,
        type: 'status-update'
      });
    }

    await booking.save();

    // Send notification email
    try {
      if (booking.tenant) {
        await sendEmail({
          to: booking.tenant.email,
          subject: `Booking ${status} - ${booking.property.title}`,
          template: 'booking-status-update',
          data: {
            tenantName: booking.tenant.firstName,
            propertyTitle: booking.property.title,
            status,
            message,
            landlordName: booking.landlord.firstName
          }
        });
      }
    } catch (emailError) {
      console.error('Status update email error:', emailError);
    }

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Cancel booking (tenant or landlord)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(id)
      .populate('property')
      .populate('tenant', 'firstName lastName email')
      .populate('landlord', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check access
    const isTenant = booking.tenant?.equals(userId);
    const isLandlord = booking.landlord.equals(userId);

    if (!isTenant && !isLandlord) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Can't cancel already completed bookings
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${booking.status} booking`
      });
    }

    // Update booking
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: userId,
      reason,
      cancelledAt: new Date()
    };

    if (reason) {
      booking.communication.push({
        from: userId,
        to: isTenant ? booking.landlord._id : booking.tenant._id,
        message: `Booking cancelled: ${reason}`,
        type: 'status-update'
      });
    }

    await booking.save();

    // Send notification
    try {
      const recipient = isTenant ? booking.landlord : booking.tenant;
      const cancelledBy = isTenant ? 'tenant' : 'landlord';

      await sendEmail({
        to: recipient.email,
        subject: `Booking Cancelled - ${booking.property.title}`,
        template: 'booking-cancelled',
        data: {
          recipientName: recipient.firstName,
          propertyTitle: booking.property.title,
          cancelledBy,
          reason
        }
      });
    } catch (emailError) {
      console.error('Cancellation email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
};
