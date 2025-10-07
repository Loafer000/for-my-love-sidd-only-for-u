// Chat Controller - Smart Transaction-Focused Chat System

const {
  Chat, ChatMessage, Property
} = require('../models');

// Create or get existing chat for a property inquiry
const createOrGetChat = async (req, res) => {
  try {
    const { propertyId, inquiryType = 'general' } = req.body;
    const tenantId = req.user._id;

    // Get property and landlord info
    const property = await Property.findById(propertyId).populate('owner');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const landlordId = property.owner._id;

    // Check if chat already exists between these users for this property
    let chat = await Chat.findOne({
      propertyId,
      participants: { $all: [tenantId, landlordId] }
    }).populate('participants', 'firstName lastName profilePhoto')
      .populate('propertyId', 'title location price images');

    if (!chat) {
      // Create new chat with structured conversation starter
      chat = new Chat({
        propertyId,
        participants: [tenantId, landlordId],
        chatType: inquiryType,
        status: 'active',
        businessContext: {
          inquiryType,
          propertyPrice: property.rental?.monthlyRent || property.price,
          createdFromBooking: false
        },
        platformGuidance: {
          stage: 'initial_inquiry',
          suggestedActions: [
            'schedule_visit',
            'ask_about_amenities',
            'negotiate_terms',
            'request_documents'
          ],
          completedActions: []
        }
      });

      await chat.save();
      await chat.populate('participants', 'firstName lastName profilePhoto');
      await chat.populate('propertyId', 'title location price images');

      // Send automated welcome message with platform guidance
      const welcomeMessage = new ChatMessage({
        chatId: chat._id,
        senderId: 'system',
        messageType: 'system_guidance',
        content: {
          text: `Welcome to ConnectSpace Chat! This conversation is about "${property.title}". Use the quick actions below to proceed with your inquiry.`,
          quickActions: [
            {
              type: 'schedule_visit',
              label: 'Schedule Visit',
              requiresPlatform: true
            },
            {
              type: 'ask_amenities',
              label: 'Ask about Amenities',
              requiresPlatform: false
            },
            {
              type: 'view_documents',
              label: 'View Property Documents',
              requiresPlatform: true
            },
            {
              type: 'start_application',
              label: 'Start Rental Application',
              requiresPlatform: true
            }
          ]
        }
      });

      await welcomeMessage.save();
      chat.lastMessage = welcomeMessage._id;
      chat.lastActivity = new Date();
      await chat.save();
    }

    res.json({
      success: true,
      message: 'Chat ready',
      data: { chat }
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Send message with business logic integration
const sendMessage = async (req, res) => {
  try {
    const {
      chatId, content, messageType = 'text', attachments = []
    } = req.body;
    const senderId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(senderId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat'
      });
    }

    // Business logic: Detect important keywords and guide to platform
    const messageAnalysis = analyzeMessageContent(content.text);

    const message = new ChatMessage({
      chatId,
      senderId,
      messageType,
      content,
      attachments,
      businessFlags: messageAnalysis.flags,
      readBy: [senderId],
      createdAt: new Date()
    });

    await message.save();

    // Update chat
    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    chat.messageCount += 1;

    // Smart platform guidance based on conversation content
    if (messageAnalysis.shouldGuideToPlatform) {
      await createGuidanceMessage(chatId, messageAnalysis.suggestedAction);
      chat.platformGuidance.stage = messageAnalysis.suggestedAction;
    }

    await chat.save();

    // Populate message for response
    await message.populate('senderId', 'firstName lastName profilePhoto');

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message,
        chatGuidance: messageAnalysis.shouldGuideToPlatform ? {
          suggestion: messageAnalysis.suggestedAction,
          message: messageAnalysis.guidanceMessage
        } : null
      }
    });

    // TODO: Send real-time notification to other participant
    // await sendRealTimeNotification(chat.participants, senderId, message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Analyze message content for business keywords
const analyzeMessageContent = (text) => {
  if (!text) return { flags: [], shouldGuideToPlatform: false };

  const lowerText = text.toLowerCase();
  const flags = [];
  let shouldGuideToPlatform = false;
  let suggestedAction = null;
  let guidanceMessage = '';

  // Price negotiation keywords
  if (lowerText.includes('price') || lowerText.includes('rent')
      || lowerText.includes('cost') || lowerText.includes('negotiat')
      || lowerText.includes('discount') || lowerText.includes('deal')) {
    flags.push('price_discussion');
    shouldGuideToPlatform = true;
    suggestedAction = 'price_negotiation';
    guidanceMessage = 'Price negotiations are best handled through our secure platform with proper documentation.';
  }

  // Visit scheduling keywords
  if (lowerText.includes('visit') || lowerText.includes('see')
      || lowerText.includes('tour') || lowerText.includes('meet')
      || lowerText.includes('appointment') || lowerText.includes('schedule')) {
    flags.push('visit_request');
    shouldGuideToPlatform = true;
    suggestedAction = 'schedule_visit';
    guidanceMessage = 'Schedule your visit through our platform to get confirmed time slots and directions.';
  }

  // Booking/commitment keywords
  if (lowerText.includes('book') || lowerText.includes('reserve')
      || lowerText.includes('apply') || lowerText.includes('lease')
      || lowerText.includes('agreement') || lowerText.includes('contract')) {
    flags.push('booking_intent');
    shouldGuideToPlatform = true;
    suggestedAction = 'start_application';
    guidanceMessage = 'Start your secure rental application through our platform with document verification.';
  }

  // Payment keywords
  if (lowerText.includes('deposit') || lowerText.includes('advance')
      || lowerText.includes('payment') || lowerText.includes('money')
      || lowerText.includes('cash') || lowerText.includes('transfer')) {
    flags.push('payment_discussion');
    shouldGuideToPlatform = true;
    suggestedAction = 'secure_payment';
    guidanceMessage = 'All payments should be processed through our secure payment gateway for protection.';
  }

  // Contact exchange (major red flag)
  if (lowerText.includes('whatsapp') || lowerText.includes('call me')
      || lowerText.includes('my number') || lowerText.includes('direct')
      || /\d{10}/.test(text) || lowerText.includes('outside')) {
    flags.push('contact_exchange_attempt');
    shouldGuideToPlatform = true;
    suggestedAction = 'platform_communication';
    guidanceMessage = 'For security and transparency, please continue all communications through our platform.';
  }

  return {
    flags,
    shouldGuideToPlatform,
    suggestedAction,
    guidanceMessage
  };
};

// Create automated guidance messages
const createGuidanceMessage = async (chatId, actionType) => {
  const guidanceContent = getGuidanceContent(actionType);

  const guidanceMessage = new ChatMessage({
    chatId,
    senderId: 'system',
    messageType: 'platform_guidance',
    content: {
      text: guidanceContent.message,
      quickActions: guidanceContent.actions,
      urgency: guidanceContent.urgency || 'normal'
    },
    businessFlags: ['platform_guidance'],
    readBy: []
  });

  await guidanceMessage.save();
  return guidanceMessage;
};

// Get chat messages with business context
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Verify user access to chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat'
      });
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const messages = await ChatMessage.find({ chatId })
      .populate('senderId', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Mark messages as read by current user
    await ChatMessage.updateMany(
      {
        chatId,
        senderId: { $ne: userId },
        readBy: { $ne: userId }
      },
      { $addToSet: { readBy: userId } }
    );

    res.json({
      success: true,
      message: 'Messages retrieved successfully',
      data: {
        messages: messages.reverse(), // Latest first after pagination
        chat: {
          id: chat._id,
          propertyId: chat.propertyId,
          businessContext: chat.businessContext,
          platformGuidance: chat.platformGuidance
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user's active chats
const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status = 'active', page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const chats = await Chat.find({
      participants: userId,
      status
    })
      .populate('participants', 'firstName lastName profilePhoto')
      .populate('propertyId', 'title location price images')
      .populate('lastMessage')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Get unread counts for each chat
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await ChatMessage.countDocuments({
          chatId: chat._id,
          senderId: { $ne: userId },
          readBy: { $ne: userId }
        });

        return {
          ...chat.toObject(),
          unreadCount,
          otherParticipant: chat.participants.find((p) => p._id.toString() !== userId.toString())
        };
      })
    );

    res.json({
      success: true,
      message: 'Chats retrieved successfully',
      data: { chats: chatsWithUnread }
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Handle quick actions from chat
const handleQuickAction = async (req, res) => {
  try {
    const { chatId, actionType, actionData = {} } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId).populate('propertyId');
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat'
      });
    }

    let result = {};

    switch (actionType) {
    case 'schedule_visit':
      // Redirect to visit scheduling page with pre-filled data
      result = {
        action: 'redirect',
        url: `/property/${chat.propertyId._id}?tab=visit&chat=${chatId}`,
        message: 'Redirecting to visit scheduling...'
      };
      break;

    case 'start_application':
      // Redirect to rental application
      result = {
        action: 'redirect',
        url: `/property/${chat.propertyId._id}?tab=booking&chat=${chatId}`,
        message: 'Starting rental application...'
      };
      break;

    case 'view_documents':
      // Show property documents
      result = {
        action: 'show_documents',
        documents: chat.propertyId.documents || [],
        message: 'Property documents loaded'
      };
      break;

    case 'price_negotiation':
      // Open price negotiation tool
      result = {
        action: 'open_negotiation',
        currentPrice: chat.businessContext.propertyPrice,
        message: 'Opening price negotiation tool...'
      };
      break;

    default:
      result = {
        action: 'message',
        message: 'Action not recognized'
      };
    }

    // Update chat guidance
    if (!chat.platformGuidance.completedActions.includes(actionType)) {
      chat.platformGuidance.completedActions.push(actionType);
      await chat.save();
    }

    res.json({
      success: true,
      message: 'Action processed successfully',
      data: result
    });
  } catch (error) {
    console.error('Handle quick action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process action',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function for guidance content
const getGuidanceContent = (actionType) => {
  const guidance = {
    price_negotiation: {
      message: '💰 Price discussions detected! Use our secure negotiation tool for transparent pricing with proper documentation.',
      actions: [
        { type: 'open_negotiation', label: 'Start Price Negotiation', requiresPlatform: true },
        { type: 'view_pricing_history', label: 'View Market Rates', requiresPlatform: true }
      ],
      urgency: 'high'
    },
    schedule_visit: {
      message: '📅 Ready to visit? Schedule through our platform for confirmed slots and safety verification.',
      actions: [
        { type: 'schedule_visit', label: 'Schedule Visit', requiresPlatform: true },
        { type: 'virtual_tour', label: 'Take Virtual Tour', requiresPlatform: false }
      ]
    },
    start_application: {
      message: '📋 Ready to apply? Our secure application process includes document verification and payment protection.',
      actions: [
        { type: 'start_application', label: 'Start Application', requiresPlatform: true },
        { type: 'view_requirements', label: 'View Requirements', requiresPlatform: false }
      ]
    },
    secure_payment: {
      message: '💳 Payment discussions require our secure gateway for fraud protection and legal compliance.',
      actions: [
        { type: 'secure_payment', label: 'Setup Secure Payment', requiresPlatform: true },
        { type: 'payment_protection', label: 'Learn About Protection', requiresPlatform: false }
      ],
      urgency: 'high'
    },
    platform_communication: {
      message: '🔒 For your security and transparency, all communications should remain on our platform.',
      actions: [
        { type: 'security_info', label: 'Why Platform Communication?', requiresPlatform: false },
        { type: 'report_issue', label: 'Report Issue', requiresPlatform: true }
      ],
      urgency: 'critical'
    }
  };

  return guidance[actionType] || {
    message: 'Need help? Use our platform features for secure transactions.',
    actions: []
  };
};

module.exports = {
  createOrGetChat,
  sendMessage,
  getChatMessages,
  getUserChats,
  handleQuickAction
};
