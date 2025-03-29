import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const PrivacyPolicy = () => {
    return (
        <div>
            <Navbar />
            <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                <h1 style={{fontSize: '2.5rem', fontWeight: 700, color: '#333', marginBottom: '0.5rem'}}>Privacy Policy</h1>
                <p style={{fontSize: '1rem', color: '#666', margin: '0.25rem 0'}}>Last Updated: March 20, 2025</p>
                
                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Introduction</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Welcome to FinTrack. FinTrack understands the importance of personal and financial information 
                        and is committed to protecting user privacy. This Privacy Policy explains how FinTrack collects, 
                        uses, discloses, and safeguards information when users interact with the budgeting application.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Information FinTrack Collects</h2>
                    
                    <h3 style={{fontSize: '1.2rem', fontWeight: 600, color: '#333', margin: '1rem 0 0.5rem 0'}}>Personal Information</h3>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Account Information: Name, email address, username, and password. Profile Information: Optional profile 
                        picture and preferences. Contact Information: Information submitted when contacting support.
                    </p>

                    <h3 style={{fontSize: '1.2rem', fontWeight: 600, color: '#333', margin: '1rem 0 0.5rem 0'}}>Financial Information</h3>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Transaction Data: Financial transactions and spending habits users choose to import or enter. Account 
                        Connections: Information required to connect to financial institutions. Budget Goals: Financial goals and 
                        budget categories set by users.
                    </p>

                    <h3 style={{fontSize: '1.2rem', fontWeight: 600, color: '#333', margin: '1rem 0 0.5rem 0'}}>Technical Information</h3>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Device Information: Device type, operating system, and unique device identifiers. Usage Data: How users 
                        interact with the app, features used, and time spent. Location Information: General location based on IP 
                        address (not precise GPS location).
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>How Information Is Used</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        To provide, maintain, and improve budgeting services. To process and display financial information in 
                        meaningful ways. To send important notifications about accounts or budgets. To respond to inquiries and 
                        provide customer support. To detect, prevent, and address technical issues and security threats. To better 
                        understand user behavior and optimize features.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Data Security</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack implements a variety of security measures to maintain the safety of personal information:
                        Encryption of sensitive data both in transit and at rest. Regular security assessments and penetration testing.
                        Strict access controls for employees. Industry-standard authentication protocols. Regular data backups and 
                        disaster recovery planning.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Data Sharing and Disclosure</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack does not sell personal or financial data. Information may be shared with: Service Providers: 
                        Third-party vendors who help operate services (e.g., cloud hosting, analytics). Financial Institutions: 
                        As necessary to connect accounts (with explicit permission). Legal Requirements: When required by law, 
                        legal process, or to protect rights.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Privacy Rights and Choices</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Users can: Access, correct, or delete personal information. Opt out of marketing communications. Choose 
                        which financial accounts to connect. Enable or disable optional features that collect additional information.
                        Close accounts and have data deleted (subject to legal retention requirements).
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Data Retention</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Information is kept for as long as accounts are active or as needed to provide services. 
                        Information will be retained and used as necessary to comply with legal obligations, resolve 
                        disputes, and enforce agreements.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Children's Privacy</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack services are not directed to children under 16. Personal information is not knowingly 
                        collected from children under 16. If there is reason to believe information has been inadvertently 
                        collected from a child, please contact FinTrack immediately.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>International Data Transfers</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Information may be transferred to and processed in countries other than the user's country of residence. 
                        These countries may have different data protection laws. Appropriate safeguards are in place to protect information.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Changes to This Privacy Policy</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        This Privacy Policy may be updated from time to time. Users will be notified of any changes by posting 
                        the new policy on this page and updating the "Last Updated" date. Regular review of this Privacy Policy is encouraged.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Contact Information</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        For questions about this Privacy Policy, please contact:
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Email: privacy@fintrack.com
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Contact form available on the Contact Us page
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>Additional Information for Specific Regions</h2>
                    
                    <h3 style={{fontSize: '1.2rem', fontWeight: 600, color: '#333', margin: '1rem 0 0.5rem 0'}}>California Residents</h3>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Under the California Consumer Privacy Act (CCPA), California residents have specific rights 
                        regarding their personal information.
                    </p>
                    
                    <h3 style={{fontSize: '1.2rem', fontWeight: 600, color: '#333', margin: '1rem 0 0.5rem 0'}}>European Economic Area Residents</h3>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        If in the European Economic Area, users have rights under the General Data Protection Regulation (GDPR), 
                        including the right to access, correct, delete, restrict processing, and data portability.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;