import { Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');

        // Simulate async token verification (if needed)
        const verifyToken = async () => {
            if (jwtToken) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    // Display a loading state while checking token
    if (loading) {
        return <div>Loading...</div>; // You can replace this with your own loading spinner
    }

    // If not authenticated, redirect to the sign-in page
    return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
