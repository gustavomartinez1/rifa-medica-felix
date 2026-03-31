import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/config/env';

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL || 'https://cnboqpyjefjytxxxmykr.supabase.co',
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibmJvcHlqZWZqeXR4eHhta3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjI3NDAsImV4cCI6MjA1MzYzODc0MH0.GJK3uK6l4cTfXvxHoIJSXU9K4d2LqEyJvK8h9hXqT3w'
  );
}