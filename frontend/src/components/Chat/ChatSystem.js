import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ChatSystem.css';

const ChatSystem = ({ propertyId, landlordId, tenantId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      sender: user.name,
      senderId: user.id,
      message: newMessage,
      timestamp: new Date().toISOString(),
      propertyId,
      type: 'text'
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');

    // TODO: Send to backend via WebSocket
    try {
      // await sendMessageToServer(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-system">
      <div className="chat-header">
        <div className="chat-info">
          <h3>Property Chat</h3>
          <div className="online-indicator">
            <span className="online-dot"></span>
            <span>{onlineUsers.length} online</span>
          </div>
        </div>
        <div className="chat-actions">
          <button className="btn-minimize">−</button>
          <button className="btn-close">×</button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-icon">💬</div>
            <p>Start a conversation about this property</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.senderId === user.id ? 'own-message' : 'other-message'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{msg.sender}</span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-text">{msg.message}</div>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Someone is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <div className="input-group">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
            rows="1"
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="send-button"
          >
            <span>📤</span>
          </button>
        </div>
        <div className="input-actions">
          <button className="attach-button" title="Attach File">📎</button>
          <button className="emoji-button" title="Add Emoji">😊</button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;