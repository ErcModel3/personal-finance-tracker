import React, { useState } from 'react';
import './ContactUs.css'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import supabaseClient from "../auth/Client.js";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Subject: '',
        Message: '',
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

        const dataToSubmit = {
            ...formData,
            Subject: formData.Subject || 'General Inquiry'
        }
        alert('Message sent! We will get back to you soon.');
        //assuming we had real customer support and an email address to send messages to, we would do error and data checking, because this is proof of concept, I have not added this here.
        const {data, error} = await supabaseClient.from('Contact_Us').insert(dataToSubmit);
        if (error) console.log(error);
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
                            <label htmlFor="Name">Name</label>
                            <input
                                type="text"
                                id="Name"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Email">Email</label>
                            <input
                                type="Email"
                                id="Email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Subject">Subject</label>
                            <select
                                id="Subject"
                                name="Subject"
                                value={formData.Subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Product Support">Product Support</option>
                                <option value="Feedback">Feedback</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="Message">Message</label>
                            <textarea
                                id="Message"
                                name="Message"
                                value={formData.Message}
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