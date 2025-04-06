import supabaseClient from "./Client.js";

async function getSessionID() {
    const {data: {session}, error: sessionError} = await supabaseClient.auth.getSession();            
    if (sessionError) {
        console.log('Session error:', sessionError);
        return;
    }

    if (!session) {
        console.log('No active session found');
        return;
    }
    console.log("User ID:", session.user.id);
    return session.user.id;
}

const userID = getSessionID();

export default userID;