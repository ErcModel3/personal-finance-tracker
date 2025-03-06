import React from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const handleNavigation = (path) => {
        window.location.href = path; // Navigate to the specified path
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                {/* Left side: Budgeting App title */}
                <a className="navbar-brand" href="#">
                    FinTrack
                </a>

                {/* Right side: Navigation buttons */}
                <div className="navbar-nav ms-auto"> {/* ms-auto aligns the nav items to the right */}
                    <button className="nav-link" onClick={() => handleNavigation('/')}>Home</button>
                    <button className="nav-link" onClick={() => handleNavigation('/features')}>Features</button>
                    <button className="nav-link" onClick={() => handleNavigation('/signup')}>Sign Up</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;