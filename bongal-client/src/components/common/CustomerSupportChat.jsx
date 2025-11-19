import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Minimize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CustomerSupportChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [formData, setFormData] = useState({
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const prevMessagesLengthRef = useRef(0);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Track if user is manually scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    // If user scrolls up, mark as manually scrolling
    isUserScrollingRef.current = !isAtBottom;
  };

  // Smart scroll - only scroll when new messages arrive or user is at bottom
  useEffect(() => {
    const hasNewMessages = messages.length > prevMessagesLengthRef.current;
    
    if (hasNewMessages || !isUserScrollingRef.current) {
      // Instant scroll for initial load or when at bottom
      const behavior = prevMessagesLengthRef.current === 0 ? 'instant' : 'smooth';
      scrollToBottom(behavior);
    }
    
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Fetch user's message history when chat opens and user is logged in
  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();

      // Start polling for new messages every 2 seconds
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages();
      }, 2000);
    } else {
      // Clear polling when chat is closed
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isOpen, user]);

  const fetchMessages = async () => {
    if (fetchingMessages) {
      return;
    }

    setFetchingMessages(true);

    try {
      const response = await messageService.getMyMessages();
      const messageHistory = response.data || [];

      // Convert messages to chat format
      const formattedMessages = messageHistory.map(msg => ({
        text: msg.message,
        sender: msg.isFromAdmin ? 'admin' : 'user',
        adminName: msg.sentBy?.name || 'Support Team',
        time: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: msg.status
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setFetchingMessages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to send a message');
      navigate('/login');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);

    try {
      const response = await messageService.sendMessage(formData);

      // Add message to local state for immediate feedback
      const newMessage = {
        text: formData.message,
        sender: 'user',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: 'unread'
      };

      setMessages(prev => [...prev, newMessage]);

      // Reset form
      setFormData({
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary-800 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-110 group"
          aria-label="Open customer support chat"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            !
          </span>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Need help? Chat with us!
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } flex flex-col overflow-hidden border-2 border-primary-100`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-800 to-primary-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="text-primary-800" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs text-primary-100">We typically reply within minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {fetchingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-primary-800 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="text-white" size={16} />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                          <p className="text-sm text-gray-800">
                            Hi there! 👋 How can we help you today?
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Bongal Support</p>
                        </div>
                      </div>
                    )}

                    {/* User Messages */}
                    {messages.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No messages yet. Start a conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const showDate = index === 0 || msg.date !== messages[index - 1]?.date;
                        return (
                          <div key={index}>
                            {/* Date Separator */}
                            {showDate && msg.date && (
                              <div className="flex items-center justify-center my-4">
                                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                  {msg.date}
                                </div>
                              </div>
                            )}

                            {/* Message */}
                            <div className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                              {msg.sender === 'admin' && (
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <MessageCircle className="text-white" size={16} />
                                </div>
                              )}
                              <div
                                className={`p-3 rounded-2xl shadow-sm max-w-[80%] ${msg.sender === 'user'
                                  ? 'bg-primary-800 text-white rounded-tr-none'
                                  : msg.sender === 'admin'
                                    ? 'bg-green-50 text-gray-800 rounded-tl-none border border-green-200'
                                    : 'bg-white text-gray-800 rounded-tl-none'
                                  }`}
                              >
                                {msg.sender === 'admin' && (
                                  <p className="text-xs font-semibold mb-1 text-green-700">
                                    {msg.adminName}
                                  </p>
                                )}
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className={`text-xs ${msg.sender === 'user'
                                    ? 'text-primary-200'
                                    : msg.sender === 'admin'
                                      ? 'text-green-600'
                                      : 'text-gray-500'
                                    }`}>
                                    {msg.time}
                                  </p>
                                  {msg.status && msg.sender === 'user' && (
                                    <span className={`text-xs ${msg.status === 'read'
                                      ? 'text-blue-400'
                                      : 'text-gray-400'
                                      }`}>
                                      {msg.status === 'read' ? '✓✓' : '○'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {msg.sender === 'user' && (
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="text-white" size={16} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Sign in to chat with our support team
                    </p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/login');
                      }}
                      className="w-full bg-primary-800 text-white py-2 rounded-2xl font-medium hover:bg-primary-700 transition-all"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex items-end space-x-2">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your message..."
                        rows={2}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={loading || !formData.message.trim()}
                        className="bg-primary-800 text-white p-3 rounded-xl hover:bg-primary-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CustomerSupportChat;
