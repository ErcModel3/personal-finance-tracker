import React from 'react';
import './AuthenticatedNavbar.css';
import { Link } from 'react-router-dom';
import logo from '../../logo-no-bg.png';

const AuthenticatedNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container">
                {/* Logo wrapped in Link to make it clickable */}
                <Link
                    to="/dashboard"
                    className="logo-link"
                    aria-label="Navigate to Dashboard"
                >
                    <img
                        src={logo}
                        alt="FinTrack Logo"
                        className="logo-image"
                    />
                </Link>

                {/* Right side: Navigation buttons for authenticated users */}
                <div className="navbar-nav ms-auto">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    <Link className="nav-link" to="/add-expense">Add Expense</Link>
                    <Link className="nav-link" to="/manage-cards">Manage Cards</Link>
                    <Link className="nav-link" to="/finance-targets">Finance Targets</Link>
                    <Link className="nav-link" to="/notifications">Notifications</Link>
                    <Link className="nav-link" to="/settings">Settings</Link>
                    <Link className="nav-link" to="/" onClick={() => { /* Add logout function here */ }}>Logout</Link>
                </div>
            </div>
        </nav>
    );
};

export default AuthenticatedNavbar;