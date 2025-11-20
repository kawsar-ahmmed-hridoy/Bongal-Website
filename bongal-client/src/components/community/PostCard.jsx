import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2, Trash2, X, MoreHorizontal, Calendar, User } from 'lucide-react';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import CommentsSection from './CommentsSection';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const likeMutation = useMutation({
    mutationFn: () => postService.toggleLike(post._id),
    onMutate: async () => {
      const previousIsLiked = isLiked;
      const previousCount = likesCount;
      const newIsLiked = !previousIsLiked;

      setIsLiked(newIsLiked);
      setLikesCount(newIsLiked ? previousCount + 1 : previousCount - 1);

      return { previousIsLiked, previousCount };
    },
    onSuccess: (data) => {
      if (data?.data) {
        setLikesCount(data.data.likesCount || 0);
        setIsLiked(data.data.isLiked);
      }
    },
    onError: (error, variables, context) => {
      if (context) {
        setIsLiked(context.previousIsLiked);
        setLikesCount(context.previousCount);
      }
      toast.error('Failed to update like');
    }
  });

  const shareMutation = useMutation({
    mutationFn: () => postService.sharePost(post._id),
    onSuccess: () => {
      toast.success('Post shared!');
    }
  });

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
    const url = `${window.location.origin}/community/post/${post._id}`;
    navigator.clipboard.writeText(url);
    shareMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate();
    }
    setShowOptions(false);
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: COLORS.teal,
                backgroundImage: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.mediumBlue} 100%)`
              }}
            >
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{post.author?.name}</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                <Calendar size={12} />
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white shadow-sm"
                  style={{ backgroundColor: COLORS.mediumBlue }}
                >
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-110"
            >
              <MoreHorizontal size={16} />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200/60 py-1 z-10 min-w-[120px]">
                {user && user._id === post.author?._id && (
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {post.images && post.images.length > 0 && (
        <div className={`px-4 pb-3 grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-80 object-cover rounded-lg bg-gray-50 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Heart size={12} className={isLiked ? 'text-red-500 fill-red-500' : ''} />
              <span>{likesCount} likes</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle size={12} />
              <span>{commentsCount} comments</span>
            </span>
          </div>
          <span>{post.sharesCount || 0} shares</span>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span>Like</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
          >
            <MessageCircle size={16} />
            <span>Comment</span>
          </button>

          <button
            onClick={handleShare}
            disabled={shareMutation.isPending}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

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