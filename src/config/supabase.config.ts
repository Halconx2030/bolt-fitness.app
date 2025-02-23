export const supabaseConfig = {
  projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!,
  apiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  jwtSecret: process.env.SUPABASE_JWT_SECRET!,
  dbPassword: process.env.SUPABASE_DB_PASSWORD!
};

export const supabaseTables = {
  users: 'users',
  exercises: 'exercises',
  comments: 'comments',
  progress: 'progress',
  achievements: 'achievements',
  notifications: 'notifications',
  activity: 'activity'
}; 