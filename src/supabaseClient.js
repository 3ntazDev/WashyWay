// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// استخدم الـ URL و الـ anon key الخاصين بك من لوحة تحكم Supabase
const supabaseUrl = 'https://qrqimruoxpxbhngvntop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycWltcnVveHB4YmhuZ3ZudG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTM4NjAsImV4cCI6MjA1NzM4OTg2MH0.5531yE17NU3HWIJuSW_HltTCIzjApnn9jpv0M2Oezl8';


export const supabase = createClient(supabaseUrl, supabaseKey);
;
