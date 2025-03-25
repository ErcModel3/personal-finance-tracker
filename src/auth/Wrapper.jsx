import {useEffect, useState} from "react";
import supabaseClient from "./Client.js";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Wrapper({children}) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const {
                data:{ session },
            } = await supabaseClient.auth.getSession();
            setAuthenticated(!!session);
            setLoading(false);
        };

        getSession();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    } else {
        if (authenticated) {
            return <>{children}</>
        }
        return <Navigate to="/signin"/>
    }
}

export default Wrapper;