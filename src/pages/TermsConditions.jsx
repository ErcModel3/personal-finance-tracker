import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const TermsConditions = () => {
    return (
        <div>
            <Navbar />
            <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                <h1 style={{fontSize: '2.5rem', fontWeight: 700, color: '#333', marginBottom: '0.5rem'}}>Terms and Conditions</h1>
                <p style={{fontSize: '1rem', color: '#666', margin: '0.25rem 0'}}>Last Updated: March 20, 2025</p>
                
                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>1. Introduction</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        These Terms and Conditions govern the access to and use of the FinTrack application, 
                        website, and services. By accessing or using the Service, users 
                        agree to be bound by these Terms.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>2. Definitions</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem'}}>
                        <strong>FinTrack</strong>: The budgeting and financial tracking application operated by FinTrack, Inc.
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem'}}>
                        <strong>User</strong>: Any individual who accesses or uses the Service.
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem'}}>
                        <strong>Content</strong>: All information, text, data, graphics, features, and materials available on or through the Service.
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem'}}>
                        <strong>Account</strong>: The registered user profile created to access and use the Service.
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem'}}>
                        <strong>Financial Data</strong>: Any financial information imported, entered, or generated through the Service.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>3. Account Registration and Security</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Users must provide accurate, current, and complete information during registration.
                        Users are responsible for maintaining the confidentiality of account credentials.
                        Users must immediately notify FinTrack of any unauthorized use of accounts or security breaches.
                        FinTrack reserves the right to refuse service, terminate accounts, or remove content at its discretion.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>4. Service License and Restrictions</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack grants users a limited, non-exclusive, non-transferable, revocable license to access and use 
                        the Service for personal financial management. Users may not:
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem'}}>
                        Use the Service for any illegal purpose or in violation of any laws.
                        Access the Service through automated means without express permission.
                        Attempt to interfere with or compromise the system integrity or security.
                        Sublicense, sell, rent, lease, or transfer access to the Service.
                        Copy, modify, reproduce, or create derivative works of the Service or its content.
                        Decompile, reverse engineer, or disassemble the Service or its software.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>5. Financial Institution Connections</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack may offer the option to connect with financial institutions to import transaction data.
                        FinTrack is not responsible for any issues arising from connections with third-party financial institutions.
                        Users authorize FinTrack to access financial account information when such connections are established.
                        FinTrack does not own or control third-party financial services connected through the Service.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>6. Financial Advice Disclaimer</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack provides tools for financial management but does not offer professional financial advice.
                        The Service is not intended to replace the advice of qualified financial professionals.
                        Users should consult with qualified professionals regarding specific financial situations.
                        FinTrack makes no guarantees regarding financial outcomes from using the Service.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>7. Subscription and Billing</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Access to certain features may require payment of subscription fees.
                        Subscription terms, pricing, and billing cycles will be disclosed before purchase.
                        Subscriptions automatically renew until canceled by the user.
                        Refunds are provided in accordance with the refund policy outlined in the application.
                        FinTrack reserves the right to change pricing with appropriate notice to users.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>8. Data Handling and Privacy</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack's collection and use of personal information is governed by the Privacy Policy.
                        FinTrack may anonymize and aggregate user data for service improvement and analytics.
                        Upon account termination, FinTrack may retain certain information as required by law or for legitimate business purposes.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>9. Intellectual Property</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        The Service, including all content, features, and functionality, is owned by FinTrack and protected by intellectual property laws.
                        Trademarks, logos, and service marks displayed on the Service are the property of FinTrack or its licensors.
                        User feedback or suggestions about the Service may be used without obligation to the user.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>10. User Content</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Users retain ownership of data entered into the Service.
                        Users grant FinTrack a license to use, store, and process user content for the purpose of providing the Service.
                        FinTrack is not responsible for the accuracy of user-supplied content.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>11. Limitation of Liability</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        To the maximum extent permitted by law, FinTrack shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                        FinTrack's total liability shall not exceed the amount paid by the user for the Service in the 12 months preceding the claim.
                        The Service is provided "as is" without warranties of any kind, either express or implied.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>12. Indemnification</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Users agree to indemnify, defend, and hold harmless FinTrack from and against any claims, liabilities, damages, 
                        losses, costs, expenses, or fees arising from:
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        User's violation of these Terms.
                        User's use of the Service.
                        User's violation of rights of a third party.
                        User's violation of applicable laws or regulations.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>13. Modification of Terms</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        FinTrack reserves the right to modify these Terms at any time.
                        Users will be notified of significant changes to the Terms.
                        Continued use of the Service after changes constitutes acceptance of the modified Terms.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>14. Termination</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Users may terminate accounts at any time by following the instructions in the Service.
                        FinTrack may terminate or suspend access to the Service immediately without notice for violations of these Terms.
                        Upon termination, certain provisions of these Terms will survive.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>15. Governing Law</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        These Terms shall be governed by and construed in accordance with the laws of United Kingdom, 
                        without regard to its conflict of law provisions.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>16. Dispute Resolution</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Any dispute arising from these Terms shall be resolved through:
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Informal negotiation as the first step.
                        Mediation if negotiation fails.
                        Binding arbitration if mediation is unsuccessful.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>17. General Provisions</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        These Terms constitute the entire agreement between users and FinTrack regarding the Service.
                        If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect.
                        No waiver of any term shall be deemed a further or continuing waiver of such term or any other term.
                        Users may not assign these Terms without prior written consent from FinTrack.
                    </p>
                </div>

                <div style={{marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem', marginTop: '2rem'}}>18. Contact Information</h2>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        For questions about these Terms, please contact:
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem'}}>
                        Email: legal@fintrack.com
                    </p>
                    <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                        Contact form available on the Contact Us page
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsConditions;