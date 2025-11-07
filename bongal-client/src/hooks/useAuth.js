import { useContext } from 'react';
import AuthProvider from '../context/AuthContext'; 

export const useAuth = () => {
  const context = useContext(AuthProvider._context); 
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
