<<<<<<< HEAD
import { useState} from 'react';
=======
import { useState, useEffect, useRef } from 'react';
>>>>>>> f86040d314faa77b14b0bf014338a3a952d92a19
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, MessageCircle, Filter, Search, Check, AlertCircle, Send, ArrowLeft, Eye } from 'lucide-react';
import { messageService } from '../../services/messageService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MessageManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const queryClient = useQueryClient();

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['admin-conversations', selectedStatus],
    queryFn: () => messageService.getConversations(selectedStatus),
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
    notifyOnChangeProps: ['data', 'error'], // Only trigger re-render on actual data changes
  });

  const { data: conversationData, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['admin-conversation', selectedConversation?._id],
    queryFn: () => messageService.getUserConversation(selectedConversation._id),
    enabled: !!selectedConversation,
    refetchInterval: selectedConversation ? 5000 : false,
    notifyOnChangeProps: ['data', 'error'], // Only trigger re-render on actual data changes
  });

  // Update conversation messages only when count changes
  useEffect(() => {
    if (conversationData?.messages) {
      const newCount = conversationData.messages.length;
      if (newCount !== prevMessageCountRef.current) {
        setConversationMessages(conversationData.messages);
        prevMessageCountRef.current = newCount;

        // Scroll to bottom only when new messages arrive
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
      // Refetch conversation data and update immediately
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Conversation List View
  if (!selectedConversation) {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-xl">
                <User className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <MessageCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-xl">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Eye className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-2xl shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                >
                  <option value="">All Conversations</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 w-full md:w-80"
              />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${conversation.hasUnread ? 'bg-blue-50/30' : ''
                    }`}
                  onClick={() => handleViewConversation(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-white" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium text-gray-900 ${conversation.hasUnread ? 'font-bold' : ''}`}>
                            {conversation.userName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessageDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{conversation.userEmail}</p>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {conversation.totalMessages} message{conversation.totalMessages !== 1 ? 's' : ''}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
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

  // Conversation Thread View
  return (
    <div className="space-y-6">
      {/* Conversation Header */}
      <div className="bg-white p-6 rounded-2xl shadow-soft">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{selectedConversation.userName}</h2>
            <p className="text-sm text-gray-600">{selectedConversation.userEmail}</p>
            {selectedConversation.userPhone && (
              <p className="text-sm text-gray-600">{selectedConversation.userPhone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {isLoadingConversation ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="flex flex-col h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {conversationMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                conversationMessages.map((msg, index) => {
                  const showDate = index === 0 ||
                    new Date(msg.createdAt).toLocaleDateString() !==
                    new Date(conversationMessages[index - 1]?.createdAt).toLocaleDateString();

                  return (
                    <div key={msg._id}>
                      {/* Date Separator */}
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {new Date(msg.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      )}

                      {/* User Message */}
                      {!msg.isFromAdmin && (
                        <div className="flex justify-start mb-2">
                          <div className="max-w-[70%]">
                            <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none">
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

                      {/* Admin Message */}
                      {msg.isFromAdmin && (
                        <div className="flex justify-end mt-2">
                          <div className="max-w-[70%]">
                            <div className="bg-primary-600 text-white p-3 rounded-2xl rounded-tr-none">
                              <p className="text-xs text-primary-100 font-semibold mb-1">
                                {msg.sentBy?.name || 'Admin'}
                              </p>
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <div className="flex items-center justify-end space-x-2 mt-1">
                                <span className="text-xs text-primary-200">
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

            {/* Reply Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-end space-x-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 resize-none"
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
                  className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {sendMessageMutation.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManagement;