import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2, Trash2, X } from 'lucide-react';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import CommentsSection from './CommentsSection';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Use isLiked flag from backend response (backend checks if user's ID is in likes array)
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  // Toggle like mutation
  const likeMutation = useMutation({
    mutationFn: () => postService.toggleLike(post._id),
    onMutate: async () => {
      // Optimistic update
      const previousIsLiked = isLiked;
      const previousCount = likesCount;
      const newIsLiked = !previousIsLiked;

      setIsLiked(newIsLiked);
      setLikesCount(newIsLiked ? previousCount + 1 : previousCount - 1);

      // Return context for rollback
      return { previousIsLiked, previousCount };
    },
    onSuccess: (data) => {
      // Update with actual data from server
      if (data?.data) {
        setLikesCount(data.data.likesCount || 0);
        setIsLiked(data.data.isLiked);
      }
    },
    onError: (error, variables, context) => {
      // Revert to previous state on error
      if (context) {
        setIsLiked(context.previousIsLiked);
        setLikesCount(context.previousCount);
      }
      toast.error('Failed to update like');
    }
  });

  // Share mutation
  const shareMutation = useMutation({
    mutationFn: () => postService.sharePost(post._id),
    onSuccess: () => {
      toast.success('Post shared!');
      // Don't refetch posts to avoid shuffling
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(post._id),
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  });

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like posts');
      navigate('/login');
      return;
    }
    likeMutation.mutate();
  };

  const handleShare = () => {
    if (!user) {
      toast.error('Please login to share posts');
      navigate('/login');
      return;
    }
    // Copy link to clipboard
    const url = `${window.location.origin}/community/post/${post._id}`;
    navigator.clipboard.writeText(url);
    shareMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate();
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffInMs = now - d;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
        -Math.floor(diffInHours),
        'hour'
      );
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {/* Delete button for post owner */}
          {user && user._id === post.author?._id && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`px-6 pb-4 grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full max-h-[500px] object-contain rounded-xl bg-gray-50 cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Stats */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{likesCount} likes</span>
          <div className="flex items-center space-x-4">
            <span>{commentsCount} comments</span>
            <span>{post.sharesCount || 0} shares</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isLiked
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="font-medium">Like</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          >
            <MessageCircle size={20} />
            <span className="font-medium">Comment</span>
          </button>

          <button
            onClick={handleShare}
            disabled={shareMutation.isPending}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Share2 size={20} />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentsSection
          postId={post._id}
          onCommentAdded={() => setCommentsCount(prev => prev + 1)}
          onCommentDeleted={() => setCommentsCount(prev => Math.max(0, prev - 1))}
        />
      )}
    </div>
  );
};

export default PostCard;
