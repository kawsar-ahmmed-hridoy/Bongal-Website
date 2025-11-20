import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import PostCard from './PostCard';
import CreatePostWidget from './CreatePostWidget';
import Loader from '../common/Loader';
import { Users, Zap, Filter, RefreshCw, Sparkles } from 'lucide-react';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const CommunityPage = () => {
  const [filters, setFilters] = useState({
    category: 'general',
    page: 1
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    data: postsData, 
    isLoading: postsLoading, 
    error: postsError,
    refetch 
  } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['post-categories'],
    queryFn: () => postService.getPostCategories()
  });

  const posts = Array.isArray(postsData?.data) ? postsData.data : [];
  const postCategories = categoriesData?.data || [];

  const categories = [
    { value: 'general', label: 'General' },
    ...postCategories.map(category => ({
      value: category.name,
      label: category.name
    }))
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const loadMore = () => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const handlePostCreated = () => {
    refetch();
  };

  if (postsLoading && filters.page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 text-center transition-all duration-500 transform hover:scale-[1.02]">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="text-red-600" size={24} />
            </div>
            <p className="text-red-500 text-sm mb-3">Failed to load posts</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-sm flex items-center space-x-2 mx-auto group"
            >
              <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-6 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Community Stories
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Share your experiences, connect with others, and discover amazing stories
          </p>
          {posts.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-3">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200/60 shadow-sm transition-all duration-300 hover:shadow-md">
                <Zap size={14} className="text-blue-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-700">Live Community</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <div className="sticky top-20 z-10">
              <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 transition-all duration-700 transform hover:shadow-md ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <Filter size={16} className="text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleFilterChange({ category: category.value })}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium ${
                        filters.category === category.value
                          ? 'text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      style={filters.category === category.value ? { 
                        backgroundColor: COLORS.mediumBlue,
                        backgroundImage: `linear-gradient(135deg, ${COLORS.mediumBlue} 0%, ${COLORS.teal} 100%)`
                      } : {}}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-4 relative">
            <div className={`transition-all duration-700 transform relative z-30 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <CreatePostWidget 
                categories={categories} 
                onPostCreated={handlePostCreated}
              />
            </div>

            {posts.length === 0 ? (
              <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-8 text-center transition-all duration-700 transform hover:scale-[1.02] ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Posts Yet</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Be the first to share your story in the community!
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-blue-700 text-xs">
                      Share your experiences and connect with others
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`space-y-4 transition-all duration-700 transform relative z-10 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {posts.map((post, index) => (
                  <div
                    key={post._id}
                    className={`transition-all duration-500 transform hover:scale-[1.01] ${
                      mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}

            {postsData?.pagination?.pages > filters.page && (
              <div className={`text-center transition-all duration-700 transform ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={loadMore}
                  disabled={postsLoading}
                  className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none group"
                >
                  {postsLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Load More Stories</span>
                      <Sparkles size={14} className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                </button>
              </div>
            )}

            {postsLoading && filters.page > 1 && (
              <div className="text-center py-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-600">Loading more stories...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;