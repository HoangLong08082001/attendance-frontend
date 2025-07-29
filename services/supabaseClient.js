import { createClient } from "@supabase/supabase-js";

// Thay đổi các giá trị này với URL và API Key của bạn
const supabaseUrl = "https://pphchvgvfseolzagraet.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaGNodmd2ZnNlb2x6YWdyYWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MTg0MDQsImV4cCI6MjA0NDk5NDQwNH0.5mq0WN3ehGdiJpZGst32MBi6QJ5WxJffm0b1971vwYI";

// Khởi tạo Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
