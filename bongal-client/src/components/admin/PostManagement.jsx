import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import { CheckCircle, XCircle, Eye, Trash2, Plus, Tag, Users, FileText, AlertCircle, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const PostManagement = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', selectedStatus],
    queryFn: () => postService.getAllPostsAdmin(selectedStatus)
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['post-categories'],
    queryFn: () => postService.getPostCategories()
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ postId, status }) => postService.updatePostStatus(postId, status),
    onSuccess: () => {
      toast.success('Post status updated');
      queryClient.invalidateQueries(['admin-posts']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update post');
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: (name) => postService.createPostCategory(name),
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries(['post-categories']);
      setShowCategoryModal(false);
      setNewCategoryName('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId) => postService.deletePostCategory(categoryId),
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries(['post-categories']);
      queryClient.invalidateQueries(['admin-posts']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  });

  const posts = data?.data || [];
  const categories = categoriesData?.data || [];

  const handleApprove = (postId) => {
    updateStatusMutation.mutate({ postId, status: 'approved' });
  };

  const handleReject = (postId) => {
    if (window.confirm('Are you sure you want to reject this post?')) {
      updateStatusMutation.mutate({ postId, status: 'rejected' });
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    createCategoryMutation.mutate(newCategoryName);
  };

  const handleDeleteCategory = (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}" category? All posts with this category will be moved to "general".`)) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStats = () => {
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: posts.length
    };

    posts.forEach(post => {
      if (stats[post.status] !== undefined) {
        stats[post.status]++;
      }
    });

    return stats;
  };

  const statusStats = getStatusStats();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      <div className={`flex justify-between items-center transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Post Management</h1>
          <p className="text-gray-600 text-sm font-light mt-1">
            {posts.length > 0 
              ? `Managing ${posts.length} posts` 
              : 'No posts yet. Posts will appear here when users create content.'
            }
          </p>
        </div>
        {posts.length > 0 && (
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-200/60 shadow-sm">
            <Zap size={16} className="text-blue-500" />
            <span className="text-xs font-semibold text-gray-700">Live Posts</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {[
            { 
              status: 'pending', 
              label: 'Pending', 
              color: COLORS.brown,
              icon: AlertCircle,
              delay: 100
            },
            { 
              status: 'approved', 
              label: 'Approved', 
              color: COLORS.teal,
              icon: CheckCircle,
              delay: 200
            },
            { 
              status: 'rejected', 
              label: 'Rejected', 
              color: COLORS.brown,
              icon: XCircle,
              delay: 300
            },
            { 
              status: 'total', 
              label: 'Total Posts', 
              color: COLORS.darkBlue,
              icon: FileText,
              delay: 400
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.status}
                className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-3 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-white group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: stat.color }}
                >
                  <Icon size={18} />
                </div>
                <p className="text-lg font-bold text-gray-900">{statusStats[stat.status] || 0}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex space-x-2">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm capitalize transition-all duration-300 transform hover:scale-105 ${
                  selectedStatus === status
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedStatus === status ? { backgroundColor: COLORS.mediumBlue } : {}}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-sm"
          >
            <Tag size={16} />
            <span>Manage Categories</span>
          </button>
        </div>
      </div>

      <div className={`space-y-3 transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-8 text-center">
            <FileText className="mx-auto text-gray-400 mb-3" size={32} />
            <p className="text-gray-500 text-sm">No {selectedStatus} posts found</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] group"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                      style={{ backgroundColor: COLORS.teal }}
                    >
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{post.author?.name}</p>
                      <p className="text-xs text-gray-500">{post.author?.email}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                      <span 
                        className="px-2 py-1 rounded-lg text-xs font-medium text-white shadow-sm"
                        style={{ backgroundColor: COLORS.mediumBlue }}
                      >
                        {post.category}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        post.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : post.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>
                    <p className="text-gray-800 text-sm line-clamp-3">{post.content}</p>
                  </div>

                  {post.images && post.images.length > 0 && (
                    <div className="flex space-x-2 mb-3 overflow-x-auto">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{post.likesCount || 0} likes</span>
                    <span>{post.commentsCount || 0} comments</span>
                    <span>{post.sharesCount || 0} shares</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-3">
                  {post.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(post._id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center space-x-1 px-2 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:transform-none text-xs"
                      >
                        <CheckCircle size={14} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(post._id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center space-x-1 px-2 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:transform-none text-xs"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  <a
                    href={`/community/post/${post._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-xs"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Manage Post Categories</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:transform-none text-sm"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Existing Categories</h4>
                {categories.length === 0 ? (
                  <div className="text-center py-4">
                    <Sparkles size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">No categories yet</p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-2">
                        <Tag size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">{category.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category._id, category.name)}
                        disabled={deleteCategoryMutation.isPending}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;