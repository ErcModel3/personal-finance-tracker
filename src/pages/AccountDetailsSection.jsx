import React, { useState, useEffect } from "react";
import styles from "../Features/AccountDetailsComponents/Settings.module.css";
import AccountDetail from "../Features/AccountDetailsComponents/AccountDetail.jsx";
import supabaseClient from "../auth/Client.js";
import userID from "../auth/SessionData.js";

function AccountDetailsSection() {
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await userID;
                console.log('Fetching user data for ID:', userId);

                // Get the authenticated user
                const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
                
                if (authError) {
                    console.error('Auth User Fetch Error:', authError);
                }

                // Fetch from profiles table
                const { data, error } = await supabaseClient
                    .from('profiles')
                    .select('email, fullName')
                    .eq('id', userId)
                    .single();

                console.log('Profiles Table Fetch Result:', { data, error });

                if (error) {
                    console.error('Profiles Fetch Error:', error);
                    setUserData({
                        email: user?.email || 'Error fetching email',
                        username: user?.id || userId
                    });
                } else {
                    setUserData({
                        email: data.email || user?.email || 'No email found',
                        username: data.fullName || user?.id || userId
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Exception while fetching user data:', error);
                setUserData({
                    email: 'Error fetching email',
                    username: userId || 'Error fetching username'
                });
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handlePasswordChangeClick = () => {
        setShowPasswordChange(!showPasswordChange);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordChangeError(null);

        if (!newPassword) {
            setPasswordChangeError('Please enter a new password');
            return;
        }

        try {
            // Update password using Supabase Auth
            const { error } = await supabaseClient.auth.updateUser({
                password: newPassword
            });

            if (error) {
                setPasswordChangeError(error.message);
                return;
            }

            // Success
            alert('Password updated successfully');
            setShowPasswordChange(false);
            setNewPassword('');
        } catch (error) {
            setPasswordChangeError('An unexpected error occurred');
            console.error('Password change error:', error);
        }
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Account Details</h2>
            <div className={styles.cardGrid}>
                <AccountDetail
                    title="Username"
                    value={loading ? 'Loading...' : userData.username}
                />
                <AccountDetail
                    title="Email"
                    value={loading ? 'Loading...' : userData.email}
                />
                <AccountDetail
                    title="Password Management"
                    value={
                        <>
                            <button
                                className={styles.passwordChangeButton}
                                onClick={handlePasswordChangeClick}
                            >
                                {showPasswordChange ? 'Cancel' : 'Change Password'}
                            </button>
                            {showPasswordChange && (
                                <form onSubmit={handlePasswordSubmit} className={styles.passwordChangeForm}>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={styles.passwordInput}
                                        required
                                    />
                                    <button type="submit" className={styles.submitPasswordButton}>
                                        Update Password
                                    </button>
                                    {passwordChangeError && (
                                        <div className={styles.errorMessage}>
                                            {passwordChangeError}
                                        </div>
                                    )}
                                </form>
                            )}
                        </>
                    }
                />
            </div>
        </section>
    );
}

export default AccountDetailsSection;