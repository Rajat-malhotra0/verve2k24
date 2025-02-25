import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    return (
        <nav className="bg-white shadow-lg relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <div>
                            <a href="#" className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900">
                                <svg className="h-6 w-6 mr-1 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l7 7-7 7-7-7z" />
                                </svg>
                                <span className="font-bold">AI-ed</span>
                            </a>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to = "/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Home</Link>
                            <a href="#" className="py-5 px-3 text-gray-700 hover:text-gray-900">About</a>
                            <a href="#" className="py-5 px-3 text-gray-700 hover:text-gray-900">Services</a>
                            <a href="#" className="py-5 px-3 text-gray-700 hover:text-gray-900">Contact</a>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <a href="#" className="py-2 px-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">Login</a>
                        <a href="#" className="py-2 px-3 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300">Sign Up</a>
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
                <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-200" onClick={toggleMobileMenu} >Home</Link>
                <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">About</a>
                <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">Services</a>
                <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">Contact</a>
            </div>
        </nav>
    );
}

export default Navbar;