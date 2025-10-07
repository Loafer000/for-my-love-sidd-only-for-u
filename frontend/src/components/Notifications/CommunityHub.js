import React, { useState, useEffect } from 'react';
import './CommunityHub.css';

const CommunityHub = ({ userId, propertyId }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [residents, setResidents] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockPosts = [
    {
      id: 'post_1',
      author: {
        id: 'user_1',
        name: 'Sarah Johnson',
        avatar: '👩‍💼',
        unit: 'Apt 5B',
        joinDate: new Date('2023-03-15')
      },
      content: 'Just wanted to say thank you to whoever organized the community garden cleanup last weekend! The courtyard looks amazing now 🌿',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      likes: 12,
      comments: [
        {
          id: 'comment_1',
          author: { name: 'Mike Chen', avatar: '👨‍💻', unit: 'Apt 3A' },
          content: 'It was a team effort! Thanks to everyone who helped out.',
          timestamp: new Date(Date.now() - 1000 * 60 * 15)
        },
        {
          id: 'comment_2',
          author: { name: 'Lisa Rodriguez', avatar: '👩‍🎨', unit: 'Apt 7C' },
          content: 'The flowers we planted are already blooming! 🌺',
          timestamp: new Date(Date.now() - 1000 * 60 * 10)
        }
      ],
      tags: ['community', 'garden'],
      images: [],
      liked: false,
      type: 'post'
    },
    {
      id: 'post_2',
      author: {
        id: 'user_2',
        name: 'David Kim',
        avatar: '👨‍🍳',
        unit: 'Apt 12A',
        joinDate: new Date('2022-11-08')
      },
      content: 'Anyone know a good plumber? My kitchen sink has been acting up for a few days. Already submitted a maintenance request but wanted to see if anyone had recommendations for future reference.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      likes: 5,
      comments: [
        {
          id: 'comment_3',
          author: { name: 'Jennifer Walsh', avatar: '👩‍🔧', unit: 'Apt 9B' },
          content: 'I used Mike\'s Plumbing last month - great service and fair prices! Here\'s their number: (555) 123-4567',
          timestamp: new Date(Date.now() - 1000 * 60 * 60)
        }
      ],
      tags: ['maintenance', 'recommendations'],
      images: [],
      liked: true,
      type: 'question'
    },
    {
      id: 'post_3',
      author: {
        id: 'admin_1',
        name: 'Property Management',
        avatar: '🏢',
        unit: 'Management Office',
        joinDate: new Date('2022-01-01'),
        isAdmin: true
      },
      content: 'Reminder: The elevator in Building A will be under maintenance this Saturday from 8 AM to 2 PM. Please plan accordingly and use the stairs during this time.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      likes: 8,
      comments: [],
      tags: ['announcement', 'maintenance'],
      images: [],
      liked: false,
      type: 'announcement',
      priority: 'high'
    }
  ];

  const mockEvents = [
    {
      id: 'event_1',
      title: 'Community BBQ & Pool Party',
      description: 'Join us for a fun-filled afternoon by the pool! We\'ll provide burgers, hot dogs, and drinks. Bring your family and friends!',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      time: '2:00 PM - 6:00 PM',
      location: 'Pool Deck & BBQ Area',
      organizer: {
        name: 'Community Committee',
        avatar: '👥'
      },
      attendees: 24,
      maxAttendees: 50,
      rsvpDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      category: 'social',
      image: '🍔',
      isAttending: false
    },
    {
      id: 'event_2',
      title: 'Yoga in the Garden',
      description: 'Morning yoga session in our beautiful community garden. All skill levels welcome! Bring your own mat.',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
      time: '7:00 AM - 8:00 AM',
      location: 'Community Garden',
      organizer: {
        name: 'Sarah Johnson',
        avatar: '👩‍💼'
      },
      attendees: 8,
      maxAttendees: 15,
      rsvpDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      category: 'fitness',
      image: '🧘‍♀️',
      isAttending: true,
      recurring: 'weekly'
    },
    {
      id: 'event_3',
      title: 'Movie Night Under the Stars',
      description: 'Outdoor movie screening of "The Princess Bride" on the rooftop terrace. Popcorn and snacks provided!',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
      time: '8:00 PM - 10:30 PM',
      location: 'Rooftop Terrace',
      organizer: {
        name: 'Entertainment Committee',
        avatar: '🎬'
      },
      attendees: 18,
      maxAttendees: 30,
      rsvpDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
      category: 'entertainment',
      image: '🍿',
      isAttending: false
    }
  ];

  const mockDiscussions = [
    {
      id: 'discussion_1',
      title: 'Proposal: Pet-Friendly Policies',
      author: { name: 'Emma Thompson', avatar: '👩‍⚕️', unit: 'Apt 8D' },
      content: 'I\'d like to propose some pet-friendly initiatives for our building...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      replies: 15,
      category: 'policy',
      votes: { up: 23, down: 4 },
      status: 'active',
      tags: ['pets', 'policy', 'community']
    },
    {
      id: 'discussion_2',
      title: 'Parking Space Assignment System',
      author: { name: 'Robert Chen', avatar: '👨‍💼', unit: 'Apt 4F' },
      content: 'Can we discuss implementing a better parking assignment system?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      replies: 28,
      category: 'facilities',
      votes: { up: 31, down: 7 },
      status: 'under_review',
      tags: ['parking', 'facilities', 'management']
    }
  ];

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setEvents(mockEvents);
      setDiscussions(mockDiscussions);
    } catch (error) {
      console.error('Failed to load community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: `post_${Date.now()}`,
      author: {
        id: userId,
        name: 'You',
        avatar: '👤',
        unit: 'Your Unit',
        joinDate: new Date()
      },
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      tags: [],
      images: [],
      liked: false,
      type: 'post'
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
  };

  const handleLikePost = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleRSVPEvent = (eventId) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? {
            ...event,
            isAttending: !event.isAttending,
            attendees: event.isAttending 
              ? event.attendees - 1 
              : event.attendees + 1
          }
        : event
    ));
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const formatEventDate = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (eventDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'question': return '❓';
      case 'event': return '🎉';
      default: return '💬';
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'announcement': return '#ef4444';
      case 'question': return '#f59e0b';
      case 'event': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="community-hub">
      {/* Header */}
      <div className="community-header">
        <div className="header-content">
          <h1>Community Hub</h1>
          <p>Connect with your neighbors and stay informed about community events</p>
        </div>
        
        <div className="community-stats">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <div className="stat-details">
              <span className="stat-number">142</span>
              <span className="stat-label">Active Members</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">📝</span>
            <div className="stat-details">
              <span className="stat-number">28</span>
              <span className="stat-label">Posts This Week</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">🎉</span>
            <div className="stat-details">
              <span className="stat-number">5</span>
              <span className="stat-label">Upcoming Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="community-nav">
        <div className="nav-container">
          <div className="nav-tabs">
            {[
              { id: 'feed', label: 'Community Feed', icon: '📰' },
              { id: 'events', label: 'Events', icon: '🎉' },
              { id: 'discussions', label: 'Discussions', icon: '💬' },
              { id: 'directory', label: 'Resident Directory', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="community-content">
        {/* Community Feed */}
        {activeTab === 'feed' && (
          <div className="community-feed">
            {/* Create Post */}
            <div className="create-post">
              <div className="post-creator">
                <div className="creator-avatar">👤</div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share something with your community..."
                  className="post-input"
                />
              </div>
              
              <div className="post-actions">
                <div className="post-options">
                  <button className="option-btn">📷 Photo</button>
                  <button className="option-btn">📋 Poll</button>
                  <button className="option-btn">🎉 Event</button>
                </div>
                
                <button 
                  className="post-btn"
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
              {posts.map(post => (
                <div key={post.id} className={`post-card ${post.type}`}>
                  <div className="post-header">
                    <div className="author-info">
                      <div className="author-avatar">{post.author.avatar}</div>
                      <div className="author-details">
                        <div className="author-name">
                          {post.author.name}
                          {post.author.isAdmin && <span className="admin-badge">Admin</span>}
                        </div>
                        <div className="post-meta">
                          {post.author.unit} • {formatTimestamp(post.timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="post-type">
                      <span 
                        className="type-badge"
                        style={{ color: getPostTypeColor(post.type) }}
                      >
                        {getPostTypeIcon(post.type)} {post.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="post-content">
                    {post.content}
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="post-footer">
                    <div className="post-stats">
                      <button 
                        className={`stat-btn ${post.liked ? 'liked' : ''}`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <span className="stat-icon">👍</span>
                        <span className="stat-count">{post.likes}</span>
                      </button>
                      
                      <button className="stat-btn">
                        <span className="stat-icon">💬</span>
                        <span className="stat-count">{post.comments.length}</span>
                      </button>
                      
                      <button className="stat-btn">
                        <span className="stat-icon">📤</span>
                        <span className="stat-label">Share</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="post-comments">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="comment">
                          <div className="comment-avatar">{comment.author.avatar}</div>
                          <div className="comment-content">
                            <div className="comment-author">
                              {comment.author.name} <span className="comment-unit">{comment.author.unit}</span>
                            </div>
                            <div className="comment-text">{comment.content}</div>
                            <div className="comment-time">{formatTimestamp(comment.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="events-section">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <button 
                className="create-event-btn"
                onClick={() => setShowCreateEvent(true)}
              >
                + Create Event
              </button>
            </div>
            
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <span className="event-emoji">{event.image}</span>
                    <div className="event-date">
                      <span className="date-day">{formatEventDate(event.date)}</span>
                      <span className="date-time">{event.time}</span>
                    </div>
                  </div>
                  
                  <div className="event-content">
                    <div className="event-header">
                      <h3 className="event-title">{event.title}</h3>
                      <span className={`event-category ${event.category}`}>
                        {event.category}
                      </span>
                    </div>
                    
                    <p className="event-description">{event.description}</p>
                    
                    <div className="event-details">
                      <div className="event-location">
                        📍 {event.location}
                      </div>
                      
                      <div className="event-organizer">
                        {event.organizer.avatar} Organized by {event.organizer.name}
                      </div>
                      
                      <div className="event-attendance">
                        👥 {event.attendees} / {event.maxAttendees} attending
                      </div>
                    </div>
                    
                    <div className="event-actions">
                      <button 
                        className={`rsvp-btn ${event.isAttending ? 'attending' : ''}`}
                        onClick={() => handleRSVPEvent(event.id)}
                      >
                        {event.isAttending ? '✓ Attending' : 'RSVP'}
                      </button>
                      
                      <button className="event-share-btn">
                        📤 Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discussions */}
        {activeTab === 'discussions' && (
          <div className="discussions-section">
            <div className="section-header">
              <h2>Community Discussions</h2>
              <button className="start-discussion-btn">
                + Start Discussion
              </button>
            </div>
            
            <div className="discussions-list">
              {discussions.map(discussion => (
                <div key={discussion.id} className="discussion-card">
                  <div className="discussion-votes">
                    <button className="vote-btn up">▲</button>
                    <span className="vote-count">{discussion.votes.up - discussion.votes.down}</span>
                    <button className="vote-btn down">▼</button>
                  </div>
                  
                  <div className="discussion-content">
                    <div className="discussion-header">
                      <h3 className="discussion-title">{discussion.title}</h3>
                      <span className={`discussion-status ${discussion.status}`}>
                        {discussion.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="discussion-meta">
                      <span className="discussion-author">
                        {discussion.author.avatar} {discussion.author.name} ({discussion.author.unit})
                      </span>
                      <span className="discussion-time">
                        {formatTimestamp(discussion.timestamp)}
                      </span>
                    </div>
                    
                    <div className="discussion-preview">
                      {discussion.content}
                    </div>
                    
                    <div className="discussion-tags">
                      {discussion.tags.map(tag => (
                        <span key={tag} className="discussion-tag">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="discussion-stats">
                      <span className="replies-count">💬 {discussion.replies} replies</span>
                      <span className="category-badge">{discussion.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resident Directory */}
        {activeTab === 'directory' && (
          <div className="directory-section">
            <div className="section-header">
              <h2>Resident Directory</h2>
              <div className="directory-search">
                <input 
                  type="text" 
                  placeholder="Search residents..."
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
            
            <div className="directory-grid">
              <div className="resident-card">
                <div className="resident-avatar">👩‍💼</div>
                <div className="resident-info">
                  <h4>Sarah Johnson</h4>
                  <p>Apt 5B • Joined March 2023</p>
                  <div className="resident-tags">
                    <span className="tag">Community Organizer</span>
                    <span className="tag">Yoga Instructor</span>
                  </div>
                </div>
              </div>
              
              <div className="resident-card">
                <div className="resident-avatar">👨‍💻</div>
                <div className="resident-info">
                  <h4>Mike Chen</h4>
                  <p>Apt 3A • Joined January 2023</p>
                  <div className="resident-tags">
                    <span className="tag">Tech Support</span>
                    <span className="tag">Gaming Club</span>
                  </div>
                </div>
              </div>
              
              <div className="resident-card">
                <div className="resident-avatar">👩‍🎨</div>
                <div className="resident-info">
                  <h4>Lisa Rodriguez</h4>
                  <p>Apt 7C • Joined February 2023</p>
                  <div className="resident-tags">
                    <span className="tag">Art Classes</span>
                    <span className="tag">Garden Committee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityHub;