import React, { useState, useEffect } from 'react';
import supabaseClient from "../auth/Client.js";

const Dashboard = () => {
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            // Get the current session
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

            if (sessionError || !session) {
                setLoading(false);
                return;
            }

            // Query the profiles table using the user ID from the session
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('fullName')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.log('Error fetching profile:', error);
                setLoading(false);
                return;
            }

            setFullName(data.fullName || '');
            setLoading(false);
        };

        fetchUserProfile();
    }, []); // Empty dependency array ensures this only runs once on component mount

    return (
        <div>
            <h1>Welcome {loading ? 'Loading...' : fullName}</h1>
        </div>
    );
};

export default Dashboard;