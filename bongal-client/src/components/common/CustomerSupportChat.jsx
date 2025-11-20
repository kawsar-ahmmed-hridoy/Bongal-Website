import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const COLORS = {
  primaryDark: '#011D4D',
  primary: '#034078',
  accent: '#1282A2',
  light: '#E4DFDA',
  brown: '#63372C'
};

const CustomerSupportChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const scrollToBottom = (behavior = 'auto') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    }, 0);
  };

  useEffect(() => {
    if (isInitialLoad && messages.length > 0) {
      scrollToBottom('auto');
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (isOpen && user) {
      setIsInitialLoad(true);
      fetchMessages();

      pollingIntervalRef.current = setInterval(() => {
        fetchMessages();
      }, 5000);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isOpen, user]);

  const fetchMessages = async () => {
    try {
      const response = await messageService.getMyMessages();
      const messageHistory = response.data || [];

      if (messageHistory.length !== lastMessageCountRef.current) {
        const formattedMessages = messageHistory.map(msg => ({
          text: msg.message,
          sender: msg.isFromAdmin ? 'admin' : 'user',
          adminName: msg.sentBy?.name || 'Support Team',
          time: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: msg.status
        }));

        setMessages(formattedMessages);
        lastMessageCountRef.current = messageHistory.length;
      }
    } catch (error) {
      console.log(error);
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
      await messageService.sendMessage(formData);
      

      const newMessage = {
        text: formData.message,
        sender: 'user',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: 'unread'
      };

      setMessages(prev => [...prev, newMessage]);

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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 group animate-bounce-subtle"
          style={{ 
            backgroundColor: COLORS.primary,
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`
          }}
          aria-label="Open customer support chat"
        >
          <MessageCircle size={28} className="text-white animate-pulse-slow" />
          <span 
            className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-ping"
            style={{ backgroundColor: COLORS.brown }}
          >
            !
          </span>

          <div 
            className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-lg"
            style={{ 
              backgroundColor: COLORS.primaryDark,
              color: COLORS.light
            }}
          >
            Need help? Chat with us!
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-3xl shadow-2xl transition-all duration-500 w-96 h-[600px] flex flex-col overflow-hidden border-2 ${
            isVisible 
              ? 'opacity-100 transform translate-y-0 scale-100' 
              : 'opacity-0 transform translate-y-10 scale-95'
          }`}
          style={{ 
            backgroundColor: COLORS.light,
            borderColor: COLORS.primary
          }}
        >
          <div 
            className="text-white p-4 flex items-center justify-between shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 50%, ${COLORS.accent} 100%)`
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse-slow"
                style={{ backgroundColor: COLORS.light }}
              >
                <MessageCircle 
                  className="animate-bounce-subtle" 
                  style={{ color: COLORS.primaryDark }}
                  size={20} 
                />
              </div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs opacity-90">We typically reply within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-opacity-20 hover:bg-white rounded-lg transition-all duration-300 transform hover:rotate-90"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50"
          >
            {messages.length === 0 && (
              <div className="flex items-start space-x-2 animate-fade-in">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <MessageCircle className="text-white" size={16} />
                </div>
                <div 
                  className="p-3 rounded-2xl rounded-tl-none shadow-lg max-w-[80%] transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: 'white',
                    borderLeft: `4px solid ${COLORS.accent}`
                  }}
                >
                  <p className="text-sm text-gray-800">
                    Hi there! 👋 How can we help you today?
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLORS.accent }}>
                    Bongal Support
                  </p>
                </div>
              </div>
            )}

            {messages.length > 0 && (
              messages.map((msg, index) => {
                const showDate = index === 0 || msg.date !== messages[index - 1]?.date;
                return (
                  <div 
                    key={`${msg.sender}-${index}`}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {showDate && msg.date && (
                      <div className="flex items-center justify-center my-4">
                        <div 
                          className="text-xs px-3 py-1 rounded-full shadow-sm"
                          style={{ 
                            backgroundColor: COLORS.light,
                            color: COLORS.primaryDark
                          }}
                        >
                          {msg.date}
                        </div>
                      </div>
                    )}

                    <div className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                      {msg.sender === 'admin' && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-bounce-subtle"
                          style={{ backgroundColor: COLORS.accent }}
                        >
                          <MessageCircle className="text-white" size={16} />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl shadow-lg max-w-[80%] transform transition-all duration-300 hover:scale-105 ${
                          msg.sender === 'user'
                            ? 'rounded-tr-none'
                            : 'rounded-tl-none'
                        }`}
                        style={{
                          backgroundColor: msg.sender === 'user' 
                            ? COLORS.primary 
                            : 'white',
                          color: msg.sender === 'user' ? 'white' : COLORS.primaryDark,
                          borderLeft: msg.sender === 'admin' ? `4px solid ${COLORS.accent}` : 'none',
                          borderRight: msg.sender === 'user' ? `4px solid ${COLORS.primaryDark}` : 'none'
                        }}
                      >
                        {msg.sender === 'admin' && (
                          <p 
                            className="text-xs font-semibold mb-1"
                            style={{ color: COLORS.accent }}
                          >
                            বঙ্গাল
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p 
                            className={`text-xs ${
                              msg.sender === 'user' ? 'opacity-80' : 'opacity-60'
                            }`}
                          >
                            {msg.time}
                          </p>
                          {msg.status && msg.sender === 'user' && (
                            <span 
                              className={`text-xs ${
                                msg.status === 'read' ? 'opacity-100' : 'opacity-50'
                              }`}
                            >
                              {msg.status === 'read' ? '✓' : '○'}
                            </span>
                          )}
                        </div>
                      </div>
                      {msg.sender === 'user' && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                          style={{ backgroundColor: COLORS.primaryDark }}
                        >
                          <User className="text-white" size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          <div 
            className="p-4 border-t shadow-inner"
            style={{ 
              backgroundColor: 'white',
              borderColor: COLORS.light
            }}
          >
            {!user ? (
              <div className="text-center py-4">
                <p className="text-sm mb-3" style={{ color: COLORS.primaryDark }}>
                  Sign in to chat with our support team
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                    color: 'white'
                  }}
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
                    className="flex-1 px-3 py-2 text-sm border rounded-xl resize-none transition-all duration-300 focus:shadow-lg focus:scale-105"
                    style={{ 
                      borderColor: COLORS.light,
                      backgroundColor: 'white',
                      color: COLORS.primaryDark
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.accent;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.light;
                    }}
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
                    className="p-3 rounded-xl transition-all duration-300 transform hover:scale-110 disabled:scale-100 disabled:opacity-50 shadow-lg"
                    style={{
                      backgroundColor: loading || !formData.message.trim() ? COLORS.light : COLORS.primary,
                      color: 'white'
                    }}
                  >
                    {loading ? (
                      <div 
                        className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'white' }}
                      />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>

                <p 
                  className="text-xs text-center opacity-60"
                  style={{ color: COLORS.primaryDark }}
                >
                  Press Enter to send, Shift+Enter for new line
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceSubtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default CustomerSupportChat;