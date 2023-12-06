import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext';

const PublicRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (currentUser) {
        return <Navigate to="/chat" />;
    }

    return children;
};

export default PublicRoute;