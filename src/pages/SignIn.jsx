import React, { useState } from 'react';
import './SignIn.css';
import supabaseClient from "/src/auth/Client.js"
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // To do: Add link to supabase once backend is finished
        const {data, error} = await supabaseClient.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        });
        if (error){
            alert('Signin error: ' + error);
            return null;
        }
        if (data){
            navigate("/dashboard");
            return null;
        }
    };

    const handleForgotPassword = () => {
        // You can implement password reset functionality here
        alert("Password reset functionality will be implemented soon!");
    };

    const handleNavigateToSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="signin-page">
            <Navbar/>
            <div className="signin-main-container">
                <div className="signin-content">
                    <h1 className="signin-title">Sign In</h1>
                    <p className="signin-subtitle">Sign into your account</p>
                    
                    <form className="signin-form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        
                        <div className="forgot-password-container">
                            <button 
                                type="button" 
                                className="forgot-password-link" 
                                onClick={handleForgotPassword}
                            >
                                Forgot your password?
                            </button>
                        </div>

                        <div className="signin-button-container">
                            <button type="submit" className="signin-button">Sign In</button>
                        </div>
                        
                        <div className="new-account-container">
                            <p>First time here?</p>
                            <button 
                                type="button" 
                                className="create-account-button" 
                                onClick={handleNavigateToSignUp}
                            >
                                Create an account
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="footer-links">
                    <a href="#">Contact Us</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                </div>
            </div>
            {/* Removed the Footer component to prevent duplicate footers */}
        </div>
    );
};

export default SignIn;