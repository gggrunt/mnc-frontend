import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oppeaiaixlwdodxdvmbm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcGVhaWFpeGx3ZG9keGR2bWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM0Njc4NjAsImV4cCI6MTk3OTA0Mzg2MH0.DdwuQ-IoJxy0dsziV8dl8G0ODoD-PooHMaki3-mUnQU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
