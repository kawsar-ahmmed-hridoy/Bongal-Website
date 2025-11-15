import ProtectedRoute from './ProtectedRoute';

export const withAdminProtection = () => {
  return function AdminProtectedComponent(props) {
    return (
      <ProtectedRoute adminOnly={true}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export const withAuthProtection = () => {
  return function AuthProtectedComponent(props) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};