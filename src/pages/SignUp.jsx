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

    if (formData.password === formData.confirmPassword) {
      let { data, error } = await supabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert('Signup error: ' + error);
        return;
      }

      if (data?.user) {
        alert("User successfully signed up! Please validate your email before you sign in.");

        // Small delay to ensure the trigger has completed
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update the profile with additional information
        const { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .update({
              fullName: formData.fullName,
              phone: formData.phoneNumber,
              dob: formData.dateOfBirth,
              country: formData.country
            })
            .eq('id', data.user.id)
            .select(); // Add this to return the updated data

        if (profileError) {
          alert('Signup error: ' + error);
        }

        if (profileData) {
          alert('Signup error: ' + error);
        }
      }
    }else {
      alert('passwords do not match.')
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

              <div className="existing-user-container">
                <p>Already have an account?</p>
                <button
                    type="button"
                    className="signup-button signin-account-button"
                    onClick={() => navigate("/signin")}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
          <Footer/>
        </div>
      </div>
  );
};

export default SignUp;