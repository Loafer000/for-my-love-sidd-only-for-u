// Chat Routes - Smart Transaction-Focused Chat System

const express = require('express');
const router = express.Router();
const { 
  createOrGetChat, 
  sendMessage, 
  getChatMessages, 
  getUserChats,
  handleQuickAction
} = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Create or get existing chat for a property
router.post('/create', 
  authenticate,
  [
    body('propertyId')
      .notEmpty()
      .withMessage('Property ID is required')
      .isMongoId()
      .withMessage('Invalid property ID'),
    body('inquiryType')
      .optional()
      .isIn(['general', 'booking_inquiry', 'visit_request', 'price_negotiation'])
      .withMessage('Invalid inquiry type')
  ],
  handleValidationErrors,
  createOrGetChat
);

// Send message in a chat
router.post('/message',
  authenticate,
  [
    body('chatId')
      .notEmpty()
      .withMessage('Chat ID is required')
      .isMongoId()
      .withMessage('Invalid chat ID'),
    body('content.text')
      .notEmpty()
      .withMessage('Message content is required')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters'),
    body('messageType')
      .optional()
      .isIn(['text', 'image', 'document'])
      .withMessage('Invalid message type'),
    body('attachments')
      .optional()
      .isArray()
      .withMessage('Attachments must be an array'),
    body('attachments.*.type')
      .optional()
      .isIn(['image', 'document', 'video'])
      .withMessage('Invalid attachment type'),
    body('attachments.*.url')
      .optional()
      .isURL()
      .withMessage('Invalid attachment URL')
  ],
  handleValidationErrors,
  sendMessage
);

// Get messages for a specific chat
router.get('/:chatId/messages',
  authenticate,
  [
    param('chatId')
      .isMongoId()
      .withMessage('Invalid chat ID'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],
  handleValidationErrors,
  getChatMessages
);

// Get all chats for current user
router.get('/my-chats',
  authenticate,
  [
    query('status')
      .optional()
      .isIn(['active', 'archived', 'blocked', 'completed'])
      .withMessage('Invalid status'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  handleValidationErrors,
  getUserChats
);

// Handle quick actions from chat interface
router.post('/action',
  authenticate,
  [
    body('chatId')
      .notEmpty()
      .withMessage('Chat ID is required')
      .isMongoId()
      .withMessage('Invalid chat ID'),
    body('actionType')
      .notEmpty()
      .withMessage('Action type is required')
      .isIn([
        'schedule_visit',
        'start_application', 
        'view_documents',
        'price_negotiation',
        'secure_payment',
        'report_issue'
      ])
      .withMessage('Invalid action type'),
    body('actionData')
      .optional()
      .isObject()
      .withMessage('Action data must be an object')
  ],
  handleValidationErrors,
  handleQuickAction
);

// TEST ROUTE - Remove in production
router.get('/test', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Chat API is working! 💬',
    user: req.user.firstName,
    features: [
      '🔍 Smart keyword detection',
      '🚦 Platform guidance system', 
      '⚡ Quick action buttons',
      '📊 Business intelligence tracking',
      '🛡️ Bypass attempt monitoring',
      '💰 Integrated payment/booking flows'
    ],
    description: 'This chat system guides users to platform features while monitoring bypass attempts.'
  });
});

// DEPRECATED: Mock routes for development only - use real chat endpoints  
// These will be removed when real-time chat is implemented

// DEPRECATED: Get mock chat list
router.get('/mock/list', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Mock chat list',
    data: {
      chats: [
        {
          _id: '674f1a2b3c4d5e6f7a8b9c01',
          propertyId: {
            _id: '674f1a2b3c4d5e6f7a8b9c02',
            title: 'Cozy 2BHK Apartment in Bandra',
            location: 'Bandra West, Mumbai',
            price: 35000,
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2']
          },
          otherParticipant: {
            _id: '674f1a2b3c4d5e6f7a8b9c03',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
          },
          lastMessage: {
            content: { text: 'What about the parking facility?' },
            createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
          },
          unreadCount: 2,
          businessContext: {
            inquiryType: 'general',
            propertyPrice: 35000
          },
          platformGuidance: {
            stage: 'initial_inquiry',
            guidanceScore: 25
          }
        },
        {
          _id: '674f1a2b3c4d5e6f7a8b9c04',
          propertyId: {
            _id: '674f1a2b3c4d5e6f7a8b9c05',
            title: '3BHK Villa with Garden',
            location: 'Koramangala, Bangalore',
            price: 45000,
            images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227']
          },
          otherParticipant: {
            _id: '674f1a2b3c4d5e6f7a8b9c06',
            firstName: 'Priya',
            lastName: 'Sharma',
            profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786'
          },
          lastMessage: {
            content: { 
              text: 'The rent seems high. Can we negotiate?',
            },
            businessFlags: ['price_discussion'],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
          },
          unreadCount: 0,
          businessContext: {
            inquiryType: 'price_negotiation',
            propertyPrice: 45000,
            negotiationStatus: 'initiated'
          },
          platformGuidance: {
            stage: 'price_negotiation',
            guidanceScore: 75,
            riskFlags: [
              {
                type: 'price_discussion',
                severity: 'medium'
              }
            ]
          }
        }
      ]
    }
  });
});

