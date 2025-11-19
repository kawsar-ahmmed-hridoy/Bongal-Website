import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import PostCard from './PostCard';
import CreatePostWidget from './CreatePostWidget';
import Loader from '../common/Loader';

const CommunityPage = () => {
  const [filters, setFilters] = useState({
    category: 'general',
    page: 1
  });

  // Fetch posts
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters),
    staleTime: Infinity, // Keep data fresh indefinitely
    gcTime: Infinity, // Never garbage collect cached data
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch when reconnecting
    refetchInterval: false, // Disable automatic refetch intervals
    refetchIntervalInBackground: false // Disable background refetch
  });

  // Fetch post categories
  const { data: categoriesData } = useQuery({
    queryKey: ['post-categories'],
    queryFn: () => postService.getPostCategories()
  });

  const posts = Array.isArray(postsData?.data) ? postsData.data : [];
  const postCategories = categoriesData?.data || [];

  // Build categories list - start with General, then add custom categories
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

  if (postsLoading && filters.page === 1) {
    return <Loader />;
  }

  if (postsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <p className="text-red-500 text-lg mb-4">Failed to load posts</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Community Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your experiences, connect with others, and discover amazing stories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Category Filter */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleFilterChange({ category: category.value })}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${filters.category === category.value
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Create Post Widget */}
            <CreatePostWidget categories={categories} />

            {/* Posts Feed */}
            {posts.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share your story!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {postsData?.pagination?.pages > filters.page && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Load More Stories
                </button>
              </div>
            )}

            {postsLoading && filters.page > 1 && (
              <div className="text-center py-4">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
