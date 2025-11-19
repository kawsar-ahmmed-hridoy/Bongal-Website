import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import PostCard from './PostCard';
import Loader from '../common/Loader';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/community')}
            className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const post = data?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/community')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Community</span>
        </button>

        {post && <PostCard post={post} />}
      </div>
    </div>
  );
};

export default PostDetailPage;
