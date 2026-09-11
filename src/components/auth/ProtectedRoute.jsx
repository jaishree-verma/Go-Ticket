import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../AuthModal';

/**
 * Reusable ProtectedRoute wrapper component
 * Can wrap individual routes or children components.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Checking authentication status...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {showModal ? (
          <AuthModal
            onClose={() => setShowModal(false)}
            bookingRequired={true}
          />
        ) : (
          <Navigate to="/" state={{ from: location }} replace />
        )}
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
