import {createClient} from "@supabase/supabase-js";


//this needs to be put in env file and extracted, im tryna get this shit to work so i cba rn.
const supabaseurl = "https://mkukclxfhqunsipctzto.supabase.co"
const supabaseanonkey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdWtjbHhmaHF1bnNpcGN0enRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMDM5NTksImV4cCI6MjA1NjY3OTk1OX0.XqWKEXm-YYkNT-y830AjcfYuClvQcVV8CJrgS2f9Eg4";

//restful endpoint to establish connection
const supabaseClient = createClient(supabaseurl, supabaseanonkey);

export default supabaseClient;