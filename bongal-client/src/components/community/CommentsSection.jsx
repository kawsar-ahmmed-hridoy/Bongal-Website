import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Trash2 } from 'lucide-react';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CommentsSection = ({ postId, onCommentAdded, onCommentDeleted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getComments(postId),
    staleTime: 0, // Comments can go stale immediately
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (content) => commentService.createComment(postId, content),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries(['comments', postId]);
      // Call callback to update parent's comment count
      if (onCommentAdded) {
        onCommentAdded();
      }
      toast.success('Comment added');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      // Call callback to update parent's comment count
      if (onCommentDeleted) {
        onCommentDeleted();
      }
      toast.success('Comment deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    createCommentMutation.mutate(newComment.trim());
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffInMs = now - d;
    const diffInMinutes = diffInMs / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    }
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    }
    return d.toLocaleDateString();
  };

  const comments = commentsData?.data || [];

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
      {/* Comments List */}
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {comment.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.author?.name}
                    </span>
                    {user && user._id === comment.author?._id && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={deleteCommentMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
                <span className="text-xs text-gray-500 ml-3 mt-1">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || createCommentMutation.isPending}
              className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      )}

      {!user && (
        <div className="text-center py-2">
          <button
            onClick={() => navigate('/login')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Log in to comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
