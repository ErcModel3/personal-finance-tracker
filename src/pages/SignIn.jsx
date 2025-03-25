import React, { useState } from 'react';
import './SignIn.css';
import supabaseClient from "/src/auth/Client.js"
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer.jsx";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        country: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
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
        console.log('Form submitted', formData);
        // To do: Add link to supabase once backend is finished
        const {data, error} = await supabaseClient.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        });
        if (error){
            console.log(error);
            return null;
        }
        if (data){
            navigate("/dashboard");
            return null;
        }
    };

    return (
        <div className="signup-page">
            <Navbar/>
            <div className="signup-container">
                <div className="signup-left">
                    <h1 className="signup-title">Sign In</h1>
                    <p className="signup-subtitle">Sign into your account</p>
                </div>

                <div className="signup-right">
                    <form className="signup-form" onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="form-button-container">
                            <button type="submit" className="signup-button">Sign In</button>
                        </div>
                    </form>
                </div>
                <Footer/>
            </div>

        </div>
    );
};

export default SignIn;