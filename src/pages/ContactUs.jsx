import React, { useState } from 'react';
import './ContactUs.css'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry', 
        message: ''
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
        // To do: Add form submission logic here
        alert('Message sent! We will get back to you soon.');
    };

    return (
        <div className="contact-page">
            <Navbar />
            <div className="contact-container">
                <div className="contact-header">
                    <div className="contact-info">
                        <h2>Contact Information</h2>
                        <p>Get in touch</p>
                        <p>Reach out to us via email for any queries.</p>
                    </div>
                </div>

                <div className="contact-details">
                    <h2>Contact Details</h2>
                    <div className="details-container">
                        <div className="details-column">
                            <h3>Email Address</h3>
                            <p>support@fintrack.co.uk</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-section">
                    <h2>Contact Form</h2>
                    <p>Feel free to send us a message.</p>
                    
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
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
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Product Support">Product Support</option>
                                <option value="Feedback">Feedback</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Type your message here"
                                rows="4"
                                required
                            ></textarea>
                        </div>



                        <div className="form-button-container">
                            <button type="submit" className="contact-button">Send Message</button>
                        </div>
                    </form>
                </div>

                <div className="alternative-contact">
                    <h2>Alternative Contact Methods</h2>
                    <div className="alternatives-container">
                        <div className="alternative-column">
                            <h3>Support Ticket System</h3>
                            <p>Submit a support ticket for quick assistance</p>
                        </div>
                    </div>
                </div>
                
            </div>
            <Footer/>

        </div>
    );
};

export default ContactUs;