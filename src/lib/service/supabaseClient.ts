// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amwevrbmgmyiqzqupcps.supabase.co'; // deine URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtd2V2cmJtZ215aXF6cXVwY3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDk0MDEsImV4cCI6MjA2NzM4NTQwMX0.WsOmvuv3han55jmA5h3Gg3xCH5pK4Ytwa97kQnes7Lk'; // dein Public Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


