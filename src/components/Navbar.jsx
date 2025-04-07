import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../../logo-no-bg.png';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container">
                {/* Logo wrapped in Link to make it clickable */}
                <Link
                    to="/"
                    className="logo-link"
                    aria-label="Navigate to Home"
                >
                    <img
                        src={logo}
                        alt="FinTrack Logo"
                        className="logo-image"
                    />
                </Link>

                {/* Right side: Navigation buttons - only Home, Sign In, Sign Up */}
                <div className="navbar-nav ms-auto">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/signin">Sign In</Link>
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;