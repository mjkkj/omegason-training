import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://kbjapornenqfkzckxpmb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiamFwb3JuZW5xZmt6Y2t4cG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTQwNTIsImV4cCI6MjA5NjUzMDA1Mn0.ZAiE5-8PH46F2p03IlD00EYkjUXSrRkabtjKQJHLCfA'
)