// Get mock messages for a chat
router.get('/mock/:chatId/messages', authenticate, (req, res) => {
  const { chatId } = req.params;
  
  const mockMessages = [
    {
      _id: '674f1a2b3c4d5e6f7a8b9c07',
      senderId: {
        _id: '674f1a2b3c4d5e6f7a8b9c03',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      },
      messageType: 'text',
      content: {
        text: 'Hi! I\'m interested in your 2BHK apartment. Can I know more about it?'
      },
      businessFlags: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      readBy: [req.user._id]
    },
    {
      _id: '674f1a2b3c4d5e6f7a8b9c08',
      senderId: 'system',
      messageType: 'system_guidance',
      content: {
        text: 'Welcome to ConnectSpace Chat! This conversation is about "Cozy 2BHK Apartment in Bandra". Use the quick actions below to proceed with your inquiry.',
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
            type: 'start_application', 
            label: 'Start Rental Application', 
            requiresPlatform: true 
          }
        ]
      },
      businessFlags: ['platform_guidance'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60), // 1 day ago + 1 min
      readBy: [req.user._id]
    },
    {
      _id: '674f1a2b3c4d5e6f7a8b9c09',
      senderId: req.user._id,
      messageType: 'text',
      content: {
        text: 'Hello! Sure, it\'s a well-maintained apartment with all modern amenities. What specific details would you like to know?'
      },
      businessFlags: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      readBy: [req.user._id, '674f1a2b3c4d5e6f7a8b9c03']
    },
    {
      _id: '674f1a2b3c4d5e6f7a8b9c10',
      senderId: '674f1a2b3c4d5e6f7a8b9c03',
      messageType: 'text',
      content: {
        text: 'The rent seems reasonable. Can I schedule a visit to see the place? Also, is parking included?'
      },
      businessFlags: ['visit_request'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      readBy: ['674f1a2b3c4d5e6f7a8b9c03']
    },
    {
      _id: '674f1a2b3c4d5e6f7a8b9c11',
      senderId: 'system',
      messageType: 'platform_guidance',
      content: {
        text: '📅 Ready to visit? Schedule through our platform for confirmed slots and safety verification.',
        quickActions: [
          { type: 'schedule_visit', label: 'Schedule Visit', requiresPlatform: true },
          { type: 'virtual_tour', label: 'Take Virtual Tour', requiresPlatform: false }
        ],
        urgency: 'normal'
      },
      businessFlags: ['platform_guidance'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30), // 2 hours ago + 30 sec
      readBy: []
    },
    {
      _id: '674f1a2b3c4d5e6f7a8b9c12',
      senderId: '674f1a2b3c4d5e6f7a8b9c03',
      messageType: 'text',
      content: {
        text: 'What about the parking facility?'
      },
      businessFlags: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      readBy: ['674f1a2b3c4d5e6f7a8b9c03']
    }
  ];

  res.json({
    success: true,
    message: 'Mock messages retrieved',
    data: {
      messages: mockMessages,
      chat: {
        id: chatId,
        propertyId: '674f1a2b3c4d5e6f7a8b9c02',
        businessContext: {
          inquiryType: 'general',
          propertyPrice: 35000
        },
        platformGuidance: {
          stage: 'initial_inquiry',
          suggestedActions: ['schedule_visit', 'ask_amenities', 'start_application'],
          completedActions: [],
          guidanceScore: 25
        }
      }
    }
  });
});

module.exports = router;