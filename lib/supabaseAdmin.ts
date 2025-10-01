import { createClient } from '@supabase/supabase-js'

/**
 * Supabase admin client for server-side usage ONLY
 * Uses the service_role key and bypasses Row Level Security (RLS)
 * 
 * ⚠️  CRITICAL: This client MUST only be used in:
 * - Next.js API routes (/api/*)
 * - Server components
 * - Edge functions
 * - Server-side code
 * 
 * ❌ NEVER import this in client-side components or browser code
 * ❌ NEVER expose the service_role key to the frontend
 * 
 * Usage examples:
 * 
 * // In API route: app/api/confessions/route.ts
 * import { supabaseAdmin } from '@/lib/supabaseAdmin'
 * 
 * export async function POST(request: NextRequest) {
 *   const { data, error } = await supabaseAdmin
 *     .from('confessions')
 *     .insert([{ content: 'New confession' }])
 *     .select()
 *     .single()
 * }
 * 
 * // In server component
 * import { supabaseAdmin } from '@/lib/supabaseAdmin'
 * 
 * export default async function ServerComponent() {
 *   const { data } = await supabaseAdmin
 *     .from('confessions')
 *     .select('*')
 *     .order('created_at', { ascending: false })
 *     .limit(10)
 * }
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

