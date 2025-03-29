import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Using the supabase client to grab user information to add a card
export let addBankCard = async (bankName) => {
    try {
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabaseClient
            .from('Bank_Cards')
            .insert([{ User_id: user.id, Bank_name: bankName }])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error adding bank card:", error);
        throw error;
    }
};

export default supabaseClient;