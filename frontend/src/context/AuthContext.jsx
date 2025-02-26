import React, {createContext, useContext, useState, useEffect} from 'react';
import { getCurrentUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await getCurrentUser(token);
                    setCurrentUser(data.user);
                    setLoading(false);
                } catch (err) {
                    console.error('Auth error:', err);
                    localStorage.removeItem('token');
                    setError(err.message);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setCurrentUser(userData);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    }

    const value = {
        currentUser,
        login,
        logout,
        error,
        isAuthenticated: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
