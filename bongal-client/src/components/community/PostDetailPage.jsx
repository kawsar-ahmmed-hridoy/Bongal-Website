import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import PostCard from './PostCard';
import Loader from '../common/Loader';
import { ArrowLeft, Home, Users, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 text-center transition-all duration-700 transform ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="text-red-600" size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Post Not Found</h2>
            <p className="text-gray-600 text-sm mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => refetch()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate('/community')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                <Home size={16} />
                <span>Back to Community</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const post = data?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-6 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <button
            onClick={() => navigate('/community')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-all duration-300 transform hover:scale-105 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Community</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Post Details
              </h1>
              <p className="text-gray-600 text-sm">
                Viewing a single post from the community
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/60 shadow-sm">
              <Sparkles size={14} className="text-yellow-500" />
              <span className="text-xs font-semibold text-gray-700">Post View</span>
            </div>
          </div>
        </div>

        {post && (
          <div className={`transition-all duration-700 transform ${
            mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          }`}>
            <PostCard post={post} />
          </div>
        )}

        {post && (
          <div className={`mt-6 text-center transition-all duration-700 transform ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4">
              <p className="text-gray-600 text-sm mb-3">
                Want to see more stories from the community?
              </p>
              <button
                onClick={() => navigate('/community')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 text-sm shadow-sm hover:shadow-md group"
              >
                <Users size={14} className="group-hover:scale-110 transition-transform duration-300" />
                <span>Explore Community</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;