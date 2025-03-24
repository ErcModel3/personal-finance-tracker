import React, { useState } from 'react';
import './SignUp.css';
import {useNavigate} from "react-router-dom";
import supabaseClient from "/src/auth/Client.js"
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    phoneNumber: '',
    dateOfBirth: '', // Add dateOfBirth to state
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
    let {data, error} = await supabaseClient.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error){
      console.log(error);
    }
    if (data){
      console.log("User Created Successfully");
      navigate("/dashboard");
    }
  };

  return (
      <div className="signup-page">
        <Navbar/>
        <div className="signup-container">
          <div className="signup-left">
            <h1 className="signup-title">Sign Up</h1>
            <p className="signup-subtitle">Create your account</p>
          </div>

          <div className="signup-right">
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                />
              </div>

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
                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Select your country"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                    type="number"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                />
              </div>

              {/* Add Date of Birth field here */}
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                />
              </div>
              <div className="form-button-container">
                <button type="submit" className="signup-button">Sign Up</button>
              </div>
            </form>
          </div>
          <Footer/>
        </div>
      </div>
  );
};

export default SignUp;