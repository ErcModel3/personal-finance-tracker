import React, { useState, useEffect } from 'react';
import supabaseClient from "../auth/Client.js";

const Dashboard = () => {
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("useEffect running");

        const fetchUserProfile = async () => {
            console.log("Fetching user profile...");

            // Get the current session
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

            if (sessionError) {
                console.log('Session error:', sessionError);
                setLoading(false);
                return;
            }

            if (!session) {
                console.log('No active session found');
                setLoading(false);
                return;
            }

            console.log("User ID:", session.user.id);

            // Query the profiles table using the user ID from the session
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*') // Select all columns to see what's available
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.log('Profile fetch error:', error);
                setLoading(false);
                return;
            }

            console.log("Profile data received:", data);

            // Check if the data has a fullName property
            if (data && 'fullName' in data) {
                console.log("Setting fullName to:", data.fullName);
                setFullName(data.fullName || '');
            } else if (data && 'full_name' in data) {
                console.log("Setting fullName to:", data.full_name);
                setFullName(data.full_name || '');
            } else {
                console.log("No fullName or full_name property found in:", data);
                setFullName('User');
            }

            setLoading(false);
        };

        fetchUserProfile();
    }, []);

    console.log("Rendering with fullName:", fullName);

    return (
        <div>
            <h1>Welcome {loading ? 'Loading...' : `${fullName}`}</h1>
        </div>
    );
};

export default Dashboard;