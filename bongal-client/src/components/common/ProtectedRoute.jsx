import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield, Lock, User } from 'lucide-react';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-200/60">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield size={24} className="text-gray-600" />
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 text-lg font-light">Verifying Access</p>
            <div className="flex justify-center space-x-1.5">
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${dot * 0.15}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: "Please sign in to access this page",
          type: "info"
        }} 
        replace 
      />
    );
  }

  if (adminOnly && user.role !== "admin") {
    return (
      <Navigate 
        to="/" 
        state={{ 
          message: "Access denied. Administrator privileges required.",
          type: "error"
        }} 
        replace 
      />
    );
  }

  return (
    <div className="relative">
      {adminOnly && user.role === "admin" && (
        <div className="fixed top-20 right-6 z-40">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 text-sm font-medium">
            <Shield size={16} />
            <span>Admin Mode</span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}

export default ProtectedRoute;