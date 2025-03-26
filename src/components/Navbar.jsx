import React from 'react';
import './Navbar.css';
import {Link} from 'react-router-dom';
import logo from '../../public/logo-no-bg.png';

const Navbar = () => {

    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container">
                {/* Left side: Budgeting App title */}

                {/*Commented out but not removed incase someone else wants to play with the image*/}
                {/*<Link className="navbar-brand" to="/">*/}
                {/*    FinTrack*/}
                {/*</Link>*/}

                <img src={logo} alt="logo-no-bg.png" height="50" width="auto"/>

                {/* Right side: Navigation buttons */}
                <div className="navbar-nav ms-auto"> {/* ms-auto aligns the nav items to the right */}
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                    <Link className="nav-link" to="/signin">Sign In</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;