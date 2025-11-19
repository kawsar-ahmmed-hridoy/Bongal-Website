import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import { CheckCircle, XCircle, Eye, Trash2, Plus, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const PostManagement = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Fetch posts
  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', selectedStatus],
    queryFn: () => postService.getAllPostsAdmin(selectedStatus)
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['post-categories'],
    queryFn: () => postService.getPostCategories()
  });

  // Update post status mutation
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

  // Create category mutation
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

  // Delete category mutation
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Post Management</h2>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
          >
            <Tag size={18} />
            <span>Manage Categories</span>
          </button>
        </div>

        <div className="flex space-x-2">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${selectedStatus === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Manage Post Categories</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-300"
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 mb-3">Existing Categories</h4>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No categories yet</p>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Tag size={18} className="text-primary-600" />
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category._id, category.name)}
                        disabled={deleteCategoryMutation.isPending}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No {selectedStatus} posts
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author?.name}</p>
                      <p className="text-sm text-gray-500">{post.author?.email}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
                        {post.category}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${post.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : post.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>
                    <p className="text-gray-800 line-clamp-3">{post.content}</p>
                  </div>

                  {post.images && post.images.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.likesCount || 0} likes</span>
                    <span>{post.commentsCount || 0} comments</span>
                    <span>{post.sharesCount || 0} shares</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {post.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(post._id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-300"
                      >
                        <CheckCircle size={16} />
                        <span className="text-sm">Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(post._id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:bg-gray-300"
                      >
                        <XCircle size={16} />
                        <span className="text-sm">Reject</span>
                      </button>
                    </>
                  )}

                  <a
                    href={`/community/post/${post._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    <Eye size={16} />
                    <span className="text-sm">View</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostManagement;
