import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import CreatePostModal from './CreatePostModal';
import { PenSquare, User, LogIn, Sparkles, MessageCircle } from 'lucide-react';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const CreatePostWidget = ({ categories, onPostCreated }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePostSuccess = () => {
    setShowModal(false);
    queryClient.invalidateQueries(['posts']);
    if (onPostCreated) {
      onPostCreated();
    }
  };

  if (!user) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 text-center transition-all duration-700 transform hover:scale-[1.02] ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="max-w-md mx-auto">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
            <User size={20} className="text-gray-500" />
          </div>
          <p className="text-gray-600 text-sm mb-3 font-medium">
            Join the conversation
          </p>
          <p className="text-gray-500 text-xs mb-4">
            Log in to share your stories and connect with others
          </p>
          <a
            href="/login"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 text-sm shadow-sm hover:shadow-md group"
          >
            <LogIn size={14} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Log In to Post</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-3 transition-all duration-500 transform relative z-30 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } ${isHovered ? 'scale-[1.02] shadow-md border-gray-300' : 'hover:scale-[1.02] hover:shadow-md'}`}
        style={{ position: 'relative', zIndex: 30 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm transition-all duration-300 transform hover:scale-110 group relative"
            style={{ 
              backgroundColor: COLORS.teal,
              backgroundImage: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.mediumBlue} 100%)`
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex-1 text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 transition-all duration-300 transform hover:scale-105 text-sm font-medium border border-transparent hover:border-gray-200"
          >
            What's your story, {user.name?.split(' ')[0]}?
          </button>

          <button
            onClick={() => setShowModal(true)}
            onMouseEnter={() => setIsHovered(true)}
            className="p-2 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md group relative"
            style={{ 
              backgroundColor: COLORS.mediumBlue,
              backgroundImage: `linear-gradient(135deg, ${COLORS.mediumBlue} 0%, ${COLORS.teal} 100%)`
            }}
            title="Create post"
          >
            <PenSquare size={14} className="group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Ready to share</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <MessageCircle size={12} />
            <span className="text-xs">Share your experience</span>
          </div>
        </div>
      </div>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePostSuccess}
          categories={categories}
        />
      )}
    </>
  );
};

export default CreatePostWidget;