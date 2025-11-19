import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import CreatePostModal from './CreatePostModal';
import { PenSquare } from 'lucide-react';

const CreatePostWidget = ({ categories }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  if (!user) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please log in to share your story
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100">
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* Input Trigger */}
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 text-left px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all duration-300"
          >
            What's your story, {user.name?.split(' ')[0]}?
          </button>

          {/* Create Button */}
          <button
            onClick={() => setShowModal(true)}
            className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <PenSquare size={20} />
          </button>
        </div>
      </div>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            // Refetch posts without page reload
            queryClient.invalidateQueries(['posts']);
          }}
          categories={categories}
        />
      )}
    </>
  );
};

export default CreatePostWidget;
