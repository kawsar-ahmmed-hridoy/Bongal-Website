import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, MessageCircle, Filter, Search, Check, AlertCircle, Send, ArrowLeft, Eye, Mail, Phone, Zap, Sparkles } from 'lucide-react';
import { messageService } from '../../services/messageService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const MessageManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['admin-conversations', selectedStatus],
    queryFn: () => messageService.getConversations(selectedStatus),
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
    notifyOnChangeProps: ['data', 'error'],
  });

  const { data: conversationData, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['admin-conversation', selectedConversation?._id],
    queryFn: () => messageService.getUserConversation(selectedConversation._id),
    enabled: !!selectedConversation,
    refetchInterval: selectedConversation ? 5000 : false,
    notifyOnChangeProps: ['data', 'error'],
  });

  useEffect(() => {
    if (conversationData?.messages) {
      const newCount = conversationData.messages.length;
      if (newCount !== prevMessageCountRef.current) {
        setConversationMessages(conversationData.messages);
        prevMessageCountRef.current = newCount;

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      }
    }
  }, [conversationData]);

  const sendMessageMutation = useMutation({
    mutationFn: ({ userId, message }) => messageService.sendMessageToUser(userId, message),
    onSuccess: async () => {
      setReplyText('');
      toast.success('Message sent successfully');
      const updatedData = await queryClient.fetchQuery({
        queryKey: ['admin-conversation', selectedConversation._id],
        queryFn: () => messageService.getUserConversation(selectedConversation._id),
      });
      if (updatedData?.messages) {
        setConversationMessages(updatedData.messages);
      }
      queryClient.invalidateQueries(['admin-conversations']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });

  const conversations = conversationsData?.conversations || [];
  const stats = conversationsData?.stats || { total: 0, unread: 0, read: 0, totalUsers: 0 };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = !searchTerm ||
      conversation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleViewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setConversationMessages([]);
    setReplyText('');
    prevMessageCountRef.current = 0;
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setConversationMessages([]);
    setReplyText('');
    prevMessageCountRef.current = 0;
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    sendMessageMutation.mutate({
      userId: selectedConversation._id,
      message: replyText
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!selectedConversation) {
    return (
      <div className="space-y-4">
        <div className={`flex justify-between items-center transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Message Management</h1>
            <p className="text-gray-600 text-sm font-light mt-1">
              {conversations.length > 0
                ? `Managing ${conversations.length} conversations`
                : 'No conversations yet. Messages will appear here when users contact you.'}
            </p>
          </div>
          {conversations.length > 0 && (
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-200/60 shadow-sm">
              <Zap size={16} className="text-blue-500" />
              <span className="text-xs font-semibold text-gray-700">Live Messages</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {[
            { 
              label: 'Total Users', 
              value: stats.totalUsers, 
              icon: User, 
              color: COLORS.mediumBlue,
              delay: 100
            },
            { 
              label: 'Total Messages', 
              value: stats.total, 
              icon: MessageCircle, 
              color: COLORS.teal,
              delay: 200
            },
            { 
              label: 'Unread', 
              value: stats.unread, 
              icon: AlertCircle, 
              color: COLORS.brown,
              delay: 300
            },
            { 
              label: 'Read', 
              value: stats.read, 
              icon: Eye, 
              color: COLORS.darkBlue,
              delay: 400
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-3 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: stat.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-9 pr-6 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all duration-300"
                >
                  <option value="">All Conversations</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm w-full md:w-64 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="text-gray-500 text-sm">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation._id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer transition-all duration-300 transform hover:scale-[1.01] group ${
                    conversation.hasUnread ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => handleViewConversation(conversation)}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: COLORS.teal }}
                      >
                        <User size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium text-gray-900 text-sm ${conversation.hasUnread ? 'font-bold' : ''}`}>
                            {conversation.userName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessageDate)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{conversation.userEmail}</p>
                        <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {conversation.totalMessages} message{conversation.totalMessages !== 1 ? 's' : ''}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                              {conversation.unreadCount} unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBackToList}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm"
            style={{ backgroundColor: COLORS.teal }}
          >
            <User size={18} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{selectedConversation.userName}</h2>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Mail size={12} />
                {selectedConversation.userEmail}
              </p>
              {selectedConversation.userPhone && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone size={12} />
                  {selectedConversation.userPhone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
        {isLoadingConversation ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {conversationMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  <div className="text-center">
                    <Sparkles size={32} className="mx-auto text-gray-400 mb-2" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                conversationMessages.map((msg, index) => {
                  const showDate = index === 0 ||
                    new Date(msg.createdAt).toLocaleDateString() !==
                    new Date(conversationMessages[index - 1]?.createdAt).toLocaleDateString();

                  return (
                    <div key={msg._id}>
                      {showDate && (
                        <div className="flex items-center justify-center my-3">
                          <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {new Date(msg.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      )}

                      {!msg.isFromAdmin && (
                        <div className="flex justify-start mb-2">
                          <div className="max-w-[80%]">
                            <div className="bg-gray-100 text-gray-800 p-3 rounded-xl rounded-tl-none transition-all duration-300 hover:shadow-sm">
                              <p className="text-xs text-gray-600 font-semibold mb-1">
                                {msg.name || 'User'}
                              </p>
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <div className="flex items-center justify-start space-x-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.isFromAdmin && (
                        <div className="flex justify-end mt-2">
                          <div className="max-w-[80%]">
                            <div 
                              className="text-white p-3 rounded-xl rounded-tr-none transition-all duration-300 hover:shadow-sm"
                              style={{ backgroundColor: COLORS.mediumBlue }}
                            >
                              <p className="text-xs text-blue-100 font-semibold mb-1">
                                {msg.sentBy?.name || 'Admin'}
                              </p>
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <div className="flex items-center justify-end space-x-2 mt-1">
                                <span className="text-xs text-blue-200">
                                  {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex items-end space-x-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none text-sm transition-all duration-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />
                <button
                  onClick={handleSendReply}
                  disabled={sendMessageMutation.isLoading || !replyText.trim()}
                  className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                >
                  {sendMessageMutation.isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManagement;