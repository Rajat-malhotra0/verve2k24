import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <div>
                            <Link to="/" className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900">
                                <svg className="h-6 w-6 mr-1 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l7 7-7 7-7-7z" />
                                </svg>
                                <span className="font-bold">AI-ed</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Home</Link>
                            <Link to="/forum" className="py-5 px-3 text-gray-700 hover:text-gray-900">Forum</Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        {isAuthenticated ? (
                            <>
                                <span className="py-5 px-3">Welcome, {currentUser.username}</span>
                                <button 
                                    onClick={handleLogout} 
                                    className="py-2 px-3 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="py-2 px-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">Login</Link>
                                <Link to="/register" className="py-2 px-3 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300">Sign Up</Link>
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                            <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`mobile-menu md:hidden absolute w-full bg-white shadow-md z-50 ${isMobileMenuOpen ? "block" : "hidden"}`}
                style={{ top: "100%" }}
            >
                <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-200" onClick={toggleMobileMenu}>Home</Link>
                <Link to="/forum" className="block py-2 px-4 text-sm hover:bg-gray-200" onClick={toggleMobileMenu}>Forum</Link>
                
                {isAuthenticated ? (
                    <>
                        <span className="block py-2 px-4 text-sm bg-gray-100">Welcome, {currentUser.username}</span>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left py-2 px-4 text-sm text-red-600 hover:bg-gray-200"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="block py-2 px-4 text-sm hover:bg-gray-200" onClick={toggleMobileMenu}>Login</Link>
                        <Link to="/register" className="block py-2 px-4 text-sm hover:bg-gray-200" onClick={toggleMobileMenu}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;