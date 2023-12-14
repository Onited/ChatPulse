import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext';

const PublicRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (currentUser && currentUser.uid) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default PublicRoute;