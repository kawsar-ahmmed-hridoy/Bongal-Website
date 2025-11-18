import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Eye, Trash2, Clock, User, MessageCircle, Filter, Search, Check, AlertCircle, X } from 'lucide-react';
import { messageService } from '../../services/messageService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MessageManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const queryClient = useQueryClient();

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['admin-messages', selectedStatus],
    queryFn: () => messageService.getAllMessages(selectedStatus),
    refetchOnWindowFocus: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => messageService.updateMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-messages']);
      toast.success('Message status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id) => messageService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-messages']);
      setShowMessageDetail(false);
      setSelectedMessage(null);
      toast.success('Message deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    },
  });

  const messages = messagesData?.messages || [];
  const stats = messagesData?.stats || { total: 0, unread: 0, read: 0, replied: 0 };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = !searchTerm ||
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleStatusChange = (messageId, newStatus) => {
    updateStatusMutation.mutate({ id: messageId, status: newStatus });
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);

    // Mark as read if unread
    if (message.status === 'unread') {
      handleStatusChange(message._id, 'read');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread': return <AlertCircle size={16} />;
      case 'read': return <Eye size={16} />;
      case 'replied': return <Check size={16} />;
      default: return <MessageCircle size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="bg-yellow-100 p-2 rounded-xl">
              <Eye className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-xl">
              <Check className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.replied}</p>
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
                <option value="">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${message.status === 'unread' ? 'bg-blue-50/30' : ''
                  }`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="text-gray-400" size={16} />
                        <span className="font-medium text-gray-900">{message.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-600">{message.email}</span>
                      </div>
                    </div>

                    {message.subject && (
                      <p className="font-medium text-gray-900 mb-1">{message.subject}</p>
                    )}

                    <p className="text-gray-600 text-sm truncate mb-2">
                      {message.message}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span className="capitalize">{message.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showMessageDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
                <button
                  onClick={() => setShowMessageDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedMessage.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900">{selectedMessage.subject || 'No subject'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {getStatusIcon(selectedMessage.status)}
                      <span className="capitalize">{selectedMessage.status}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Received</label>
                    <p className="text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
                    disabled={deleteMessageMutation.isLoading}
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => setShowMessageDetail(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageManagement;