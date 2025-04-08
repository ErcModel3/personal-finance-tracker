import React from 'react';
import './AuthenticatedNavbar.css';
import { Link } from 'react-router-dom';
import logo from '../../logo-no-bg.png';
import cogwheelIcon from '../../cog-wheel-no-bg.png'; 
import supabaseClient from '../auth/Client.js';

const AuthenticatedNavbar = () => {
    const handleLogout = async () => {
        try {
            // Use the Supabase client to sign out
            await supabaseClient.auth.signOut();
            // Redirect happens automatically via the Link
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="authenticated-navbar fixed-top">
            <div className="container">
                {/* Logo wrapped in Link to make it clickable */}
                <Link
                    to="/dashboard"
                    className="auth-logo-link"
                    aria-label="Navigate to Dashboard"
                >
                    <img
                        src={logo}
                        alt="FinTrack Logo"
                        className="auth-logo-image"
                    />
                </Link>

                {/* Right side: Navigation buttons for authenticated users */}
                <div className="authenticated-navbar-nav ms-auto">
                    <Link className="auth-nav-link" to="/dashboard">Dashboard</Link>
                    <Link className="auth-nav-link" to="/add-expense">Add Expenses</Link>
                    <Link className="auth-nav-link" to="/manage-cards">Manage Cards</Link>
                    <Link className="auth-nav-link" to="/finance-targets">Targets</Link>
                    <Link className="auth-nav-link" to="/notifications">Notifications</Link>
                    <Link className="auth-nav-link" to="/data">Analysis</Link>

                    <Link className="auth-nav-link cogwheel-link" to="/settings" aria-label="Settings">
                        <img 
                            src={cogwheelIcon} 
                            alt="Settings" 
                            className="cogwheel-icon"
                        />
                    </Link>
                    
                    <Link className="auth-nav-link logout-button" to="/" onClick={handleLogout}>
                        Logout
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default AuthenticatedNavbar;