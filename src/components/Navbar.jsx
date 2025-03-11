import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const handleNavigation = (path) => {
        window.location.href = path; // Navigate to the specified path
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container">
                {/* Left side: Budgeting App title */}
                <Link className="navbar-brand" to="/">
                    FinTrack
                </Link>

                {/* Right side: Navigation buttons */}
                <div className="navbar-nav ms-auto"> {/* ms-auto aligns the nav items to the right */}
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/features">Features</Link>
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                    <Link className="nav-link" to="/login">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;