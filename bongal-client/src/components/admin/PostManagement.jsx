import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import { CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const PostManagement = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('pending');

  // Fetch posts
  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', selectedStatus],
    queryFn: () => postService.getAllPostsAdmin(selectedStatus)
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

  const posts = data?.data || [];

  const handleApprove = (postId) => {
    updateStatusMutation.mutate({ postId, status: 'approved' });
  };

  const handleReject = (postId) => {
    if (window.confirm('Are you sure you want to reject this post?')) {
      updateStatusMutation.mutate({ postId, status: 'rejected' });
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Management</h2>

        {/* Status Filter */}
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

      {/* Posts List */}
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
                  {/* Author Info */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author?.name}</p>
                      <p className="text-sm text-gray-500">{post.author?.email}</p>
                    </div>
                  </div>

                  {/* Post Details */}
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

                  {/* Images Preview */}
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

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.likesCount || 0} likes</span>
                    <span>{post.commentsCount || 0} comments</span>
                    <span>{post.sharesCount || 0} shares</span>
                  </div>
                </div>

                {/* Actions */}
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
