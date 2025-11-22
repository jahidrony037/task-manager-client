import { Navigate, useLocation } from "react-router";
import useAuth from "../../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
            <div className="absolute inset-0 loading loading-spinner loading-lg text-purple-600 opacity-30 blur-sm"></div>
          </div>
          <p className="mt-6 text-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
