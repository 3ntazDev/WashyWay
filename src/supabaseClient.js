// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// استخدم الـ URL و الـ anon key الخاصين بك من لوحة تحكم Supabase
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
