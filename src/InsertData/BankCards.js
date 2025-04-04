import supabaseClient from "../auth/Client.js";
import {useNavigate} from "react-router-dom";

let addBankCard = async (bankName) => {
    try {
        const navigate = useNavigate();
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError) {
            console.log(sessionError);
            navigate('/')
            return;
        }

        if (!session) {
            console.log('No active session found');
            navigate('/')
            return;
        }

        const { data, error } = await supabaseClient
            .from('Bank_Cards')
            .insert([
                { User_id: session.user.id },
                { Bank_name: bankName },
            ])
            .select()
    } catch (error) {
        console.error("Error adding bank card:", error);
        throw error;
    }
};

export default addBankCard;