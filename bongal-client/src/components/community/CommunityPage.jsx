import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import { productService } from '../../services/productService';
import PostCard from './PostCard';
import CreatePostWidget from './CreatePostWidget';
import PostFilters from './PostFilters';
import Loader from '../common/Loader';

const CommunityPage = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'popular',
    page: 1
  });

  // Fetch posts
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters)
  });

  // Fetch products for categories
  const { data: productsData } = useQuery({
    queryKey: ['products-categories'],
    queryFn: () => productService.getAllProducts({ limit: 100 })
  });

  const posts = Array.isArray(postsData?.data) ? postsData.data : [];
  const products = Array.isArray(productsData?.products) ? productsData.products : Array.isArray(productsData?.data) ? productsData.data : [];

  // Extract unique categories from products
  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'general', label: 'General' },
    ...products.map(product => ({
      value: product.name,
      label: product.name
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Community Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your experiences, connect with others, and discover amazing stories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <PostFilters
                categories={categories}
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />
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
